import { query } from "../bd.js"
import ErrorCliente from "../utiles/error.js"
import { validarsolicitud, validarActualizacionsolicitud } from "../validadores/solicitud.js"

export default class solicitudervicio {
    async obtenerTodos({ usuarioId }) {
        const queryBase = `
            SELECT l.*, prof.nombre, prof.apellido, 
                   n.nombre_prioridad, n.numero_prioridad,
                   prec.nombre AS nombre_soporte, prec.apellido AS apellido_soporte,
                   c.area 
            FROM solicitud l 
            JOIN usuarios prof ON l.id_emisor = prof.id_usuario 
            LEFT JOIN usuarios prec ON l.id_soporte = prec.id_usuario 
            JOIN areas c ON l.id_area = c.id_area 
            JOIN prioridades n ON l.numero_prioridad = n.numero_prioridad
        `

        const [whereClause, params] = usuarioId
            ? ["WHERE l.id_emisor = ?", [usuarioId]]
            : ["", []]

        return await query(
            `${queryBase} ${whereClause} ORDER BY l.fecha_envio DESC`,
            params
        )
    }

    async obtenersolicitudPorId({ id }) {
        const [rows] = await query(
            `SELECT * FROM solicitud WHERE id_solicitud = ?`,
            [id]
        )
        if (!rows || rows.length === 0) {
            throw new ErrorCliente("Solicitud no encontrada", 404)
        }
        return rows[0]
    }

    async crearsolicitud(datos) {
        const { valido, errores, datos: datosValidados } = validarsolicitud(datos)
        if (!valido) {
            throw new ErrorCliente(JSON.stringify(errores), 400)
        }

        const resultado = await query(
            `INSERT INTO solicitud (id_emisor, id_area, numero_prioridad, mensaje, fecha_envio) 
             VALUES (?, ?, ?, ?, NOW())`,
            [
                datosValidados.id_emisor,
                datosValidados.id_area,
                datosValidados.numero_prioridad,
                datosValidados.mensaje,
            ]
        )
        return resultado
    }

    async eliminarsolicitud({ id }) {
        await this.obtenersolicitudPorId({ id })
        await query(`DELETE FROM solicitud WHERE id_solicitud = ?`, [id])
    }

    async actualizarsolicitud({ id, ...cambios }) {
        await this.obtenersolicitudPorId({ id })

        const { valido, errores, datos: datosValidados } = validarActualizacionsolicitud(cambios)
        if (!valido) {
            throw new ErrorCliente(JSON.stringify(errores), 400)
        }

        const campos = Object.keys(datosValidados)
        const valores = Object.values(datosValidados)

        if (campos.length === 0) {
            throw new ErrorCliente("No hay cambios para actualizar", 400)
        }

        const setClause = campos.map(campo => `${campo} = ?`).join(", ")
        const querySQL = `UPDATE solicitud SET ${setClause} WHERE id_solicitud = ?`

        await query(querySQL, [...valores, id])
        return { id, ...datosValidados }
    }
}