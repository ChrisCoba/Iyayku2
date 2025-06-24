document.addEventListener('DOMContentLoaded', async () => {
    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    const formRegister = document.getElementById('form-register');
    const formLogin = document.getElementById('form-login');

    // --- MANEJO DE LA ANIMACIÓN DEL PANEL ---
    // Si los elementos para la animación existen, se les añade el evento
    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }

// --- REGISTRO ---
const respReg = await fetch('/api/register', {
  method: 'POST',
  credentials: 'include',                  // ← si backend da cookie al crear
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre, correo, contrasena })
});

// --- LOGIN ---
const respLogin = await fetch('/api/login', {
  method: 'POST',
  credentials: 'include',                  // ← importante para enviar/recibir cookie
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo, contrasena })
});

if (respLogin.ok) {
  alert('¡Login exitoso!');
  formLogin.reset();
  window.location.href = '/Pages/pago.html';
}

});