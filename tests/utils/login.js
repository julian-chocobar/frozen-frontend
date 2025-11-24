import { expect } from "@playwright/test";

export async function login(page, user) {
  await page.goto("https://frozen-frontend-kappa.vercel.app/");

  await page.fill("#username", user);

  await page.fill("#password", "EnigCode123");

  await page.click('button:has-text("Iniciar sesión")');

  await page.waitForTimeout(5000);

  const ahoraNoBtn = page.getByRole("button", { name: "Ahora no" });

  if (await ahoraNoBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await ahoraNoBtn.click();
  }

  const dashboardTitle = page.getByRole("heading", { name: "Dashboard" });
  await expect(dashboardTitle).toBeVisible({ timeout: 8000 });
}
