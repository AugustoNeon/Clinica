# clinica-site

Site institucional de clínica odontológica. **Fases 1–5 concluídas** —
Supabase real (não mock), páginas institucionais com conteúdo real, painel
admin autenticado em `/admin`. Em produção na Cloudflare Workers:
https://clinica-site.augustoneonvazryba.workers.dev. Fase 6 (imagens) segue
parcial — logo e foto da equipe aplicados, fotos de espaço físico e
antes/depois pendentes/pausadas. Roadmap de agendamento (painel define dias
de trabalho → Google Calendar → formulário no site) em andamento.

- Plano técnico completo: [`PLANEJAMENTO.md`](PLANEJAMENTO.md)
- Contrato de trabalho do repositório (stack, convenções, paths críticos):
  [`AGENTS.md`](AGENTS.md) — Claude Code lê a cópia idêntica [`CLAUDE.md`](CLAUDE.md)

## Estado atual — leia antes de mexer

- **A maior parte do conteúdo é real** (nome da clínica, endereço, telefone,
  serviços, tagline, mapa, convênio). Alguns campos seguem placeholder porque
  a cliente ainda não enviou o material (bio da equipe, fotos de espaço
  físico, antes/depois) — nesses casos o campo continua explicitamente
  rotulado como placeholder, nunca inventado.
- **O banco é Supabase real**, não mock. `lib/data/*` consulta
  `rjqeideajodwacumfiel.supabase.co` via `lib/supabase/*`; o schema vive em
  `supabase/migrations/`.
- **O formulário de contato grava em `contact_leads`** (Supabase) e aparece
  em `/admin/leads`. Dado pessoal: nunca logado, nunca exposto em rota
  pública.
- **`/admin` é autenticado** (Supabase Auth) e tem CRUD para serviços,
  equipe, blog, depoimentos, configurações do site e listagem de leads.
- **O site está `noindex`** enquanto Fase 6 (fotos) não fechar.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` **exige** `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` — as páginas
estáticas consultam o Supabase real durante o build. `npm run lint`/
`npm run typecheck` seguem passando sem nenhuma variável. O contrato
completo de variáveis (Turnstile, e-mail) está em
[`.env.example`](.env.example) — copie para `.env.local` (gitignorado).

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
lib/data/            camada de dados — 1 arquivo por entidade; consulta Supabase real
lib/validation/      schemas Zod, compartilhados entre cliente e servidor
lib/supabase/        clientes centralizados (servidor, browser, admin)
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
- Fase 6 (imagens): fotos de espaço físico ainda não chegaram; antes/depois
  pausado a pedido da cliente até o fim do projeto.
- Domínio próprio: site segue em `*.workers.dev`, sem DNS/domínio decidido.
