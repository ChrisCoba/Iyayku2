const fs = require('fs');
const mime = require('mime-types');
const Multimedia = require('../models/Multimedia');

async function obtenerSVG(req, res) {
  try {
    const nombre = req.params.nombre;
    const filePath = await Multimedia.descargarArchivo(nombre, 'svg');
    res.setHeader('Content-Type', 'image/svg+xml');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'SVG no encontrado' });
  }
}

async function obtenerImagen(req, res) {
  try {
    const nombre = req.params.nombre;
    const filePath = await Multimedia.descargarArchivo(nombre, 'img');
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'Imagen no encontrada' });
  }
}

module.exports = {
  obtenerSVG,
  obtenerImagen
};
