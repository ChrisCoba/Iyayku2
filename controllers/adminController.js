const adminModel = require('../models/adminModel');

function esAdmin(req) {
  return req.user && req.user.correo === 'admin@iyayku.com';
}

async function obtenerCertificados(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede ver certificados.' });

  try {
    const certificados = await adminModel.listarCertificados();
    res.json(certificados);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener certificados' });
  }
}

async function obtenerFacturas(req, res) {
  if (!esAdmin(req)) return res.status(403).json({ msg: 'Solo el administrador puede ver facturas.' });

  try {
    const facturas = await adminModel.listarFacturas();
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener facturas' });
  }
}

module.exports = {
  obtenerCertificados,
  obtenerFacturas,
};
