#!/usr/bin/env bash
# agent/skills/gdas-stocktake/scripts/diff.sh
#
# Quick Scan + registro de vereditos do stocktake (requer jq).
#
#   (sem args)                     lista pendências: NOVO/ALTERADO (reavaliar)
#                                  e CACHE (hash inalterado, veredito válido)
#   registrar <path> <veredito> <reason...>
#                                  grava veredito; Retire/Merge geram PEN
#   concluir                       marca o passe como completed
#
# results.json (agent/stocktake/): cache por SHA-256 de conteúdo (nunca
# mtime — RF-05) com status in_progress|completed para retomada.
# Vereditos: Keep|Improve|Update|Retire|Merge (RF-03). O reason é
# obrigatório e auto-contido (RF-04). Veredito nunca executa (RF-06).

set -u
ST_DIR="agent/stocktake"
RES="$ST_DIR/results.json"
SCAN="$(dirname "$0")/scan.sh"

command -v jq >/dev/null 2>&1 || { echo "stocktake: jq é necessário." >&2; exit 2; }
mkdir -p "$ST_DIR"
[ -f "$RES" ] || printf '{ "status": "in_progress", "itens": {} }\n' > "$RES"

case "${1:-}" in
  registrar)
    shift
    P="${1:-}"; V="${2:-}"; shift 2 || true; R="${*:-}"
    case "$V" in Keep|Improve|Update|Retire|Merge) ;; *)
      echo "stocktake: veredito inválido '$V' (Keep|Improve|Update|Retire|Merge)" >&2; exit 2 ;; esac
    if [ -z "$R" ] || [ "${#R}" -lt 20 ]; then
      echo "stocktake: reason obrigatório e auto-contido (RF-04) — proibido veredito seco." >&2; exit 2
    fi
    [ -f "$P" ] || { echo "stocktake: path inexistente: $P" >&2; exit 2; }
    H=$( (command -v sha256sum >/dev/null 2>&1 && sha256sum "$P" || shasum -a 256 "$P") | cut -d' ' -f1)
    jq --arg p "$P" --arg h "$H" --arg v "$V" --arg r "$R" --arg d "$(date '+%Y-%m-%d')" \
      '.status = "in_progress" | .itens[$p] = {hash: $h, veredito: $v, reason: $r, avaliado_em: $d}' \
      "$RES" > "$RES.tmp" && mv "$RES.tmp" "$RES"
    echo "stocktake: $P = $V"
    # RF-06: veredito destrutivo não executa — vira PEN para o humano.
    if [ "$V" = "Retire" ] || [ "$V" = "Merge" ]; then
      if [ -f agent/templates/pen.md.tmpl ]; then
        mkdir -p agent/pens
        PID="pen-stocktake-$(printf '%s' "$P" | sed 's/\.[a-z]*$//' | tr '/ .' '---' | tr -cd 'A-Za-z0-9_-')"
        sed -e "s|^id: pen-000|id: $PID|" \
            -e "s|^origem: .*|origem: stocktake — $P|" \
            -e "s|^tipo: .*|tipo: $(printf '%s' "$V" | tr 'A-Z' 'a-z')|" \
            -e "s|^data: .*|data: $(date '+%Y-%m-%d')|" \
            agent/templates/pen.md.tmpl > "agent/pens/$PID.md"
        printf '\n## Reason do veredito (RF-04)\n\n%s\n' "$R" >> "agent/pens/$PID.md"
        echo "stocktake: PEN gerada em agent/pens/$PID.md — arquivo intacto; o humano dispõe."
      else
        echo "stocktake: aviso — agent/templates/pen.md.tmpl ausente; registre a PEN manualmente (RF-06)." >&2
      fi
    fi
    ;;
  concluir)
    PEND=$(bash "$SCAN" 2>/dev/null | while IFS=$'\t' read -r p h; do
      jq -e --arg p "$p" --arg h "$h" '.itens[$p].hash == $h' "$RES" >/dev/null 2>&1 || echo "$p"
    done)
    if [ -n "$PEND" ]; then
      echo "stocktake: itens ainda pendentes — não conclui:" >&2
      printf '%s\n' "$PEND" >&2
      exit 1
    fi
    jq '.status = "completed" | .concluido_em = (now | strftime("%Y-%m-%d"))' "$RES" > "$RES.tmp" && mv "$RES.tmp" "$RES"
    echo "stocktake: passe concluído (status: completed)."
    ;;
  "")
    STATUS=$(jq -r '.status // "in_progress"' "$RES")
    N_REAV=0; N_CACHE=0
    while IFS=$'\t' read -r p h; do
      [ -n "$p" ] || continue
      if jq -e --arg p "$p" --arg h "$h" '.itens[$p].hash == $h' "$RES" >/dev/null 2>&1; then
        v=$(jq -r --arg p "$p" '.itens[$p].veredito' "$RES")
        echo "CACHE     $p ($v)"
        N_CACHE=$((N_CACHE + 1))
      else
        if jq -e --arg p "$p" '.itens[$p]' "$RES" >/dev/null 2>&1; then
          echo "ALTERADO  $p (reavaliar — hash mudou desde o último veredito)"
        else
          echo "NOVO      $p (avaliar contra o checklist RF-02)"
        fi
        N_REAV=$((N_REAV + 1))
      fi
    done < <(bash "$SCAN")
    echo "---"
    echo "stocktake: status=$STATUS; a reavaliar=$N_REAV; em cache=$N_CACHE"
    [ "$N_REAV" -gt 0 ] && echo "stocktake: avalie os pendentes (RF-02) e grave com 'diff.sh registrar <path> <veredito> \"<reason>\"'."
    ;;
  *)
    echo "uso: diff.sh [registrar <path> <veredito> <reason...> | concluir]" >&2; exit 2 ;;
esac
