const video = document.getElementById("miVideo");
const playPause = document.getElementById("playPause");
const progreso = document.getElementById("progreso");
const tiempoActual = document.getElementById("tiempoActual");
const duracion = document.getElementById("duracion");
const mute = document.getElementById("mute");
const volumen = document.getElementById("volumen");
const pantallaCompleta = document.getElementById("pantallaCompleta");

if (
  video && playPause && progreso &&
  tiempoActual && duracion && mute && volumen && pantallaCompleta
) {
  // Asegura que el video pueda reproducirse tras interacción
  playPause.addEventListener("click", () => {
    if (video.paused || video.ended) {
      video.play().catch(() => {
        // Si hay error, muestra controles nativos como fallback
        video.setAttribute("controls", "controls");
      });
    } else {
      video.pause();
    }
  });

  // Actualiza el icono al cambiar el estado
  video.addEventListener("play", () => {
    playPause.textContent = "⏸️";
  });
  video.addEventListener("pause", () => {
    playPause.textContent = "▶️";
  });

  // Duración y tiempo actual
  video.addEventListener("loadedmetadata", () => {
    duracion.textContent = formatearTiempo(video.duration);
    progreso.value = 0;
    tiempoActual.textContent = "0:00";
  });

  video.addEventListener("timeupdate", () => {
    if (video.duration) {
      progreso.value = (video.currentTime / video.duration) * 100;
      tiempoActual.textContent = formatearTiempo(video.currentTime);
    }
  });

  progreso.addEventListener("input", () => {
    if (video.duration) {
      video.currentTime = (progreso.value / 100) * video.duration;
    }
  });

  // Volumen
  volumen.addEventListener("input", () => {
    video.volume = volumen.value;
    video.muted = video.volume === 0;
    actualizarIconoMute();
  });

  mute.addEventListener("click", () => {
    video.muted = !video.muted;
    actualizarIconoMute();
    if (!video.muted && video.volume === 0) {
      video.volume = 0.5;
      volumen.value = 0.5;
    }
  });

  video.addEventListener("volumechange", actualizarIconoMute);

  function actualizarIconoMute() {
    mute.textContent = (video.muted || video.volume === 0) ? "🔇" : "🔈";
  }

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

  // Permite reproducir el video al hacer click sobre él
  video.addEventListener("click", () => {
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  });
}

// Formatear tiempo a mm:ss
function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}