const paginaModel = require('../models/paginaContenidoModel');

function esAdmin(req) {
  return req.user && req.user.correo === 'admin@iyayku.com';
}

async function obtenerPaginaHtml(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo admin' });
  const html = await paginaModel.getPaginaHtml();
  res.json({ html });
}

async function guardarPaginaHtml(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo admin' });
  const { html } = req.body;
  await paginaModel.setPaginaHtml(html);
  res.json({ ok: true });
}

async function obtenerContenido(req, res) {
  const { pagina, seccion } = req.query;
  try {
    const contenido = await paginaModel.obtenerContenido(pagina, seccion);
    res.json(contenido);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener contenido' });
  }
}

async function guardarContenido(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede editar el contenido.' });
  try {
    const resultado = await paginaModel.guardarContenido(req.body);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ msg: 'Error al guardar contenido' });
  }
}

module.exports = {
  obtenerPaginaHtml,
  guardarPaginaHtml,
  obtenerContenido,
  guardarContenido,
};
