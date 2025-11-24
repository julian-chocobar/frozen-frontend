import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

test('El usuario "operario" no debe poder crear un material', async ({
  page,
}) => {
  await login(page, "operarioalmacen");

  const nameMaterial = `Malta Pilsen Hormiga Negra`;
  const nameProveedor = `Proveedor Prueba Operario`;
  const valueOperario = `1500`;
  const valueUmbral = `20`;

  await page.click('a[aria-label="Materias"]');

  await page.waitForSelector("table");

  await page.getByLabel("Nuevo").first().click();

  const inputNombre = page.getByPlaceholder("Ej: Malta Pilsen");
  await inputNombre.fill(nameMaterial);

  const inputProveedor = page.getByPlaceholder("Ej: Maltería Santa Fe");
  await inputProveedor.fill(nameProveedor);
  
  const inputValue = page.getByPlaceholder("0.00");
  await inputValue.fill(valueOperario);

  const inputUmbral = page.getByPlaceholder("100");
  await inputUmbral.fill(valueUmbral);

  await page.getByRole("button", { name: "Crear Material" }).click();

  await page.waitForTimeout(2000);

  const mensajeDenegado = page.locator(
    "div.text-sm.opacity-90.whitespace-pre-line",
    { hasText: "Acceso denegado" }
  );

  await expect(mensajeDenegado).toBeVisible();
});
