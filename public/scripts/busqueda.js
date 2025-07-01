// Búsqueda de certificados por autor o título (búsqueda parcial)
document.addEventListener('DOMContentLoaded', () => {
  let certificados = [];

  // Trae todos los certificados al cargar la página
  fetch('https://iyayku2-production-c032.up.railway.app/api/certificados-todos')
    .then(res => res.json())
    .then(data => {
      certificados = data;
    });

  const input = document.getElementById('input-busqueda-certificados');
  const resultadosDiv = document.getElementById('resultados-certificados');

  if (!input || !resultadosDiv) return;

  input.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    resultadosDiv.innerHTML = '';

    if (!query) return;

    const filtrados = certificados.filter(cert =>
      cert.autor_nombre.toLowerCase().includes(query) ||
      cert.articulo_titulo.toLowerCase().includes(query)
    );

    if (filtrados.length === 0) {
      resultadosDiv.innerHTML = '<p>No se encontraron certificados.</p>';
      return;
    }

    filtrados.forEach(cert => {
      const div = document.createElement('div');
      div.className = 'certificado-item';
      div.style = 'background: #fff; color: #222; margin-bottom: 1rem; padding: 1rem; border-radius: 8px;';
      // Si tienes ambos: la URL del artículo y la del PDF, usa ambos campos
      // Aquí asumimos que cert.articulo_url es la ruta del PDF y cert.articulo_pagina es la URL del artículo
      div.innerHTML = `
        <strong>Autor:</strong> ${cert.autor_nombre}<br>
        <strong>Artículo:</strong> ${cert.articulo_titulo}<br>
        <strong>Enlace al artículo:</strong> ${cert.articulo_pagina ? `<a href="${cert.articulo_pagina}" target="_blank">${cert.articulo_pagina}</a>` : 'No disponible'}<br>
        <strong>Enlace al PDF:</strong> ${cert.articulo_url ? `<a href="${cert.articulo_url}" target="_blank">${cert.articulo_url}</a>` : 'No disponible'}
        <div class="visor-pdf" style="margin-top:1rem;">
          ${cert.articulo_url && cert.articulo_url.endsWith('.pdf')
            ? `<embed src="${cert.articulo_url}" type="application/pdf" width="100%" height="400px" style="border:1px solid #ccc;" />`
            : '<em>No hay vista previa de PDF disponible</em>'}
        </div>
      `;
      resultadosDiv.appendChild(div);
    });
  });
});
