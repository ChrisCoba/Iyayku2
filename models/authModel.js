const pool = require('../db');
const bcrypt = require('bcryptjs');

async function registrarUsuario({ nombre, correo, contrasena }) {
  const hash = bcrypt.hashSync(contrasena, 10);
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, correo, "contraseña") VALUES ($1, $2, $3) RETURNING id, nombre, correo',
      [nombre, correo, hash]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') throw new Error('Correo ya existe');
    throw err;
  }
}

async function obtenerUsuarioPorCorreo(correo) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, "contraseña" FROM usuarios WHERE correo = $1',
    [correo]
  );
  return rows[0];
}

module.exports = {
  registrarUsuario,
  obtenerUsuarioPorCorreo,
};
