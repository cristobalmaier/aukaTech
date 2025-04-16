import { z } from 'zod';

// Esquema de validación con Zod
const usuarioSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre es obligatorio')
        .max(64, 'El nombre no puede tener más de 64 caracteres'),

    apellido: z
        .string()
        .min(1, 'El apellido es obligatorio')
        .max(64, 'El apellido no puede tener más de 64 caracteres'),

    email: z
        .string()
        .email('El email no es válido')
        .max(64, 'El email no puede tener más de 64 caracteres'),

    contrasena: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres'),

    tipo_usuario: z.enum(['preceptor', 'profesor', 'directivo'], {
        errorMap: () => ({ message: 'Tipo de usuario no válido' }),
    }),
});

// Función para validar datos
export function validarUsuario(data) {
    const resultado = usuarioSchema.safeParse(data);
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