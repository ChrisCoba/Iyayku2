// src/middlewares/auth.js
//------------------------------------------------------------
// Middleware de autenticación JWT
//------------------------------------------------------------

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

/**
 * Verifica el token (cookie "token" o header Authorization: Bearer)
 * y agrega el objeto decodificado en req.user.
 *
 * Si el token no existe o es inválido → responde 401.
 */
module.exports = function auth(req, res, next) {
  // 1. Extraer token
  let token = req.cookies?.token;

  // Permite también header Authorization: Bearer <token>
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si no hay token → 401
  if (!token) {
    return res.status(401).json({ msg: 'No autenticado' });
  }

  // 3. Verificar token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;     // ej. { id, nombre, iat, exp }
    next();                 // sigue a la ruta protegida
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};
