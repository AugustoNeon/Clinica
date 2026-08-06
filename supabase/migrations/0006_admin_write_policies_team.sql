-- Fase 5 PR3b (issue #20): policy de escrita em `team_members` para o painel
-- admin. Mesmo padrao de 0005_admin_write_policies_services.sql — sem filtro
-- por usuario (checa so `authenticated`) porque a clinica tem 1 admin so e
-- nao ha coluna de "dono" no schema (decisao registrada no CLAUDE.md,
-- Decisoes fechadas, 2026-08-06). Mutations do admin usam o cliente
-- cookie-aware (lib/supabase/server.ts, getSupabaseServerComponentClient),
-- nao o service_role: RLS continua sendo a camada de defesa real.

create policy "team_members_admin_write" on team_members
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 — tabela
-- criada via SQL puro nao herda o GRANT automatico que o Table Editor do
-- Supabase aplicaria). Sem isso, INSERT/UPDATE/DELETE falham com
-- "permission denied for table team_members" antes mesmo de avaliar a
-- policy acima.
grant insert, update, delete on team_members to authenticated;
