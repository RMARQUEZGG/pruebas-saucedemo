/**
 * ================================================================
 * PAGE OBJECT — CartPage
 * ================================================================
 *
 * Esta clase representa la página del carrito de compras.
 * ================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class CartPage {

  readonly page: Page;

  readonly tituloPagina: Locator;
  readonly itemsCarrito: Locator;
  readonly botonContinuar: Locator;
  readonly botonCheckout: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tituloPagina   = page.locator('.title');
    this.itemsCarrito   = page.locator('.cart_item');
    this.botonContinuar = page.locator('[data-test="continue-shopping"]');
    this.botonCheckout  = page.locator('[data-test="checkout"]');
  }

  // ── Métodos ───────────────────────────────────────────────────

  /**
   * Elimina un producto del carrito buscándolo por su nombre.
   */
  async eliminarProducto(nombreProducto: string) {
    await this.page
      .locator('.cart_item')
      .filter({ hasText: nombreProducto })
      .locator('button')
      .click();
  }

  /**
   * Vuelve a la página de inventario.
   */
  async continuarComprando() {
    await this.botonContinuar.click();
  }

  /**
   * Procede al checkout.
   */
  async irACheckout() {
    await this.botonCheckout.click();
  }

  // ── Verificaciones ────────────────────────────────────────────

  /**
   * Verifica que estamos en la página del carrito.
   */
  async verificarPaginaCargada() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.tituloPagina).toHaveText('Your Cart');
  }

  /**
   * Verifica cuántos productos hay en el carrito.
   */
  async verificarCantidadProductos(cantidad: number) {
    await expect(this.itemsCarrito).toHaveCount(cantidad);
  }

  /**
   * Verifica que un producto específico está en el carrito.
   */
  async verificarProductoPresente(nombreProducto: string) {
    const item = this.page
      .locator('.cart_item')
      .filter({ hasText: nombreProducto });
    await expect(item).toBeVisible();
  }

  /**
   * Verifica que el carrito está vacío.
   */
  async verificarCarritoVacio() {
    await expect(this.itemsCarrito).toHaveCount(0);
  }
}