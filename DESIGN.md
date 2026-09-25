# Design

> Ver `PRODUCT.md` para o "porquê" (register, personalidade, público).
> Este arquivo é o "como" — tokens e regras de uso. Definido e aprovado
> em 2026-08-05 (demanda #8); aplicação nos componentes é uma demanda
> separada (ver AGENTS.md → "Decisões fechadas").

## Tema

Só claro. Sem dark mode — decisão deliberada, não omissão: site de
saúde/estética ganha mais com fundo claro e fotografia fiel (retrato da
doutora, antes/depois) do que perderia por não ter modo escuro. Menos
tokens para manter também.

## Cor

> Superado pela seção "Azul aceso e revisão anti-IA (issue #73)" no fim
> deste arquivo. A tabela abaixo fica como histórico.

Paleta completa (não restrita a 1 acento): azul da marca extraído do
logo real + acento terracota derivado dele + tinta quase-preta. Todo
par abaixo já vem com contraste verificado (WCAG AA: ≥4.5:1 texto
normal, ≥3:1 texto grande ≥18px ou bold ≥14px).

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--surface` | `#FFFFFF` | Fundo padrão | — |
| `--surface-tint` | `#EAF5FD` | Fundo de seção alternada, hero (azul bem diluído) | — |
| `--ink` | `#231F20` | Texto primário, títulos | 16.1:1 sobre `--surface` |
| `--ink-muted` | `#696160` | Texto secundário/legenda | 6.0:1 sobre `--surface` |
| `--blue` | `#4590BF` | Cor da marca — só decorativo/ícone grande ou fundo com texto ≥18px | 3.2:1 sobre branco, 3.2:1 com texto branco por cima (mesma direção, falha texto pequeno nos dois sentidos) |
| `--blue-dark` | `#1D6A96` | **CTA primário, footer sólido, hover/active, link de texto pequeno** | 5.9:1 com branco ou com `--surface` |
| `--terracotta` | `#E2805E` | Badge/tag preenchido (com `--ink` por cima, nunca texto branco) | 5.8:1 (`--ink` sobre terracotta) |
| `--terracotta-text` | `#B8492E` | Link/ícone/texto pequeno terracota sobre branco | 5.2:1 sobre `--surface` |
| `--terracotta-tint` | `#FFEAE3` | Fundo de badge/callout | — |

Regra de uso: **`--blue` não carrega texto pequeno em nenhuma
direção** — nem como texto sobre branco, nem como fundo com texto
branco em cima (14px/500 não é "texto grande" pelo WCAG, que exige
18px regular ou 14px **bold**). `--blue-dark` é quem carrega botão
primário, rodapé sólido e qualquer texto pequeno azul — é o par
realmente usado na aplicação (Fase 3, demanda #11), não `--blue` puro.
Mesma lógica pro terracota: `--terracotta` é fundo/preenchimento,
`--terracotta-text` é a versão pra texto/ícone sobre branco.

Como esses valores foram derivados: `--blue` veio direto do PNG do
logo (`public/images/logo/logo-stacked-color.png`, cor dominante
extraída por script). Os demais são a mesma família em OKLCH
(`oklch(0.626 0.103 238.9)` como base do azul), ajustando L/C pra bater
contraste — não são cores inventadas soltas, são a marca esticada em
uma escala.

## Tipografia

> Superado: desde a issue #73 os títulos são Bricolage Grotesque e o texto
> é Lexend. Ver a seção "Azul aceso e revisão anti-IA" no fim do arquivo.

- **Títulos:** Fraunces (serifada suave, peso 500/600). Contraste
  serifa+sans com o corpo — não duas sans parecidas.
- **Corpo/UI:** Inter (400 corpo, 500 ênfase/botão).
- **Self-hosted via `next/font/local`** (arquivos `.woff2` versionados
  no repo, não `next/font/google`). Isso resolve a objeção que já
  tinha barrado fonte do Google em 2026-08-03 (build não pode depender
  de rede de terceiro) sem voltar pra pilha de sistema genérica.
- Escala: h1 `clamp(28px, 4vw, 38px)`, h2 `22px`, corpo `15-16px`,
  legenda `12-13px`. `text-wrap: balance` em h1-h3.

## Logo

`public/images/logo/` — 8 variações originais (stacked/horizontal ×
com/sem tagline × cor/mono) + 3 derivadas geradas nesta demanda:

- `logo-horizontal-white.png` / `logo-stacked-white.png` — inversão de
  cor da mono, pra usar sobre `--blue` (footer) ou qualquer fundo
  escuro. Nenhuma das 8 originais tinha versão branca.
- `icon-smile.png` — só o glifo do sorriso (recortado da versão
  stacked-color), fonte pro favicon/apple-touch-icon. 512×512,
  fundo transparente.

Uso recomendado:
- **Header** (fundo claro): `logo-horizontal-color.png`, sem tagline
  (espaço curto, tagline já repetida no hero).
- **Footer** (fundo `--blue` sólido): `logo-horizontal-white.png`.
- **Favicon:** `icon-smile.png`, exportado nos tamanhos padrão
  (16/32/180px) na hora de aplicar.

## Fotografia

Fotos de estúdio reais da doutora (`public/images/team/`), tratamento
natural — sem filtro/duotone, mantém o fundo neutro-acinzentado do
estúdio original. Fotografia é o principal carregador de "acolhedora e
humana" da marca; não usar banco de imagem enquanto houver foto real
disponível.

**Pendência de conteúdo (não bloqueia esta demanda, mas bloqueia
aplicação completa):**
- Fotos do espaço físico (fachada, recepção, consultório) ainda não
  enviadas pela clínica — necessárias pra seção "estrutura"/faixa
  full-bleed. Ver demanda de atualização de fotos.
- Fotos "Antes e Depois": pasta bruta tem múltiplos pacientes, só um
  caso tem consentimento confirmado (questionário, pergunta 19) — não
  usar nenhuma até a clínica apontar qual arquivo é o caso autorizado.

## Layout

- Container central, largura máxima confortável para leitura de
  texto corrido (~65-75ch nos parágrafos, não na página inteira).
- Cards só onde já são a melhor affordance (serviço, membro de
  equipe) — não aninhar card dentro de card.
- **Faixa de foto full-bleed** como quebra de seção (ex.: entre lista
  de serviços e rodapé): imagem real + gradiente `--ink`/`--blue`
  escurecendo de cima pra baixo (nunca overlay colorido genérico tipo
  menta) + texto branco por cima. Depende de foto real disponível —
  hoje só temos foto da doutora; troca pra foto de espaço físico
  quando chegar (ver pendência de fotografia acima).
- Cantos arredondados generosos (12-16px) nos cards e botões — combina
  com a curva do próprio logo (o "sorriso").

## Motion

- Easing `ease-out` (curva expo/quart), sem bounce/elastic.
- Microinteração em hover de botão/card (leve elevação ou escurecer
  `--blue` → `--blue-dark`), sem animação de entrada exagerada.
- `prefers-reduced-motion: reduce` sempre respeitado — crossfade ou
  transição instantânea no lugar de qualquer movimento maior.

## Protótipo de referência

Rascunho visual aprovado nesta demanda (recorte de home com header,
hero, especialidades, faixa full-bleed e rodapé) — não é código, é só
a referência visual que validou esta paleta/tipografia antes de
escrever este documento.

## Padrões do redesign (issue #65, 2026-09-18)

Aplicação completa dos tokens acima em todas as páginas públicas (PR #66).
Nenhum token de cor/tipo novo — só padrões de composição e movimento.

### Motivo gráfico: o arco do sorriso

> Ampliado na issue #71: o arco também virou textura, divisor de seção e
> desenho dos ícones — ver "Camada rica" no fim deste arquivo.

Único ornamento do site, derivado da curva do logo. Aparece em três
lugares, de propósito, e em nenhum outro:

- **Moldura de foto em arco** — `rounded-[999px_999px_1.75rem_1.75rem]`
  (arco em cima: hero, `/equipe`, `/sobre`) ou invertida
  (`rounded-[1.75rem_1.75rem_999px_999px]`, bloco da doutora na Home).
- **Arco desenhado sob o h1 do hero** — SVG com `pathLength=1`, traço
  `--terracotta`, anima uma vez no carregamento (`.smile-arc`).
- **Marca-d'água na faixa final** — `icon-smile.png` invertido para
  branco, opacidade 10%, sobre `--blue-dark` (`CtaBand`).

Não usar o arco em cards, botões ou ícones: vira decoração aleatória.

### Estrutura de página

- **Home:** hero (tint) → faixa de fatos → serviços (branco, duas
  colunas, esquerda fixa no scroll) → doutora (tint) → passos (branco) →
  depoimentos (tint) → FAQ (tint) → ficha prática + mapa (branco) → faixa
  final (`--blue-dark`). Fundos alternam para dar ritmo; nunca dois tints
  seguidos sem uma quebra branca, exceto depoimentos → FAQ (aceito).
- **Internas:** `PageHero` (tint, h1 grande, lead de 1–2 linhas, link de
  volta opcional) → conteúdo → `CtaBand`. Sem hero de foto fora da Home.
- **Composição "esquerda fixa / direita lista"** (`lg:sticky lg:top-28`)
  para serviços, FAQ e grupos de `/servicos`: intro curta à esquerda,
  itens à direita. É a alternativa deliberada à grade de cards iguais.
- **Cards** só em `/servicos` (grupos) e depoimentos — onde o item é
  clicável ou é uma citação fechada. Listas de linhas com hairline
  (`divide-y divide-ink/10`) em todo o resto.

### Componentes

- `Button`: `primary` (azul escuro), `secondary` (borda), `inverse`
  (branco sobre azul escuro), `ghost`; tamanhos `md`/`lg`. WhatsApp é
  sempre `primary` + `IconWhatsApp` — sem verde do WhatsApp na paleta.
- `Section` com `tone` (`default` | `tint` | `dark`).
- Ícones inline em `components/ui/icons.tsx` (traço 1.75, `aria-hidden`).
- `z-index` semântico em `globals.css`: `--z-header` (40) < `--z-overlay`
  (50, menu mobile). Nenhum número solto.

### Motion (complementa a seção "Motion" acima)

- **Entrada:** só no hero (`.rise-in`, escalonado 80 ms por bloco) e no
  arco. Nada mais anima ao carregar.
- **Scroll:** `.reveal` — scroll-driven animation em CSS puro
  (`animation-timeline: view()`, intervalo `entry 0px → 260px`),
  progressive enhancement: navegador sem suporte mostra tudo parado.
- **Ponteiro:** `TiltFrame` (inclinação ≤6° + brilho) só na foto do hero e
  só com mouse; toque não faz nada.
- **Hover:** linhas de serviço ganham fundo tint e a seta preenche; cards
  sobem 2 px com sombra `blue-dark/10`.
- `prefers-reduced-motion`: tudo acima vira instantâneo ou desligado
  (regra global em `globals.css`).

### Conteúdo genérico permitido

FAQ (`lib/content/faq.ts`), passos da primeira consulta (`Steps`) e
valores (`/sobre`) são conhecimento padrão da área, dentro da exceção de
2026-08-05 do `AGENTS.md`: sem preço, prazo, estatística ou promessa, e
toda resposta remete à avaliação individual. Tudo o que é fato da
clínica continua vindo de `site_settings`/banco.

## Painel admin (issue #67, 2026-09-18)

Registro `product` (design serve a tarefa), não `brand`: sem hero, sem
motion de entrada, densidade maior. Mesmos tokens do site; um token a
mais, `--surface-sunken` (`#F3F7FA`), fundo rebaixado sobre o qual os
painéis brancos flutuam.

- **Shell:** barra lateral fixa de 16rem a partir de `lg` (grupos
  Atendimento / Conteúdo do site / Conta, item ativo em `--surface-tint`
  + `--blue-dark`, badge terracota com contagem); no celular, barra no
  topo + gaveta. Fonte única da navegação: `lib/config/adminNav.ts`.
- **Página:** `AdminPageHeader` (título, contexto, ações à direita, link
  de volta) → `AdminPanel` (superfície branca, `rounded-2xl`, sombra
  sutil) ou `EditorLayout` (formulário 2/3 + coluna lateral com `Tips` e
  `DangerZone`).
- **Estados semânticos** (`StatusBadge`, `Notice`): verde/âmbar/vermelho
  entram SÓ aqui, em texto pequeno sobre fundo tintado (≥4.5:1). No site
  público a paleta continua azul + terracota.
- **Formulários:** `components/admin/form.tsx` — `Field` (label
  `htmlFor`, dica, erro via `aria-describedby`), `FormSection` (fieldset
  em painel), `FormActions` (salvar + cancelar). Campos com o mesmo foco
  do formulário público de contato.
- **Destrutivo:** `ConfirmAction` em dois passos, foco no "Cancelar";
  nunca `window.confirm`, nunca clique único. Excluir paciente tem tela
  própria (mostra as consultas que vão junto).
- **Listas:** `ListRow` (título clicável, meta, badges, ações) dentro de
  `AdminPanel flush`; `EmptyState` sempre com o próximo passo.
- **Início:** números reais (sem decoração), pendências calculadas do
  banco, próximas consultas e mensagens recentes — a "cara" do dia da
  doutora, não um índice de links.

## Camada rica (issue #71, 2026-09-25)

O usuário avaliou o resultado da #65/#67 como "minimalista até demais".
Esta camada mantém a marca (azul do logo, Fraunces/Inter, arco do
sorriso) e troca a **estratégia de cor**: de contida (fundos claros, azul
só em botão) para **comprometida/drenched** (o azul profundo ocupa o hero,
a abertura das internas, os depoimentos, o rodapé e a barra do painel).
Supera a regra "arco do sorriso só em três lugares" da seção anterior: o
arco agora também é textura, divisor de seção e desenho dos ícones.

### Tokens novos

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--blue-deep` | `#123F5C` | Fundo drenched: hero, `PageHero`, depoimentos, rodapé, barra do painel | branco 11.1:1; `white/85` 8.5:1 |
| `--blue-glow` | `#9AD3F2` | Texto pequeno/ícone azul **sobre** `--blue-deep` | 6.9:1 |
| `--terracotta-soft` | `#F3A583` | Acento terracota **sobre** `--blue-deep` (ícones, estrelas, arco do h1) | 5.6:1 |

Nenhum dos três vai sobre fundo claro. Sobre `--blue-dark` o texto
secundário é `white/90` (5.1:1), não `white/85` (4.8:1, no limite).

### Textura, divisor e ícones

- **`.pattern-arcs`** (`globals.css`): fileiras de arcos do logo em tijolo,
  SVG em data-URI, branco a 7%. **Só sobre azul** (hero, aberturas,
  depoimentos, faixa final, rodapé, barra do painel): nos fundos claros
  virava papel de parede (validação de 2026-09-25). Sempre numa
  `div aria-hidden` absoluta atrás do conteúdo.
- **`SmileDivider`**: borda curva entre seções (o arco esticado na
  largura). Pinta com a cor da seção de baixo; o rodapé o usa puxado com
  margem negativa sobre a última seção.
- **`serviceIcons.tsx`**: 15 ícones da coleção **Griddy Icons** (MIT),
  obtidos com o CLI `better-icons` (Iconify) — uma família odontológica
  num estilo só (aparelho, implante, faceta, canal, extração, coroa, ponte,
  restauração). Preenchidos com `currentColor`; slug sem desenho recebe o
  dente base. `.service-icon` inclina de leve no hover/foco do cartão.
- **Grades de cartões:** ícone **ao lado** do título (círculo tintado),
  nunca num quadrado em cima; o cartão não sobe no hover (só borda e
  fundo respondem); "Saiba mais" é texto sublinhado, sem seta anexada.
  Grupos de `/servicos` sem numeração (não são sequência).

### Composição

- **Home:** hero drenched com a foto num palco em camadas (disco azul,
  anel terracota, foto, selos flutuantes, cada camada com `--depth` própria
  no `TiltFrame`) → faixa terracota em movimento com os fatos → mosaico de
  serviços (um bloco grande, cinco médios, bloco azul de chamada) →
  doutora com duas fotos sobrepostas → três passos sobre o arco desenhado
  → depoimentos em `--blue-deep` com um em destaque → FAQ em blocos
  (aberto = tint + disco azul) → ficha prática em blocos brancos sobre tint
  → faixa final com foto → rodapé.
- **Internas:** `PageHero` drenched com o arco sob o h1 e slot `visual`
  preenchido por `HeroEmblem` (disco azul, anel terracota, flutuando; só
  a partir de `lg`): ícone do serviço em `/servicos/[slug]`, dente em
  `/servicos`, glifo do logo em `/sobre`, retrato em `/equipe`, WhatsApp
  em `/contato`, caneta em `/blog`. Grupos de `/servicos` numerados e
  tintados; fotos em camadas em `/sobre` e `/equipe`.
- **Header:** faixa fina em `--blue-deep` acima do menu, só a partir de
  `lg`, com endereço, horário, telefone e Instagram.
- **Painel:** barra lateral em `--blue-deep` (item ativo = pílula branca),
  login dividido com painel de marca, início com faixa de saudação
  drenched e números com ícone tintado por área. Continua registro
  `product`: sem motion decorativa dentro das telas de trabalho.

### Motion (complementa as anteriores)

- `.float`: selos do hero e emblemas sobem e voltam **uma vez** (3,6 s),
  depois param — abaixo de 5 s, fora do alcance da WCAG 2.2.2. Usa a
  propriedade `translate`, não `transform`, para somar com o `translateZ`
  das camadas 3D.
- `.ticker`: faixa de fatos em loop de 48 s no desktop, com **botão de
  pausa** visível (WCAG 2.2.2), pausa também no hover e com foco dentro.
  No celular fica parada e mostra só 4 fatos.
- `.drift`: formas decorativas derivam no scroll (scroll-driven, só
  elementos `aria-hidden`).
- `.draw-on-scroll`: o arco que liga os passos se desenha conforme a
  seção entra.
- `prefers-reduced-motion`: tudo acima desliga; a faixa de fatos para e
  quebra em linhas, e a cópia do loop some.

### Botões novos

- `outline-inverse`: secundário sobre azul (borda e texto brancos).
- `accent`: terracota com tinta por cima (5.8:1). Nunca no WhatsApp, que
  continua azul.

### Celular (validação e skills de mobile, 2026-09-25)

Aplicado com as skills tailwindcss-mobile-first, responsive-design e
accessibility-compliance, além do impeccable e das Web Interface
Guidelines da Vercel.

- **Alvo de toque de 44 px:** `Button` tem `min-h-11`; links de contato,
  pílulas de serviço, logo e links do rodapé (no celular) também.
- **Barra de contato na zona do polegar** (`MobileActionBar`): WhatsApp +
  Ligar, fixa embaixo abaixo de `lg`, aparece depois de 560 px de rolagem,
  respeita `env(safe-area-inset-bottom)`, fica `inert` quando escondida.
  O rodapé reserva o espaço (`max-lg:pb-28`) para nada ficar coberto.
- **Menus em gaveta** com `overscroll-contain`; `scroll-padding-top` no
  `html` para o header fixo não cobrir foco nem âncora;
  `touch-action: manipulation`.
- Campos de e-mail com `spellCheck={false}`; login do painel compacto no
  celular (só o logo no topo, formulário na primeira tela).

## Azul aceso e revisão anti-IA (issue #73, 2026-09-25)

**Esta seção é a fonte de verdade de cor, tipografia, forma e motion.**
Supera as tabelas de "Cor" e "Tipografia" do topo do arquivo e as partes
de motion da "Camada rica" (ticker, flutuação, parallax, 3D do mouse,
fade no scroll), que ficam como histórico.

Duas decisões do usuário: (1) a direção de cor A, escolhida numa
comparação lado a lado, porque o site estava "com cores muito simples e
sem vida" — a maior área colorida era o marinho `#123F5C`, escuro e pouco
saturado (OKLCH L 0,35, C 0,07), e o site tinha se afastado do azul do
logo; (2) revisar tudo com skills dedicadas a tirar a "cara de IA"
(avoid-ai-design, taste-skill, hallmark, frontend-design, impeccable),
"nem que mude muita coisa".

### Paleta

| Token | Hex | Papel | Contraste |
|---|---|---|---|
| `--blue-dark` | `#0067AB` | Azul vivo: hero, aberturas, faixa final, botões, links | branco 5,95:1; céu 4,88:1 como texto sobre ele |
| `--blue-deep` | `#0C3654` | Marinho: rodapé, barra do topo, barra do painel, disco dos emblemas | branco 12,6:1 |
| `--blue` | `#4590BF` | Cor do logo; só decorativo | — |
| `--blue-glow` | `#CBEEFF` | Texto pequeno claro sobre azul vivo e marinho | 4,88:1 no vivo |
| `--surface-tint` | `#CBEEFF` | Céu: fundo claro com cor (doutora, ficha prática, grupos) | tinta 13,1:1; muted 5,4:1 |
| `--terracotta-tint` | `#FFE6DC` | Pêssego: fundo claro quente (primeira consulta) | tinta 13,4:1; muted 5,5:1 |
| `--terracotta` | `#F27D72` | Coral: faixa de urgência, anel das fotos, arco dos passos | tinta 6,1:1 |
| `--terracotta-text` | `#B24039` | Coral para texto/ícone sobre claro | branco 5,7:1 |
| `--terracotta-soft` | `#FEBFB4` | Coral claro: só ícone/arco sobre azul | 3,8:1 no vivo (não é texto) |
| `--ink` | `#1A222E` | Texto (neutro puxado para o azul da marca) | 16:1 |
| `--ink-muted` | `#515F6E` | Texto secundário | 6,5:1 no branco |

O coral saiu do tom `#E2805E`, que era quase idêntico ao `#D97757` que a
frontend-design e a avoid-ai-design apontam como acento-padrão de IA.
Amarelo ficou de fora de propósito: em clínica odontológica lembra dente
amarelado.

**Ritmo da Home:** azul vivo → coral → céu → branco → pêssego → branco →
céu → azul vivo → marinho. Página clara com abertura e fechamento em cor
de marca; nenhuma seção escura "solta" no meio.

### Tipografia

- **Títulos:** Bricolage Grotesque (variável, eixo de tamanho óptico),
  peso 700 nos h1/h2, 600 nos h3. Grotesca com personalidade, fora das
  listas de "fontes de IA" das skills.
- **Texto:** Lexend (variável), desenhada para facilitar a leitura, com
  zero comum. Atkinson Hyperlegible Next foi testada e descartada: o zero
  cortado fazia horários e telefones parecerem "Ø9hØØ".
- Saíram Fraunces e Inter, apontadas por três skills como a dupla padrão
  de sites gerados. Arquivos em `app/fonts/` com as licenças OFL.
- Sem palavra destacada dentro do título, sem itálico em título, sem
  rótulo em caixa-alta.

### Forma

Regra única: **controles são pílula** (`rounded-full`: botões, chips,
crachá, pausa); **blocos e mídia têm 24 px** (`rounded-3xl`); **campos
têm 12 px** (`rounded-xl`). Cartões sem borda e sem sombra: separam por
fundo (`--surface-sunken` sobre branco, branco sobre céu). Sombra só no
que flutua de verdade: crachá do hero, retrato sobreposto, barra de
contato do celular. Header sólido, sem vidro fosco.

### Composição

- **Ordem da Home** pelo que o paciente decide, não pela cascata de
  landing page: hero → urgência → quem cuida (a doutora) → serviços →
  primeira consulta → dúvidas → onde e quando → chamada final.
- **Hero:** foto no arco com anel coral e crachá; sem selos flutuando,
  sem manchas desfocadas, sem 3D. Rótulo de cidade em texto simples, não
  em pílula.
- **Faixa de urgência** (`UrgencyBar`) no lugar da faixa de fatos em
  movimento: uma informação real e útil, com o número do WhatsApp.
- **Depoimentos** só aparecem quando existe um real; os de exemplo ficam
  no banco até a doutora trocar.
- **Ícones de serviço** ao lado do título, sem círculo tingido; no bloco
  grande, o ícone é a imagem (marca-d'água).
- **Um rótulo por intenção:** todo botão de WhatsApp diz "Agendar pelo
  WhatsApp"; todo link para o formulário diz "Enviar mensagem". Sem seta
  anexada a botão.
- **Rodapé** em três colunas (marca, páginas, contato); a lista de
  serviços saiu (já está em `/servicos`).
- Texto de marketing sem travessão; vírgula ou ponto no lugar.

### Motion

Um momento orquestrado só: a entrada do hero com o arco do sorriso se
desenhando. Além dele, o arco que liga os três passos se desenha no
scroll e o ícone de serviço responde ao hover. A barra de contato do
celular usa IntersectionObserver, sem listener de scroll. Tudo desligado
em `prefers-reduced-motion`.

### Verificação

- avoid-ai-design (scanner): 7 achados antes, 0 depois.
- impeccable (detector no navegador): Home sem nenhum achado.
- Zero overflow a 375 px em todas as páginas públicas.
