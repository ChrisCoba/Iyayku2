// routes/serviciosRoutes.js
const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');

// CRUD básico
router.get('/', serviciosController.getServiciosActivos);
router.get('/:id', serviciosController.getServicioById);
router.post('/', serviciosController.createServicio);
router.put('/:id', serviciosController.updateServicio);
router.delete('/:id', serviciosController.deleteServicio);

module.exports = router;
