const fs = require('fs');
const path = require('path');
const axios = require('axios');

const svgUrls = {
  facebook: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//facebook_icon.svg',
  instagram: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//instagram_icon.svg',
  lupa: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//lupa_icon.svg',
  whatsapp: 'https://nhttnwzpmxmdncpzxtxm.supabase.co/storage/v1/object/public/iyayku//whatsapp_icon.svg'
};

const svgDir = path.join(__dirname, '..', 'public', 'svg');

async function descargarSVG(nombre) {
  if (!svgUrls[nombre]) throw new Error('SVG no encontrado');
  const filePath = path.join(svgDir, `${nombre}.svg`);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  const response = await axios.get(svgUrls[nombre], { responseType: 'stream' });
  await fs.promises.mkdir(svgDir, { recursive: true });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

// Controlador para servir el SVG
exports.obtenerSVG = async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const filePath = await descargarSVG(nombre);
    res.setHeader('Content-Type', 'image/svg+xml');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'SVG no encontrado' });
  }
};

// ...puedes agregar más funciones si lo necesitas...
