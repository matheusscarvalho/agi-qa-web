import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Carrega environments/<ENV>.env (ENV padrão: dev) sem dependência externa.
// Variáveis já presentes no shell têm precedência sobre o arquivo.
const ENV = process.env.ENV ?? 'dev';
try {
  const file = readFileSync(resolve(__dirname, 'environments', `${ENV}.env`), 'utf-8');
  for (const line of file.split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // Sem arquivo para o ENV informado: segue com variáveis do shell/padrão.
}

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://blogdoagi.com.br',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
