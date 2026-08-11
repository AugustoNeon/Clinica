-- Issue #37 revisada: calendario nativo de consultas + cadastro de
-- pacientes no admin. Substitui o plano original (formulario publico +
-- Google Calendar, Fase C/#36) por um CRUD interno -- sem dependencia
-- externa, sem consumidor publico.
--
-- RLS so `authenticated` (sem policy `anon`) -- mesmo padrao de
-- schedule_exceptions (0010, Fase B), nao o padrao de services/team_members
-- (que tem leitura publica). Nenhuma das duas tabelas tem consumidor
-- publico.

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  -- on delete set null: remover um servico do catalogo nao deve apagar
  -- historico de consulta, so soltar a referencia.
  service_id uuid references services (id) on delete set null,
  date date not null,
  time time not null,
  status text not null default 'confirmada'
    check (status in ('confirmada', 'cancelada', 'concluida')),
  notes text,
  created_at timestamptz not null default now()
);

-- Indice unico PARCIAL: (date, time) so precisa ser unico entre consultas
-- ATIVAS (nao canceladas) -- uma consulta cancelada libera o horario de
-- novo pra outra. Garantia de verdade no banco, nao so na aplicacao
-- (decisao do /plan: reforco em duas camadas).
create unique index appointments_active_slot_unique
  on appointments (date, time)
  where status <> 'cancelada';

alter table patients enable row level security;
alter table appointments enable row level security;

create policy "patients_admin_all" on patients
  for all to authenticated
  using (true)
  with check (true);

create policy "appointments_admin_all" on appointments
  for all to authenticated
  using (true)
  with check (true);

-- GRANT explicito: RLS sozinha nao basta (licao recorrente desde a Fase 5,
-- issue #16 -- tabela criada via SQL puro nao herda o GRANT automatico do
-- Table Editor do Supabase).
grant select, insert, update, delete on patients to authenticated;
grant select, insert, update, delete on appointments to authenticated;
