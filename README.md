# clinica-site

Site institucional de clínica odontológica. **Fase 1 (Setup)** — esqueleto
técnico no ar, conteúdo ainda 100% placeholder.

- Plano técnico completo: [`PLANEJAMENTO.md`](PLANEJAMENTO.md)
- Contrato de trabalho do repositório (stack, convenções, paths críticos):
  [`AGENTS.md`](AGENTS.md)

## Estado atual — leia antes de mexer

- **Nada aqui é conteúdo real.** Nome da clínica, serviços, equipe, endereço
  e telefone são placeholders explicitamente rotulados, à espera das respostas
  do questionário enviado à cliente (`docs/`). Não substituir por texto
  "plausível": ou é material enviado pela clínica, ou continua placeholder.
- **Não existe banco de dados.** `lib/data/*` devolve arrays em memória com a
  mesma assinatura assíncrona que as queries do Supabase terão. Trocar mock
  por integração real é editar só esses arquivos.
- **O formulário de contato não notifica ninguém.** A Server Action valida e
  grava em memória; a mensagem some no próximo restart.
- **O site está `noindex`** enquanto for placeholder.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

Nenhuma variável de ambiente é necessária para rodar, buildar ou lintar.
Isso é intencional: se `npm run build` passar a exigir segredo, é regressão.
O contrato de variáveis futuras está em [`.env.example`](.env.example) —
copie para `.env.local` (gitignorado) quando as integrações entrarem.

## Verificação

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # build de produção
npm run verify     # os três acima, em sequência
```

CI em `.github/workflows/`: `ci.yml` (lint + typecheck + build, bloqueia) e
`gdas-advisory.yml` (checks de governança do GDAS, advisory).

## Estrutura

```
app/                 rotas do App Router (casca de página)
  contato/actions.ts Server Action do formulário
components/ui/       primitivos de interface
components/sections/ blocos de página
components/layout/   header e footer
lib/data/            camada de dados — 1 arquivo por entidade (hoje mock)
lib/validation/      schemas Zod, compartilhados entre cliente e servidor
lib/supabase/        clientes centralizados (existem, ainda não ligados)
lib/config/          flags de escopo em aberto + navegação
types/               interfaces do schema (PLANEJAMENTO.md §5)
agent/               artefatos do GDAS (playbooks, checks, policy)
```

Regra que sustenta a arquitetura: **página e componente nunca falam com o
banco** — só chamam `lib/data/*`.

## Pendências conhecidas

- Turnstile no formulário: sem site key até o domínio existir.
- Rate limiting da Server Action: precisa entrar na camada de borda.
- CSP com `'unsafe-inline'`: endurecer com nonce na Fase 7.
- Política de privacidade é esqueleto, **não** texto jurídico válido.
- Painel administrativo (`/admin`) e autenticação: Fase 5.
