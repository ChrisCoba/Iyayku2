const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../controllers/authController');
const authController = require('../controllers/authController');

router.post('/api/register', authController.registrar);
router.post('/api/login', authController.login);
router.get('/api/logout', authController.logout);
router.get('/api/status', authMiddleware, authController.status);

module.exports = router;
