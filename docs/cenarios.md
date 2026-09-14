# Cenários de teste — Pesquisa de artigos do Blog do Agi

## Contexto e priorização

A funcionalidade sob teste é a **pesquisa de artigos** acessada pela **lupa no
canto superior direito** do blog (`https://blogdoagi.com.br`). A busca é um
`GET /?s=<termo>` do WordPress que renderiza uma página de resultados.

A automação prioriza os cenários com **maior risco de negócio e maior
frequência de uso**:

1. O usuário encontra conteúdo relevante (caminho feliz) — é a razão de existir
   da busca; se falhar, o blog perde tráfego e engajamento.
2. O usuário **não** encontra conteúdo — o sistema precisa comunicar isso de
   forma clara e oferecer uma saída, em vez de exibir uma página vazia ou um
   erro. É um caso de borda comum e de alto impacto em experiência.

Os demais cenários cobrem regressões de comportamento (case-insensitive,
navegação para o artigo e paginação).

## Casos automatizados

| ID    | Cenário                                                           | Tipo                    | Projeto          |
| ----- | ----------------------------------------------------------------- | ----------------------- | ---------------- |
| CT-01 | Busca por termo válido pela lupa retorna artigos relacionados     | Caminho feliz           | desktop + mobile |
| CT-02 | Busca sem resultados exibe mensagem amigável e oferece nova busca | Borda / negativo        | desktop + mobile |
| CT-03 | Busca é indiferente a maiúsculas/minúsculas                       | Regressão               | desktop + mobile |
| CT-04 | Abrir um resultado leva ao artigo correspondente                  | Integração de navegação | desktop + mobile |
| CT-05 | Paginação preserva o termo e traz artigos distintos               | Regressão               | desktop + mobile |
| CT-06 | Busca com acentos e espaços retorna resultados                    | Fluxo alternativo       | desktop + mobile |
| CT-07 | Termo com HTML/`<script>` é escapado e não executa                | Exceção / segurança     | desktop + mobile |
| CT-08 | Busca vazia pela lupa não quebra a aplicação                      | Exceção                 | desktop + mobile |
| CT-09 | Nova busca a partir da página "nenhum resultado"                  | Fluxo alternativo       | desktop + mobile |
| CT-10 | Página além da última não retorna erro de servidor                | Exceção                 | desktop + mobile |
| CT-11 | Espaços ao redor do termo não impedem os resultados               | Fluxo alternativo       | desktop + mobile |

> **CT-01 e CT-02** são os **dois cenários mais relevantes** pedidos no desafio.
> Os demais foram acrescentados para dar robustez à regressão.

### CT-01 — Termo válido (caminho feliz)

- **Dado** que o usuário está na home do blog
- **Quando** pesquisa por `empréstimo` pela lupa
- **Então** a URL e o título preservam o termo, a listagem retorna ≥ 1 artigo,
  todo card tem título não vazio e link `http(s)` navegável, e o bloco de
  "nenhum resultado" não aparece.

### CT-02 — Termo sem resultados (borda)

- **Dado** que o usuário está na home do blog
- **Quando** pesquisa por uma string sem significado
- **Então** a página responde com sucesso (sem 404/erro), nenhum artigo é
  listado, a mensagem _"nada foi encontrado para sua pesquisa"_ é exibida e um
  campo para nova busca continua disponível.

### CT-03 — Case-insensitive

Pesquisar `empréstimo` e `EMPRÉSTIMO` deve retornar exatamente a mesma lista.

### CT-04 — Navegação para o artigo

Abrir o primeiro resultado deve levar ao artigo cujo título é igual ao do card,
com conteúdo não vazio e fora da URL de busca.

### CT-05 — Paginação

Com um termo abrangente, avançar para a página 2 deve manter o parâmetro `s` e
trazer artigos diferentes dos da página 1 (sem repetição).

## Observações técnicas relevantes ao QA

- **LiteSpeed Cache adia o `frontend.js` do tema Astra**, que é quem anima o
  overlay da lupa. Em ambiente headless o clique na lupa nem sempre abre a
  caixa. A automação clica na lupa real e, se o tema não responder em 3s, aplica
  a mesma transição que o tema aplicaria (estilo inline na caixa) para seguir
  interagindo com o **formulário e o submit reais** do WordPress. Isso é um
  ponto de atenção de performance/JS que vale reportar ao time de front.
- **A lupa é exercida em desktop e mobile.** O ícone de busca existe em ambos os
  headers; o seletor mira a instância visível (`.astra-search-icon:visible`), já
  que o tema mantém no DOM também a versão oculta do outro layout.

## Casos de exceção e fluxos alternativos (CT-06 a CT-11)

- **CT-06** — termos com acento/espaço (`cartão de crédito`) devem retornar resultados.
- **CT-07 (segurança)** — pesquisar `<script>alert(1)</script>` não pode executar
  script (nenhum `dialog`/alert dispara) e o termo deve ser renderizado como texto
  escapado no título. Protege contra XSS refletido.
- **CT-08** — submeter a busca vazia pela lupa não pode gerar erro; a página de
  resultados carrega normalmente (o WordPress lista os posts).
- **CT-09** — a partir da página de "nenhum resultado", o usuário faz uma nova
  busca (entrada alternativa) por um termo válido e passa a ver resultados.
- **CT-10** — acessar `/page/9999/?s=a` (além da última página) não pode retornar
  5xx; a listagem fica vazia de forma controlada.
- **CT-11** — espaços ao redor do termo não impedem o retorno de resultados.
