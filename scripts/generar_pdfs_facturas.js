// Script para generar PDFs faltantes de facturas
// Ejecutar con: node scripts/generar_pdfs_facturas.js

const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { generarFacturaPDF } = require('../src/pdfFactura');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/iyayku'
});

async function main() {
  const { rows: facturas } = await pool.query('SELECT * FROM facturas');
  for (const f of facturas) {
    const pdfPath = path.join(__dirname, '..', 'public', 'facturas', `factura-${f.id}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      // Buscar usuario
      const { rows: usuarios } = await pool.query('SELECT nombre, correo FROM usuarios WHERE id = $1', [f.usuario_id]);
      const usuario = usuarios[0] || { nombre: '', correo: '' };
      // Buscar items
      let items = [];
      try {
        items = JSON.parse(f.items);
      } catch {
        items = [];
      }
      // Generar PDF
      console.log('Generando PDF para factura', f.id);
      generarFacturaPDF({
        facturaId: f.id,
        usuario,
        items,
        total: f.total,
        fecha: f.fecha
      });
    }
  }
  await pool.end();
  console.log('Listo. PDFs generados donde faltaban.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
