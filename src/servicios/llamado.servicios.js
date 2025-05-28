import { query } from "../bd.js";
import { validarLlamado } from "../validadores/llamado.js";
import ErrorCliente from "../utiles/error.js";

class LlamadoServicio {
    static async obtenerTodos({ usuarioId }) {
        if(usuarioId) {
            const resultado = await query("SELECT l.*,prof.nombre,prof.apellido, n.nombre_nivel, n.numero_nivel,prec.nombre AS nombre_preceptor,prec.apellido AS apellido_preceptor,c.curso FROM llamados l JOIN usuarios prof ON l.id_emisor = prof.id_usuario LEFT JOIN usuarios prec ON l.id_preceptor = prec.id_usuario JOIN cursos c ON l.id_curso = c.id_curso JOIN niveles n ON l.numero_nivel = n.numero_nivel WHERE l.id_emisor = ? ORDER BY l.fecha_envio DESC", [usuarioId])
            return resultado
        }

        const resultado = await query("SELECT l.*,prof.nombre,prof.apellido, n.nombre_nivel, n.numero_nivel,prec.nombre AS nombre_preceptor,prec.apellido AS apellido_preceptor,c.curso FROM llamados l JOIN usuarios prof ON l.id_emisor = prof.id_usuario LEFT JOIN usuarios prec ON l.id_preceptor = prec.id_usuario JOIN cursos c ON l.id_curso = c.id_curso JOIN niveles n ON l.numero_nivel = n.numero_nivel ORDER BY l.fecha_envio DESC") 
        return resultado
    }

    static async obtenerLlamadoPorId({ id }) {
        const resultado = await query(`SELECT * FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }

    static async crearLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje }) {
        const { valido, errores } = validarLlamado({ id_preceptor, id_emisor, id_curso, numero_nivel, mensaje })
        if (!valido) {
            const mensaje = Object.values(errores)[0]
            throw new ErrorCliente(mensaje, 400)
        }

        if(id_preceptor !== null) {
            const preceptorExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_preceptor)
            if (!preceptorExiste) throw new ErrorCliente('El preceptor no existe', 400)
        }

        const emisorExiste = await query('SELECT * FROM usuarios WHERE id_usuario = ?', id_emisor)
        if (!emisorExiste) throw new ErrorCliente('El emisor no existe', 400)

        const cursoExiste = await query('SELECT * FROM cursos WHERE id_curso = ?', id_curso)
        if (!cursoExiste) throw new ErrorCliente('El curso no existe', 400)

        const resultado = await query(`INSERT INTO llamados (id_preceptor, id_emisor, id_curso, numero_nivel, mensaje) VALUES (?, ?, ?, ?, ?)`, [id_preceptor, id_emisor, id_curso, numero_nivel, mensaje])
        return resultado
    }

    static async eliminarLlamado({ id }) {
        const resultado = await query(`DELETE FROM llamados WHERE id_llamado = ?`, id)
        return resultado
    }

    static async actualizarLlamado({ id_llamado, id_preceptor, id_emisor, id_curso, numero_nivel, mensaje, finalizado, cancelado }) {
        let llamado = {
            id_preceptor,
            id_emisor,
            id_curso,
            numero_nivel,
            mensaje,
            finalizado,
            cancelado 
        };
    
        // Elimina campos vacíos
        llamado = Object.fromEntries(
            Object.entries(llamado).filter(([_, valor]) => valor !== undefined)
        );
    
        const campos = Object.keys(llamado);
        const valores = Object.values(llamado);
    
        const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
        const consulta = `UPDATE llamados SET ${setClause} WHERE id_llamado = ?;`;
    
        try {
            await query(consulta, [...valores, id_llamado]);
        } catch (err) {
            throw new ErrorCliente(err.message, 400);
        }
    }
    
}

export default LlamadoServicio