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

    formulario.dataset.mensaje = ''
    estadoLlamado.classList.add('esconder')
    estadoLlamadoTitulo.innerText = 'Estado de tu llamado'
    estadoLlamadoTexto.innerText = 'Pendiente...'
    botonLlamado.disabled = false
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

    formulario.dataset.mensaje = ''
    estadoLlamado.classList.add('esconder')
    estadoLlamadoTitulo.innerText = 'Estado de tu llamado'
    estadoLlamadoTexto.innerText = 'Pendiente...'
    botonLlamado.disabled = false
})

/* ////////////////////////////////////////////////////////////////// */

// ! LLAMADO (BOTON DE LLAMAR)

botonLlamado.addEventListener('click', async () => {
    const mensaje = formulario.mensaje.value

    formulario.dataset.mensaje = mensaje
    estadoLlamado.classList.remove('esconder')

    botonLlamado.disabled = true

    const resultado = await peticion({
        url: '/api/llamados/crear',
        metodo: 'POST',
        cuerpo: {
            id_preceptor: null,
            id_emisor: idProfesor,
            id_curso: 12,
            numero_nivel: 1,
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
            mensaje
        }
    })
})