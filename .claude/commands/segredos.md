---
description: Inventaria os segredos do projeto, escolhe o tier de armazenamento de cada um, garante zero literal em config commitada e gera .env.example com placeholders.
output: "Tabela segredo->tier + .env.example com placeholders + bloco para AGENTS.md 'Como rodar'. Confirmacao de zero literal em config commitada. Max 12 linhas."
quando-nao-usar: NÃO use para permissões de comandos/paths do agente — isso é agent/policy.json; este fluxo trata segredos e cofre.
---

# /segredos

Voce vai definir onde cada segredo do projeto mora, sem nunca colocar valor
literal no repositorio. Segredo = chave, token, senha, string de conexao ou
credencial de MCP.

## Processo

1. **Inventariar** os segredos (rodar local, prod, CI, MCP). Nomeie cada um em
   `UPPER_SNAKE` com prefixo de dominio (`STRIPE_API_KEY`, `GDAS_RELEASE_TOKEN`).
2. **Escolher o tier por segredo:**
   - Dev local: valor real em `.env` (gitignorado, modo `600`) ou `~/.config/<app>/`.
   - Runtime/prod: variavel de ambiente do orquestrador — nunca em imagem/Dockerfile.
   - CI/CD: secret manager nativo do forge; o workflow referencia por nome.
   - Ferramenta pessoal: `~/.config/<tool>/*.env`, modo `600`, fora do repo.
3. **MCP -> keychain:** a chave/token de um servidor MCP vive no keychain do SO
   (ou secret manager). A config MCP — commitada ou nao — referencia a credencial
   **por nome/lookup**, nunca o valor literal. Sem keychain, fallback e env var
   (`${MCP_TOKEN}`).
4. **Gerar `.env.example`** com uma linha por variavel: `NOME=` + placeholder obvio
   (`<defina-aqui>`), nunca valor que pareca real.
5. **Garantir zero literal** em config commitada (MCP incluso): busque valor entre
   aspas com 6+ chars apos `token`/`authorization`/`api_key`/`bearer`. Se achar,
   mova para o tier certo e referencie.
6. **Registrar** em AGENTS.md, secao "Como rodar": quais variaveis o projeto espera,
   de onde vem e como popular o `.env` a partir do exemplo.

## Output esperado

```
Segredos:
  NOME_DO_SEGREDO   -> tier (dev/.env | prod/env | ci/secret | mcp/keychain)
.env.example:        gerado / atualizado (N variaveis, placeholders)
Config commitada:    zero literal confirmado / movido <quais>
AGENTS.md:           bloco "Como rodar" atualizado
```

## Regras

- Nunca escreva valor real de segredo no repo, nem "default dev" plausivel.
- Config MCP commitada referencia credencial por nome/lookup, nunca o token.
- `.env` real e gitignorado e modo `600`; so o `.env.example` e versionado.
- Segredo vazado se revoga e rotaciona — nunca reescreva o historico do git.
- Nome em `UPPER_SNAKE` com prefixo de dominio, igual no exemplo e no lookup.
