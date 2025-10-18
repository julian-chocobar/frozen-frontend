import { test, expect } from "@playwright/test";

test('Edicion de producto realizada exitosamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/productos");

  const filaProducto = page.locator('tr', { hasText: 'Lager NA' }).first();

  const botonEditar = filaProducto.getByRole('button', { name: 'Editar' });
  await expect(botonEditar).toBeVisible({ timeout: 5000 });
  await botonEditar.click();

  const inputNombre = page.locator('input[placeholder="Ej: IPA Americana"]');
  await inputNombre.fill("Lager Special");

  const botonCrear = page.getByRole('button', { name: 'Crear' });
  await botonCrear.click();

  const filaActualizada = page.locator('tr', { hasText: 'Lager Special' }).first();
  await expect(filaActualizada).toBeVisible({ timeout: 5000 });

  console.log("Producto editado exitosamente a 'Lager Special'");
});
