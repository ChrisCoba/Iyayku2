const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const servicioController = require('../controllers/servicioController');

router.get('/api/servicios', servicioController.listarServicios);

router.post('/api/admin/servicios', authMiddleware, servicioController.crearServicio);
router.put('/api/admin/servicios/:id', authMiddleware, servicioController.actualizarServicio);
router.delete('/api/admin/servicios/:id', authMiddleware, servicioController.eliminarServicio);

module.exports = router;
