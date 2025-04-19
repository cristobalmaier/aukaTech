import { hashSync, genSaltSync, compareSync } from 'bcrypt'

const rondas = parseInt(process.env.RONDAS)

export async function encriptar({ contrasena }) {
    const salt = genSaltSync(rondas)
    const hash = hashSync(contrasena, salt)
    return hash
}

export async function compararContrasena({ contrasena, contrasena_encriptada }) {
    const resultado = await compareSync(contrasena, contrasena_encriptada)
    return resultado
}