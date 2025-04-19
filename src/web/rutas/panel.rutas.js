import { Router } from 'express'
const panelRutas = new Router()

import { esProfesor, esPreceptor, estaLogeado } from '../utiles/auth.js'

panelRutas.get('/panel/preceptor', [estaLogeado, esPreceptor], (req, res) => {
    res.render('paneles/preceptor', { titulo: 'AUKA - Panel', usuario: req.session.usuario })
})

panelRutas.get('/panel/profesor', [estaLogeado, esProfesor], (req, res) => {
    res.render('paneles/profesor', { titulo: 'AUKA - Panel', usuario: req.session.usuario })
})

export default panelRutas