import { alerta } from '../alerta.js';
import { peticion } from '../peticion.js'

const socket = io();

// Datos del profesor logeado
const idProfesor = parseInt(document.documentElement.dataset.id_usuario)
const nombreProfesor = document.documentElement.dataset.nombre
const apellidoProfesor = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

// Elementos HTML
const formulario = document.getElementById('formulario')
const botonLlamado = document.getElementById('boton-llamado')
const botonCancelarLlamado = document.querySelector('.boton-cancelar')
const botonCerrar = document.querySelector('.boton-cerrar')

const botonesNiveles = document.querySelectorAll('.boton-select')
const inputNivel = document.getElementById('nivel-input')
const inputMensaje = document.getElementById('mensaje')
const limiteCaracteres = document.querySelector('.limite-caracteres')
const textoCaracteresRestantes = document.getElementById('caracteres-restantes')
const textoCaracteresMaximos = document.getElementById('caracteres-maximos')

const primerTitulo = document.querySelector('.estado-llamado-titulo h3')
const estadoLlamado = document.querySelector('.estado-llamado')
const estadoPreceptor = document.querySelector('.estado-llamado-preceptor')
const estadoLlamadoTitulo = document.querySelector('.estado-preceptor-nombre')
const estadoLlamadoTexto = document.querySelector('.preceptor-mensaje-texto')
const estadoProgresoTodos = document.querySelectorAll('.estado-progreso-item')

const hora_recibido = document.querySelector('.hora_recibido')
const hora_respuesta = document.querySelector('.hora_respuesta')

const notificacion = document.getElementById('notificacion')

/* ////////////////////////////////////////////////////////////////// */

// ! RESPUESTA DE LLAMADO (BOTONES DE RESPUESTA DE LOS PRECEPTORES)

socket.on('respuesta-llamado', (data) => {
    const {
        nombre: nombrePreceptor,
        apellido: apellidoPreceptor,
        usuario_id: idProfesorLlamado,
        llamado_id,
        respuesta
    } = data

    // Si el llamado no es del mismo profesor, no se muestra la respuesta
    if (idProfesorLlamado != idProfesor) return

    // Mostrar notificacion
    primerTitulo.innerText = 'Respuesta del preceptor'
    estadoPreceptor.classList.remove('esconder')
    estadoLlamadoTitulo.innerText = nombrePreceptor + " " + apellidoPreceptor
    estadoLlamadoTexto.innerText = respuesta
    estadoProgresoTodos[1].classList.replace('estado-progreso-idle', 'estado-progreso-encamino')
    estadoProgresoTodos[1].querySelector('.fa-circle').classList.replace('fa-circle', 'fa-arrow-right')
    botonCancelarLlamado.classList.add('esconder')

    const hora = new Date()
    hora_respuesta.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    
    notificacion.play() // Sonido de notificacion
})

/* ////////////////////////////////////////////////////////////////// */

// ! TERMINAR LLAMADO (BOTON DE TERMINAR DE LOS PRECEPTORES)

socket.on('terminar-llamado', (data) => {
    const {
        nombre: nombrePreceptor,
        apellido: apellidoPreceptor,
        usuario_id: idProfesorLlamado,
        respuesta
    } = data

    // Si el llamado es del mismo profesor, no se muestra la respuesta
    if (idProfesorLlamado != idProfesor) return

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

// ! CANCELAR LLAMADO (BOTON DE CANCELAR)

botonCancelarLlamado.addEventListener('click', async () => {
    const mensaje = formulario.dataset.mensaje
    const id_llamado = formulario.dataset.id_llamado

    const resultado = await peticion({
        url: '/api/llamados/actualizar/' + id_llamado,
        metodo: 'PUT',
        cuerpo: {
            finalizado: true,
            cancelado: true
        }
    })

    socket.emit('cancelar-llamado', {
        usuario_id: idProfesor,
        nombre: nombreProfesor,
        apellido: apellidoProfesor,
        fecha_envio: new Date(),
        mensaje
    })

    desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

// ! LLAMADO (BOTON DE LLAMAR)

botonLlamado.addEventListener('click', async () => {
    const mensaje = formulario.mensaje.value
    const nivel = parseInt(formulario.nivel.value)
    const curso = parseInt(formulario.curso.value)

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
        url: '/api/llamados/crear',
        metodo: 'POST',
        cuerpo: {
            id_preceptor: null,
            id_emisor: idProfesor,
            id_curso: curso,
            numero_nivel: nivel,
            mensaje
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if (!resultado.ok) {
        return alerta({ mensaje: 'No se realizar el llamado, intente de nuevo mas tarde.', tipo: 'error' }) 
    }

    const llamadoInfo = await resultado.json()

    socket.emit('nuevo-llamado', {
        usuario: {
            id: idProfesor,
            nombre: nombreProfesor,
            apellido: apellidoProfesor,
            tipo_usuario: tipoUsuario
        },
        llamado: {
            id: llamadoInfo.data.id,
            fecha_envio: new Date(),
            numero_nivel: nivel,
            mensaje
        }
    })

    formulario.dataset.mensaje = mensaje
    estadoLlamado.classList.remove('esconder')
    botonLlamado.disabled = true
    botonesNiveles.forEach(boton => boton.disabled = true)

    primerTitulo.innerText = 'Esperando respuesta...'
    estadoPreceptor.classList.add('esconder')
    estadoLlamadoTitulo.innerText = ''

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    botonCancelarLlamado.classList.remove('esconder')

    const hora = new Date()
    hora_recibido.innerText = `${hora.getHours()}:${hora.getMinutes()}`
    hora_respuesta.innerText = ``

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! SELECCION DE NIVEL DE IMPPORTANCIA DEL LLAMADO

botonesNiveles.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesNiveles.forEach(btn => btn.classList.remove('selected'));
        boton.classList.add('selected');
        inputNivel.value = boton.dataset.nivel;
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
    estadoLlamado.classList.remove('esconder')
    botonLlamado.disabled = true
    botonesNiveles.forEach(boton => boton.disabled = true)
}

function desbloquearFormulario() {
    formulario.dataset.mensaje = ''

    primerTitulo.innerText = 'Esperando respuesta...'
    estadoPreceptor.classList.add('esconder')
    estadoLlamadoTitulo.innerText = ''
    estadoLlamadoTexto.innerText = 'Pendiente...'
    botonLlamado.disabled = false
    botonesNiveles.forEach(boton => boton.disabled = false)

    const faSelector = estadoProgresoTodos[1].querySelector('.fa-arrow-right')
    if(faSelector) faSelector.classList.replace('fa-arrow-right', 'fa-circle')

    const faSelector2 = estadoProgresoTodos[2].querySelector('.fa-face-smile')
    if(faSelector2) faSelector2.classList.replace('fa-face-smile', 'fa-circle')

    botonCerrar.classList.add('esconder')
    estadoLlamado.classList.add('esconder')

    for(const estado of estadoProgresoTodos) {
        estado.classList.replace('estado-progreso-encamino', 'estado-progreso-idle') 
        estado.classList.replace('estado-progreso-finalizado', 'estado-progreso-idle')
    }
}