const usuarioModel = require('../models/usuarioModel');

async function listarUsuarios(req, res) {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') {
    return res.status(403).json({ msg: 'Solo el administrador puede ver los usuarios.' });
  }
  try {
    const usuarios = await usuarioModel.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
}

async function actualizarUsuario(req, res) {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') {
    return res.status(403).json({ msg: 'Solo el administrador puede editar usuarios.' });
  }
  const { id } = req.params;
  const { nombre, correo, contrasena } = req.body;

  try {
    await usuarioModel.actualizarUsuario(id, { nombre, correo, contrasena });
    res.json({ msg: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
};
