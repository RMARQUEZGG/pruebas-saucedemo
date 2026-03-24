/**
 * ================================================================
 * PAGE OBJECT — LoginPage
 * ================================================================
 *
 * Esta clase representa la página de login de SauceDemo.
 *
 * ¿Qué contiene?
 *   - Los "locators" (selectores) de los elementos de la página
 *   - Los "métodos" (acciones) que se pueden hacer en esa página
 *
 * ¿Por qué es mejor así?
 *   Si el sitio cambia el ID del botón de login, solo lo cambias
 *   aquí — en UN solo lugar — y todas las pruebas se actualizan.
 * ================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {

  // ── Referencia al navegador ──────────────────────────────────
  // "page" es el objeto de Playwright que controla el navegador.
  // Lo recibimos en el constructor y lo guardamos para usarlo.
  readonly page: Page;

  // ── Locators ─────────────────────────────────────────────────
  // Cada propiedad apunta a un elemento de la página.
  // Los definimos aquí arriba para no repetirlos en cada método.
  readonly campoUsuario: Locator;
  readonly campoContrasena: Locator;
  readonly botonLogin: Locator;
  readonly mensajeError: Locator;

  // ── Constructor ───────────────────────────────────────────────
  // Se ejecuta cuando hacemos: new LoginPage(page)
  // Aquí inicializamos todos los locators.
  constructor(page: Page) {
    this.page = page;

    // page.locator(selector) — encuentra un elemento por su selector
    this.campoUsuario   = page.locator('#user-name');
    this.campoContrasena = page.locator('#password');
    this.botonLogin     = page.locator('#login-button');
    this.mensajeError   = page.locator('[data-test="error"]');
  }

  // ── Métodos (acciones) ────────────────────────────────────────

  /**
   * Navega a la página de login.
   * La URL base está en playwright.config.ts, así que '/' es suficiente.
   */
  async abrir() {
    await this.page.goto('/');
  }

  /**
   * Realiza el proceso completo de login.
   * Recibe usuario y contraseña como parámetros para ser flexible.
   */
  async login(usuario: string, contrasena: string) {
    await this.campoUsuario.fill(usuario);
    await this.campoContrasena.fill(contrasena);
    await this.botonLogin.click();
  }

  /**
   * Verifica que el mensaje de error sea visible y contenga el texto esperado.
   * Usamos este método cuando esperamos que el login FALLE.
   */
  async verificarError(textoEsperado: string) {
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toContainText(textoEsperado);
  }

  /**
   * Verifica que el login fue EXITOSO comprobando la URL.
   */
  async verificarLoginExitoso() {
    await expect(this.page).toHaveURL(/inventory/);
  }
  /**
   * Verifica que estamos en la página de login (botón visible).
   */
  async verificarPaginaCargada() {
    await expect(this.page).toHaveURL('/');
    await expect(this.botonLogin).toBeVisible();
  }
}

  