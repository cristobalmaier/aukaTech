import { Router } from 'express'
const directivosRutas = new Router()

// ! Agregar funcion esDirectivo mas tarde
// import { esDirectivo } from '../utiles/auth.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import {peticion} from "../utiles/peticion.js"

// Ruta para el panel de directivos
directivosRutas.get('/panel/directivos', async (req, res) => {
    const usuario = obtenerDatosToken(req)
    
    const solicitud = await peticion ({url: `${process.env.API_URL}/solicitud`, metodo:`GET`}) 
    const solicitudResultado = await solicitud.json()


    res.render('paneles/directivos', { titulo: 'AUKA - Panel', usuario, solicitudResultado: solicitudResultado || []})
})

export default directivosRutas