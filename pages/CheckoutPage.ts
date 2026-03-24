/**
 * ================================================================
 * PAGE OBJECT — CheckoutPage
 * ================================================================
 *
 * El checkout en SauceDemo tiene 3 pasos:
 *
 *   Paso 1 — Formulario de datos personales
 *            (nombre, apellido, código postal)
 *
 *   Paso 2 — Resumen del pedido
 *            (ver productos, precios, total)
 *
 *   Paso 3 — Confirmación
 *            (pantalla de "Thank you for your order!")
 *
 * Esta clase maneja los 3 pasos.
 * ================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {

  readonly page: Page;

  // ── Paso 1: Formulario ────────────────────────────────────────
  readonly campoPrimerNombre: Locator;
  readonly campoApellido: Locator;
  readonly campoCodigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly mensajeError: Locator;

  // ── Paso 2: Resumen ───────────────────────────────────────────
  readonly botonFinalizar: Locator;
  readonly botonCancelar: Locator;
  readonly itemsResumen: Locator;
  readonly precioTotal: Locator;

  // ── Paso 3: Confirmación ──────────────────────────────────────
  readonly mensajeConfirmacion: Locator;
  readonly botonVolver: Locator;

  constructor(page: Page) {
    this.page = page;

    // Paso 1
    this.campoPrimerNombre = page.locator('[data-test="firstName"]');
    this.campoApellido     = page.locator('[data-test="lastName"]');
    this.campoCodigoPostal = page.locator('[data-test="postalCode"]');
    this.botonContinuar    = page.locator('[data-test="continue"]');
    this.mensajeError      = page.locator('[data-test="error"]');

    // Paso 2
    this.botonFinalizar = page.locator('[data-test="finish"]');
    this.botonCancelar  = page.locator('[data-test="cancel"]');
    this.itemsResumen   = page.locator('.cart_item');
    this.precioTotal    = page.locator('.summary_total_label');

    // Paso 3
    this.mensajeConfirmacion = page.locator('.complete-header');
    this.botonVolver         = page.locator('[data-test="back-to-products"]');
  }

  // ── Métodos: Paso 1 ───────────────────────────────────────────

  /**
   * Llena el formulario de datos personales y hace clic en Continue.
   */
  async llenarFormulario(nombre: string, apellido: string, codigoPostal: string) {
    await this.campoPrimerNombre.fill(nombre);
    await this.campoApellido.fill(apellido);
    await this.campoCodigoPostal.fill(codigoPostal);
    await this.botonContinuar.click();
  }

  /**
   * Hace clic en Continue sin llenar ningún campo.
   * Útil para probar validaciones del formulario.
   */
  async continuarSinLlenar() {
    await this.botonContinuar.click();
  }

  // ── Métodos: Paso 2 ───────────────────────────────────────────

  /**
   * Confirma el pedido haciendo clic en Finish.
   */
  async finalizarCompra() {
    await this.botonFinalizar.click();
  }

  /**
   * Cancela el pedido desde el resumen.
   */
  async cancelarCompra() {
    await this.botonCancelar.click();
  }

  // ── Métodos: Paso 3 ───────────────────────────────────────────

  /**
   * Vuelve al inventario desde la pantalla de confirmación.
   */
  async volverAlInicio() {
    await this.botonVolver.click();
  }

  // ── Verificaciones ────────────────────────────────────────────

  async verificarPaso1Cargado() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Your Information');
  }

  async verificarPaso2Cargado() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Overview');
  }

  async verificarConfirmacion() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.mensajeConfirmacion).toHaveText('Thank you for your order!');
  }

  async verificarError(textoEsperado: string) {
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toContainText(textoEsperado);
  }

  async verificarCantidadProductos(cantidad: number) {
    await expect(this.itemsResumen).toHaveCount(cantidad);
  }

  /**
   * Verifica que el total mostrado en pantalla contiene un texto esperado.
   * Ejemplo: verificarTotal('Total: $32.39')
   */
  async verificarTotal(textoEsperado: string) {
    await expect(this.precioTotal).toContainText(textoEsperado);
  }
}