
  const isLoggedIn = localStorage.getItem("usuarioLogueado"); // o tu lógica de sesión

  const userIcon = document.querySelector(".user-icon");
  if (isLoggedIn) {
    userIcon.style.backgroundColor = "#28a745"; // verde si está logueado
    userIcon.title = "Mi cuenta";
  } else {
    userIcon.style.backgroundColor = "#ccc"; // gris si no
    userIcon.title = "Iniciar sesión o registrarse";
  }
