// controllers/serviciosController.js
const Servicio = require('./models/servicio');

// Obtener todos los servicios activos
exports.getServiciosActivos = async (req, res) => {
  try {
    const servicios = await Servicio.findAllActivos();
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios activos:', error);
    res.status(500).json({ message: 'Error del servidor al obtener servicios' });
  }
};

// Obtener un servicio por ID
exports.getServicioById = async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio por ID:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Crear un nuevo servicio
exports.createServicio = async (req, res) => {
  try {
    const nuevoServicio = await Servicio.create(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error del servidor al crear servicio' });
  }
};

// Actualizar un servicio existente
exports.updateServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const servicioActualizado = await Servicio.update(id, req.body);
    if (!servicioActualizado) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(servicioActualizado);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar servicio' });
  }
};

// Eliminar un servicio
exports.deleteServicio = async (req, res) => {
  const { id } = req.params;
  try {
    await Servicio.delete(id);
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar servicio' });
  }
};
