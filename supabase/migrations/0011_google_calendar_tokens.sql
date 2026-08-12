-- Fase C do roadmap de agendamento (issue #36): token OAuth do Google
-- Calendar pessoal da doutora.
--
-- SINGLETON por construcao: `id boolean primary key default true check
-- (id)` garante no maximo 1 linha sempre (so existe 1 clinica, 1 doutora,
-- 1 conta Google -- modelar como tabela com N linhas seria flexibilidade
-- pra requisito que nao existe). `upsert` com `onConflict: "id"` em
-- lib/data/googleCalendar.ts sempre acerta a mesma linha.
--
-- RLS sem NENHUMA policy pra anon/authenticated -- mesmo padrao de
-- contact_leads (0002_rls_policies.sql): este token vale como senha da
-- agenda PESSOAL da doutora, mais sensivel que qualquer conteudo editavel
-- do admin. So o service_role (que ignora RLS) le e escreve. Por isso,
-- sem GRANT pra authenticated tambem -- nao ha policy que autorizaria de
-- qualquer forma.

create table if not exists google_calendar_tokens (
  id boolean primary key default true,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text not null,
  updated_at timestamptz not null default now(),
  constraint google_calendar_tokens_singleton check (id)
);

alter table google_calendar_tokens enable row level security;
