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
| `--blue` | `#4590BF` | Cor da marca — CTA primário, links grandes, footer sólido | 3.3:1 sobre branco (só texto grande/ícone; não usar para texto pequeno) |
| `--blue-dark` | `#1D6A96` | Hover/active de CTA, link de texto pequeno sobre branco | 5.9:1 sobre `--surface` |
| `--terracotta` | `#E2805E` | Badge/tag preenchido (com `--ink` por cima, nunca texto branco) | 5.8:1 (`--ink` sobre terracotta) |
| `--terracotta-text` | `#B8492E` | Link/ícone/texto pequeno terracota sobre branco | 5.2:1 sobre `--surface` |
| `--terracotta-tint` | `#FFEAE3` | Fundo de badge/callout | — |

Regra de uso: **`--blue` não é texto pequeno em fundo branco** (falha
AA) — para link ou texto azul, usar `--blue-dark`. Mesma lógica pro
terracota: `--terracotta` é fundo/preenchimento, `--terracotta-text` é
a versão pra texto/ícone sobre branco.

Como esses valores foram derivados: `--blue` veio direto do PNG do
logo (`public/images/logo/logo-stacked-color.png`, cor dominante
extraída por script). Os demais são a mesma família em OKLCH
(`oklch(0.626 0.103 238.9)` como base do azul), ajustando L/C pra bater
contraste — não são cores inventadas soltas, são a marca esticada em
uma escala.

## Tipografia

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
