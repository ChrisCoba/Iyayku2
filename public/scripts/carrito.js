const btnVerCarrito = document.getElementById('btn-ver-carrito');
const overlayCarrito = document.getElementById('overlay-carrito');
const cerrarOverlay = document.getElementById('cerrar-overlay');
const cantidadCarrito = document.getElementById('cantidad-carrito');


btnVerCarrito.addEventListener('click', () => {
  overlayCarrito.style.display = 'flex';
});

cerrarOverlay.addEventListener('click', () => {
  overlayCarrito.style.display = 'none';
});

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
}

function actualizarCarrito() {
  const items = document.getElementById('items');
  const total = document.getElementById('total');
  const cantidadCarrito = document.getElementById('cantidad-carrito');

  if (!items || !total || !cantidadCarrito) return;

  items.innerHTML = '';
  let suma = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - $${item.precio}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '×';
    btnEliminar.onclick = () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    };

    li.appendChild(btnEliminar);
    items.appendChild(li);
    suma += Number(item.precio);
  });

  total.textContent = suma.toFixed(2);
  cantidadCarrito.textContent = carrito.length;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();

  const btnVerCarrito = document.getElementById('btn-ver-carrito');
  const overlayCarrito = document.getElementById('overlay-carrito');
  const cerrarOverlay = document.getElementById('cerrar-overlay');
  const btnComprar = document.getElementById('btn-comprar');

  if (btnVerCarrito && overlayCarrito) {
    btnVerCarrito.addEventListener('click', () => {
      overlayCarrito.style.display = 'flex';
    });
  }

  if (cerrarOverlay && overlayCarrito) {
    cerrarOverlay.addEventListener('click', () => {
      overlayCarrito.style.display = 'none';
    });
  }

  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      if (carrito.length === 0) {
        alert("El carrito está vacío.");
      } else {
        window.location.href = "/Pages/registro_login.html";
      }
    });
  }
});

