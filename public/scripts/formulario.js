document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formularioContacto');
  const nombres = document.getElementById('nombres');
  const correo = document.getElementById('correo');
  const pais = document.getElementById('pais');
  const ciudad = document.getElementById('ciudad');
  const telefono = document.getElementById('telefono');
  const mensaje = document.getElementById('mensaje');

  // Cargar países desde la API
  if (pais && ciudad) {
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
      ciudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
      if (!selectedCountry) return;
      fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry })
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            data.data.forEach(city => {
              const option = document.createElement('option');
              option.value = city;
              option.textContent = city;
              ciudad.appendChild(option);
            });
          }
        })
        .catch(err => console.error('Error al cargar ciudades:', err));
    });
  }

  // Bloquear números y símbolos en nombres
  if (nombres) {
    nombres.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });
  }

  // Validaciones al enviar el formulario
  if (formulario) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = nombres.value.trim();
      const telefonoVal = telefono.value.trim();
      const correoVal = correo.value.trim();
      const paisVal = pais.value;
      const ciudadVal = ciudad.value;
      const mensajeVal = mensaje.value.trim();
      const privacidad = formulario.privacidad && formulario.privacidad.checked;

      let errorMsg = '';

      if (!nombre) {
        errorMsg += 'El campo "Nombre y Apellido" es obligatorio.\n';
      } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
        errorMsg += 'El nombre solo debe contener letras y espacios.\n';
      }
      if (!telefonoVal || !/^\d{7,15}$/.test(telefonoVal)) {
        errorMsg += 'Ingrese un teléfono válido (solo números, mínimo 7 dígitos).\n';
      }
      if (!correoVal || !/^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(correoVal)) {
        errorMsg += 'Ingrese un correo electrónico válido.\n';
      }
      if (!paisVal) {
        errorMsg += 'Seleccione un país.\n';
      }
      if (!ciudadVal) {
        errorMsg += 'Seleccione una ciudad.\n';
      }
      if (!mensajeVal) {
        errorMsg += 'El campo "Cuéntanos sobre tu proyecto" es obligatorio.\n';
      } else if (mensajeVal.length > 200) {
        errorMsg += 'El mensaje no debe superar los 200 caracteres.\n';
      }
      if (!privacidad) {
        errorMsg += 'Debe aceptar la Política de Privacidad.\n';
      }

      if (errorMsg) {
        alert(errorMsg);
        return false;
      }

      alert('Formulario enviado correctamente.');
      formulario.reset();
      if (ciudad) ciudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
      return true;
    });
  }
});

