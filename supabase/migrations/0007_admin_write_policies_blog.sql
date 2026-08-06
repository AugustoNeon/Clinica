-- Fase 5 PR3c (issue #20): policy de escrita em `blog_posts` para o painel
-- admin. Mesmo padrao de 0005/0006 — sem filtro por usuario (checa so
-- `authenticated`) porque a clinica tem 1 admin so e nao ha necessidade de
-- restringir por `author_id` (decisao registrada no CLAUDE.md, Decisoes
-- fechadas, 2026-08-06). Mutations do admin usam o cliente cookie-aware
-- (lib/supabase/server.ts, getSupabaseServerComponentClient), nao o
-- service_role: RLS continua sendo a camada de defesa real.

create policy "blog_posts_admin_write" on blog_posts
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 — tabela
-- criada via SQL puro nao herda o GRANT automatico que o Table Editor do
-- Supabase aplicaria). Sem isso, INSERT/UPDATE/DELETE falham com
-- "permission denied for table blog_posts" antes mesmo de avaliar a policy
-- acima.
grant insert, update, delete on blog_posts to authenticated;
