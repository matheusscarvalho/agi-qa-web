import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageTitle(): Locator {
    return this.page.locator('h1.page-title');
  }

  get highlightedTerm(): Locator {
    return this.pageTitle.locator('span');
  }

  get resultCards(): Locator {
    return this.page.locator('main article');
  }

  get resultTitles(): Locator {
    return this.resultCards.locator('.entry-title a');
  }

  get noResultsSection(): Locator {
    return this.page.locator('section.no-results');
  }

  get noResultsSearchField(): Locator {
    return this.noResultsSection.locator('input.search-field');
  }

  get pagination(): Locator {
    return this.page.locator('.ast-pagination .nav-links');
  }

  get nextPageLink(): Locator {
    return this.pagination.locator('a.next.page-numbers');
  }

  async openPage(term: string, pageNumber: number): Promise<void> {
    await this.page.goto(`/page/${pageNumber}/?s=${encodeURIComponent(term)}`, {
      waitUntil: 'domcontentloaded',
    });
    await this.dismissCookieBannerIfPresent();
  }

  async searchAgainFromNoResults(term: string): Promise<void> {
    await this.noResultsSearchField.fill(term);
    await this.noResultsSearchField.press('Enter');
    await this.page.waitForURL(/[?&]s=/, { timeout: 45_000 });
  }

  async highlightedTermText(): Promise<string> {
    return (await this.highlightedTerm.innerText()).trim();
  }

  async openWithTerm(term: string): Promise<void> {
    await this.page.goto(`/?s=${encodeURIComponent(term)}`, { waitUntil: 'domcontentloaded' });
    await this.dismissCookieBannerIfPresent();
  }

  async resultCount(): Promise<number> {
    return this.resultCards.count();
  }

  async resultTitleTexts(): Promise<string[]> {
    const titles = await this.resultTitles.allInnerTexts();
    return titles.map((t) => t.trim()).filter(Boolean);
  }

  async openResult(index: number): Promise<string> {
    const link = this.resultTitles.nth(index);
    const titleInCard = (await link.innerText()).trim();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
    return titleInCard;
  }

  searchTermFromUrl(): string | null {
    return new URL(this.page.url()).searchParams.get('s');
  }

  async assertLoadedFor(term: string): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.highlightedTerm).toHaveText(term);
  }
}
