import { test, expect } from '@playwright/test';

test('login exitoso en SauceDemo', async ({ page }) => {
  // 1. Abrir el sitio
  await page.goto('https://www.saucedemo.com');

  // 2. Llenar el formulario
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  // 3. Hacer clic en Login
  await page.click('#login-button');

  // 4. Verificar que entramos al inventario
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.title')).toHaveText('Products');
});
test('agregar producto al carrito', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Agregar el primer producto
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verificar badge del carrito = 1
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});