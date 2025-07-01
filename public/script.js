// public/scripts/script.js

document.addEventListener('DOMContentLoaded', function () {

    // 1. Hover dinámico en el menú
    const menuItems = document.querySelectorAll('.letras_menu a');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.color = 'blue');
        item.addEventListener('mouseleave', () => item.style.color = 'black');
    });

    // 2. Search toggle (con búsqueda flexible de certificados)
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.getElementById('searchInput');
    let certificados = [];
    let certificadosCargados = false;

    // Cargar todos los certificados una sola vez
    async function cargarCertificados() {
        if (certificadosCargados) return;
        try {
            const response = await fetch('https://iyayku2-production-c032.up.railway.app/api/certificados-todos');
            certificados = await response.json();
            certificadosCargados = true;
        } catch (err) {
            certificados = [];
            certificadosCargados = true;
        }
    }

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

        searchInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Escape') {
                searchInput.classList.remove('visible');
                searchToggle.style.display = 'inline-block';
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (searchTerm) {
                    await cargarCertificados();
                    buscarCertificadosFlexible(searchTerm);
                }
            }
        });
    }

    /**
     * Busca certificados por coincidencia parcial en autor o título (no requiere login)
     * @param {string} searchTerm
     */
    function buscarCertificadosFlexible(searchTerm) {
        const resultados = certificados.filter(cert =>
            (cert.autor_nombre && cert.autor_nombre.toLowerCase().includes(searchTerm)) ||
            (cert.articulo_titulo && cert.articulo_titulo.toLowerCase().includes(searchTerm))
        );
        mostrarResultadosCertificados(resultados);
    }

    /**
     * Muestra los resultados de la búsqueda en la página.
     * @param {Array} resultados - Un array de objetos de certificado.
     */
    function mostrarResultadosCertificados(resultados) {
        const container = document.getElementById('resultados-busqueda');
        if (!container) {
            console.error('No se encontró el contenedor #resultados-busqueda en el HTML.');
            return;
        }

        container.innerHTML = '';
        const titulo = document.createElement('h2');
        titulo.textContent = 'Resultados de la Búsqueda';
        container.appendChild(titulo);

        if (resultados.length === 0) {
            container.innerHTML += '<p>No se encontraron certificados.</p>';
            return;
        }

        resultados.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'tarjeta-resultado';
            card.style = 'background: #fff; color: #222; margin-bottom: 1rem; padding: 1rem; border-radius: 8px;';

            const certTitulo = document.createElement('h3');
            certTitulo.textContent = cert.articulo_titulo || cert.titulo || '';

            const certAutor = document.createElement('p');
            certAutor.textContent = `Autor: ${cert.autor_nombre || cert.autor || ''}`;

            const certLink = document.createElement('a');
            certLink.href = cert.articulo_url || cert.archivo_url || '#';
            certLink.textContent = 'Ver Certificado';
            certLink.target = '_blank';

            card.appendChild(certTitulo);
            card.appendChild(certAutor);
            card.appendChild(certLink);

            container.appendChild(card);
        });
    }

    // 3. Slider
    const slider = document.getElementById('slider');
    if (slider) {
        const images = slider.querySelectorAll('img');
        const imgCount = images.length;
        if (imgCount > 0) {
            const imgWidth = images[0].clientWidth;
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
    }
    
    // 4. Modo oscuro (AHORA DENTRO DE DOMCONTENTLOADED)
    const toggleDark = document.getElementById('toggle-dark');
    if (toggleDark) {
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
        
        setDarkMode(localStorage.getItem('modoOscuro') === '1');
        
        toggleDark.addEventListener('click', () => {
            setDarkMode(!document.body.classList.contains('modo-oscuro'));
        });
    }

}); // <-- FIN DEL DOMCONTENTLOADED