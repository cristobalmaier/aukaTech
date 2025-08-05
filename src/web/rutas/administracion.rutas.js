import { Router } from 'express'
const administracionRutas = new Router()

// ! Agregar funcion esDirectivo mas tarde
// import { esDirectivo } from '../utiles/auth.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import {peticion} from "../utiles/peticion.js"

// Ruta para el panel de administracion
administracionRutas.get('/panel/administracion', async (req, res) => {
    const usuario = obtenerDatosToken(req)
    
    const solicitud = await peticion ({url: `${process.env.API_URL}/solicitud`, metodo:`GET`}) 
    const solicitudResultado = await solicitud.json()

    const datos = await peticion ({url: `${process.env.API_URL}/data/database`, metodo:`GET`}) 
    const datosResultado = await datos.json()

    res.render('paneles/administracion', { 
        titulo: 'AUKA - Panel', 
        usuario, 
        solicitudResultado: solicitudResultado || [], 
        rutaActual: '/panel/administracion',
        datos: datosResultado
    })
})

export default administracionRutas