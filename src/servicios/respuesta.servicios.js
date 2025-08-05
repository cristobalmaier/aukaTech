import { query } from "../bd.js";

class RespuestaServicio {
    static async obtenerRespuestas({ solicitudId }) {
        const resultado = await query(`SELECT rl.*, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario FROM respuestas_solicitud rl JOIN usuarios u ON u.id_usuario = rl.id_soporte JOIN solicitud l ON rl.id_solicitud = l.id_solicitud WHERE l.id_solicitud = ?`, solicitudId)
 
        return resultado
    }

    static async crearRespuesta({ solicitudId, soporteId, mensaje }) {
        const resultado = await query(`INSERT INTO respuestas_solicitud (id_solicitud, id_soporte, mensaje) VALUES (?, ?, ?)`, [solicitudId, soporteId, mensaje])

        // Agregar soporte a cargo del solicitud
        const r = await query(`UPDATE solicitud SET id_soporte = ? WHERE id_solicitud = ?`, [soporteId, solicitudId])

        return resultado
    }

    static async eliminarRespuesta({ respuestaId }) {
        const resultado = await query(`DELETE FROM respuestas_solicitud WHERE id_respuesta = ?`, respuestaId)

        return resultado
    }

    static async actualizarRespuesta({ respuestaId, mensaje }) {
        const resultado = await query(`UPDATE respuestas_solicitud SET mensaje = ? WHERE id_respuesta = ?`, [mensaje, respuestaId])

        return resultado
    }
}

export default RespuestaServicio    