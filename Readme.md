# Pruebas Automatizadas — SauceDemo
## Semana 1: Login

Proyecto de automatización de pruebas con **Playwright** y **TypeScript**.

---

## Requisitos previos

- Node.js v18 o superior → https://nodejs.org
- VS Code → https://code.visualstudio.com

---

## Instalación (solo la primera vez)

```bash
# 1. Instalar dependencias del proyecto
npm install

# 2. Instalar los navegadores de Playwright
npx playwright install chromium
```

---

## Cómo correr las pruebas

```bash
# Correr todas las pruebas (sin ver el navegador)
npx playwright test

# Correr viendo el navegador en pantalla
npx playwright test --headed

# Correr solo un archivo específico
npx playwright test tests/login.spec.ts

# Correr solo una prueba por nombre
npx playwright test -g "Login exitoso"

# Ver el reporte HTML con los resultados
npx playwright show-report
```

---

## Estructura del proyecto

```
pruebas-saucedemo/
├── tests/
│   └── login.spec.ts     ← pruebas de login (Semana 1)
├── playwright.config.ts  ← configuración general
├── package.json
└── README.md
```

---

## Pruebas incluidas (Semana 1)

| # | Prueba | Resultado esperado |
|---|--------|--------------------|
| 1 | Login con usuario válido | Redirige a /inventory |
| 2 | Login con contraseña incorrecta | Muestra mensaje de error |
| 3 | Login con usuario inexistente | Muestra mensaje de error |
| 4 | Formulario vacío | "Username is required" |
| 5 | Solo falta la contraseña | "Password is required" |
| 6 | Usuario bloqueado | "User has been locked out" |
| 7 | Logout | Regresa a la página de login |

---

## 👥 Usuarios de prueba disponibles

| Usuario | Contraseña | Descripción |
|---------|-----------|-------------|
| standard_user | secret_sauce |  Usuario normal |
| locked_out_user | secret_sauce |  Bloqueado |
| problem_user | secret_sauce | Tiene bugs |
| performance_glitch_user | secret_sauce |  Carga lento |