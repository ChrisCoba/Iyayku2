const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const paginaController = require('../controllers/paginaController');

router.get('/api/admin/pagina', authMiddleware, paginaController.obtenerPaginaHtml);
router.post('/api/admin/pagina', authMiddleware, paginaController.guardarPaginaHtml);

router.get('/api/paginas_contenido', paginaController.obtenerContenido);
router.post('/api/paginas_contenido', authMiddleware, paginaController.guardarContenido);

module.exports = router;
