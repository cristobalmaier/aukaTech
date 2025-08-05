import { peticion } from '../peticion.js'
import { formatearHora } from '../formatearHora.js'
import { formato } from '../renderizarTiempo.js'
import { alerta } from '../alerta.js'

const socket = io();

// Datos del soporte logeado
const idsoporte = document.documentElement.dataset.id_usuario
const nombresoporte = document.documentElement.dataset.nombre
const apellidosoporte = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

const prioridades = [
    'leve', 'moderado', 'urgente'
]
const respuestas = [
    "Yendo", "En camino", "Enseguida", "Voy para allá"
]

// Elementos HTML
const solicitudContenedor = document.querySelector('.solicitud')
const historialContenedor = document.querySelector('.historial-contenedor')
const noHaysolicitud = document.querySelector('.no-hay-solicitud')
const notificacion = document.getElementById('notificacion')

// timeago.js (para los minutos pasados en tiempo real)
renderizarTiempos();

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuesta = document.querySelectorAll('.respuesta')

for (const botonRespuesta of botonesRespuesta) {
    const solicitud = botonRespuesta.parentElement.parentElement

    const solicitudId = solicitud.dataset.solicitud_id
    const solicitudMensaje = solicitud.dataset.mensaje
    const empleadoId = botonRespuesta.dataset.usuario_id
    const textoRespuesta = botonRespuesta.innerText
    const empleadoNombre = solicitud.dataset.usuario_nombre
    const empleadoApellido = solicitud.dataset.usuario_apellido

    await respondersolicitud({
        empleadoId,
        textoRespuesta,
        botonRespuesta,
        empleadoNombre,
        solicitudMensaje,
        empleadoApellido,
        solicitudId
    })
}

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuestaPersonalizada = document.querySelectorAll('.respuesta-personalizada')

for (const botonRespuestaPersonalizada of botonesRespuestaPersonalizada) {
    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const solicitud = botonRespuestaPersonalizada.parentElement.parentElement

        solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        solicitud.querySelector('.solicitud-respuestas').classList.add('esconder')

        solicitud.querySelector('.respuesta-personalizada-contenedor input').focus()
    })
}

const botonesCancelarRespuestaPersonalizada = document.querySelectorAll('.boton-cancelar-respuesta-personalizada')

for (const boton of botonesCancelarRespuestaPersonalizada) {
    boton.addEventListener('click', async () => {
        const solicitud = boton.parentElement.parentElement.parentElement

        solicitud.querySelector('.respuesta-personalizada').classList.remove('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor').classList.add('esconder')
        solicitud.querySelector('.solicitud-respuestas').classList.remove('esconder')
    })
}

const botonesEnviar = document.querySelectorAll('.boton-respuesta-personalizada')

for (const boton of botonesEnviar) {
    boton.addEventListener('click', async () => {
        const solicitud = boton.parentElement.parentElement.parentElement

        await enviarRespuestaPersonalizada({ boton, solicitud })
    })
}

/* ////////////////////////////////////////////////////////////////// */

async function enviarRespuestaPersonalizada({ boton }) {
    const solicitud = boton.parentElement.parentElement.parentElement

    const solicitudId = solicitud.dataset.solicitud_id
    const mensaje = solicitud.dataset.mensaje
    const empleadoId = solicitud.dataset.usuario_id
    const empleadoNombre = solicitud.dataset.usuario_nombre
    const empleadoApellido = solicitud.dataset.usuario_apellido
    const nombresoporte = document.documentElement.dataset.nombre
    const apellidosoporte = document.documentElement.dataset.apellido
    const textoRespuesta = solicitud.querySelector('.respuesta-personalizada-input').value

    await procesarsolicitud({
        empleadoId,
        solicitudId,
        solicitudMensaje: mensaje,
        textoRespuesta,
        nombresoporte,
        apellidosoporte,
        empleadoNombre,
        empleadoApellido
    })

    solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
    solicitud.querySelector('.respuesta-personalizada-contenedor').classList.add('esconder')
    solicitud.querySelector('.solicitud-respuestas').classList.remove('esconder')
}

/* ////////////////////////////////////////////////////////////////// */

const botonesTerminado = document.querySelectorAll('.respuesta-terminado')

