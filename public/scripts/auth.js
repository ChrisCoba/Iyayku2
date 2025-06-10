document.addEventListener('DOMContentLoaded', () => {
    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    const formRegister = document.getElementById('form-register');
    const formLogin = document.getElementById('form-login');

    // --- MANEJO DE LA ANIMACIÓN DEL PANEL ---
    // Si los elementos para la animación existen, se les añade el evento
    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });

      
    }

    // --- MANEJO DEL FORMULARIO DE REGISTRO ---
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue al enviar el formulario

            // Captura de los valores de los inputs
            const nombre = document.getElementById('register-nombre').value;
            const correo = document.getElementById('register-correo').value;
            const contrasena = document.getElementById('register-contrasena').value;

            try {
                // Petición a la API del backend para registrar
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, correo, contraseña: contrasena })
                });

                // Convertimos la respuesta del servidor a JSON
                const data = await response.json();

                // Si la respuesta NO fue exitosa (ej: status 400, 500)
                if (!response.ok) {
                    throw new Error(data.msg || 'Error en el registro');
                }
                
                // Si la respuesta fue exitosa
                alert('¡Usuario registrado con éxito! Ahora, por favor, inicia sesión.');
                formRegister.reset(); // Limpia el formulario
                container.classList.remove('active'); // Muestra el panel de login

            } catch (error) {
                // Muestra cualquier error en una alerta
                alert(error.message);
            }
        });
    }

    // --- MANEJO DEL FORMULARIO DE LOGIN ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Captura de los valores de los inputs
            const correo = document.getElementById('login-correo').value;
            const contraseña = document.getElementById('login-contrasena').value;

            try {
                // Petición a la API del backend para iniciar sesión
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contraseña })
                });

                const data = await response.json();

                if (!response.ok) {
                    // Si el servidor responde con un error (ej: credenciales inválidas)
                    throw new Error(data.msg || 'Error al iniciar sesión');
                }
                
                // ¡LOGIN EXITOSO!
                alert('¡Login exitoso!');
                
                // Redirigimos al usuario a la página de pago para completar la compra
                window.location.href = '/Pages/pago.html';

            } catch (error) {
                alert(error.message);
            }
        });
    }
});