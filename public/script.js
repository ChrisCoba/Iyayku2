// public/scripts/script.js

document.addEventListener('DOMContentLoaded', function () {

    // 1. Hover dinámico en el menú
    const menuItems = document.querySelectorAll('.letras_menu a');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.color = 'blue');
        item.addEventListener('mouseleave', () => item.style.color = 'black');
    });

    // 2. Search toggle (con la nueva lógica de búsqueda)
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
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    buscarCertificados(searchTerm);
                }
            }
        });
    }

    /**
     * Llama a la API para buscar certificados por nombre de autor.
     * @param {string} nombreAutor - El término de búsqueda.
     */
    async function buscarCertificados(nombreAutor) {
        try {
            const response = await fetch(`/api/certificados?nombre=${encodeURIComponent(nombreAutor)}`);

            if (response.status === 401) {
                alert('Debes iniciar sesión para poder buscar certificados.');
                window.location.href = '/Pages/registro_login.html';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error al buscar certificados.');
            }

            const resultados = await response.json();
            mostrarResultados(resultados);

        } catch (error) {
            console.error('Error en la búsqueda:', error);
            alert(error.message);
        }
    }

    /**
     * Muestra los resultados de la búsqueda en la página.
     * @param {Array} resultados - Un array de objetos de certificado.
     */
    function mostrarResultados(resultados) {
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
            container.innerHTML += '<p>No se encontraron certificados para ese autor.</p>';
            return;
        }

        resultados.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'tarjeta-resultado';
            
            const certTitulo = document.createElement('h3');
            certTitulo.textContent = cert.titulo;

            const certAutor = document.createElement('p');
            certAutor.textContent = `Autor: ${cert.autor}`;

            const certLink = document.createElement('a');
            certLink.href = cert.archivo_url;
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