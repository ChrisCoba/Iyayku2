const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const servicioController = require('../controllers/servicioController');

router.get('/api/servicios', servicioController.listarServicios);

router.post('/api/admin/servicios', auth, servicioController.crearServicio);
router.put('/api/admin/servicios/:id', auth, servicioController.actualizarServicio);
router.delete('/api/admin/servicios/:id', auth, servicioController.eliminarServicio);

module.exports = router;
