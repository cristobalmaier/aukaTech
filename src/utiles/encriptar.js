import { hashSync, genSaltSync } from 'bcrypt'

const rondas = 10

export async function encriptar({ contrasena }) {
    const salt = genSaltSync(rondas)
    const hash = hashSync(contrasena, salt)
    return hash
}