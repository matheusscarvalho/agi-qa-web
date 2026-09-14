# Módulo complementar — Selenium + Java

Complemento em **Selenium 4 + JUnit 5 (Maven)** cobrindo os dois cenários
principais da pesquisa do Blog do Agi. O projeto principal é o projeto em
Playwright (pasta raiz).

## Pré-requisitos
- JDK 17+
- Maven 3.9+
- Google Chrome instalado (o driver é resolvido pelo Selenium Manager)

## Execução
```bash
cd selenium-java
mvn test                       # headless
mvn test -Dheadless=false      # com navegador visível
mvn test -DbaseUrl=https://staging.blogdoagi.com.br
```

## Execução por tag (grupos JUnit)

```bash
mvn test -Dgroups=smoke        # apenas o caminho feliz
mvn test -Dgroups=exception    # apenas o caso de "sem resultados"
mvn test -Dgroups=regression   # todos
```

## Cenários
- **CT-01** — busca por termo válido retorna artigos
- **CT-02** — busca sem resultados exibe a mensagem amigável

## Estrutura
```
selenium-java/
├── pom.xml
└── src/test/java/com/agi/qa/
    ├── pages/SearchPage.java   # Page Object da pesquisa
    └── tests/
        ├── BaseTest.java       # setup/teardown do WebDriver
        └── BuscaTest.java      # CT-01 e CT-02
```
