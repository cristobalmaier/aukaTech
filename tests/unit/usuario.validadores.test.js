import { validarUsuario, validarActualizacionUsuario } from '../../src/validadores/usuario.js';

/**
 * Pruebas unitarias para los validadores de usuario
 * 
 * Estas pruebas verifican que las funciones de validación de datos
 * de usuario funcionen correctamente, tanto para crear usuarios como
 * para actualizarlos. Se prueban casos válidos, inválidos y edge cases.
 */
describe('Validadores de Usuario', () => {
    /**
     * Pruebas para la función validarUsuario
     * 
     * Esta función valida los datos completos de un usuario nuevo
     * usando el esquema de Zod definido en el validador.
     */
    describe('validarUsuario', () => {
        test('debe validar un usuario con datos correctos', () => {
            // Arrange: Preparamos un usuario con todos los datos válidos
            const usuarioValido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan@test.com',
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioValido);

            // Assert: Verificamos que la validación fue exitosa
            expect(resultado.valido).toBe(true);
            expect(resultado.datos).toEqual(usuarioValido);
        });

        test('debe validar usuario tipo preceptor', () => {
            // Arrange: Probamos con tipo de usuario preceptor
            const usuario = {
                nombre: 'María',
                apellido: 'García',
                email: 'maria@test.com',
                contrasena: 'password123',
                tipo_usuario: 'preceptor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuario);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe validar usuario tipo directivo', () => {
            // Arrange: Probamos con tipo de usuario directivo
            const usuario = {
                nombre: 'Carlos',
                apellido: 'López',
                email: 'carlos@test.com',
                contrasena: 'password123',
                tipo_usuario: 'directivo'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuario);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe fallar cuando falta el nombre', () => {
            // Arrange: Preparamos un usuario sin nombre (campo requerido)
            const usuarioInvalido = {
                apellido: 'Pérez',
                email: 'juan@test.com',
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló y contiene el error específico
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.nombre).toBeDefined();
        });

        test('debe fallar cuando falta el apellido', () => {
            // Arrange: Preparamos un usuario sin apellido (campo requerido)
            const usuarioInvalido = {
                nombre: 'Juan',
                email: 'juan@test.com',
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.apellido).toBeDefined();
        });

        test('debe fallar cuando falta el email', () => {
            // Arrange: Preparamos un usuario sin email (campo requerido)
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.email).toBeDefined();
        });

        test('debe fallar cuando el email no es válido', () => {
            // Arrange: Preparamos un usuario con email inválido
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'email-invalido', // Email sin formato correcto
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló por email inválido
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.email).toBeDefined();
        });

        test('debe fallar cuando falta la contraseña', () => {
            // Arrange: Preparamos un usuario sin contraseña (campo requerido)
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan@test.com',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.contrasena).toBeDefined();
        });

        test('debe fallar cuando la contraseña es muy corta', () => {
            // Arrange: Preparamos un usuario con contraseña muy corta (mínimo 6 caracteres)
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan@test.com',
                contrasena: '123', // Solo 3 caracteres
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló por contraseña corta
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.contrasena).toBeDefined();
        });

        test('debe fallar cuando el tipo de usuario no es válido', () => {
            // Arrange: Preparamos un usuario con tipo inválido
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan@test.com',
                contrasena: 'password123',
                tipo_usuario: 'admin' // Tipo no permitido
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló por tipo inválido
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.tipo_usuario).toBeDefined();
        });

        test('debe fallar cuando el nombre es muy largo', () => {
            // Arrange: Preparamos un usuario con nombre muy largo (máximo 64 caracteres)
            const nombreLargo = 'a'.repeat(65); // 65 caracteres
            const usuarioInvalido = {
                nombre: nombreLargo,
                apellido: 'Pérez',
                email: 'juan@test.com',
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló por nombre largo
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.nombre).toBeDefined();
        });

        test('debe fallar cuando el email es muy largo', () => {
            // Arrange: Preparamos un usuario con email muy largo (máximo 64 caracteres)
            const emailLargo = 'a'.repeat(60) + '@test.com'; // Más de 64 caracteres
            const usuarioInvalido = {
                nombre: 'Juan',
                apellido: 'Pérez',
                email: emailLargo,
                contrasena: 'password123',
                tipo_usuario: 'profesor'
            };

            // Act: Validamos el usuario
            const resultado = validarUsuario(usuarioInvalido);

            // Assert: Verificamos que la validación falló por email largo
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.email).toBeDefined();
        });
    });

    /**
     * Pruebas para la función validarActualizacionUsuario
     * 
     * Esta función valida los datos para actualizar un usuario existente.
     * Es más flexible que validarUsuario porque permite campos opcionales.
     */
    describe('validarActualizacionUsuario', () => {
        test('debe validar actualización con datos correctos', () => {
            // Arrange: Preparamos datos de actualización válidos
            const datosActualizacion = {
                nombre: 'Juan Actualizado',
                email: 'juan.actualizado@test.com'
            };

            // Act: Validamos los datos de actualización
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que la validación fue exitosa
            expect(resultado.valido).toBe(true);
            expect(resultado.datos).toEqual(datosActualizacion);
        });

        test('debe validar actualización solo del nombre', () => {
            // Arrange: Probamos actualizar solo el nombre
            const datosActualizacion = {
                nombre: 'Juan Actualizado'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe validar actualización solo del email', () => {
            // Arrange: Probamos actualizar solo el email
            const datosActualizacion = {
                email: 'nuevo@test.com'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe validar actualización solo de la contraseña', () => {
            // Arrange: Probamos actualizar solo la contraseña
            const datosActualizacion = {
                contrasena: 'nuevaPassword123'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe validar actualización del tipo de usuario', () => {
            // Arrange: Probamos actualizar solo el tipo de usuario
            const datosActualizacion = {
                tipo_usuario: 'directivo'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que es válido
            expect(resultado.valido).toBe(true);
        });

        test('debe fallar cuando no se proporciona ningún campo', () => {
            // Arrange: Probamos con un objeto vacío
            const datosActualizacion = {};

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló porque no hay campos para actualizar
            expect(resultado.valido).toBe(false);
        });

        test('debe fallar cuando el email no es válido', () => {
            // Arrange: Probamos con email inválido
            const datosActualizacion = {
                email: 'email-invalido'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló por email inválido
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.email).toBeDefined();
        });

        test('debe fallar cuando el tipo de usuario no es válido', () => {
            // Arrange: Probamos con tipo de usuario inválido
            const datosActualizacion = {
                tipo_usuario: 'admin'
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló por tipo inválido
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.tipo_usuario).toBeDefined();
        });

        test('debe fallar cuando el nombre es muy largo', () => {
            // Arrange: Probamos con nombre muy largo
            const nombreLargo = 'a'.repeat(65);
            const datosActualizacion = {
                nombre: nombreLargo
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló por nombre largo
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.nombre).toBeDefined();
        });

        test('debe fallar cuando el apellido es muy largo', () => {
            // Arrange: Probamos con apellido muy largo
            const apellidoLargo = 'a'.repeat(65);
            const datosActualizacion = {
                apellido: apellidoLargo
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló por apellido largo
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.apellido).toBeDefined();
        });

        test('debe fallar cuando la contraseña es muy larga', () => {
            // Arrange: Probamos con contraseña muy larga
            const contrasenaLarga = 'a'.repeat(256);
            const datosActualizacion = {
                contrasena: contrasenaLarga
            };

            // Act: Validamos los datos
            const resultado = validarActualizacionUsuario(datosActualizacion);

            // Assert: Verificamos que falló por contraseña larga
            expect(resultado.valido).toBe(false);
            expect(resultado.errores.contrasena).toBeDefined();
        });
    });
}); 