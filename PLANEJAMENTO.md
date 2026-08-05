# Planejamento — Site da Clínica Odontológica

Status: **rascunho vivo**, fase de descoberta. Decisões aqui podem mudar
depois das respostas do questionário (`docs/Questionario_Site_Clinica.docx`)
enviado à cliente. Este documento é o plano técnico; o questionário é a
entrada de conteúdo/negócio.

## 1. Objetivo

Construir um site institucional para uma clínica odontológica, com:
- Presença profissional online (páginas institucionais, serviços, equipe)
- Captação de contato/agendamento (formulário + WhatsApp)
- Painel administrativo simples para a cliente manter o conteúdo
  atualizado sem depender de desenvolvedor
- Base sólida em segurança, performance e SEO local

Referência de estrutura/conteúdo usada como ponto de partida:
[livedent.com.br](https://livedent.com.br/) — site de clínica odontológica
com navegação por Home / A Clínica / Especialidades / Serviços /
Profissionais / Blog / Contato, botão fixo de WhatsApp e CTA de
agendamento. O visual final da nossa clínica **não** vai copiar esse site;
a identidade real vem do questionário.

## 2. Por que usar o GDAS neste projeto

Avaliei o GDAS (`GDAs/GDAS` — espelho congelado, doutrina em `docs/`) e
ele se encaixa bem aqui, principalmente por ser seu primeiro projeto
profissional:

- **`/plan` obrigatório antes de código** reduz a chance de eu (o agente)
  sair implementando algo que não foi combinado.
- **`/grill`** força perguntas de esclarecimento quando algo está
  subespecificado — em vez de eu assumir e errar.
- **`verify.sh` + senior-baseline** bloqueiam merge com segredo
  hardcoded, operação destrutiva não intencional, etc. — uma rede de
  segurança automática que você não teria que lembrar de checar
  manualmente.
- **`protect-paths.sh`** protege arquivos críticos (ex.: config de
  produção, migrations aplicadas) de edição acidental.
- **`AGENTS.md`** funciona como contrato vivo do projeto: stack, convenções,
  decisões já fechadas — isso evita que eu "esqueça" decisões entre sessões.

Ponto de atenção: o GDAS em si está congelado (v0.37.9, só leitura) —
vou gerar o bundle de instalação localmente (`gdas dist`, sem commit
dentro do repositório do GDAS) e instalar apenas no repositório
`Clinica`. Nada é escrito ou commitado no repositório do GDAS.

Recomendação: usar, com perfil `node` (a stack proposta abaixo é
JS/TS), adapter `claude`, forge `github`.

## 3. Escopo funcional (proposta inicial, ajusta com o questionário)

Páginas institucionais:
1. Home (hero, chamada para ação, destaques de serviços, prova social)
2. Sobre a clínica
3. Serviços / Especialidades (lista + página própria por serviço, se o
   volume justificar)
4. Equipe (dentistas, CRO, foto, bio)
5. Blog (opcional — depende da resposta sobre interesse/capacidade de
   produzir conteúdo)
6. Depoimentos/Avaliações
7. Contato (formulário + WhatsApp + mapa + horário)
8. Política de Privacidade / Termos (obrigatório por causa de LGPD,
   independente do que a cliente responder)

Painel administrativo (`/admin`, autenticado):
- CRUD de serviços, membros da equipe, posts do blog, depoimentos
- Edição de dados institucionais (endereço, telefone, horário, redes
  sociais)
- Visualização das mensagens recebidas pelo formulário de contato

## 4. Arquitetura técnica proposta

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | SSG/ISR para páginas institucionais (rápido, bom SEO), rotas de API para formulário, um único deploy para site público + painel admin |
| Estilo | Tailwind CSS | Consistência de design system, produtividade, fácil de fazer responsivo |
| Banco de dados | Postgres via Supabase | Traz Auth (login do painel admin) e Storage (fotos da equipe, imagens do blog) prontos, evita construir autenticação do zero — menor risco para um primeiro projeto |
| Autenticação do painel | Supabase Auth (e-mail+senha, 1 ou poucos usuários) | Simples de operar, sem custo extra de manter servidor de sessão |
| Anti-spam no formulário | Cloudflare Turnstile | Gratuito, sem captcha irritante para o paciente |
| Envio de e-mail (notificação de novo contato) | Resend ou Cloudflare Email Routing | Notifica a cliente por e-mail quando alguém preenche o formulário |
| Hospedagem do site | Cloudflare Workers (via `@opennextjs/cloudflare`) | Deploy automático, HTTPS gerenciado, proteção DDoS — mesma proposta de baixa fricção da Vercel. **Escolha original era Vercel** (registro abaixo); trocado em 2026-08-04 porque o plano gratuito da Vercel proíbe uso comercial nos ToS (site de clínica é uso comercial) e o plano gratuito da Cloudflare Workers permite — o adaptador atingiu GA em fev/2026 com suporte completo a App Router/Server Actions/ISR/streaming |
| Imagens | Next/Image + Supabase Storage | Otimização automática de imagem (formato, tamanho, lazy load) |
| CI/CD | GitHub Actions (via forge do GDAS) | Roda `verify` (lint, types, testes) antes de permitir merge |

Alternativa descartada por ora: stack 100% Cloudflare (Workers + D1 + R2,
substituindo TAMBÉM o banco/auth/storage do Supabase). Tecnicamente
viável e mais barata em escala, mas exige montar autenticação e storage
manualmente — mais superfície de erro para o primeiro projeto
profissional. Fica registrado como opção futura se fizer sentido migrar
depois. **Não confundir com a hospedagem** (linha "Hospedagem do site"
acima): Workers como alvo de deploy, mantendo Supabase como banco/auth/
storage, é uma decisão separada e já adotada em 2026-08-04 — trocar só a
camada de hospedagem não reabre esta rejeição, que era especificamente
sobre trocar o banco.

## 5. Modelagem de dados

Implementada em 2026-08-05 (Fase 5 PR1, issue #16) —
`supabase/migrations/0001_schema_inicial.sql` e `0002_rls_policies.sql` são
a fonte de verdade; este bloco é só um espelho legível. Re-verificar com
`ls supabase/migrations/`.

```
services        (id, slug, title, description, long_description, category, image_url, order, published)
team_members    (id, name, role, cro_number, bio, photo_url, order, published)
blog_posts      (id, slug, title, content, cover_image_url, author_id, status, published_at)
testimonials    (id, patient_name, content, rating, photo_url, consent_confirmed, published)
contact_leads   (id, name, phone, email, message, preferred_service, status, created_at, lgpd_consent)
site_settings   (key, value)               -- endereço, telefone, horário, redes sociais
admin_users     (gerenciado pelo Supabase Auth, sem tabela própria de senha)
```

`lgpd_consent` (boolean, `contact_leads`) não estava no rascunho original
desta seção mas já existia em `types/database.ts` — lacuna corrigida aqui
para os dois pararem de divergir (`types/database.ts:88-94` documenta o
porquê: a seção 7 abaixo exige registrar o consentimento, o formulário não
pode perder esse dado).

RLS (leitura pública ampla, sem filtro `published`/`status` na policy —
filtro fica em `lib/data/*`): `services`, `team_members`, `blog_posts`,
`testimonials`, `site_settings`. `contact_leads` não tem nenhuma policy
para `anon`/`authenticated`; só o `service_role` (que ignora RLS) lê e
grava — decisão registrada no AGENTS.md ("Decisões fechadas").

`contact_leads` guarda dado pessoal de paciente em potencial — entra
direto na seção de LGPD abaixo (retenção, consentimento, acesso restrito).
Esquema final fecha depois do questionário (ex.: se vai ter agendamento
online de verdade, isso muda bastante).

## 6. Segurança — checklist que o projeto precisa cobrir

- HTTPS obrigatório em todo o site (garantido pela hospedagem, mas
  validar headers HSTS)
- Cabeçalhos de segurança: CSP, X-Frame-Options, X-Content-Type-Options
- Validação e sanitização de entrada em todo formulário (nome, telefone,
  e-mail, mensagem) — nunca confiar em validação só no cliente
- Proteção contra SQL injection: sempre via query parametrizada/ORM
  (Supabase client já faz isso — não construir SQL por concatenação de
  string em nenhuma hipótese)
- Anti-spam/bot no formulário (Turnstile) + rate limiting nas rotas de API
- Autenticação do painel admin com senha forte; considerar 2FA se o
  Supabase Auth suportar sem complicar demais a cliente
- Segredos (chaves de API, connection string) só em variáveis de
  ambiente — nunca no código; o check `senior-baseline` do GDAS barra
  isso automaticamente
- Backups automáticos do banco (Supabase oferece backup diário no plano
  gratuito/básico — confirmar retenção)
- Dependências: rodar auditoria de vulnerabilidade (`npm audit` ou
  equivalente) como parte do `verify`
- Logs de erro não podem vazar stack trace ou dado sensível para o
  usuário final
- Rate limit e/ou expiração de sessão no painel admin

## 7. LGPD e privacidade

O site coleta dado pessoal (formulário de contato, possivelmente fotos
de pacientes com depoimento) — isso é regulado pela LGPD independente
do tamanho da clínica:

- Política de privacidade publicada, linkada no rodapé e no formulário
- Checkbox de consentimento explícito no formulário de contato
  ("li e concordo com a política de privacidade")
- Consentimento por escrito da cliente antes de publicar foto/depoimento
  de paciente (isso é uma pergunta do questionário, seção 12)
- Política de retenção/exclusão dos dados de `contact_leads` (definir
  prazo, ex.: excluir ou anonimizar após N meses sem contato)
- Acesso aos dados de `contact_leads` restrito ao painel admin
  autenticado, nunca exposto em rota pública

## 8. Fases do projeto

| Fase | Entregável | Depende de |
|---|---|---|
| 0. Descoberta | Este plano + questionário respondido pela cliente | — |
| 1. Setup | Repositório inicializado, GDAS instalado, stack configurada (Next.js, Supabase, CI) | Fase 0 aprovada |
| 2. Modelagem | Schema final do banco + wireframes de baixa fidelidade | Respostas do questionário |
| 3. Design visual | Paleta, tipografia, componentes-base aplicando a identidade da clínica | Fase 2 |
| 4. Desenvolvimento — páginas institucionais | Home, Sobre, Serviços, Equipe, Contato | Fase 3 |
| 5. Desenvolvimento — painel admin | CRUD de conteúdo + autenticação | Fase 4 (pode rodar em paralelo) |
| 6. Conteúdo | Popular o site com textos/fotos reais da clínica | Fase 4/5 + material da cliente |
| 7. Segurança e performance | Checklist da seção 6, auditoria Lighthouse, teste de formulário/spam | Fase 6 |
| 8. Deploy e domínio | Produção, DNS, e-mail institucional, certificado SSL | Fase 7 |
| 9. Testes finais e handoff | Treinamento da cliente no painel admin, documentação de uso | Fase 8 |
| 10. Pós-lançamento | Monitoramento, backups, janela de suporte inicial | Fase 9 |

Nenhuma fase de código começa antes da Fase 1 ser combinada com você.

## 9. Divisão de trabalho Sonnet / Opus

Conforme combinado: conversas de alinhamento, planejamento e decisões
ficam comigo (Sonnet). Quando chegar a hora de implementar (Fases 1 em
diante), a escrita de código roda em subagente com Opus — eu oriento,
reviso e converso com você, o Opus implementa. Isso fica registrado
para as próximas sessões não perderem esse combinado.

## 10. Próximos passos imediatos

1. Você envia `docs/Questionario_Site_Clinica.docx` para a dona da
   clínica.
2. Com as respostas, eu fecho: lista final de páginas, schema de dados,
   identidade visual, se vai ter blog, se precisa integrar sistema de
   agendamento existente.
3. Aí sim: inicializo o repositório Git, instalo o GDAS
   (`gdas init --profile node --adapter claude --forge github`), e
   entramos na Fase 1.

## Decisões em aberto (bloqueadas até resposta da cliente)

- Existe sistema de agendamento/prontuário já em uso que precisa
  integrar? (pergunta 25 do questionário) — muda a arquitetura de
  "site institucional" para "site com integração externa"
- Vai ter blog? (pergunta 22) — muda escopo de conteúdo e frequência de
  publicação
- Volume de serviços/especialidades (pergunta 10) — define se cada
  serviço tem página própria ou se cabe tudo em uma página só
- Identidade visual já existe ou construímos do zero? (pergunta 5)
