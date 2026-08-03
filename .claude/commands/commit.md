---
description: Gera mensagem de commit semantica (Conventional Commits) a partir do diff staged. Nao adiciona arquivos.
output: "Mensagem de commit Conventional Commits pronta para git commit. 1-3 linhas. Sem explicacao adicional."
quando-nao-usar: NÃO use para abrir a solicitação de merge com evidência — use /pr; para decidir O QUE entra no commit, o plano já deve existir (/plan).
---

# /commit

Voce vai produzir uma mensagem de commit Conventional Commits a
partir do que ja esta staged. Nao adicione arquivos novos ao stage.

## Processo

1. Rode `git diff --staged --stat` para ver o escopo.
2. Rode `git diff --staged` para ler o diff.
3. Classifique:
   - **feat:** funcionalidade nova
   - **fix:** correcao de bug
   - **refactor:** mudanca sem comportamento novo
   - **docs:** so documentacao
   - **test:** so testes
   - **chore:** infra, dependencia, build, config
   - **style:** formatacao, ponto e virgula, espaco
4. Escreva titulo imperativo curto (<=72 chars).
5. Se diff > ~30 linhas OU toca multiplo dominio, adicione corpo
   explicando o **por que** (nao o **o que** — o diff ja mostra).

## Output

```
<tipo>(<escopo opcional>): <titulo imperativo>

<corpo opcional: por que da mudanca, links de issue/postmortem>
```

## Regras

- Imperativo: "adiciona" / "remove" / "ajusta", nao "adicionado".
- Sem ponto final no titulo.
- Sem emojis (tom neutro, igual ao corpo da resposta — DEC-026).
- Sem mencao ao agente ("gerado por...", "co-authored by <agente>").
  Imposto pelo check `agent/checks/no-agent-attribution.sh` (gatilho); a
  correcao de raiz e desligar o selo default da ferramenta — ver
  docs/adapters.md ("Atribuicao ao agente em commits").
- Se tiver duvida entre dois tipos, pergunte.

Termine perguntando ao usuario se a mensagem esta boa antes de
executar o `git commit`.
