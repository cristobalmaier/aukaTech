import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import server from 'node:http'
import { Server } from 'socket.io'
import { formato, formatoHora } from './web/utiles/formato.js'

const app = express()
const serverApp = server.createServer(app)
export const io = new Server(serverApp)

// Configuracion
const PUERTO = process.env.PUERTO_API
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
import cursoRutas from './rutas/curso.rutas.js'
import llamadoRutas from './rutas/llamado.rutas.js'
import respuestaRutas from './rutas/respuesta.rutas.js'
import turnosRutas from './rutas/turno.rutas.js'

app.use('/api/usuarios', usuarioRutas)
app.use('/api/cursos', cursoRutas)
app.use('/api/llamados', llamadoRutas)
app.use('/api/respuestas', respuestaRutas)
app.use('/api/turnos', turnosRutas)

app.use((req, res, next) => {
    res.locals.formato = formato
    res.locals.formatoHora = formatoHora
    next()
})

app.use((err, req, res, next) => {
    console.error(err)
    const { message, statusCode } = err
    res.status(statusCode).json({ codigo: statusCode, mensaje: message })
})

// Rutas de la WEB
import indexRutas from './web/rutas/index.rutas.js'
import loginRutas from './web/rutas/login.rutas.js'
import panelRutas from './web/rutas/panel.rutas.js'

app.use(indexRutas)
app.use(loginRutas)
app.use(panelRutas)

// Estaticos
app.use('/', express.static(process.cwd() + '/src/web/estaticos'))
app.use('/panel', express.static(process.cwd() + '/src/web/estaticos'))

// Socket.io
io.on('connection', (socket) => {
    socket.on('nuevo-llamado', (data) => {
        io.emit('nuevo-llamado', data)
    })

    socket.on('respuesta-llamado', (data) => {
        io.emit('respuesta-llamado', data)
    })

    socket.on('terminar-llamado', (data) => {
        io.emit('terminar-llamado', data)
    })

    socket.on('cancelar-llamado', (data) => {
        io.emit('cancelar-llamado', data)
    })
})

// Iniciar servidor
serverApp.listen(PUERTO, () => {
    console.log('API: http://localhost:' + PUERTO)
})

export default app