const pool = require('../db');

async function listarServiciosActivos() {
  const { rows } = await pool.query('SELECT * FROM servicios WHERE activo = TRUE ORDER BY orden, id');
  return rows;
}

async function crearServicio({ nombre, descripcion, precio, orden = 0 }) {
  await pool.query(
    'INSERT INTO servicios (nombre, descripcion, precio, orden) VALUES ($1, $2, $3, $4)',
    [nombre, descripcion, precio, orden]
  );
}

async function actualizarServicio(id, { nombre, descripcion, precio, activo, orden = 0 }) {
  await pool.query(
    'UPDATE servicios SET nombre=$1, descripcion=$2, precio=$3, activo=$4, orden=$5 WHERE id=$6',
    [nombre, descripcion, precio, activo, orden, id]
  );
}

async function eliminarServicio(id) {
  await pool.query('DELETE FROM servicios WHERE id=$1', [id]);
}

module.exports = {
  listarServiciosActivos,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
