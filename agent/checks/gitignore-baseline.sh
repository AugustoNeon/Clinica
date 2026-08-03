#!/usr/bin/env bash
# agent/checks/gitignore-baseline.sh
#
# Check de ADERENCIA do .gitignore ao piso de segredo. Le os padroes
# minimos de files.gitignore_baseline do policy.json (FONTE UNICA, sintaxe
# .gitignore) e FALHA se algum nao estiver presente no .gitignore do repo.
# Check ESTRUTURAL (presenca de linha exata), nao semantico: nao interpreta
# glob nem avalia efeito — so verifica que a linha esta la. Espelha o estilo
# de protect-paths.sh; mantenha as duas superficies coerentes com o baseline.
#
# Uso:
#   gitignore-baseline.sh                       # .gitignore + agent/policy.json (cwd)
#   gitignore-baseline.sh <gitignore> <policy>  # caminhos explicitos (util em teste)
#
# Convencao de saida: 0 = ok (baseline satisfeito); 2 = bloqueado (padrao
# de segredo ausente — corrija antes de seguir). Semear o piso: `gdas init`
# mescla docs/templates/gitignore.base de forma idempotente.

set -e

GITIGNORE="${1:-.gitignore}"

# Localiza o policy.json: 2o argumento > agent/policy.json > fallback template.
POLICY="${2:-}"
if [ -z "$POLICY" ]; then
  for p in agent/policy.json docs/templates/policy/bare.json; do
    [ -f "$p" ] && { POLICY="$p"; break; }
  done
fi

if [ -z "$POLICY" ] || [ ! -f "$POLICY" ]; then
  echo "gitignore-baseline: policy.json nao encontrado — check pulado." >&2
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "gitignore-baseline: jq ausente — check pulado (instale jq para impor o baseline)." >&2
  exit 0
fi

# Sem bloco gitignore_baseline: nada a impor (compat. com policy antigo).
if ! jq -e '.files.gitignore_baseline | type == "array"' "$POLICY" >/dev/null 2>&1; then
  exit 0
fi

if [ ! -f "$GITIGNORE" ]; then
  echo "BLOQUEADO: $GITIGNORE ausente — nao satisfaz o piso de segredo (files.gitignore_baseline)." >&2
  echo "Semeie com 'gdas init' (docs/templates/gitignore.base) ou adicione os padroes manualmente." >&2
  exit 2
fi

MISSING=""
while IFS= read -r pat; do
  [ -z "$pat" ] && continue
  # Presenca de linha EXATA (ignorando espacos em volta). Comparacao literal:
  # sem interpretar glob — o baseline e um conjunto de linhas obrigatorias.
  if ! grep -qxF -- "$pat" "$GITIGNORE" \
     && ! awk -v p="$pat" '{ gsub(/^[ \t]+|[ \t]+$/,""); if ($0==p) f=1 } END { exit(f?0:1) }' "$GITIGNORE"; then
    MISSING="$MISSING $pat"
  fi
done < <(jq -r '.files.gitignore_baseline[]' "$POLICY")

if [ -n "$MISSING" ]; then
  echo "BLOQUEADO: $GITIGNORE nao satisfaz o piso de segredo (files.gitignore_baseline)." >&2
  echo "Padrao(oes) de segredo ausente(s):$MISSING" >&2
  echo "Semeie com 'gdas init' (docs/templates/gitignore.base) ou adicione as linhas acima." >&2
  exit 2
fi

exit 0
