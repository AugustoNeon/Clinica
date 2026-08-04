# AGENTS.md

> Contrato vivo do repositório. Lido como contexto pelo agente em
> toda sessão (nativamente ou apontado no início). Cresce com PRs.
> Mantenha enxuto (2–4k tokens) e atual.

## Sobre o projeto

**clinica-site** — site institucional de uma clínica odontológica: páginas
públicas (serviços, equipe, contato) e, em fase posterior, um painel admin
para a cliente manter o conteúdo sozinha. Plano técnico completo em
`PLANEJAMENTO.md`; conteúdo/negócio vêm do questionário em `docs/`.

**Fase atual: 1 (Setup).** O questionário ainda não voltou. Todo conteúdo do
site é **placeholder declarado** e `lib/data/*` serve dados **mock em
memória** — não existe projeto Supabase criado. Nenhum dado real de clínica
(nome, endereço, telefone, serviço, dentista) pode ser inventado: sem
resposta da cliente, o campo fica placeholder.

## Stack

- **Linguagem:** TypeScript 5
- **Framework HTTP:** Next.js 16 (App Router) — Server Components + Server Actions
- **Banco:** Postgres via Supabase — **ainda não provisionado** (`lib/data/*` é mock)
- **Frontend:** React 19 + Tailwind CSS 4
- **Validação:** Zod 4 (`lib/validation/`), schema único para cliente e servidor
- **Deploy:** Vercel (previsto, ainda não configurado)
- **Observabilidade:** nenhuma ainda — entra na Fase 7

## Como rodar localmente

```bash
npm install         # primeira vez
npm run dev         # servidor de desenvolvimento
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # build de produção
npm run verify      # lint + typecheck + build
```

Vars obrigatórias em `.env.local`: **nenhuma por enquanto**. O build e o lint
passam sem nenhuma variável de ambiente, e essa propriedade é intencional —
se algum dia `npm run build` passar a exigir segredo, isso é regressão, não
configuração faltando. O contrato completo de variáveis (Supabase, Turnstile,
e-mail) está em `.env.example`.

## Comandos

Chaves canônicas lidas pelo gate de verificação (`agent/skills/gdas-verificar`).
Declare só o que existe: chave ausente vira SKIP explícito na evidência —
a lacuna é dado, não silêncio. Números (ex.: alvo de cobertura) moram
aqui, nunca na skill.

```
build: npm run build
lint: npm run lint && npm run typecheck
security: npm audit --audit-level=high
```

Chaves ausentes (`test`, `regressao`, `coverage-target`, `suite-dir`,
`schema-fingerprint`, `sentinelas`, `isolamento`, `conta-testes`,
`conta-executados`) são SKIP explícito: **não existe suíte de testes ainda**
e não existe banco para tirar fingerprint. A lacuna é dado, não silêncio —
testes entram junto com a primeira lógica de negócio real (Fase 4+).

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
| Vars obrigatórias | 2026-08-03 | `grep -c '=' .env.example` (nenhuma é exigida pelo build hoje) |

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
lib/data/               # PATH CRÍTICO — 1 arquivo por entidade; hoje MOCK em memória
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
- Todo bloco de conteúdo provisório carrega `<PlaceholderNotice>` visível.
- O site está com `robots: noindex` no layout enquanto for placeholder.
- Depoimento de paciente só é publicável com `consent_confirmed` — a função
  `getTestimonials()` filtra por isso, não confia em lembrança de ninguém.
- Dado de `contact_leads` é dado pessoal: **nunca logar** nome, telefone,
  e-mail ou mensagem; nunca expor listagem em rota pública.

## Vocabulário de domínio

<!-- Ubiquitous Language: termos com significado preciso neste projeto. -->

| Termo | Significado neste projeto | Não confundir com |
|-------|---------------------------|-------------------|
| **lead** | Registro em `contact_leads`: alguém que preencheu o formulário. Dado pessoal. | paciente (quem já é atendido pela clínica) |
| **serviço** | Linha de `services` — procedimento/especialidade divulgado no site. | consulta agendada |
| **placeholder** | Conteúdo provisório **rotulado como tal**, para ser substituído. | conteúdo de exemplo plausível — proibido aqui |
| **camada de dados** | `lib/data/*`: única fronteira que sabe de onde vem o dado. | ORM ou repositório com abstração genérica |
| **painel admin** | Área autenticada `/admin`, ainda não implementada (Fase 5). | dashboard do Supabase |

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

- 2026-08-04: Questionário respondido pela cliente aplicado ao site — nome,
  contato, lista de serviços e equipe deixam de ser placeholder. A equipe do
  site é só a própria dentista: ela pediu explicitamente para não listar
  terceiros. O blog virou escopo confirmado (pergunta 22 respondida "sim") e a
  flag `FEATURES.blog` foi **removida** em vez de virar `true` — flag sem
  decisão em aberto para guardar é sobre-engenharia. Custo: reativar o blog
  atrás de flag exigiria reintroduzir a indireção. Imagens (logo, espaço,
  equipe, antes/depois) e depoimentos seguem pendentes, e por isso o site
  continua `noindex`.
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

| Flag | Criada | Remover até | PR |
|------|--------|-------------|-----|

Nenhuma flag ativa no momento. `FEATURES.blog` foi removida em 2026-08-04
(pergunta 22 respondida "sim" — decisão fechada, sem mais nada em aberto
para guardar atrás de flag). Ver "Decisões fechadas" acima.

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

