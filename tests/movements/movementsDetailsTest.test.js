import { test, expect } from "@playwright/test";

test('Ver detalle correctamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/movimientos");

  const botonDetail = page.getByRole('button', { name: 'Ver detalles' }).first();
  await expect(botonDetail).toBeVisible({ timeout: 5000 });

  await botonDetail.click();

  await expect(
    page.getByText("Egreso de Stock")
  ).toBeVisible({ timeout: 5000 });
});
