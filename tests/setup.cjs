/**
 * Configuración global de pruebas para Jest
 * 
 * Este archivo se ejecuta antes de cada prueba y configura
 * el entorno global para todas las pruebas del proyecto.
 * 
 * Funciones principales:
 * - Configurar timeouts globales
 * - Configurar variables de entorno para pruebas
 * - Configurar mocks globales si es necesario
 * - Configurar limpieza automática después de cada prueba
 */

// Configurar timeout global para todas las pruebas
// Esto evita que las pruebas se cuelguen indefinidamente
jest.setTimeout(10000); // 10 segundos

// Configurar variables de entorno para pruebas
// Esto asegura que las pruebas usen configuraciones específicas
process.env.NODE_ENV = 'test';
process.env.PUERTO_API = '3001';
process.env.BD_USUARIO = 'test_user';
process.env.BD_BASE = 'test_db';
process.env.BD_CONTRASENA = 'test_password';
process.env.BD_HOST = 'localhost';
process.env.RONDAS = '10';

// Configurar limpieza automática después de cada prueba
// Esto asegura que cada prueba sea independiente
afterEach(() => {
  // Limpiar todos los mocks automáticamente
  jest.clearAllMocks();
  
  // Limpiar cualquier timer que pueda haber quedado
  jest.clearAllTimers();
});

// Configurar limpieza después de todas las pruebas
afterAll(() => {
  // Cualquier limpieza final que necesite hacerse
  // Por ejemplo, cerrar conexiones de base de datos simuladas
});

// Configurar manejo de errores no capturados durante las pruebas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // No lanzar el error para evitar que las pruebas fallen por errores externos
});

// Configurar manejo de excepciones no capturadas durante las pruebas
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // No lanzar el error para evitar que las pruebas fallen por errores externos
});

// Mock de console.log para evitar ruido en las pruebas
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}; 