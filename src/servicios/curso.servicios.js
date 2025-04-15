import { query } from "../bd.js";

class CursoServicio {
    static async obtenerTodos() {
        const resultado = await query("SELECT * FROM cursos")
        return resultado
    }

    static async obtenerCursoPorId({ id }) {
        const resultado = await query(`SELECT * FROM cursos WHERE id_curso = ?`, id)
        return resultado
    }

    static async obtenerCursoPorNombre({ nombre }) {
        const resultado = await query(`SELECT * FROM cursos WHERE curso = ?`, nombre)
        return resultado
    }

    static async crearCurso({ nombre }) {
        const resultado = await query(`INSERT INTO cursos (nombre) VALUES (?)`, nombre)
        return resultado
    }

    static async actualizarCurso({ id, nombre }) {
        const resultado = await query(`UPDATE cursos SET nombre = ? WHERE id_curso = ?`, [nombre, id])
        return resultado
    }

    static async eliminarCurso({ id }) {
        const resultado = await query(`DELETE FROM cursos WHERE id_curso = ?`, id)
        return resultado
    }
}

export default CursoServicio