const servicioModel = require('../models/servicioModel');

function esAdmin(req) {
  return req.user && req.user.correo === 'admin@iyayku.com';
}

async function listarServicios(req, res) {
  try {
    const servicios = await servicioModel.listarServiciosActivos();
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener servicios' });
  }
}

async function crearServicio(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede agregar servicios.' });

  // Validar que el precio no sea negativo
  if (req.body.precio && req.body.precio < 0) {
    return res.status(400).json({ msg: 'El precio no puede ser negativo' });
  }

  try {
    await servicioModel.crearServicio(req.body);
    res.json({ msg: 'Servicio creado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear servicio' });
  }
}

async function actualizarServicio(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede editar servicios.' });

  const { id } = req.params;

  // Validar que el precio no sea negativo
  if (req.body.precio && req.body.precio < 0) {
    return res.status(400).json({ msg: 'El precio no puede ser negativo' });
  }

  try {
    await servicioModel.actualizarServicio(id, req.body);
    res.json({ msg: 'Servicio actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar servicio' });
  }
}

async function eliminarServicio(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede eliminar servicios.' });

  const { id } = req.params;

  try {
    await servicioModel.eliminarServicio(id);
    res.json({ msg: 'Servicio eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar servicio' });
  }
}

module.exports = {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
