/**
 * ================================================================
 * SEMANA 2 — Pruebas del Carrito de Compras en SauceDemo
 * ================================================================
 *
 * ¿Qué vamos a probar?
 *   🛒 Agregar un producto al carrito
 *   🛒 Agregar varios productos al carrito
 *   ❌ Eliminar un producto del carrito
 *   🔢 Verificar el contador del carrito (badge)
 *   📋 Verificar que los productos correctos están en el carrito
 *   🧹 Vaciar el carrito completamente
 *
 * ¿Qué aprenderás esta semana?
 *   - Reutilizar pasos comunes con funciones auxiliares
 *   - Navegar entre páginas dentro de las pruebas
 *   - Verificar múltiples elementos a la vez
 *   - Usar locators más avanzados
 * ================================================================
 */

import { test, expect, Page } from '@playwright/test';

// ----------------------------------------------------------------
// 🔧 DATOS DE PRUEBA
// ----------------------------------------------------------------
const USUARIO    = 'standard_user';
const CONTRASENA = 'secret_sauce';

// Nombres de productos tal como aparecen en el sitio
const PRODUCTO_1 = 'Sauce Labs Backpack';
const PRODUCTO_2 = 'Sauce Labs Bike Light';
const PRODUCTO_3 = 'Sauce Labs Bolt T-Shirt';

// ----------------------------------------------------------------
// 🔧 FUNCIÓN AUXILIAR — Login
//
// Como TODAS las pruebas necesitan estar logueados primero,
// creamos una función reutilizable en lugar de repetir el código.
//
// Recibe "page" como parámetro — es el navegador que Playwright controla.
// ----------------------------------------------------------------
async function login(page: Page) {
  await page.goto('/');
  await page.fill('#user-name', USUARIO);
  await page.fill('#password', CONTRASENA);
  await page.click('#login-button');
  // Esperamos que cargue el inventario antes de continuar
  await expect(page).toHaveURL(/inventory/);
}

// ----------------------------------------------------------------
// 🔧 FUNCIÓN AUXILIAR — Agregar producto por nombre
//
// Busca el producto por su nombre y hace clic en su botón
// "Add to cart". Así no dependemos de posiciones fijas.
// ----------------------------------------------------------------
async function agregarAlCarrito(page: Page, nombreProducto: string) {
  // Buscamos el contenedor del producto que tiene ese nombre
  const producto = page.locator('.inventory_item').filter({
    hasText: nombreProducto
  });

  // Dentro de ese contenedor, hacemos clic en el botón Add to cart
  await producto.locator('button').click();
}

// ----------------------------------------------------------------
// 🔧 FUNCIÓN AUXILIAR — Eliminar producto por nombre
//
// Similar a agregarAlCarrito, pero ahora el botón dice "Remove"
// ----------------------------------------------------------------
async function eliminarDelCarrito(page: Page, nombreProducto: string) {
  const producto = page.locator('.inventory_item').filter({
    hasText: nombreProducto
  });
  await producto.locator('button').click();
}

// ================================================================
// 🔄 beforeEach — Login automático antes de cada prueba
// ================================================================
test.beforeEach(async ({ page }) => {
  await login(page);
});


// ================================================================
// TEST 1: Agregar un producto
// ================================================================
test('🛒 Agregar un producto al carrito', async ({ page }) => {

  // PASO 1: Agregar el producto usando nuestra función auxiliar
  await agregarAlCarrito(page, PRODUCTO_1);

  // PASO 2: Verificar que el badge (contador) del carrito muestra "1"
  // El badge es el círculo rojo con número que aparece en el ícono del carrito
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // PASO 3: Verificar que el botón cambió de "Add to cart" a "Remove"
  // Esto confirma que el producto fue agregado correctamente
  const producto = page.locator('.inventory_item').filter({ hasText: PRODUCTO_1 });
  await expect(producto.locator('button')).toHaveText('Remove');
});

// ================================================================
// TEST 2: Agregar varios productos
// ================================================================
test('🛒 Agregar tres productos al carrito', async ({ page }) => {

  // Agregamos los 3 productos uno por uno
  await agregarAlCarrito(page, PRODUCTO_1);
  await agregarAlCarrito(page, PRODUCTO_2);
  await agregarAlCarrito(page, PRODUCTO_3);

  // El badge debe mostrar "3"
  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
});

