const express = require('express');
const router = express.Router();
const { crearNuevaFactura } = require('../controllers/facturaController');
const auth = require('../middlewares/auth'); // Middleware de autenticación

router.post('/api/facturas', auth, crearNuevaFactura);

module.exports = router;
