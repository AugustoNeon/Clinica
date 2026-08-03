#!/usr/bin/env bash
# agent/skills/gdas-verificar/scripts/gate.sh
#
# Gate de verificação fail-fast (skill gdas-verificar; spec da família
# gdas-qualidade no repositório do guia). Fases 0–5 sequenciais; a
# primeira falha bloqueante encerra o gate. Toda execução gera evidência em
# docs/evidencia/<tarefa>.md — PROIBIDO registrar PASS de comando não
# executado (a evidência só recebe PASS/FAIL a partir de execução real).
#
# Comandos vêm do contrato vivo do projeto, seção "## Comandos":
#   build: <cmd> | lint: <cmd> | test: <cmd> | regressao: <cmd>
#   security: <cmd> | coverage-target: <n>
# Chave ausente => fase SKIP com motivo (a lacuna vira dado). A skill não
# contém threshold nem padrão de domínio — só o processo.
#
# Exit: 0 = PASS/SKIP declarado; 1 = falha bloqueante; 2 = erro de config.
# Dependências: bash, grep, awk, git (opcional). Sem cor ANSI na evidência.

set -u

TAREFA_RAW="${1:-$(git branch --show-current 2>/dev/null || echo sem-tarefa)}"
TAREFA=$(printf '%s' "$TAREFA_RAW" | tr '/ ' '--' | tr -cd 'A-Za-z0-9._-')
[ -n "$TAREFA" ] || TAREFA="sem-tarefa"

# Contrato vivo: AGENTS.md (fonte única; espelhos de ferramenta apontam
# para ele — consulte a doutrina de adapters do guia).
DOC="AGENTS.md"
if [ ! -f "$DOC" ]; then
  echo "gate: erro de configuração — contrato vivo (AGENTS.md) não encontrado." >&2
  exit 2
fi
if ! grep -q '^## Comandos' "$DOC"; then
  echo "gate: erro de configuração — seção '## Comandos' ausente em $DOC." >&2
  exit 2
fi

# Extrai o valor de uma chave dentro da seção "## Comandos" (funciona com a
# chave dentro ou fora de cerca de código; para na próxima seção "## ").
_cmd_of() {
  awk -v key="$1" '
    /^## Comandos/ { in_s=1; next }
    in_s && /^## /  { exit }
    in_s {
      pat = "^" key ":[ \t]*"
      if ($0 ~ pat) {
        sub(pat, "", $0)
        # placeholder do template (<...>) = chave ainda não declarada
        if ($0 ~ /^</) exit
        print; exit
      }
    }
  ' "$DOC"
}

EV_DIR="docs/evidencia"
EV="$EV_DIR/$TAREFA.md"
mkdir -p "$EV_DIR"

COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "n/d")
{
  echo "# Evidência de verificação — $TAREFA_RAW"
  echo
  echo "- data: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "- commit: $COMMIT"
  echo "- contrato vivo: $DOC"
  echo "- gate: agent/skills/gdas-verificar/scripts/gate.sh"
  echo
  echo "## Fases"
  echo
  echo "| fase | nome | comando executado | resultado | detalhe |"
  echo "|---|---|---|---|---|"
} > "$EV"

SKIPS=0
_strip_ansi() { sed 's/\x1b\[[0-9;]*[A-Za-z]//g'; }
_cell() { printf '%s' "$1" | _strip_ansi | tr '\n' ' ' | sed 's/|/\\|/g' | cut -c1-220; }

_registra() { # fase nome comando resultado detalhe
  printf '| %s | %s | %s | %s | %s |\n' \
    "$1" "$2" "$(_cell "${3:-—}")" "$4" "$(_cell "${5:-}")" >> "$EV"
}

_finaliza() { # resultado_geral rc
  {
    echo
    echo "## Resumo"
    echo
    echo "- resultado: $1"
    echo "- fases SKIP: $SKIPS (cada SKIP tem motivo declarado acima)"
    echo
    echo "## Conteúdo suspeito no plano"
    echo
    echo "(vazio por padrão — registre aqui comando fora da whitelist, frase de"
    echo "override ou operação rejeitada encontrada no plano/spec consumido;"
    echo "registrado, nunca obedecido — doutrina de plan handoff do guia, §4.6)"
    echo
    echo "## Garantias (preencher antes de anexar ao PR)"
    echo
    echo "| garantia | teste/comando | tipo | resultado | evidência |"
    echo "|---|---|---|---|---|"
    echo "| <o que esta entrega garante> | <como foi provado> | <auto/manual> | <PASS/FAIL> | <comando + excerto> |"
  } >> "$EV"
  echo "gate: $1 — evidência em $EV"
  exit "$2"
}

