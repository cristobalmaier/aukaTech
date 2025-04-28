import { query } from "../bd.js";

class RespuestaServicio {
    static async obtenerRespuestas({ llamadoId }) {
        const resultado = await query(`SELECT rl.*, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario FROM respuestas_llamados rl JOIN usuarios u ON u.id_usuario = rl.id_preceptor JOIN llamados l ON rl.id_llamado = l.id_llamado WHERE l.id_llamado = ?`, llamadoId)
 
        return resultado
    }

    static async crearRespuesta({ llamadoId, preceptorId, mensaje }) {
        const resultado = await query(`INSERT INTO respuestas_llamados (id_llamado, id_preceptor, mensaje) VALUES (?, ?, ?)`, [llamadoId, preceptorId, mensaje])

        // Agregar preceptor a cargo del llamado
        const r = await query(`UPDATE llamados SET id_preceptor = ? WHERE id_llamado = ?`, [preceptorId, llamadoId])

        return resultado
    }

    static async eliminarRespuesta({ respuestaId }) {
        const resultado = await query(`DELETE FROM respuestas_llamados WHERE id_respuesta = ?`, respuestaId)

        return resultado
    }

    static async actualizarRespuesta({ respuestaId, mensaje }) {
        const resultado = await query(`UPDATE respuestas_llamados SET mensaje = ? WHERE id_respuesta = ?`, [mensaje, respuestaId])

        return resultado
    }
}

export default RespuestaServicio    