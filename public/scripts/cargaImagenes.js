document.addEventListener('DOMContentLoaded', async () => {
  // Detecta el contenedor y la página actual
  let pagina = '';
  let cont = null;

  // Mapeo de páginas y sus contenedores
  if (document.getElementById('contenido-dinamico')) {
    cont = document.getElementById('contenido-dinamico');
    // Detecta la página por el pathname
    if (location.pathname.endsWith('servicios.html')) pagina = 'servicios';
    else if (location.pathname.endsWith('editorial.html')) pagina = 'editorial';
    else if (location.pathname.endsWith('contacto.html')) pagina = 'contacto';
    else if (location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '') pagina = 'inicio';
  } else if (document.getElementById('main-content')) {
    cont = document.getElementById('main-content');
    if (location.pathname.endsWith('nosotros.html')) pagina = 'nosotros';
  }

  if (!cont || !pagina) return;

  try {
    const res = await fetch(`/api/paginas_contenido?pagina=${pagina}`);
    if (!res.ok) throw new Error('No se pudo cargar el contenido');
    const data = await res.json();

    // Para "nosotros" se cargan todas las secciones, para el resto solo la principal
    if (pagina === 'nosotros') {
      // Agrupa por sección para evitar duplicados
      const seccionesUnicas = [];
      const seccionesVistas = new Set();
      for (const sec of data) {
        if (!seccionesVistas.has(sec.seccion) && sec.seccion !== 'footer') {
          seccionesUnicas.push(sec);
          seccionesVistas.add(sec.seccion);
        }
      }
      cont.innerHTML = '';
      seccionesUnicas.forEach(sec => {
        if (sec.titulo) cont.innerHTML += `<h2>${sec.titulo}</h2>`;
        cont.innerHTML += sec.contenido;
      });
    } else {
      // Solo mostrar la primera sección principal (evita duplicados)
      const item = Array.isArray(data) ? data.find(x => x.seccion === 'principal') : data;
      cont.innerHTML = (item && (item.html || item.contenido)) || '<p>Contenido no disponible.</p>';
      // Si el usuario es admin, mostrar botón de edición
      if (item && item.isAdmin) {
        const btn = document.createElement('button');
        btn.textContent = 'Editar contenido';
        btn.className = 'btn-editar-admin';
        btn.onclick = () => {
          const nuevo = prompt('Editar contenido HTML:', item.html || item.contenido || '');
          if (nuevo !== null) {
            fetch('/api/paginas_contenido', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pagina, seccion: 'principal', titulo: item.titulo || '', contenido: nuevo, orden: item.orden || 1 })
            }).then(r => {
              if (r.ok) location.reload();
              else alert('Error al guardar');
            });
          }
        };
        cont.appendChild(btn);
      }
    }
  } catch (e) {
    cont.innerHTML = '<p>Error cargando contenido.</p>';
  }
});
