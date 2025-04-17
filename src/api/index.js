import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

// Configuracion
const PUERTO = process.env.PUERTO_API
app.set('json spaces', 2)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Rutas
import usuarioRutas from './rutas/usuario.rutas.js'
import cursoRutas from './rutas/curso.rutas.js'
import llamadoRutas from './rutas/llamado.rutas.js'

app.use('/usuarios', usuarioRutas)
app.use('/cursos', cursoRutas)
app.use('/llamados', llamadoRutas)

app.use((err, req, res, next) => {
    console.error(err)
    const { message, statusCode } = err
    res.status(statusCode).json({ codigo: statusCode, mensaje: message })
})

// Iniciar servidor
app.listen(PUERTO, () => {
    console.log('API: http://localhost:' + PUERTO)
})

export default app