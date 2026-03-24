/**
 * ================================================================
 * SEMANA 1 — Pruebas de Login en SauceDemo
 * ================================================================
 *
 * ¿Qué vamos a probar?
 *   ✅ Login exitoso con usuario válido
 *   ❌ Login con contraseña incorrecta
 *   ❌ Login con usuario incorrecto
 *   ❌ Login con campos vacíos
 *   🔒 Login con usuario bloqueado
 *   🚪 Logout (cerrar sesión)
 *
 * Usuarios disponibles en SauceDemo:
 *   standard_user       → usuario normal, todo funciona
 *   locked_out_user     → bloqueado, no puede entrar
 *   problem_user        → entra pero tiene bugs en el sitio
 *   performance_glitch_user → entra lento
 *   Contraseña para todos: secret_sauce
 * ================================================================
 */

import { test, expect } from '@playwright/test';

// ----------------------------------------------------------------
// 🔧 DATOS DE PRUEBA
// Guardamos los datos aquí arriba para cambiarlos fácilmente
// ----------------------------------------------------------------
const USUARIO_VALIDO    = 'standard_user';
const USUARIO_BLOQUEADO = 'locked_out_user';
const CONTRASENA_VALIDA = 'secret_sauce';
const CONTRASENA_MALA   = 'contrasena_incorrecta';

// ----------------------------------------------------------------
// 🧩 beforeEach — se ejecuta ANTES de cada prueba automáticamente
// Sirve para no repetir código en cada test
// ----------------------------------------------------------------
test.beforeEach(async ({ page }) => {
  // Abre la página de login antes de cada prueba
  // Como definimos baseURL en playwright.config.ts, '/' equivale a saucedemo.com
  await page.goto('/');
});

// ================================================================
// TEST 1: Login exitoso wiiii
// ================================================================
test('✅ Login exitoso con usuario válido', async ({ page }) => {

  // PASO 1: Llenar el campo de usuario
  // page.fill(selector, valor) — encuentra el input y escribe el valor
  await page.fill('#user-name', USUARIO_VALIDO);

  // PASO 2: Llenar el campo de contraseña
  await page.fill('#password', CONTRASENA_VALIDA);

  // PASO 3: Hacer clic en el botón Login
  await page.click('#login-button');

  // PASO 4: Verificar que redirigió a la página de inventario
  // expect(...).toHaveURL() valida que la URL contenga '/inventory'
  await expect(page).toHaveURL(/inventory/);

  // PASO 5: Verificar que el título "Products" es visible
  // Esto confirma que realmente entramos al sistema
  await expect(page.locator('.title')).toHaveText('Products');
});


// ================================================================
// TEST 2: Contraseña incorrecta
// ================================================================
test('❌ Error con contraseña incorrecta', async ({ page }) => {

  await page.fill('#user-name', USUARIO_VALIDO);
  await page.fill('#password', CONTRASENA_MALA); // ← contraseña equivocada

  await page.click('#login-button');

  // El sitio muestra un mensaje de error — lo buscamos y validamos
  const mensajeError = page.locator('[data-test="error"]');

  // Verificamos que el mensaje de error es visible
  await expect(mensajeError).toBeVisible();

  // Verificamos que el texto del mensaje es el esperado
  await expect(mensajeError).toContainText('Username and password do not match');
});


// ================================================================
// TEST 3: Usuario incorrecto
// ================================================================
test('❌ Error con usuario que no existe', async ({ page }) => {

  await page.fill('#user-name', 'usuario_que_no_existe');
  await page.fill('#password', CONTRASENA_VALIDA);

  await page.click('#login-button');

  const mensajeError = page.locator('[data-test="error"]');

  await expect(mensajeError).toBeVisible();
  await expect(mensajeError).toContainText('Username and password do not match');
});


// ================================================================
// TEST 4: Campos vacíos
// ================================================================
test('❌ Error al enviar formulario vacío', async ({ page }) => {

  // No llenamos ningún campo — hacemos clic directamente
  await page.click('#login-button');

  const mensajeError = page.locator('[data-test="error"]');

  await expect(mensajeError).toBeVisible();

  // Cuando el usuario está vacío, el mensaje dice "Username is required"
  await expect(mensajeError).toContainText('Username is required');
});


// ================================================================
// TEST 5: Solo contraseña vacía
// ================================================================
test('❌ Error cuando falta la contraseña', async ({ page }) => {

  await page.fill('#user-name', USUARIO_VALIDO);
  // No llenamos la contraseña

  await page.click('#login-button');

  const mensajeError = page.locator('[data-test="error"]');

  await expect(mensajeError).toBeVisible();
  await expect(mensajeError).toContainText('Password is required');
});


// ================================================================
// TEST 6: Usuario bloqueado
// ================================================================
test('🔒 Error con usuario bloqueado', async ({ page }) => {

  await page.fill('#user-name', USUARIO_BLOQUEADO); // ← usuario bloqueado
  await page.fill('#password', CONTRASENA_VALIDA);

  await page.click('#login-button');

  const mensajeError = page.locator('[data-test="error"]');

  await expect(mensajeError).toBeVisible();

  // Este usuario tiene un mensaje de error diferente
  await expect(mensajeError).toContainText('Sorry, this user has been locked out');
});


// ================================================================
// TEST 7: Logout (cerrar sesión)
// ================================================================
test('🚪 Logout — cerrar sesión correctamente', async ({ page }) => {

  // PASO 1: Primero hacemos login (necesitamos estar adentro para salir)
  await page.fill('#user-name', USUARIO_VALIDO);
  await page.fill('#password', CONTRASENA_VALIDA);
  await page.click('#login-button');

  // Confirmamos que entramos
  await expect(page).toHaveURL(/inventory/);

  // PASO 2: Abrir el menú hamburguesa (≡) arriba a la izquierda
  await page.click('#react-burger-menu-btn');

  // PASO 3: Esperar que el menú sea visible y hacer clic en Logout
  await page.click('#logout_sidebar_link');

  // PASO 4: Verificar que regresamos a la página de login
  await expect(page).toHaveURL('/');

  // PASO 5: Verificar que el botón de login es visible de nuevo
  await expect(page.locator('#login-button')).toBeVisible();
});