#!/usr/bin/env bash
# agent/checks/data-corrente.sh
#
# Verifica se a data corrente esta disponivel no contexto da sessao.
# Adapters que nao injetam a data fazem o modelo assumir a data do
# knowledge cutoff e gerar timestamps errados sem avisar.
#
# ESCOPO HONESTO: este check nao valida que o MODELO conhece a data —
# valida que o AMBIENTE a fornece em ISO 8601. O adapter e responsavel
# por injetar a data no contexto (system prompt ou evento de sessao).
#
# Uso:
#   bash agent/checks/data-corrente.sh                 # CLI: resolve via 'date'
#   bash agent/checks/data-corrente.sh 2026-06-12      # CLI: valida data fornecida
#   bash agent/checks/data-corrente.sh --strict        # falha se data nao injetada
#   echo '{"current_date":"2026-06-12"}' | bash agent/checks/data-corrente.sh  # JSON stdin
#
# Convencao de saida: 0 = ok ou warn sem --strict | 1 = falha em --strict

set -u
shopt -s nullglob

STRICT=0
DATE_ARG=""

for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) DATE_ARG="$arg" ;;
    *) printf "uso: bash %s [--strict] [AAAA-MM-DD]\n" "$0" >&2; exit 2 ;;
  esac
done

if [ -t 1 ]; then
  C_RED='\033[31m'; C_YEL='\033[33m'; C_GRN='\033[32m'; C_RST='\033[0m'
else
  C_RED=''; C_YEL=''; C_GRN=''; C_RST=''
fi

echo "data-corrente"
echo "---"

# ---------------------------------------------------------------------------
# Resolucao da data: argumento > JSON stdin > comando 'date'
# ---------------------------------------------------------------------------
DATE_VAL="$DATE_ARG"

# JSON stdin: aceita {"current_date":"AAAA-MM-DD"} como os demais checks.
# Le stdin se nao for tty (piped). 'read -t 0' e instavel no bash 3.2,
# entao a guarda e apenas '[ ! -t 0 ]'.
if [ -z "$DATE_VAL" ] && [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
  if [ -n "$INPUT" ] && command -v jq >/dev/null 2>&1; then
    DATE_VAL=$(printf '%s' "$INPUT" | jq -r '.current_date // empty' 2>/dev/null || true)
  fi
fi

# ---------------------------------------------------------------------------
# Avaliacao
# ---------------------------------------------------------------------------
if [ -n "$DATE_VAL" ]; then
  # Valida formato ISO 8601 AAAA-MM-DD
  if printf '%s' "$DATE_VAL" | grep -qE '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$'; then
    printf "${C_GRN}OK${C_RST}   data corrente: %s\n" "$DATE_VAL"
    echo "---"
    exit 0
  else
    printf "${C_RED}CRITICO${C_RST}  data nao esta em ISO 8601 (AAAA-MM-DD): %s\n" "$DATE_VAL"
    echo "---"
    exit 1
  fi
fi

# Data nao fornecida pelo adapter: resolver via 'date' e emitir WARN
SYS_DATE=$(date +%Y-%m-%d 2>/dev/null || echo "")

if [ -z "$SYS_DATE" ]; then
  printf "${C_RED}CRITICO${C_RST}  comando 'date' falhou — ambiente sem tooling de data\n"
  echo "---"
  exit 1
fi

printf "${C_YEL}WARN${C_RST}     data resolvida pelo sistema: %s\n" "$SYS_DATE"
printf "         O adapter deve injetar a data no contexto do agente.\n"
printf "         Sem isso, o agente usa o knowledge cutoff como referencia\n"
printf "         e gera timestamps errados sem avisar.\n"
printf "         Como injetar: adicione ao system prompt ou ao AGENTS.md:\n"
printf '           Data atual: $(date +%%Y-%%m-%%d)\n'
echo "---"
printf "Resumo: ${C_YEL}WARN${C_RST} — data nao injetada pelo adapter\n"

if [ "$STRICT" -eq 1 ]; then
  exit 1
fi
exit 0
