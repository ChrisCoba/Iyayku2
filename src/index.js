const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta a tu carpeta pública (donde están los HTML, CSS, JS del frontend)
const publicPath = path.join(__dirname, '..', 'public');

// Middleware para servir archivos estáticos
app.use(express.static(publicPath));

// Ruta principal (por si quieres redirigir al index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
