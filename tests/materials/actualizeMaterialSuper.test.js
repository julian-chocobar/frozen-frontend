import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

test('El usuario "super" actualiza un material correctamente', async ({
  page,
}) => {
  await login(page, "super");

  const nameMaterial = `Malta Pilsen Slow`;

  await page.click('a[aria-label="Materias"]');

  await page.waitForSelector("table");

  await page.getByLabel("Editar").first().click();

  const inputNombre = page.getByPlaceholder("Ej: Malta Pilsen");
  await inputNombre.fill(nameMaterial);

  await page.getByRole("button", { name: "Actualizar Material" }).click();

  await page.waitForTimeout(2000);

  const mensajeExito = page.locator(
    "div.text-sm.opacity-90.whitespace-pre-line",
    { hasText: "Material actualizado exitosamente" }
  );

  await expect(mensajeExito).toBeVisible();
});
