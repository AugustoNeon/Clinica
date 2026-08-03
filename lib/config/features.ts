/**
 * Flags de escopo ainda EM ABERTO (PLANEJAMENTO.md, "Decisoes em aberto").
 *
 * Sao constantes de build, nao variaveis de ambiente: o build nao pode
 * depender de env var estar setada. Quando a cliente responder o
 * questionario, vira `true`/`false` aqui e o menu se ajusta sozinho.
 */
export const FEATURES = {
  /**
   * Blog. Pergunta 22 do questionario ainda sem resposta. A rota
   * `/blog` existe e funciona; o LINK no menu so aparece quando isto
   * virar `true`. Nenhum componente assume a existencia do blog.
   */
  blog: false,
} as const;
