const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');

router.get('/api/admin/usuarios', authMiddleware, usuarioController.listarUsuarios);
router.put('/api/admin/usuarios/:id', authMiddleware, usuarioController.actualizarUsuario);

module.exports = router;
