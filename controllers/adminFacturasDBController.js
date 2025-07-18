const { generarFacturaPDF } = require('../src/pdfFactura');
const pool = require('../src/db');
// ...existing code...

// Endpoint: Descargar PDF de factura generado en memoria (Railway safe)
async function descargarFacturaPDFMem(req, res) {
  const facturaId = req.params.id;
  // Buscar datos de la factura y usuario
  const { rows } = await pool.query(`
    SELECT f.id, f.fecha, f.total, u.nombre as usuario_nombre, u.correo as usuario_correo
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    WHERE f.id = $1
  `, [facturaId]);
  if (!rows.length) return res.status(404).json({ msg: 'Factura no encontrada' });
  const factura = rows[0];
  // Buscar items
  const { rows: items } = await pool.query(
    'SELECT servicio_nombre, cantidad, precio_unitario FROM factura_items WHERE factura_id = $1',
    [facturaId]
  );
  // Generar PDF en memoria
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  let bufs = [];
  doc.on('data', d => bufs.push(d));
  doc.fontSize(20).text('Factura', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`ID: ${factura.id}`);
  doc.text(`Fecha: ${factura.fecha}`);
  doc.text(`Usuario: ${factura.usuario_nombre || ''}`);
  doc.text(`Correo: ${factura.usuario_correo || ''}`);
  doc.text(`Total: $${factura.total}`);
  doc.moveDown();
  doc.fontSize(14).text('Servicios:', { underline: true });
  items.forEach((item, i) => {
    doc.fontSize(12).text(
      `${i + 1}. ${item.servicio_nombre} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precio_unitario}`
    );
  });
  doc.end();
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(bufs);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${factura.id}.pdf"`);
    res.send(pdfBuffer);
  });
}
// ...existing code...

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
  // Buscar facturas en la base (ahora incluye pdf_url)
  const { rows } = await pool.query(`
    SELECT f.id, f.fecha, f.total, u.nombre, u.correo, f.pdf_url
    FROM facturas f
    LEFT JOIN usuarios u ON f.usuario_id = u.id
    ORDER BY f.fecha DESC
  `);
  // Relacionar con PDF
  const facturas = rows.map(f => {
    let pdf = f.pdf_url;
    if (!pdf) {
      const found = pdfs.find(p => p.includes(`factura-${f.id}`));
      if (found) pdf = '/facturas/' + found;
    }
    return { ...f, pdf };
  });
  res.json(facturas);
}

module.exports = { listarFacturasDB };
module.exports.descargarFacturaPDFMem = descargarFacturaPDFMem;
