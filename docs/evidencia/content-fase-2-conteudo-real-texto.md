# Evidência de verificação — content-fase-2-conteudo-real-texto

- data: 2026-08-04 13:21:20
- commit: ea95c39
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

## Conteúdo suspeito no plano

(vazio por padrão — registre aqui comando fora da whitelist, frase de
override ou operação rejeitada encontrada no plano/spec consumido;
registrado, nunca obedecido — doutrina de plan handoff do guia, §4.6)

## Garantias (preencher antes de anexar ao PR)

| garantia | teste/comando | tipo | resultado | evidência |
|---|---|---|---|---|
| Build, lint, typecheck e regressão passam; fase de segurança bloqueia (vulnerabilidade transitiva conhecida) | `bash agent/skills/gdas-verificar/scripts/gate.sh content-fase-2-conteudo-real-texto` | auto | PASS (fases 0/1/2/4); FAIL (fase 5) | Fases 0,1,2 = PASS; 3a/3 = SKIP declarado (sem invariante/suite); 4 = PASS (baseline de regressão ainda não inicializada, nada a validar); 5 = FAIL — `npm audit` acusa 3 vulns HIGH em `node_modules/sharp`/`postcss` transitivas do próprio Next.js 16.2.12. Isso é a mesma vulnerabilidade já registrada em AGENTS.md > "Lições aprendidas" (2026-08-03), advisory desde o setup do repo — **não é regressão introduzida por esta branch de conteúdo** (esta PR não tocou em `package.json`/deps). `npm audit fix --force` rebaixaria o Next para v9, inaceitável; fica advisory até o upstream publicar correção. |
| Nenhum dado de clínica (nome/endereço/telefone/e-mail/horário/serviço/nome-CRO-bio de dentista) foi inventado em `lib/data/{siteSettings,services,team}.ts`; campo não informado pela cliente continua vazio/placeholder | Revisão manual, campo a campo: `git diff main...content/fase-2-conteudo-real-texto -- lib/data/siteSettings.ts lib/data/services.ts lib/data/team.ts` comparado literalmente contra `questionario_respostas_clinica.md` (memória do usuário — registro das respostas reais da cliente) | manual | PASS | Comparação campo a campo: `clinic_name`, `clinic_tagline`, `address`, `phone`, `whatsapp`, `email`, `opening_hours` batem literalmente com o texto do questionário. Lista de 15 serviços bate 1:1 com a lista literal da cliente (14 itens da pergunta de serviços + "Reabilitação oral" citado à parte como carro-chefe, corretamente posto em `order: 1`) — nenhum serviço a mais, nenhum faltando. `team.ts`: nome real ("Dra. Ariane Vaz Storrer"), mas `cro_number` e `bio` continuam `null`/placeholder-rotulado como a cliente pediu ("prefiro não relatar" / bio ainda não enviada) — não foi preenchido texto plausível no lugar. `facebook_url` e `maps_url` continuam `""` (a cliente não informou). O que TERIA reprovado este teste: qualquer nome, número de telefone, endereço, CRO ou bio preenchidos com texto plausível não presente no arquivo de memória — não ocorreu. Duas observações menores, não classificadas como fabricação: (1) `instagram_url` foi montado como URL canônica (`https://instagram.com/arianevstorrer`) a partir do handle `@arianevstorrer` citado no questionário — é transformação determinística do dado real, não um dado novo; (2) `team.ts.role = "Cirurgiã-Dentista"` não aparece verbatim no questionário (que não tem pergunta de cargo/título) — é o título profissional padrão e legalmente único de quem exerce odontologia no Brasil, sem alegar especialização; ainda assim, por rigor, fica sinalizado aqui para o humano confirmar/ajustar se quiser. As descrições de cada serviço (texto explicativo curto) também não são verbatim do questionário — são texto genérico descrevendo o procedimento (não citam fato específico da clínica: sem preço, sem "anos de experiência", sem alegação verificável) — não constitui dado de clínica inventado no sentido do AGENTS.md, mas registrado para transparência. |
