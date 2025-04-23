import { Router } from 'express'
const panelRutas = new Router()

const API_URL = process.env.API_URL

import { peticion } from '../utiles/peticion.js'
import { obtenerDatosToken } from '../utiles/obtenerDatosToken.js'
import { esProfesor, esPreceptor, estaLogeado } from '../utiles/auth.js'

panelRutas.get('/panel/preceptor', [estaLogeado, esPreceptor], async (req, res) => {
    const usuario = obtenerDatosToken(req)

    res.render('paneles/preceptor', { titulo: 'AUKA - Panel', usuario })
})

panelRutas.get('/panel/profesor', [estaLogeado, esProfesor], async (req, res) => {
    const usuario = obtenerDatosToken(req)
    const llamados = await (await peticion({ url: `${API_URL}/api/llamados?usuarioId=${usuario.id_usuario}`, metodo: 'GET' })).json()
    
    res.render('paneles/profesor', { titulo: 'AUKA - Panel', usuario, llamados })
})

export default panelRutas