// ================================================================
// TEST 3: Eliminar un producto
// ================================================================
test('❌ Eliminar un producto del carrito', async ({ page }) => {

  // PASO 1: Primero agregamos el producto
  await agregarAlCarrito(page, PRODUCTO_1);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // PASO 2: Luego lo eliminamos
  await eliminarDelCarrito(page, PRODUCTO_1);

  // PASO 3: El badge debe desaparecer (no existe en el DOM cuando es 0)
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

  // PASO 4: El botón vuelve a decir "Add to cart"
  const producto = page.locator('.inventory_item').filter({ hasText: PRODUCTO_1 });
  await expect(producto.locator('button')).toHaveText('Add to cart');
});

// ================================================================
// TEST 4: Agregar y quitar — el contador se actualiza bien
// ================================================================
test('🔢 El contador del carrito se actualiza correctamente', async ({ page }) => {

  // Agregamos 2 productos → badge debe decir "2"
  await agregarAlCarrito(page, PRODUCTO_1);
  await agregarAlCarrito(page, PRODUCTO_2);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Quitamos 1 → badge debe decir "1"
  await eliminarDelCarrito(page, PRODUCTO_1);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Quitamos el último → badge desaparece
  await eliminarDelCarrito(page, PRODUCTO_2);
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});


// ================================================================
// TEST 5: Verificar productos dentro del carrito
// ================================================================
test('📋 Los productos correctos aparecen dentro del carrito', async ({ page }) => {

  // Agregamos 2 productos
  await agregarAlCarrito(page, PRODUCTO_1);
  await agregarAlCarrito(page, PRODUCTO_2);

  // PASO 2: Navegamos al carrito haciendo clic en el ícono
  await page.click('.shopping_cart_link');

  // Verificamos que estamos en la página del carrito
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('.title')).toHaveText('Your Cart');

  // PASO 3: Verificamos que los 2 productos están en el carrito
  // locator('.cart_item') encuentra TODOS los items del carrito
  const itemsCarrito = page.locator('.cart_item');
  await expect(itemsCarrito).toHaveCount(2);

  // PASO 4: Verificamos que los nombres son correctos
  await expect(page.locator('.inventory_item_name').nth(0)).toHaveText(PRODUCTO_1);
  await expect(page.locator('.inventory_item_name').nth(1)).toHaveText(PRODUCTO_2);
});


// ================================================================
// TEST 6: Eliminar producto desde DENTRO del carrito
// ================================================================
test('❌ Eliminar producto desde la página del carrito', async ({ page }) => {

  // Agregamos 2 productos
  await agregarAlCarrito(page, PRODUCTO_1);
  await agregarAlCarrito(page, PRODUCTO_2);

  // Navegamos al carrito
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);

  // Eliminamos el primer producto desde el carrito
  // Buscamos el item por nombre y hacemos clic en su botón Remove
  const item = page.locator('.cart_item').filter({ hasText: PRODUCTO_1 });
  await item.locator('button').click();

  // Solo debe quedar 1 producto
  await expect(page.locator('.cart_item')).toHaveCount(1);

  // Y ese producto es el PRODUCTO_2
  await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTO_2);
});


// ================================================================
// TEST 7: Vaciar el carrito completamente
// ================================================================
test('🧹 Vaciar el carrito por completo', async ({ page }) => {

  // Agregamos 3 productos
  await agregarAlCarrito(page, PRODUCTO_1);
  await agregarAlCarrito(page, PRODUCTO_2);
  await agregarAlCarrito(page, PRODUCTO_3);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

  // Navegamos al carrito
  await page.click('.shopping_cart_link');

  // Eliminamos todos los productos uno por uno
  // Usamos un loop que mientras haya items, los elimina
  const botonRemove = page.locator('.cart_item button');

  // Mientras existan botones de Remove, hacemos clik en el primero
  while (await botonRemove.count() > 0) {
    await botonRemove.first().click();
  }

  // Verificamos que el carrito está vacío
  await expect(page.locator('.cart_item')).toHaveCount(0);

  // El badge ya no debe existir
  await page.goto('/');
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});


// ================================================================
// TEST 8: Continuar comprando desde el carrito
// ================================================================
test('🔙 Botón "Continue Shopping" regresa al inventario', async ({ page }) => {

  await agregarAlCarrito(page, PRODUCTO_1);

  // Ir al carrito
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);

  // Hacer clic en "Continue Shopping"
  await page.click('[data-test="continue-shopping"]');

  // Debe regresar al inventario
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.title')).toHaveText('Products');
});