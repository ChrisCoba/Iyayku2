const items = document.getElementById('items');
const total = document.getElementById('total');
const btnComprar = document.getElementById('btn-comprar');
const fab = document.getElementById('carrito-fab');
const panel = document.getElementById('carrito-panel');
const cerrar = document.getElementById('cerrar-carrito');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
  items.innerHTML = '';
  let suma = 0;
  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - $${item.precio}`;
    items.appendChild(li);
    suma += Number(item.precio);
  });
  total.textContent = suma.toFixed(2);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
}

// Mostrar/ocultar panel carrito
if (fab && panel && cerrar) {
  fab.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
  });
  cerrar.addEventListener('click', () => {
    panel.style.display = 'none';
  });
  document.addEventListener('mousedown', function(e) {
    if (panel.style.display === 'block' && !panel.contains(e.target) && e.target !== fab) {
      panel.style.display = 'none';
    }
  });
}

// Comprar
if (btnComprar) {
  btnComprar.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío, agrega algo antes de comprar.");
    } else {
      window.location.href = "/Pages/registro_login.html";
    }
  });
}

// Inicializar carrito al cargar
actualizarCarrito();