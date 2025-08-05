// index.js  –  versión corregida
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import server from 'node:http'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { formato, formatoHora } from './web/utiles/formato.js'
import { pruebaConexion } from './bd.js'

const app = express()
const serverApp = server.createServer(app)
export const io = new Server(serverApp)

// Configuración
const PUERTO = process.env.PUERTO_API || 3000
app.set('json spaces', 2)
app.set('view engine', 'ejs')
app.set('views', process.cwd() + '/src/web/vistas')

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

// Rutas de la API
import usuarioRutas from './rutas/usuario.rutas.js'
import areaRutas from './rutas/area.rutas.js'
import solicitudRutas from './rutas/solicitud.rutas.js'
import respuestaRutas from './rutas/respuesta.rutas.js'
import turnosRutas from './rutas/turno.rutas.js'
import datosRutas from './rutas/datos.rutas.js'

app.use('/api/usuarios', usuarioRutas)
app.use('/api/areas', areaRutas)
app.use('/api/solicitud', solicitudRutas)
app.use('/api/respuestas', respuestaRutas)
app.use('/api/turnos', turnosRutas)
app.use('/api/data', datosRutas)

// Rutas WEB
import indexRutas from './web/rutas/index.rutas.js'
import loginRutas from './web/rutas/login.rutas.js'
import panelRutas from './web/rutas/panel.rutas.js'
import directivosRutas from './web/rutas/directivos.rutas.js'
import administracionRutas from './web/rutas/administracion.rutas.js'

// variables globales para las vistas
app.use((req, res, next) => {
    res.locals.formato = formato
    res.locals.formatoHora = formatoHora
    next()
})

// montar rutas
app.use(indexRutas)
app.use(loginRutas)
app.use(directivosRutas)
app.use(panelRutas)
app.use(administracionRutas)

// Archivos estáticos
app.use('/', express.static(process.cwd() + '/src/web/estaticos'))
app.use('/panel', express.static(process.cwd() + '/src/web/estaticos'))

// Socket.io
io.on('connection', (socket) => {
    socket.on('nuevo-solicitud', (data) => io.emit('nuevo-solicitud', data))
    socket.on('respuesta-solicitud', (data) => io.emit('respuesta-solicitud', data))
    socket.on('terminar-solicitud', (data) => io.emit('terminar-solicitud', data))
    socket.on('cancelar-solicitud', (data) => io.emit('cancelar-solicitud', data))
    socket.on('eliminar-respuesta-solicitud', (data) => io.emit('eliminar-respuesta-solicitud', data))
    socket.on('agregar-historial', (data) => io.emit('agregar-historial', data))
})

// Manejo de errores (evita "Invalid status code: undefined")
app.use((err, req, res, next) => {
    console.error(err)
    const statusCode = err.statusCode || err.status || 500
    const message = err.message || 'Error interno del servidor'
    res.status(statusCode).json({ codigo: statusCode, mensaje: message })
})

// Arrancar servidor
serverApp.listen(PUERTO, async () => {
    try {
        await pruebaConexion()
    } catch (err) {
        console.error(
            chalk.redBright('ADVERTENCIA:') +
                ' NO HAY CONEXIÓN A LA BASE DE DATOS, ' +
                chalk.underline('REVISAR CREDENCIALES') +
                ' (.env) Y SI LA BASE DE DATOS ESTÁ EN FUNCIONAMIENTO'
        )
        console.error(chalk.blue('MENSAJE DE ERROR:'), err.message || '...')
    }
    console.log(chalk.bold('Aplicación en funcionamiento.'))
    console.log('Web: http://localhost:' + PUERTO)
    console.log('API: http://localhost:' + PUERTO + '/api')
})

export default app