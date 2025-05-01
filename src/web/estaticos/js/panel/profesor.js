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

const botonesNiveles = document.querySelectorAll('.boton-select')
const inputNivel = document.getElementById('nivel-input')
const inputMensaje = document.getElementById('mensaje')
const limiteCaracteres = document.querySelector('.limite-caracteres')
const textoCaracteresRestantes = document.getElementById('caracteres-restantes')
const textoCaracteresMaximos = document.getElementById('caracteres-maximos')

const estadoLlamado = document.querySelector('.estado-llamado')
const estadoLlamadoTitulo = document.querySelector('.estado-llamado-titulo')
const estadoLlamadoTexto = document.querySelector('.estado-llamado-texto')


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

    estadoLlamadoTitulo.innerText = nombrePreceptor + " " + apellidoPreceptor
    estadoLlamadoTexto.innerText = respuesta
    botonCancelarLlamado.classList.add('esconder')
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

    desbloquearFormulario()
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR LLAMADO (BOTON DE CANCELAR)

botonCancelarLlamado.addEventListener('click', () => {
    const mensaje = formulario.dataset.mensaje

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
            id_curso: 12,
            numero_nivel: nivel,
            mensaje
        }
    })

    if (!resultado.ok) {
        console.log(resultado)
        alert('ERROR GARRAFAL')
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
    estadoLlamado.classList.add('esconder')
    estadoLlamadoTitulo.innerText = 'Estado de tu llamado'
    estadoLlamadoTexto.innerText = 'Pendiente...'
    botonLlamado.disabled = false
    botonesNiveles.forEach(boton => boton.disabled = false)
}