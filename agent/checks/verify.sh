#!/usr/bin/env bash
# agent/checks/verify.sh
#
# Bateria de verificacao do projeto. Falha-first: para no primeiro
# erro bloqueante. Acoplavel a tres pontos (qualquer combinacao):
#
#   1. Fim de turno do agente   — via adapter (modo evento)
#   2. pre-commit do git        — ln -s ../../agent/checks/verify.sh .git/hooks/pre-commit
#   3. CI                       — bash agent/checks/verify.sh
#
# Modo evento: se houver JSON no stdin (adapters de ferramenta de
# agente enviam), respeita o guard de iteracao (.iteration ou campo
# equivalente mapeado pelo adapter) para nao entrar em loop.
#
# Convencao de saida: 0 = ok; 2 = bloqueado (corrija antes de seguir).
#
# REGRA: este script tem que ser RAPIDO (<30s). Verificacoes longas
# vao para CI, nao para check de turno.
#
# Cobre tres stacks por deteccao automatica (node, python, go). Se nenhum
# verificador casar e houver diff, emite WARN em vez de "OK" silencioso.

set -e

# ---- Modo evento: stdin JSON (opcional) -------------------------------------
# Le stdin se nao for tty (piped). 'read -t 0' e instavel no bash 3.2
# (macOS, alvo declarado) e anulava o guard de iteracao (fail-OPEN em loop
# de turno) — a guarda e apenas '[ ! -t 0 ]', como em data-corrente.sh /
# estado-fluxo.sh (issue #97). Em CI stdin e /dev/null: cat retorna vazio.
if [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
  if [ -n "$INPUT" ] && command -v jq >/dev/null 2>&1; then
    ITERATION=$(echo "$INPUT" | jq -r '.iteration // .stop_hook_active // false' 2>/dev/null || echo "false")
    if [ "$ITERATION" = "true" ]; then
      exit 0
    fi
  fi
fi

CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || true)
STAGED_FILES=$(git diff --name-only --cached 2>/dev/null || true)
UNTRACKED_FILES=$(git ls-files --others --exclude-standard 2>/dev/null || true)
if [ -z "$CHANGED_FILES" ] && [ -z "$STAGED_FILES" ] && [ -z "$UNTRACKED_FILES" ]; then
  exit 0
fi

echo "Check verify: verificando..."

fail() { echo "$1 Corrija antes de devolver controle." >&2; exit 2; }

STACK_FOUND=0

# ----- Senior baseline (subconjunto agnostico dos 12 zeros) ------------------
# Roda primeiro: secret/operacao destrutiva no diff bloqueia antes de
# gastar lint/types/tests. Cobre itens 4, 7, 11 (ver senior-baseline.sh).
SB="$(dirname "$0")/senior-baseline.sh"
[ -f "$SB" ] && { bash "$SB" || fail "Senior baseline falhou."; }

# ----- Node ------------------------------------------------------------------
if [ -f package.json ]; then
  STACK_FOUND=1
  if grep -q '"lint"' package.json; then
    npm run lint --silent 2>&1 || fail "Lint falhou."
  fi
  if [ -f tsconfig.json ]; then
    npx --no-install tsc --noEmit 2>&1 || fail "Typecheck falhou."
  fi
  if grep -q '"test"' package.json; then
    # escopo reduzido quando o runner suporta; fallback: suite completa
    npm test --silent 2>&1 || fail "Testes falharam."
  fi
fi

# ----- Python ----------------------------------------------------------------
if [ -f pyproject.toml ] || [ -f setup.py ]; then
  STACK_FOUND=1
  if command -v ruff >/dev/null 2>&1; then
    ruff check . 2>&1 || fail "Lint (ruff) falhou."
  fi
  if command -v mypy >/dev/null 2>&1 && [ -f pyproject.toml ] && grep -q 'mypy' pyproject.toml; then
    mypy . 2>&1 || fail "Typecheck (mypy) falhou."
  fi
  if command -v pytest >/dev/null 2>&1; then
    rc=0; pytest -q 2>&1 || rc=$?
    # exit 5 = nenhum teste coletado (projeto novo) — nao e falha
    if [ "$rc" -ne 0 ] && [ "$rc" -ne 5 ]; then fail "Testes (pytest) falharam."; fi
  fi
fi

# ----- Go --------------------------------------------------------------------
if [ -f go.mod ]; then
  STACK_FOUND=1
  go vet ./... 2>&1 || fail "go vet falhou."
  go test ./... 2>&1 || fail "go test falhou."
fi

if [ "$STACK_FOUND" -eq 0 ]; then
  printf 'Check verify: WARN — nenhum verificador configurado para esta stack.\n' >&2
  printf 'Adapte agent/checks/verify.sh ao seu projeto (consulte a doutrina de adapters do GDAS).\n' >&2
  exit 0
fi
echo "Check verify: OK."
exit 0
