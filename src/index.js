import express from 'express'
import morgan from 'morgan'

const app = express()

// Configuracion
const PUERTO = 3000 || process.env.PORT
app.set('json spaces', 2)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

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
    console.log('Servidor encendido.')
})