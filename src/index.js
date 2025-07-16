//------------------------------------------------------------
// 8. Pedidos: subida de PDFs y revisión
//------------------------------------------------------------
const path    = require('path');
const fs      = require('fs');
const multer = require('multer');
const pedidosDir = path.join(__dirname, '..', 'public', 'pedidos');
if (!fs.existsSync(pedidosDir)) fs.mkdirSync(pedidosDir, { recursive: true });
const storagePedidos = multer.diskStorage({
  destination: pedidosDir,
  filename: (req, file, cb) => {
    // nombre: pedido-<id>-<tipo>.pdf
    const pedidoId = req.body.pedidoId || req.params.pedidoId || 'tmp';
    const tipo = file.fieldname;
    cb(null, `pedido-${pedidoId}-${tipo}.pdf`);
  }
});
const uploadPedidos = multer({ storage: storagePedidos, limits: { fileSize: 10 * 1024 * 1024 } });

// Crear pedido tras factura (cliente)
app.post('/api/pedidos', auth, async (req, res) => {
  // Espera: { factura_id, requerimiento, descripcion }
  const { factura_id, requerimiento, descripcion } = req.body;
  const usuario_id = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO pedidos (usuario_id, factura_id, requerimiento, descripcion, estado) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [usuario_id, factura_id, requerimiento || '', descripcion || '', 'pendiente']
    );
    res.json({ ok: true, pedido: rows[0] });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear pedido' });
  }
});

// Subir PDFs al pedido (cliente)
app.post('/api/pedidos/:pedidoId/upload', auth, uploadPedidos.fields([
  { name: 'pdf_requerimiento', maxCount: 1 },
  { name: 'pdf_documento', maxCount: 1 }
]), async (req, res) => {
  const pedidoId = req.params.pedidoId;
  // Guardar rutas en la base
  try {
    const pdf_requerimiento = req.files['pdf_requerimiento'] ? `/pedidos/${req.files['pdf_requerimiento'][0].filename}` : null;
    const pdf_documento = req.files['pdf_documento'] ? `/pedidos/${req.files['pdf_documento'][0].filename}` : null;
    await pool.query('UPDATE pedidos SET pdf_requerimiento=$1, pdf_documento=$2 WHERE id=$3', [pdf_requerimiento, pdf_documento, pedidoId]);
    res.json({ ok: true, pdf_requerimiento, pdf_documento });
  } catch (err) {
    res.status(500).json({ msg: 'Error al subir PDFs' });
  }
});

// Ver pedidos (admin y cliente)
app.get('/api/pedidos', auth, async (req, res) => {
  try {
    let rows;
    if (req.user.correo === 'admin@iyayku.com') {
      const result = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
      rows = result.rows;
    } else {
      const result = await pool.query('SELECT * FROM pedidos WHERE usuario_id=$1 ORDER BY id DESC', [req.user.id]);
      rows = result.rows;
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pedidos' });
  }
});

// Subir PDF corregido y comentarios (admin)
app.post('/api/pedidos/:pedidoId/correccion', auth, uploadPedidos.single('pdf_correccion'), async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede subir correcciones.' });
  const pedidoId = req.params.pedidoId;
  const comentarios = req.body.comentarios || '';
  try {
    const pdf_correccion = req.file ? `/pedidos/${req.file.filename}` : null;
    await pool.query('UPDATE pedidos SET pdf_correccion=$1, comentarios=$2, estado=$3 WHERE id=$4', [pdf_correccion, comentarios, 'corregido', pedidoId]);
    res.json({ ok: true, pdf_correccion });
  } catch (err) {
    res.status(500).json({ msg: 'Error al subir corrección' });
  }
});

// Descargar PDFs (servidos como estáticos)
app.use('/pedidos', express.static(pedidosDir));
// index.js  (CommonJS)
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const { generarFacturaPDF } = require('./pdfFactura');
const pool = require('./db');
const auth = require('./middlewares/auth');       // único middleware
const uploadRoutes = require('./routes/upload');  // ⇠ NUEVO

// Ruta absoluta para cargar el controlador (ajusta según tu estructura de carpetas)
const imgControllerPath = path.resolve(__dirname, '../backend/controllers/imagenesControlador.js');

let imgController;
try {
  imgController = require(imgControllerPath);
  console.log('[DEBUG] Controlador imágenes cargado:', Object.keys(imgController));
} catch (err) {
  console.error('[ERROR] No se pudo cargar el controlador de imágenes:', err);
}

