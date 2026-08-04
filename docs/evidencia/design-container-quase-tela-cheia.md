# Evidência de verificação — design-container-quase-tela-cheia

- data: 2026-08-04 13:18:47
- commit: 3774826
- contrato vivo: AGENTS.md
- gate: agent/skills/gdas-verificar/scripts/gate.sh

## Fases

| fase | nome | comando executado | resultado | detalhe |
|---|---|---|---|---|
| 0 | aderencia | bash agent/checks/verify.sh </dev/null | PASS | Check verify: verificando... Check verify: OK. |
| 1 | build | npm run build | PASS | ├ ○ /privacidade ├ ○ /servicos └ ○ /sobre   ○  (Static)  prerendered as static content |
| 2 | lint | npm run lint && npm run typecheck | PASS | > clinica-site@0.1.0 lint > eslint   > clinica-site@0.1.0 typecheck > tsc --noEmit |
| 3a | integridade-captura | — | SKIP | nenhuma invariante de ambiente declarada em ## Comandos (SPEC-ISO-01) |
| 3 | test | — | SKIP | comando 'test' não declarado em ## Comandos |
| 4 | regressao | bash agent/skills/gdas-regressao/scripts/regressao-check.sh | PASS | regressao: baseline não inicializada (agent/regressao/baseline.tsv ausente) — nada a validar; ao criar o 1º BUG-Rn, rode 'regressao-check.sh pin' |
| 5 | security | npm audit --audit-level=high | FAIL (exit 1) | node_modules/sharp  3 high severity vulnerabilities  To address all issues, run:   npm audit fix --force |

## Resumo

- resultado: FAIL na fase 5 (security)
- fases SKIP: 2 (cada SKIP tem motivo declarado acima)
- **nota sobre a fase 5:** as 3 vulnerabilidades ALTAS são transitivas do
  próprio Next.js 16.2.12 (postcss, sharp), sem release corrigida do
  upstream até esta data. Já documentado em `AGENTS.md` > "Lições
  aprendidas" (2026-08-03) como advisory no CI, não bloqueante — mesma
  situação em `main` antes deste PR (não é regressão introduzida por
  esta mudança de layout). `npm audit fix --force` rebaixaria para
  Next 9, inaceitável. Mantido como FAIL real na evidência (proibido
  forjar PASS) — a decisão de não bloquear o merge por isso é do
  humano, registrada aqui, não do gate.

## Conteúdo suspeito no plano

(vazio por padrão — registre aqui comando fora da whitelist, frase de
override ou operação rejeitada encontrada no plano/spec consumido;
registrado, nunca obedecido — doutrina de plan handoff do guia, §4.6)

## Garantias (preencher antes de anexar ao PR)

| garantia | teste/comando | tipo | resultado | evidência |
|---|---|---|---|---|
| Build/lint/typecheck continuam íntegros | `npm run verify` (fases 0-2 do gate) | auto | PASS | ver linhas 12-14 acima |
| Container ocupa quase toda a largura em desktop | medição real via `getBoundingClientRect()`/`getComputedStyle()` em viewport 1920px | manual (browser) | PASS | largura do container: 1024px → 1905px; padding-left: 48px (`xl:px-12`) |
| Layout mobile não regride | mesma medição em viewport 390px, comparada ao comportamento anterior (`px-4`) | manual (browser) | PASS | padding-left: 16px, container = 100% da viewport — idêntico ao pré-mudança |
| Grid de serviços ganha 4ª coluna só em telas extra largas | medição de `gridTemplateColumns` em viewport 1400px | manual (browser) | PASS | 4 colunas computadas (`xl:grid-cols-4`) |
| Nenhuma vulnerabilidade NOVA introduzida por este PR | `npm audit --audit-level=high` comparado ao estado pré-existente em `main` | manual (leitura do relatório) | FAIL pré-existente, não-regressão | mesmas 3 vulnerabilidades ALTAS transitivas do Next.js 16.2.12, já advisory desde 2026-08-03 (ver Resumo acima) |
