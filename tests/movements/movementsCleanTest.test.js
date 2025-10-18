import { test, expect } from "@playwright/test";

test('Buscar "Nalta Pilsen" y limpiar búsqueda correctamente', async ({
  page,
}) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/movimientos");

  const inputBusqueda = page.getByPlaceholder("Buscar material...");
  await expect(inputBusqueda).toBeVisible();
  await inputBusqueda.fill("Malta Pilsen");
  await page.waitForTimeout(2000);
  const botonMaterial = page
    .locator("button")
    .locator("div", { hasText: "Malta Pilsen" })
    .first();
  await expect(botonMaterial).toBeVisible({ timeout: 5000 });
  await botonMaterial.click();

  const botonLimpiar = page.getByRole("button", { name: "Limpiar" });
  await expect(botonLimpiar).toBeVisible({ timeout: 5000 });

  await botonLimpiar.click();

  await expect(
    page.getByText("Mostrando 7 movimientos de 7 totales")
  ).toBeVisible({ timeout: 10000 });
});
