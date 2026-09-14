import { test, expect } from '@src/fixtures/pages.fixture';
import { SEARCH_TERMS, NO_RESULTS_MESSAGE } from '@src/data/search-data';

test.describe('Fluxos alternativos e casos de exceção da pesquisa', () => {
  test('CT-06 | busca com acentos e espaços retorna resultados @regression @altflow', async ({ searchResultsPage }) => {
    await searchResultsPage.openWithTerm(SEARCH_TERMS.withSpecialChars);

    await searchResultsPage.assertLoadedFor(SEARCH_TERMS.withSpecialChars);
    expect(await searchResultsPage.resultCount()).toBeGreaterThan(0);
  });

  test('CT-07 | termo com HTML/script é escapado e não é executado @regression @security', async ({
    page,
    searchResultsPage,
  }) => {
    let dialogOpened = false;
    page.on('dialog', async (dialog) => {
      dialogOpened = true;
      await dialog.dismiss();
    });

    await searchResultsPage.openWithTerm(SEARCH_TERMS.xssPayload);

    expect(dialogOpened, 'o payload não deve executar nenhum alert').toBe(false);
    expect(await searchResultsPage.highlightedTermText()).toBe(SEARCH_TERMS.xssPayload);

    const injected = await page.locator('h1.page-title script').count();
    expect(injected, 'não deve existir <script> injetado no título').toBe(0);
  });

  test('CT-08 | busca vazia pela lupa não quebra a aplicação @regression @exception @lupa', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.open();
    await homePage.searchFor('');

    expect(searchResultsPage.searchTermFromUrl()).toBe('');
    expect(await searchResultsPage.title()).not.toMatch(/404|erro|error/i);
    await expect(searchResultsPage.pageTitle).toBeVisible();
  });

  test('CT-09 | nova busca a partir da página "nenhum resultado" @regression @altflow', async ({ searchResultsPage }) => {
    await searchResultsPage.openWithTerm(SEARCH_TERMS.withoutResults);
    await expect(searchResultsPage.noResultsSection).toContainText(NO_RESULTS_MESSAGE);

    await searchResultsPage.searchAgainFromNoResults(SEARCH_TERMS.valid);

    await searchResultsPage.assertLoadedFor(SEARCH_TERMS.valid);
    expect(await searchResultsPage.resultCount()).toBeGreaterThan(0);
    await expect(searchResultsPage.noResultsSection).toHaveCount(0);
  });

  test('CT-11 | espaços ao redor do termo não impedem os resultados @regression @altflow', async ({
    searchResultsPage,
  }) => {
    await searchResultsPage.openWithTerm(SEARCH_TERMS.withSurroundingSpaces);
    expect(await searchResultsPage.resultCount()).toBeGreaterThan(0);
  });

  test('CT-10 | página além da última não retorna erro de servidor @regression @exception', async ({
    searchResultsPage,
  }) => {
    const response = await searchResultsPage.page.goto('/page/9999/?s=a', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status(), 'não deve haver erro 5xx').toBeLessThan(500);
    expect(await searchResultsPage.resultCount()).toBe(0);
  });
});
