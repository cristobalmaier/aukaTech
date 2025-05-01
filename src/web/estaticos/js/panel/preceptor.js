import { peticion } from '../peticion.js'
import { formatearHora } from '../formatearHora.js'
import { formato } from '../renderizarTiempo.js'

const socket = io();

// Datos del preceptor logeado
const idPreceptor = document.documentElement.dataset.id_usuario
const nombrePreceptor = document.documentElement.dataset.nombre
const apellidoPreceptor = document.documentElement.dataset.apellido
const tipoUsuario = document.documentElement.dataset.tipo_usuario

const niveles = [
    'leve', 'moderado', 'urgente'
]
const respuestas = [
    "Yendo", "No puedo", "Derivo otro preceptor"
]

// Elementos HTML
const llamadosContenedor = document.querySelector('.llamados')
const historialContenedor = document.querySelector('.historial-contenedor')
const noHayLlamados = document.querySelector('.no-hay-llamados')

// timeago.js (para los minutos pasados en tiempo real)
renderizarTiempos();

/* ////////////////////////////////////////////////////////////////// */

// ! NUEVO LLAMADO
socket.on('nuevo-llamado', async (data) => {
    const { usuario: profesor, llamado } = data

    const nivelImportancia = niveles[llamado.numero_nivel - 1]
    const nuevoLlamado = document.createElement('div');

    // Animacion
    nuevoLlamado.classList.add('animate__animated', 'animate__fadeInDown')

    // Agregar clases al div
    nuevoLlamado.classList.add('llamado', nivelImportancia);
    nuevoLlamado.dataset.usuario_id = profesor.id
    nuevoLlamado.dataset.llamado_id = llamado.id
    nuevoLlamado.innerHTML = `
                <div class="llamado-cabecera">
                    <p class="llamado-titulo">${profesor.nombre} ${profesor.apellido}</p>
                    <p class="llamado-mensaje">${llamado.mensaje}</p>
                </div>
                <hr>
                <div class="llamado-cuerpo">
                    <p><span class="llamado-cuerpo-texto">Llamado - <span class="fecha-envio" datetime="${llamado.fecha_envio}"></span></span></p>   
                </div>
                `

    const llamadoRespuestas = document.createElement('div')
    llamadoRespuestas.classList.add('llamado-respuestas')

    for (const textoRespuesta of respuestas) {
        const respuesta = document.createElement('p')
        respuesta.classList.add('respuesta')
        respuesta.innerText = textoRespuesta
        respuesta.dataset.usuario_id = profesor.id

        await responderLlamado({ botonRespuesta: respuesta, llamadoId: llamado.id, profesorId: profesor.id, textoRespuesta })

        llamadoRespuestas.appendChild(respuesta)
    }

    nuevoLlamado.appendChild(llamadoRespuestas)
    llamadosContenedor.prepend(nuevoLlamado)

    // Eliminar texto de que no hay llamados
    if (!noHayLlamados.classList.contains('esconder')) {
        noHayLlamados.classList.add('esconder')
    }

    // Renderizar tiempo de envio en la vista del panel
    timeago.render(nuevoLlamado.querySelector('.fecha-envio'), 'es')
})

/* ////////////////////////////////////////////////////////////////// */

// ! CANCELAR LLAMADO
socket.on('cancelar-llamado', async (data) => {
    const { 
        usuario_id: idProfesorLlamado,
        nombre: nombreProfesor,
        apellido: apellidoProfesor,
        fecha_envio: fechaLlamado,
        mensaje
     } = data

    const llamado = document.querySelector('.llamado[data-usuario_id="' + idProfesorLlamado + '"]')

    // Marcar como finalizado y cancelado en la base de datos
    const llamadoId = llamado.dataset.llamado_id

    const resultado = await peticion({
        url: '/api/llamados/actualizar/' + llamadoId,
        metodo: 'PUT',
        cuerpo: {
            id_llamado: llamadoId,
            finalizado: true,
            cancelado: true
        }
    })

    // Eliminar de la vista
    if (llamado) llamado.remove()

    // Agregar al historial
    const historialItem = document.createElement('div')
    historialItem.classList.add('historial-item')
    historialItem.classList.add('animate__animated', 'animate__fadeInDown') // Animacion

    historialItem.innerHTML = `
        <div>
            <div class="historial-item-cabecera">
                <p class="historial-item-titulo">
                    ${nombreProfesor} ${apellidoProfesor}
                </p>
                <p class="historial-item-hora">
                    ${formatearHora(fechaLlamado)}
                </p>
            </div> 
            <div class="historial-item-mensaje">
                <p class="historial-item-texto">
                    ${mensaje}
                </p>
            </div>
        </div>
        <div class="historial-item-pie">
            <p class="historial-item-estado historial-estado-cancelado">
                <span class="historial-item-estado-texto">
                    Cancelado
                </span>
            </p>
        </div>
    `

    historialContenedor.prepend(historialItem)

    // Mostrar texto si no hay llamados pendientes
    siNoHayLlamados({ noHayLlamados })
})