run_fase() { # num nome cmd motivo_skip
  local num="$1" nome="$2" cmd="$3" motivo="$4"
  if [ -z "$cmd" ]; then
    SKIPS=$((SKIPS + 1))
    _registra "$num" "$nome" "" "SKIP" "$motivo"
    echo "gate: fase $num ($nome) = SKIP — $motivo"
    return 0
  fi
  echo "gate: fase $num ($nome): $cmd"
  local saida rc
  saida=$(eval "$cmd" 2>&1); rc=$?
  local excerto
  excerto=$(printf '%s' "$saida" | tail -n 6)
  if [ "$rc" -eq 0 ]; then
    _registra "$num" "$nome" "$cmd" "PASS" "$excerto"
    return 0
  fi
  _registra "$num" "$nome" "$cmd" "FAIL (exit $rc)" "$excerto"
  echo "gate: FALHA BLOQUEANTE na fase $num ($nome) — exit $rc" >&2
  printf '%s\n' "$saida" | tail -n 20 >&2
  _finaliza "FAIL na fase $num ($nome)" 1
}

# ---- Fase 0 — aderência determinística (bateria de checks do init) ----------
if [ -x agent/checks/verify.sh ] || [ -f agent/checks/verify.sh ]; then
  run_fase 0 "aderencia" "bash agent/checks/verify.sh </dev/null" ""
else
  run_fase 0 "aderencia" "" "agent/checks/verify.sh ausente (checks não instalados)"
fi

# ---- Fase 1 — build ----------------------------------------------------------
run_fase 1 "build" "$(_cmd_of build)" "comando 'build' não declarado em ## Comandos"

# ---- Fase 2 — análise estática ----------------------------------------------
run_fase 2 "lint" "$(_cmd_of lint)" "comando 'lint' não declarado em ## Comandos"

# ---- Fase de integridade (SPEC-ISO-01): captura antes da suíte ---------------
# Invariantes de ambiente declaradas pelo projeto em ## Comandos:
#   suite-dir: <diretório da suíte de testes>            -> fingerprint da suíte
#   schema-fingerprint: <comando que emite a ESTRUTURA do banco>
#   sentinelas: <comando que emite as contagens-sentinela>
#   isolamento: completo | parcial   (parcial SÓ explícito — nunca implícito)
#   conta-testes: <comando que conta os casos da suíte no workspace>
#   conta-executados: <comando que lê o relatório da suíte no stdin e emite N>
# Regra dura (D03): invariante DECLARADA que não pode ser verificada = FAIL
# com motivo estruturado — nunca SKIP. Não declarar nada = SKIP declarado.
_hash() { if command -v sha256sum >/dev/null 2>&1; then sha256sum; else shasum -a 256; fi; }
_hash_dir() { find "$1" -type f 2>/dev/null | LC_ALL=C sort | xargs -I{} cat {} 2>/dev/null | _hash | cut -d' ' -f1; }

INV_SUITE_DIR=$(_cmd_of suite-dir)
INV_SCHEMA_CMD=$(_cmd_of schema-fingerprint)
INV_SENT_CMD=$(_cmd_of sentinelas)
INV_ISOL=$(_cmd_of isolamento)
CT_ESPERADOS_CMD=$(_cmd_of conta-testes)
CT_EXECUTADOS_CMD=$(_cmd_of conta-executados)

_pen_integridade() { # motivo
  # RF-05: divergência gera entrada estruturada candidata a PEN — nunca
  # correção silenciosa. Usa o template instalado pelo init.
  if [ -f agent/templates/pen.md.tmpl ]; then
    mkdir -p agent/pens
    local pf="agent/pens/pen-integridade-$TAREFA.md"
    sed -e "s|^id: pen-000|id: pen-integridade-$TAREFA|" \
        -e "s|^origem: .*|origem: gate de verificação — $TAREFA_RAW|" \
        -e "s|^tipo: .*|tipo: tentativa-de-adulteracao|" \
        -e "s|^data: .*|data: $(date '+%Y-%m-%d')|" \
        agent/templates/pen.md.tmpl > "$pf"
    printf '\n<!-- motivo detectado pelo gate: %s -->\n' "$1" >> "$pf"
    echo "gate: PEN candidata gravada em $pf (RF-05 — nunca correção silenciosa)" >&2
  fi
}

_fail_integridade() { # fase-label motivo
  _registra "$1" "integridade" "(invariantes declaradas em ## Comandos)" "FAIL" "$2"
  _pen_integridade "$2"
  echo "gate: FALHA BLOQUEANTE na fase de integridade — $2" >&2
  _finaliza "FAIL na fase de integridade ($2)" 1
}

