#!/usr/bin/env bash
# agent/checks/check-bash.sh
#
# Bloqueia padroes perigosos de shell que escapam da policy
# (comandos compostos, substituicao de comando, etc). Acoplavel ao
# evento pre-execucao da ferramenta de agente (via adapter) ou
# utilizavel direto na CLI.
#
# Uso:
#   check-bash.sh "<comando>"                   # modo CLI
#   echo '{"command":"..."}' | check-bash.sh    # modo evento (JSON stdin)
#
# O adapter mapeia o campo nativo da ferramenta para "command"
# (aliases aceitos: .command, .tool_input.command).
#
# Convencao de saida: 0 = ok; 2 = bloqueado.

set -e

CMD="${1:-}"

# Le stdin se nao for tty (piped). 'read -t 0' e instavel no bash 3.2
# (macOS, alvo declarado): falso negativo espurio deixava CMD vazio e o
# check saia 0 (fail-OPEN) — a guarda e apenas '[ ! -t 0 ]', como em
# data-corrente.sh / estado-fluxo.sh (issue #97).
if [ -z "$CMD" ] && [ ! -t 0 ]; then
  INPUT=$(cat 2>/dev/null || true)
  if [ -n "$INPUT" ]; then
    if command -v jq >/dev/null 2>&1; then
      CMD=$(echo "$INPUT" | jq -r '.command // .tool_input.command // empty' 2>/dev/null || true)
    else
      # Fallback SEM jq (fail-closed). Sem isto, INPUT presente + jq ausente
      # deixava CMD vazio e o check saia 0 (fail-OPEN: remocao recursiva da raiz passava).
      # Extrai o valor de "command" por sed — best-effort (nao trata aspas
      # escapadas), mas fecha o buraco no caso comum de payload de evento.
      CMD=$(printf '%s' "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)
    fi
  fi
fi

if [ -z "$CMD" ]; then
  exit 0
fi

# Padroes denied em qualquer forma (mesmo dentro de subshell, pipe, etc).
# Denylist e best-effort por natureza (defesa em profundidade, nao unica
# barreira): variacoes sempre existirao — a policy allowlist/ask e o gate
# de PR completam a cobertura.
DANGEROUS_PATTERNS=(
  # rm recursivo sobre alvo perigoso (/, *, ~, $HOME), com ou sem aspas:
  # flags juntas em qualquer ordem (-rf, -fr, -Rf), separadas (-r -f) ou
  # longas (--recursive) — antes so -r/-rf colados casavam (issue #97)
  'rm[[:space:]]+((-[[:alnum:]]+|--[[:alnum:]-]+)[[:space:]]+)*(-[[:alnum:]]*[rR][[:alnum:]]*|--recursive)([[:space:]]+(-[[:alnum:]]+|--[[:alnum:]-]+))*[[:space:]]+["'"'"']?(/|\*|~|\$HOME)'
  'git[[:space:]]+push[[:space:]]+.*--force'
  'git[[:space:]]+push[[:space:]]+.*-f($|[[:space:]])'
  # force push via refspec (+ref apos espaco) — equivalente ao --force
  'git[[:space:]]+push[[:space:]]+[^;|&]*[[:space:]]\+[^[:space:]]'
  'curl.*\|[[:space:]]*(bash|sh)'
  'wget.*\|[[:space:]]*(bash|sh)'
  # download executado via process substitution: bash <(curl ...)
  '(bash|sh|zsh)[[:space:]]+<\([[:space:]]*(curl|wget)'
  # eval sobre conteudo de variavel — nu ou entre aspas (antes so nu casava)
  'eval[[:space:]]+["'"'"']?\$'
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$CMD" | grep -E -q "$pattern"; then
    echo "BLOQUEADO: comando contem padrao perigoso." >&2
    echo "Comando: $CMD" >&2
    echo "Padrao: $pattern" >&2
    exit 2
  fi
done

exit 0
