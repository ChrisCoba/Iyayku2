// controllers/paginasContenidoController.js
const PaginaContenido = require('./models/PaginaContenido');

// 🔍 Obtener todas las secciones de una página (ordenadas)
exports.getSeccionesByPagina = async (req, res) => {
  const { pagina } = req.params;
  try {
    const secciones = await PaginaContenido.findAllByPagina(pagina);
    res.json(secciones);
  } catch (error) {
    console.error('Error al obtener secciones de página:', error);
    res.status(500).json({ message: 'Error del servidor al obtener contenido' });
  }
};

// 🔍 Obtener una sección específica de una página
exports.getSeccion = async (req, res) => {
  const { pagina, seccion } = req.params;
  try {
    const seccionData = await PaginaContenido.findBySeccion(pagina, seccion);
    if (!seccionData) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }
    res.json(seccionData);
  } catch (error) {
    console.error('Error al obtener sección específica:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// 🔍 Obtener una sección por ID
exports.getSeccionById = async (req, res) => {
  const { id } = req.params;
  try {
    const seccion = await PaginaContenido.findById(id);
    if (!seccion) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }
    res.json(seccion);
  } catch (error) {
    console.error('Error al obtener sección por ID:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ➕ Crear nueva sección
exports.createSeccion = async (req, res) => {
  try {
    const nuevaSeccion = await PaginaContenido.create(req.body);
    res.status(201).json(nuevaSeccion);
  } catch (error) {
    console.error('Error al crear sección:', error);
    res.status(500).json({ message: 'Error del servidor al crear sección' });
  }
};

// 🔁 Actualizar sección existente
exports.updateSeccion = async (req, res) => {
  const { id } = req.params;
  try {
    const seccionActualizada = await PaginaContenido.update(id, req.body);
    if (!seccionActualizada) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }
    res.json(seccionActualizada);
  } catch (error) {
    console.error('Error al actualizar sección:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar sección' });
  }
};

// ❌ Eliminar sección por ID
exports.deleteSeccion = async (req, res) => {
  const { id } = req.params;
  try {
    await PaginaContenido.delete(id);
    res.json({ message: 'Sección eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar sección:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar sección' });
  }
};
