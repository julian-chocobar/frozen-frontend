import { test, expect } from "@playwright/test";

test('Buscar "caja 24" y editar correctamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/materiales");

  const inputBusqueda = page.getByPlaceholder("Nombre...");
  await expect(inputBusqueda).toBeVisible();

  await inputBusqueda.fill("caja 24");

await expect(
    page.getByText('Mostrando 1 materiales de 1 totales')
  ).toBeVisible({ timeout: 10000 });

  const botonDetalle = page.getByRole("button", { name: "Editar" });
  await expect(botonDetalle).toBeVisible();
  await botonDetalle.click();

  await expect(page.locator("h2", { hasText: "Editar Material" })).toBeVisible({
    timeout: 10000,
  });
});
