// models/Servicio.js
// Usa la ruta correcta para la base de datos
const db = require('../../src/index');

const Servicio = {
  // Obtiene todos los servicios activos ordenados
  findAllActivos: async () => {
    const result = await db.query(
      'SELECT id, nombre, descripcion, precio, activo, orden FROM servicios WHERE activo = TRUE ORDER BY orden ASC'
    );
    return result.rows;
  },

  // Obtiene un servicio por ID
  findById: async (id) => {
    const result = await db.query(
      'SELECT id, nombre, descripcion, precio, activo, orden FROM servicios WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0];
  },

  // Crear nuevo servicio
  create: async (data) => {
    const { nombre, descripcion, precio, activo, orden } = data;
    const result = await db.query(
      'INSERT INTO servicios (nombre, descripcion, precio, activo, orden) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio, activo, orden]
    );
    return result.rows[0];
  },

  // Actualizar servicio por ID
  update: async (id, data) => {
    const { nombre, descripcion, precio, activo, orden } = data;
    const result = await db.query(
      'UPDATE servicios SET nombre=$1, descripcion=$2, precio=$3, activo=$4, orden=$5 WHERE id=$6 RETURNING *',
      [nombre, descripcion, precio, activo, orden, id]
    );
    return result.rows[0];
  },

  // Eliminar servicio por ID
  delete: async (id) => {
    await db.query('DELETE FROM servicios WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Servicio;