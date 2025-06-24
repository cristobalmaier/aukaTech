import { jest } from '@jest/globals';

// Mocks ESM con rutas absolutas - Simulamos todas las dependencias
// para poder probar el servicio de forma aislada
await jest.unstable_mockModule(process.cwd() + '/src/bd.js', () => ({
    query: jest.fn()
}));

await jest.unstable_mockModule(process.cwd() + '/src/utiles/encriptar.js', () => ({
    encriptar: jest.fn(),
    compararContrasena: jest.fn()
}));

await jest.unstable_mockModule(process.cwd() + '/src/utiles/error.js', () => ({
    default: jest.fn().mockImplementation((mensaje, codigo) => {
        const error = new Error(mensaje);
        error.statusCode = codigo;
        error.name = 'ErrorCliente';
        return error;
    })
}));

await jest.unstable_mockModule(process.cwd() + '/src/validadores/usuario.js', () => ({
    validarUsuario: jest.fn(),
    validarActualizacionUsuario: jest.fn()
}));

// Importamos las funciones mockeadas y el servicio que vamos a probar
const { query } = await import(process.cwd() + '/src/bd.js');
const { encriptar, compararContrasena } = await import(process.cwd() + '/src/utiles/encriptar.js');
const { validarUsuario, validarActualizacionUsuario } = await import(process.cwd() + '/src/validadores/usuario.js');
const ErrorCliente = (await import(process.cwd() + '/src/utiles/error.js')).default;
const UsuarioServicio = (await import(process.cwd() + '/src/servicios/usuario.servicios.js')).default;

/**
 * Pruebas unitarias para el servicio de usuarios
 * 
 * Estas pruebas verifican que todos los métodos del servicio de usuarios
 * funcionen correctamente, incluyendo la lógica de negocio, validaciones,
 * encriptación de contraseñas y manejo de errores.
 */
