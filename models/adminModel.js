const pool = require('../src/db');

async function listarCertificados() {
  const { rows } = await pool.query('SELECT * FROM certificados ORDER BY fecha_emision DESC');
  return rows;
}

async function listarFacturas() {
  const { rows } = await pool.query(`
    SELECT f.*, u.nombre AS usuario_nombre, u.correo AS usuario_correo
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    ORDER BY f.fecha DESC
  `);

  return rows.map(f => ({
    ...f,
    pdfUrl: `/facturas/factura-${f.id}.pdf`
  }));
}

module.exports = {
  listarCertificados,
  listarFacturas,
};
