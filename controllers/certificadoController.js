const certificadoModel = require('../models/certificadoModel');

// GET /api/certificados
async function buscarCertificados(req, res) {
  const nombre = (req.query.nombre || '').trim();
  if (!nombre) return res.status(400).json({ msg: 'Debes proporcionar un nombre.' });
  try {
    const certificados = await certificadoModel.buscarCertificados(nombre);
    // Convertir ruta absoluta a pública si existe
    certificados.forEach(c => {
      if (c.articulo_url && c.articulo_url.startsWith('/')) return;
      if (c.articulo_url && c.articulo_url.includes('certificados')) {
        c.articulo_url = '/certificados/' + c.articulo_url.split('certificados').pop().replace(/\\/g, '/').replace(/^\//, '');
      }
    });
    res.json(certificados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar los certificados' });
  }
}

// POST /api/certificados
async function crearCertificado(req, res) {
  try {
    const certificado = await certificadoModel.agregarCertificado(req.body);
    res.json({ msg: 'Certificado creado', certificado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear certificado' });
  }
}

// GET /api/certificados-todos
async function obtenerTodos(req, res) {
  try {
    const certificados = await certificadoModel.obtenerTodosCertificados();
    res.json(certificados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar certificados' });
  }
}

// DELETE /api/certificados/:id
async function eliminarPorId(req, res) {
  try {
    const deleted = await certificadoModel.eliminarCertificado(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ msg: 'Certificado no encontrado' });
    }
    res.json({ msg: 'Certificado eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar certificado' });
  }
}

module.exports = {
  buscarCertificados,
  crearCertificado,
  obtenerTodos,
  eliminarPorId
};
