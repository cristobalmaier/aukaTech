import { hashSync, genSaltSync } from 'bcrypt'

const rondas = parseInt(process.env.RONDAS)

export async function encriptar({ contrasena }) {
    const salt = genSaltSync(rondas)
    const hash = hashSync(contrasena, salt)
    return hash
}