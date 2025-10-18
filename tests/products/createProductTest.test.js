import { test, expect } from "@playwright/test";

test('Creacion y verificacion de producto', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/productos");

  const botonNuevo = page.getByRole('button', { name: 'Nuevo' });
  await expect(botonNuevo).toBeVisible({ timeout: 5000 });
  await botonNuevo.click();

  const inputNombre = page.locator('input[placeholder="Ej: IPA Americana"]');
  const botonCrear = page.getByRole('button', { name: 'Crear' });

  await inputNombre.fill("Rubia Golden");
  await botonCrear.click();

  const filaProducto = page.locator('tr', { hasText: 'Rubia Golden' }).first();
  await expect(filaProducto).toBeVisible({ timeout: 5000 });

  console.log("Producto 'Rubia Golden' creado y verificado en la lista");
});
