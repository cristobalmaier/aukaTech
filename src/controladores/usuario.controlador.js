import APIERROR from "../utiles/error.js"

class UsuarioControlador {
    constructor({ usuarioServicio }) {
        this.usuarioServicio = usuarioServicio
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const resultado = await this.usuarioServicio.obtenerTodos()
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerUsuarioPorId = async (req, res) => {
        const { id } = req.params

        try {
            const resultado = await this.usuarioServicio.obtenerUsuarioPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }
    
    obtenerUsuarioPorEmail = async (req, res) => {
        const { email } = req.params
        
        try {
            const resultado = await this.usuarioServicio.obtenerUsuarioPorEmail({ email })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearUsuario = async (req, res) => {
        const { nombre, apellido, email, contrasena, tipo_usuario } = req.body
        
        try {
            const resultado = await this.usuarioServicio.crearUsuario({ nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    actualizarUsuario = async (req, res) => {
        const { id, nombre, apellido, email, contrasena, tipo_usuario } = req.body
        
        try {
            const resultado = await this.usuarioServicio.actualizarUsuario({ id, nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json(resultado)
        } catch(err) {
            next()
        }
    }

    eliminarUsuario = async (req, res) => {
        const { id } = req.params

        try {
            const resultado = await this.usuarioServicio.eliminarUsuario({ id })
            res.status(200).json(resultado)   
        } catch(err) {
            next(err)
        }
    }
}

export default UsuarioControlador