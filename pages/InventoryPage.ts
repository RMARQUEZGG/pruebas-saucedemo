/**
 * ================================================================
 * PAGE OBJECT — InventoryPage
 * ================================================================
 *
 * Esta clase representa la página de inventario (lista de productos).
 * Es la página que aparece después de hacer login correctamente.
 * ================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {

  readonly page: Page;

  // Locators generales de la página
  readonly tituloPagina: Locator;
  readonly badgeCarrito: Locator;
  readonly iconoCarrito: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tituloPagina = page.locator('.title');
    this.badgeCarrito = page.locator('.shopping_cart_badge');
    this.iconoCarrito = page.locator('.shopping_cart_link');
  }

  // ── Métodos ───────────────────────────────────────────────────

  /**
   * Agrega un producto al carrito buscándolo por su nombre.
   *
   * Usamos .filter({ hasText }) para encontrar el contenedor del producto
   * que tenga ese texto, y dentro de él hacemos clic en el botón.
   */
  async agregarAlCarrito(nombreProducto: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: nombreProducto })
      .locator('button')
      .click();
  }

  /**
   * Elimina un producto del inventario (el botón cambia a "Remove"
   * después de agregar al carrito).
   */
  async eliminarDelCarrito(nombreProducto: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: nombreProducto })
      .locator('button')
      .click();
  }

  /**
   * Navega al carrito haciendo clic en el ícono.
   */
  async irAlCarrito() {
    await this.iconoCarrito.click();
  }

  /**
   * Abre el menú lateral (hamburguesa ≡).
   */
  async abrirMenu() {
    await this.page.click('#react-burger-menu-btn');
  }

  /**
   * Cierra sesión: abre el menú y hace clic en Logout.
   */
  async logout() {
    await this.abrirMenu();
    await this.page.click('#logout_sidebar_link');
  }

  // ── Verificaciones ────────────────────────────────────────────

  /**
   * Verifica que estamos en la página de inventario.
   */
  async verificarPaginaCargada() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.tituloPagina).toHaveText('Products');
  }

  /**
   * Verifica que el badge del carrito muestra el número correcto.
   */
  async verificarCantidadEnCarrito(cantidad: number) {
    await expect(this.badgeCarrito).toHaveText(String(cantidad));
  }

  /**
   * Verifica que el badge del carrito NO es visible (carrito vacío).
   */
  async verificarCarritoVacio() {
    await expect(this.badgeCarrito).not.toBeVisible();
  }

  /**
   * Verifica que el botón de un producto dice "Remove" (fue agregado).
   */
  async verificarProductoAgregado(nombreProducto: string) {
    const boton = this.page
      .locator('.inventory_item')
      .filter({ hasText: nombreProducto })
      .locator('button');
    await expect(boton).toHaveText('Remove');
  }

  /**
   * Verifica que el botón de un producto dice "Add to cart" (no está en carrito).
   */
  async verificarProductoNoAgregado(nombreProducto: string) {
    const boton = this.page
      .locator('.inventory_item')
      .filter({ hasText: nombreProducto })
      .locator('button');
    await expect(boton).toHaveText('Add to cart');
  }
}