require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuración de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // Debes tener esta variable en tu .env
});

/**
 * Sube un certificado PDF a Supabase Storage y guarda la URL en la tabla certificados
 * @param {string} rutaLocalPDF - Ruta local al archivo PDF
 * @param {string} nombreArchivo - Nombre con el que se guardará en el bucket
 * @param {object} datosCertificado - { autor_nombre, articulo_titulo, articulo_url, articulo_pagina, publicacion_id }
 * @returns {Promise<string>} URL pública del certificado
 */
async function subirYRegistrarCertificado(rutaLocalPDF, nombreArchivo, datosCertificado) {
  // 1. Subir a Supabase Storage
  const fileBuffer = fs.readFileSync(rutaLocalPDF);
  const { error: uploadError } = await supabase.storage
    .from('iyayku')
    .upload(`certificados/${nombreArchivo}`, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
  if (uploadError) throw uploadError;

  // 2. Obtener URL pública
  const { data: publicUrlData } = supabase
    .storage
    .from('iyayku')
    .getPublicUrl(`certificados/${nombreArchivo}`);
  const publicUrl = publicUrlData.publicUrl;

  // 3. Guardar en la base de datos
  const query = `INSERT INTO certificados (autor_nombre, articulo_titulo, articulo_url, articulo_pagina, publicacion_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  const values = [
    datosCertificado.autor_nombre,
    datosCertificado.articulo_titulo,
    publicUrl,
    datosCertificado.articulo_pagina,
    datosCertificado.publicacion_id || null
  ];
  const result = await pool.query(query, values);
  return publicUrl;
}

// Ejemplo de uso:
// (async () => {
//   const rutaPDF = path.join(__dirname, 'certificado.pdf');
//   const datos = {
//     autor_nombre: 'Juan Pérez',
//     articulo_titulo: 'Mi Artículo',
//     articulo_url: 'https://miweb.com/articulo.pdf',
//     articulo_pagina: 'https://miweb.com/articulo',
//     publicacion_id: 1
//   };
//   const url = await subirYRegistrarCertificado(rutaPDF, 'certificado-juan.pdf', datos);
//   console.log('Certificado subido y registrado:', url);
// })();

module.exports = { subirYRegistrarCertificado };
