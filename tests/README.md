# Pruebas Unitarias - Proyecto Auka

Este directorio contiene todas las pruebas unitarias del proyecto Auka, organizadas de manera estructurada para facilitar el mantenimiento y la comprensión del código.

## 📁 Estructura de Directorios

```
tests/
├── fixtures/           # Datos de prueba reutilizables
│   └── usuarios.js     # Datos de ejemplo para usuarios
├── integration/        # Pruebas de integración (APIs)
│   └── usuario.rutas.test.js
├── unit/              # Pruebas unitarias (lógica de negocio)
│   ├── bd.test.js                    # Funciones de base de datos
│   ├── encriptar.test.js             # Utilidades de encriptación
│   ├── error.test.js                 # Clase de errores personalizados
│   ├── usuario.servicios.test.js     # Servicio de usuarios
│   └── usuario.validadores.test.js   # Validadores de datos
├── setup.js           # Configuración global de pruebas
└── README.md          # Este archivo
```

## 🧪 Tipos de Pruebas

### Pruebas Unitarias (`unit/`)
Estas pruebas verifican la funcionalidad de componentes individuales de forma aislada:

- **`bd.test.js`**: Prueba las funciones de conexión y consulta a la base de datos
- **`encriptar.test.js`**: Verifica las funciones de encriptación y comparación de contraseñas
- **`error.test.js`**: Prueba la clase ErrorCliente para manejo de errores personalizados
- **`usuario.servicios.test.js`**: Verifica toda la lógica de negocio del servicio de usuarios
- **`usuario.validadores.test.js`**: Prueba las validaciones de datos de usuario

### Pruebas de Integración (`integration/`)
Estas pruebas verifican que los componentes trabajen correctamente juntos:

- **`usuario.rutas.test.js`**: Prueba las rutas de la API de usuarios

### Fixtures (`fixtures/`)
Contienen datos de prueba reutilizables:

- **`usuarios.js`**: Datos de ejemplo para usuarios en diferentes escenarios

## 🚀 Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar solo pruebas unitarias
```bash
npm test -- tests/unit/
```

### Ejecutar solo pruebas de integración
```bash
npm test -- tests/integration/
```

### Ejecutar una prueba específica
```bash
npm test -- tests/unit/usuario.servicios.test.js
```

### Ejecutar con cobertura de código
```bash
npm test -- --coverage
```

## 📊 Interpretación de Resultados

### Ejemplo de salida exitosa:
```
 PASS  tests/unit/encriptar.test.js
 PASS  tests/unit/error.test.js
 PASS  tests/unit/bd.test.js
 PASS  tests/unit/usuario.validadores.test.js
 PASS  tests/unit/usuario.servicios.test.js

Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        2.5 s
```

### Significado de los símbolos:
- ✅ **PASS**: La prueba pasó exitosamente
- ❌ **FAIL**: La prueba falló (se muestra el error específico)
- ⚠️ **SKIP**: La prueba fue omitida temporalmente

## 🔧 Configuración Técnica

### Framework de Pruebas
- **Jest**: Framework principal para ejecutar las pruebas
- **ES Modules**: El proyecto usa `import/export` en lugar de `require/module.exports`

### Mocks y Simulaciones
Las pruebas utilizan mocks para simular dependencias externas:
- **Base de datos**: Se simulan las consultas SQL
- **Encriptación**: Se simulan las funciones de bcrypt
- **Validaciones**: Se simulan los esquemas de Zod

### Patrón de Pruebas
Todas las pruebas siguen el patrón **Arrange-Act-Assert**:
1. **Arrange**: Preparar los datos y configurar mocks
2. **Act**: Ejecutar la función que se está probando
3. **Assert**: Verificar que el resultado es el esperado

## 📝 Convenciones de Nomenclatura

### Archivos de Prueba
- Nombres descriptivos que indiquen qué se está probando
- Sufijo `.test.js` para identificar archivos de prueba
- Ubicación en directorios que reflejen la estructura del código fuente

### Nombres de Tests
- Descriptivos y en español para facilitar la comprensión
- Formato: "debe [acción] cuando [condición]"
- Ejemplo: "debe crear un usuario válido"

### Variables de Prueba
- Nombres claros que indiquen el propósito
- Sufijo `Mock` para datos simulados
- Sufijo `Valido`/`Invalido` para datos de prueba

## 🐛 Solución de Problemas Comunes

### Error: "Cannot use import statement outside a module"
- **Causa**: Jest no está configurado para ES Modules
- **Solución**: Verificar que `jest.config.js` tenga `extensionsToTreatAsEsm: ['.js']`

### Error: "require is not defined"
- **Causa**: Mezcla de CommonJS y ES Modules
- **Solución**: Usar `jest.unstable_mockModule` para mocks ESM

### Error: "Module not found"
- **Causa**: Rutas de importación incorrectas
- **Solución**: Usar rutas absolutas con `process.cwd()` en los mocks

## 📈 Cobertura de Código

Para generar reportes de cobertura:
```bash
npm test -- --coverage --coverageReporters=html
```

Esto generará un reporte HTML en `coverage/lcov-report/index.html` que muestra:
- Porcentaje de líneas cubiertas
- Porcentaje de funciones cubiertas
- Porcentaje de ramas cubiertas
- Líneas específicas que no están cubiertas

## 🤝 Contribución

Al agregar nuevas pruebas:
1. Sigue las convenciones de nomenclatura existentes
2. Usa el patrón Arrange-Act-Assert
3. Agrega comentarios explicativos para casos complejos
4. Asegúrate de que las pruebas sean independientes
5. Verifica que todas las pruebas pasen antes de hacer commit

## 📚 Recursos Adicionales

- [Documentación oficial de Jest](https://jestjs.io/docs/getting-started)
- [Guía de ES Modules en Jest](https://jestjs.io/docs/ecmascript-modules)
- [Patrones de testing](https://martinfowler.com/bliki/TestDouble.html) 