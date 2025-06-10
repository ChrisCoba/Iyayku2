document.addEventListener('DOMContentLoaded', function () {

  // --- LÓGICA PARA VERIFICAR SI EL USUARIO ESTÁ LOGUEADO ---
    // Esta función se ejecuta en cada carga de página
    async function verificarLogin() {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                actualizarUIAUsuarioLogueado(data.usuario);
            } else {
                actualizarUIAVisitante();
            }
        } catch (error) {
            console.error('No se pudo verificar el estado del login:', error);
            actualizarUIAVisitante();
        }
    }

    function actualizarUIAUsuarioLogueado(usuario) {
        document.getElementById('menu-registro')?.remove(); // Oculta el botón de "Registro"

        const menuUsuario = document.getElementById('menu-usuario');
        const nombreUsuarioEl = document.getElementById('nombre-usuario');
        if (menuUsuario && nombreUsuarioEl) {
            nombreUsuarioEl.textContent = usuario.nombre; // Pone el nombre del usuario
            menuUsuario.style.display = 'flex'; // Muestra el menú de usuario
        }
        
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', async (e) => {
                e.preventDefault();
                await fetch('/api/logout');
                alert('Has cerrado sesión.');
                window.location.reload(); // Recarga la página
            });
        }
    }

    function actualizarUIAVisitante() {
        document.getElementById('menu-usuario')?.remove(); // Oculta el menú de usuario
    }

    // ¡Llamamos a la función al cargar la página!
    verificarLogin();
    // --- FIN DE LA LÓGICA DE LOGIN ---

  // Hover dinámico en el menú
  const menuItems = document.querySelectorAll('.letras_menu a');
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => item.style.color = 'blue');
    item.addEventListener('mouseleave', () => item.style.color = 'black');
  });

  // Search toggle
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');

  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
      searchToggle.style.display = 'none';
      searchInput.classList.add('visible');
      searchInput.focus();
    });

    searchInput.addEventListener('blur', () => {
      searchInput.classList.remove('visible');
      searchToggle.style.display = 'inline-block';
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.classList.remove('visible');
        searchToggle.style.display = 'inline-block';
      }
    });
  }

  // Slider
  const slider = document.getElementById('slider');
  if (slider) {
    const images = slider.querySelectorAll('img');
    const imgCount = images.length;
    const imgWidth = images[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(slider).gap) || 30;

    for (let i = 0; i < imgCount; i++) {
      const clone = images[i].cloneNode(true);
      slider.appendChild(clone);
    }

    let index = 0;
    function moveSlider(step = 1) {
      index += step;
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(${-index * (imgWidth + gap)}px)`;

      if (index >= imgCount) {
        setTimeout(() => {
          slider.style.transition = 'none';
          index = 0;
          slider.style.transform = `translateX(0px)`;
        }, 500);
      }
    }

    document.querySelector('.next')?.addEventListener('click', () => moveSlider(1));
    document.querySelector('.prev')?.addEventListener('click', () => {
      if (index === 0) {
        slider.style.transition = 'none';
        index = imgCount;
        slider.style.transform = `translateX(${-index * (imgWidth + gap)}px)`;
        setTimeout(() => {
          slider.style.transition = 'transform 0.5s ease-in-out';
          index--;
          slider.style.transform = `translateX(${-index * (imgWidth + gap)}px)`;
        }, 20);
      } else {
        moveSlider(-1);
      }
    });

    setInterval(() => moveSlider(1), 2500);
  }
});

// Modo oscuro
  const toggleDark = document.getElementById('toggle-dark');
  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('modo-oscuro');
      localStorage.setItem('modoOscuro', '1');
      toggleDark.textContent = '☀️';
    } else {
      document.body.classList.remove('modo-oscuro');
      localStorage.setItem('modoOscuro', '0');
      toggleDark.textContent = '🌙';
    }
  }
  // Inicializar según preferencia
  setDarkMode(localStorage.getItem('modoOscuro') === '1');
  toggleDark.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('modo-oscuro'));
  });
