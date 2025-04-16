import { validarLlamado } from "./validadores/llamado.js"

class LlamadoControlador {
    constructor({ llamadoServicio }) {
        this.llamadoServicio = llamadoServicio
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await this.llamadoServicio.obtenerTodos()
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
        const { id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio } = req.body

        const { valido, errores } = validarLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }
        
        try {
            const resultado = await this.llamadoServicio.crearLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio })
            res.status(200).json(resultado)
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
}

export default LlamadoControlador