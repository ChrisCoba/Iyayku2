// src/pdfFactura.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarFacturaPDF({ facturaId, usuario, items, total, fecha }) {
  const publicDir = path.join(__dirname, '..', 'public', 'facturas');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const filePath = path.join(publicDir, `factura-${facturaId}.pdf`);

  const doc = new PDFDocument({ size: 'A5', margin: 30 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('Factura', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Factura N°: ${facturaId}`);
  doc.text(`Cliente: ${usuario.nombre} (${usuario.correo})`);
  doc.text(`Fecha: ${fecha}`);
  doc.moveDown();

  doc.fontSize(13).text('Servicios:', { underline: true });
  items.forEach(item => {
    doc.text(`- ${item.nombre} x${item.cantidad}  $${(item.precio * item.cantidad).toFixed(2)}`);
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: 'right' });

  doc.end();
  return `/facturas/factura-${facturaId}.pdf`;
}

module.exports = { generarFacturaPDF };
