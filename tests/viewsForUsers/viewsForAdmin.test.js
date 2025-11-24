import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

test('El usuario "admin" no puede ver movimientos de stock', async ({
  page,
}) => {
  await login(page, "admin");

  await page.click('a[aria-label="Movimientos"]');

  await page.waitForTimeout(5000);

  const mensajeError = page.getByText("Acceso denegado", { exact: false });

  await expect(mensajeError).toBeVisible();
});
