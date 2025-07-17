const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pedidosDir = path.join(__dirname, '..', 'public', 'pedidos');
if (!fs.existsSync(pedidosDir)) fs.mkdirSync(pedidosDir, { recursive: true });

const storagePedidos = multer.diskStorage({
  destination: pedidosDir,
  filename: (req, file, cb) => {
    const pedidoId = req.body.pedidoId || req.params.pedidoId || 'tmp';
    const tipo = file.fieldname;
    cb(null, `pedido-${pedidoId}-${tipo}.pdf`);
  }
});

module.exports = multer({
  storage: storagePedidos,
  limits: { fileSize: 10 * 1024 * 1024 }
});
