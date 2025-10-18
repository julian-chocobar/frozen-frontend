import { test, expect } from '@playwright/test';

test('Buscar "caja 24" y limpiar búsqueda correctamente', async ({ page }) => {
  await page.goto('https://frozen-frontend-kappa.vercel.app/materiales');

  const inputBusqueda = page.getByPlaceholder('Nombre...');
  await expect(inputBusqueda).toBeVisible();

  await inputBusqueda.fill('caja 24');

  await expect(
    page.getByText('Mostrando 1 materiales de 1 totales')
  ).toBeVisible({ timeout: 10000 });

  const botonLimpiar = page.getByRole('button', { name: 'Limpiar' });
  await expect(botonLimpiar).toBeVisible({ timeout: 5000 });

  await botonLimpiar.click();

  await expect(
    page.getByText('Mostrando 10 materiales de 19 totales')
  ).toBeVisible({ timeout: 10000 });
});
