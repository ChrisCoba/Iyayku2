export function renderServicios() {
  const html = `
    <header class="bg-white text-black flex flex-wrap items-center justify-between px-6 py-4 shadow-md">
      <div class="logo flex-shrink-0">
        <img src="/img/logo" alt="Logo" class="h-8 object-contain" />
      </div>
      <nav id="main-menu" class="w-full md:w-auto md:flex md:items-center mt-4 md:mt-0 hidden md:block">
        <ul class="flex flex-col md:flex-row gap-4 letras_menu w-full md:w-auto">
          <li><a href="#inicio" class="hover-effect block py-2 px-4">Inicio</a></li>
          <li><a href="#nosotros" class="hover-effect block py-2 px-4">Nosotros</a></li>
          <li><a href="#editorial" class="hover-effect block py-2 px-4">Editorial</a></li>
          <li><a href="#servicios" class="hover-effect block py-2 px-4">Servicios</a></li>
          <li><a href="#contacto" class="hover-effect block py-2 px-4">Contáctanos</a></li>
        </ul>
      </nav>
      <div class="social-icons">
        <a href="#registro" title="Iniciar sesión o registrarse">
          <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-blue-500 transition">
            <img src="/svg/user" alt="Usuario" class="w-6 h-6 text-white" />
          </div>
        </a>
        <a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D"
          target="_blank" rel="noopener noreferrer">
          <img src="/svg/whatsapp" alt="WhatsApp" class="h-5 w-5 hover:scale-110 transition" />
        </a>
        <a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer">
          <img src="/svg/facebook" alt="Facebook" class="h-5 w-5 hover:scale-110 transition" />
        </a>
        <a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer">
          <img src="/svg/instagram" alt="Instagram" class="h-5 w-5 hover:scale-110 transition" />
        </a>
        <a id="searchToggle" class="cursor-pointer">
          <img src="/svg/lupa" alt="Buscar" class="h-5 w-5 hover:scale-110 transition" />
        </a>
        <input id="searchInput" type="text" placeholder="Buscar..."
          class="hidden ml-2 px-2 py-1 rounded border border-gray-300 shadow text-black transition-all duration-300" />
      </div>
    </header>
    <div id="login-status-banner" style="display:none;position:fixed;top:0;right:0;z-index:9999;background:#3498db;color:#fff;padding:8px 18px;border-radius:0 0 0 12px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.10);">
      <span id="login-status-text"></span>
      <a id="perfil-link" href="#perfil" style="color:#fff;text-decoration:underline;margin-left:10px;display:none;">Ir a perfil</a>
    </div>
    <main>
      <section class="servicios-precios-section">
        <div class="servicios-precios-container">
          <h2 class="servicios-precios-title">Nuestros Servicios y Precios</h2>
          <div id="servicios-dinamicos" class="servicios-precios-cards"></div>
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="footer-col">
        <h3>Dirección</h3>
        <p>Dirección: Av. Amazonas y Colón, Quito – Ecuador</p>
      </div>
      <div class="footer-col">
        <h3>Síguenos</h3>
        <div class="footer-socials">
          <a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D" target="_blank" rel="noopener noreferrer">
            <img src="/svg/whatsapp" alt="WhatsApp" />
          </a>
          <a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer">
            <img src="/svg/facebook" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer">
            <img src="/svg/instagram" alt="Instagram" />
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h3>Información</h3>
        <p>Email: iyayku@gmail.com</p>
        <p>Teléfonos: 0995000484 · 0979369650 · 0997000496</p>
      </div>
    </footer>
    <div id="carrito-flotante" class="carrito-flotante">
      <button id="carrito-toggle" class="carrito-toggle-btn">
        🛒 <span id="carrito-cantidad">0</span>
      </button>
      <div id="carrito-panel" class="carrito-panel">
        <div class="carrito-header">
          <span>Mi Carrito</span>
          <button id="carrito-cerrar" class="carrito-cerrar-btn">&times;</button>
        </div>
        <div id="carrito-items" class="carrito-items">
          <p class="carrito-vacio">El carrito está vacío.</p>
        </div>
        <div class="carrito-footer">
          <span>Total: $<span id="carrito-total">0</span></span>
          <button id="carrito-comprar" class="carrito-comprar-btn">Comprar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('contenido-dinamico').innerHTML = html;

  // Cargar servicios dinámicamente desde la base de datos
  (async function() {
    const cont = document.getElementById('servicios-dinamicos');
    if (!cont) return;
    cont.innerHTML = '<p style="color:#222;background:#fff;padding:1em;border-radius:8px;">Cargando servicios...</p>';
    try {
      const res = await fetch('/api/servicios');
      const servicios = await res.json();
      if (!Array.isArray(servicios) || servicios.length === 0) {
        cont.innerHTML = '<p style="color:#222;background:#fff;padding:1em;border-radius:8px;">No hay servicios disponibles.</p>';
        return;
      }
      cont.innerHTML = '';
      servicios.forEach((s, idx) => {
        const colores = ['card-blue','card-yellow','card-purple','card-orange','card-green'];
        const color = colores[idx % colores.length];
        const items = s.descripcion ? s.descripcion.split(',').map(i => `<li>${i.trim()}</li>`).join('') : '';
        cont.innerHTML += `
          <div class="servicio-precio-card ${color}">
            <div class="servicio-precio-header">${s.nombre}</div>
            <ul>${items}</ul>
            <div class="servicio-precio-precio">$${s.precio}</div>
            <button class="servicio-precio-btn" data-descripcion="${encodeURIComponent(s.descripcion || '')}">Comprar</button>
          </div>
        `;
      });
      cont.querySelectorAll('.servicio-precio-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const card = btn.closest('.servicio-precio-card');
          const nombre = card.querySelector('.servicio-precio-header').textContent.trim();
          const precio = parseFloat(card.querySelector('.servicio-precio-precio').textContent.replace('$', '').trim());
          const descripcion = decodeURIComponent(btn.getAttribute('data-descripcion') || '');
          if (window.agregarAlCarrito) {
            window.agregarAlCarrito(nombre, precio, descripcion);
          } else if (typeof agregarAlCarrito === 'function') {
            agregarAlCarrito(nombre, precio, descripcion);
          } else {
            alert('No se pudo añadir al carrito.');
          }
        });
      });
    } catch (e) {
      cont.innerHTML = '<p style="color:#222;background:#fff;padding:1em;border-radius:8px;">Error al cargar servicios.</p>';
    }
  })();

  // Mostrar banner de login si está logueado
  fetch('/api/status', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.usuario && data.usuario.correo) {
        const banner = document.getElementById('login-status-banner');
        const text = document.getElementById('login-status-text');
        const perfilLink = document.getElementById('perfil-link');
        text.textContent = `Sesión iniciada: ${data.usuario.nombre || data.usuario.correo}`;
        if (data.usuario.correo === 'admin@iyayku.com') {
          perfilLink.style.display = '';
        } else {
          perfilLink.style.display = 'none';
        }
        banner.style.display = '';
      }
    });

  // Inicializa el carrito si tienes scripts separados
  if (window.initCarrito) window.initCarrito();
}