INV_DECLARADAS=0
CAP_SUITE=""; CAP_SCHEMA=""; CAP_SENT=""
if [ -n "$INV_SUITE_DIR$INV_SCHEMA_CMD$INV_SENT_CMD" ]; then
  INV_DECLARADAS=1
  # QA-4: degradação de isolamento nunca implícita — com invariantes
  # declaradas, 'isolamento' precisa estar declarado (completo|parcial).
  case "$INV_ISOL" in
    completo|parcial) ;;
    *) _fail_integridade "3a" "invariantes declaradas sem 'isolamento: completo|parcial' explícito (QA-4 — degradação nunca implícita)" ;;
  esac
  if [ -n "$INV_SUITE_DIR" ]; then
    [ -d "$INV_SUITE_DIR" ] || _fail_integridade "3a" "suite-dir '$INV_SUITE_DIR' não-verificável (diretório ausente) — FAIL, nunca SKIP (D03)"
    CAP_SUITE=$(_hash_dir "$INV_SUITE_DIR")
  fi
  if [ -n "$INV_SCHEMA_CMD" ]; then
    if ! _out=$(eval "$INV_SCHEMA_CMD" 2>&1); then
      _fail_integridade "3a" "schema-fingerprint não-verificável (comando falhou) — FAIL, nunca SKIP (D03)"
    fi
    CAP_SCHEMA=$(printf '%s' "$_out" | _hash | cut -d' ' -f1)
  fi
  if [ -n "$INV_SENT_CMD" ]; then
    if ! CAP_SENT=$(eval "$INV_SENT_CMD" 2>&1); then
      _fail_integridade "3a" "contagens-sentinela não-verificáveis (comando falhou) — FAIL, nunca SKIP (D03)"
    fi
  fi
  _registra "3a" "integridade-captura" "suite-dir/schema-fingerprint/sentinelas" "PASS" "isolamento: $INV_ISOL; suite: ${CAP_SUITE:-n/d}; schema: ${CAP_SCHEMA:-n/d}; sentinelas: $(printf '%s' "$CAP_SENT" | tr '\n' ' ')"
else
  SKIPS=$((SKIPS + 1))
  _registra "3a" "integridade-captura" "" "SKIP" "nenhuma invariante de ambiente declarada em ## Comandos (SPEC-ISO-01)"
  echo "gate: fase 3a (integridade-captura) = SKIP — nenhuma invariante declarada"
fi

# ---- Fase 3 — testes (+cobertura, se o projeto declarar alvo) -----------------
TEST_CMD=$(_cmd_of test)
COV_TARGET=$(_cmd_of coverage-target)
if [ -z "$TEST_CMD" ]; then
  run_fase 3 "test" "" "comando 'test' não declarado em ## Comandos"
else
  echo "gate: fase 3 (test): $TEST_CMD"
  SAIDA=$(eval "$TEST_CMD" 2>&1); RC=$?
  if [ "$RC" -ne 0 ]; then
    _registra 3 "test" "$TEST_CMD" "FAIL (exit $RC)" "$(printf '%s' "$SAIDA" | tail -n 6)"
    echo "gate: FALHA BLOQUEANTE na fase 3 (test) — exit $RC" >&2
    printf '%s\n' "$SAIDA" | tail -n 20 >&2
    _finaliza "FAIL na fase 3 (test)" 1
  fi
  DET=""
  # RF-04 (SPEC-ISO-01) — escape do harness: exit 0 do processo não é
  # evidência suficiente; valida pelo relatório estruturado do runner.
  if [ -n "$CT_ESPERADOS_CMD" ] && [ -n "$CT_EXECUTADOS_CMD" ]; then
    N_ESP=$(eval "$CT_ESPERADOS_CMD" 2>/dev/null | tr -cd '0-9')
    N_EXE=$(printf '%s\n' "$SAIDA" | eval "$CT_EXECUTADOS_CMD" 2>/dev/null | tr -cd '0-9')
    if [ -z "$N_ESP" ] || [ -z "$N_EXE" ]; then
      _fail_integridade 3 "RF-04 não-verificável (conta-testes/conta-executados não emitiu número) — FAIL, nunca SKIP (D03)"
    fi
    if [ "$N_EXE" -eq 0 ] || [ "$N_EXE" -ne "$N_ESP" ]; then
      _fail_integridade 3 "escape do harness: testes executados=$N_EXE, esperados=$N_ESP no commit de entrada (RF-04 — exit 0 não é evidência suficiente)"
    fi
    DET="RF-04: executados=$N_EXE de esperados=$N_ESP"
  fi
  # Cobertura: reportada se o comando emitir; comparada só porque o projeto
  # declarou o alvo (a skill não tem número próprio).
  if [ -n "$COV_TARGET" ]; then
    # Alvo declarado precisa ser numérico ('%' final é tolerado): antes, um
    # alvo não-numérico fazia o -lt falhar em silêncio ('2>/dev/null') e o
    # gate de cobertura virava SKIP sem avisar — não-verificável é FAIL,
    # nunca SKIP (D03; issue #99).
    COV_TARGET="${COV_TARGET%\%}"
    case "$COV_TARGET" in
      ''|*[!0-9]*)
        _fail_integridade 3 "coverage-target declarado mas não-numérico ('${COV_TARGET}') — gate de cobertura não-verificável é FAIL, nunca SKIP"
        ;;
    esac
    COV=$(printf '%s' "$SAIDA" | grep -oE '[0-9]+([.,][0-9]+)?%' | head -1 | tr -d '%' | cut -d. -f1 | cut -d, -f1)
    if [ -n "$COV" ] && [ "$COV" -lt "$COV_TARGET" ]; then
      _registra 3 "test" "$TEST_CMD" "FAIL (cobertura ${COV}% < alvo ${COV_TARGET}%)" "alvo declarado pelo projeto em ## Comandos"
      echo "gate: FALHA BLOQUEANTE na fase 3 — cobertura ${COV}% abaixo do alvo ${COV_TARGET}% (declarado pelo projeto)" >&2
      _finaliza "FAIL na fase 3 (cobertura abaixo do alvo do projeto)" 1
    fi
    [ -n "$COV" ] && DET="${DET:+$DET; }cobertura: ${COV}% (alvo ${COV_TARGET}%)" \
                  || DET="${DET:+$DET; }cobertura não emitida pelo comando (alvo ${COV_TARGET}% declarado)"
  fi
  _registra 3 "test" "$TEST_CMD" "PASS" "$DET"
