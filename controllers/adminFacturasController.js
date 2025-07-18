const fs = require('fs');
const path = require('path');

// Devuelve la lista de archivos PDF de facturas
function listarFacturasPDF(req, res) {
  const facturasDir = path.join(__dirname, '..', 'public', 'facturas');
  fs.readdir(facturasDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'No se pudieron listar las facturas' });
    }
    // Solo archivos PDF
    const pdfs = files.filter(f => f.endsWith('.pdf'));
    res.json({ pdfs });
  });
}

// Permite descargar un PDF de factura
function descargarFacturaPDF(req, res) {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'public', 'facturas', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ msg: 'Archivo no encontrado' });
  }
  res.download(filePath);
}

module.exports = {
  listarFacturasPDF,
  descargarFacturaPDF
};
