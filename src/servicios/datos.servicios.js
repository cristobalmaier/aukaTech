import { query } from "../bd.js"

class DatosServicios {
    static async tablasTamano() {
        const resultado = await query('SELECT ROUND(COUNT(*) * 428 / 1024 / 1024, 2) AS size_MB FROM llamados')

        return resultado
    }
}

export default DatosServicios