import { query } from "../bd.js";
import { encriptar } from "../utiles/encriptar.js";

class UsuarioServicio {
    static async obtenerTodos({ email }) {
        if(email) {
            const resultado = await query(`SELECT * FROM usuarios WHERE email = ?`, [email])
            return resultado
        }
        
        const resultado = await query("SELECT * FROM usuarios")
        return resultado
    }

    static async obtenerUsuarioPorId({ id }) {
        const resultado = await query(`SELECT * FROM usuarios WHERE id_usuario = ?`, id)
        return resultado
    }
    
    static async obtenerUsuarioPorEmail({ email }) {
        const resultado = await query(`SELECT * FROM usuarios WHERE email = ?`, email)
        return resultado
    }

    static async crearUsuario({ nombre, apellido, email, contrasena, tipo_usuario }) {
        const contrasena_encriptada = await encriptar({ contrasena })
        const usuario = [
            nombre,
            apellido,
            email,
            contrasena_encriptada,
            tipo_usuario
        ]
        const resultado = await query(`INSERT INTO usuarios (nombre, apellido, email, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)`, usuario)
        return resultado
    }

    static async actualizarUsuario({ id, nombre, apellido, email, contrasena, tipo_usuario }) {
        const contrasena_encriptada = await encriptar({ contrasena })
        const usuario = [ 
            id,
            nombre,
            apellido,
            email,
            contrasena_encriptada,
            tipo_usuario
        ]
        const resultado = await query(`UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, contrasena = ?, tipo_usuario = ? WHERE id_usuario = ?`, usuario)
        return resultado
    }

    static async eliminarUsuario({ id }) {
        const resultado = await query(`DELETE FROM usuarios WHERE id_usuario = ?`, id)
        return resultado
    }
}

export default UsuarioServicio