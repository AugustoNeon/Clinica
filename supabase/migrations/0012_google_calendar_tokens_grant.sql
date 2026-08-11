-- Fase C (issue #36): conserta GRANT ausente em google_calendar_tokens
-- (0011). Mesma licao do PR1/issue #16: tabela criada via SQL puro nao
-- herda GRANT automatico do Table Editor do Supabase -- vale pra QUALQUER
-- role, inclusive `service_role` (BYPASSRLS pula a checagem de policy de
-- row-level security, mas nao pula o GRANT de tabela, que e uma camada
-- independente do Postgres). Sem GRANT explicito, ate o service_role
-- recebe "permission denied for table" antes de chegar na RLS.
--
-- Sem `delete`: `lib/data/googleCalendar.ts` so faz upsert (id fixo), a
-- linha singleton nunca e apagada pelo app.

grant select, insert, update on google_calendar_tokens to service_role;
