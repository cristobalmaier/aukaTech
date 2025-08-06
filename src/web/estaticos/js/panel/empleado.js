import { alerta } from '../alerta.js';
import { peticion } from '../peticion.js';

const socket = io();

// Datos del empleado logeado
const idempleado = parseInt(document.documentElement.dataset.id_usuario);
const nombreempleado = document.documentElement.dataset.nombre;
const apellidoempleado = document.documentElement.dataset.apellido;
const tipoUsuario = document.documentElement.dataset.tipo_usuario;

// Elementos HTML
const formulario = document.getElementById('formulario');
const botonsolicitud = document.getElementById('boton-solicitud');
const botonCancelarsolicitud = document.querySelector('.boton-cancelar');
const botonCerrar = document.querySelector('.boton-cerrar');

const botonesprioridades = document.querySelectorAll('.boton-select');
const inputprioridad = document.getElementById('prioridad-input');
const inputMensaje = document.getElementById('mensaje');
const limiteCaracteres = document.querySelector('.limite-caracteres');
const textoCaracteresRestantes = document.getElementById('caracteres-restantes');
const textoCaracteresMaximos = document.getElementById('caracteres-maximos');

const primerTitulo = document.querySelector('.estado-solicitud-titulo h3');
const estadosolicitud = document.querySelector('.estado-solicitud');
const estadosoporte = document.querySelector('.estado-solicitud-soporte');
const estadosolicitudTitulo = document.querySelector('.estado-soporte-nombre');
const estadosolicitudTexto = document.querySelector('.soporte-mensaje-texto');
const estadoProgresoTodos = document.querySelectorAll('.estado-progreso-item');

const hora_recibido = document.querySelector('.hora_recibido');
const hora_respuesta = document.querySelector('.hora_respuesta');

const notificacion = document.getElementById('notificacion');

/* ////////////////////////////////////////////////////////////////// */
// ! RESPUESTA DE SOLICITUD
socket.on('respuesta-solicitud', (data) => {
    const {
        nombre: nombresoporte,
        apellido: apellidosoporte,
        usuario_id: idempleadosolicitud,
        solicitud_id,
        respuesta
    } = data;

    if (idempleadosolicitud != idempleado) return;

    primerTitulo.innerText = 'Respuesta del soporte';
    estadosoporte.classList.remove('esconder');
    estadosolicitudTitulo.innerText = nombresoporte + " " + apellidosoporte;
    estadosolicitudTexto.innerText = respuesta;
    estadoProgresoTodos[1].classList.replace('estado-progreso-idle', 'estado-progreso-encamino');
    estadoProgresoTodos[1].querySelector('.fa-circle')?.classList.replace('fa-circle', 'fa-arrow-right');
    botonCancelarsolicitud?.classList.add('esconder');

    const hora = new Date();
    hora_respuesta.innerText = `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`;

    notificacion.play();
});

/* ////////////////////////////////////////////////////////////////// */
// ! TERMINAR SOLICITUD
socket.on('terminar-solicitud', (data) => {
    const {
        nombre: nombresoporte,
        apellido: apellidosoporte,
        usuario_id: idempleadosolicitud,
        respuesta
    } = data;

    if (idempleadosolicitud != idempleado) return;

    botonCerrar?.classList.remove('esconder');
    estadoProgresoTodos[2].querySelector('.fa-circle')?.classList.replace('fa-circle', 'fa-face-smile');
    estadoProgresoTodos[2].classList.replace('estado-progreso-idle', 'estado-progreso-finalizado');
});

/* ////////////////////////////////////////////////////////////////// */
// ! CERRAR SOLICITUD
botonCerrar?.addEventListener('click', () => {
    desbloquearFormulario();
});

/* ////////////////////////////////////////////////////////////////// */
// ! CANCELAR SOLICITUD
botonCancelarsolicitud?.addEventListener('click', async () => {
    const id_solicitud = formulario.dataset.id_solicitud;

    if (!id_solicitud) return;

    const resultado = await peticion({
        url: '/api/solicitud/actualizar/' + id_solicitud,
        metodo: 'PUT',
        cuerpo: {
            finalizado: true,
            cancelado: true
        }
    });

    if (!resultado.ok) {
        alerta({ mensaje: 'Error al cancelar la solicitud', tipo: 'error' });
        return;
    }

    socket.emit('cancelar-solicitud', {
        usuario_id: idempleado,
        nombre: nombreempleado,
        apellido: apellidoempleado,
        fecha_envio: new Date()
    });

    desbloquearFormulario();
});

