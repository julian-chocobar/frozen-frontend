import { test, expect } from "@playwright/test";

test('Buscar "caja 24" y cambiar estado correctamente', async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/materiales");

  const inputBusqueda = page.getByPlaceholder("Nombre...");
  await expect(inputBusqueda).toBeVisible();

  await inputBusqueda.fill("caja 24");

  await expect(
    page.getByText("Mostrando 1 materiales de 1 totales")
  ).toBeVisible({ timeout: 10000 });

  const filaMaterial = page.locator("tr", { hasText: "caja 24" });

  let estadoSpan = filaMaterial.locator('span:has-text("Activo"), span:has-text("Inactivo")');
  const textoEstado = await estadoSpan.textContent();
  const estaActivo = textoEstado?.trim() === "Activo";
  console.log("Producto activo:", estaActivo);

  const botonCambiar = filaMaterial.getByRole("button", { name: "Cambiar estado" });
  await botonCambiar.click();

  estadoSpan = filaMaterial.locator('span:has-text("Inactivo")');
  await expect(estadoSpan).toBeVisible({ timeout: 5000 });
  console.log("Estado cambiado a Inactivo");
});
