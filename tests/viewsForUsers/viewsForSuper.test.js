import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

test('El usuario "super" puede ver el Total de Lotes en /seguimiento', async ({
  page,
}) => {
  await login(page, "super");

  await page.click('a[aria-label="Seguimiento"]');

  const cardTitulo = page.getByRole("heading", { name: /Total de Lotes/i });
  await expect(cardTitulo).toBeVisible();

  const card = page
    .getByRole("heading", { level: 3, name: /Total de Lotes/i })
    .locator("..")
    .locator("..");
  const numero = card.locator("p.text-3xl.font-bold");
  await expect(numero).toBeVisible();
});
