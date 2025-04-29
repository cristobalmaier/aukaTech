import ErrorCliente from "../utiles/error.js"
import { validarLlamado } from "../validadores/llamado.js"

class LlamadoControlador {
    constructor({ llamadoServicio }) {
        this.llamadoServicio = llamadoServicio
    }

    obtenerTodos = async (req, res, next) => {
        const { usuarioId } = req.query

        try {
            const resultado = await this.llamadoServicio.obtenerTodos({ usuarioId })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
    
    obtenerLlamadoPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.llamadoServicio.obtenerLlamadoPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearLlamado = async (req, res, next) => {
        const { id_preceptor, id_emisor, id_curso, numero_nivel, mensaje } = req.body || {}

        try {
            const resultado = await this.llamadoServicio.crearLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje })
            res.status(200).json({ mensaje: 'llamado creado', data: { id: resultado.insertId } }) 
        } catch(err) {
            next(err)
        }
    }

    eliminarLlamado = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.llamadoServicio.eliminarLlamado({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarLlamado = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.llamadoServicio.actualizarLlamado({ id_llamado: id, ...req.body })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default LlamadoControlador