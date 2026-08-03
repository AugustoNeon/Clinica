#!/usr/bin/env bash
# agent/skills/gdas-regressao/scripts/regressao-check.sh
#
# Integridade do baseline de regressões nomeadas (BUG-R*) + execução da
# suíte declarada. É o executor da Fase 4 do gate de verificação.
#
#   (sem args)  valida o baseline e roda `## Comandos > regressao` se declarado
#   pin         re-registra o baseline a partir dos testes BUG-R* presentes
#
# Baseline: agent/regressao/baseline.tsv (estado do consumidor; NÃO é
# arquivo gerenciado — o update nunca o toca). Formato TSV:
#   id <TAB> caminho <TAB> origem <TAB> garante
# Cabeçalho: linhas '# pinada-em: <commit>' e '# pinada-data: <data>'.
#
# Regra dura (RF-05): entrada do baseline cujo arquivo sumiu ou perdeu o
# cabeçalho = FAIL apontando o teste — remoção legítima exige PEN
# referenciada e re-pinagem no MESMO commit (agent/templates/pen.md.tmpl).
#
# Exit: 0 = ok; 1 = violação de baseline ou suíte falhou.

set -u

BASE_DIR="agent/regressao"
BASE="$BASE_DIR/baseline.tsv"

# Descobre testes nomeados: arquivos rastreados contendo o cabeçalho
# 'id: BUG-R<n>' (comentário ou frontmatter — RNF-02: parseável).
_descobre() {
  { git grep -lE '(^|[[:space:];#*/-])id:[ \t]*BUG-R[0-9]+' -- . 2>/dev/null \
    || grep -rlE '(^|[[:space:];#*/-])id:[ \t]*BUG-R[0-9]+' --exclude-dir=.git . 2>/dev/null; } \
    | grep -v "^$BASE_DIR/" | sort -u
}

_ids_do_arquivo() {
  grep -oE 'id:[ \t]*BUG-R[0-9]+' "$1" 2>/dev/null | grep -oE 'BUG-R[0-9]+' | sort -u
}

if [ "${1:-}" = "pin" ]; then
  mkdir -p "$BASE_DIR"
  {
    echo "# baseline de regressões nomeadas (skill gdas-regressao)"
    echo "# pinada-em: $(git rev-parse --short HEAD 2>/dev/null || echo n/d)"
    echo "# pinada-data: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "# remoção de linha exige PEN referenciada no commit (RF-05)"
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      for id in $(_ids_do_arquivo "$f"); do
        origem=$(grep -oE 'origem:[ \t]*[^ \t].*' "$f" | head -1 | sed 's/^origem:[ \t]*//' | tr '\t' ' ')
        garante=$(grep -oE 'garante:[ \t]*[^ \t].*' "$f" | head -1 | sed 's/^garante:[ \t]*//' | tr '\t' ' ')
        printf '%s\t%s\t%s\t%s\n' "$id" "${f#./}" "${origem:-?}" "${garante:-?}"
      done
    done < <(_descobre)
  } > "$BASE"
  n=$(grep -cv '^#' "$BASE" 2>/dev/null || echo 0)
  echo "regressao: baseline pinada com $n teste(s) em $BASE"
  exit 0
fi

FAIL=0
if [ -f "$BASE" ]; then
  N_BASE=0; N_OK=0
  while IFS=$'\t' read -r id caminho origem garante; do
    case "$id" in \#*|"") continue ;; esac
    N_BASE=$((N_BASE + 1))
    if [ ! -f "$caminho" ]; then
      echo "regressao: VIOLAÇÃO — $id removido ($caminho ausente) sem re-pinagem; remoção exige PEN referenciada no commit (baseline: $BASE)" >&2
      FAIL=1
    elif ! grep -qE "id:[ \t]*$id\b" "$caminho" 2>/dev/null; then
      echo "regressao: VIOLAÇÃO — $caminho perdeu o cabeçalho de $id; alteração exige PEN referenciada (baseline: $BASE)" >&2
      FAIL=1
    else
      N_OK=$((N_OK + 1))
    fi
  done < "$BASE"
  PIN=$(grep -m1 '^# pinada-em:' "$BASE" | sed 's/^# pinada-em:[ \t]*//')
  echo "regressao: baseline ${N_BASE} teste(s) (pinada em ${PIN:-?}) -> atual ${N_OK} presente(s)"
  # Testes novos ainda não pinados: aviso, não falha (pinagem é passo do RF-01).
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    for id in $(_ids_do_arquivo "$f"); do
      grep -qE "^$id	" "$BASE" || echo "regressao: aviso — $id ($f) ainda não pinado; rode 'regressao-check.sh pin'"
    done
  done < <(_descobre)
else
  echo "regressao: baseline não inicializada ($BASE ausente) — nada a validar; ao criar o 1º BUG-Rn, rode 'regressao-check.sh pin'"
fi

[ "$FAIL" -ne 0 ] && exit 1

# Suíte declarada pelo projeto (a skill não inventa runner).
# GDAS_REGRESSAO_NO_SUITE=1: só a integridade do baseline — para quando o
# próprio comando `regressao` do projeto invoca este check (evita recursão).
if [ "${GDAS_REGRESSAO_NO_SUITE:-0}" = "1" ]; then exit 0; fi
CMD=$(awk '
  /^## Comandos/ { in_s=1; next }
  in_s && /^## /  { exit }
  in_s { pat = "^regressao:[ \t]*"
    if ($0 ~ pat) { sub(pat, "", $0); if ($0 !~ /^</) print; exit } }
' AGENTS.md 2>/dev/null)
if [ -n "$CMD" ]; then
  echo "regressao: executando suíte declarada: $CMD"
  eval "$CMD" || { echo "regressao: suíte declarada falhou" >&2; exit 1; }
fi
exit 0
