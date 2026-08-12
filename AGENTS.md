# AGENTS.md

> Contrato vivo do repositório. Lido como contexto pelo agente em
> toda sessão (nativamente ou apontado no início). Cresce com PRs.
> Mantenha enxuto (2–4k tokens) e atual.

## Sobre o projeto

**clinica-site** — site institucional de uma clínica odontológica: páginas
públicas (serviços, equipe, contato) e, em fase posterior, um painel admin
para a cliente manter o conteúdo sozinha. Plano técnico completo em
`PLANEJAMENTO.md`; conteúdo/negócio vêm do questionário em `docs/`.

**Fase atual: 4 e 5 concluídas. Fase 5 (painel admin) fechou a issue #20
em 2026-08-06 — PR1 (#16), PR2 (#18) e as 6 fatias do PR3 (#20: serviços,
equipe, blog, depoimentos, site_settings, leads) todas mergeadas.**
`lib/data/*` chama o Supabase existente (`rjqeideajodwacumfiel.supabase.co`)
via `lib/supabase/server.ts` desde 2026-08-05 (PR1); deixou de ser mock em
memória. O conteúdo servido é o mesmo de antes (nome, endereço, telefone,
serviços, tagline, mapa, convênio, formas de pagamento), só a fonte mudou —
ver `supabase/migrations/0003_seed_conteudo_real.sql` para a proveniência.
Alguns campos seguem placeholder porque a cliente não enviou (bio da
equipe, fotos de espaço físico, antes/depois — ver demanda #10) — nesses
casos o campo continua explicitamente marcado como placeholder, nunca
inventado. `/admin` protegido por Supabase Auth desde 2026-08-05 (PR2,
issue #18): login funcional, sessão via cookie (`@supabase/ssr`,
`middleware.ts` — convenção legada aceita de propósito, ver Decisões
fechadas). CRUD completo no admin para as 5 entidades de conteúdo público
(serviços, equipe, blog, depoimentos) via RLS `authenticated` (não
`service_role`) + migration própria por entidade (`0005`–`0008`);
`site_settings` (`/admin/configuracoes`, migration `0009`) é edição dos
pares chave-valor num formulário único, sem criar/excluir; `leads`
(`/admin/leads`) é listagem read-only com status editável, usando
`service_role` (não RLS `authenticated`) porque `contact_leads` é dado
pessoal sem policy nenhuma para `authenticated` — única entidade do PR3
sem migration nova. Paleta, tipografia e logo aplicados nos componentes
(Fase 3, demandas #8/#11); Home, Sobre, Serviços (com página por
serviço), Equipe e Contato estruturados (Fase 4, demanda #13). **Fase 6
(conteúdo real de imagem) parcial desde 2026-08-10:** logo e foto real da
Dra. Ariane já aplicados (PR #30); antes/depois foi tentado, revertido a
pedido do usuário e **pausado até o fim do projeto** (não retomar
sozinho); fotos de espaço físico ainda não chegaram — issue #10
continua aberta e é o único bloqueador dessa fase. **Roadmap de
agendamento em andamento desde 2026-08-10** (fatiado em Fase 0–D, issues
#33–#37): Fase 0 (nav do admin, #33), Fase A (CTA WhatsApp, #34) e Fase B
(#35, admin define dias de trabalho — tela `/admin/agenda`, tabela
`schedule_exceptions`) concluídas (PRs #38/#39/#42); Fase C (#36, Google
Calendar OAuth) é a próxima, ainda não iniciada; Fase D (#37, formulário
de agendamento no site) depende da C.

## Stack

- **Linguagem:** TypeScript 5
- **Framework HTTP:** Next.js 16 (App Router) — Server Components + Server Actions
- **Banco:** Postgres via Supabase — provisionado; `lib/data/*` consulta direto (Fase 5 PR1, issue #16)
- **Frontend:** React 19 + Tailwind CSS 4
- **Validação:** Zod 4 (`lib/validation/`), schema único para cliente e servidor
- **Deploy:** Cloudflare Workers via `@opennextjs/cloudflare` (`wrangler.jsonc`/
  `open-next.config.ts`) — única hospedagem real desde 2026-08-10, no ar em
  https://clinica-site.augustoneonvazryba.workers.dev; a Vercel (hospedagem
  anterior) foi apagada nessa mesma data, ver Decisões fechadas
- **Observabilidade:** nenhuma ainda — entra na Fase 7

## Como rodar localmente

```bash
npm install         # primeira vez
npm run dev         # servidor de desenvolvimento
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # build de produção
npm run test        # vitest (suíte de testes)
npm run verify      # lint + typecheck + test + build
```

Vars obrigatórias em `.env.local` desde 2026-08-05 (Fase 5 PR1, issue #16):
**`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`**. `npm run build` passa por elas porque
`/servicos/[slug]` (e as outras páginas que leem `lib/data/*`) são geradas
estaticamente e agora consultam o Supabase real durante o build — deixou de
ser mock em memória. Isso substitui a garantia antiga ("build sem nenhuma
env var" — válida até a Fase 4). `npm run lint`/`npm run typecheck` seguem
passando sem nenhuma variável. O contrato completo de variáveis (Turnstile,
e-mail) está em `.env.example`.

## Comandos

Chaves canônicas lidas pelo gate de verificação (`agent/skills/gdas-verificar`).
Declare só o que existe: chave ausente vira SKIP explícito na evidência —
a lacuna é dado, não silêncio. Números (ex.: alvo de cobertura) moram
aqui, nunca na skill.

```
build: npm run build
lint: npm run lint && npm run typecheck
test: npm run test
security: npm audit --audit-level=high
schema-fingerprint: ls supabase/migrations/
```

`test` deixou de ser SKIP em 2026-08-12 (issue #50): primeira suíte real
do projeto (Vitest), cobrindo a regra de conflito de horário de
`appointments` (`lib/data/appointments.test.ts`) — cliente Supabase
mockado de propósito, não existe banco de teste separado do de produção.
Chaves ausentes (`regressao`, `coverage-target`, `suite-dir`,
`sentinelas`, `isolamento`, `conta-testes`, `conta-executados`) seguem
SKIP explícito: a suíte existe mas ainda é de 1 arquivo, sem meta de
cobertura nem convenção de regressão formal — cresce conforme mais
lógica de negócio real aparecer. `schema-fingerprint` deixou de ser SKIP
em 2026-08-05 (Fase 5 PR1, issue #16): o schema agora existe como
migrations versionadas em `supabase/migrations/`. A lacuna é dado, não
silêncio.

As seis últimas chaves são as **invariantes de ambiente** da fase de
integridade do gate (isolamento estrutural da verificação): capturadas
antes da suíte e re-verificadas depois. Invariante declarada que não pode
ser verificada = FAIL da fase, nunca SKIP.

## Validação documental (opcional — modo declarado; sem esta seção = desativada)

Modo deste repo: `desativada` — proporcional à
cerimônia (trivial = desativada; padrão = local ou externa; alto blast
radius = externa). `desativada` é declaração honesta de que gate + audit
+ revisão humana bastam — passo extra sem consumidor é sprawl.

| Papel | Modo | Executor |
|---|---|---|
| valida-spec (pré-execução) | desativada | — |
| valida-doc (pós-execução) | desativada | — |

Regras: um executor por papel por rodada; veredito no formato
`comentario-veredito-v1` (sem evidência = inválido); mover label do papel
= remover a antiga + aplicar a nova no mesmo ato.

## Proveniência e manutenção

Fato volátil deste contrato carrega **data** e um **comando de
re-verificação de 1 linha** — o artefato nomeia o gatilho do próprio
refresh, em vez de envelhecer em silêncio. Ao editar uma seção volátil,
atualize a linha correspondente; ao ler uma linha com data antiga, rode o
comando antes de confiar no fato.

| fato volátil | verificado em | como re-verificar (1 linha) |
|---|---|---|
| Stack e versões | 2026-08-03 | `node --version && npm ls next react typescript --depth=0` |
| Comandos (build/lint) | 2026-08-03 | `npm run verify` |
| Paths críticos | 2026-08-03 | `ls lib/supabase lib/validation app/contato/actions.ts next.config.ts` |
| Vars obrigatórias | 2026-08-05 | `npm run build` sem `.env.local` (deve falhar pedindo as 3 vars Supabase) |
| Deploy (Cloudflare, não Vercel) | 2026-08-10 | `grep -c '"deploy"' package.json && test -f wrangler.jsonc && test ! -f vercel.json && echo ok` |

## Estrutura

Arquitetura **em camadas** (decisão fechada — não é hexagonal). A regra que
sustenta tudo: **página e componente nunca falam com o banco**; só chamam
`lib/data/*`. Trocar mock por Supabase é editar `lib/data/*` e nada mais.

```
app/                    # rotas — só casca de página, conteúdo placeholder marcado
├── page.tsx            #   Home
├── sobre|servicos|equipe|blog|contato|privacidade/
└── contato/actions.ts  # PATH CRÍTICO — Server Action do formulário (entrada pública)
components/ui/          # primitivos (Button, Card, Container, Section)
components/sections/    # blocos de página (Hero, ServiceList, TeamGrid, ContactForm)
components/layout/      # SiteHeader, SiteFooter
lib/data/               # PATH CRÍTICO — 1 arquivo por entidade; consulta Supabase real (Fase 5 PR1)
lib/validation/         # PATH CRÍTICO — schemas Zod, compartilhados cliente+servidor
lib/supabase/           # PATH CRÍTICO — clientes centralizados (ainda não ligados)
lib/config/             # features.ts (escopo em aberto) + navigation.ts
types/                  # interfaces espelhando o schema de PLANEJAMENTO.md §5
```

**Paths críticos:** `lib/supabase/` (segredos e RLS), `lib/validation/`
(barreira de entrada), `lib/data/` (acesso a dado pessoal),
`app/contato/actions.ts` (endpoint público) e `next.config.ts` (cabeçalhos de
segurança). Nunca tocar sem revisão dedicada. O check
`agent/checks/protect-paths.sh` reforça isso em pré-edição.

## Regras de conteúdo (enquanto o questionário não volta)

- **Não inventar dado de clínica.** Nome, endereço, telefone, razão social,
  serviço, nome/CRO/bio de dentista: sem resposta da cliente, é placeholder
  explicitamente rotulado (`"... (placeholder)"`), nunca um texto plausível.
- **Exceção (2026-08-05):** descrição *genérica de especialidade odontológica*
  (o que é Ortodontia, Endodontia, Implantodontia…) **não** é "dado de clínica"
  para efeito da regra acima — é conhecimento padrão da área, do jeito que
  qualquer site odontológico descreve, e foi autorizada pela doutora. O limite
  segue valendo: nada específico desta clínica, nenhuma estatística, prazo,
  preço ou promessa de resultado. Ver `Service.long_description`.
- Todo bloco de conteúdo provisório carrega `<PlaceholderNotice>` visível.
- Indexação liberada desde 2026-08-12 (issue #52) — decisão do usuário de
  não esperar as fotos pendentes (#10). `/admin` continua `noindex`
  (override próprio em `app/admin/layout.tsx`).
- Depoimento de paciente só é publicável com `consent_confirmed` — a função
  `getTestimonials()` filtra por isso, não confia em lembrança de ninguém.
- Dado de `contact_leads` é dado pessoal: **nunca logar** nome, telefone,
  e-mail ou mensagem; nunca expor listagem em rota pública.
- **Mesma regra vale pra `patients`/`appointments`** (issue #37 revisada,
  2026-08-12): **nunca logar** nome, telefone, e-mail ou observações do
  paciente/consulta. Diferente de `contact_leads`, essas duas têm RLS
  `authenticated` (não `service_role`) e nenhuma tem consumidor público.

## Vocabulário de domínio

<!-- Ubiquitous Language: termos com significado preciso neste projeto. -->

| Termo | Significado neste projeto | Não confundir com |
|-------|---------------------------|-------------------|
| **lead** | Registro em `contact_leads`: alguém que preencheu o formulário. Dado pessoal. | paciente (quem já é atendido pela clínica) |
| **paciente** | Registro em `patients` (issue #37 revisada): pessoa cadastrada pela doutora no admin, atendida ou a ser atendida pela clínica. Dado pessoal. | lead (contato ainda não confirmado, vindo do formulário público) |
| **consulta** | Registro em `appointments` (issue #37 revisada): compromisso marcado pela doutora, vinculado a um paciente, com data/hora/status. | lead; dia de trabalho (`schedule_exceptions`, que é regra de disponibilidade, não compromisso marcado) |
| **serviço** | Linha de `services` — procedimento/especialidade divulgado no site. | consulta agendada |
| **placeholder** | Conteúdo provisório **rotulado como tal**, para ser substituído. | conteúdo de exemplo plausível — proibido aqui |
| **camada de dados** | `lib/data/*`: única fronteira que sabe de onde vem o dado. | ORM ou repositório com abstração genérica |
| **painel admin** | Área autenticada `/admin`, implementada na Fase 5 (auth + CRUD das 6 entidades). | dashboard do Supabase |

<!-- Adicionar termo aqui sempre que houver confusão em PR ou postmortem. -->

## Convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **PRs:** título imperativo ≤72 chars; descrição com O que / Por que / Como testar / Riscos; ≤300 linhas modificadas.
- **Código:** erros embrulhados; logs estruturados; tenant ID em toda query (RLS); migrações append-only.
- **Documentação:** documentar não é edição solta. Um documento herda o
  fluxo da mudança que o torna obsoleto, no peso proporcional — não abre
  cerimônia própria quando deriva de uma feature. Os documentos de uma
  feature evoluem juntos (co-obsolescência): atualizar um e deixar o irmão
  para trás é dívida. O agente **rascunha e recomenda** documentação; não
  publica nem abre uma unidade de revisão por conta própria. *(Fluxo: `/documentar`.)*
- **AGENTS.md é canônico; CLAUDE.md é derivado.** Edite sempre o `AGENTS.md`.
  O hook `.githooks/pre-commit` (instalado sozinho via `npm install` →
  script `prepare` → `git config core.hooksPath .githooks`, sem symlink de
  SO nem privilégio de admin) copia `AGENTS.md` para `CLAUDE.md` no mesmo
  commit e **bloqueia** o commit se `CLAUDE.md` for editado sozinho e os
  dois ficarem diferentes. Histórico: os dois arquivos divergiram em
  silêncio por meses (2026-08-04 a 2026-08-11, ver Lições aprendidas) até
  esse mecanismo existir — antes disso a regra vivia só na prosa.

## Fluxo de trabalho — a espinha (obrigatório)

Toda unidade de trabalho não-trivial segue, **sem exceção para o agente**:

**`issue → branch → implementar → /verify → MR vinculado à issue`**

- **Não é opcional e não é um caminho avançado.** É o default. O agente
  **não** começa a trabalhar nem commita direto no `main`/`master`. Antes
  do primeiro commit de uma tarefa, crie (ou peça para criar) a issue e a
  branch de trabalho. Sem issue/branch, o trabalho não começou.
- **Trivial** (typo, ajuste de uma linha em doc) pode dispensar a issue,
  mas **nunca** o branch+MR: nada entra no `main` sem revisão.
- **Integração com o forge** (abrir issue/MR, vincular, comentar) está
  disponível — via a integração nativa da ferramenta ou MCP do forge. Se a
  integração existe, **use-a**; não trate issue/MR como burocracia externa
  ao loop. Ver "Como usar o agente neste repo".
- **Bootstrap de repo novo:** o primeiro gesto já segue a espinha — `main`
  protegido (push direto bloqueado no forge) e trabalho por branch+MR desde
  o commit inicial. Não fundar o repo empurrando direto no `main`.

Se você (agente) se pegar prestes a commitar no `main` sem branch/MR, **pare**:
isso é o anti-padrão que esta seção barra.

## Comportamento do agente — modos de falha a evitar

O agente deve se vigiar contra cinco modos de falha recorrentes. Cada
um tem um guarda no fluxo; a regra abaixo é o contrato explícito.

- **Não pular a espinha do fluxo.** Trabalho não-trivial **não** começa nem
  termina no `main`: é `issue → branch → /verify → MR`. Commit direto no
  `main` sem branch/MR é violação de contrato, não atalho.
  *(Guarda: seção "Fluxo de trabalho" acima; hook `pre-push` avisa em push ao
  `main`; proteção de branch no forge.)*

- **Não supor em silêncio.** Diante de ambiguidade, exponha as
  interpretações e pare para perguntar — não escolha uma e siga.
  Sinalize confusão, inconsistência e tradeoff em vez de seguir reto.
  *(Guarda: `/grill` antes do plano; reformulação no `/plan`.)*
- **Não sobre-engenheirar.** Entregue a solução mínima que satisfaz o
  critério de aceite. Sem abstração antes do terceiro caso (rule of
  three), sem flexibilidade para requisito que ainda não existe.
  *(Guarda: axioma da decisão-mínima; anti-padrão de sprawl.)*
- **Não tocar no que não foi pedido.** Mudança fora do escopo da
  tarefa não entra no mesmo diff, mesmo que pareça melhoria.
  *(Guarda: `/commit` isola fora-de-escopo; `protect-paths`.)*
- **Não dar por feito sem verificar.** "Pronto" é comportamento
  validado, não diff que existe. Rode a verificação antes de declarar.
  *(Guarda: `verify` falha-first; evals como critério.)*

## Padrão senior — gate automático

Bloqueiam merge (aplicados pelo playbook `/verify` sobre o diff +
revisão de PR):

- Zero tipo solto em surface pública
- Zero secret hardcoded
- Zero query sem `LIMIT` ou paginação
- Zero log de debug em produção
- Zero parse JSON externo + cast sem schema
- Zero histórico LLM unbounded
- Zero operação destrutiva sem confirmação

(Lista completa: 12 zeros. Ver senior-baseline do guia GDAS.)

## Contrato de verificação antes da execução

Toda demanda elegível declara, **antes de executar**, seu contrato de
verificação: definição de pronto testável + oráculo que a comprova.
Execução por um papel; julgamento por outro. Fecha quando o oráculo é
executado e a evidência anexada. Critério falho → revisar a hipótese;
esgotado o budget → abster-se, escalar, registrar a lição. O oráculo é
amarrado ao tipo de entregável (late binding); a ferramenta concreta
vive no adapter, nunca na doutrina.

- **Schema e regras:** bloco `contrato_verificacao` do `agent/policy.json`;
  o `gdas audit` impõe as regras genericamente a partir do bloco.
- **Cerimônia proporcional ao blast radius:** em `padrao` e
  `alto_blast_radius` o avaliador é instância separada e a falseabilidade
  é obrigatória; em `trivial_reversivel` o auto-check com evidência basta.
- **Fecha com evidência:** oráculo executado + evidência anexada + todos
  os critérios satisfeitos. Fechar sem evidência é CRÍTICO.

## Gate de planejamento (`modo_plano`)

Antes de **iniciar a execução de um plano**, o plano deve estar
**registrado num rastreador externo de demandas**, e essa condição deve ser
**externamente verificável** pelo identificador que o efeito de registro
retorna. **Auto-declaração não é gate.** Ao esgotar o orçamento de
tentativas de registro → **interromper e reportar sem iniciar a execução**
(não seguir em silêncio). `modo_plano` é uma **instância parametrizada** do
primitivo `contrato_verificacao` (`momentos.planejamento`, schema único),
não um bloco novo.

- **Schema e regras:** bloco `contrato_verificacao.instancias.modo_plano` do
  `agent/policy.json`; o `gdas audit` (Verificação 9) impõe a regra
  **estrutural** — o identificador **existe e resolve** (`#<n>`/URL), nunca a
  prosa do plano.
- **Evidência = o identificador:** o identificador resolvível capturado do
  registro externo **é** a evidência do gate.
- **Rastreador concreto:** a capability "rastreador de demandas" vive no
  adapter, nunca na doutrina — reaproveita o canal de `/demanda` /
  `$GDAS_FORGE_ISSUES`. Plano em execução sem identificador resolvível é ALTO.

## Piso de segredo do `.gitignore`

O `.gitignore` tem um **piso mínimo de segredo** com **fonte única**: o campo
`files.gitignore_baseline` do `agent/policy.json` (padrões em sintaxe
`.gitignore`). Dele derivam o semente (semeado/mesclado idempotente pelo
`gdas init`), o check de aderência `agent/checks/gitignore-baseline.sh` e o
bloqueio pré-edição `agent/checks/protect-paths.sh` (mesmas classes de segredo).

- **Estrutural:** o check exige a **presença da linha** do padrão no
  `.gitignore` — não interpreta glob nem avalia efeito.
- **Gate:** o `gdas audit` (Verificação 10) impõe o baseline sobre o
  `.gitignore` da raiz. Padrão de segredo ausente é **ALTO** (é segredo).
- **Mexeu no baseline?** Reconcilie no mesmo movimento o semente, o check e as
  classes bloqueadas em `protect-paths.sh` — todos seguem
  `files.gitignore_baseline`.

## Escrita no forge — credencial e atribuição

A espinha `issue -> branch -> MR` **obriga** o agente a CRIAR registros no forge
(abrir demanda, abrir/vincular MR, comentar). A leitura tem convenção
(`$GDAS_FORGE_ISSUES`); a escrita usa **duas chaves neutras**, com o comando
concreto por plataforma no adapter (neutralidade).

- **`GDAS_FORGE_TOKEN`** — token de escrita, escopo `api`. **Não** é o token de
  push do git (OAuth git-only não serve à API) nem o token de CI. Segredo: vive
  no `.env` (gitignorado pelo piso de segredo); só o placeholder vai ao
  `.env.example` versionado.
- **`GDAS_FORGE_USER`** — usuário a quem **atribuir** o registro, para alternar
  de forma explícita e rastreável.
- **Contrato versionado:** o `gdas init` semeia as chaves no seu `.env.example`
  (idempotente). Preencha os valores no `.env` real — nunca versione o token.
- **Agente rascunha, humano aprova:** abrir/fechar demanda ou MR é efeito
  colateral — o agente recomenda; a ação é aprovada pelo humano (`shell.ask`, não
  `allow`). O identificador devolvido (`#<n>`/URL) fecha o gate `modo_plano`.
- **Restrições de corpo do deployment:** se o seu forge está atrás de WAF/proxy
  ou limita o corpo (ex.: rejeita título/descrição com acento, ou trunca corpo
  grande), **documente aqui** — o agente consulta antes de postar. Default
  robusto: corpo ASCII-safe + conteúdo rico como anexo (upload multipart passa
  mesmo com acento).

## Âncoras: navegacional vs normativa

A categoria **âncora** tem **duas espécies com manutenção OPOSTA** (bloco
`ancoras` do `agent/policy.json`; template `agent/ancoras/<id>.md`). Não é
primitivo novo: reusa os **dois gates temporais** de
`contrato_verificacao.momentos`.

- **Navegacional** (mapa/índice/grafo de deps): **derivável do código**,
  verificação por **existência**, **auto-geração permitida**, staleness
  **visível**. Reusa o gate `pos_entrega`.
- **Normativa** (contrato/smoke/matriz): **precede e julga o código** (oráculo),
  **não derivável do código**, verificação por **falseabilidade cruzada**
  (consistência mútua entre normativas dos pares obrigatórios), **auto-geração
  do código PROIBIDA**, **append-only + supersessão explícita**, staleness
  **silenciosa**. Reusa o gate `planejamento`. `proveniencia` é **sempre** uma
  demanda/US/spec, **nunca** o código.

O `gdas audit` (Verificação 11) impõe 7 checks **estruturais** — vê estrutura,
jamais a prosa:

- **CRÍTICO:** normativa auto-gerada/derivada do código. **ALTO:** normativa sem
  `proveniencia`; par obrigatório divergente; append-only violado. **MÉDIO:**
  espécie ausente; navegacional com alvo inexistente; pack `fuzzy` sem
  `demanda_regra_de_tres`.
- **Supersessão:** marcadores explícitos (`supersede:`/`superseded_by:`) +
  append-only + red-gate na divergência. Par divergente **reprova vermelho** e
  **um humano reconcilia** (o desempate automático fica deferido).

## Lições aprendidas

<!-- APPEND-ONLY DATA DESC: nova linha NO TOPO. Reduz merge conflict. -->

- 2026-08-12: `npm ci` no CI (Linux) falhava com `EUSAGE` mesmo depois de
  regenerar `package-lock.json` do zero no Windows (issue #50, ao
  adicionar Vitest) — `esbuild` é peer dependency OPCIONAL do `vite`
  (`^0.27.0 || ^0.28.0`), e o npm local resolvia 0.28.1 (mesma versão já
  usada pelo `wrangler`) enquanto o npm do CI resolvia 0.28.2, cada
  ambiente re-resolvendo o peer opcional por conta própria em vez de
  confiar cegamente no lockfile. Fix definitivo: `"overrides": {
  "esbuild": "0.28.1" }` no `package.json`, forçando UMA versão só em
  toda a árvore — regenerar o lockfile sem isso não resolve, porque o
  problema é a resolução ficar aberta a cada ambiente, não o conteúdo do
  lockfile em si. Vale lembrar disso se outra dependência trouxer
  `esbuild`/`vite` como peer opcional no futuro.
- 2026-08-11: `AGENTS.md` e `CLAUDE.md` divergiram silenciosamente entre
  2026-08-04 e 2026-08-11 — só `CLAUDE.md` vinha sendo atualizado sessão
  após sessão, e `AGENTS.md` ficou parado descrevendo a Fase 1. No meio do
  caminho `CLAUDE.md` também regrediu sozinho (Stack passou a dizer "Deploy:
  Vercel", já errado desde que a Vercel foi apagada em 2026-08-10) e perdeu
  uma entrada de "Decisões fechadas" (violação do próprio append-only).
  Nenhum mecanismo detectava isso — só prosa pedindo pra manter os dois
  sincronizados. Fix: hook `.githooks/pre-commit` (ver Convenções) torna a
  sincronia um gatilho, não mais um lembrete.
- 2026-08-10: `npm run deploy` (`opennextjs-cloudflare build`) dá
  `EPERM`/`Device or resource busy` tentando apagar `.open-next/` no
  Windows se o servidor de dev local (`next dev`) estiver rodando — ele
  mantém `.open-next/assets` aberto via `initOpenNextCloudflareForDev()`.
  Fix: sempre parar o preview/dev server antes de rodar `npm run deploy`.
- 2026-08-10: Depois de reverter uma feature (rota removida), `npm run
  typecheck` isolado pode falhar citando um módulo que não existe mais —
  é `.next/types/validator.ts` desatualizado (cache de build antigo), não
  um erro real de código. Fix: rodar `npm run build` uma vez (regenera o
  manifesto) antes de confiar no typecheck isolado; não precisa apagar
  `.next/` manualmente.
- 2026-08-07: `ci.yml` dispara duas vezes por push numa branch com PR aberto
  (`on: push: branches: ["**"]` + `on: pull_request` simultâneos). O
  `concurrency` group usa `github.ref`, que é diferente entre os dois
  eventos (`refs/heads/<branch>` no push vs `refs/pull/<n>/merge` no
  pull_request) — `cancel-in-progress` não deduplica entre eles. Ainda não
  corrigido; conserto provável é restringir o `push` a `branches: [main]`
  (cobertura de PR já vem do `pull_request`). Descoberto durante o merge
  do PR #27, quando um outage do GitHub Actions (ver linha abaixo) expôs o
  padrão: dois runs do mesmo commit competindo, um deles perdendo o slot.
- 2026-08-07: Outage do GitHub Actions/Pages (`major_outage`, impacto
  `critical`, ~15:22–00:05 UTC, ver githubstatus.com/incidents/qcvjkzcs7j74)
  bloqueou o merge do PR #27 por ~8h — jobs ficavam presos em fila sem
  runner (`runner_id: 0`) e eram auto-cancelados após ~15min. Nada a
  corrigir do lado do projeto; resolveu sozinho quando o GitHub normalizou.
  Evidência de `npm run verify` local limpo foi coletada durante a espera
  como plano B (bypass de branch protection), mas não precisou ser usado —
  o outage resolveu antes.
- 2026-08-03: `jq` não está instalado na máquina de desenvolvimento (Windows).
  O `gdas init` degrada em silêncio-parcial: pula o adapter e o manifesto com
  WARN. `.claude/settings.json` e `agent/.gdas/manifest.json` foram gerados
  reproduzindo os filtros do `gdas-init.sh`. Instalar `jq` e rodar
  `gdas init --force --adapter claude` é o conserto de raiz.
- 2026-08-03: `npm audit` acusa 3 vulnerabilidades ALTAS transitivas do
  próprio Next.js 16.2.12 (postcss, sharp). `npm audit fix --force`
  "resolveria" rebaixando para Next 9 — inaceitável. Auditoria fica advisory
  no CI até o upstream publicar release corrigida.

## Decisões fechadas

<!-- APPEND-ONLY DATA DESC: nova linha NO TOPO. -->

- 2026-08-10: Roadmap de agendamento fatiado em 5 fases sequenciais (issues
  #33–#37) — Fase 0 (nav do admin), Fase A (CTA WhatsApp), Fase B (admin
  define dias de trabalho), Fase C (integração Google Calendar OAuth, conta
  pessoal da doutora), Fase D (formulário de agendamento no site, slot fixo
  de 1h). Por que: escopo grande demais pra uma unidade só; Google Calendar
  pessoal (não uma conta nova) foi decisão explícita apesar do trade-off de
  expor todo compromisso pessoal como "ocupado"; duração variável por
  categoria de serviço ficou fora do v1 de propósito, pra não misturar com
  "mostra só horário livre de verdade" e arriscar conflito de agenda. Custo
  aceito: Fase D só entrega valor real depois de B e C completas — nada
  agendável no site até lá.
- 2026-08-10: Vercel apagada de vez (`clinica-psi-lake.vercel.app` não
  existe mais) — Cloudflare Workers passa a ser a **única** hospedagem real,
  com primeiro deploy de produção feito nesta data
  (`clinica-site.augustoneonvazryba.workers.dev`). Por que: motivo original
  da migração (Vercel Hobby proíbe uso comercial nos ToS) só ficava
  resolvido de fato quando o Cloudflare fosse pra produção e o Vercel fosse
  desconectado — os dois ficaram no ar em paralelo por semanas até este
  ponto. Custo aceito: nenhum domínio próprio configurado ainda, site segue
  no subdomínio `*.workers.dev` até a doutora decidir sobre domínio.
- 2026-08-04: Hospedagem de produção migra de Vercel para Cloudflare
  Workers (via `@opennextjs/cloudflare`), mantendo Supabase como banco/
  auth/storage — não reabre a decisão "stack 100% Cloudflare descartada"
  do `PLANEJAMENTO.md` §4 (aquela era sobre D1/R2/Auth substituindo
  Supabase; aqui só muda a camada de hospedagem). Por que: o plano
  gratuito da Vercel (Hobby) proíbe uso comercial nos ToS e site de
  clínica é uso comercial; o plano gratuito da Cloudflare Workers permite
  isso explicitamente; o adaptador atingiu GA em fevereiro/2026 com
  suporte completo a App Router, Server Actions, ISR e streaming.
  `next/image` desligado (`images.unoptimized: true`) em vez de loader
  Cloudflare Images: nenhum componente usa `next/image` ainda, loader
  customizado seria flag para requisito que não existe. Cache incremental
  (R2) também não entrou: nenhuma página usa `revalidate`/ISR hoje. Custo
  aceito: uma camada de build a mais (OpenNext) entre o Next.js e o
  runtime — confirmado em 2026-08-10 com o primeiro deploy real (ver
  decisão acima).
- 2026-08-10: Antes/depois (Fase 6) implementado e revertido na mesma
  sessão — usuário confirmou autorização de uso de imagem para 7 casos
  curados, página `/resultados` chegou a existir em PR aberto, mas o
  usuário não gostou do resultado visual e pediu reversão completa antes
  do merge. Nada chegou a `main`; bucket e fotos apagados do Supabase
  Storage. Por que: decisão de gosto/produto da cliente, não technical
  debt. Custo aceito: antes/depois fica **pausado até o fim do projeto** —
  não retomar essa demanda sozinho numa sessão futura sem o usuário pedir.
- 2026-08-06: Mutations do admin (Fase 5 PR3, issue #20) passam por RLS
  `authenticated` via cliente cookie-aware (`getSupabaseServerComponentClient`),
  não por `service_role` — vale pra todas as entidades do PR3 (serviços,
  equipe, blog, depoimentos, site_settings), não só a primeira. Policy sem
  filtro por usuário (`using (true)`), porque o schema não tem coluna de
  "dono" e há 1 admin só. Por que: manter a RLS como camada de defesa
  real, coerente com o resto do projeto (`PLANEJAMENTO.md` §6) — usar
  `service_role` pra tudo esvaziaria esse propósito. Custo aceito: uma
  migration de `GRANT`+policy a mais por entidade (lição do PR1: RLS
  sozinha não basta, precisa do `GRANT` de tabela também, senão dá
  "permission denied for table" antes mesmo de avaliar a policy).
- 2026-08-05: `middleware.ts` (convenção legada, não `proxy.ts`) com
  `runtime: "experimental-edge"` explícito no `config`, mesmo com o aviso
  de deprecation do Next 16. Por que: o adaptador `@opennextjs/cloudflare`
  (alvo de deploy) recusa Node.js middleware, e o Next 16 diz
  explicitamente que `proxy.ts` SEMPRE roda em runtime Node.js — não dá
  pra forçar edge nele. `middleware.ts` ainda aceita edge runtime
  explícito. Custo aceito: aviso de deprecation no build até o
  `@opennextjs/cloudflare` suportar Node.js middleware (ou o Next remover
  de vez a opção de edge em `middleware.ts`).
- 2026-08-05: Usuário admin do painel (Fase 5 PR2, issue #18) criado com
  e-mail temporário `augustoneonvazryba@gmail.com` (não o e-mail
  institucional da clínica) e senha fraca `adm12345` — **ambos aceitos
  explicitamente pelo usuário apesar do alerta de segurança** (o
  `PLANEJAMENTO.md` §6 pede "senha forte" para o painel admin, que acessa
  dado pessoal de paciente sob LGPD). Por que: domínio de e-mail
  institucional ainda não existe; e-mail/senha definitivos ficam para
  quando a clínica decidir. Custo aceito: painel com credencial fraca até
  alguém trocar manualmente — reforçar antes de produção real com dado de
  paciente de verdade.
- 2026-08-05: Fase 5 (painel admin) fatiada em 3 PRs sequenciais — PR1
  schema+RLS+migrations no Supabase existente (`rjqeideajodwacumfiel.supabase.co`)
  e troca de `lib/data/*`/`lib/supabase/*` de mock para real; PR2 Supabase
  Auth + `/admin` protegido; PR3 telas de CRUD (serviços, equipe, blog,
  depoimentos, `site_settings`, leads). Por que: o contrato pede PR
  ≤300 linhas e o escopo total (schema+wiring+auth+4 CRUDs) estoura isso
  de longe. Custo: mais idas e vindas de review entre os três PRs, mas
  cada um shippa algo verificável sozinho.
- 2026-08-05: `npm run build` passa a EXIGIR `.env.local` preenchido com as
  3 vars do Supabase — a garantia anterior ("build passa sem nenhuma env
  var", válida até a Fase 4) é revogada. Por que: `/servicos/[slug]` e
  demais páginas SSG que leem `lib/data/*` agora consultam o Supabase real
  durante o build, e `lib/data/*` deixou de ser mock em memória; não tem
  como gerar as páginas estáticas sem o banco responder. Custo aceito:
  CI/dev sem `.env.local` não builda mais — mas em produção (Cloudflare
  Workers) as env vars sempre estão setadas, então não afeta deploy real.
- 2026-08-05: Storage do Supabase (bucket + upload de foto de equipe/blog)
  adiado para depois da Fase 5 — as colunas `*_url` entram no schema como
  texto simples. Por que: hoje todo `image_url`/`photo_url` é `null`
  (fotos ainda não vieram da cliente, demanda #10), não há nada real pra
  testar upload. Custo: schema/wiring de Storage volta a ser mexido quando
  o material de imagem chegar.
- 2026-08-05: Descrição genérica de especialidade odontológica é exceção
  explícita à regra de "não inventar dado de clínica" (demanda #13) — o campo
  `Service.long_description` recebe texto educacional padrão da área (o que é
  a especialidade, para que serve, que tipo de procedimento envolve), sem
  `<PlaceholderNotice>`. Por que: a página individual de serviço precisa de
  corpo de texto, a doutora autorizou em 2026-08-05, e definição de
  especialidade não é fato sobre esta clínica — é o mesmo conteúdo que
  qualquer site odontológico publica. Custo: a fronteira entre "genérico" e
  "sobre a clínica" passa a exigir julgamento em cada texto novo; o limite
  fica registrado em "Regras de conteúdo" (nada específico da clínica,
  nenhuma estatística, prazo, preço ou promessa de resultado).
- 2026-08-05: Paleta e tipografia da Fase 3 fechadas (demanda #8) — azul da
  marca `#4590BF` (extraído do logo real) + acento terracota derivado
  `#E2805E` + tinta `#231F20`, todos com contraste AA documentado em
  `DESIGN.md`; Fraunces (títulos) + Inter (corpo), self-hosted via
  `next/font/local` (não `next/font/google` — mantém a decisão de
  2026-08-03 de não depender de rede de terceiro no build, sem ficar preso
  à pilha de sistema pra sempre). Site fica só no tema claro, sem dark
  mode. Por que: personalidade de marca definida como acolhedora/humana +
  alegre/acessível; site de saúde ganha mais com fundo claro e fotografia
  fiel do que perderia sem modo escuro. Custo: nenhum token de dark mode
  documentado — se a decisão mudar depois, a paleta precisa de um par
  escuro por token.
- 2026-08-03: Blog fica atrás de flag em `lib/config/features.ts`, em vez de
  link fixo no menu. Por que: a pergunta 22 do questionário ainda não voltou e
  a rota pode nunca ir a produção. Custo: uma indireção a mais na navegação.
- 2026-08-03: `lib/data/*` devolve mock em memória com assinatura assíncrona
  idêntica à do Supabase, em vez de já integrar o banco. Por que: não existe
  projeto Supabase e o build não pode depender de credencial. Custo: a
  integração real ainda não foi exercitada de ponta a ponta.
- 2026-08-03: Arquitetura em camadas, não hexagonal. Por que: site
  institucional com pouca regra de negócio — porta/adaptador seria cerimônia
  sem consumidor. Custo: menos isolamento se a fonte de dados mudar de novo.
- 2026-08-03: CSP com `'unsafe-inline'` em script/style, em vez de nonce. Por
  que: o App Router injeta inline no streaming e ainda não se sabe quais
  terceiros o site carrega. Custo: CSP mais fraca até a Fase 7.
- 2026-08-03: Sem fonte do Google (`next/font/google`), pilha do sistema.
  Por que: build não deve depender de rede de terceiro; tipografia definitiva
  é decisão da Fase 3. Custo: visual provisório mais genérico.

## Feature flags ativas

Nenhuma hoje. `FEATURES.blog` foi removida em 2026-08-04: a pergunta 22 do
questionário voltou "sim" e o blog virou escopo confirmado (link fixo no
menu, `lib/config/navigation.ts`), não flag condicional. `lib/config/features.ts`
fica de propósito, pronto pra próxima decisão de escopo pendente.

## Primeira sessão — protocolo do agente

Scaffold recém-instalado é **intencionalmente vazio**. Placeholders (`<...>`)
são convites de preenchimento, não bugs. Antes de qualquer tarefa:

1. Leia este AGENTS.md do início ao fim.
2. Identifique campos em branco. Se **Stack**, **Como rodar** ou **Estrutura**
   estiverem vazios, **pergunte** ao humano antes de agir — não assuma nem
   invente a stack do projeto.
3. Só prossiga para a tarefa após entender stack, fluxo de build e paths
   críticos.

Para a primeira tarefa: **abra a issue e a branch antes de qualquer commit**
(ver "Fluxo de trabalho — a espinha"); depois chame `/grill` se houver
ambiguidade no objetivo, ou `/plan` se o objetivo estiver claro. Nunca
comece a trabalhar direto no `main`.

## Como usar o agente neste repo

- Playbooks em `agent/playbooks/` (invoque como `/<nome>` se a sua
  ferramenta suporta comandos; senão, cole no prompt).
- `/grill` quando a tarefa for ambígua ou grande: entrevista de
  alinhamento antes do plano (termos resolvidos entram no
  Vocabulário; decisões entram em Decisões fechadas).
- `/plan` para tarefas não-triviais (>1 arquivo, path crítico,
  contrato externo).
- `/verify` antes de abrir PR.
- **Integração com o forge:** se a sua ferramenta alcança o forge
  (integração nativa ou MCP), abrir issue, criar branch, abrir o MR
  vinculado e comentar fazem **parte do loop** — não são passo manual fora
  dele. É assim que a espinha `issue → branch → MR` se cumpre na prática.
- `/distill` ao fim de um ciclo: compila o histórico bruto (commits,
  PRs, postmortems) em lições destiladas para o contrato — recomenda,
  você aprova.
- Checks em `agent/checks/` rodam: lint, typecheck, tests, senior
  baseline. Política de permissões em `agent/policy.json`.
- **Atualizar o GDAS** — antes de tudo, **verifique se há versão nova** e
  **nunca `git clone`** o repo do GDAS para "atualizar":
  - **Verifique primeiro:** a detecção remota de release não é automática.
    Compare `gdas --version` (CLI no PATH) com a versão publicada do upstream.
    Iguais → **pare e reporte "já na última"**; não assuma release novo nem
    saia caçando branch/tag.
  - **Nunca clone:** o update vem do **bundle publicado** (release/tarball) +
    `./install.sh`, não de um clone do repositório de desenvolvimento.
  - **Duas camadas, nesta ordem** (não basta rodar `gdas update`):
    1. **CLI:** reinstale o binário (baixe o bundle e rode `./install.sh`, ou
       `./install.sh --download` quando o release publica por URL). `gdas update`
       sozinho só compara contra o CLI já no PATH.
    2. **Projeto:** rode `gdas update` aqui para reconciliar os artefatos
       (`AGENTS.md` nunca é sobrescrito — gera notas de upgrade).
  Faça o update em **branch própria** (`chore/gdas-<versão>`), nunca misturado
  ao diff de uma feature.

## Aviso de defasagem

Este arquivo pode estar defasado em pontos específicos. Verifique o
código quando em dúvida. Encontrou divergência? Atualize esta seção
no mesmo PR da correção.

<!-- gdas-version: 0.37.9 — gerado por gdas init; ver agent/.gdas/manifest.json -->

