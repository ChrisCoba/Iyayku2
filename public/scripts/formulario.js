document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formularioContacto');
  const nombres = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const correo = document.getElementById('correo');
  const pais = document.getElementById('pais');
  const ciudad = document.getElementById('ciudad');
  const telefono = document.getElementById('telefono');
  const mensaje = document.getElementById('mensaje');
  const codigoPais = document.getElementById('codigoPais');

  // Validación: si no existen los selects, lanza advertencia
  if (!pais || !ciudad) {
    console.error("No se encontraron los elementos <select> con id 'pais' o 'ciudad'");
    return;
  }

  // Cargar países desde la API
  fetch('https://countriesnow.space/api/v0.1/countries/positions')
    .then(response => response.json())
    .then(data => {
      data.data.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = p.name;
        pais.appendChild(option);
      });
    })
    .catch(err => console.error('Error al cargar países:', err));

  // Cargar ciudades al seleccionar un país
  pais.addEventListener('change', () => {
    const selectedCountry = pais.value;

    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: selectedCountry })
    })
      .then(response => response.json())
      .then(data => {
        ciudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
        data.data.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          ciudad.appendChild(option);
        });
      })
      .catch(err => console.error('Error al cargar ciudades:', err));
  });

  // Evita números en nombres y apellidos
  const bloquearNumeros = (event) => {
    const char = String.fromCharCode(event.which);
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(char)) {
      event.preventDefault();
      alert("No se permiten números ni símbolos en este campo.");
    }
  };

  nombres.addEventListener('keypress', bloquearNumeros);
  apellidos.addEventListener('keypress', bloquearNumeros);

  // Validaciones al enviar el formulario
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value);
    const telefonoValido = /^\d{10}$/.test(telefono.value);
    const mensajeValido = mensaje.value.length <= 200;

    if (!correoValido) {
      alert('Ingrese un correo electrónico válido.');
      return;
    }

    if (!pais.value) {
      alert('Seleccione un país.');
      return;
    }

    if (!ciudad.value) {
      alert('Seleccione una ciudad.');
      return;
    }

    if (!telefonoValido) {
      alert('El número de teléfono debe contener exactamente 10 dígitos.');
      return;
    }

    if (!mensajeValido) {
      alert('El mensaje no debe exceder los 200 caracteres.');
      return;
    }

    // Todo bien
    alert('Formulario enviado correctamente.');
    formulario.reset();
    codigoPais.textContent = '+';
    ciudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
  });
});
