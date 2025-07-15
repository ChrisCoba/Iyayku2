const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mime = require('mime-types'); // npm i mime-types

// SVGs
const svgUrls = {
  facebook: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//facebook_icon.svg',
  instagram: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//instagram_icon.svg',
  lupa: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//lupa_icon.svg',
  whatsapp: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//whatsapp_icon.svg'
};

// Otras imágenes
const imageUrls = {
  logo: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/lgogo.jpg',
  acerca: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/AcercaNosotros.png',
  alpha: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/Alpha_page-0001.jpg',
  fondo: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/fondo.jpg',
  horizon: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/Horizon_page-0001.jpg',
  impact: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/Impact_page-0001.jpg',
  inovacion: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/Inovacion.jpg',
  mision: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/mision.png',
  servicios: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/servicios.jpg',
  vision: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/editorial%20sphera/vision.png',
  bastcorp: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/inovaimagenes/Bastcorp_page-0001.jpg',
  ingenio: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/inovaimagenes/Ingenio_page-0001.jpg',
  kosmos: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/inovaimagenes/Kosmos_page-0001.jpg',
  nexus: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku/inovaimagenes/Nexus_page-0001.jpg',

  issn_logo: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//ISSN_logo.svg.png',
  latindex: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//latindex-catalogo2.png',
  miar: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//MIAR.png',
  scilit: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//scilit.png',
  semantic_scholar: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//semantic%20scholar%20logo.png',
  harvard_library: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//Harvard_Library_Logo.svg.png',
  google_scholar: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//google-scholar4372_0.jpg',
  doi_logo: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//DOI_logo.svg.png',
  crossref: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//Crossref-Logo.jpeg'
};

// Carpetas
const svgDir = path.join(__dirname, '..', 'public', 'svg');
const imgDir = path.join(__dirname, '..', 'public', 'img');

async function descargarArchivo(nombre, tipo = 'svg') {
  const urls = tipo === 'svg' ? svgUrls : imageUrls;
  const url = urls[nombre];
  if (!url) throw new Error('Imagen no encontrada');

  const ext = path.extname(url).split('?')[0];
  const fileName = `${nombre}${ext}`;
  const dir = tipo === 'svg' ? svgDir : imgDir;
  const filePath = path.join(dir, fileName);

  // 🧠 Si ya existe cualquier archivo con ese nombre base, lo reutilizas
  const files = fs.readdirSync(dir);
  const existing = files.find(f => f.startsWith(nombre + '.'));
  if (existing) return path.join(dir, existing);

  // Si no existe, descarga
  const response = await axios.get(url, { responseType: 'stream' });
  await fs.promises.mkdir(dir, { recursive: true });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}
async function obtenerSVG(req, res) {
  try {
    const nombre = req.params.nombre;
    const filePath = await descargarArchivo(nombre, 'svg');
    res.setHeader('Content-Type', 'image/svg+xml');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'SVG no encontrado' });
  }
}

async function obtenerImagen(req, res) {
  try {
    const nombre = req.params.nombre;
    const filePath = await descargarArchivo(nombre, 'img');
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'Imagen no encontrada' });
  }
}

module.exports = {
  obtenerSVG,
  obtenerImagen
};
