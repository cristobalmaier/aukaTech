import { query } from "../bd.js"

class DatosServicios {
    static async todosLosDatos() {
        const [resultado] = await query('SELECT ROUND(COUNT(*) * 944 / 1024 / 1024, 2) AS size_MB, SUM(CASE WHEN MONTH(fecha_envio) = MONTH(CURRENT_DATE()) AND YEAR(fecha_envio) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS registros_mes_actual FROM solicitud')
        
        return resultado
    }

    static async tablasTamano() {
        const [resultado] = await query('SELECT ROUND(COUNT(*) * 944 / 1024 / 1024, 2) AS size_MB FROM solicitud')

        return resultado
    }

    static async solicitudDelMes() {
        const [resultado] = await query('SELECT COUNT(*) AS registros FROM solicitud WHERE MONTH(fecha_envio) = MONTH(CURRENT_DATE()) AND YEAR(fecha_envio) = YEAR(CURRENT_DATE())')

        return resultado
    }
}

export default DatosServicios