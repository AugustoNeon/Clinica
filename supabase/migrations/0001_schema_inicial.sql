-- Fase 5 PR1 (issue #16): schema inicial, espelhando types/database.ts.
-- Nomes de coluna em snake_case combinam com os tipos TypeScript de
-- proposito: lib/data/* troca de mock para query real sem mudar consumidor.

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  long_description text,
  category text,
  image_url text,
  "order" integer not null default 0,
  published boolean not null default false
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  cro_number text,
  bio text not null,
  photo_url text,
  "order" integer not null default 0,
  published boolean not null default false
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  cover_image_url text,
  author_id uuid references auth.users (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  content text not null,
  rating integer not null check (rating between 1 and 5),
  photo_url text,
  consent_confirmed boolean not null default false,
  published boolean not null default false
);

-- Dado pessoal de paciente em potencial (LGPD) — RLS em 0002 restringe
-- leitura a service_role; nunca exposto em rota publica.
create table if not exists contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  preferred_service text,
  status text not null default 'novo'
    check (status in ('novo', 'em_atendimento', 'concluido', 'descartado')),
  created_at timestamptz not null default now(),
  lgpd_consent boolean not null
);

create table if not exists site_settings (
  key text primary key,
  value text not null
);
