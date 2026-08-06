-- Fase 5 PR3d (issue #20): policy de escrita em `testimonials` para o
-- painel admin. Mesmo padrao de 0005/0006/0007 — sem filtro por usuario
-- (checa so `authenticated`) porque a clinica tem 1 admin so (decisao
-- registrada no CLAUDE.md, Decisoes fechadas, 2026-08-06). Mutations do
-- admin usam o cliente cookie-aware (lib/supabase/server.ts,
-- getSupabaseServerComponentClient), nao o service_role: RLS continua
-- sendo a camada de defesa real.
--
-- LGPD: esta policy NAO substitui o filtro de `consent_confirmed` em
-- lib/data/testimonials.ts (getTestimonials) — aquele filtro protege a
-- rota publica; esta policy so autoriza quem pode ESCREVER no admin.

create policy "testimonials_admin_write" on testimonials
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 — tabela
-- criada via SQL puro nao herda o GRANT automatico que o Table Editor do
-- Supabase aplicaria). Sem isso, INSERT/UPDATE/DELETE falham com
-- "permission denied for table testimonials" antes mesmo de avaliar a
-- policy acima.
grant insert, update, delete on testimonials to authenticated;
