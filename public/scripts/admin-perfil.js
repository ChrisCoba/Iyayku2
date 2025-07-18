// Alterna paneles y resalta el botón activo
function mostrarPanel(panel) {
  const panels = ['usuarios', 'facturas', 'certificados', 'servicios'];
  panels.forEach(p => {
    document.getElementById('admin-' + p + '-panel').style.display = 'none';
    const btn = document.querySelector('.admin-card.card-' + p);
    if (btn) btn.classList.remove('active-card');
  });
  if (panel === 'usuarios') cargarUsuarios();
  if (panel === 'facturas') cargarFacturas();
  if (panel === 'certificados') cargarCertificados();
  document.getElementById('admin-' + panel + '-panel').style.display = 'block';
  const btn = document.querySelector('.admin-card.card-' + panel);
  if (btn) btn.classList.add('active-card');
}

// Descargar PDF con token (para evitar 401)
window.descargarFacturaPDF = async function(facturaId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/admin/facturas/${facturaId}/pdf`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) {
    alert('No autorizado o error al descargar PDF');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `factura-${facturaId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
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
  const res = await fetch('/api/admin/facturas', { headers: { 'Authorization': 'Bearer ' + token } });
  const facturas = await res.json();
  const tbody = document.querySelector('#admin-facturas-table tbody');
  tbody.innerHTML = '';
  facturas.forEach(f => {
    tbody.innerHTML += `<tr>
      <td>${f.id}</td>
      <td>${f.nombre || ''}</td>
      <td>${f.correo || ''}</td>
      <td>${f.fecha ? f.fecha.substring(0,10) : ''}</td>
      <td>$${f.total}</td>
      <td><button onclick="descargarFacturaPDF(${f.id})">Descargar PDF</button></td>
    </tr>`;
  });
}

// CERTIFICADOS (placeholder)
async function cargarCertificados() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/certificados-todos', { headers: { 'Authorization': 'Bearer ' + token } });
  const certificados = await res.json();
  const tbody = document.querySelector('#admin-certificados-table tbody');
  tbody.innerHTML = '';
  certificados.forEach(c => {
    tbody.innerHTML += `<tr>
      <td>${c.id}</td>
      <td>${c.autor_nombre || ''}</td>
      <td>${c.articulo_titulo || ''}</td>
      <td>${c.articulo_url ? `<a href='${c.articulo_url}' target='_blank'>PDF</a>` : ''}</td>
      <td>${c.articulo_pagina || ''}</td>
      <td>${c.fecha_emision ? c.fecha_emision.substring(0,10) : ''}</td>
    </tr>`;
  });
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