describe('UsuarioServicio', () => {
    // Limpiamos todos los mocks antes de cada prueba
    // para asegurar que cada test sea independiente
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Pruebas para el método obtenerTodos
     * 
     * Este método permite obtener todos los usuarios o filtrar por email.
     */
    describe('obtenerTodos', () => {
        test('debe obtener todos los usuarios cuando no se proporciona email', async () => {
            // Arrange: Preparamos datos de prueba y configuramos el mock
            const usuariosMock = [
                { id: 1, nombre: 'Juan', email: 'juan@test.com' },
                { id: 2, nombre: 'María', email: 'maria@test.com' }
            ];
            query.mockResolvedValue(usuariosMock);

            // Act: Llamamos al método sin filtros
            const resultado = await UsuarioServicio.obtenerTodos({});

            // Assert: Verificamos que se ejecutó la consulta correcta y retornó los datos
            expect(query).toHaveBeenCalledWith('SELECT * FROM usuarios');
            expect(resultado).toEqual(usuariosMock);
        });

        test('debe obtener usuarios filtrados por email', async () => {
            // Arrange: Preparamos un email específico y datos de prueba
            const email = 'juan@test.com';
            const usuarioMock = [{ id: 1, nombre: 'Juan', email }];
            query.mockResolvedValue(usuarioMock);

            // Act: Llamamos al método con filtro de email
            const resultado = await UsuarioServicio.obtenerTodos({ email });

            // Assert: Verificamos que se ejecutó la consulta con el filtro correcto
            expect(query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE email = ?', [email]);
            expect(resultado).toEqual(usuarioMock);
        });

        test('debe retornar null cuando no hay usuarios', async () => {
            // Arrange: Configuramos el mock para que no retorne resultados
            query.mockResolvedValue(null);

            // Act: Llamamos al método
            const resultado = await UsuarioServicio.obtenerTodos({});

            // Assert: Verificamos que retorna null cuando no hay datos
            expect(resultado).toBeNull();
        });
    });

    /**
     * Pruebas para el método obtenerUsuarioPorId
     * 
     * Este método permite obtener un usuario específico por su ID.
     */
    describe('obtenerUsuarioPorId', () => {
        test('debe obtener un usuario por ID', async () => {
            // Arrange: Preparamos un ID y datos de usuario
            const id = 1;
            const usuarioMock = [{ id, nombre: 'Juan', email: 'juan@test.com' }];
            query.mockResolvedValue(usuarioMock);

            // Act: Llamamos al método con el ID
            const resultado = await UsuarioServicio.obtenerUsuarioPorId({ id });

            // Assert: Verificamos que se ejecutó la consulta correcta
            expect(query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE id_usuario = ?', id);
            expect(resultado).toEqual(usuarioMock);
        });
    });

    /**
     * Pruebas para el método crearUsuario
     * 
     * Este método crea un nuevo usuario, validando los datos,
     * verificando que no exista, encriptando la contraseña y
     * guardándolo en la base de datos.
     */
    describe('crearUsuario', () => {
        // Datos de usuario válido que usaremos en varios tests
        const usuarioValido = {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan@test.com',
            contrasena: 'password123',
            tipo_usuario: 'profesor'
        };

        test('debe crear un usuario válido', async () => {
            // Arrange: Configuramos todos los mocks necesarios
            validarUsuario.mockReturnValue({ valido: true, datos: usuarioValido });
            query.mockResolvedValueOnce(null); // Usuario no existe
            encriptar.mockResolvedValue('hashedPassword');
            query.mockResolvedValueOnce({ insertId: 1 }); // Usuario creado exitosamente

            // Act: Llamamos al método de creación
            const resultado = await UsuarioServicio.crearUsuario(usuarioValido);

            // Assert: Verificamos todo el flujo de creación
            expect(validarUsuario).toHaveBeenCalledWith(usuarioValido);
            expect(query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE email = ?', [usuarioValido.email]);
            expect(encriptar).toHaveBeenCalledWith({ contrasena: usuarioValido.contrasena });
            expect(query).toHaveBeenCalledWith(
                'INSERT INTO usuarios (nombre, apellido, email, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
                [usuarioValido.nombre, usuarioValido.apellido, usuarioValido.email, 'hashedPassword', usuarioValido.tipo_usuario]
            );
            expect(resultado).toEqual({ insertId: 1 });
        });

        test('debe lanzar error cuando la validación falla', async () => {
            // Arrange: Configuramos el mock para que la validación falle
            const errores = { nombre: ['El nombre es obligatorio'] };
            validarUsuario.mockReturnValue({ valido: false, errores });

            // Act & Assert: Verificamos que se lanza el error correcto
            await expect(UsuarioServicio.crearUsuario(usuarioValido)).rejects.toThrow('El nombre es obligatorio');
        });

        test('debe lanzar error cuando el usuario ya existe', async () => {
            // Arrange: Configuramos el mock para que el usuario ya exista
            validarUsuario.mockReturnValue({ valido: true, datos: usuarioValido });
            query.mockResolvedValueOnce([{ id: 1, email: usuarioValido.email }]); // Usuario existe

            // Act & Assert: Verificamos que se lanza el error de usuario duplicado
            await expect(UsuarioServicio.crearUsuario(usuarioValido)).rejects.toThrow('El usuario ya existe');
        });
    });

    /**
     * Pruebas para el método actualizarUsuario
     * 
     * Este método actualiza un usuario existente, validando los datos
     * y encriptando la contraseña si se proporciona.
     */
    describe('actualizarUsuario', () => {
        // Datos de actualización que usaremos en varios tests
        const datosActualizacion = {
            id: 1,
            nombre: 'Juan Actualizado',
            email: 'juan.actualizado@test.com'
        };

        test('debe actualizar un usuario válido', async () => {
            // Arrange: Configuramos los mocks para una actualización exitosa
            validarActualizacionUsuario.mockReturnValue({ valido: true, datos: datosActualizacion });
            query.mockResolvedValue({ affectedRows: 1 });

            // Act: Llamamos al método de actualización
            await UsuarioServicio.actualizarUsuario(datosActualizacion);

            // Assert: Verificamos que se validó y actualizó correctamente
            expect(validarActualizacionUsuario).toHaveBeenCalledWith({
                nombre: 'Juan Actualizado',
                email: 'juan.actualizado@test.com'
            });
            expect(query).toHaveBeenCalledWith(
                'UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?',
                ['Juan Actualizado', 'juan.actualizado@test.com', 1]
            );
        });

        test('debe actualizar usuario con contraseña', async () => {
            // Arrange: Preparamos datos con contraseña nueva
            const datosConContrasena = {
                ...datosActualizacion,
                contrasena: 'nuevaPassword123'
            };

            validarActualizacionUsuario.mockReturnValue({ valido: true, datos: datosConContrasena });
            encriptar.mockResolvedValue('hashedNewPassword');
            query.mockResolvedValue({ affectedRows: 1 });

            // Act: Llamamos al método de actualización
            await UsuarioServicio.actualizarUsuario(datosConContrasena);

            // Assert: Verificamos que se encriptó la contraseña y se actualizó
            expect(encriptar).toHaveBeenCalledWith({ contrasena: 'nuevaPassword123' });
            expect(query).toHaveBeenCalledWith(
                'UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id_usuario = ?',
                ['Juan Actualizado', 'juan.actualizado@test.com', 'hashedNewPassword', 1]
            );
        });

        test('debe lanzar error cuando la validación falla', async () => {
            // Arrange: Configuramos el mock para que la validación falle
            const errores = { email: ['El email no es válido'] };
            validarActualizacionUsuario.mockReturnValue({ valido: false, errores });

            // Act & Assert: Verificamos que se lanza el error correcto
            await expect(UsuarioServicio.actualizarUsuario(datosActualizacion)).rejects.toThrow('El email no es válido');
        });

        test('debe lanzar error cuando la actualización falla', async () => {
            // Arrange: Configuramos el mock para que la actualización falle
            validarActualizacionUsuario.mockReturnValue({ valido: true, datos: datosActualizacion });
            query.mockRejectedValue(new Error('Error de base de datos'));

            // Act & Assert: Verificamos que se propaga el error de la base de datos
            await expect(UsuarioServicio.actualizarUsuario(datosActualizacion)).rejects.toThrow('Error de base de datos');
        });
    });

    /**
     * Pruebas para el método eliminarUsuario
     * 
     * Este método elimina un usuario por su ID.
     */
    describe('eliminarUsuario', () => {
        test('debe eliminar un usuario por ID', async () => {
            // Arrange: Configuramos el mock para una eliminación exitosa
            const id = 1;
            query.mockResolvedValue({ affectedRows: 1 });

            // Act: Llamamos al método de eliminación
            const resultado = await UsuarioServicio.eliminarUsuario({ id });

            // Assert: Verificamos que se ejecutó la consulta correcta
            expect(query).toHaveBeenCalledWith('DELETE FROM usuarios WHERE id_usuario = ?', id);
            expect(resultado).toEqual({ affectedRows: 1 });
        });
    });

    /**
     * Pruebas para el método validarContrasena
     * 
     * Este método valida si una contraseña coincide con la almacenada
     * para un usuario específico.
     */
    describe('validarContrasena', () => {
        test('debe validar contraseña correcta', async () => {
            // Arrange: Preparamos datos de validación y configuramos mocks
            const email = 'juan@test.com';
            const contrasena = 'password123';
            const usuarioMock = [{ contrasena: 'hashedPassword' }];

            query.mockResolvedValue(usuarioMock);
            compararContrasena.mockResolvedValue(true);

            // Act: Llamamos al método de validación
            const resultado = await UsuarioServicio.validarContrasena({ email, contrasena });

            // Assert: Verificamos que se consultó la BD y comparó correctamente
            expect(query).toHaveBeenCalledWith('SELECT contrasena FROM usuarios WHERE email = ?', email);
            expect(compararContrasena).toHaveBeenCalledWith({ contrasena, contrasena_encriptada: 'hashedPassword' });
            expect(resultado).toBe(true);
        });

        test('debe lanzar error cuando el usuario no existe', async () => {
            // Arrange: Configuramos el mock para que no encuentre el usuario
            const email = 'usuario@inexistente.com';
            const contrasena = 'password123';
            query.mockResolvedValue(null);

            // Act & Assert: Verificamos que se lanza el error correcto
            await expect(UsuarioServicio.validarContrasena({ email, contrasena })).rejects.toThrow('No se encontro ningún usuario con ese email');
        });

        test('debe retornar false para contraseña incorrecta', async () => {
            // Arrange: Configuramos el mock para que la comparación falle
            const email = 'juan@test.com';
            const contrasena = 'passwordIncorrecta';
            const usuarioMock = [{ contrasena: 'hashedPassword' }];

            query.mockResolvedValue(usuarioMock);
            compararContrasena.mockResolvedValue(false);

            // Act: Llamamos al método de validación
            const resultado = await UsuarioServicio.validarContrasena({ email, contrasena });

            // Assert: Verificamos que retorna false para contraseñas incorrectas
            expect(resultado).toBe(false);
        });
    });
}); 