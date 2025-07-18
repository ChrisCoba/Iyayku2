// Carrito de compras simple para servicios
let carrito = JSON.parse(localStorage.getItem('carritoServicios')) || [];

function agregarAlCarrito(servicio) {
  const index = carrito.findIndex(item => item.id === servicio.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...servicio, cantidad: 1 });
  }
  localStorage.setItem('carritoServicios', JSON.stringify(carrito));
  actualizarCarritoUI();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem('carritoServicios', JSON.stringify(carrito));
  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  let cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  let btn = document.getElementById('carrito-cantidad');
  if (btn) btn.textContent = cantidad;
  // Mostrar lista flotante si quieres
}

document.addEventListener('DOMContentLoaded', actualizarCarritoUI);

// Exportar para uso global
window.agregarAlCarrito = agregarAlCarrito;
window.quitarDelCarrito = quitarDelCarrito;
window.carritoServicios = carrito;
