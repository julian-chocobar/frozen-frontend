// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://frozen-frontend-kappa.vercel.app/',
    headless: true,
  },
});
