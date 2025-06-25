/**
 * Configuración de Jest para el proyecto Auka
 * 
 * Esta configuración permite ejecutar pruebas unitarias en un proyecto
 * que usa ES Modules (import/export) en lugar de CommonJS (require/module.exports).
 * 
 * Características principales:
 * - Soporte para ES Modules con extensionsToTreatAsEsm
 * - Transformación de archivos .js para ES Modules
 * - Configuración de entorno de pruebas
 * - Rutas de archivos de prueba
 */

export default {
    // Configuración del entorno de pruebas
    testEnvironment: 'node',
    
    // Transformaciones de archivos
    transform: {
        // Transforma archivos .js para soportar ES Modules
        '^.+\\.js$': 'babel-jest'
    },
    
    // Configuración de Babel para ES Modules
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    
    // Configuración de módulos
    moduleNameMapper: {
        // Permite importar archivos .js sin extensión
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    
    // Archivos de configuración de pruebas
    setupFilesAfterEnv: ['<rootDir>/tests/setup.cjs'],
    
    // Patrones de archivos de prueba
    testMatch: [
        '<rootDir>/tests/**/*.test.js'
    ],
    
    // Directorios que Jest debe ignorar
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    
    // Configuración de cobertura de código (opcional)
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/web/**/*.js'
    ],
    
    // Configuración de reportes de cobertura
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
}; 