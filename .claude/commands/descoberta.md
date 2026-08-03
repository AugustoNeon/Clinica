---
description: Use no onboarding de um projeto (ou ao assumir área nova) para extrair o conhecimento tácito — investiga o repo primeiro e pergunta no MÁXIMO 5 coisas ao humano, só o que o repo não revela. As respostas viram contrato vivo e lições, nunca ficam só na sessão.
quando-nao-usar: NÃO use para interrogar a spec de uma tarefa específica — use /grill; nem para preencher placeholders de estado (Stack, Como rodar) — isso é o protocolo de primeira sessão do contrato vivo.
---

# /descoberta

Voce vai extrair o conhecimento tacito do projeto: as regras nao
escritas, as falhas que mais custaram, o que nenhum doc conta. Rode uma
vez no onboarding de um projeto (ou quando assumir uma area nova) — nao
por tarefa.

## Processo

1. **Investigue o repo ANTES de perguntar**, na ordem da hierarquia de
   prioridade de fontes do guia (codigo verificado > testes > CI >
   build > deploy > docs > git history > issues/notas): contrato vivo,
   build/testes reais, historico do git (o que foi revertido, o que
   estagnou em branch morto), hotspots de TODO/FIXME, postmortems e
   licoes existentes. O que o repo responde, voce nao pergunta.

2. **Faca NO MAXIMO 5 perguntas** ao humano — uma por vez, so sobre o
   que o repo nao revela:

   1. Qual e o problema mais dificil VIVO agora?
   2. Que regras nao escritas existem (coisas proibidas que nenhum doc
      declara)?
   3. Quem e a audiencia deste trabalho e o que ela NAO sabe?
   4. Quais falhas passadas custaram mais tempo/dinheiro?
   5. O que "alem do estado da arte" significa NESTE projeto?

   Pule as ja respondidas pela investigacao; nao invente uma 6ª.

3. **Materialize as respostas** — nada fica so na sessao:
   - Regra nao escrita → linha nas convencoes do contrato vivo (ou
     decisao-minima, se for escolha).
   - Falha que custou caro → licao append-only (com o custo declarado).
   - Problema mais dificil vivo → candidato a campanha (template de
     campanha da skill de verificacao) ou demanda no rastreador.
   - Audiencia/estado da arte → seção de objetivo do contrato vivo.

## Output esperado

```
Investigacao: <n> fontes lidas; <k> perguntas ja respondidas pelo repo.
Perguntas feitas (<=5): 1) ... 2) ...
Materializado:
- contrato vivo: <secoes tocadas>
- licoes: <n> novas (append-only)
- demandas/campanha: <refs>
Nao revelado (declarado): <o que segue desconhecido>
```

## Regras

- Teto duro de 5 perguntas — a disciplina forca a investigacao previa.
- Uma pergunta por vez, com a sua leitura recomendada (mesmo padrao do
  /grill).
- Resposta do humano e fonte "issues/notas" na hierarquia: se contradiz
  o codigo verificado, aponte a divergencia em vez de sobrescrever.
- Repetir a descoberta so quando o time/area mudar — nao e ritual de
  ciclo.
