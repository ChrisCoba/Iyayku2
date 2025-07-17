// En script.js, función que carga contenido dinámico según navegación
async function cargarVista(vista) {
  let html = '';
  switch(vista) {
    case 'inicio':
      const res = await fetch('/api/servicios');  // ejemplo
      const servicios = await res.json();
      html = servicios.map(s => `<div class="servicio-item">${s.nombre}</div>`).join('');
      break;
    case 'pedidos':
      // Mostrar sección formulario-pedido o mis-pedidos según usuario
      document.getElementById('formulario-pedido').style.display = 'block';
      document.getElementById('mis-pedidos').style.display = 'block';
      break;
    // Otros casos...
  }
  document.getElementById('contenido-dinamico').innerHTML = html;
}

// Ejemplo: cargar vista inicio al cargar página
document.addEventListener('DOMContentLoaded', () => {
  cargarVista('inicio');
});
