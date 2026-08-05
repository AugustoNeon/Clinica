-- Fase 5 PR1 (issue #16): RLS. Leitura publica ampla (sem filtro de
-- published/status na policy) nas tabelas de conteudo institucional —
-- lib/data/* ja aplica esse filtro em JS hoje e continua aplicando, entao
-- a policy so precisa impedir escrita anonima. contact_leads e a excecao:
-- dado pessoal (LGPD), sem nenhuma policy de leitura/escrita para
-- anon/authenticated — so o service_role (que ignora RLS) le e grava.

alter table services enable row level security;
alter table team_members enable row level security;
alter table blog_posts enable row level security;
alter table testimonials enable row level security;
alter table contact_leads enable row level security;
alter table site_settings enable row level security;

create policy "services_public_read" on services
  for select to anon, authenticated using (true);

create policy "team_members_public_read" on team_members
  for select to anon, authenticated using (true);

create policy "blog_posts_public_read" on blog_posts
  for select to anon, authenticated using (true);

create policy "testimonials_public_read" on testimonials
  for select to anon, authenticated using (true);

create policy "site_settings_public_read" on site_settings
  for select to anon, authenticated using (true);

-- contact_leads: nenhuma policy para anon/authenticated de proposito.
-- Insert do formulario publico e leitura do painel admin passam pelo
-- service_role (lib/supabase/server.ts, getSupabaseAdminClient), que
-- ignora RLS por padrao no Supabase.
