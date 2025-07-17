const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get('/api/admin/certificados', authMiddleware, adminController.obtenerCertificados);
router.get('/api/admin/facturas', authMiddleware, adminController.obtenerFacturas);

module.exports = router;
