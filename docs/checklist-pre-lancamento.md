# Checklist de pré-lançamento

> Verificação geral feita em 2026-09-18 (issue #65, PR #66), com o site já
> no ar em `clinica-site.augustoneonvazryba.workers.dev` e indexável desde
> 2026-08-12 (#52). Diferente do `checklist-projeto.md` (foto do projeto
> por área), este é a lista do que precisa estar verde **antes de divulgar
> o endereço** para pacientes. ✅ feito · ⏳ parcial · ❌ pendente (dono
> entre parênteses).

## 1. Achado crítico da rodada

- ✅ **Site caiu inteiro com o banco pausado.** Em 2026-09-18 o projeto
  Supabase (plano gratuito) estava pausado por inatividade — o DNS
  `rjqeideajodwacumfiel.supabase.co` nem resolvia — e **todas** as páginas
  de produção devolviam 500 com a tela crua do Next ("This page couldn't
  load"). O usuário restaurou o projeto pelo Dashboard e o site voltou
  sozinho, sem redeploy. Mitigações aplicadas nesta rodada:
  - workflow `supabase-keepalive` (query mínima a cada 3 dias);
  - header/footer com fallback quando `site_settings` falha;
  - `error.tsx`/`global-error.tsx` com a marca e código do erro.
- ❌ **Eliminar o risco de vez** (usuário): ou Supabase Pro (não pausa), ou
  cache incremental R2 no OpenNext (`wrangler.jsonc` + `open-next.config.ts`)
  para as páginas estáticas serem servidas do cache mesmo com o banco fora —
  hoje o build marca todas as públicas como `○ Static`, mas em produção
  elas foram re-renderizadas sob demanda (por isso o 500). Cabe na #54.
- ⏳ O cron do GitHub é desativado após 60 dias sem commit no repositório —
  se o projeto ficar parado, reativar em Actions (ou trocar por Cloudflare
  Cron Trigger no próprio Worker).

## 2. Feito nesta rodada (código)

- ✅ Redesign de todas as páginas públicas (ver PR #66).
- ✅ Header fixo + menu mobile; rodapé completo com CRO condicional.
- ✅ 404, `error.tsx`, `global-error.tsx`.
- ✅ `sitemap.xml` (páginas + serviços + posts), `robots.txt` (noindex
  `/admin`), `manifest`, favicon/apple-touch, Open Graph/Twitter image,
  `metadataBase`, canonical em serviço/post, JSON-LD `Dentist`.
- ✅ Skip link, `aria-current`, foco visível, `prefers-reduced-motion`
  em toda animação, contraste dos pares do `DESIGN.md` mantido.
- ✅ `/blog/[slug]` (antes nenhum post abria).
- ✅ Aviso stale em `/contato` removido (e-mail e Turnstile já existem).
- ✅ `npm run verify` verde; 19 testes (3 arquivos).
- ✅ Painel admin redesenhado (PR #68, issue #67): shell próprio, início com
  pendências calculadas do banco, exclusão com confirmação em dois passos,
  formulários com dicas e labels ligados. As pendências da seção 3 aparecem
  para a doutora na tela inicial do painel.

## 2b. QA completo (issue #69, 2026-09-18)

Rodado no servidor local com o banco de produção, registros de teste
criados e removidos ao final.

- ✅ **Links:** rastreador percorreu 25 páginas internas (todas 200) e
  38 links externos (WhatsApp com mensagem, `tel:`, `mailto:`, mapa,
  Instagram) — zero quebrados, formatos válidos.
- ✅ **Responsividade:** nenhuma página pública ou do painel com overflow
  horizontal a 375px; tablet (768px) e desktop (1360px) conferidos.
- ✅ **Site:** menu mobile, FAQ, link "pular para o conteúdo", validação do
  formulário de contato (4 erros, foco no primeiro campo) e envio real
  (lead de teste marcado como descartado depois).
- ✅ **Painel:** troca de status de mensagem; criar/editar/excluir serviço;
  criar/excluir post e depoimento; salvar configurações; criar paciente →
  marcar consulta (paciente pré-selecionado) → cancelar → excluir consulta
  → excluir paciente (tela de confirmação); marcar/desfazer folga na
  agenda. Confirmação em dois passos em todas as exclusões.
- ✅ **Correções feitas:** acentuação em todas as mensagens de validação e
  de ação; alvos de toque ≥24px em rodapé, ficha prática, contato e faixa
  final; 404 próprio do painel; foco no primeiro erro do contato;
  `prefetch={false}` na barra do painel.
- ⏳ **Sessão do painel caiu 2 vezes em ~1h de uso contínuo.** Hipótese:
  o JWT do Supabase expira em 1 h e os 11 prefetches da barra lateral
  disputavam a renovação no middleware (corrigido com `prefetch={false}`).
  Se voltar a acontecer: Supabase Dashboard → Authentication → Sessions →
  aumentar o "JWT expiry" (ex.: 8 h). O timeout próprio de 30 min de
  inatividade continua valendo.
- ❌ Não testado por depender de dispositivo/conta: ativar MFA (precisa do
  celular), conectar Google Calendar (já conectado), envio de e-mail de
  lead (Resend só em produção), Turnstile (só em produção).

## 3. Antes de divulgar — conteúdo (doutora / usuário)

- ❌ **CRO** da Dra. Ariane no admin (`/admin/equipe`) — obrigatório na
  divulgação de profissional (CFO). Hoje a página da equipe mostra o
  aviso de placeholder no lugar.
- ❌ **Bio** real da doutora (mesma tela). Enquanto for placeholder, o site
  usa o texto institucional genérico com aviso.
- ❌ **Depoimentos**: os 2 do banco são exemplos rotulados. Despublicar em
  `/admin/depoimentos` ou substituir por reais **com consentimento por
  escrito** (LGPD).
- ❌ **Blog**: "Post Exemplo 1" é placeholder publicado. Despublicar ou
  escrever o primeiro post real em `/admin/blog`.
- ❌ **Fotos do espaço** (fachada, recepção, consultório) — issue #10. O
  `/sobre` tem 3 espaços reservados e rotulados.
- ⏳ Categorias dos serviços: o agrupamento de `/servicos` é feito no
  código por slug (`lib/config/services.ts`). Serviço novo cai em
  "Outras especialidades" até ganhar grupo.
- ⏳ Revisar os textos genéricos (FAQ, passos da primeira consulta,
  valores em `/sobre`) com a doutora — são conhecimento padrão da área,
  mas ela é quem assina.

## 4. Antes de divulgar — segurança e LGPD

- ❌ **Ativar o MFA** na conta admin (`/admin/seguranca`, com o celular) —
  implementado na #47, ainda desligado.
- ❌ **Trocar a senha fraca** do admin (decisão aceita em 2026-08-05, mas
  o painel guarda dado de paciente).
- ❌ E-mail dedicado do titular LGPD (#63) e exclusão automática de leads
  após 12 meses (#64).
- ⏳ Revisão jurídica da política de privacidade (recomendada na #48).
- ✅ Cabeçalhos de segurança (CSP, HSTS, etc.) já configurados em
  `next.config.ts`; validar em produção com
  `curl -sI https://<dominio>/ | grep -iE "strict|content-security"`.

## 5. Infra e domínio (#54)

- ❌ Domínio próprio + DNS no Cloudflare; depois setar
  `NEXT_PUBLIC_SITE_URL` no Worker (sitemap/OG/canonical seguem sozinhos).
- ❌ Confirmar retenção de backup do Supabase (free = sem PITR).
- ❌ Observabilidade mínima: Cloudflare Workers logs/analytics ligados;
  alerta de uptime externo (ex.: UptimeRobot no `/`) — teria pego a
  queda de setembro no primeiro dia.
- ❌ Google Search Console (enviar `sitemap.xml`) e Perfil da Empresa no
  Google (o `maps_embed_url` já aponta para o consultório).
- ❌ Instagram: o link do rodapé usa `instagram_url` de `site_settings`
  — confirmar que o perfil está público.

## 6. Testes manuais em produção (após deploy do PR #66)

- [ ] Abrir todas as páginas do sitemap num celular real (Android e iPhone).
- [ ] Enviar um lead real pelo formulário: cai em `/admin/leads` **e** o
  e-mail chega (Resend) — Turnstile aparece se a site key estiver setada
  no Worker.
- [ ] Botões de WhatsApp abrem a conversa com a mensagem pré-preenchida.
- [ ] Compartilhar o link no WhatsApp/Instagram: preview mostra a imagem
  azul com o logo (Open Graph).
- [ ] Lighthouse (Chrome DevTools) na Home: mirar ≥90 em Performance,
  Acessibilidade, Boas práticas e SEO; anotar o resultado aqui.
- [ ] Ativar "reduzir movimento" no SO: nenhuma animação, tudo visível.
- [ ] Simular banco fora (pausar o projeto de teste, se houver): header,
  rodapé e a tela de erro com a marca aparecem em vez do 500 cru.
