import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function obtenerDatosToken(req) {
    const token = req.cookies.access_token
    try {
        const usuario = jwt.verify(token, JWT_SECRET)
        return usuario
    } catch {}
}