const app  = express();

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
// 4. Auth helpers  (registro / login / logout / status)
//------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;      // usar ASCII
  try {
    const hash = bcrypt.hashSync(contrasena, 10);
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, correo, "contraseña") VALUES ($1,$2,$3) RETURNING id,nombre,correo',
      [nombre, correo, hash]
    );
    res.json({ msg: 'Usuario creado', usuario: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ msg: 'Correo ya existe' });
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar' });
  }
});

app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT id,nombre,correo,"contraseña" FROM usuarios WHERE correo=$1',
      [correo]
    );
    if (!rows.length) return res.status(401).json({ msg: 'Credenciales inválidas' });

    const user = rows[0];
    if (!bcrypt.compareSync(contrasena, user.contraseña))
      return res.status(401).json({ msg: 'Credenciales inválidas' });

    delete user.contraseña;
    const token = jwt.sign({ id: user.id, nombre: user.nombre, correo: user.correo }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, { httpOnly: true }).json({ msg: 'Login exitoso', usuario: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

app.get('/api/logout', (_q, res) => res.clearCookie('token').json({ ok: true }));

app.get('/api/status', auth, (req, res) => res.json({ usuario: req.user }));

//------------------------------------------------------------
// 5. Buscar certificados
//------------------------------------------------------------
app.get('/api/certificados', auth, async (req, res) => {
  const nombre = (req.query.nombre || '').trim();
  if (!nombre) return res.status(400).json({ msg: 'Debes proporcionar un nombre.' });

  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.titulo, u.nombre AS autor
       FROM publicaciones p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE u.nombre ILIKE $1`,
      [`%${nombre}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar los certificados' });
  }
});

//------------------------------------------------------------
// 5b. Certificados: agregar y buscar
//------------------------------------------------------------
app.post('/api/certificados', async (req, res) => {
  const { autor_nombre, articulo_titulo, articulo_url, publicacion_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO certificados (autor_nombre, articulo_titulo, articulo_url, publicacion_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [autor_nombre, articulo_titulo, articulo_url, publicacion_id || null]
    );
    res.json({ msg: 'Certificado creado', certificado: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear certificado' });
  }
});

app.get('/api/certificados-todos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM certificados ORDER BY fecha_emision DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar certificados' });
  }
});

//------------------------------------------------------------
// 5c. Eliminar certificado por ID
//------------------------------------------------------------
app.delete('/api/certificados/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM certificados WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ msg: 'Certificado no encontrado' });
    }
    res.json({ msg: 'Certificado eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar certificado' });
  }
});

//------------------------------------------------------------
// 6. Rutas de subida / descarga de PDF y certificado
//------------------------------------------------------------
app.use('/api', uploadRoutes);   // POST /upload, GET /certificado/:id

//------------------------------------------------------------
// 5d. Facturas: crear nueva factura
//------------------------------------------------------------
app.post('/api/facturas', auth, async (req, res) => {
  const { items, total } = req.body;
  const usuario_id = req.user.id;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'No hay items en la factura.' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO facturas (usuario_id, total) VALUES ($1, $2) RETURNING id, fecha',
      [usuario_id, total]
    );
    const facturaId = rows[0].id;
    const fecha = rows[0].fecha;
    for (const item of items) {
      await pool.query(
        'INSERT INTO factura_items (factura_id, servicio_nombre, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [facturaId, item.nombre, item.cantidad, item.precio]
      );
    }
    // Obtener datos del usuario
    const { rows: userRows } = await pool.query('SELECT nombre, correo FROM usuarios WHERE id = $1', [usuario_id]);
    const usuario = userRows[0];
    // Generar PDF
    const pdfUrl = generarFacturaPDF({ facturaId, usuario, items, total, fecha });
    res.json({ msg: 'Factura generada', facturaId, pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar factura' });
  }
});

