---
name: gdas-stocktake
description: Auditoria periódica e barata do inventário de doutrina e skills (Camada A). Vereditos Keep/Improve/Update/Retire/Merge com reason auto-contido; Retire/Merge geram PEN — a skill propõe, o humano dispõe. Quick Scan por hash de conteúdo.
quando-nao-usar: NÃO use para verificar uma entrega de código — use a skill irmã gdas-verificar; vereditos daqui nunca executam ação (Retire/Merge viram PEN para o humano).
---

# gdas-stocktake — auditoria de gordura da Camada A (v0.1)

Skill instalável da família gdas-qualidade (spec no repositório do guia;
origem ECC, MIT, com atribuição — simplificada: sem lotes de subagentes,
sem métrica por mtime, sem descoberta implícita). A doutrina exige que
"cada conceito justifique seu custo de manutenção"; esta skill torna essa
auditoria um processo repetível — **a auditoria propõe, o humano dispõe**.

## Regras

- **RF-01 — Escopo declarado.** Os paths auditados vivem em
  `agent/stocktake/escopo.txt` (um por linha; criado com defaults na
  primeira execução). Sem descoberta implícita: o que não está na lista
  não é auditado, e a lista é ela própria item auditável.
- **RF-02 — Checklist canônico (4 itens):** (a) sobreposição de conteúdo
  com outras skills/playbooks; (b) sobreposição com o contrato vivo;
  (c) atualidade das referências técnicas (verificar com busca quando há
  nome de ferramenta/flag/API); (d) custo de manutenção vs uso percebido.
- **RF-03 — Vereditos:** `Keep | Improve | Update | Retire | Merge`.
  Julgamento holístico guiado por actionability, scope fit, uniqueness e
  currency — **não** rubrica numérica (nota 1–5 seria número mágico).
- **RF-04 — Regra de `reason` (coração da skill).** Auto-contido e
  decisão-habilitante; proibido "superseded"/"unchanged" seco. Retire
  exige defeito específico + o que cobre a mesma necessidade; Merge exige
  alvo nomeado + o que integrar; Improve exige a mudança específica.
- **RF-05 — Cache por hash de conteúdo** (SHA-256, nunca mtime).
  `agent/stocktake/results.json` guarda vereditos + `status`
  (`in_progress` ⇒ retomada do primeiro item pendente).
- **RF-06 — Veredito não executa.** `registrar` com Retire/Merge gera PEN
  (`agent/pens/`, template `agent/templates/pen.md.tmpl`) com o `reason`
  como corpo; a skill nunca deleta, move ou mescla arquivo.
- **RF-07 — Integração.** Passo do ciclo de manutenção da Camada A
  (Full obrigatório 1× por ciclo de revisão); sem comando de topo
  independente (anti-sprawl).

## Uso

```
bash agent/skills/gdas-stocktake/scripts/scan.sh          # inventário (paths + hash)
bash agent/skills/gdas-stocktake/scripts/diff.sh          # pendências: NOVO/ALTERADO/CACHE
bash agent/skills/gdas-stocktake/scripts/diff.sh registrar <path> <veredito> "<reason>"
bash agent/skills/gdas-stocktake/scripts/diff.sh concluir # status: completed
```

Fluxo: `diff.sh` lista o que reavaliar (Quick Scan: só hash alterado;
Full: `results.json` ausente ou tudo pendente); o agente avalia cada item
pendente contra o checklist RF-02 e grava com `registrar`; Retire/Merge
geram PEN automaticamente. Se o inventário passar de 30 itens, o próprio
relatório acusa sprawl — reduza o escopo antes de pensar em paralelizar.

## Contrato de arquivos

```
agent/skills/gdas-stocktake/
  SKILL.md              # este arquivo
  scripts/scan.sh       # inventário: enumera escopo declarado, hash de conteúdo
  scripts/diff.sh       # quick scan + registrar veredito + concluir
agent/stocktake/escopo.txt     # escopo declarado (estado do consumidor)
agent/stocktake/results.json   # cache/histórico de vereditos (versionado)
```
