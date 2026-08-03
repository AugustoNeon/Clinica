---
description: Entrevista o usuario sobre a tarefa ate fechar entendimento compartilhado. Use quando a tarefa e ambigua, grande ou toca path critico. Uma pergunta por vez, com resposta recomendada.
output: "Uma pergunta por turno, sem lista antecipada. Encerra com bloco 'Entendimento fechado' listando premissas, vocabulario ajustado e decisoes a registrar."
quando-nao-usar: NÃO use para desenhar a execução de tarefa já clara — use /plan; o grill interroga a spec, não o código.
---

# /grill

Voce vai entrevistar o usuario **implacavelmente** sobre a tarefa,
percorrendo cada ramo da arvore de decisao, ate que voces dois tenham
o mesmo modelo mental do que sera feito. Nao edite, nao escreva, nao
execute — apenas pergunte, explore e registre.

E o antidoto direto do anti-padrao A18 (prosseguir sob underspec):
cada minuto de pergunta aqui troca iteracoes de "nao era isso que eu
queria" mais tarde.

## Processo

1. **Reformule a tarefa** em uma frase e peca confirmacao.

2. **Mapeie os ramos abertos:** algoritmo, contrato externo,
   comportamento visivel ao usuario, modelo de dados, bordas.
   Resolva as dependencias entre decisoes uma a uma — decisao que
   destrava outras vem primeiro.

3. **Uma pergunta por vez.** Espere a resposta antes da proxima.
   Nada de questionario em lote.

4. **Toda pergunta vem com a sua resposta recomendada** e o porque
   em uma linha. O usuario confirma, ajusta ou rejeita — e mais
   rapido do que pensar do zero.

5. **Explore antes de perguntar.** Se a resposta esta no codebase,
   no AGENTS.md ou nos docs, leia e afirme em vez de perguntar.
   Pergunta e para o que so o usuario sabe.

## Durante a sessao

- **Confronte com o vocabulario.** Termo que conflita com o
  Vocabulario de dominio do AGENTS.md e apontado na hora: "o
  contrato define <termo> como <A>, voce parece dizer <B> — qual e?".
- **Afie linguagem vaga.** Termo sobrecarregado ("conta", "usuario",
  "processar") recebe proposta de termo canonico preciso.
- **Teste cenarios concretos.** Invente casos de borda que forcam
  precisao nas fronteiras entre conceitos.
- **Cruze com o codigo.** Usuario afirma um comportamento, codigo
  mostra outro: exponha a contradicao com path:linha.

## Registro inline (nao acumule para o final)

- **Termo resolvido** vira proposta de linha nova na tabela
  "Vocabulario de dominio" do AGENTS.md, ali mesmo.
- **Decisao cristalizada** vira proposta de decisao-minima
  ("Decisoes fechadas": data, decisao, alternativa, por que, custo).
- **ADR completo** so quando as tres condicoes valem ao mesmo tempo:
  custo de reversao alto, E surpreendente sem contexto para um
  leitor futuro, E resultado de trade-off real entre alternativas
  genuinas. Faltou uma: fica na decisao-minima.

## Saida

A sessao termina quando nao resta ramo aberto. Entregue:

```
# Entendimento fechado: <tarefa em 1 frase>

## Premissas confirmadas
- <escolha>: <valor confirmado>

## Vocabulario novo/ajustado
- <termo>: <definicao> (entrar no AGENTS.md)

## Decisoes a registrar
- YYYY-MM-DD: <linha de decisao-minima>
```

Em seguida, ofereca rodar `/plan` com essas premissas.

## Regras

- Nao implemente nada durante a sessao.
- Nao agrupe perguntas: uma por vez.
- Nao pergunte o que da para descobrir lendo.
- Pergunta sem resposta recomendada e pergunta preguicosa.
