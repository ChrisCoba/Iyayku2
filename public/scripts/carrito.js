document.addEventListener('DOMContentLoaded', () => {
  // Elementos del carrito
  const carritoToggle = document.getElementById('carrito-toggle');
  const carritoPanel = document.getElementById('carrito-panel');
  const carritoCerrar = document.getElementById('carrito-cerrar');
  const carritoItems = document.getElementById('carrito-items');
  const carritoCantidad = document.getElementById('carrito-cantidad');
  const carritoTotal = document.getElementById('carrito-total');
  const carritoComprar = document.getElementById('carrito-comprar');

  // Estado del carrito
  let carrito = [];

  // --- Cargar carrito de localStorage o sessionStorage ---
  function cargarCarritoGuardado() {
    const guardado = localStorage.getItem('carritoServicios') || sessionStorage.getItem('carritoServicios');
    if (guardado) {
      try {
        carrito = JSON.parse(guardado) || [];
      } catch {
        carrito = [];
      }
    }
  }

  // --- Guardar carrito en localStorage y sessionStorage ---
  function guardarCarrito() {
    const data = JSON.stringify(carrito);
    localStorage.setItem('carritoServicios', data);
    sessionStorage.setItem('carritoServicios', data);
  }

  cargarCarritoGuardado();

  // Mostrar/ocultar panel
  carritoToggle.addEventListener('click', () => {
    carritoPanel.classList.toggle('abierto');
  });
  carritoCerrar.addEventListener('click', () => {
    carritoPanel.classList.remove('abierto');
  });

  // Agregar servicio al carrito
  document.querySelectorAll('.servicio-precio-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = btn.closest('.servicio-precio-card');
      const nombre = card.querySelector('.servicio-precio-header').textContent.trim();
      const precio = parseFloat(card.querySelector('.servicio-precio-precio').textContent.replace('$', '').trim());
      agregarAlCarrito(nombre, precio);
    });
  });

  function agregarAlCarrito(nombre, precio) {
    const existente = carrito.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
    guardarCarrito();
    carritoPanel.classList.add('abierto');
  }

  function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarCarrito();
    guardarCarrito();
  }

  function actualizarCarrito() {
    // Actualizar cantidad
    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    carritoCantidad.textContent = totalCantidad;

    // Actualizar items
    carritoItems.innerHTML = '';
    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
    } else {
      carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
          <span class="carrito-item-nombre">${item.nombre} <span style="color:#888;font-size:0.95em;">x${item.cantidad}</span></span>
          <span class="carrito-item-precio">$${(item.precio * item.cantidad).toFixed(2)}</span>
          <button class="carrito-item-eliminar" title="Eliminar" data-nombre="${item.nombre}">&times;</button>
        `;
        carritoItems.appendChild(div);
      });
      // Botones eliminar
      carritoItems.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
        btn.addEventListener('click', function () {
          eliminarDelCarrito(this.getAttribute('data-nombre'));
        });
      });
    }

    // Actualizar total
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    carritoTotal.textContent = total.toFixed(2);
  }

  // Comprar
  carritoComprar.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    alert('¡Gracias por tu compra!');
    carrito = [];
    actualizarCarrito();
    guardarCarrito();
    carritoPanel.classList.remove('abierto');
  });

  // Inicializar vista del carrito al cargar
  actualizarCarrito();
});
