const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authModel = require('../models/authModel');
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto';

async function registrar(req, res) {
  const { nombre, correo, contrasena } = req.body;
  try {
    const usuario = await authModel.registrarUsuario({ nombre, correo, contrasena });
    res.json({ msg: 'Usuario creado', usuario });
  } catch (err) {
    if (err.message === 'Correo ya existe') return res.status(400).json({ msg: err.message });
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar' });
  }
}

async function login(req, res) {
  const { correo, contrasena } = req.body;
  try {
    const user = await authModel.obtenerUsuarioPorCorreo(correo);
    if (!user) return res.status(401).json({ msg: 'Credenciales inválidas' });

    if (!bcrypt.compareSync(contrasena, user.contraseña))
      return res.status(401).json({ msg: 'Credenciales inválidas' });

    delete user.contraseña;
    const token = jwt.sign({ id: user.id, nombre: user.nombre, correo: user.correo }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, { httpOnly: true }).json({ msg: 'Login exitoso', usuario: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
}

function logout(_req, res) {
  res.clearCookie('token').json({ ok: true });
}


function authMiddleware(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));
  if (!token) return res.status(401).json({ msg: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

function status(req, res) {
  res.json({ usuario: req.user });
}

module.exports = {
  registrar,
  login,
  logout,
  status,
  authMiddleware,
};
