import { obtenerDatosToken as obtenerDatos } from './obtenerDatosToken.js'

export const estaLogeado = (req, res, next) => {
    const ruta = req.path
    const usuario = obtenerDatos(req)
    
    if(ruta === '/' && usuario)
        return res.redirect(`/panel/${usuario.tipo_usuario}`)

    if(usuario)
        return next()

    res.redirect('/login')
}

export const esDirectivo = (req, res, next) => {
    const { tipo_usuario } = obtenerDatos(req)

    if(tipo_usuario === 'directivo')
        return next()

    res.redirect('/error')
}

export const esPreceptor = (req, res, next) => {
    const { tipo_usuario } = obtenerDatos(req)

    if(tipo_usuario === 'preceptor')
        return next()

    res.redirect('/error')
}

export const esProfesor = (req, res, next) => {
    const { tipo_usuario } = obtenerDatos(req)

    if(tipo_usuario === 'profesor')
        return next()

    res.redirect('/error')
}