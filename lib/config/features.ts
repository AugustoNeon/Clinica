/**
 * Flags de escopo ainda EM ABERTO (PLANEJAMENTO.md, "Decisoes em aberto").
 *
 * Sao constantes de build, nao variaveis de ambiente: o build nao pode
 * depender de env var estar setada. Quando a cliente decide um escopo,
 * a flag correspondente sai daqui e o codigo passa a assumir a decisao.
 *
 * HOJE NAO HA NENHUMA FLAG EM ABERTO. A flag `blog` foi removida em
 * 2026-08-04: a pergunta 22 do questionario voltou "sim" e o blog virou
 * escopo confirmado. O arquivo fica de proposito, para receber a proxima
 * decisao de escopo pendente sem reabrir a discussao de onde ela mora.
 */
export const FEATURES = {} as const;
