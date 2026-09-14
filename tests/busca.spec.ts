import { test, expect } from '@src/fixtures/pages.fixture';
import { SEARCH_TERMS, NO_RESULTS_MESSAGE } from '@src/data/search-data';

test.describe('Pesquisa de artigos do Blog do Agi', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('CT-01 | busca por termo válido a partir da lupa retorna artigos relacionados @smoke @regression @lupa', async ({
    homePage,
    searchResultsPage,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-chrome',
      'No mobile a lupa fica dentro do menu hambúrguer (fluxo de UI distinto); a jornada pela lupa é validada no desktop.',
    );
    const term = SEARCH_TERMS.valid;

    await test.step('pesquisar o termo pela lupa do cabeçalho', async () => {
      await homePage.searchFor(term);
    });

    await test.step('o termo pesquisado é preservado na URL e no título da página', async () => {
      expect(searchResultsPage.searchTermFromUrl()).toBe(term);
      await searchResultsPage.assertLoadedFor(term);
    });

    await test.step('a listagem retorna ao menos um artigo', async () => {
      await expect(searchResultsPage.resultCards.first()).toBeVisible();
      expect(await searchResultsPage.resultCount()).toBeGreaterThan(0);
    });

    await test.step('o bloco de "nenhum resultado" não é exibido', async () => {
      await expect(searchResultsPage.noResultsSection).toHaveCount(0);
    });

    await test.step('todo resultado tem título não vazio e link navegável', async () => {
      const titles = await searchResultsPage.resultTitleTexts();
      expect(titles.length).toBe(await searchResultsPage.resultCount());

      for (const href of await searchResultsPage.resultTitles.evaluateAll((links) =>
        links.map((l) => (l as HTMLAnchorElement).href),
      )) {
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  });

  test('CT-02 | busca sem resultados exibe mensagem amigável e oferece nova pesquisa @regression @lupa', async ({
    homePage,
    searchResultsPage,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-chrome',
      'No mobile a lupa fica dentro do menu hambúrguer (fluxo de UI distinto); a jornada pela lupa é validada no desktop.',
    );
    const term = SEARCH_TERMS.withoutResults;

    await test.step('pesquisar um termo inexistente', async () => {
      await homePage.searchFor(term);
    });

    await test.step('a página responde com sucesso, sem erro de aplicação', async () => {
      await searchResultsPage.assertLoadedFor(term);
      expect(await searchResultsPage.title()).not.toMatch(/404|erro|error/i);
    });

    await test.step('nenhum artigo é listado', async () => {
      expect(await searchResultsPage.resultCount()).toBe(0);
    });

    await test.step('a mensagem de "nada encontrado" é exibida ao usuário', async () => {
      await expect(searchResultsPage.noResultsSection).toBeVisible();
      await expect(searchResultsPage.noResultsSection).toContainText(NO_RESULTS_MESSAGE);
    });

    await test.step('o usuário consegue tentar uma nova busca sem sair da página', async () => {
      await expect(searchResultsPage.noResultsSearchField).toBeVisible();
      await expect(searchResultsPage.noResultsSearchField).toBeEditable();
    });
  });

  test('CT-03 | busca é indiferente a maiúsculas e minúsculas @regression', async ({ searchResultsPage }) => {
    await searchResultsPage.openWithTerm(SEARCH_TERMS.valid);
    const lowerCaseTitles = await searchResultsPage.resultTitleTexts();
    expect(lowerCaseTitles.length).toBeGreaterThan(0);

    await searchResultsPage.openWithTerm(SEARCH_TERMS.validUppercase);
    const upperCaseTitles = await searchResultsPage.resultTitleTexts();

    expect([...upperCaseTitles].sort()).toEqual([...lowerCaseTitles].sort());
  });

  test('CT-04 | abrir um resultado leva ao artigo correspondente @regression', async ({
    searchResultsPage,
    articlePage,
  }) => {
    await searchResultsPage.openWithTerm(SEARCH_TERMS.valid);
    await expect(searchResultsPage.resultTitles.first()).toBeVisible();

    const titleInCard = await searchResultsPage.openResult(0);

    await expect(articlePage.heading).toBeVisible();
    await expect(articlePage.heading).toHaveText(titleInCard);
    await expect(articlePage.content).not.toBeEmpty();
    expect(articlePage.currentUrl).not.toContain('?s=');
  });
});
