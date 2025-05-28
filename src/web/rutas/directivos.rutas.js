import { Router } from 'express'
const directivosRutas = new Router()

// ! Agregar funcion esDirectivo mas tarde
// import { esDirectivo } from '../utiles/auth.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'

// Ruta para el panel de directivos
directivosRutas.get('/panel/directivos', (req, res) => {
    const usuario = obtenerDatosToken(req)
    res.render('paneles/directivos', { titulo: 'AUKA - Panel', usuario })
})

export default directivosRutas