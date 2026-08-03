#!/usr/bin/env bash
# agent/checks/protect-paths.sh
#
# Bloqueia/alerta edicao em paths protegidos. Acoplavel ao evento
# pre-edicao da ferramenta de agente (via adapter) ou utilizavel
# direto na CLI / CI.
#
# Uso:
#   protect-paths.sh <path>          # modo CLI
#   echo '{"path":"..."}' | protect-paths.sh   # modo evento (JSON stdin)
#
# O adapter mapeia o campo nativo da ferramenta para "path"
# (aliases aceitos: .path, .file_path, .tool_input.file_path).
#
# Convencao de saida: 0 = ok (pode alertar em stderr); 2 = bloqueado.
#
# A lista de BLOQUEIO vem de files.gitignore_baseline do agent/policy.json
# (a FONTE UNICA, em sintaxe .gitignore) quando jq + policy estao presentes;
# o case hardcoded abaixo e so o FALLBACK sem jq — ao mexer no baseline,
# reconcilie o fallback e o check gitignore-baseline.sh. A lista de ALERTA
# espelha files.warn_paths do agent/policy.json; edite-a para o seu projeto.

set -e

FILE_PATH="${1:-}"

# Le stdin se nao for tty (piped). 'read -t 0' e instavel no bash 3.2
# (macOS, alvo declarado): falso negativo espurio deixava FILE_PATH vazio
# e o check saia 0 (fail-OPEN) — a guarda e apenas '[ ! -t 0 ]', como em
# data-corrente.sh / estado-fluxo.sh (issue #97).
if [ -z "$FILE_PATH" ] && [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
  if [ -n "$INPUT" ]; then
    if command -v jq >/dev/null 2>&1; then
      FILE_PATH=$(echo "$INPUT" | jq -r '.path // .file_path // .tool_input.file_path // .tool_input.notebook_path // empty' 2>/dev/null || true)
    else
      # Fallback SEM jq (fail-closed). Sem isto, INPUT presente + jq ausente
      # deixava FILE_PATH vazio e o check saia 0 (fail-OPEN: edicao de .env
      # passava). Extrai o valor de file_path/path/notebook_path por sed —
      # best-effort, mas fecha o buraco no caso comum de payload de evento.
      FILE_PATH=$(printf '%s' "$INPUT" | sed -n -E 's/.*"(file_path|path|notebook_path)"[[:space:]]*:[[:space:]]*"([^"]*)".*/\2/p' | head -n1)
    fi
  fi
fi

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Bloqueio absoluto: arquivos de secrets — exceto placeholders versionados.
# FONTE UNICA: files.gitignore_baseline do agent/policy.json (issue #97).
# Com jq + policy presentes, as classes vem de la (padrao '!x' = excecao);
# sem eles, cai no espelho hardcoded abaixo — mantenha-o reconciliado.
_match_any() { # $1=path; demais args = globs (case: '*' tambem casa '/')
  local p="$1" g; shift
  for g in "$@"; do
    [ -n "$g" ] || continue
    case "$p" in $g|*/$g) return 0 ;; esac
  done
  return 1
}

POLICY="$(dirname "$0")/../policy.json"
BLOCK_GLOBS=""; ALLOW_GLOBS=""
if command -v jq >/dev/null 2>&1 && [ -f "$POLICY" ]; then
  while IFS= read -r pat; do
    [ -n "$pat" ] || continue
    case "$pat" in
      '!'*) ALLOW_GLOBS="$ALLOW_GLOBS ${pat#!}" ;;
      '**/'*) BLOCK_GLOBS="$BLOCK_GLOBS ${pat#\*\*/}" ;;
      *) BLOCK_GLOBS="$BLOCK_GLOBS $pat" ;;
    esac
  done <<EOF_PAT
$(jq -r '.files.gitignore_baseline[]? // empty' "$POLICY" 2>/dev/null || true)
EOF_PAT
fi

if [ -n "$BLOCK_GLOBS" ]; then
  # shellcheck disable=SC2086 — split intencional (globs nao tem espaco)
  if ! _match_any "$FILE_PATH" $ALLOW_GLOBS && _match_any "$FILE_PATH" $BLOCK_GLOBS; then
    echo "BLOQUEADO: arquivo de secret nao pode ser editado pelo agente." >&2
    echo "Path: $FILE_PATH (classe de files.gitignore_baseline do policy)" >&2
    exit 2
  fi
else
  # Fallback sem jq/policy: espelho das mesmas classes do baseline
  case "$FILE_PATH" in
    *.env.example|*.env.sample|*.env.template)
      # placeholder sem valores reais — versionado e editavel pelo agente
      ;;
    *.env|*.env.*|*credentials*|*.pem|*.key|*secret*|*.p12|*acesso.json)
      echo "BLOQUEADO: arquivo de secret nao pode ser editado pelo agente." >&2
      echo "Path: $FILE_PATH" >&2
      exit 2
      ;;
  esac
fi

# Alerta: paths criticos (nao bloqueia, mas avisa o agente para ser deliberado)
case "$FILE_PATH" in
  *src/auth/*|*src/billing/*|*db/migrations/*)
    echo "ALERTA: $FILE_PATH e path critico. Confirme blast radius no plano antes de editar." >&2
    ;;
esac

exit 0
