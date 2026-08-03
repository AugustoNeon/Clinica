#!/usr/bin/env bash
# agent/skills/gdas-stocktake/scripts/scan.sh
#
# Inventário da Camada A: enumera os paths do escopo DECLARADO
# (agent/stocktake/escopo.txt — RF-01, sem descoberta implícita) e emite
# TSV `path<TAB>sha256` em stdout. Cria o escopo com defaults na 1ª
# execução. >30 itens = aviso de sprawl (não paralelize; reduza escopo).

set -u
ST_DIR="agent/stocktake"
ESCOPO="$ST_DIR/escopo.txt"

_hash() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1"; else shasum -a 256 "$1"; fi; }

if [ ! -f "$ESCOPO" ]; then
  mkdir -p "$ST_DIR"
  {
    echo "# escopo declarado do stocktake (RF-01) — um path por linha; dirs são varridos (*.md/*.sh)"
    echo "AGENTS.md"
    echo "agent/playbooks"
    echo "agent/skills"
    echo "agent/checks"
  } > "$ESCOPO"
  echo "stocktake: escopo semeado em $ESCOPO — revise antes do primeiro Full." >&2
fi

N=0
while IFS= read -r p; do
  case "$p" in \#*|"") continue ;; esac
  if [ -f "$p" ]; then
    _hash "$p" | awk -v f="$p" '{print f "\t" $1}'
    N=$((N + 1))
  elif [ -d "$p" ]; then
    while IFS= read -r f; do
      _hash "$f" | awk -v f="$f" '{print f "\t" $1}'
      N=$((N + 1))
    done < <(find "$p" -type f \( -name '*.md' -o -name '*.sh' \) 2>/dev/null | LC_ALL=C sort)
  else
    echo "stocktake: aviso — path declarado ausente: $p (o escopo é ele próprio auditável)" >&2
  fi
done < "$ESCOPO"

if [ "$N" -gt 30 ]; then
  echo "stocktake: AVISO DE SPRAWL — inventário com $N itens (>30). Reduza o escopo antes de pensar em paralelização." >&2
fi
