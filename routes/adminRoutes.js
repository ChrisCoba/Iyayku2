const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.get('/api/admin/certificados', auth, adminController.obtenerCertificados);
router.get('/api/admin/facturas', auth, adminController.obtenerFacturas);

module.exports = router;
