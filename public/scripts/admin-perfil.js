// Alterna paneles
function mostrarPanel(panel) {
  document.getElementById('admin-usuarios-panel').style.display = 'none';
  document.getElementById('admin-facturas-panel').style.display = 'none';
  document.getElementById('admin-certificados-panel').style.display = 'none';
  document.getElementById('admin-servicios-panel').style.display = 'none';
  if (panel === 'usuarios') cargarUsuarios();
  if (panel === 'facturas') cargarFacturas();
  if (panel === 'certificados') cargarCertificados();
  document.getElementById('admin-' + panel + '-panel').style.display = 'block';
}

// USUARIOS
async function cargarUsuarios() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/admin/usuarios', { headers: { 'Authorization': 'Bearer ' + token } });
  const usuarios = await res.json();
  const tbody = document.querySelector('#admin-usuarios-table tbody');
  tbody.innerHTML = '';
  usuarios.forEach(u => {
    tbody.innerHTML += `<tr><td>${u.nombre}</td><td>${u.correo}</td><td><button onclick="mostrarEditarUsuario(${u.id},'${u.nombre}','${u.correo}')">Editar</button></td></tr>`;
  });
}
function mostrarEditarUsuario(id, nombre, correo) {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type='text' name='nombre' value='${nombre}' required>\n
    <input type='email' name='correo' value='${correo}' required>\n
    <input type='password' name='contrasena' placeholder='Nueva contraseña (opcional)'>\n
    <button type='submit'>Guardar</button>\n
    <button type='button' onclick='this.parentNode.remove()'>Cancelar</button>\n
  `;
  form.onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(data)
    });
    form.remove();
    cargarUsuarios();
  };
  document.querySelector('#admin-usuarios-table tbody').appendChild(form);
}

// FACTURAS
async function cargarFacturas() {
  const token = localStorage.getItem('token');
  const res = await fetch('/admin/facturas', { headers: { 'Authorization': 'Bearer ' + token } });
  const data = await res.json();
  const tbody = document.querySelector('#admin-facturas-table tbody');
  tbody.innerHTML = '';
  data.pdfs.forEach(pdf => {
    tbody.innerHTML += `<tr><td>${pdf}</td><td><a href='/admin/facturas/${pdf}' target='_blank'>Descargar</a></td></tr>`;
  });
}

// CERTIFICADOS (placeholder)
async function cargarCertificados() {
  // Aquí deberías hacer un fetch a tu endpoint de certificados
  const tbody = document.querySelector('#admin-certificados-table tbody');
  tbody.innerHTML = `<tr><td>1</td><td>Autor Demo</td><td>Título Demo</td><td><a href='#'>PDF</a></td><td>URL</td><td>2025-07-17</td></tr>`;
}

// SERVICIOS
const formServicio = document.getElementById('form-servicio');
if (formServicio) {
  formServicio.onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formServicio));
    const token = localStorage.getItem('token');
    await fetch('/api/admin/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(data)
    });
    alert('Servicio añadido');
    formServicio.reset();
  };
}
