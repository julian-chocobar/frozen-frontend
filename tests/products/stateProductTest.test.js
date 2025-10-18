import { test, expect } from "@playwright/test";

test('Creacion de producto realizada exitosamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/productos");

  const filaPackaging = page.locator('tr', { hasText: 'Lager NA' });

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
