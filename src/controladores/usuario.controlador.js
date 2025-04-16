import ErrorCliente from "../utiles/error.js"
import { validarUsuario } from "./validadores/usuario.js"

class UsuarioControlador {
    constructor({ usuarioServicio }) {
        this.usuarioServicio = usuarioServicio
    }

    obtenerTodos = async (req, res, next) => {
        const { email } = req.query

        try {
            const resultado = await this.usuarioServicio.obtenerTodos({ email })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    obtenerUsuarioPorId = async (req, res, next) => {
        const { id } = req.params

        try {
            const resultado = await this.usuarioServicio.obtenerUsuarioPorId({ id })
            res.status(200).json(resultado)
        } catch(err) {
            next(err)
        }
    }

    crearUsuario = async (req, res, next) => {
        const { nombre, apellido, email, contrasena, tipo_usuario } = req.body
        
        const { valido, errores } = validarUsuario({ nombre, apellido, email, contrasena, tipo_usuario })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

        try {
            await this.usuarioServicio.crearUsuario({ nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json({ mensaje: "Usuario creado con exito." })
        } catch(err) {
            next(err)
        }
    }

    actualizarUsuario = async (req, res, next) => {
        const { id, nombre, apellido, email, contrasena, tipo_usuario } = req.body
        
        try {
            const resultado = await this.usuarioServicio.actualizarUsuario({ id, nombre, apellido, email, contrasena, tipo_usuario })
            res.status(200).json(resultado)
        } catch(err) {
            next()
        }
    }

    eliminarUsuario = async (req, res, next) => {
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