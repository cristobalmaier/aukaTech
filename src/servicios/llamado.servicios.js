import { query } from "../bd.js";
import { validarLlamado } from "../validadores/llamado.js";
import ErrorCliente from "../utiles/error.js";

class LlamadoServicio {
    static async obtenerTodos() {
        const resultado = await query("SELECT * FROM llamados")
        return resultado
    }

    static async obtenerLlamadoPorId({ id }) {
        const resultado = await query(`SELECT * FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }

    static async obtenerCursoPorId({ id }) {
        const resultado = await query(`SELECT * FROM cursos WHERE id_curso = ?`, id)
        return resultado
    }

    static async crearLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio }) {
        const { valido, errores } = validarLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

        const preceptorExiste = await this.obtenerLlamadoPorId({ id: id_preceptor })
        if (!preceptorExiste) throw new ErrorCliente('El preceptor no existe', 400)

        const emisorExiste = await this.obtenerLlamadoPorId({ id: id_emisor })
        if (!emisorExiste) throw new ErrorCliente('El emisor no existe', 400)

        const cursoExiste = await this.obtenerCursoPorId({ id: id_curso })
        if (!cursoExiste) throw new ErrorCliente('El curso no existe', 400)

        const resultado = await query(`INSERT INTO llamados (id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio) VALUES (?, ?, ?, ?, ?, ?)`, [id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio])
        return resultado
    }

    static async eliminarLlamado({ id }) {
        const resultado = await query(`DELETE FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }
}

export default LlamadoServicio