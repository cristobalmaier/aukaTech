import CursoServicio from "../servicios/curso.servicios.js"

class CursoControlador {
    constructor({ cursoServicio }) {
        this.cursoServicio = cursoServicio
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await this.cursoServicio.obtenerTodos()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
    
    obtenerCursoPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.cursoServicio.obtenerCursoPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerCursoPorNombre = async (req, res, next) => {
        const { nombre } = req.params

        try {
            const resultado = await this.cursoServicio.obtenerCursoPorNombre({ nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearCurso = async (req, res, next) => {
        const { nombre } = req.body

        try {
            const resultado = await this.cursoServicio.crearCurso({ nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarCurso = async (req, res, next) => {
        const { id, nombre } = req.body

        try {
            const resultado = await this.cursoServicio.actualizarCurso({ id, nombre })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    eliminarCurso = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.cursoServicio.eliminarCurso({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
}

export default CursoControlador