for (const botonTerminado of botonesTerminado) {
    botonTerminado.addEventListener('click', async () => {
        const solicitud = botonTerminado.parentElement.parentElement

        const solicitudId = solicitud.dataset.solicitud_id
        const mensaje = solicitud.dataset.mensaje
        const empleadoId = solicitud.dataset.usuario_id
        const empleadoNombre = solicitud.dataset.usuario_nombre
        const empleadoApellido = solicitud.dataset.usuario_apellido

        await terminarsolicitud({
            empleado: {
                id: empleadoId,
                nombre: empleadoNombre,
                apellido: empleadoApellido
            },
            solicitud: {
                id: solicitudId,
                mensaje
            }
        })
    })
}

/* ////////////////////////////////////////////////////////////////// */

// ! NUEVO solicitud
socket.on('nuevo-solicitud', async (data) => {
    const { usuario: empleado, solicitud } = data

    const prioridadImportancia = prioridades[solicitud.numero_prioridad - 1]
    const nuevosolicitud = document.createElement('div');

    // Animacion
    nuevosolicitud.classList.add('animate__animated', 'animate__fadeInDown')

    // Agregar clases al div
    nuevosolicitud.classList.add('solicitud', prioridadImportancia);
    nuevosolicitud.dataset.usuario_id = empleado.id
    nuevosolicitud.dataset.solicitud_id = solicitud.id
    nuevosolicitud.dataset.usuario_nombre = empleado.nombre
    nuevosolicitud.dataset.usuario_apellido = empleado.apellido
    nuevosolicitud.dataset.mensaje = solicitud.mensaje
    nuevosolicitud.innerHTML = `
                <div class="solicitud-cabecera">
                    <p class="solicitud-titulo">${empleado.nombre} ${empleado.apellido}</p>
                    <p class="solicitud-mensaje">${solicitud.mensaje}</p>
                </div>
                <hr>
                <div class="solicitud-cuerpo">
                    <p><span class="solicitud-cuerpo-texto">solicitud - <span class="fecha-envio" datetime="${solicitud.fecha_envio}"></span></span></p>   
                </div>
                `

    const solicitudRespuestas = document.createElement('div')
    solicitudRespuestas.classList.add('solicitud-respuestas')

    for (const textoRespuesta of respuestas) {
        const respuesta = document.createElement('p')
        respuesta.classList.add('respuesta')
        respuesta.innerText = textoRespuesta
        respuesta.dataset.usuario_id = empleado.id

        await respondersolicitud({
            botonRespuesta: respuesta,
            solicitudId: solicitud.id,
            solicitudMensaje: solicitud.mensaje,
            empleadoId: empleado.id,
            empleadoNombre: empleado.nombre,
            empleadoApellido: empleado.apellido,
            textoRespuesta
        })

        solicitudRespuestas.appendChild(respuesta)
    }

    // respuesta personalizada
    const botonRespuestaPersonalizada = document.createElement('p')
    botonRespuestaPersonalizada.classList.add('respuesta-personalizada')
    botonRespuestaPersonalizada.innerText = 'Respuesta personalizada'
    botonRespuestaPersonalizada.dataset.usuario_id = empleado.id

    const respuestaPersonalizadaContenedor = document.createElement('div')
    respuestaPersonalizadaContenedor.classList.add('respuesta-personalizada-contenedor', 'esconder')

    respuestaPersonalizadaContenedor.innerHTML = `
        <input type="text" name="respuesta-personalizada" class="respuesta-personalizada-input" placeholder="Escribe aquí tu respuesta personalizada...">
        <div class="botones">
            <button type="button" class="boton-respuesta-personalizada">Enviar</button>
            <button type="button" class="boton-cancelar-respuesta-personalizada">Cancelar</button>
        </div>
    `

    const botonEnviarRespuesta = respuestaPersonalizadaContenedor.querySelector('.boton-respuesta-personalizada')
    botonEnviarRespuesta.addEventListener('click', async () => {
        await enviarRespuestaPersonalizada({ boton: botonEnviarRespuesta, solicitud: solicitud })
    })


    solicitudRespuestas.appendChild(botonRespuestaPersonalizada)
    nuevosolicitud.appendChild(respuestaPersonalizadaContenedor)

    botonRespuestaPersonalizada.addEventListener('click', async () => {
        const solicitud = botonRespuestaPersonalizada.parentElement.parentElement

        solicitud.querySelector('.respuesta-personalizada').classList.add('esconder')
        solicitud.querySelector('.respuesta-personalizada-contenedor').classList.remove('esconder')
        solicitud.querySelector('.solicitud-respuestas').classList.add('esconder')
    })

    nuevosolicitud.appendChild(solicitudRespuestas)
    solicitudContenedor.prepend(nuevosolicitud)

    // Eliminar texto de que no hay solicitud
    if (!noHaysolicitud.classList.contains('esconder')) {
        noHaysolicitud.classList.add('esconder')
    }

    // Renderizar tiempo de envio en la vista del panel
    timeago.render(nuevosolicitud.querySelector('.fecha-envio'), 'es')

    // Reproducir sonido de notificacion
    notificacion.play().catch(err => console.warn('Error al reproducir sonido:', err));
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR solicitud
socket.on('cancelar-solicitud', async (data) => {
    const {
        usuario_id: idempleadosolicitud,
        nombre: nombreempleado,
        apellido: apellidoempleado,
        fecha_envio: fechasolicitud,
        mensaje
    } = data

    const solicitud = document.querySelector('.solicitud[data-usuario_id="' + idempleadosolicitud + '"]')

    // Marcar como finalizado y cancelado en la base de datos
    const solicitudId = solicitud.dataset.solicitud_id

    const resultado = await peticion({
        url: '/api/solicitud/actualizar/' + solicitudId,
        metodo: 'PUT',
        cuerpo: {
            id_solicitud: solicitudId,
            finalizado: true,
            cancelado: true
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo cancelar tu solicitud.', tipo: 'error' })
    }

    // Eliminar de la vista
    if (solicitud) solicitud.remove()

    // Agregar al historial
    agregarHistorial({
        nombre: nombreempleado,
        apellido: apellidoempleado,
        mensaje: mensaje,
        estado: 'cancelado',
        fecha: new Date()
    })

    // Mostrar texto si no hay solicitud pendientes
    siNoHaysolicitud({ noHaysolicitud })
})

/* ////////////////////////////////////////////////////////////////// */

// ! ELIMINAR LAS RESPUESTAS DE LOS DEMAS soporteES
// ? Esta funcion elimina las respuestas del solicitud
// ? de los demas soportees cuando responde un solicitud 
// ? para que no puedan responder el mismo solicitud 
// ? dos soportees a la vez
socket.on('eliminar-respuesta-solicitud', (data) => {
    const { soporte_id, solicitud_id } = data

    // Solo elimina respuestas de los otros soportees
    if (soporte_id == idsoporte) return

    const solicitud = document.querySelector(`.solicitud[data-solicitud_id="${solicitud_id}"`)

    if (solicitud) {
        const respuestas = solicitud.querySelector(`.solicitud-respuestas`)
        respuestas.classList.add('esconder')
    }
})

/* ////////////////////////////////////////////////////////////////// */

// ! AGREGAR AL HISTORIAL DE solicitud
socket.on('agregar-historial', (data) => {
    const { solicitud_id, nombre, apellido, mensaje, fecha } = data

    const solicitud = document.querySelector(`.solicitud[data-solicitud_id="${solicitud_id}"`)
    if (solicitud) solicitud.remove()

    // Agregar al historial
    agregarHistorial({
        nombre,
        apellido,
        mensaje,
        fecha
    })

    // Mostrar texto si no hay solicitud pendientes
    siNoHaysolicitud({ noHaysolicitud })
})

/* ////////////////////////////////////////////////////////////////// */

/**
 * @param {Object} usuario
 * @param {Socket} socket
 * @returns {void}
 */
function mostrarBotonesFinales({ empleado, socket, solicitud }) {
    const respuestas = document.querySelectorAll(`.solicitud[data-usuario_id="${empleado.id}"][data-solicitud_id="${solicitud.id}"] .respuesta`)
    const respuestaPersonalizada = document.querySelector(`.solicitud[data-usuario_id="${empleado.id}"][data-solicitud_id="${solicitud.id}"] .respuesta-personalizada`)

    if(respuestaPersonalizada)
        respuestaPersonalizada.classList.add('esconder')

    for (const respuesta of respuestas) {
        respuesta.remove()
    }

    const terminado = document.createElement('p')
    terminado.classList.add('respuesta', 'respuesta-terminado')
    terminado.innerText = 'Terminado'
    terminado.dataset.usuario_id = empleado.id

    terminado.addEventListener('click', async () => {
        await terminarsolicitud({ empleado, solicitud })
    })

    const solicitudRespuestas = document.querySelector(`.solicitud[data-usuario_id="${empleado.id}"][data-solicitud_id="${solicitud.id}"] .solicitud-respuestas`)
    solicitudRespuestas.appendChild(terminado)
}

/* ////////////////////////////////////////////////////////////////// */

function agregarHistorial({ nombre, apellido, mensaje, estado, fecha }) {
    estado = estado ? estado : 'finalizado'

    const historialItem = document.createElement('div')
    historialItem.classList.add('historial-item')
    historialItem.classList.add('animate__animated', 'animate__fadeInDown') // Animacion

    historialItem.innerHTML = `
        <div>
            <div class="historial-item-cabecera">
                <p class="historial-item-titulo">
                    ${nombre} ${apellido}
                </p>
                <p class="historial-item-hora">
                    ${formatearHora(fecha)}
                </p>
            </div> 
            <div class="historial-item-mensaje">
                <p class="historial-item-texto">
                    ${mensaje}
                </p>
            </div>
        </div>
        <div class="historial-item-pie">
            <p class="historial-item-estado historial-estado-${estado}">
                <span class="historial-item-estado-texto">
                    ${estado[0].toUpperCase() + estado.slice(1)}
                </span>
            </p>
        </div>
    `

    historialContenedor.prepend(historialItem)
}

/* ////////////////////////////////////////////////////////////////// */

/**
 * Responde a un solicitud actualizando la base de datos y enviando datos al cliente
 * 
 * @param {Object} botonRespuesta
 * @param {Number} empleadoId
 * @param {String} empleadoNombre
 * @param {String} empleadoApellido
 * @param {Number} solicitudId
 * @param {String} solicitudMensaje
 * @param {String} textoRespuesta
 * @returns {void}
 */
async function respondersolicitud({ botonRespuesta, empleadoId, empleadoNombre, empleadoApellido, solicitudId, solicitudMensaje, textoRespuesta }) {
    botonRespuesta.addEventListener('click', async () => {
        // Guardar respuesta en la base de datos
        const resultado = await peticion({
            url: '/api/respuestas/crear',
            metodo: 'POST',
            cuerpo: {
                solicitudId: solicitudId,
                soporteId: idsoporte,
                mensaje: textoRespuesta,
            }
        })

        // Si ocurrio un error en la api se muestra una alerta
        if(!resultado.ok) {
            return alerta({ mensaje: 'No se pudo responder al solicitud.', tipo: 'error' })
        }

        // Enviar respuesta al empleado
        socket.emit('respuesta-solicitud', {
            usuario_id: empleadoId,
            respuesta: textoRespuesta,
            nombre: nombresoporte,
            apellido: apellidosoporte
        })

        // Eliminar botones de respuesta a los demas soportees
        socket.emit('eliminar-respuesta-solicitud', {
            soporte_id: idsoporte,
            solicitud_id: solicitudId
        })

        // Mostrar alerta de enviado al soporte
        alerta({ mensaje: `Respuesta enviada a ${empleadoNombre} ${empleadoApellido}`, tipo: 'exito' })

        // Mostrar botones de finalización
        mostrarBotonesFinales({
            empleado: {
                id: empleadoId,
                nombre: empleadoNombre,
                apellido: empleadoApellido
            },
            solicitud: {
                id: solicitudId,
                mensaje: solicitudMensaje
            }
        })
    })
}

async function procesarsolicitud({ empleadoId, empleadoNombre, empleadoApellido, solicitudId, solicitudMensaje, textoRespuesta, nombresoporte, apellidosoporte }) {
    // Guardar respuesta en la base de datos
    const resultado = await peticion({
        url: '/api/respuestas/crear',
        metodo: 'POST',
        cuerpo: {
            solicitudId: solicitudId,
            soporteId: idsoporte,
            mensaje: textoRespuesta,
        }
    })

    // Si ocurrio un error en la api se muestra una alerta
    if(!resultado.ok) {
        return alerta({ mensaje: 'No se pudo responder al solicitud.', tipo: 'error' })
    }

    // Enviar respuesta al empleado
    socket.emit('respuesta-solicitud', {
        usuario_id: empleadoId,
        respuesta: textoRespuesta,
        nombre: nombresoporte,
        apellido: apellidosoporte
    })

    // Eliminar botones de respuesta a los demas soportees
    socket.emit('eliminar-respuesta-solicitud', {
        soporte_id: idsoporte,
        solicitud_id: solicitudId
    })

    // Mostrar alerta de enviado al soporte
    alerta({ mensaje: `Respuesta enviada a ${empleadoNombre} ${empleadoApellido}`, tipo: 'exito' })

    // Mostrar botones de finalización
    mostrarBotonesFinales({
        empleado: {
            id: empleadoId,
            nombre: empleadoNombre,
            apellido: empleadoApellido
        },
        solicitud: {
            id: solicitudId,
            mensaje: solicitudMensaje
        }
    })
}

/**
 * Finaliza un solicitud actualizando la base de datos y enviando datos al cliente
 * 
 * @param {Object} empleado
 * @param {Object} solicitud
 * @returns {void}
 */
async function terminarsolicitud({ empleado, solicitud }) {
    const htmlsolicitud = document.querySelector(`.solicitud[data-solicitud_id="${solicitud.id}"`)

    const resultado = await peticion({
        url: '/api/solicitud/actualizar/' + solicitud.id,
        metodo: 'PUT',
        cuerpo: {
            id_solicitud: solicitud.id,
            finalizado: true
        }
    })

    if (!resultado.ok) {
        return alerta({ mensaje: 'No se pudo finalizar el solicitud.', tipo: 'error' })
    }

    // ! TERMINAR solicitud
    socket.emit('terminar-solicitud', {
        usuario_id: empleado.id,
        respuesta: "Terminado",
        nombre: nombresoporte,
        apellido: apellidosoporte,
    })

    socket.emit('agregar-historial', {
        usuario_id: empleado.id,
        solicitud_id: solicitud.id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        mensaje: solicitud.mensaje,
        fecha: new Date()
    })

    // Eliminar de la vista
    htmlsolicitud.remove()

    // Mostrar texto si no hay solicitud pendientes
    siNoHaysolicitud({ noHaysolicitud })
}

/**
 * Si no hay solicitud pendientes muestra el texto "No hay solicitud pendientes"
 * 
 * @param {HTMLElement} noHaysolicitud
 * @returns {void}
 */
function siNoHaysolicitud({ noHaysolicitud }) {
    const solicitud = document.querySelectorAll('.solicitud')

    if (solicitud.length == 0) {
        noHaysolicitud.classList.remove('esconder')
    }
}

/**
 * Renderiza el tiempo pasado en tiempo real de cada solicitud
 * 
 * @returns {void}
 */
function renderizarTiempos() {
    const local = (numero, index) => {
        return [
            ['justo ahora', 'en un rato'],
            ['hace %s segundos', 'en %s segundos'],
            ['hace 1 minuto', 'en 1 minuto'],
            ['hace %s minutos', 'en %s minutos'],
            ['hace 1 hora', 'en 1 hora'],
            ['hace %s horas', 'en %s horas'],
            ['hace 1 día', 'en 1 día'],
            ['hace %s días', 'en %s días'],
            ['hace 1 semana', 'en 1 semana'],
            ['hace %s semanas', 'en %s semanas'],
            ['hace 1 mes', 'en 1 mes'],
            ['hace %s meses', 'en %s meses'],
            ['hace 1 año', 'en 1 año'],
            ['hace %s años', 'en %s años'],
        ][index];
    }

    timeago.register('es', local);

    const nodos = document.querySelectorAll('.fecha-envio')
    if (nodos.length > 0) timeago.render(nodos, 'es')
}