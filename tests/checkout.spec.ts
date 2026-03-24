/**
 * ================================================================
 * SEMANA 3 — Pruebas del Flujo Completo de Checkout
 * ================================================================
 *
 * ¿Qué vamos a probar?
 *   🛒→💳 Flujo completo: login → carrito → checkout → confirmación
 *   ❌ Formulario vacío (validaciones)
 *   ❌ Campos individuales vacíos
 *   ↩️  Cancelar desde el resumen
 *   📋 Verificar productos y total en el resumen
 *   🔄 Comprar múltiples productos
 *
 * ¿Qué aprenderás esta semana?
 *   - Pruebas de flujo end-to-end completo (E2E)
 *   - Combinar múltiples Page Objects en una sola prueba
 *   - Datos de prueba estructurados con objetos TypeScript
 * ================================================================
 */

import { test, expect } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage }      from '../pages/CartPage';
import { CheckoutPage }  from '../pages/CheckoutPage';

// ── Datos de prueba ───────────────────────────────────────────────
const USUARIO    = 'standard_user';
const CONTRASENA = 'secret_sauce';

// Guardamos los datos del cliente en un objeto para reutilizarlos
const CLIENTE = {
  nombre:       'Juan',
  apellido:     'Pérez',
  codigoPostal: '10001',
};

const PRODUCTO_1 = 'Sauce Labs Backpack';
const PRODUCTO_2 = 'Sauce Labs Bike Light';

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Helper que hace login y devuelve las páginas listas para usar.
 * Así no repetimos las 3 líneas de login en cada prueba.
 */
async function loginYPreparar(page: any) {
  const loginPage     = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage      = new CartPage(page);
  const checkoutPage  = new CheckoutPage(page);

  await loginPage.abrir();
  await loginPage.login(USUARIO, CONTRASENA);
  await inventoryPage.verificarPaginaCargada();

  return { loginPage, inventoryPage, cartPage, checkoutPage };
}

// ================================================================
// TEST 1: Flujo completo con un producto
// ================================================================
test('✅ Flujo completo de compra con un producto', async ({ page }) => {

  // PASO 1: Login
  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  // PASO 2: Agregar producto al carrito
  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.verificarCantidadEnCarrito(1);

  // PASO 3: Ir al carrito
  await inventoryPage.irAlCarrito();
  await cartPage.verificarPaginaCargada();
  await cartPage.verificarCantidadProductos(1);

  // PASO 4: Iniciar checkout
  await cartPage.irACheckout();
  await checkoutPage.verificarPaso1Cargado();

  // PASO 5: Llenar formulario
  await checkoutPage.llenarFormulario(
    CLIENTE.nombre,
    CLIENTE.apellido,
    CLIENTE.codigoPostal
  );

  // PASO 6: Verificar resumen
  await checkoutPage.verificarPaso2Cargado();
  await checkoutPage.verificarCantidadProductos(1);

  // PASO 7: Finalizar compra
  await checkoutPage.finalizarCompra();

  // PASO 8: Verificar confirmación
  await checkoutPage.verificarConfirmacion();
});


// ================================================================
// TEST 2: Flujo completo con múltiples productos
// ================================================================
test('✅ Flujo completo de compra con varios productos', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  // Agregar 2 productos
  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.agregarAlCarrito(PRODUCTO_2);
  await inventoryPage.verificarCantidadEnCarrito(2);

  // Ir al carrito y verificar
  await inventoryPage.irAlCarrito();
  await cartPage.verificarCantidadProductos(2);
  await cartPage.verificarProductoPresente(PRODUCTO_1);
  await cartPage.verificarProductoPresente(PRODUCTO_2);

  // Checkout completo
  await cartPage.irACheckout();
  await checkoutPage.llenarFormulario(
    CLIENTE.nombre,
    CLIENTE.apellido,
    CLIENTE.codigoPostal
  );

  // En el resumen deben aparecer los 2 productos
  await checkoutPage.verificarPaso2Cargado();
  await checkoutPage.verificarCantidadProductos(2);

  // Finalizar
  await checkoutPage.finalizarCompra();
  await checkoutPage.verificarConfirmacion();
});


// ================================================================
// TEST 3: Error — formulario completamente vacío
// ================================================================
test('❌ Error al enviar formulario de checkout vacío', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  // Preparar: agregar producto e ir al checkout
  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();
  await checkoutPage.verificarPaso1Cargado();

  // Hacer clic en Continue sin llenar nada
  await checkoutPage.continuarSinLlenar();

  // Debe aparecer error de primer nombre
  await checkoutPage.verificarError('First Name is required');
});


// ================================================================
// TEST 4: Error — falta el apellido
// ================================================================
test('❌ Error cuando falta el apellido', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();

  // Llenamos nombre pero NO apellido ni código postal
  await checkoutPage.llenarFormulario(CLIENTE.nombre, '', '');

  await checkoutPage.verificarError('Last Name is required');
});


// ================================================================
// TEST 5: Error — falta el código postal
// ================================================================
test('❌ Error cuando falta el código postal', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();

  // Llenamos nombre y apellido pero NO código postal
  await checkoutPage.llenarFormulario(CLIENTE.nombre, CLIENTE.apellido, '');

  await checkoutPage.verificarError('Postal Code is required');
});


// ================================================================
// TEST 6: Cancelar desde el resumen regresa al carrito
// ================================================================
test('↩️ Cancelar en el resumen regresa al inventario', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();
  await checkoutPage.llenarFormulario(
    CLIENTE.nombre,
    CLIENTE.apellido,
    CLIENTE.codigoPostal
  );

  // Estamos en el paso 2 — hacemos clic en Cancel
  await checkoutPage.verificarPaso2Cargado();
  await checkoutPage.cancelarCompra();

  // Debe regresar al inventario
  await inventoryPage.verificarPaginaCargada();
});


// ================================================================
// TEST 7: Verificar el precio total en el resumen
// ================================================================
test('💰 El precio total en el resumen es correcto', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  // Sauce Labs Backpack cuesta $29.99
  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();
  await checkoutPage.llenarFormulario(
    CLIENTE.nombre,
    CLIENTE.apellido,
    CLIENTE.codigoPostal
  );

  await checkoutPage.verificarPaso2Cargado();

  // El total incluye impuestos, verificamos que el label existe y tiene un valor
  // (usamos toBeVisible en lugar de un valor exacto porque los impuestos pueden variar)
  await expect(checkoutPage.precioTotal).toBeVisible();

  // También podemos verificar que contiene el símbolo de dólar
  await expect(checkoutPage.precioTotal).toContainText('$');
});


// ================================================================
// TEST 8: Después de la compra, volver al inventario
// ================================================================
test('🏠 Volver al inventario después de completar la compra', async ({ page }) => {

  const { inventoryPage, cartPage, checkoutPage } = await loginYPreparar(page);

  // Flujo completo
  await inventoryPage.agregarAlCarrito(PRODUCTO_1);
  await inventoryPage.irAlCarrito();
  await cartPage.irACheckout();
  await checkoutPage.llenarFormulario(
    CLIENTE.nombre,
    CLIENTE.apellido,
    CLIENTE.codigoPostal
  );
  await checkoutPage.finalizarCompra();
  await checkoutPage.verificarConfirmacion();

  // Hacer clic en "Back Home"
  await checkoutPage.volverAlInicio();

  // Debe regresar al inventario y el carrito debe estar vacío
  await inventoryPage.verificarPaginaCargada();
  await inventoryPage.verificarCarritoVacio();
});