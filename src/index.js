const express = require('express');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Carpeta pública
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Ruta principal para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Ruta para probar conexión a PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Conectado exitosamente a PostgreSQL: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err);
    res.status(500).send('Error de conexión a la base de datos');
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, nombre, correo, rol FROM usuarios WHERE correo = $1 AND "contraseña" = $2',
      [correo, contraseña]
    );

    if (result.rows.length > 0) {
      res.json({ msg: 'Login exitoso', usuario: result.rows[0] });
    } else {
      res.status(401).json({ msg: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

