// index.js  (CommonJS)
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');              // tu pool de pg
const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(express.json());
app.use(cookieParser());

// ----------  Static frontend  ----------
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
app.get('/', (_q, res) => res.sendFile(path.join(publicPath, 'index.html')));

// ----------  Test DB  ----------
app.get('/test-db', async (_q, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Conectado a PostgreSQL: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error de conexión a la base de datos');
  }
});

// ----------  Helpers  ----------
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'No login' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ msg: 'Token inválido' }); }
}

// ----------  Registro  ----------
app.post('/api/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    const hash = bcrypt.hashSync(contraseña, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, "contraseña") VALUES ($1, $2, $3) RETURNING id, nombre, correo',
      [nombre, correo, hash]
    );
    res.json({ msg: 'Usuario creado', usuario: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {        // clave única duplicada
      return res.status(400).json({ msg: 'Correo ya existe' });
    }
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar' });
  }
});

// ----------  Login  ----------
app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, correo, "contraseña" FROM usuarios WHERE correo = $1',
      [correo]
    );
    if (!rows.length) return res.status(401).json({ msg: 'Credenciales inválidas' });

    const user = rows[0];
    if (!bcrypt.compareSync(contraseña, user.contraseña))
      return res.status(401).json({ msg: 'Credenciales inválidas' });

    delete user.contraseña;                  // no enviamos el hash
    const token = jwt.sign({ id: user.id, nombre: user.nombre }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, { httpOnly: true }).json({ msg: 'Login exitoso', usuario: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// ----------  Logout  ----------
app.get('/api/logout', (_q, res) => res.clearCookie('token').json({ ok: true }));

// ----------  Buscar certificados  ----------
app.get('/api/certificados', auth, async (req, res) => {
  const nombre = (req.query.nombre || '').trim();
  try {
    const { rows } = await pool.query(
      'SELECT titulo AS nombre, archivo_url FROM publicaciones WHERE titulo ILIKE $1',
      [`%${nombre}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar certificados' });
  }
});

// ----------  Start server  ----------
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

