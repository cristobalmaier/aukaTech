import { jest } from '@jest/globals';

// Mock de bcrypt para ESM - Simulamos las funciones de encriptación
// para poder controlar su comportamiento en las pruebas
await jest.unstable_mockModule('bcrypt', () => ({
    hashSync: jest.fn(),
    genSaltSync: jest.fn(),
    compareSync: jest.fn()
}));

// Importamos las funciones que vamos a probar
const { encriptar, compararContrasena } = await import('../../src/utiles/encriptar.js');
const { hashSync, genSaltSync, compareSync } = await import('bcrypt');

/**
 * Pruebas unitarias para las utilidades de encriptación
 * 
 * Estas pruebas verifican que las funciones de encriptación y comparación
 * de contraseñas funcionen correctamente, tanto en casos normales como
 * en casos edge (contraseñas vacías, etc.).
 */
describe('Utilidades de Encriptación', () => {
    // Limpiamos todos los mocks antes de cada prueba
    // para asegurar que cada test sea independiente
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Pruebas para la función encriptar
     * 
     * Esta función toma una contraseña en texto plano y la convierte
     * en un hash seguro usando bcrypt.
     */
    describe('encriptar', () => {
        test('debe encriptar una contraseña correctamente', async () => {
            // Arrange: Preparamos los datos de prueba
            const contrasena = 'password123';
            const saltMock = 'salt123';
            const hashMock = 'hashedPassword123';

            // Configuramos los mocks para que retornen valores específicos
            genSaltSync.mockReturnValue(saltMock);
            hashSync.mockReturnValue(hashMock);

            // Act: Ejecutamos la función que queremos probar
            const resultado = await encriptar({ contrasena });

            // Assert: Verificamos que se llamaron las funciones correctas con los parámetros correctos
            expect(genSaltSync).toHaveBeenCalledWith(10); // Valor por defecto de rondas
            expect(hashSync).toHaveBeenCalledWith(contrasena, saltMock);
            expect(resultado).toBe(hashMock);
        });

        test('debe manejar contraseñas vacías', async () => {
            // Arrange: Probamos con una contraseña vacía
            const contrasena = '';
            const saltMock = 'salt123';
            const hashMock = 'hashedEmptyPassword';

            genSaltSync.mockReturnValue(saltMock);
            hashSync.mockReturnValue(hashMock);

            // Act: Ejecutamos la función
            const resultado = await encriptar({ contrasena });

            // Assert: Verificamos que funciona correctamente incluso con contraseñas vacías
            expect(genSaltSync).toHaveBeenCalled();
            expect(hashSync).toHaveBeenCalledWith(contrasena, saltMock);
            expect(resultado).toBe(hashMock);
        });
    });

    /**
     * Pruebas para la función compararContrasena
     * 
     * Esta función compara una contraseña en texto plano con un hash
     * para verificar si coinciden.
     */
    describe('compararContrasena', () => {
        test('debe retornar true para contraseñas válidas', async () => {
            // Arrange: Preparamos una contraseña y su hash correspondiente
            const contrasena = 'password123';
            const contrasena_encriptada = 'hashedPassword123';

            // Configuramos el mock para que simule una comparación exitosa
            compareSync.mockReturnValue(true);

            // Act: Ejecutamos la comparación
            const resultado = await compararContrasena({ contrasena, contrasena_encriptada });

            // Assert: Verificamos que se llamó la función correcta y retornó true
            expect(compareSync).toHaveBeenCalledWith(contrasena, contrasena_encriptada);
            expect(resultado).toBe(true);
        });

        test('debe retornar false para contraseñas inválidas', async () => {
            // Arrange: Probamos con una contraseña incorrecta
            const contrasena = 'wrongPassword';
            const contrasena_encriptada = 'hashedPassword123';

            // Configuramos el mock para que simule una comparación fallida
            compareSync.mockReturnValue(false);

            // Act: Ejecutamos la comparación
            const resultado = await compararContrasena({ contrasena, contrasena_encriptada });

            // Assert: Verificamos que retorna false para contraseñas incorrectas
            expect(compareSync).toHaveBeenCalledWith(contrasena, contrasena_encriptada);
            expect(resultado).toBe(false);
        });

        test('debe manejar contraseñas vacías', async () => {
            // Arrange: Probamos con una contraseña vacía
            const contrasena = '';
            const contrasena_encriptada = 'hashedPassword123';

            // Configuramos el mock para que simule una comparación fallida
            compareSync.mockReturnValue(false);

            // Act: Ejecutamos la comparación
            const resultado = await compararContrasena({ contrasena, contrasena_encriptada });

            // Assert: Verificamos que maneja correctamente las contraseñas vacías
            expect(compareSync).toHaveBeenCalledWith(contrasena, contrasena_encriptada);
            expect(resultado).toBe(false);
        });
    });
}); 