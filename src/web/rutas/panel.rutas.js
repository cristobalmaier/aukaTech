import { Router } from 'express'
const panelRutas = new Router()

const API_URL = process.env.API_URL

import { config } from '../../web/config.js'
import { peticion } from '../utiles/peticion.js'
import { tiempo } from '../utiles/tiempo.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import { esempleado, essoporte, estaLogeado } from '../utiles/auth.js'

// Función para formatear fechas
const formatoHora = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

panelRutas.get('/panel/empleado', [estaLogeado, esempleado], async (req, res) => {
    const usuario = obtenerDatosToken(req)
    res.render('paneles/empleado', { titulo: 'AUKA - Panel', usuario })
})


panelRutas.get('/panel/soporte', [estaLogeado, essoporte], async (req, res) => {
    const hora_actual = tiempo({ fecha: new Date() })
    const usuario = obtenerDatosToken(req)

    try {
        const [solicitudesRes, turnosRes] = await Promise.all([
            peticion({ 
                url: `${API_URL}/solicitudes`,
                metodo: 'GET',
                query: { incluirDatosUsuario: true } 
            }),
            peticion({ url: `${API_URL}/turnos/hora/${hora_actual}`, metodo: 'GET' })
        ])

        let solicitudes = await solicitudesRes.json()
        
        // Normalización de datos
        if (!Array.isArray(solicitudes)) {
            solicitudes = []
        } else {
            solicitudes = solicitudes.map(sol => ({
                ...sol,
                nombre: sol.nombre || sol.nombre_usuario || '',
                apellido: sol.apellido || sol.apellido_usuario || '',
                finalizado: sol.finalizado || 0,
                cancelado: sol.cancelado || 0,
                fecha_envio: sol.fecha_envio || new Date().toISOString()
            }))
        }

        const turnos = await turnosRes.json()

        res.render('paneles/soporte', { 
            titulo: 'AUKA - Panel', 
            usuario, 
            solicitud: solicitudes,
            turnos,
            formatoHora  // Pasamos la función helper
        })

    } catch (error) {
        console.error('Error en panel soporte:', error)
        res.render('paneles/soporte', {
            titulo: 'AUKA - Panel',
            usuario,
            solicitud: [],
            turnos: []
        })
    }
})

export default panelRutas