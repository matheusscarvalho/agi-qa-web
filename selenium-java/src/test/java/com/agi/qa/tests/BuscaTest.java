package com.agi.qa.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.agi.qa.pages.SearchPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

@Tag("regression")
@Tag("web")
class BuscaTest extends BaseTest {

    @Test
    @DisplayName("CT-01 | busca por termo válido retorna artigos")
    @Tag("smoke")
    void buscaComResultados() {
        SearchPage page = new SearchPage(driver);
        page.open(BASE_URL);

        page.searchFor("empréstimo");

        assertEquals("empréstimo", page.highlightedTerm(),
                "O termo pesquisado deve aparecer no título da página");
        assertTrue(page.resultCount() > 0,
                "Deveria retornar ao menos um artigo");
        assertFalse(page.isNoResultsVisible(),
                "O bloco de 'nenhum resultado' não deve aparecer");
    }

    @Test
    @DisplayName("CT-02 | busca sem resultados exibe mensagem amigável")
    @Tag("exception")
    void buscaSemResultados() {
        SearchPage page = new SearchPage(driver);
        page.open(BASE_URL);

        page.searchFor("zxqwkjhgfd1234567890");

        assertEquals(0, page.resultCount(),
                "Nenhum artigo deveria ser listado");
        assertTrue(page.isNoResultsVisible(),
                "A mensagem de 'nada encontrado' deve ser exibida");
    }
}
