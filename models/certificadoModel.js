const pool = require('../db');

// Buscar publicaciones por nombre de autor
async function buscarCertificadosPorNombre(nombre) {
  const query = `
    SELECT p.id, p.titulo, u.nombre AS autor
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE u.nombre ILIKE $1
  `;
  const { rows } = await pool.query(query, [`%${nombre}%`]);
  return rows;
}

// Agregar certificado
async function agregarCertificado({ autor_nombre, articulo_titulo, articulo_url, publicacion_id }) {
  const query = `
    INSERT INTO certificados (autor_nombre, articulo_titulo, articulo_url, publicacion_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  `;
  const values = [autor_nombre, articulo_titulo, articulo_url, publicacion_id || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Obtener todos los certificados
async function obtenerTodosCertificados() {
  const { rows } = await pool.query('SELECT * FROM certificados ORDER BY fecha_emision DESC');
  return rows;
}

// Eliminar certificado
async function eliminarCertificado(id) {
  const result = await pool.query('DELETE FROM certificados WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  buscarCertificadosPorNombre,
  agregarCertificado,
  obtenerTodosCertificados,
  eliminarCertificado
};
