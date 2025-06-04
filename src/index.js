const express = require('express');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
