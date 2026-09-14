import { test as base } from '@playwright/test';
import { HomePage } from '@src/pages/HomePage';
import { SearchResultsPage } from '@src/pages/SearchResultsPage';
import { ArticlePage } from '@src/pages/ArticlePage';

type Pages = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  articlePage: ArticlePage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});

export { expect } from '@playwright/test';
