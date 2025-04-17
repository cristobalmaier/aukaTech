import { alerta } from '../alerta.js'
const form = document.getElementById('formulario');

const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputEmail = document.getElementById('email');
const inputContrasena = document.getElementById('contrasena');

form.addEventListener('submit', function (e) {
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const email = inputEmail.value.trim();
    const contrasena = inputContrasena.value.trim();

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!nombre || !apellido || !email || !contrasena) {
        alerta({ mensaje: 'Por favor, rellena todos los campos', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (!emailRegex.test(email)) {
        alerta({ mensaje: 'Por favor, ingrese un email válido.', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (nombre.length < 3 || nombre.length > 64) {
        alerta({ mensaje: 'Porfavor, ingrese un nombre válido.', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (apellido.length < 3 || apellido.length > 64) {
        alerta({ mensaje: 'Porfavor, ingrese un apellido válido.', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (contrasena.length < 6) {
        alerta({ mensaje: 'La contraseña debe tener al menos 6 letras o números.', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (contrasena.length > 32) {
        alerta({ mensaje: 'La contraseña debe tener menos de 32 letras o números.', tipo: 'error' });
        e.preventDefault();
        return;
    }
});