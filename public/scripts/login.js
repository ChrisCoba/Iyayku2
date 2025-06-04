document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');

  if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
      container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  } else {
    console.warn('Elementos del login/register no encontrados en el DOM.');
  }
});


// Registro
const nombre = e.target[0].value;
const email = e.target[1].value;
const contrasena = e.target[2].value;

fetch(`${API_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre, email, contrasena })
});

// Login
const correo = e.target[0].value;
const contraseña = e.target[1].value;

fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo, contraseña })
});
