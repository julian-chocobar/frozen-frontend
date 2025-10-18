import { test, expect } from "@playwright/test";

test("El usuario puede entrar a la app correctamente", async ({ page }) => {
  await page.goto("https://frozen-frontend-kappa.vercel.app/");

  await page.waitForTimeout(3000);

  await expect(page.getByText("Monitorea tu producción en tiempo real")).toBeVisible();
});
