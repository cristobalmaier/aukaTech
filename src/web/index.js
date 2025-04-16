import express from 'express'

const webApp = express()
import app from '../api/index.js'

// Configuracion
const PUERTO = process.env.PUERTO_WEB
webApp.set('view engine', 'ejs')
webApp.set('views', process.cwd() + '/src/web/vistas')

// Middlewares
webApp.use(express.json())
webApp.use(express.urlencoded({ extended: false }))

// Rutas
import router from './rutas/index.rutas.js'
webApp.use(router)

// Estaticos
webApp.use('/', express.static(process.cwd() + '/src/web/estaticos'))

// Server
webApp.listen(PUERTO, () => {
    console.log('WEB: http://localhost:' + PUERTO)
})