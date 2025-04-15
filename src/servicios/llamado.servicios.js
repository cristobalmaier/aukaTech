import { query } from "../bd.js";

class LlamadoServicio {
    static async obtenerTodos() {
        const resultado = await query("SELECT * FROM llamados")
        return resultado
    }

    static async obtenerLlamadoPorId({ id }) {
        const resultado = await query(`SELECT * FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }

    static async crearLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio }) {
        const resultado = await query(`INSERT INTO llamados (id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio) VALUES (?, ?, ?, ?, ?, ?)`, [id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, fecha_envio])
        return resultado
    }

    static async eliminarLlamado({ id }) {
        const resultado = await query(`DELETE FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }
}

export default LlamadoServicio