-- Fase B do roadmap de agendamento (issue #35): dias de trabalho da doutora.
-- Tabela nova (nao existia desde a Fase 5 PR1) — diferente das tabelas de
-- 0001, criacao+RLS+GRANT entram juntos num arquivo so aqui, sem "antes" pra
-- separar como aconteceu com services/team_members/etc (0001 -> 0002 -> 0005-9).
--
-- Regra padrao (segunda a sexta) NAO mora aqui: e uma constante em
-- lib/data/scheduleExceptions.ts. Esta tabela guarda so as EXCECOES a essa
-- regra — um dia sem linha aqui segue o padrao.
--
-- Granularidade e o dia inteiro (disponivel/indisponivel), sem horario
-- customizado por excecao (site_settings.opening_hours segue sendo o
-- horario unico e global). Sem policy de leitura pra `anon`: ninguem
-- publico consome isso ainda (Fase C/D, issues #36/#37, ainda nao
-- implementadas) — so o painel admin (`authenticated`) le/escreve.

create table if not exists schedule_exceptions (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_available boolean not null,
  created_at timestamptz not null default now()
);

alter table schedule_exceptions enable row level security;

create policy "schedule_exceptions_admin_read" on schedule_exceptions
  for select to authenticated
  using (true);

create policy "schedule_exceptions_admin_write" on schedule_exceptions
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 — tabela
-- criada via SQL puro nao herda o GRANT automatico que o Table Editor do
-- Supabase aplicaria). Sem isso, toda operacao falha com "permission denied
-- for table schedule_exceptions" antes mesmo de avaliar a policy acima.
grant select, insert, update, delete on schedule_exceptions to authenticated;
