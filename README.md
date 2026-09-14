# QA Web — Automação da pesquisa do Blog do Agi

Automação **end-to-end** da funcionalidade de **pesquisa de artigos** (lupa no
canto superior direito) do [Blog do Agi](https://blogdoagi.com.br), desenvolvida
como parte do teste técnico de QA.

> Stack principal: **Playwright + TypeScript** (Page Object Model).
> Há também um módulo complementar em **Selenium + Java** (ver [`selenium-java/`](selenium-java/)).

---

## Cenários automatizados

Os dois cenários mais relevantes pedidos no desafio são **CT-01** (busca com
resultados) e **CT-02** (busca sem resultados). A lista completa e a
justificativa de priorização estão em [`docs/cenarios.md`](docs/cenarios.md).

| ID           | Cenário                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| CT-01        | Busca por termo válido pela lupa retorna artigos relacionados                                                                                      |
| CT-02        | Busca sem resultados exibe mensagem amigável e oferece nova busca                                                                                  |
| CT-03        | Busca é indiferente a maiúsculas/minúsculas                                                                                                        |
| CT-04        | Abrir um resultado leva ao artigo correspondente                                                                                                   |
| CT-05        | Paginação preserva o termo e traz artigos distintos                                                                                                |
| CT-06..CT-11 | Fluxos alternativos e casos de exceção (acentos, XSS/escape, busca vazia, nova busca a partir de "sem resultados", página além da última, espaços) |

---

## Pré-requisitos

- **Node.js 18+** (testado com Node 20/24)
- npm

## Instalação

```bash
npm install
```

O `postinstall` já baixa o navegador Chromium do Playwright. Se necessário,
force com:

```bash
npx playwright install chromium
```

## Execução

```bash
npm test              # toda a suíte (desktop + mobile)
npm run test:desktop  # apenas Chromium desktop
npm run test:mobile   # apenas emulação mobile (Pixel 7)
npm run test:headed   # desktop com navegador visível
npm run test:ui       # modo interativo do Playwright
```

### Execução por tag

Os testes têm tags que permitem separar as execuções:

| Tag           | Escopo                   | Comando                   |
| ------------- | ------------------------ | ------------------------- |
| `@smoke`      | caminho crítico (rápido) | `npm run test:smoke`      |
| `@regression` | suíte completa           | `npm run test:regression` |
| `@security`   | escape/XSS               | `npm run test:security`   |
| `@exception`  | casos de erro            | `npm run test:exception`  |
| `@altflow`    | fluxos alternativos      | `npm run test:altflow`    |
| `@lupa`       | jornada pela lupa        | `npm run test:lupa`       |

Também é possível combinar: `npx playwright test --grep "@smoke|@security"`.

Apontar para outro ambiente:

```bash
BASE_URL=https://staging.blogdoagi.com.br npm test
```

## Relatórios

Após a execução:

```bash
npm run report        # abre o relatório HTML do Playwright
```

- **HTML:** `playwright-report/`
- **JUnit (CI):** `reports/junit-results.xml`
- Em falhas, são anexados **screenshot, vídeo e trace** (`test-results/`). Abra um
  trace com `npx playwright show-trace <arquivo>.zip`.

---

## Estrutura do projeto

```
agi-qa-web/
├── playwright.config.ts        # configuração, projetos (desktop/mobile), relatórios
├── src/
│   ├── pages/                  # Page Objects (BasePage, HomePage, SearchResultsPage, ArticlePage)
│   ├── fixtures/               # injeção dos Page Objects via fixture do Playwright
│   └── data/                   # massa de teste e constantes
├── tests/
│   ├── busca.spec.ts           # CT-01..CT-04
│   └── paginacao.spec.ts       # CT-05
├── docs/cenarios.md            # cenários e justificativa de priorização
├── selenium-java/              # módulo complementar Selenium + Java (Maven)
└── .github/workflows/e2e.yml   # pipeline no GitHub Actions
```

## Decisões de arquitetura

- **Page Object Model + fixtures:** os seletores do tema (Astra) ficam isolados
  nas Page Objects; os testes descrevem apenas regra de negócio. Se o blog trocar
  de tema, só as POs mudam.
- **Sincronização por UI, nunca por `sleep`:** esperas por elemento/URL, o que
  torna a suíte estável mesmo com scripts de terceiros carregando de forma
  assíncrona.
- **`data-driven`:** termos e mensagens centralizados em `src/data`.
- **Multiprojeto (desktop + mobile):** valida a jornada em dois viewports.
- **Robustez ao LiteSpeed Cache:** o CDN adia o `frontend.js` do Astra (que anima
  a lupa). A automação clica na lupa real e, se o tema não abrir o overlay em 3s,
  aplica a mesma transição do tema para seguir interagindo com o **formulário e o
  submit reais** do WordPress. Detalhes em [`docs/cenarios.md`](docs/cenarios.md).

## CI/CD

O workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) executa a
suíte em matriz (desktop + mobile) a cada push/PR e publica os relatórios HTML e
JUnit como artefatos.

---

## Última execução local

```
Running 22 tests using 3 workers
  22 passed   (desktop + mobile, sem skips)
```
