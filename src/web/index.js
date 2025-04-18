import express from 'express'
import session from 'express-session'

const webApp = express()
import '../api/index.js'

// Configuracion
const PUERTO = process.env.PUERTO_WEB
webApp.set('view engine', 'ejs')
webApp.set('views', process.cwd() + '/src/web/vistas')

// Middlewares
webApp.use(express.urlencoded({ extended: true }))
webApp.use(express.json())
webApp.use(session({
    secret: 'cambiar despues',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
}))

// Rutas
import router from './rutas/index.rutas.js'
webApp.use(router)

// Estaticos
webApp.use('/', express.static(process.cwd() + '/src/web/estaticos'))

// Server
webApp.listen(PUERTO, () => {
    console.log('WEB: http://localhost:' + PUERTO)
})