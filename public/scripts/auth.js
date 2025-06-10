// Registro e inicio de sesión con alertas

document.addEventListener('DOMContentLoaded', () => {
  // Registro
  const registroForm = document.querySelector('.sign-up form');
  if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Lógica real de registro
      const name = registroForm.querySelector('input[type="text"]').value.trim();
      const email = registroForm.querySelector('input[type="email"]').value.trim();
      const password = registroForm.querySelector('input[type="password"]').value;

      if (!name || !email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Simula almacenamiento en localStorage (solo para demo, no seguro para producción)
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.email === email)) {
        alert('Este correo ya está registrado.');
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      alert('¡Registro exitoso! Ya estás registrado.');
      registroForm.reset();
    });
  }

  // Login
  const loginForm = document.querySelector('.sign-in form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Lógica real de login
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;

      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        alert('¡Inicio de sesión exitoso!');
        loginForm.reset();
        // Aquí podrías redirigir o guardar sesión
      } else {
        alert('Correo o contraseña incorrectos.');
      }
    });
  }
});
