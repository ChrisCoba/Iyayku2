const btnVerCarrito = document.getElementById('btn-ver-carrito');
const overlayCarrito = document.getElementById('overlay-carrito');
const cerrarOverlay = document.getElementById('cerrar-overlay');
const cantidadCarrito = document.getElementById('cantidad-carrito');

function actualizarCarrito() {
  items.innerHTML = '';
  let suma = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - $${item.precio}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '×';
    btnEliminar.style.marginLeft = '8px';
    btnEliminar.style.color = 'red';
    btnEliminar.style.background = 'none';
    btnEliminar.style.border = 'none';
    btnEliminar.style.cursor = 'pointer';

    btnEliminar.addEventListener('click', () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    });

    li.appendChild(btnEliminar);
    items.appendChild(li);
    suma += Number(item.precio);
  });
  total.textContent = suma.toFixed(2);
  cantidadCarrito.textContent = carrito.length;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

btnVerCarrito.addEventListener('click', () => {
  overlayCarrito.style.display = 'flex';
});

cerrarOverlay.addEventListener('click', () => {
  overlayCarrito.style.display = 'none';
});
