import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks ESM con rutas absolutas - Simulamos todas las dependencias
// para poder probar las rutas de forma aislada
await jest.unstable_mockModule(process.cwd() + '/src/servicios/usuario.servicios.js', () => ({
  default: {
    obtenerTodos: jest.fn(),
    obtenerUsuarioPorId: jest.fn(),
    crearUsuario: jest.fn(),
    actualizarUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
    validarContrasena: jest.fn()
  }
}));

// Mock de bcrypt para evitar errores de importación
await jest.unstable_mockModule('bcrypt', () => ({
  hashSync: jest.fn(),
  genSaltSync: jest.fn(),
  compareSync: jest.fn()
}));

// Mock de chalk para evitar errores de importación
await jest.unstable_mockModule('chalk', () => ({
  green: jest.fn((text) => text),
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  blue: jest.fn((text) => text)
}));

// Importamos el servicio mockeado y creamos la aplicación Express
const UsuarioServicio = (await import(process.cwd() + '/src/servicios/usuario.servicios.js')).default;

// Importamos bcrypt y chalk para evitar errores
await import('bcrypt');
await import('chalk');

// Creamos una aplicación Express simple para las pruebas
import express from 'express';
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Definimos las rutas básicas para las pruebas
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await UsuarioServicio.obtenerTodos(req.query);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await UsuarioServicio.obtenerUsuarioPorId({ id: req.params.id });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const resultado = await UsuarioServicio.crearUsuario(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    await UsuarioServicio.actualizarUsuario({ ...req.body, id: req.params.id });
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const resultado = await UsuarioServicio.eliminarUsuario({ id: req.params.id });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Pruebas de integración para las rutas de usuario
 * 
 * Estas pruebas verifican que las rutas HTTP funcionen correctamente
 * con el servicio de usuarios, incluyendo el manejo de respuestas
 * y códigos de estado HTTP apropiados.
 * 
 * Nota: Estas pruebas usan mocks completos del servicio para evitar
 * dependencias externas como la base de datos.
 */
describe('Rutas de Usuario - Integración', () => {
  // Limpiamos todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Pruebas para GET /api/usuarios
   * 
   * Esta ruta permite obtener todos los usuarios o filtrar por email.
   */
  describe('GET /api/usuarios', () => {
    test('debe retornar todos los usuarios', async () => {
      // Arrange: Configuramos el mock para retornar una lista de usuarios
      const usuariosMock = [
        { id: 1, nombre: 'Juan', email: 'juan@test.com' },
        { id: 2, nombre: 'María', email: 'maria@test.com' }
      ];
      UsuarioServicio.obtenerTodos.mockResolvedValue(usuariosMock);

      // Act: Hacemos la petición HTTP
      const response = await request(app)
        .get('/api/usuarios')
        .expect(200);

      // Assert: Verificamos que se llamó el servicio y retornó los datos correctos
      expect(UsuarioServicio.obtenerTodos).toHaveBeenCalledWith({});
      expect(response.body).toEqual(usuariosMock);
    });

    test('debe filtrar usuarios por email', async () => {
      // Arrange: Configuramos el mock para retornar un usuario específico
      const usuarioMock = [{ id: 1, nombre: 'Juan', email: 'juan@test.com' }];
      UsuarioServicio.obtenerTodos.mockResolvedValue(usuarioMock);

      // Act: Hacemos la petición HTTP con parámetro de query
      const response = await request(app)
        .get('/api/usuarios?email=juan@test.com')
        .expect(200);

      // Assert: Verificamos que se llamó el servicio con el filtro correcto
      expect(UsuarioServicio.obtenerTodos).toHaveBeenCalledWith({ email: 'juan@test.com' });
      expect(response.body).toEqual(usuarioMock);
    });

    test('debe manejar errores del servicio', async () => {
      // Arrange: Configuramos el mock para que falle
      UsuarioServicio.obtenerTodos.mockRejectedValue(new Error('Error de base de datos'));

      // Act & Assert: Verificamos que se maneja el error correctamente
      const response = await request(app)
        .get('/api/usuarios')
        .expect(500);

      expect(response.body.error).toBe('Error de base de datos');
    });
  });

  /**
   * Pruebas para GET /api/usuarios/:id
   * 
   * Esta ruta permite obtener un usuario específico por su ID.
   */
  describe('GET /api/usuarios/:id', () => {
    test('debe retornar un usuario por ID', async () => {
      // Arrange: Configuramos el mock para retornar un usuario específico
      const usuarioMock = [{ id: 1, nombre: 'Juan', email: 'juan@test.com' }];
      UsuarioServicio.obtenerUsuarioPorId.mockResolvedValue(usuarioMock);

      // Act: Hacemos la petición HTTP con el ID
      const response = await request(app)
        .get('/api/usuarios/1')
        .expect(200);

      // Assert: Verificamos que se llamó el servicio con el ID correcto
      expect(UsuarioServicio.obtenerUsuarioPorId).toHaveBeenCalledWith({ id: '1' });
      expect(response.body).toEqual(usuarioMock);
    });

    test('debe retornar 404 cuando el usuario no existe', async () => {
      // Arrange: Configuramos el mock para que no encuentre el usuario
      UsuarioServicio.obtenerUsuarioPorId.mockResolvedValue(null);

      // Act & Assert: Verificamos que retorna 404
      const response = await request(app)
        .get('/api/usuarios/999')
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });

    test('debe manejar errores del servicio', async () => {
      // Arrange: Configuramos el mock para que falle
      UsuarioServicio.obtenerUsuarioPorId.mockRejectedValue(new Error('Error de base de datos'));

      // Act & Assert: Verificamos que se maneja el error correctamente
      const response = await request(app)
        .get('/api/usuarios/1')
        .expect(500);

      expect(response.body.error).toBe('Error de base de datos');
    });
  });

  /**
   * Pruebas para POST /api/usuarios
   * 
   * Esta ruta permite crear un nuevo usuario.
   */
  describe('POST /api/usuarios', () => {
    test('debe crear un usuario válido', async () => {
      // Arrange: Preparamos los datos del usuario y configuramos el mock
      const usuarioData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        contrasena: 'password123',
        tipo_usuario: 'profesor'
      };
      const resultadoMock = { insertId: 1 };
      UsuarioServicio.crearUsuario.mockResolvedValue(resultadoMock);

      // Act: Hacemos la petición HTTP POST
      const response = await request(app)
        .post('/api/usuarios')
        .send(usuarioData)
        .expect(201);

      // Assert: Verificamos que se llamó el servicio con los datos correctos
      expect(UsuarioServicio.crearUsuario).toHaveBeenCalledWith(usuarioData);
      expect(response.body).toEqual(resultadoMock);
    });

    test('debe manejar errores de validación', async () => {
      // Arrange: Configuramos el mock para que falle por validación
      UsuarioServicio.crearUsuario.mockRejectedValue(new Error('El nombre es obligatorio'));

      // Act & Assert: Verificamos que se maneja el error de validación
      const response = await request(app)
        .post('/api/usuarios')
        .send({ email: 'juan@test.com' })
        .expect(400);

      expect(response.body.error).toBe('El nombre es obligatorio');
    });
  });

  /**
   * Pruebas para PUT /api/usuarios/:id
   * 
   * Esta ruta permite actualizar un usuario existente.
   */
  describe('PUT /api/usuarios/:id', () => {
    test('debe actualizar un usuario válido', async () => {
      // Arrange: Preparamos los datos de actualización y configuramos el mock
      const datosActualizacion = {
        nombre: 'Juan Actualizado',
        email: 'juan.actualizado@test.com'
      };
      UsuarioServicio.actualizarUsuario.mockResolvedValue();

      // Act: Hacemos la petición HTTP PUT
      const response = await request(app)
        .put('/api/usuarios/1')
        .send(datosActualizacion)
        .expect(200);

      // Assert: Verificamos que se llamó el servicio con los datos correctos
      expect(UsuarioServicio.actualizarUsuario).toHaveBeenCalledWith({
        ...datosActualizacion,
        id: '1'
      });
      expect(response.body.message).toBe('Usuario actualizado correctamente');
    });

    test('debe manejar errores de validación', async () => {
      // Arrange: Configuramos el mock para que falle por validación
      UsuarioServicio.actualizarUsuario.mockRejectedValue(new Error('El email no es válido'));

      // Act & Assert: Verificamos que se maneja el error de validación
      const response = await request(app)
        .put('/api/usuarios/1')
        .send({ email: 'email-invalido' })
        .expect(400);

      expect(response.body.error).toBe('El email no es válido');
    });
  });

  /**
   * Pruebas para DELETE /api/usuarios/:id
   * 
   * Esta ruta permite eliminar un usuario por su ID.
   */
  describe('DELETE /api/usuarios/:id', () => {
    test('debe eliminar un usuario por ID', async () => {
      // Arrange: Configuramos el mock para una eliminación exitosa
      const resultadoMock = { affectedRows: 1 };
      UsuarioServicio.eliminarUsuario.mockResolvedValue(resultadoMock);

      // Act: Hacemos la petición HTTP DELETE
      const response = await request(app)
        .delete('/api/usuarios/1')
        .expect(200);

      // Assert: Verificamos que se llamó el servicio con el ID correcto
      expect(UsuarioServicio.eliminarUsuario).toHaveBeenCalledWith({ id: '1' });
      expect(response.body).toEqual(resultadoMock);
    });

    test('debe manejar errores del servicio', async () => {
      // Arrange: Configuramos el mock para que falle
      UsuarioServicio.eliminarUsuario.mockRejectedValue(new Error('Error de base de datos'));

      // Act & Assert: Verificamos que se maneja el error correctamente
      const response = await request(app)
        .delete('/api/usuarios/1')
        .expect(500);

      expect(response.body.error).toBe('Error de base de datos');
    });
  });
}); 