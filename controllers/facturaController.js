const {
  crearFactura,
  insertarItem,
  obtenerUsuario,
  actualizarPDFUrl
} = require('../models/facturaModel');
const { generarFacturaPDF } = require('../src/pdfFactura');

const crearNuevaFactura = async (req, res) => {
  const { items, total } = req.body;
  const usuario_id = req.user.id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'No hay items en la factura.' });
  }

  try {
    const { id: facturaId, fecha } = await crearFactura(usuario_id, total);

    for (const item of items) {
      await insertarItem(facturaId, item);
    }

    const usuario = await obtenerUsuario(usuario_id);
    // Preparar objeto plano para el PDF
    const facturaData = {
      id: facturaId,
      fecha,
      usuario_nombre: usuario.nombre,
      usuario_correo: usuario.correo,
      total
    };
    // Los items deben tener las propiedades que espera el PDF
    const itemsPDF = items.map(item => ({
      servicio_nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));
    const pdfPath = await generarFacturaPDF(facturaData, itemsPDF);
    // Convertir a ruta pública
    const pdfUrl = '/facturas/' + pdfPath.split('facturas').pop().replace(/\\/g, '/').replace(/^\//, '');
    res.json({ msg: 'Factura generada', facturaId, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar factura' });
  }
};

module.exports = {
  crearNuevaFactura
};
