import { jest } from '@jest/globals';

// Mock de mysql2/promise para ESM - Simulamos la conexión a la base de datos
// para poder probar las funciones sin necesidad de una BD real
await jest.unstable_mockModule('mysql2/promise', () => ({
  default: {
    createConnection: jest.fn()
  }
}));

// Importamos las funciones que vamos a probar
const mysql = (await import('mysql2/promise')).default;
const { query, pruebaConexion } = await import('../../src/bd.js');

/**
 * Pruebas unitarias para las funciones de base de datos
 * 
 * Estas pruebas verifican que las funciones de conexión y consulta
 * a la base de datos funcionen correctamente, incluyendo el manejo
 * de errores y casos edge.
 */
describe('Base de Datos', () => {
  let mockConnection;

  // Configuramos un mock de conexión antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnection = {
      query: jest.fn(),
      end: jest.fn()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  /**
   * Pruebas para la función query
   * 
   * Esta función ejecuta consultas SQL y maneja la conexión
   * automáticamente (abre y cierra la conexión).
   */
  describe('query', () => {
    test('debe ejecutar una consulta y retornar datos', async () => {
      // Arrange: Preparamos una consulta SQL y datos de prueba
      const sql = 'SELECT * FROM usuarios';
      const valores = [];
      const datosMock = [
        { id: 1, nombre: 'Juan' },
        { id: 2, nombre: 'María' }
      ];

      // Configuramos el mock para que retorne datos
      mockConnection.query.mockResolvedValue([datosMock]);

      // Act: Ejecutamos la consulta
      const resultado = await query(sql, valores);

      // Assert: Verificamos que se creó la conexión, ejecutó la consulta y la cerró
      expect(mysql.createConnection).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith(sql, valores);
      expect(mockConnection.end).toHaveBeenCalled();
      expect(resultado).toEqual(datosMock);
    });

    test('debe retornar null cuando no hay resultados', async () => {
      // Arrange: Preparamos una consulta que no retorna resultados
      const sql = 'SELECT * FROM usuarios WHERE id = ?';
      const valores = [999];

      // Configuramos el mock para que retorne un array vacío
      mockConnection.query.mockResolvedValue([[]]);

      // Act: Ejecutamos la consulta
      const resultado = await query(sql, valores);

      // Assert: Verificamos que retorna null cuando no hay resultados
      expect(mockConnection.query).toHaveBeenCalledWith(sql, valores);
      expect(mockConnection.end).toHaveBeenCalled();
      expect(resultado).toBeNull();
    });

    test('debe manejar errores de conexión', async () => {
      // Arrange: Simulamos un error de conexión
      const sql = 'SELECT * FROM usuarios';
      const valores = [];
      const errorMock = new Error('Error de conexión');

      // Configuramos el mock para que falle al crear la conexión
      mysql.createConnection.mockRejectedValue(errorMock);

      // Act & Assert: Verificamos que se lanza el error correcto
      await expect(query(sql, valores)).rejects.toThrow('No se pudo conectar con la base de datos.');
    });

    test('debe manejar errores de consulta', async () => {
      // Arrange: Simulamos un error en la consulta SQL
      const sql = 'SELECT * FROM tabla_inexistente';
      const valores = [];
      const errorMock = new Error('Tabla no existe');

      // Configuramos el mock para que falle al ejecutar la consulta
      mockConnection.query.mockRejectedValue(errorMock);

      // Act & Assert: Verificamos que se lanza el error correcto
      await expect(query(sql, valores)).rejects.toThrow('No se pudo conectar con la base de datos.');
    });

    test('debe ejecutar consulta con parámetros', async () => {
      // Arrange: Preparamos una consulta INSERT con parámetros
      const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
      const valores = ['Juan', 'juan@email.com'];
      const datosMock = { insertId: 1 };

      // Configuramos el mock para que retorne el resultado del INSERT
      mockConnection.query.mockResolvedValue([datosMock]);

      // Act: Ejecutamos la consulta
      const resultado = await query(sql, valores);

      // Assert: Verificamos que se ejecutó correctamente con los parámetros
      expect(mockConnection.query).toHaveBeenCalledWith(sql, valores);
      expect(resultado).toEqual(datosMock);
    });
  });

  /**
   * Pruebas para la función pruebaConexion
   * 
   * Esta función verifica que se puede establecer una conexión
   * con la base de datos ejecutando una consulta simple.
   */
  describe('pruebaConexion', () => {
    test('debe retornar true cuando la conexión es exitosa', async () => {
      // Arrange: Configuramos el mock para una conexión exitosa
      mockConnection.query.mockResolvedValue([{ '1': 1 }]);

      // Act: Probamos la conexión
      const resultado = await pruebaConexion();

      // Assert: Verificamos que se creó la conexión, ejecutó la consulta y la cerró
      expect(mysql.createConnection).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith('SELECT 1');
      expect(mockConnection.end).toHaveBeenCalled();
      expect(resultado).toBe(true);
    });

    test('debe lanzar error cuando la conexión falla', async () => {
      // Arrange: Simulamos un error de conexión
      const errorMock = new Error('Error de conexión a la base de datos');
      mysql.createConnection.mockRejectedValue(errorMock);

      // Act & Assert: Verificamos que se lanza el error correcto
      await expect(pruebaConexion()).rejects.toThrow('Error de conexión a la base de datos');
    });

    test('debe lanzar error cuando la consulta falla', async () => {
      // Arrange: Simulamos un error en la consulta de prueba
      const errorMock = new Error('Error en la consulta');
      mockConnection.query.mockRejectedValue(errorMock);

      // Act & Assert: Verificamos que se lanza el error correcto
      await expect(pruebaConexion()).rejects.toThrow('Error en la consulta');
    });
  });
}); 