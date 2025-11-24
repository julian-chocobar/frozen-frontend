import { test, expect } from '@playwright/test';

test('El botón "Ver todos los materiales" redirige correctamente a /materiales', async ({ page }) => {
  await login(page, 'super');

  const botonInventario = page.getByRole('link', { name: 'Ver todos los materiales →' });
  await expect(botonInventario).toBeVisible();

  await botonInventario.click();

  await page.waitForTimeout(5000);

  await expect(page).toHaveURL('https://frozen-frontend-kappa.vercel.app/materiales');

});
