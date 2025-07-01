// index.js  (CommonJS)
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');
const auth = require('./middlewares/auth');       // único middleware
const uploadRoutes = require('./routes/upload');  // ⇠ NUEVO

//------------------------------------------------------------
// Config básica
//------------------------------------------------------------
const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(express.json());
app.use(cookieParser());

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
app.get('/', (_q, res) => res.sendFile(path.join(publicPath, 'index.html')));

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
    const token = jwt.sign({ id: user.id, nombre: user.nombre }, JWT_SECRET, { expiresIn: '2h' });
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
// 6. Rutas de subida / descarga de PDF y certificado
//------------------------------------------------------------
app.use('/api', uploadRoutes);   // POST /upload, GET /certificado/:id

//------------------------------------------------------------
// 7. Arranque
//------------------------------------------------------------
app.listen(PORT, () => console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`));
