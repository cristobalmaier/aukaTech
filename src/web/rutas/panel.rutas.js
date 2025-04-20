import { Router } from 'express'
const panelRutas = new Router()

import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import { esProfesor, esPreceptor, estaLogeado } from '../utiles/auth.js'

panelRutas.get('/panel/preceptor', [estaLogeado, esPreceptor], async (req, res) => {
    const usuario = obtenerDatosToken(req)

    res.render('paneles/preceptor', { titulo: 'AUKA - Panel', usuario })
})

panelRutas.get('/panel/profesor', [estaLogeado, esProfesor], (req, res) => {
    const usuario = obtenerDatosToken(req)
    
    res.render('paneles/profesor', { titulo: 'AUKA - Panel', usuario })
})

export default panelRutas