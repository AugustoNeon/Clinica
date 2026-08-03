#!/usr/bin/env bash
# agent/checks/estado-fluxo.sh
#
# Emite o ESTADO DO FLUXO no inicio da sessao: demandas abertas do repo
# (e, por convencao, ponteiros pendentes). O agente abre a sessao sabendo a
# posicao do trabalho em vez de depender de prosa que dilui conforme o
# contexto cresce ou de memoria que envelhece (DEC-028 — passo load-bearing
# vira gatilho, nao prescricao).
#
# ESCOPO HONESTO: este check nao conhece o forge. A consulta concreta e
# neutra: o adapter fornece o comando de listagem em $GDAS_FORGE_ISSUES (CLI
# do forge ou curl da API). Sem isso, emite WARN e instrui a configurar.
#
# Uso:
#   bash agent/checks/estado-fluxo.sh            # roda $GDAS_FORGE_ISSUES
#   bash agent/checks/estado-fluxo.sh --strict   # falha se nao configurado
#   echo '{"forge_issues_cmd":"..."}' | bash agent/checks/estado-fluxo.sh  # JSON stdin
#
# Convencao de saida: 0 = ok ou warn sem --strict | 1 = falha em --strict
set -u

STRICT=0
for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) printf "uso: bash %s [--strict]\n" "$0" >&2; exit 2 ;;
  esac
done

if [ -t 1 ]; then
  C_YEL='\033[33m'; C_GRN='\033[32m'; C_RST='\033[0m'
else
  C_YEL=''; C_GRN=''; C_RST=''
fi

echo "estado-fluxo"
echo "---"

CMD="${GDAS_FORGE_ISSUES:-}"

# JSON stdin: aceita {"forge_issues_cmd":"..."} como os demais checks.
# 'read -t 0' e instavel no bash 3.2, entao a guarda e apenas '[ ! -t 0 ]'.
if [ -z "$CMD" ] && [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
  if [ -n "$INPUT" ] && command -v jq >/dev/null 2>&1; then
    CMD=$(printf '%s' "$INPUT" | jq -r '.forge_issues_cmd // empty' 2>/dev/null || true)
  fi
fi

if [ -n "$CMD" ]; then
  printf "${C_GRN}OK${C_RST}   demandas abertas (fonte: forge):\n"
  sh -c "$CMD" 2>/dev/null || printf "         (consulta ao forge falhou — verifique \$GDAS_FORGE_ISSUES)\n"
  echo "---"
  exit 0
fi

printf "${C_YEL}WARN${C_RST}     comando de listagem de demandas nao configurado.\n"
printf "         O adapter deve injetar o estado do fluxo no inicio da sessao.\n"
printf "         Sem isso, o agente nao ve as demandas abertas e re-deriva o\n"
printf "         fluxo de memoria que envelhece (DEC-028).\n"
printf "         Como configurar: defina \$GDAS_FORGE_ISSUES com o comando de\n"
printf "         listagem do seu forge (ver o adapter do projeto).\n"
echo "---"
printf "Resumo: ${C_YEL}WARN${C_RST} — estado do fluxo nao injetado pelo adapter\n"

[ "$STRICT" -eq 1 ] && exit 1
exit 0
