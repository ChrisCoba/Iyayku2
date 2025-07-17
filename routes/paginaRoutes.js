const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const paginaController = require('../controllers/paginaController');

router.get('/api/admin/pagina', auth, paginaController.obtenerPaginaHtml);
router.post('/api/admin/pagina', auth, paginaController.guardarPaginaHtml);

router.get('/api/paginas_contenido', paginaController.obtenerContenido);
router.post('/api/paginas_contenido', auth, paginaController.guardarContenido);

module.exports = router;
