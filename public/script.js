document.addEventListener('DOMContentLoaded', function () {
  // Hover dinámico en el menú
  const menuItems = document.querySelectorAll('.letras_menu a');
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => item.style.color = 'blue');
    item.addEventListener('mouseleave', () => item.style.color = 'black');

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

const video = document.getElementById("miVideo");
  const playPause = document.getElementById("playPause");
  const progreso = document.getElementById("progreso");
  const tiempoActual = document.getElementById("tiempoActual");
  const duracion = document.getElementById("duracion");
  const mute = document.getElementById("mute");
  const volumen = document.getElementById("volumen");
  const pantallaCompleta = document.getElementById("pantallaCompleta");

  if (video && playPause && progreso && tiempoActual && duracion && mute && volumen && pantallaCompleta) {
    // Play / Pause
    playPause.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playPause.textContent = "⏸️";
      } else {
        video.pause();
        playPause.textContent = "▶️";
      }
    });

    // Duración y tiempo actual
    video.addEventListener("loadedmetadata", () => {
      duracion.textContent = formatearTiempo(video.duration);
    });

    video.addEventListener("timeupdate", () => {
      progreso.value = (video.currentTime / video.duration) * 100;
      tiempoActual.textContent = formatearTiempo(video.currentTime);
    });

    progreso.addEventListener("input", () => {
      video.currentTime = (progreso.value / 100) * video.duration;
    });

    // Volumen
    volumen.addEventListener("input", () => {
      video.volume = volumen.value;
      mute.textContent = video.volume === 0 ? "🔇" : "🔈";
    });

    mute.addEventListener("click", () => {
      video.muted = !video.muted;
      mute.textContent = video.muted ? "🔇" : "🔈";
    });

    // Pantalla completa
    pantallaCompleta.addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });

    // Formatear tiempo a mm:ss
    function formatearTiempo(segundos) {
      const m = Math.floor(segundos / 60);
      const s = Math.floor(segundos % 60);
      return `${m}:${s < 10 ? "0" + s : s}`;
    }
  }
});