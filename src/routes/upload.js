const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const pool = require('../db');
const auth = require('../middlewares/auth');

const router = express.Router();

// ───── almacenamiento en disco ─────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, '..', '..', 'public', 'articulos')),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage });

// ───── helper para pdf en memoria y a disco ─────
function generarCertificado({ titulo, autor, id, destPath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(destPath);
    doc.pipe(stream);

    doc.fontSize(24).text('CERTIFICADO DE PUBLICACIÓN', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text(`Se certifica que el(la) autor(a):`);
    doc.fontSize(18).text(autor, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Publicó el artículo:`);
    doc.fontSize(16).text(`"${titulo}"`, { align: 'center', italics: true });
    doc.moveDown();
    doc.fontSize(14).text(`ID de publicación: ${id}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown(3);
    doc.fontSize(12).text('____________________________', { align: 'center' });
    doc.text('Dirección Editorial', { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// ───── POST /api/upload ─────
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const { titulo, revista_id } = req.body;
  if (!req.file) return res.status(400).json({ msg: 'Falta el PDF' });

  try {
    // 1. Insertar registro
    const { rows } = await pool.query(
      `INSERT INTO publicaciones (titulo, usuario_id, revista_id, archivo_url)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [titulo, req.user.id, revista_id || null, `/articulos/${req.file.filename}`]
    );
    const pubId = rows[0].id;

    // 2. Generar certificado
    const certName = `cert_${pubId}.pdf`;
    const certPath = path.join(__dirname, '..', '..', 'public', 'certificados', certName);
    await generarCertificado({
      titulo,
      autor: req.user.nombre,
      id: pubId,
      destPath: certPath,
    });

    res.json({ msg: 'Artículo y certificado guardados', id: pubId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error interno' });
  }
});

// ───── GET /api/certificado/:id ─────
router.get('/certificado/:id', async (req, res) => {
  const certPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'certificados',
    `cert_${req.params.id}.pdf`
  );
  if (!fs.existsSync(certPath)) return res.status(404).json({ msg: 'No encontrado' });
  res.download(certPath);
});

module.exports = router;
