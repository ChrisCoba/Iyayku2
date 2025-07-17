const pool = require('../src/db');

let paginaHtmlCache = ''; // Cache temporal si quieres, aunque mejor BD.

async function getPaginaHtml() {
  // Aquí ideal sería guardarlo en BD. Por simplicidad:
  return paginaHtmlCache;
}

async function setPaginaHtml(html) {
  paginaHtmlCache = html;
  return true;
}

// Contenido de páginas y secciones
async function obtenerContenido(pagina, seccion) {
  let query = 'SELECT * FROM paginas_contenido WHERE 1=1';
  const params = [];
  if (pagina) {
    params.push(pagina);
    query += ` AND pagina = $${params.length}`;
  }
  if (seccion) {
    params.push(seccion);
    query += ` AND seccion = $${params.length}`;
  }
  query += ' ORDER BY orden, id';

  const { rows } = await pool.query(query, params);
  return rows;
}

async function guardarContenido({ id, pagina, seccion, titulo, contenido, orden }) {
  if (id) {
    await pool.query(
      'UPDATE paginas_contenido SET pagina=$1, seccion=$2, titulo=$3, contenido=$4, orden=$5 WHERE id=$6',
      [pagina, seccion, titulo, contenido, orden || 0, id]
    );
    return { msg: 'Contenido actualizado' };
  } else {
    await pool.query(
      'INSERT INTO paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES ($1,$2,$3,$4,$5)',
      [pagina, seccion, titulo, contenido, orden || 0]
    );
    return { msg: 'Contenido creado' };
  }
}

module.exports = {
  getPaginaHtml,
  setPaginaHtml,
  obtenerContenido,
  guardarContenido,
};
