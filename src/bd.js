import mysql from 'mysql2/promise'

const CONFIGURACION = {
    user: 'root',
    database: 'auka',
    password: '',
    port: 3306,
    host: 'localhost',
}

export async function query(sql, valores) {
    try {
        const conexion = await mysql.createConnection(CONFIGURACION)

        const data = await conexion.query(sql, valores)
        await conexion.end()

        return data[0]
    } catch(err) {
        console.error(err)
        throw new Error('No se pudo conectar con la base de datos.')
    }
}