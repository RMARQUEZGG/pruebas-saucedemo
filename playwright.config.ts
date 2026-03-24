import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Carpeta donde están las pruebas
  testDir: './tests',

  // Tiempo máximo que puede durar una prueba antes de fallar
  timeout: 30000,

  // Si una prueba falla, NO la reintenta automáticamente (útil para aprender)
  retries: 0,

  // Cuántas pruebas correr al mismo tiempo (1 = una por una, más fácil de seguir)
  workers: 1,

  // Formato del reporte de resultados
  reporter: [
    ['list'],       // muestra resultados en la terminal
    ['html'],       // genera reporte visual en HTML
  ],

  use: {
    //URL base del sitio — así no la repites en cada prueba
    baseURL: 'https://www.saucedemo.com',

    // Toma captura de pantalla solo cuando una prueba falla
    screenshot: 'only-on-failure',

    // Graba video solo cuando una prueba falla
    video: 'retain-on-failure',

    // Tiempo máximo para que una acción se complete
    actionTimeout: 10000,
  },

  // En qué navegadores correr las pruebas
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomenta cuando quieras probar en más navegadores:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
});