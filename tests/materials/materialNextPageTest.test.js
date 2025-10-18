import { test, expect } from '@playwright/test';

test('Verificar paginado en materiales', async ({ page }) => {
  await page.goto('https://frozen-frontend-kappa.vercel.app/materiales');

  const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
  await expect(botonSiguiente).toBeVisible({ timeout: 5000 });

  await botonSiguiente.click();

  await expect(page).toHaveURL('https://frozen-frontend-kappa.vercel.app/materiales?page=1', { timeout: 5000 });
});
