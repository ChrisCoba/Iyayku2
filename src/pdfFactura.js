const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera y guarda un PDF de factura
 * @param {Object} factura - Datos de la factura
 * @param {Array} items - Array de items de la factura
 * @returns {Promise<string>} - Ruta del PDF generado
 */
async function generarFacturaPDF(factura, items = []) {
  const pdfDir = path.join(__dirname, '..', 'public', 'facturas');
  await fs.promises.mkdir(pdfDir, { recursive: true });
  const pdfPath = path.join(pdfDir, `factura-${factura.id}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

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
    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', reject);
  });
}

module.exports = { generarFacturaPDF };
