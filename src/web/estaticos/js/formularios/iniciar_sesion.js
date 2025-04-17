import { alerta } from '../alerta.js'
const form = document.getElementById('formulario');

const inputEmail = document.getElementById('email');
const inputContrasena = document.getElementById('contrasena');

form.addEventListener('submit', function (e) {
    const email = inputEmail.value.trim();
    const contrasena = inputContrasena.value.trim();

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!email || !contrasena) {
        alerta({ mensaje: 'Por favor, rellena todos los campos', tipo: 'error' });
        e.preventDefault();
        return;
    }

    if (!emailRegex.test(email)) {
        alerta({ mensaje: 'Por favor, ingrese un email válido.', tipo: 'error' });
        e.preventDefault();
        return;
    }
});