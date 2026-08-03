---
description: Abre PR/MR com descricao estruturada (O que / Por que / Como testar / Riscos / Checklist). Usa o primitivo de escrita do forge do projeto (CLI nativa ou API), derivado do forge configurado.
output: "URL do PR + checklist preenchido (O que/Por que/Testar/Riscos). Sem sumario redundante apos o URL."
quando-nao-usar: NÃO use para o commit local do trabalho — use /commit; o PR consome commits prontos e anexa evidência.
---

# /pr

Voce vai abrir Pull Request com descricao estruturada.

## Processo

1. Verifique branch atual: `git branch --show-current`. Se for
   `main` / `master`, pare e avise — PR sai de branch dedicada.
2. Verifique se ha commits a frente do upstream: `git log @{u}..`.
   Se vazio, pare e avise.
3. Leia os commits: `git log @{u}.. --pretty=format:"%h %s"`.
4. Leia o diff vs base: `git diff @{u}..`.
5. Monte titulo: imperativo, <=72 chars.
6. Monte body no template abaixo.
7. Abra a unidade de revisao (PR/MR) com o **primitivo de escrita do forge**
   do projeto — o mesmo escolhido no `gdas init --forge`, refletido no remote e
   na casca de CI presente. O comando concreto (CLI nativa ou API REST) e
   **derivado da plataforma**, nao pressuposto: descubra o forge do projeto e
   use a integracao correspondente (o mapeamento concreto por plataforma vive no
   adapter de forge-write, nao neste playbook). **Nao** hardcode o comando de um
   unico forge — o que serve a um nao serve a outro. Use heredoc para preservar
   a formatacao do body.
8. **Robustez do corpo:** se o AGENTS.md documentar restricoes de corpo do
   deployment do forge (encoding/WAF/tamanho), respeite-as — corpo ASCII-safe e
   conteudo rico/acentuado como anexo (upload multipart passa mesmo com acento).

## Template do body

```markdown
## O que

<2-4 bullets do que esta sendo entregue>

## Por que

<contexto: que problema isso resolve, que decisao foi tomada>

## Como testar

- [ ] <passo manual ou eval rodada>
- [ ] <passo manual ou eval rodada>

## Riscos

- **<area afetada>:** <risco e mitigacao>

## Checklist

- [ ] `make verify` passou
- [ ] AGENTS.md atualizado (se houve licao ou decisao)
- [ ] Efeito com side-effect (push/MR/deploy/migration) tem registro (DEC/licao/CHANGELOG)
- [ ] VERSION bumpado + entrada no CHANGELOG (SemVer) — toda mudanca vira versao (DEC-030)
- [ ] Feature flag adicionada (se mudanca nao-trivial)
- [ ] Postmortem linkado (se PR fecha incidente)
```

## Regras

- Nao mencione o agente / a ferramenta no body do PR.
- Nao adicione `🤖 Generated with...` ou similar. Imposto pelo check
  `agent/checks/no-agent-attribution.sh`; desligar na origem — ver
  docs/adapters.md ("Atribuicao ao agente em commits").
- Linkar issue/postmortem por numero (`#123`), nao por URL longa.
- Se houver lição que entrou no AGENTS.md, mencione na secao "Por
  que".
