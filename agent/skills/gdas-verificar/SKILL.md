---
name: gdas-verificar
description: Gate de verificação fail-fast (6 fases) antes de mover uma demanda para "concluído". Roda scripts/gate.sh, produz evidência auditável em docs/evidencia/, e proíbe PASS sem comando executado.
quando-nao-usar: NÃO use como check rápido de turno (<30s, sem evidência persistida) — use agent/checks/verify.sh (/verify); para criar o teste nomeado de um bug corrigido, use a skill irmã gdas-regressao.
---

# gdas-verificar — gate de verificação fail-fast

Skill instalável da família gdas-qualidade (spec no repositório do guia;
origem ECC, MIT, com atribuição). A skill carrega o **processo**; o
projeto carrega os
**números e comandos**, declarados na seção `## Comandos` do contrato vivo
(`AGENTS.md`, ou o espelho que a sua ferramenta de agente ler). A skill
**nunca** contém threshold.

## Disparo

1. Invocação explícita (`bash agent/skills/gdas-verificar/scripts/gate.sh [tarefa]`).
2. Pré-PR — antes de abrir a solicitação de merge.
3. **Obrigatório** na transição de demanda para "concluído".

## Fases (sequenciais, fail-fast)

| Fase | Executa | Fonte | Falha bloqueia? |
|---|---|---|---|
| 0 | Aderência determinística | `agent/checks/verify.sh` (bateria instalada pelo init) | Sim |
| 1 | Build/compilação | `Comandos > build` | Sim |
| 2 | Análise estática | `Comandos > lint` | Sim |
| 3a | Integridade: captura de invariantes | `Comandos > suite-dir / schema-fingerprint / sentinelas / isolamento` | Sim |
| 3 | Suíte de testes | `Comandos > test` (+ `coverage-target`, `conta-testes`/`conta-executados` opcionais) | Sim |
| 3b | Integridade: re-verificação | invariantes capturadas em 3a | Sim |
| 4 | Regressões nomeadas | `Comandos > regressao` (suíte `BUG-R*`, skill gdas-regressao) | Sim |
| 5 | Checklist de segurança | `Comandos > security` (padrões do domínio declarados pelo projeto) | Sim |

## Regras

- **R1 — SKIP explícito.** Comando não declarado em `## Comandos` ⇒ fase
  reportada como `SKIP` na evidência, com o motivo. Proibido inventar
  comando ou pular em silêncio: a lacuna vira dado.
- **R2 — Zero thresholds na skill.** Cobertura é reportada se o comando de
  teste a emitir e comparada a alvo somente se `coverage-target` existir em
  `## Comandos`. Padrões de segurança do domínio (segredos, SQL dinâmico,
  validações multi-tenant) são declarados pelo projeto no comando
  `security` — nunca embutidos aqui.
- **R3 — Evidência obrigatória.** Toda execução (sucesso, falha ou parcial)
  gera `docs/evidencia/<tarefa>.md`. **Proibido registrar PASS de comando
  não executado.** Após o gate, o agente completa a tabela "Garantias"
  (garantia → teste/comando → tipo → resultado → evidência) antes de anexar
  ao PR.
- **R4 — Exit codes.** `0` = todas as fases PASS ou SKIP declarado; `1` =
  falha bloqueante (a saída indica a fase); `2` = erro de configuração
  (contrato vivo sem seção `## Comandos`). Consumível pelo CI do forge.
- **R5 — Fase de integridade (isolamento estrutural da verificação).**
  Invariantes de ambiente declaradas são capturadas antes da suíte (3a) e
  re-verificadas depois (3b): fingerprint da suíte, fingerprint da
  ESTRUTURA do banco, contagens-sentinela. Divergência ou invariante
  não-verificável = **FAIL, nunca SKIP**, com PEN candidata gravada em
  `agent/pens/` (nunca correção silenciosa). `isolamento: parcial` só
  existe declarado — degradação nunca é implícita. Exit 0 do processo de
  teste não é evidência: com `conta-testes`/`conta-executados` declarados,
  o gate valida a contagem do relatório do runner (anti-escape). O
  protocolo do executor é o playbook `/executor-verificacao` (4 etapas,
  sem etapa de edição).

## O que esta skill NÃO faz

- Não define thresholds (pertencem ao contrato vivo do projeto).
- Não corrige falhas automaticamente.
- Não substitui o check rápido de turno (`agent/checks/verify.sh` — <30s,
  acoplado a fim de turno/pre-commit); o gate é a cerimônia de conclusão,
  com evidência persistida.

## Campanha (problema difícil multi-fase)

Para o problema mais difícil vivo do projeto, use
`templates/CAMPANHA.md.tmpl`: plano executável com gates de decisão
("observação esperada; se vir X, desvie para Y" — valores declarados no
contrato vivo, nunca no template), menu de soluções ranqueado, caminhos
errados cercados e **Fase 0 obrigatória de dry-run em clone/worktree
descartável** antes do handoff — divergência no ensaio devolve o plano,
nunca se "ajusta no real". A promoção do resultado roteia por este gate.

## Contrato de arquivos

```
agent/skills/gdas-verificar/
  SKILL.md                     # este arquivo
  scripts/gate.sh              # orquestrador: fases, fail-fast, exit codes
  templates/EVIDENCIA.md.tmpl  # formato do relatório de evidência
  templates/CAMPANHA.md.tmpl   # plano multi-fase com gates de decisão
```
