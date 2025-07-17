const express = require('express');
const router = express.Router();
const { crearNuevaFactura } = require('../controllers/facturaController');
const { authMiddleware } = require('../controllers/authController'); // Middleware de autenticación JWT

router.post('/api/facturas', authMiddleware, crearNuevaFactura);

module.exports = router;
