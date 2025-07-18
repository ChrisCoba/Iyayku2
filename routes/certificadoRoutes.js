const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController'); // Middleware de autenticación JWT
const certificadoController = require('../controllers/certificadoController');

router.get('/api/certificados', certificadoController.buscarCertificados);
router.post('/api/certificados', certificadoController.crearCertificado);
router.get('/api/certificados-todos', certificadoController.obtenerTodos);
router.delete('/api/certificados/:id', certificadoController.eliminarPorId);

module.exports = router;
