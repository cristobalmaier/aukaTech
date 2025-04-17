import { Router } from 'express'
const router = new Router()

router.get('/', (req, res) => {
    res.render('login', { titulo: 'AUKA - Iniciar sesion' })
})

export default router