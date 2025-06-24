/**
 * Fixtures de datos para pruebas de usuarios
 * 
 * Este archivo contiene datos de ejemplo que se utilizan en las pruebas
 * para simular usuarios reales sin necesidad de crear datos en la base de datos.
 * 
 * Los datos están organizados por escenarios de prueba para facilitar
 * su reutilización y mantenimiento.
 */

/**
 * Usuario válido para pruebas de creación
 * Contiene todos los campos requeridos con valores válidos
 */
export const usuarioValido = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@test.com',
    contrasena: 'password123',
    tipo_usuario: 'profesor'
};

/**
 * Usuario válido tipo preceptor
 * Para probar diferentes tipos de usuario
 */
export const usuarioPreceptor = {
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@test.com',
    contrasena: 'password456',
    tipo_usuario: 'preceptor'
};

/**
 * Usuario válido tipo directivo
 * Para probar el tipo de usuario directivo
 */
export const usuarioDirectivo = {
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@test.com',
    contrasena: 'password789',
    tipo_usuario: 'directivo'
};

/**
 * Usuario inválido - falta nombre
 * Para probar validaciones de campos requeridos
 */
export const usuarioSinNombre = {
    apellido: 'Pérez',
    email: 'juan.perez@test.com',
    contrasena: 'password123',
    tipo_usuario: 'profesor'
};

/**
 * Usuario inválido - email mal formateado
 * Para probar validaciones de formato de email
 */
export const usuarioEmailInvalido = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'email-invalido',
    contrasena: 'password123',
    tipo_usuario: 'profesor'
};

/**
 * Usuario inválido - contraseña muy corta
 * Para probar validaciones de longitud mínima
 */
export const usuarioContrasenaCorta = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@test.com',
    contrasena: '123', // Solo 3 caracteres (mínimo 6)
    tipo_usuario: 'profesor'
};

/**
 * Usuario inválido - tipo de usuario no permitido
 * Para probar validaciones de valores permitidos
 */
export const usuarioTipoInvalido = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@test.com',
    contrasena: 'password123',
    tipo_usuario: 'admin' // Tipo no permitido
};

/**
 * Datos de actualización válidos
 * Para probar la actualización de usuarios existentes
 */
export const datosActualizacionValidos = {
    id: 1,
    nombre: 'Juan Actualizado',
    email: 'juan.actualizado@test.com'
};

/**
 * Datos de actualización con contraseña nueva
 * Para probar la actualización incluyendo cambio de contraseña
 */
export const datosActualizacionConContrasena = {
    id: 1,
    nombre: 'Juan Actualizado',
    email: 'juan.actualizado@test.com',
    contrasena: 'nuevaPassword123'
};

/**
 * Datos de actualización inválidos - email mal formateado
 * Para probar validaciones en actualizaciones
 */
export const datosActualizacionEmailInvalido = {
    id: 1,
    email: 'email-invalido'
};

/**
 * Lista de usuarios para pruebas de listado
 * Simula múltiples usuarios en la base de datos
 */
export const listaUsuarios = [
    {
        id_usuario: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@test.com',
        tipo_usuario: 'profesor',
        fecha_creacion: '2024-01-01 10:00:00'
    },
    {
        id_usuario: 2,
        nombre: 'María',
        apellido: 'García',
        email: 'maria.garcia@test.com',
        tipo_usuario: 'preceptor',
        fecha_creacion: '2024-01-02 11:00:00'
    },
    {
        id_usuario: 3,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos.lopez@test.com',
        tipo_usuario: 'directivo',
        fecha_creacion: '2024-01-03 12:00:00'
    }
];

/**
 * Usuario con contraseña encriptada
 * Para probar la validación de contraseñas
 */
export const usuarioConContrasenaEncriptada = {
    id_usuario: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@test.com',
    contrasena: '$2b$10$hashedPassword123', // Contraseña encriptada simulada
    tipo_usuario: 'profesor'
};

/**
 * Datos de login válidos
 * Para probar la autenticación de usuarios
 */
export const datosLoginValidos = {
    email: 'juan.perez@test.com',
    contrasena: 'password123'
};

/**
 * Datos de login inválidos - usuario inexistente
 * Para probar el manejo de usuarios no encontrados
 */
export const datosLoginUsuarioInexistente = {
    email: 'usuario.inexistente@test.com',
    contrasena: 'password123'
};

/**
 * Datos de login inválidos - contraseña incorrecta
 * Para probar el manejo de contraseñas incorrectas
 */
export const datosLoginContrasenaIncorrecta = {
    email: 'juan.perez@test.com',
    contrasena: 'passwordIncorrecta'
};

export const usuariosValidos = [
    {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        contrasena: 'password123',
        tipo_usuario: 'profesor'
    },
    {
        id: 2,
        nombre: 'María',
        apellido: 'García',
        email: 'maria@test.com',
        contrasena: 'password456',
        tipo_usuario: 'preceptor'
    },
    {
        id: 3,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@test.com',
        contrasena: 'password789',
        tipo_usuario: 'directivo'
    }
];

export const usuariosInvalidos = [
    {
        // Falta nombre
        apellido: 'Pérez',
        email: 'juan@test.com',
        contrasena: 'password123',
        tipo_usuario: 'profesor'
    },
    {
        nombre: 'Juan',
        // Falta apellido
        email: 'juan@test.com',
        contrasena: 'password123',
        tipo_usuario: 'profesor'
    },
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'email-invalido',
        contrasena: 'password123',
        tipo_usuario: 'profesor'
    },
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        contrasena: '123', // Muy corta
        tipo_usuario: 'profesor'
    },
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        contrasena: 'password123',
        tipo_usuario: 'admin' // Tipo inválido
    }
];

export const datosActualizacion = [
    {
        nombre: 'Juan Actualizado',
        email: 'juan.actualizado@test.com'
    },
    {
        apellido: 'Pérez Actualizado',
        tipo_usuario: 'directivo'
    },
    {
        contrasena: 'nuevaPassword123'
    }
];

export const datosActualizacionInvalidos = [
    {
        email: 'email-invalido'
    },
    {
        tipo_usuario: 'admin'
    },
    {
        nombre: 'a'.repeat(65) // Muy largo
    }
]; 