import { test, expect } from "@playwright/test";

test('Buscar "Malta Pilsen", ver busqueda y URL formada correctamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/movimientos");

  const inputBusqueda = page.getByPlaceholder("Buscar material...");
  await expect(inputBusqueda).toBeVisible();
  await inputBusqueda.fill("Malta Pilsen");
  await page.waitForTimeout(2000);
  const botonMaterial = page.locator('button').locator('div', { hasText: 'Malta Pilsen' }).first();
  await expect(botonMaterial).toBeVisible({ timeout: 5000 });
  await botonMaterial.click();

  await expect(
    page.getByText("Mostrando 4 movimientos de 4 totales")
  ).toBeVisible({ timeout: 10000 });

  await expect(page).toHaveURL("https://frozen-frontend-kappa.vercel.app/movimientos?materialId=1", { timeout: 5000 });
});
