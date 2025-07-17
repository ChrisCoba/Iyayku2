const express = require('express');
const path    = require('path');
const fs      = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const { generarFacturaPDF } = require('./pdfFactura');
const pool = require('./db');
const pedidoRoutes = require('./routes/pedidoRoutes');  

const app  = express();

//Cambio por el tema de los pedidos y subir el PDF
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/pedidos', express.static('public/pedidos'));
app.use('/api/pedidos', pedidoRoutes);

//ccambio en el tema de creación, búsqueda y eliminación de certificados
const certificadoRoutes = require('./routes/certificadoRoutes');
app.use(express.json());
app.use(certificadoRoutes);

//cambio para la generación de facturas
const facturaRoutes = require('./routes/facturaRoutes');
app.use(express.json());
app.use(facturaRoutes);


//cambio para el listado y cambio de usuarios que puede ahcer el admin
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use(usuarioRoutes);

//listado de certificados y pdf
const adminRoutes = require('./routes/adminRoutes');
app.use(adminRoutes);

//cambio y creación de nuevos servicios esde el admin
const servicioRoutes = require('./routes/servicioRoutes');
app.use(servicioRoutes);

//cambio  para la personalización de la página y cambios en esta si se quiere desde la BDD
const paginaRoutes = require('./routes/paginaRoutes');
app.use(paginaRoutes);

//autentificación del login del usuario
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);


//uso de ejs para las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ejemplo de rutas
app.get('/contacto', (req, res) => {
  res.render('contacto', { titulo: 'Contacto' });
});
app.get('/editorial', (req, res) => {
  res.render('editorial', { titulo: 'Editorial' });
});
app.get('/nosotros', (req, res) => {
  res.render('nosotros', { titulo: 'Nosotros' });
});
app.get('/perfil', (req, res) => {
  res.render('perfil', { titulo: 'Perfil' });
});
app.get('/registro_login', (req, res) => {
  res.render('registro_login', { titulo: 'Login' });
});
app.get('/servicios', (req, res) => {
  res.render('servicios', { titulo: 'Servicios' });
});






// Ruta absoluta para cargar el controlador (ajusta según tu estructura de carpetas)
const imgControllerPath = path.resolve(__dirname, '../backend/controllers/imagenesControlador.js');

let imgController;
try {
  imgController = require(imgControllerPath);
  console.log('[DEBUG] Controlador imágenes cargado:', Object.keys(imgController));
} catch (err) {
  console.error('[ERROR] No se pudo cargar el controlador de imágenes:', err);
}

// ...existing code...

//------------------------------------------------------------
// Config básica
//------------------------------------------------------------

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(express.json());
app.use(cookieParser());

// Servir imágenes y SVG usando el controlador personalizado
app.get('/img/:nombre', imgController.obtenerImagen);
app.get('/svg/:nombre', imgController.obtenerSVG);

// Tus otras rutas y middlewares
app.use('/upload', uploadRoutes);




//------------------------------------------------------------
// 1. Asegurar carpetas de almacenamiento local
//------------------------------------------------------------
const dirs = [
  path.join(__dirname, '..', 'public', 'articulos'),
  path.join(__dirname, '..', 'public', 'certificados'),
];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

//------------------------------------------------------------
// 2. Frontend estático
//------------------------------------------------------------
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

//------------------------------------------------------------
// 3. Test DB
//------------------------------------------------------------
app.get('/test-db', async (_q, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Conectado a PostgreSQL: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error de conexión a la base de datos');
  }
});


//------------------------------------------------------------
// 7. Arranque
//------------------------------------------------------------
app.listen(PORT, () => console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`));
