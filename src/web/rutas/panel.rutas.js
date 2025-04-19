import { Router } from 'express'
const panelRutas = new Router()

import { esProfesor, esPreceptor } from '../utiles/auth.js'

panelRutas.get('/panel/preceptor', [esPreceptor], (req, res) => {
    res.render('paneles/preceptor', { titulo: 'AUKA - Panel', usuario: req.session.usuario })
})

panelRutas.get('/panel/profesor', [esProfesor],(req, res) => {
    console.log(req.session.usuario)
    res.render('paneles/profesor', { titulo: 'AUKA - Panel', usuario: req.session.usuario })
})

export default panelRutas