// --- ADMIN: Listar todos los usuarios ---
app.get('/api/admin/usuarios', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede ver los usuarios.' });
  try {
    const { rows } = await pool.query('SELECT id, nombre, correo FROM usuarios ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

// --- ADMIN: Actualizar usuario (nombre, correo, contraseña) ---
app.put('/api/admin/usuarios/:id', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede editar usuarios.' });
  const { id } = req.params;
  const { nombre, correo, contrasena } = req.body;
  try {
    let query = 'UPDATE usuarios SET nombre = $1, correo = $2';
    let params = [nombre, correo, id];
    if (contrasena) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync(contrasena, 10);
      query = 'UPDATE usuarios SET nombre = $1, correo = $2, "contraseña" = $3 WHERE id = $4';
      params = [nombre, correo, hash, id];
    } else {
      query += ' WHERE id = $3';
    }
    await pool.query(query, params);
    res.json({ msg: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

// --- ADMIN: Listar todos los certificados ---
app.get('/api/admin/certificados', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede ver certificados.' });
  try {
    const { rows } = await pool.query('SELECT * FROM certificados ORDER BY fecha_emision DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener certificados' });
  }
});

// --- ADMIN: Listar todas las facturas ---
app.get('/api/admin/facturas', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede ver facturas.' });
  try {
    const { rows } = await pool.query('SELECT f.*, u.nombre AS usuario_nombre, u.correo AS usuario_correo FROM facturas f LEFT JOIN usuarios u ON f.usuario_id = u.id ORDER BY f.fecha DESC');
    // Agregar campo pdfUrl a cada factura
    const facturas = rows.map(f => ({
      ...f,
      pdfUrl: `/facturas/factura-${f.id}.pdf`
    }));
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener facturas' });
  }
});

// --- ADMIN: Página HTML personalizada ---
let paginaHtml = ''; // Puedes guardar esto en la base de datos si prefieres

app.get('/api/admin/pagina', auth, (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo admin' });
  res.json({ html: paginaHtml });
});

app.post('/api/admin/pagina', auth, (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo admin' });
  paginaHtml = req.body.html || '';
  res.json({ ok: true });
});

// --- Obtener contenido de una página o sección ---
app.get('/api/paginas_contenido', async (req, res) => {
  const { pagina, seccion } = req.query;
  let query = 'SELECT * FROM paginas_contenido WHERE 1=1';
  const params = [];
  if (pagina) { query += ' AND pagina = $' + (params.length+1); params.push(pagina); }
  if (seccion) { query += ' AND seccion = $' + (params.length+1); params.push(seccion); }
  query += ' ORDER BY orden, id';
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener contenido' });
  }
});

// --- Actualizar o crear contenido de una página/sección (solo admin) ---
app.post('/api/paginas_contenido', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede editar el contenido.' });
  const { id, pagina, seccion, titulo, contenido, orden } = req.body;
  try {
    if (id) {
      // Update
      await pool.query('UPDATE paginas_contenido SET pagina=$1, seccion=$2, titulo=$3, contenido=$4, orden=$5 WHERE id=$6', [pagina, seccion, titulo, contenido, orden||0, id]);
      res.json({ msg: 'Contenido actualizado' });
    } else {
      // Insert
      await pool.query('INSERT INTO paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES ($1,$2,$3,$4,$5)', [pagina, seccion, titulo, contenido, orden||0]);
      res.json({ msg: 'Contenido creado' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error al guardar contenido' });
  }
});

// --- Listar servicios (público) ---
app.get('/api/servicios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM servicios WHERE activo = TRUE ORDER BY orden, id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener servicios' });
  }
});

// --- CRUD servicios (solo admin) ---
app.post('/api/admin/servicios', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede agregar servicios.' });
  const { nombre, descripcion, precio, orden } = req.body;
  try {
    await pool.query('INSERT INTO servicios (nombre, descripcion, precio, orden) VALUES ($1,$2,$3,$4)', [nombre, descripcion, precio, orden||0]);
    res.json({ msg: 'Servicio creado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear servicio' });
  }
});

app.put('/api/admin/servicios/:id', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede editar servicios.' });
  const { id } = req.params;
  const { nombre, descripcion, precio, activo, orden } = req.body;
  try {
    await pool.query('UPDATE servicios SET nombre=$1, descripcion=$2, precio=$3, activo=$4, orden=$5 WHERE id=$6', [nombre, descripcion, precio, activo, orden||0, id]);
    res.json({ msg: 'Servicio actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar servicio' });
  }
});

app.delete('/api/admin/servicios/:id', auth, async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') return res.status(403).json({ msg: 'Solo el administrador puede eliminar servicios.' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM servicios WHERE id=$1', [id]);
    res.json({ msg: 'Servicio eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar servicio' });
  }
});

//------------------------------------------------------------
// 7. Arranque
//------------------------------------------------------------
app.listen(PORT, () => console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`));
