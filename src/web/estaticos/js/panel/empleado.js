import { alerta } from '../alerta.js';
import { peticion } from '../peticion.js'

const socket = io();

// Datos del empleado logeado
const idempleado = parseInt(document.documentElement.dataset.id_usuario)
const nombreempleado = document.documentElement.dataset.nombre
const apellidoempleado = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

// Elementos HTML
const formulario = document.getElementById('formulario')
const botonsolicitud = document.getElementById('boton-solicitud')
const botonCancelarsolicitud = document.querySelector('.boton-cancelar')
const botonCerrar = document.querySelector('.boton-cerrar')

const botonesprioridades = document.querySelectorAll('.boton-select')
const inputprioridad = document.getElementById('prioridad-input')
const inputMensaje = document.getElementById('mensaje')
const limiteCaracteres = document.querySelector('.limite-caracteres')
const textoCaracteresRestantes = document.getElementById('caracteres-restantes')
const textoCaracteresMaximos = document.getElementById('caracteres-maximos')

const primerTitulo = document.querySelector('.estado-solicitud-titulo h3')
const estadosolicitud = document.querySelector('.estado-solicitud')
const estadosoporte = document.querySelector('.estado-solicitud-soporte')
const estadosolicitudTitulo = document.querySelector('.estado-soporte-nombre')
const estadosolicitudTexto = document.querySelector('.soporte-mensaje-texto')
const estadoProgresoTodos = document.querySelectorAll('.estado-progreso-item')

const hora_recibido = document.querySelector('.hora_recibido')
const hora_respuesta = document.querySelector('.hora_respuesta')

const notificacion = document.getElementById('notificacion')

/* ////////////////////////////////////////////////////////////////// */

// ! RESPUESTA DE solicitud (BOTONES DE RESPUESTA DE LOS soporteES)

socket.on('respuesta-solicitud', (data) => {
    const {
        nombre: nombresoporte,
        apellido: apellidosoporte,
        usuario_id: idempleadosolicitud,
        solicitud_id,
        respuesta
    } = data

    // Si el solicitud no es del mismo empleado, no se muestra la respuesta
    if (idempleadosolicitud != idempleado) return

    // Mostrar notificacion
    primerTitulo.innerText = 'Respuesta del soporte'
    estadosoporte.classList.remove('esconder')
    estadosolicitudTitulo.innerText = nombresoporte + " " + apellidosoporte
    estadosolicitudTexto.innerText = respuesta
    estadoProgresoTodos[1].classList.replace('estado-progreso-idle', 'estado-progreso-encamino')
    estadoProgresoTodos[1].querySelector('.fa-circle').classList.replace('fa-circle', 'fa-arrow-right')
    botonCancelarsolicitud.classList.add('esconder')

    const hora = new Date()
    hora_respuesta.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    
    notificacion.play() // Sonido de notificacion
})

/* ////////////////////////////////////////////////////////////////// */

// ! TERMINAR solicitud (BOTON DE TERMINAR DE LOS soporteES)

socket.on('terminar-solicitud', (data) => {
    const {
        nombre: nombresoporte,
        apellido: apellidosoporte,
        usuario_id: idempleadosolicitud,
        respuesta
    } = data

    // Si el solicitud es del mismo empleado, no se muestra la respuesta
    if (idempleadosolicitud != idempleado) return

    botonCerrar.classList.remove('esconder')
    estadoProgresoTodos[2].querySelector('.fa-circle').classList.replace('fa-circle', 'fa-face-smile')
    estadoProgresoTodos[2].classList.replace('estado-progreso-idle', 'estado-progreso-finalizado')
    // desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

botonCerrar.addEventListener('click', () => {
    desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR solicitud (BOTON DE CANCELAR)

botonCancelarsolicitud.addEventListener('click', async () => {
    const mensaje = formulario.dataset.mensaje
    const id_solicitud = formulario.dataset.id_solicitud

    const resultado = await peticion({
        url: '/api/solicitud/actualizar/' + id_solicitud,
        metodo: 'PUT',
        cuerpo: {
            finalizado: true,
            cancelado: true
        }
    })

    socket.emit('cancelar-solicitud', {
        usuario_id: idempleado,
        nombre: nombreempleado,
        apellido: apellidoempleado,
        fecha_envio: new Date(),
        mensaje
    })

    desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

// ! solicitud (BOTON DE LLAMAR)

botonsolicitud.addEventListener('click', async () => {
    const mensaje = formulario.mensaje.value
    const prioridad = parseInt(formulario.prioridad.value)
    const area = parseInt(formulario.area.value)

    // Validaciones
    if(!mensaje || mensaje.length === 0) {
        formulario.mensaje.focus()
        formulario.mensaje.style.borderColor = '#FF0000'
        return alerta({ mensaje: 'Por favor, escribe tu mensaje', tipo: 'error' })
    }

    if(mensaje.length > 300) {
        formulario.mensaje.focus()
        formulario.mensaje.style.borderColor = '#FF0000'
        return alerta({ mensaje: 'Estas sobrepasando el limite de caracteres', tipo: 'error' })
    }

    // Desactivar botones
    bloquearFormulario({ mensaje })

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
    })

    // Si ocurrio un error en la api se muestra una alerta
    if (!resultado.ok) {
        return alerta({ mensaje: 'No se realizar el solicitud, intente de nuevo mas tarde.', tipo: 'error' }) 
    }

    const solicitudInfo = await resultado.json()

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
    })

    formulario.dataset.mensaje = mensaje
    estadosolicitud.classList.remove('esconder')
    botonsolicitud.disabled = true
    botonesprioridades.forEach(boton => boton.disabled = true)

    primerTitulo.innerText = 'Esperando respuesta...'
    estadosoporte.classList.add('esconder')
    estadosolicitudTitulo.innerText = ''

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    botonCancelarsolicitud.classList.remove('esconder')

    const hora = new Date()
    hora_recibido.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    hora_respuesta.innerText = ``

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! SELECCION DE prioridad DE IMPPORTANCIA DEL solicitud

botonesprioridades.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesprioridades.forEach(btn => btn.classList.remove('selected'));
        boton.classList.add('selected');
        inputprioridad.value = boton.dataset.prioridad;
    });
});

/* ////////////////////////////////////////////////////////////////// */

// ! CARACTERES RESTANTES

inputMensaje.addEventListener('input', () => {
    calcularCaracteres()
})

function calcularCaracteres() {
    const caracteres = inputMensaje.value.length
    const maximo = textoCaracteresMaximos.innerText

    textoCaracteresRestantes.innerText = caracteres

    if(caracteres > maximo) {
        inputMensaje.style.borderColor = '#FF0000'
        limiteCaracteres.style.color = '#FF0000'
        return
    }

    inputMensaje.style.borderColor = 'var(--color-borde)'
    limiteCaracteres.style.color = 'var(--color-texto-secundario)'
}

/* ////////////////////////////////////////////////////////////////// */

function bloquearFormulario({ mensaje }) {
    formulario.dataset.mensaje = mensaje
    estadosolicitud.classList.remove('esconder')
    botonsolicitud.disabled = true
    botonesprioridades.forEach(boton => boton.disabled = true)
}

function desbloquearFormulario() {
    formulario.dataset.mensaje = ''

    primerTitulo.innerText = 'Esperando respuesta...'
    estadosoporte.classList.add('esconder')
    estadosolicitudTitulo.innerText = ''
    estadosolicitudTexto.innerText = 'Pendiente...'
    botonsolicitud.disabled = false
    botonesprioridades.forEach(boton => boton.disabled = false)

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    estadosolicitud.classList.add('esconder')

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
}