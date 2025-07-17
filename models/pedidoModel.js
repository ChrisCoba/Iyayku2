const db = require('../src/db');

const Pedido = {
  async create({ usuario_id, factura_id, requerimiento, descripcion }) {
    const result = await db.query(
      `INSERT INTO pedidos (usuario_id, factura_id, requerimiento, descripcion, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario_id, factura_id, requerimiento || '', descripcion || '', 'pendiente']
    );
    return result.rows[0];
  },

  async updatePDFs(id, { pdf_requerimiento, pdf_documento }) {
    await db.query(
      `UPDATE pedidos SET pdf_requerimiento=$1, pdf_documento=$2 WHERE id=$3`,
      [pdf_requerimiento, pdf_documento, id]
    );
  },

  async getAll() {
    const result = await db.query('SELECT * FROM pedidos ORDER BY id DESC');
    return result.rows;
  },

  async getByUsuario(usuario_id) {
    const result = await db.query('SELECT * FROM pedidos WHERE usuario_id=$1 ORDER BY id DESC', [usuario_id]);
    return result.rows;
  },

  async subirCorreccion(id, { pdf_correccion, comentarios }) {
    await db.query(
      `UPDATE pedidos SET pdf_correccion=$1, comentarios=$2, estado='corregido' WHERE id=$3`,
      [pdf_correccion, comentarios || '', id]
    );
  }
};

module.exports = Pedido;
