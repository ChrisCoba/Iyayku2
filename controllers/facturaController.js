const {
  crearFactura,
  insertarItem,
  obtenerUsuario,
  actualizarPDFUrl
} = require('../models/facturaModel');
const generarFacturaPDF = require('../utils/generarFacturaPDF'); // Asegúrate de tener esto

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
    const pdfUrl = generarFacturaPDF({ facturaId, usuario, items, total, fecha });

    await actualizarPDFUrl(facturaId, pdfUrl);

    res.json({ msg: 'Factura generada', facturaId, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar factura' });
  }
};

module.exports = {
  crearNuevaFactura
};
