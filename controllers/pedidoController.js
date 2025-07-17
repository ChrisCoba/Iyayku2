const Pedido = require('../models/pedidoModel');

exports.crearPedido = async (req, res) => {
  const { factura_id, requerimiento, descripcion } = req.body;
  const usuario_id = req.user.id;
  try {
    const pedido = await Pedido.create({ usuario_id, factura_id, requerimiento, descripcion });
    res.json({ ok: true, pedido });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear pedido' });
  }
};

exports.subirPDFs = async (req, res) => {
  const pedidoId = req.params.pedidoId;
  try {
    const pdf_requerimiento = req.files['pdf_requerimiento'] ? `/pedidos/${req.files['pdf_requerimiento'][0].filename}` : null;
    const pdf_documento = req.files['pdf_documento'] ? `/pedidos/${req.files['pdf_documento'][0].filename}` : null;

    await Pedido.updatePDFs(pedidoId, { pdf_requerimiento, pdf_documento });
    res.json({ ok: true, pdf_requerimiento, pdf_documento });
  } catch (err) {
    res.status(500).json({ msg: 'Error al subir PDFs' });
  }
};

exports.verPedidos = async (req, res) => {
  try {
    const pedidos = req.user.correo === 'admin@iyayku.com'
      ? await Pedido.getAll()
      : await Pedido.getByUsuario(req.user.id);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pedidos' });
  }
};

exports.subirCorreccion = async (req, res) => {
  if (!req.user || req.user.correo !== 'admin@iyayku.com') {
    return res.status(403).json({ msg: 'Solo el administrador puede subir correcciones.' });
  }

  const pedidoId = req.params.pedidoId;
  const comentarios = req.body.comentarios;
  const pdf_correccion = req.file ? `/pedidos/${req.file.filename}` : null;

  try {
    await Pedido.subirCorreccion(pedidoId, { pdf_correccion, comentarios });
    res.json({ ok: true, pdf_correccion });
  } catch (err) {
    res.status(500).json({ msg: 'Error al subir corrección' });
  }
};
