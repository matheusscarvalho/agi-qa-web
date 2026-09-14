export const SEARCH_TERMS = {
  valid: 'empréstimo',
  broad: 'a',
  withoutResults: 'zxqwkjhgfd1234567890',
  validUppercase: 'EMPRÉSTIMO',
  withSpecialChars: 'cartão de crédito',
  withSurroundingSpaces: '  empréstimo  ',
  xssPayload: '<script>alert(1)</script>',
} as const;

export const NO_RESULTS_MESSAGE = /nada foi encontrado para sua pesquisa/i;
