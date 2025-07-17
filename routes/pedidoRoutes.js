const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController'); // Middleware de autenticación JWT
const pedidoCtrl = require('../controllers/pedidoController');
const uploadPedidos = require('../utils/uploadPedidos');
const db = require('../src/db');

// Crear pedido
router.post('/', authMiddleware, pedidoCtrl.crearPedido);

// Subir PDFs
router.post('/:pedidoId/upload', authMiddleware, uploadPedidos.fields([
  { name: 'pdf_requerimiento', maxCount: 1 },
  { name: 'pdf_documento', maxCount: 1 }
]), pedidoCtrl.subirPDFs);

// Ver pedidos
router.get('/', authMiddleware, pedidoCtrl.verPedidos);

// Subir corrección
router.post('/:pedidoId/correccion', authMiddleware, uploadPedidos.single('pdf_correccion'), pedidoCtrl.subirCorreccion);

module.exports = router;
