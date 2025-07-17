const express = require('express');
const router = express.Router();
const auth = require('./auth'); // Asegúrate de tener tu middleware de auth
const pedidoCtrl = require('../controllers/pedidoController');
const uploadPedidos = require('../utils/uploadPedidos');

// Crear pedido
router.post('/', auth, pedidoCtrl.crearPedido);

// Subir PDFs
router.post('/:pedidoId/upload', auth, uploadPedidos.fields([
  { name: 'pdf_requerimiento', maxCount: 1 },
  { name: 'pdf_documento', maxCount: 1 }
]), pedidoCtrl.subirPDFs);

// Ver pedidos
router.get('/', auth, pedidoCtrl.verPedidos);

// Subir corrección
router.post('/:pedidoId/correccion', auth, uploadPedidos.single('pdf_correccion'), pedidoCtrl.subirCorreccion);

module.exports = router;
