import { query } from "../bd.js";

class AreaServicio {
    async obtenerTodos() {
        const resultado = await query("SELECT * FROM areas");
        return resultado;
    }

    async obtenerAreaPorId({ id }) {
        const resultado = await query("SELECT * FROM areas WHERE id_area = ?", [id]);
        return resultado[0] || null;
    }

    async obtenerAreaPorNombre({ nombre }) {
        const resultado = await query("SELECT * FROM areas WHERE nombre = ?", [nombre]);
        return resultado[0] || null;
    }

    async crearArea({ nombre }) {
        const resultado = await query("INSERT INTO areas (nombre) VALUES (?)", [nombre]);
        return { id: resultado.insertId, nombre };
    }

    async actualizarArea({ id, nombre }) {
        await query("UPDATE areas SET nombre = ? WHERE id_area = ?", [nombre, id]);
        return { id, nombre };
    }

    async eliminarArea({ id }) {
        await query("DELETE FROM areas WHERE id_area = ?", [id]);
        return { id };
    }
}

export default AreaServicio;