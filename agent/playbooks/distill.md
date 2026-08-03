---
description: Destila o historico bruto de licoes e diffs recentes em uma entrada enxuta para a secao "Licoes aprendidas" do AGENTS.md. Use ao fim de um ciclo, ou quando a secao acumulou ruido e entradas redundantes.
quando-nao-usar: NÃO use para criar ou vincular demanda no rastreador — use /demanda; o distill move lição/decisão para o contrato.
---

# /distill

Voce vai ler o material bruto de um ciclo de trabalho (commits, PRs,
postmortems, conversas de plan/grill) e **propor** a entrada destilada
para a secao "Licoes aprendidas" do AGENTS.md. Voce e um compilador:
le fonte verbosa, produz uma linha densa e duravel. Nao escreve no
contrato sozinho — recomenda, o humano aprova.

## Entrada

- Diffs e mensagens de commit do periodo.
- PRs fechados (O que / Por que / Riscos).
- Postmortems do ciclo, se houver.
- A secao "Licoes aprendidas" atual do AGENTS.md (para nao duplicar).

## Processo

1. **Coletar.** Reuna o material bruto. Se o intervalo nao foi
   apontado, pergunte (ultimo ciclo? ultimas N entregas?).
2. **Extrair candidatos.** Formule cada licao em uma frase: o que
   mudou no modelo mental do time, nao o que foi feito. "X falha
   quando Y" e licao; "implementamos X" nao e.
3. **Filtrar pela regra de tres.** Padrao visto uma vez so e ruido.
   So vira licao o que se repetiu ou tem custo alto de reaprender.
4. **Deduplicar contra o contrato.** Se a licao ja esta coberta por
   entrada existente ou decisao fechada, nao repita — no maximo,
   sugira reforcar a antiga.
5. **Formatar.** Padrao append-only do contrato:
   `- AAAA-MM-DD [tag]: <licao em 1-2 frases densas>`.
6. **Propor o patch.** Mostre as entradas novas que entram NO TOPO da
   secao, mais os candidatos a poda (entradas que envelheceram).
   Pergunte antes de aplicar.

## Saida

Um bloco pronto para colar no topo de "Licoes aprendidas", mais uma
lista separada de "candidatos a poda". Nada e escrito sem o ok humano.

## Limites

- Nao inventa licao para preencher cota. Ciclo sem aprendizado real
  gera zero entradas — resultado valido.
- Nao reescreve licoes antigas que ainda valem; append-only.
- Nao toca em "Decisoes fechadas": pode *sugerir* uma decisao, mas
  fechar e ato deliberado.
