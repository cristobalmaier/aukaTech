import { Router } from 'express'
const router = new Router()

import { estaLogeado } from '../utiles/auth.js'

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/logout', (req, res) => {
    res
    .clearCookie('access_token')
    .redirect('/')
})

router.get('/error', (req, res) => {
    res.render('error')
})

export default router