const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // si lo tienes
const certificadoController = require('../controllers/certificadoController');

router.get('/api/certificados', auth, certificadoController.buscarCertificados);
router.post('/api/certificados', certificadoController.crearCertificado);
router.get('/api/certificados-todos', certificadoController.obtenerTodos);
router.delete('/api/certificados/:id', certificadoController.eliminarPorId);

module.exports = router;
