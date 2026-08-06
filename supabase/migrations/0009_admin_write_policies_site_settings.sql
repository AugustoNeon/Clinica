-- Fase 5 PR3e (issue #20): policy de escrita em `site_settings` para o
-- painel admin. Mesmo padrao de 0005/0006/0007/0008 — sem filtro por
-- usuario (checa so `authenticated`) porque a clinica tem 1 admin so
-- (decisao registrada no CLAUDE.md, Decisoes fechadas, 2026-08-06).
-- Mutations do admin usam o cliente cookie-aware (lib/supabase/server.ts,
-- getSupabaseServerComponentClient), nao o service_role: RLS continua
-- sendo a camada de defesa real.
--
-- Diferenca das entidades anteriores: `site_settings` nao tem tela de
-- criar/excluir no admin (formulario de edicao dos pares chave-valor ja
-- seedados) — so UPDATE e necessario. O `upsert` da camada de dados
-- (lib/data/siteSettings.ts) usa INSERT por baixo quando a chave nao
-- existe ainda, entao INSERT tambem e concedido, mas nao ha UI pra criar
-- chave nova.

create policy "site_settings_admin_write" on site_settings
  for all to authenticated
  using (true)
  with check (true);

-- GRANT de tabela: RLS sozinha nao basta (licao do PR1, issue #16 — tabela
-- criada via SQL puro nao herda o GRANT automatico que o Table Editor do
-- Supabase aplicaria). Sem isso, INSERT/UPDATE falham com "permission
-- denied for table site_settings" antes mesmo de avaliar a policy acima.
grant insert, update on site_settings to authenticated;
