const pool = require('../src/db');
const path = require('path');
const fs = require('fs');

// Devuelve la lista de facturas con usuario, correo, total, fecha y nombre de PDF
async function listarFacturasDB(req, res) {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') {
    return res.status(403).json({ msg: 'No autorizado' });
  }
  // Buscar archivos PDF
  const facturasDir = path.join(__dirname, '..', 'public', 'facturas');
  let pdfs = [];
  try {
    pdfs = fs.readdirSync(facturasDir).filter(f => f.endsWith('.pdf'));
  } catch (e) {}
  // Buscar facturas en la base
  const { rows } = await pool.query(`
    SELECT f.id, f.fecha, f.total, u.nombre, u.correo
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    ORDER BY f.fecha DESC
  `);
  // Relacionar con PDF
  const facturas = rows.map(f => {
    const pdf = pdfs.find(p => p.includes(`factura-${f.id}`));
    return { ...f, pdf };
  });
  res.json(facturas);
}

module.exports = { listarFacturasDB };
