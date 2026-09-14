import { test, expect } from '@src/fixtures/pages.fixture';
import { SEARCH_TERMS } from '@src/data/search-data';

test.describe('Paginação dos resultados de pesquisa', () => {
  test('CT-05 | avançar de página preserva o termo e traz artigos diferentes @regression', async ({
    searchResultsPage,
  }) => {
    const term = SEARCH_TERMS.broad;

    await searchResultsPage.openWithTerm(term);
    await searchResultsPage.assertLoadedFor(term);

    const firstPageTitles = await searchResultsPage.resultTitleTexts();
    expect(firstPageTitles.length).toBeGreaterThan(1);

    await test.step('a paginação é exibida quando há mais de uma página', async () => {
      await expect(searchResultsPage.pagination).toBeVisible();
      await expect(searchResultsPage.nextPageLink).toBeVisible();
    });

    await test.step('ir para a próxima página', async () => {
      await searchResultsPage.nextPageLink.click();
      await searchResultsPage.page.waitForURL(/\/page\/2\//);
    });

    await test.step('o termo pesquisado continua aplicado na página 2', async () => {
      expect(searchResultsPage.searchTermFromUrl()).toBe(term);
      await searchResultsPage.assertLoadedFor(term);
    });

    await test.step('a página 2 traz artigos distintos da página 1', async () => {
      const secondPageTitles = await searchResultsPage.resultTitleTexts();
      expect(secondPageTitles.length).toBeGreaterThan(0);
      expect(secondPageTitles).not.toEqual(firstPageTitles);

      const repeated = secondPageTitles.filter((t) => firstPageTitles.includes(t));
      expect(repeated, `Artigos repetidos entre as páginas: ${repeated.join(', ')}`).toHaveLength(0);
    });
  });
});
