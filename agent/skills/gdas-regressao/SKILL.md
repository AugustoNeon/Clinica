---
name: gdas-regressao
description: Bug corrigido vira teste permanente nomeado (BUG-Rn) com baseline pinada. A Fase 4 do gate de verificação executa a suíte e acusa remoção não justificada. Remoção só com PEN referenciada.
quando-nao-usar: NÃO use para rodar o gate completo de conclusão — use a skill irmã gdas-verificar (a Fase 4 dele já chama este check); para auditoria de gordura da doutrina, use gdas-stocktake.
---

# gdas-regressao — bug→teste nomeado + baseline pinada (v0.1)

Skill instalável da família gdas-qualidade (spec no repositório do guia;
origem ECC, MIT, com atribuição). Quando o mesmo modelo escreve e revisa
código, carrega as mesmas suposições nos dois passos — o gabarito vivo
cresce por evidência: **testes nascem de bugs, não de código que
funciona**.

## Regras

- **RF-01 — Bug→teste obrigatório.** Ao concluir correção classificada
  como bug, crie o teste nomeado `BUG-Rn` a partir de
  `templates/BUG-Rn.tmpl`: o cabeçalho referencia a demanda/PEN de origem
  e descreve em 1 frase o comportamento garantido. Registre no baseline
  (`scripts/regressao-check.sh pin`). Sem o teste presente e passando, a
  Fase 4 do gate falha — a exigência é mecânica, não disciplinar.
- **RF-04 — Baseline pinada.** `agent/regressao/baseline.tsv` registra a
  lista de testes e o commit da pinagem. O check reporta
  `baseline N → atual M`; queda sem justificativa é drift detectado.
- **RF-05 — Imutabilidade auditada.** Teste `BUG-R*` só sai do baseline
  com **PEN de decisão referenciada** no commit da remoção (template em
  `agent/templates/pen.md.tmpl`). O check acusa remoção não justificada
  apontando o teste e o baseline.
- **Convenção agnóstica de runner:** `BUG-Rn` é padrão de nome e
  cabeçalho — vale para teste de unidade, script de verificação de banco
  ou suíte de script, conforme `## Comandos > regressao` declarar. Em
  arquivo de código, reproduza o cabeçalho do template como comentário no
  topo (parseável: linhas `chave: valor`).

## Uso

```
# valida o baseline e roda a suíte declarada (Fase 4 do gate chama isto)
bash agent/skills/gdas-regressao/scripts/regressao-check.sh

# re-pina o baseline após adicionar teste novo (remoção exige PEN)
bash agent/skills/gdas-regressao/scripts/regressao-check.sh pin
```

## Iteração 2 (não implementada — aguarda 1 ciclo de uso real)

Mapa de paridade (pares de caminho declarados geram variante espelhada;
proibido produto cartesiano automático) e teste de contrato derivado de
spec de API (campos obrigatórios da fonte de verdade). Registrado na spec
da família; não re-litigar sem o ciclo.

## Contrato de arquivos

```
agent/skills/gdas-regressao/
  SKILL.md                     # este arquivo
  scripts/regressao-check.sh   # integridade do baseline + suíte declarada
  templates/BUG-Rn.tmpl        # cabeçalho padrão do teste de regressão
agent/regressao/baseline.tsv   # estado do consumidor (fora da pasta gerenciada)
```
