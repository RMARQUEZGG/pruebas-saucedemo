/**
 * ================================================================
 * PRUEBAS DE LOGIN — con Page Object Model
 * ================================================================
 * Nota cómo este archivo es mucho más limpio ahora:
 *   - No hay selectores (#user-name, #password, etc.)
 *   - No hay lógica de "cómo" hacer las cosas
 *   - Solo describe QUÉ se está probando
 * ================================================================
 */

import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const USUARIO_VALIDO    = 'standard_user';
const USUARIO_BLOQUEADO = 'locked_out_user';
const CONTRASENA_VALIDA = 'secret_sauce';
const CONTRASENA_MALA   = 'contrasena_incorrecta';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.abrir();
});

test('✅ Login exitoso con usuario válido', async ({ page }) => {
  const loginPage     = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.login(USUARIO_VALIDO, CONTRASENA_VALIDA);
  await inventoryPage.verificarPaginaCargada();
});

test('❌ Error con contraseña incorrecta', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(USUARIO_VALIDO, CONTRASENA_MALA);
  await loginPage.verificarError('Username and password do not match');
});

test('❌ Error con usuario que no existe', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login('usuario_inexistente', CONTRASENA_VALIDA);
  await loginPage.verificarError('Username and password do not match');
});

test('❌ Error al enviar formulario vacío', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login('', '');
  await loginPage.verificarError('Username is required');
});

test('❌ Error cuando falta la contraseña', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(USUARIO_VALIDO, '');
  await loginPage.verificarError('Password is required');
});

test('🔒 Error con usuario bloqueado', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login(USUARIO_BLOQUEADO, CONTRASENA_VALIDA);
  await loginPage.verificarError('Sorry, this user has been locked out');
});

test('🚪 Logout — cerrar sesión correctamente', async ({ page }) => {
  const loginPage     = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.login(USUARIO_VALIDO, CONTRASENA_VALIDA);
  await inventoryPage.verificarPaginaCargada();
  await inventoryPage.logout();
  await loginPage.verificarPaginaCargada();
});