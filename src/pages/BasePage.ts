import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected constructor(readonly page: Page) {}

  get searchIcon(): Locator {
    return this.page.locator('.astra-search-icon:visible').first();
  }

  get searchOverlay(): Locator {
    return this.page.locator('#ast-seach-full-screen-form');
  }

  get searchField(): Locator {
    return this.searchOverlay.locator('input.search-field');
  }

  private get cookieBanner(): Locator {
    return this.page.getByRole('button', { name: /aceitar|concordo|entendi|ok/i }).first();
  }

  async dismissCookieBannerIfPresent(): Promise<void> {
    try {
      await this.cookieBanner.waitFor({ state: 'visible', timeout: 3_000 });
      await this.cookieBanner.click();
    } catch {
      // banner ausente nesta execução
    }
  }

  async openSearchOverlay(): Promise<void> {
    await this.searchIcon.click();

    // LiteSpeed adia o frontend.js do Astra (anima a lupa); se o overlay não
    // abrir, replicamos a transição do tema e seguimos no form/submit reais.
    const openedByTheme = await this.searchField
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);

    if (!openedByTheme) {
      await this.searchOverlay.evaluate((box) => {
        const el = box as HTMLElement;
        el.style.display = 'block';
        el.style.opacity = '1';
      });
    }

    await expect(this.searchField).toBeVisible();
  }

  async searchFor(term: string): Promise<void> {
    await this.openSearchOverlay();
    await this.searchField.fill(term);
    await this.searchField.press('Enter');
    await this.page.waitForURL(/[?&]s=/, { timeout: 45_000 });
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  get currentUrl(): string {
    return this.page.url();
  }
}