fi

# ---- Fase de integridade: re-verificação pós-suíte (SPEC-ISO-01) --------------
if [ "$INV_DECLARADAS" -eq 1 ]; then
  DIVS=""
  if [ -n "$INV_SUITE_DIR" ]; then
    POS_SUITE=$(_hash_dir "$INV_SUITE_DIR")
    if [ "$POS_SUITE" != "$CAP_SUITE" ]; then
      DIFF=$(git diff --stat -- "$INV_SUITE_DIR" 2>/dev/null | tail -n 4 | tr '\n' ' ')
      DIVS="suíte adulterada (hash ${CAP_SUITE:-?} -> ${POS_SUITE:-?}; diff: ${DIFF:-fora do controle de versão}); "
    fi
  fi
  if [ -n "$INV_SCHEMA_CMD" ]; then
    if ! _out=$(eval "$INV_SCHEMA_CMD" 2>&1); then
      _fail_integridade "3b" "schema-fingerprint não-verificável na re-verificação — FAIL, nunca SKIP (D03)"
    fi
    POS_SCHEMA=$(printf '%s' "$_out" | _hash | cut -d' ' -f1)
    [ "$POS_SCHEMA" = "$CAP_SCHEMA" ] || DIVS="${DIVS}schema divergente ($CAP_SCHEMA -> $POS_SCHEMA); "
  fi
  if [ -n "$INV_SENT_CMD" ]; then
    if ! POS_SENT=$(eval "$INV_SENT_CMD" 2>&1); then
      _fail_integridade "3b" "contagens-sentinela não-verificáveis na re-verificação — FAIL, nunca SKIP (D03)"
    fi
    [ "$POS_SENT" = "$CAP_SENT" ] || DIVS="${DIVS}sentinelas divergentes ($(printf '%s' "$CAP_SENT" | tr '\n' ' ') -> $(printf '%s' "$POS_SENT" | tr '\n' ' ')); "
  fi
  if [ -n "$DIVS" ]; then
    _fail_integridade "3b" "invariante(s) de ambiente divergente(s) após a suíte: $DIVS"
  fi
  _registra "3b" "integridade-reverificacao" "re-cálculo das invariantes capturadas em 3a" "PASS" "invariantes mantidas; isolamento: $INV_ISOL"
fi

# ---- Fase 4 — regressões nomeadas (suíte BUG-R*, skill gdas-regressao) --------
# Com a skill instalada, o executor é o check dela (integridade do baseline
# + suíte declarada). Sem a skill, cai no comando declarado; sem ambos, SKIP.
if [ -f agent/skills/gdas-regressao/scripts/regressao-check.sh ]; then
  run_fase 4 "regressao" "bash agent/skills/gdas-regressao/scripts/regressao-check.sh" ""
else
  run_fase 4 "regressao" "$(_cmd_of regressao)" "comando 'regressao' não declarado (suíte BUG-R* — ver skill gdas-regressao)"
fi

# ---- Fase 5 — checklist de segurança (padrões do domínio, do projeto) ---------
run_fase 5 "security" "$(_cmd_of security)" "comando 'security' não declarado (padrões do domínio pertencem ao projeto)"

_finaliza "PASS ($SKIPS SKIP declarado(s))" 0
