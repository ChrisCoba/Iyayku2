const pool = require('../db');

const crearFactura = async (usuario_id, total) => {
  const { rows } = await pool.query(
    'INSERT INTO facturas (usuario_id, total) VALUES ($1, $2) RETURNING id, fecha',
    [usuario_id, total]
  );
  return rows[0];
};

const insertarItem = async (facturaId, item) => {
  await pool.query(
    'INSERT INTO factura_items (factura_id, servicio_nombre, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
    [facturaId, item.nombre, item.cantidad, item.precio]
  );
};

const obtenerUsuario = async (usuario_id) => {
  const { rows } = await pool.query(
    'SELECT nombre, correo FROM usuarios WHERE id = $1',
    [usuario_id]
  );
  return rows[0];
};

const actualizarPDFUrl = async (facturaId, pdfUrl) => {
  await pool.query(
    'UPDATE facturas SET pdf_url=$1 WHERE id=$2',
    [pdfUrl, facturaId]
  );
};

module.exports = {
  crearFactura,
  insertarItem,
  obtenerUsuario,
  actualizarPDFUrl
};
