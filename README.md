# App de Gestión de Usuarios

Una aplicación web para la **gestión de usuarios** desarrollada en Vue y TypeScript

**Las funcionalidades de la app:**

- Listar usuarios con el total de registros
- Crear, editar y eliminar usuarios
- Validaciones:
    - Email válido
    - RUT único con formato
    - Teléfono chileno, incluyendo el código +569 o +56 9
    - Campos de nombre sin números
    - No se elimina usuarios en día de cumpleaños 
    - Se puede añadir múltiples teléfonos y direcciones
    - Autenticación simulada con login

**Testing:**
- ``Vitest`` para pruebas unitarias y de integración
- ``@testing-library/vue`` para pruebas visuales (ui)
- ``msw`` para mocking de la API
- Autenticación: Login simulado con 'useAuth'
- API Mock: Simulada mediante ``msw`` y ``db.json`` 

**Tests incluidos:**
    - Unit Test 
    - UI Test
    - Integration Test
    - Mock Handlers

**Rutas:**

- '/' = login
- '/home' = listados de usuarios
- '/new' = formulario de crear usuario
- '/edit/:id' = formulario de editar usuario

**Instalación y ejecución:**
1. Instalar dependencias
``    npm install``
2. Levantar app:
``npm run dev``
3. Correr API fake si se usa JSON Server:
``npm run api``
4. Ejecutar los tests:
``npx vitest run``

## Ejecución de pruebas individuales

### Prueba unitaria
npx vitest run src/tests/unit/userService.test.ts

### Pruebas visuales (UI)
- npx vitest run src/tests/ui/addUser.ui.test.ts
- npx vitest run src/tests/ui/editUser.ui.test.ts
- npx vitest run src/tests/ui/deleteUser.ui.test.ts

### Prueba de integración
npx vitest run src/tests/integration/userApi.integration.test.ts
