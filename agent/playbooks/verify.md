---
description: Roda senior baseline + lint + types + tests + evals. Para no primeiro erro. Corrige automaticamente quando seguro.
output: "Senior baseline / linter / typecheck / testes / evals: OK ou parou em <etapa>:<artefato>. Max 6 linhas. Sem prosa adicional."
quando-nao-usar: NÃO use para a cerimônia de conclusão de demanda com evidência persistida — use o gate da skill gdas-verificar (agent/skills); este check é o passe rápido de turno (<30s).
---

# /verify

Voce vai rodar a bateria de verificacao do projeto. Ordem fixa,
nao pulando passos. Para no primeiro erro **bloqueante**.

## Processo

1. **Senior baseline** (mais critico):
   - Leia o diff atual (HEAD vs upstream OU staged se nao houver
     branch upstream) e verifique cada um dos 12 zeros do
     senior-baseline do guia GDAS sobre as linhas adicionadas.
   - Findings CRITICO: pare, reporte, peca correcao.
   - Findings ALTO: reporte, sugira correcao, prossiga.
   - Findings MEDIO/BAIXO: reporte ao final.

2. **Linter** (`make lint`):
   - Se falha, leia output e corrija o que for trivial (formatacao,
     import nao usado, semicolon). Para tudo que exige decisao,
     reporte e pare.

3. **Type checker** (`make typecheck` ou equivalente):
   - Se falha, leia output, corrija quando seguro. Erro de logica
     real: pare e reporte.

4. **Testes afetados** (`make test` com escopo do diff):
   - Se um teste quebra por alteracao real de comportamento, pare e
     pergunte: e regressao ou comportamento esperado?

5. **Evals dos dominios afetados** (`make eval` filtrado):
   - Se eval falha, leia o caso e analise: bug introduzido ou eval
     desatualizada? Reporte ao usuario, nao "corrija" eval que
     estava certa.

## Output esperado

```
Senior baseline:  OK / N findings (criticos / altos / medios)
Linter:           OK / N erros corrigidos / parou em <arquivo>
Type checker:     OK / parou em <arquivo>:<linha>
Testes:           OK / falhou em <suite>
Evals:            OK / falhou em <dominio>/<caso>

Pronto para commit / abrir PR.
```

## Regras

- Nunca rode `--no-verify` para passar.
- Nunca desligue regra de linter para passar.
- Nunca apague eval que estava certa.
- Se algo nao roda no ambiente, reporte (`make verify nao existe` ->
  pergunte qual e o comando real).
