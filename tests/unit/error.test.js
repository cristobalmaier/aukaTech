import ErrorCliente from '../../src/utiles/error.js';

/**
 * Pruebas unitarias para la clase ErrorCliente
 * 
 * Esta clase extiende Error nativo de JavaScript para crear errores
 * personalizados que incluyen un código de estado HTTP.
 * Es útil para manejar errores de manera consistente en toda la aplicación.
 */
describe('ErrorCliente', () => {
    test('debe crear un error con mensaje y código por defecto', () => {
        // Arrange: Preparamos un mensaje de error
        const mensaje = 'Error de prueba';
        
        // Act: Creamos una instancia de ErrorCliente
        const error = new ErrorCliente(mensaje);

        // Assert: Verificamos que se creó correctamente con los valores por defecto
        expect(error.message).toBe(mensaje);
        expect(error.name).toBe('ErrorCliente');
        expect(error.statusCode).toBe(400); // Código por defecto
        expect(error).toBeInstanceOf(Error); // Debe ser una instancia de Error
    });

    test('debe crear un error con mensaje y código personalizado', () => {
        // Arrange: Preparamos mensaje y código personalizados
        const mensaje = 'Error personalizado';
        const codigo = 404;
        
        // Act: Creamos una instancia con código personalizado
        const error = new ErrorCliente(mensaje, codigo);

        // Assert: Verificamos que se usó el código personalizado
        expect(error.message).toBe(mensaje);
        expect(error.name).toBe('ErrorCliente');
        expect(error.statusCode).toBe(codigo);
    });

    test('debe crear un error con código 500', () => {
        // Arrange: Probamos con código de error del servidor
        const mensaje = 'Error del servidor';
        const codigo = 500;
        
        // Act: Creamos el error
        const error = new ErrorCliente(mensaje, codigo);

        // Assert: Verificamos que se asignó correctamente el código 500
        expect(error.statusCode).toBe(500);
    });

    test('debe crear un error con código 401', () => {
        // Arrange: Probamos con código de no autorizado
        const mensaje = 'No autorizado';
        const codigo = 401;
        
        // Act: Creamos el error
        const error = new ErrorCliente(mensaje, codigo);

        // Assert: Verificamos que se asignó correctamente el código 401
        expect(error.statusCode).toBe(401);
    });

    test('debe manejar mensajes vacíos', () => {
        // Arrange: Probamos con un mensaje vacío
        const mensaje = '';
        
        // Act: Creamos el error
        const error = new ErrorCliente(mensaje);

        // Assert: Verificamos que maneja correctamente mensajes vacíos
        expect(error.message).toBe('');
        expect(error.statusCode).toBe(400);
    });

    test('debe manejar mensajes con caracteres especiales', () => {
        // Arrange: Probamos con caracteres especiales y acentos
        const mensaje = 'Error con ñ y áéíóú';
        
        // Act: Creamos el error
        const error = new ErrorCliente(mensaje);

        // Assert: Verificamos que maneja correctamente caracteres especiales
        expect(error.message).toBe(mensaje);
        expect(error.statusCode).toBe(400);
    });
}); 