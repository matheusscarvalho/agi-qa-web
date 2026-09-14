import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.locator('h1.entry-title, h1.elementor-heading-title').first();
  }

  get content(): Locator {
    return this.page.locator('.entry-content, .elementor-widget-theme-post-content').first();
  }
}
