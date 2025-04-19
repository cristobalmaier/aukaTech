import { Router } from 'express'
const loginRutas = new Router()

import { peticion } from '../utiles/peticion.js'
const api_url = process.env.API_URL

/* ////////////////////// SOLICITUDES DE ACCESO Y LOGIN ////////////////////// */

// LOGIN
loginRutas.get('/login', (req, res) => {
    const { error } = req.query

    res.render('login/iniciar_sesion', { titulo: 'AUKA - Inicio de sesión', error })
})

loginRutas.post('/entrar', async (req, res) => {
    const { email, contrasena } = req.body

    // Validar que el usuario existe
    const usuario = await peticion({ url: `${api_url}/usuarios?email=${email}`, metodo: 'GET' })
    if(!usuario.ok)
        return res.redirect('/login?error=usuario_no_existe')

    // Validar contraseña
    const validarContrasena = await peticion({ url: `${api_url}/usuarios/validar/contrasena`, metodo: 'POST', cuerpo: { email, contrasena } })
    if(!validarContrasena.ok)
        return res.redirect('/login?error=contrasena_incorrecta')

    const [infoUsuario] = await usuario.json()
    
    req.session.usuario = infoUsuario

    if(!infoUsuario.autorizado) 
        return res.redirect('/pendiente')

    res.redirect('/panel/' + infoUsuario.tipo_usuario)
})

// SOLICITUDES DE ACCESO
loginRutas.get('/solicitud', (req, res) => {
    res.render('login/solicitud_acceso', { titulo: 'AUKA - Solicitud de acceso' })
})

loginRutas.post('/enviar_solicitud', async (req, res) => {
    const { nombre, apellido, email, contrasena } = req.body
    
    const crearUsuario = await peticion({ url: `${api_url}/usuarios/crear`, metodo: 'POST', cuerpo: { nombre, apellido, email, contrasena } })
    if(crearUsuario.ok) 
        return res.redirect('/pendiente')
})

// "SALA DE ESPERA"
loginRutas.get('/pendiente', (req, res) => {
    res.render('login/sala_espera', { titulo: 'AUKA - Solicitud pendiente' })
})

export default loginRutas