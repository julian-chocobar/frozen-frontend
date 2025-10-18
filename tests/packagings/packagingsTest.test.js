import { test, expect } from "@playwright/test";

test('Creacion, edicion y estado correctamente de packaging', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/packagings");

  const botonNew = page.getByRole('button', { name: 'Nuevo' });
  await expect(botonNew).toBeVisible({ timeout: 5000 });
  await botonNew.click();

  const inputNombre = page.locator('input[placeholder="Ej: Botella de 330ml"]');
  const selectUnidad = page.locator('select');
  const inputCantidad = page.locator('input[type="number"]');
  const botonCrear = page.getByRole('button', { name: 'Crear' });
  const botonCancelar = page.getByRole('button', { name: 'Cancelar' });

  await inputNombre.fill("Botella de 330ml");
  await selectUnidad.selectOption("LT");
  await inputCantidad.fill("10");

  await botonCrear.click();

  await expect(botonCrear).toBeHidden({ timeout: 5000 });

  if (await botonCancelar.isVisible()) {
    await botonCancelar.click();
  }

  const filaPackaging = page.locator('tr', { hasText: 'Botella' }).first();

  let estadoSpan = filaPackaging.locator('span:has-text("Activo"), span:has-text("Inactivo")');
  const textoEstado = await estadoSpan.textContent();
  const estaActivo = textoEstado?.trim() === "Activo";
  console.log("Packaging activo:", estaActivo);

  const botonCambiar = filaPackaging.getByRole("button", { name: "Cambiar estado" });
  await botonCambiar.click();

  estadoSpan = filaPackaging.locator('span:has-text("Inactivo")');
  await expect(estadoSpan).toBeVisible({ timeout: 5000 });
  console.log("Estado cambiado a Inactivo");
});
