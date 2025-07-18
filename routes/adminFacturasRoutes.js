const express = require('express');
const router = express.Router();
const { listarFacturasPDF, descargarFacturaPDF } = require('../controllers/adminFacturasController');
const { authMiddleware } = require('../controllers/authController');

// Solo admin debería acceder, aquí puedes agregar un middleware extra si lo deseas
router.get('/admin/facturas', authMiddleware, listarFacturasPDF);
router.get('/admin/facturas/:filename', authMiddleware, descargarFacturaPDF);

module.exports = router;
