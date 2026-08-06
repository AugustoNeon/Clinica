-- Fase 5 PR3a (issue #20): policy de escrita em `services` para o painel
-- admin. Sem filtro por usuario (checa so `authenticated`) porque a
-- clinica tem 1 admin so e nao ha coluna de "dono" no schema — decisao
-- registrada no CLAUDE.md (Decisoes fechadas, 2026-08-06). Mutations do
-- admin usam o cliente cookie-aware (lib/supabase/server.ts,
-- getSupabaseServerComponentClient), nao o service_role: RLS continua
-- sendo a camada de defesa real, nao decorativa.

create policy "services_admin_write" on services
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 —
-- tabela criada via SQL puro nao herda o GRANT automatico que o Table
-- Editor do Supabase aplicaria). Sem isso, INSERT/UPDATE/DELETE falham
-- com "permission denied for table services" antes mesmo de avaliar a
-- policy acima.
grant insert, update, delete on services to authenticated;

