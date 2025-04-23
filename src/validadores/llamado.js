import { z } from 'zod';

// Esquema de validación para la tabla llamados
const llamadoSchema = z.object({
    id_preceptor: z
        .nullable(),

    id_emisor: z
        .number({
            required_error: 'El ID del emisor es obligatorio',
        })
        .int()
        .positive('El ID del emisor debe ser positivo'),

    id_curso: z
        .number({ 
            required_error: 'El ID del curso es obligatorio',
            invalid_type_error: 'El ID del curso debe ser un número' 
        })
        .int()
        .positive('El ID del curso debe ser positivo'),

    numero_nivel: z
        .number({ 
            required_error: 'El número de nivel es obligatorio',
            invalid_type_error: 'El número de nivel debe ser un número' 
        })
        .int()
        .min(1, 'El número de nivel debe ser mayor a 0'),

    mensaje: z
        .string({
            required_error: 'El mensaje es obligatorio',
        })
        .min(1, 'El mensaje no puede estar vacío')
        .max(300, 'El mensaje no puede tener más de 300 caracteres'),
});

// Función para validar un nuevo llamado
export function validarLlamado(data) {
    const resultado = llamadoSchema.safeParse(data);
    if (!resultado.success) {
        return {
            valido: false,
            errores: resultado.error.flatten().fieldErrors,
        };
    }

    return {
        valido: true,
        datos: resultado.data,
    };
}
