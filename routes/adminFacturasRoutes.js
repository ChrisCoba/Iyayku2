const express = require('express');
const router = express.Router();
const { listarFacturasPDF, descargarFacturaPDF } = require('../controllers/adminFacturasController');
const { authMiddleware } = require('../controllers/authController');


const { listarFacturasDB, descargarFacturaPDFMem } = require('../controllers/adminFacturasDBController');
// Facturas con info de usuario, total, fecha y PDF
router.get('/api/admin/facturas', authMiddleware, listarFacturasDB);
// Descargar PDF generado en memoria (Railway safe)
router.get('/api/admin/facturas/:id/pdf', authMiddleware, descargarFacturaPDFMem);
// Solo lista de PDFs (legacy)
router.get('/admin/facturas', authMiddleware, listarFacturasPDF);
router.get('/admin/facturas/:filename', authMiddleware, descargarFacturaPDF);

module.exports = router;
