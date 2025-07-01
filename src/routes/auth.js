document.addEventListener('DOMContentLoaded', () => {
    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const formRegister = document.getElementById('form-register');
    const formLogin = document.getElementById('form-login');

    // --- MANEJO DE LA ANIMACIÓN DEL PANEL ---
    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });
        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }

    // --- REGISTRO ---
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = formRegister.nombre.value.trim();
            const correo = formRegister.correo.value.trim();
            const contrasena = formRegister.contrasena.value;
            try {
                const respReg = await fetch('/api/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, correo, contrasena })
                });
                const data = await respReg.json();
                if (respReg.ok) {
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    formRegister.reset();
                    container.classList.remove('active'); // Cambia a login
                } else {
                    alert(data.msg || 'Error en el registro');
                }
            } catch (err) {
                alert('Error de red o servidor');
            }
        });
    }

    // --- LOGIN ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = formLogin.correo.value.trim();
            const contrasena = formLogin.contrasena.value;
            try {
                const respLogin = await fetch('/api/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contrasena })
                });
                const data = await respLogin.json();
                if (respLogin.ok) {
                    alert('¡Login exitoso!');
                    formLogin.reset();
                    window.location.href = '/Pages/pago.html';
                } else {
                    alert(data.msg || 'Error en el login');
                }
            } catch (err) {
                alert('Error de red o servidor');
            }
        });
    }
});