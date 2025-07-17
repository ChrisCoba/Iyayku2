const pool = require('../db');
const bcrypt = require('bcryptjs');

async function listarUsuarios() {
  const { rows } = await pool.query('SELECT id, nombre, correo FROM usuarios ORDER BY id');
  return rows;
}

async function actualizarUsuario(id, { nombre, correo, contrasena }) {
  let query = 'UPDATE usuarios SET nombre = $1, correo = $2';
  let params = [nombre, correo, id];

  if (contrasena) {
    const hash = bcrypt.hashSync(contrasena, 10);
    query = 'UPDATE usuarios SET nombre = $1, correo = $2, "contraseña" = $3 WHERE id = $4';
    params = [nombre, correo, hash, id];
  } else {
    query += ' WHERE id = $3';
  }

  await pool.query(query, params);
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
};
