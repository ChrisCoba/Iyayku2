
const items = document.getElementById('items');
const total = document.getElementById('total');
let suma = 0;

function agregar(nombre, precio) {
  const li = document.createElement('li');
  li.textContent = `${nombre} - $${precio}`;  // Usamos backticks correctamente
  items.appendChild(li);
  suma += Number(precio);  // Asegura que sea numérico
  total.textContent = suma.toFixed(2); // Muestra el total con dos decimales
}


const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalElement = document.getElementById('total');

  function actualizarCarrito() {
    items.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nombre} - $${item.precio}`;
      items.appendChild(li);
      total += item.precio;
    });
    totalElement.textContent = total;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function agregar(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
  }

  document.getElementById('btn-comprar').addEventListener('click', () => {
    // Puedes validar que haya productos antes si quieres
    if (carrito.length === 0) {
      alert("El carrito está vacío, agrega algo antes de comprar.");
    } else {
      window.location.href = "/Pages/registro_login.html";
    }
  });

  // Al cargar la página
  actualizarCarrito();