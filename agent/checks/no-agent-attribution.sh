#!/usr/bin/env bash
# agent/checks/no-agent-attribution.sh
#
# GATILHO da regra "sem mencao ao agente" dos playbooks /commit e /pr (issue
# #77). A regra vivia so na prosa dos playbooks — entao decaia em silencio: a
# ferramenta de agente injeta um selo de autoria por padrao e nada no fluxo o
# barrava. Este check converte a regra em MECANISMO (gatilho > prosa).
#
# NEUTRO (DEC-004): NAO casa nome de ferramenta/agente. Casa a ESTRUTURA da
# atribuicao automatica, que independe do agente:
#   - a frase "Generated with ..." (selo de geracao automatica), e
#   - o trailer "Co-authored-by:" com endereco de BOT (noreply@, [bot], ...).
# Assim funciona para qualquer ferramenta sem quebrar a neutralidade e NAO
# acusa co-autor HUMANO legitimo (que assina com email real).
#
# Correcao de RAIZ: desligar o selo default da ferramenta de agente na origem
# (a opcao de co-author/attribution nas configuracoes da propria ferramenta).
# Este check e a rede de seguranca (detecta depois); a prevencao e na config.
#
# Uso:
#   no-agent-attribution.sh                 # mensagem do commit HEAD (default)
#   no-agent-attribution.sh <arquivo>       # modo hook commit-msg (git passa o path)
#   no-agent-attribution.sh <rev>..<rev>    # varre um range (ex.: origin/main..HEAD)
#
# Convencao de saida: 0 = ok; 2 = bloqueado (remova a atribuicao antes de seguir).

set -e

# Resolve a(s) mensagem(ns) a inspecionar a partir do argumento.
_collect_msg() {
  local arg="${1:-}"
  if [ -n "$arg" ] && [ -f "$arg" ]; then
    cat "$arg"                                      # commit-msg hook: path do arquivo
  elif [ -n "$arg" ] && printf '%s' "$arg" | grep -q '\.\.'; then
    git log --format='%B' "$arg" 2>/dev/null || true # range de revisoes
  else
    git log -1 --format='%B' 2>/dev/null || true     # HEAD (default)
  fi
}

MSG="$(_collect_msg "${1:-}")"
[ -z "$MSG" ] && exit 0

# Padrao 1: selo de geracao automatica (frase que um humano nao escreve).
# Padrao 2: trailer de co-autoria cujo endereco/marcador e de bot — pega
# "<...noreply@...>", "[bot]" e "<bot@..." sem casar um co-autor humano
# (email real). A palavra "bot" solta casava sobrenome humano legitimo
# ("Ana Bot <ana@...>") — falso positivo estrutural (H17, issue #99); so
# conta marcador com contexto de ENDERECO.
HITS="$(printf '%s\n' "$MSG" | grep -niE \
  'generated with|co-authored-by:.*(noreply@|@users\.noreply|\[bot\]|<bot@)' \
  2>/dev/null || true)"

if [ -n "$HITS" ]; then
  {
    echo "BLOQUEADO: a mensagem de commit atribui autoria a um agente."
    echo "Os playbooks /commit e /pr proibem mencao ao agente. Linha(s):"
    printf '%s\n' "$HITS" | sed 's/^/  /'
    echo "Remova a atribuicao. Correcao de raiz: desligue o selo/atribuicao"
    echo "default da sua ferramenta de agente nas configuracoes dela."
  } >&2
  exit 2
fi

exit 0
