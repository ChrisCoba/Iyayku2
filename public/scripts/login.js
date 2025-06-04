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