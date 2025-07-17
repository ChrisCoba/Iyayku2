const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const usuarioController = require('../controllers/usuarioController');

router.get('/api/admin/usuarios', auth, usuarioController.listarUsuarios);
router.put('/api/admin/usuarios/:id', auth, usuarioController.actualizarUsuario);

module.exports = router;
