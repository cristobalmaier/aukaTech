import { Router } from 'express'
const directivosRutas = new Router()

// ! Agregar funcion esDirectivo mas tarde
// import { esDirectivo } from '../utiles/auth.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import {peticion} from "../utiles/peticion.js"

// Ruta para el panel de directivos
directivosRutas.get('/panel/directivos', async (req, res) => {
    const usuario = obtenerDatosToken(req)
    
    const llamados = await peticion ({url: `${process.env.API_URL}/llamados`, metodo:`GET`}) 
    const llamadosResultado = await llamados.json()


    res.render('paneles/directivos', { titulo: 'AUKA - Panel', usuario, llamadosResultado: llamadosResultado || []})
})

export default directivosRutas