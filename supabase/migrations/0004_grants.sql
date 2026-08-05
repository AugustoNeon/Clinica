-- Fase 5 PR1 (issue #16): GRANTs de tabela. Tabela criada via SQL puro (fora
-- do Table Editor) nao recebe GRANT automatico do Supabase para anon/
-- authenticated — sem GRANT a RLS nem chega a ser avaliada (erro 42501,
-- "permission denied for table", visto ao testar via REST apos 0001-0003).
--
-- anon/authenticated: SELECT nas tabelas de conteudo publico (a policy de
-- RLS de 0002 restringe o que da pra ler dentro disso).
-- service_role: acesso completo em tudo, incluindo contact_leads (dado
-- pessoal) — e o unico papel que le/escreve essa tabela, via
-- lib/supabase/server.ts getSupabaseAdminClient().

grant usage on schema public to anon, authenticated, service_role;

grant select on services, team_members, blog_posts, testimonials, site_settings
  to anon, authenticated;

grant select, insert, update, delete on
  services, team_members, blog_posts, testimonials, contact_leads, site_settings
  to service_role;
