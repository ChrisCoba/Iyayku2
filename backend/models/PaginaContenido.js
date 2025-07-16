// models/PaginaContenido.js
const db = require('../src/index.js');

// Modelo adaptado para el proyecto
const PaginaContenido = {
  // Obtiene todas las secciones de una página ordenadas
  findAllByPagina: async (pagina) => {
    const result = await db.query(
      'SELECT id, pagina, seccion, titulo, contenido, orden FROM paginas_contenido WHERE pagina = $1 ORDER BY orden ASC',
      [pagina]
    );
    return result.rows;
  },

  // Obtiene una sección específica de una página
  findBySeccion: async (pagina, seccion) => {
    const result = await db.query(
      'SELECT id, pagina, seccion, titulo, contenido, orden FROM paginas_contenido WHERE pagina = $1 AND seccion = $2 LIMIT 1',
      [pagina, seccion]
    );
    return result.rows[0];
  },

  // Obtiene por ID
  findById: async (id) => {
    const result = await db.query(
      'SELECT id, pagina, seccion, titulo, contenido, orden FROM paginas_contenido WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0];
  },

  // Crear nueva sección
  create: async (data) => {
    const { pagina, seccion, titulo, contenido, orden } = data;
    const result = await db.query(
      'INSERT INTO paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pagina, seccion, titulo, contenido, orden]
    );
    return result.rows[0];
  },

  // Actualizar sección por ID
  update: async (id, data) => {
    const { pagina, seccion, titulo, contenido, orden } = data;
    const result = await db.query(
      'UPDATE paginas_contenido SET pagina=$1, seccion=$2, titulo=$3, contenido=$4, orden=$5 WHERE id=$6 RETURNING *',
      [pagina, seccion, titulo, contenido, orden, id]
    );
    return result.rows[0];
  },

  // Eliminar sección por ID
  delete: async (id) => {
    await db.query('DELETE FROM paginas_contenido WHERE id = $1', [id]);
    return true;
  }
};

module.exports = PaginaContenido;
