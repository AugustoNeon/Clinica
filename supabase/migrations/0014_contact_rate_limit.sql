-- Rate limiting do formulario de contato publico (issue #51).
--
-- Contador por IP com janela deslizante simples: `lib/data/rateLimit.ts`
-- le a linha do hash do IP, reseta se `window_start` for mais velho que a
-- janela, senao incrementa `count` e bloqueia acima do limite. Guarda o
-- HASH do IP (sha-256), nao o IP em texto puro -- bookkeeping de limite,
-- nao precisa do dado bruto, e reduz o que fica exposto se o banco vazar.
--
-- RLS sem NENHUMA policy pra anon/authenticated -- mesmo padrao de
-- contact_leads e google_calendar_tokens: so o service_role (que ignora
-- RLS, mas ainda precisa do GRANT explicito -- licao do PR1/issue #16 e da
-- Fase C/issue #36, migration 0012) le e escreve.

create table if not exists contact_rate_limits (
  ip_hash text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 1
);

alter table contact_rate_limits enable row level security;

grant select, insert, update on contact_rate_limits to service_role;
