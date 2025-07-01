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
      div.innerHTML = `
        <strong>Autor:</strong> ${cert.autor_nombre}<br>
        <strong>Artículo:</strong> ${cert.articulo_titulo}<br>
        <strong>Enlace:</strong> <a href="${cert.articulo_url}" target="_blank">${cert.articulo_url}</a>
      `;
      resultadosDiv.appendChild(div);
    });
  });
});
