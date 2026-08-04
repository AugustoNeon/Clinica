# Checklist do projeto

> Snapshot do estado do projeto por área, feito pelo usuário em 2026-08-04
> e revisado quanto a fatos já conhecidos do repositório. Não é o plano
> (`PLANEJAMENTO.md`) nem o contrato vivo (`AGENTS.md`) — é uma foto do que
> está feito, pendente ou em aberto, organizada por domínio. Vai
> desatualizando com o tempo; revisite antes de confiar cegamente numa
> linha antiga.

## 1. Conteúdo e negócio

* ✅ Questionário da cliente respondido (2026-08-04) — nome, contato, serviços e equipe deixaram de ser placeholder
* ✅ Decidido: equipe = só a Dra. Ariane Vaz Storrer, sem terceiros
* ✅ Decidido: vai ter blog (flag removida, virou escopo fixo)
* ❌ Fotos reais (logo, espaço da clínica, foto da dentista, antes/depois) — é o principal bloqueador do `noindex`
* ❌ Depoimentos de pacientes com `consent_confirmed` — nenhum publicável ainda
* ✅ Sistema de agendamento/prontuário externo: **Clinicorp** — pergunta 25 do questionário já respondida (corrigido: estava como ❓, mas já tem resposta registrada)
* ❓ Volume final de serviços/especialidades — cada um vai ter página própria ou cabe numa lista só?

## 2. Identidade visual

* ❌ Paleta de cores definitiva — hoje é placeholder genérico (preto/branco)
* ❌ Tipografia definitiva — hoje é pilha de fontes do sistema, de propósito (evita dependência de rede no build)
* ❌ Logo
* ❌ Fase 3 do plano ("Design visual") ainda não começou

Isso é esperado nesta fase — mas é o próximo grande gargalo depois das fotos.

## 3. Segurança

* ✅ Arquitetura em camadas força tudo passar por `lib/data/*` (nenhuma página fala direto com banco)
* ✅ `senior-baseline` automático bloqueia: secret hardcoded, query sem LIMIT, log de debug, cast sem schema, operação destrutiva sem confirmação
* ✅ `npm audit --audit-level=high` roda como parte do `verify`
* ⏳ CSP configurada, mas com `'unsafe-inline'` (endurecer com nonce fica pra Fase 7)
* ❌ Cloudflare Turnstile (anti-spam do formulário) — bloqueado até existir domínio/site key
* ❌ Rate limiting nas rotas de API/Server Actions
* ❌ Autenticação do painel admin (Supabase Auth) — painel ainda não existe (Fase 5)
* ❓ 2FA no painel admin — ainda em aberto, decidir se o Supabase Auth suporta sem complicar pra cliente
* ❌ HSTS e demais headers de segurança validados em produção (só faz sentido com domínio real)

## 4. LGPD / Privacidade

* ⏳ Política de privacidade existe como esqueleto, não é texto jurídico válido ainda
* ✅ Regra de código: dado de `contact_leads` nunca é logado, nunca exposto em rota pública
* ✅ Checkbox de consentimento explícito no formulário de contato — já implementado (`components/sections/ContactForm.tsx`, campo `lgpd_consent`, obrigatório, desmarcado por padrão) (corrigido: estava como ❌, mas já existe desde a Fase 1)
* ❌ Consentimento por escrito da cliente para publicar foto/depoimento de paciente
* ❌ Política de retenção/exclusão de `contact_leads` (prazo pra excluir/anonimizar)
* ❓ Revisão jurídica da política de privacidade antes de publicar (recomendo não pular isso — LGPD tem multa real)

## 5. Infraestrutura / Deploy

* ✅ Repositório Git inicializado, GDAS instalado, CI rodando (lint + typecheck + build bloqueia merge)
* ❌ Projeto Supabase provisionado — hoje é 100% mock em memória
* ❌ Domínio registrado
* ✅ Configuração de hospedagem pronta (Cloudflare Workers via `@opennextjs/cloudflare` — `wrangler.jsonc`, build validado localmente)
* ❌ Deploy em produção de fato (depende do domínio existir — Fase 8)
* ❌ Certificado SSL (vem automático com Cloudflare + domínio, mas só depois que existir domínio)
* ❌ E-mail institucional
* ❌ Serviço de notificação de novo lead (Resend ou Cloudflare Email Routing) — hoje o formulário só grava em memória e "some" no restart
* ❌ Backups automáticos do banco (depende do Supabase existir)

## 6. Painel administrativo (Fase 5)

* ❌ Não implementado ainda — é fase posterior, roda em paralelo com Fase 4 quando chegar a hora
* ❌ CRUD de serviços, equipe, blog, depoimentos
* ❌ Edição de dados institucionais (endereço, telefone, horário, redes sociais)
* ❌ Visualização de mensagens do formulário

## 7. SEO / Indexação

* ✅ `robots: noindex` ativo de propósito — correto manter assim enquanto for placeholder
* ❌ Metadados finais (title/description por página) além do que já foi aplicado no layout raiz
* ❌ Sitemap.xml
* ❌ Dados estruturados (schema.org LocalBusiness/Dentist) — bom pra SEO local, ainda não entrou em pauta
* ❌ Auditoria Lighthouse (performance/SEO/acessibilidade) — prevista na Fase 7

## 8. Testes e qualidade

* ❌ Suíte de testes automatizados — declarado como inexistente no `AGENTS.md`, entra "junto com a primeira lógica de negócio real" (Fase 4+)
* ✅ Gate de verificação (`/verify`) cobre lint + typecheck + build + audit
* ❌ Teste de spam/abuso no formulário de contato

## 9. Pós-lançamento (Fase 10)

* ❌ Monitoramento (nenhuma observabilidade ainda — declarado explicitamente como Fase 7)
* ❌ Janela de suporte inicial combinada com a cliente
* ❌ Treinamento da cliente no painel admin

## 10. Ideias em discussão (não fechadas ainda)

Itens levantados em conversa, ainda sem decisão fechada de escopo/prioridade — não fazem parte de nenhuma fase oficial do `PLANEJAMENTO.md` até serem formalizados.

* 💡 Botão de WhatsApp direto no site (link `wa.me`) — baixo custo/esforço, candidato natural a entrar cedo
* 💡 Bot de WhatsApp com respostas prontas (marcar horário, consultar informação, opção de falar com a doutora) — sem IA generativa livre, escopo de menu fixo
* 💡 Integração com Google Calendar da profissional — Fase 1 provável: bot consulta disponibilidade e notifica, dentista confirma manualmente; automação total de escrita no calendário fica pra depois, se o volume justificar
* 💡 Atualização/otimização do perfil no Google Meu Negócio (Maps) — fora do escopo técnico do repo, mas impacta SEO local
