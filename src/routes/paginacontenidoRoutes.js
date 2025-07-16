// routes/paginasContenidoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/paginasContenidoController');

// Ver todo el contenido de una página
router.get('/:pagina', controller.getSeccionesByPagina);

// Ver una sección específica
router.get('/:pagina/:seccion', controller.getSeccion);

// Ver una sección por ID
router.get('/id/:id', controller.getSeccionById);

// Crear nueva sección
router.post('/', controller.createSeccion);

// Actualizar sección existente
router.put('/:id', controller.updateSeccion);

// Eliminar sección
router.delete('/:id', controller.deleteSeccion);

module.exports = router;
