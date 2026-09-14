# Ambientes de execução

Cada arquivo `.env` define as variáveis de um ambiente. Selecione com a variável
`ENV` (`dev` | `qa` | `prod`); o padrão é `dev`.

```bash
ENV=qa npm test
ENV=prod npm run test:smoke
```

Também é possível sobrepor pontualmente sem trocar de arquivo:

```bash
BASE_URL=https://staging.blogdoagi.com.br npm test
```

Precedência: variável já exportada no shell > arquivo do `ENV` > padrão do código.
Ajuste as URLs de `qa`/`prod` conforme os ambientes reais.