/* ////////////////////////////////////////////////////////////////// */
// ! LLAMAR SOPORTE
botonsolicitud?.addEventListener('click', async () => {
    const mensaje = inputMensaje.value.trim();
    const prioridad = parseInt(inputprioridad.value);
    const area = parseInt(formulario.area.value);

    if (!mensaje) {
        inputMensaje.focus();
        inputMensaje.style.borderColor = '#FF0000';
        return alerta({ mensaje: 'Por favor, escribe tu mensaje', tipo: 'error' });
    }

    if (mensaje.length > 300) {
        inputMensaje.focus();
        inputMensaje.style.borderColor = '#FF0000';
        return alerta({ mensaje: 'Estás sobrepasando el límite de caracteres', tipo: 'error' });
    }

    if (!area) {
        return alerta({ mensaje: 'Selecciona un área válida', tipo: 'error' });
    }

    bloquearFormulario();

    const resultado = await peticion({
        url: '/api/solicitud/crear',
        metodo: 'POST',
        cuerpo: {
            id_soporte: null,
            id_emisor: idempleado,
            id_area: area,
            numero_prioridad: prioridad,
            mensaje
        }
    });

    if (!resultado.ok) {
        const errorTexto = await resultado.text();
        console.error('Error del servidor:', resultado.status, errorTexto);
        alerta({ mensaje: `Error: ${errorTexto}`, tipo: 'error' });
        return;
    }

    const solicitudInfo = await resultado.json();

    socket.emit('nuevo-solicitud', {
        usuario: {
            id: idempleado,
            nombre: nombreempleado,
            apellido: apellidoempleado,
            tipo_usuario: tipoUsuario
        },
        solicitud: {
            id: solicitudInfo.data.id,
            fecha_envio: new Date(),
            numero_prioridad: prioridad,
            mensaje
        }
    });

    formulario.dataset.id_solicitud = solicitudInfo.data.id;
    formulario.dataset.mensaje = mensaje;

    estadosolicitud?.classList.remove('esconder');
    botonsolicitud.disabled = true;
    botonesprioridades.forEach(boton => boton.disabled = true);

    primerTitulo.innerText = 'Esperando respuesta...';
    estadosoporte?.classList.add('esconder');
    botonCerrar?.classList.add('esconder');
    botonCancelarsolicitud?.classList.remove('esconder');

    const hora = new Date();
    hora_recibido.innerText = `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`;
});

/* ////////////////////////////////////////////////////////////////// */
// ! SELECCIÓN DE PRIORIDAD
botonesprioridades.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesprioridades.forEach(btn => btn.classList.remove('selected'));
        boton.classList.add('selected');
        inputprioridad.value = boton.dataset.prioridad;
    });
});

/* ////////////////////////////////////////////////////////////////// */
// ! CARACTERES RESTANTES
inputMensaje?.addEventListener('input', calcularCaracteres);

function calcularCaracteres() {
    const caracteres = inputMensaje.value.length;
    const maximo = parseInt(textoCaracteresMaximos.innerText);

    textoCaracteresRestantes.innerText = caracteres;

    if (caracteres > maximo) {
        inputMensaje.style.borderColor = '#FF0000';
        limiteCaracteres.style.color = '#FF0000';
    } else {
        inputMensaje.style.borderColor = 'var(--color-borde)';
        limiteCaracteres.style.color = 'var(--color-texto-secundario)';
    }
}

/* ////////////////////////////////////////////////////////////////// */
// FUNCIONES AUXILIARES
function bloquearFormulario() {
    botonsolicitud.disabled = true;
    botonesprioridades.forEach(boton => boton.disabled = true);
    estadosolicitud?.classList.remove('esconder');
}

function desbloquearFormulario() {
    formulario.reset();
    formulario.dataset.id_solicitud = '';
    formulario.dataset.mensaje = '';

    botonsolicitud.disabled = false;
    botonesprioridades.forEach(boton => boton.disabled = false);

    estadosolicitud?.classList.add('esconder');
    estadosoporte?.classList.add('esconder');
    botonCerrar?.classList.add('esconder');
    botonCancelarsolicitud?.classList.add('esconder');

    primerTitulo.innerText = 'Esperando respuesta...';
    hora_recibido.innerText = '';
    hora_respuesta.innerText = '';
}

// Cargar áreas dinámicamente
async function cargarAreas() {
    try {
        const res = await fetch('/api/areas');
        const areas = await res.json();

        const select = document.getElementById('area');
        select.innerHTML = ''; // Limpiar opciones previas

        if (!Array.isArray(areas) || areas.length === 0) {
            select.innerHTML = '<option disabled selected>No hay áreas disponibles</option>';
            return;
        }

        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.id_area;
            option.textContent = area.area;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar áreas:', error);
        document.getElementById('area').innerHTML = '<option disabled selected>Error al cargar áreas</option>';
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarAreas);