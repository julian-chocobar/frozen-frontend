import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

test('El usuario "operarioalmacen" NO puede ver lotes y recibe "Acceso denegado"', async ({ page }) => {
  await login(page, "operarioalmacen");

  await page.click('a[aria-label="Seguimiento"]');

  await page.waitForTimeout(5000);

  const mensajeError = page.getByText("Acceso denegado", { exact: false });

  await expect(mensajeError).toBeVisible();
})