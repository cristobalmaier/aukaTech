import { z } from 'zod'

const solicitudchema = z.object({
    id_soporte: z.nullable(z.number().int().positive()),
    id_emisor: z.number().int().positive(),
    id_area: z.number().int().positive(),
    numero_prioridad: z.number().int().min(1),
    mensaje: z.string().min(1).max(300),
})

const actualizarsolicitudchema = z.object({
    id_soporte: z.number().int().positive().optional(),
    id_emisor: z.number().int().positive().optional(),
    id_area: z.number().int().positive().optional(),
    numero_prioridad: z.number().int().min(1).optional(),
    mensaje: z.string().min(1).max(500).optional(),
    fecha_envio: z.string().datetime().optional(),
    finalizado: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'Debe incluir al menos un campo para actualizar',
})

export function validarActualizacionsolicitud(data) {
    const resultado = actualizarsolicitudchema.safeParse(data)
    if (!resultado.success) {
        return { valido: false, errores: resultado.error.flatten().fieldErrors }
    }
    return { valido: true, datos: resultado.data }
}

export function validarsolicitud(data) {
    const resultado = solicitudchema.safeParse(data)
    if (!resultado.success) {
        return { valido: false, errores: resultado.error.flatten().fieldErrors }
    }
    return { valido: true, datos: resultado.data }
}