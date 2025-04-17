import { Router } from 'express'
const router = new Router()

import { peticion } from '../utiles/peticion.js'
const api_url = process.env.API_URL

router.get('/', (req, res) => {
    res.redirect('/login')
})

/* ////////////////////// SOLICITUDES DE ACCESO Y LOGIN ////////////////////// */

router.get('/login', (req, res) => {
    res.render('login/iniciar_sesion', { titulo: 'AUKA - Inicio de sesión' })
})

router.get('/solicitud', (req, res) => {
    res.render('login/solicitud_acceso', { titulo: 'AUKA - Solicitud de acceso' })
})

router.post('/enviar_solicitud', async (req, res) => {
    const { nombre, apellido, email, contrasena } = req.body
    
    const crearUsuario = await peticion({ url: `${api_url}/usuarios/crear`, metodo: 'POST', cuerpo: { nombre, apellido, email, contrasena } })
    if(crearUsuario.ok) 
        return res.redirect('/pendiente')
})

router.post('/entrar', async (req, res) => {
    const { email, contrasena } = req.body

    const usuario = await peticion({ url: `${api_url}/usuarios?email=${email}`, metodo: 'GET' })
    if(!usuario.ok)
        return res.redirect('/login?error=usuario_no_existe')

    const validarContrasena = await peticion({ url: `${api_url}/usuarios/validar/contrasena`, metodo: 'POST', cuerpo: { email, contrasena } })
    const resultado = await validarContrasena.json()
    if(!resultado)
        return res.redirect('/login?error=contrasena_incorrecta')

    res.redirect('/pendiente')
})

router.get('/pendiente', (req, res) => {
    res.render('login/sala_espera', { titulo: 'AUKA - Solicitud pendiente' })
})

export default router