/* ////////////////////////////////////////////////////////////////// */

const botonesRespuesta = document.querySelectorAll('.respuesta')

for (const botonRespuesta of botonesRespuesta) {
    const llamado = botonRespuesta.parentElement.parentElement

    const llamadoId = llamado.dataset.llamado_id

    await responderLlamado({
        botonRespuesta,
        profesorId: botonRespuesta.dataset.usuario_id,
        llamadoId,
        textoRespuesta: botonRespuesta.innerText
    })
}

/* ////////////////////////////////////////////////////////////////// */

const botonesTerminado = document.querySelectorAll('.respuesta-terminado')

for (const botonTerminado of botonesTerminado) {
    botonTerminado.addEventListener('click', async () => {
        const llamado = botonTerminado.parentElement.parentElement

        const llamadoId = llamado.dataset.llamado_id
        const profesorId = llamado.dataset.usuario_id

        await terminarLlamado({
            profesor: {
                id: profesorId
            },
            llamado: {
                id: llamadoId
            }
        })
    })
}

/* ////////////////////////////////////////////////////////////////// */

/**
 * @param {Object} usuario
 * @param {Socket} socket
 * @returns {void}
 */
function mostrarBotonesFinales({ profesor, socket, llamado }) {
    const respuestas = document.querySelectorAll(`.llamado[data-usuario_id="${profesor.id}"] .respuesta`)

    for (const respuesta of respuestas) {
        respuesta.remove()
    }

    const terminado = document.createElement('p')
    terminado.classList.add('respuesta', 'respuesta-terminado')
    terminado.innerText = 'Terminado'
    terminado.dataset.usuario_id = profesor.id

    terminado.addEventListener('click', async () => {
        await terminarLlamado({ profesor, llamado })
    })

    const llamadoRespuestas = document.querySelector(`.llamado[data-usuario_id="${profesor.id}"] .llamado-respuestas`)
    llamadoRespuestas.appendChild(terminado)
}

/* ////////////////////////////////////////////////////////////////// */

async function responderLlamado({ botonRespuesta, profesorId, llamadoId, textoRespuesta }) {
    botonRespuesta.addEventListener('click', async () => {
        const resultado = await peticion({
            url: '/api/respuestas/crear',
            metodo: 'POST',
            cuerpo: {
                llamadoId: llamadoId,
                preceptorId: idPreceptor,
                mensaje: textoRespuesta,
            }
        })

        socket.emit('respuesta-llamado', {
            usuario_id: profesorId,
            respuesta: textoRespuesta,
            nombre: nombrePreceptor,
            apellido: apellidoPreceptor
        })

        mostrarBotonesFinales({
            profesor: {
                id: profesorId
            },
            llamado: {
                id: llamadoId
            }
        })
    })
}

/**
 * @param {Object} profesor
 * @param {Object} llamado
 * @returns {void}
 */
async function terminarLlamado({ profesor, llamado }) {
    const resultado = await peticion({
        url: '/api/llamados/actualizar/' + llamado.id,
        metodo: 'PUT',
        cuerpo: {
            id_llamado: llamado.id,
            finalizado: true
        }
    })

    if (!resultado.ok) {
        console.log(resultado)
        alert('ERROR GARRAFAL')
    }

    // ! TERMINAR LLAMADO
    socket.emit('terminar-llamado', {
        usuario_id: profesor.id,
        respuesta: "Terminado",
        nombre: nombrePreceptor,
        apellido: apellidoPreceptor
    })

    location.reload()
}

function siNoHayLlamados({ noHayLlamados }) {
    const llamados = document.querySelectorAll('.llamado')

    if (llamados.length === 0) {
        noHayLlamados.classList.remove('esconder')
    }
}

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
    if(nodos.length > 0) timeago.render(nodos, 'es')
}