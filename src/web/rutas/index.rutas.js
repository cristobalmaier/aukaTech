import { Router } from 'express'
const router = new Router()

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/error', (req, res) => {
    res.render('error')
})

export default router