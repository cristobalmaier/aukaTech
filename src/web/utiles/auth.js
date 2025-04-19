export const esDirectivo = (req, res, next) => {
    const { tipo_usuario } = req.session.usuario

    if(tipo_usuario === 'directivo')
        return next()

    res.redirect('/error')
}

export const esPreceptor = (req, res, next) => {
    const { tipo_usuario } = req.session.usuario

    if(tipo_usuario === 'preceptor')
        return next()

    res.redirect('/error')
}

export const esProfesor = (req, res, next) => {
    const { tipo_usuario } = req.session.usuario

    if(tipo_usuario === 'profesor')
        return next()

    res.redirect('/error')
}