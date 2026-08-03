#!/usr/bin/env bash
# agent/checks/senior-baseline.sh
#
# Aplica sobre o DIFF o subconjunto cross-language dos 12 zeros.
# Escopo DELIBERADAMENTE estreito: so os
# zeros detectaveis sem conhecer a stack nem o framework, com ruido
# proximo de zero. Cobre:
#
#   item 4  — secret hardcoded         (BLOQUEIA)
#   item 11 — operacao destrutiva       (BLOQUEIA)
#   item 7  — debug print em producao   (ALERTA, nao bloqueia)
#
# FORA DE ESCOPO por exigirem regra por linguagem/framework (scanner sem
# curadoria gera falsa sensacao de protecao): itens 1, 2, 3, 5, 6, 8, 9,
# 10, 12. Esses sao cobertos pelo linter/type-checker do consumidor
# (verify.sh) e pela analise semantica do /verify. NAO acrescente aqui
# regra que dependa de framework sem curadoria documentada no AGENTS.md.
#
# Excecao: linha com marcador
#   senior-baseline:allow=<N> reason="<justificativa>"
# rebaixa o achado N para alerta. Marcador sem reason ou reason="TODO"
# e recusado (anti-padrao) e mantem o bloqueio.
#
# Opera sobre as LINHAS ADICIONADAS do diff (nao pune codigo legado).
# Sem git, cai para escanear os arquivos passados como argumento.
#
# Uso:
#   senior-baseline.sh                 # diff staged + working tree
#   senior-baseline.sh <arquivo>...    # escaneia arquivos dados
#
# Convencao de saida: 0 = ok (ou so alertas); 2 = bloqueado.

set -u

BLOCKED=0

# ---- Coleta de linhas adicionadas (arquivo:linha:conteudo) ------------------
# Formato de cada registro: "<arquivo>\t<conteudo>". O numero de linha
# do diff e ruidoso de reconstruir de forma portavel; o arquivo + trecho
# ja localizam o achado.
collect() {
  if [ "$#" -gt 0 ]; then
    for f in "$@"; do
      [ -f "$f" ] || continue
      while IFS= read -r line; do printf '%s\t%s\n' "$f" "$line"; done < "$f"
    done
    return
  fi
  command -v git >/dev/null 2>&1 || return 0
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || return 0
  local file=""
  # -U0: so as linhas mudadas; combinamos staged + working tree.
  { git diff --cached -U0 2>/dev/null; git diff -U0 2>/dev/null; } | while IFS= read -r line; do
    case "$line" in
      '+++ b/'*) file="${line#+++ b/}" ;;
      '+++ '*)   file="${line#+++ }" ;;
      '+'*)
        # ignora o cabecalho '+++' (ja tratado) e linhas de marcador
        case "$line" in '+++'*) ;; *) printf '%s\t%s\n' "$file" "${line#+}" ;; esac
        ;;
    esac
  done
}

# ---- Avaliacao do marcador de excecao --------------------------------------
# Ecoa "allow" se a linha tem marcador valido para o item $1; "bad" se
# tem marcador sem reason valido; "" caso contrario.
marker_state() {
  local item="$1" content="$2"
  case "$content" in
    *senior-baseline:allow=*) ;;
    *) return 0 ;;
  esac
  # extrai o N do allow= e o reason
  local allow reason
  allow=$(printf '%s\n' "$content" | sed -nE 's/.*senior-baseline:allow=([0-9]+).*/\1/p')
  reason=$(printf '%s\n' "$content" | sed -nE 's/.*reason="([^"]*)".*/\1/p')
  [ "$allow" = "$item" ] || return 0
  if [ -z "$reason" ] || [ "$reason" = "TODO" ]; then
    echo "bad"; return 0
  fi
  echo "allow"
}

report() {
  # $1=item $2=nivel(BLOQUEIA|ALERTA) $3=arquivo $4=conteudo $5=descricao
  local item="$1" nivel="$2" file="$3" content="$4" desc="$5"
  local state; state=$(marker_state "$item" "$content")
  if [ "$state" = "allow" ]; then
    return 0
  fi
  local trecho; trecho=$(printf '%s' "$content" | sed 's/^[[:space:]]*//' | cut -c1-80)
  if [ "$state" = "bad" ]; then
    echo "BLOQUEADO  zero $item ($desc) — $file: marcador allow sem reason valido — $trecho" >&2
    BLOCKED=1; return 0
  fi
  if [ "$nivel" = "BLOQUEIA" ]; then
    echo "BLOQUEADO  zero $item ($desc) — $file: $trecho" >&2
    BLOCKED=1
  else
    echo "ALERTA     zero $item ($desc) — $file: $trecho" >&2
  fi
}

# ---- Padroes (cross-language) ----------------------------------------------
# item 4 — secret hardcoded: atribuicao de literal a identificador
# sensivel, assinaturas de chave AWS e cabecalho de chave privada.
# O 1o char do valor exclui $ < { % : exempta referencia a env var / cofre /
# placeholder (${VAR}, <defina-aqui>, {{var}}, %ENV%) — o padrao recomendado
# de §4.11. So literal "de verdade" (>=6 chars iniciando em char comum) bloqueia.
SECRET_ASSIGN='(password|passwd|secret|api[_-]?key|apikey|access[_-]?token|auth[_-]?token|authorization|bearer|private[_-]?key|client[_-]?secret)["'"'"' ]*[:=][[:space:]]*["'"'"'][^"'"'"'$<{%][^"'"'"']{5,}'
SECRET_AWS='AKIA[0-9A-Z]{16}'
SECRET_PEM='-----BEGIN [A-Z ]*PRIVATE KEY-----'

# item 11 — operacao destrutiva em codigo/migration commitado.
DESTRUCTIVE='(DROP[[:space:]]+(TABLE|DATABASE|SCHEMA)|TRUNCATE[[:space:]]+TABLE|rm[[:space:]]+-rf?[[:space:]])'
# O full-delete SQL e tratado a parte (issue #97): bloqueia so o delete de
# tabela INTEIRA — sem WHERE na linha, ou com tautologia (WHERE 1=1 / TRUE).
# Delete com WHERE real e SQL legitimo de aplicacao e passa (H17: detector
# estreito que protege > amplo que finge). Antes, a exigencia de ';' ou fim
# de linha logo apos a tabela deixava passar o full-delete com clausula.
# (Comentario evita o literal do padrao — auto-match, recorte da DEC-047.)
DELETE_FROM='DELETE[[:space:]]+FROM[[:space:]]+[A-Za-z_"`]'
DELETE_TAUTOLOGY='WHERE[[:space:]]+(1[[:space:]]*=[[:space:]]*1|TRUE([[:space:]]|;|$))'

# item 7 — debug print (alerta).
DEBUGPRINT='(console\.(log|debug)|System\.out\.print|fmt\.Print(ln|f)?|^[[:space:]]*print\(|println!|var_dump|^[[:space:]]*p[[:space:]]+[^=])'

while IFS=$'\t' read -r file content; do
  [ -n "$file" ] || continue
  # item 4 — isenta LOCKFILES de gerenciador de pacotes (issue GDAS#95):
  # arquivo gerado por maquina, onde o "identificador sensivel" e nome de
  # dependencia e o "valor" e um range de versao — falso positivo
  # estrutural que bloqueava o primeiro install versionado de qualquer
  # stack com pacotes. Secret real nao entra em lockfile por nome de
  # pacote; o manifesto AUTORAL do gerenciador segue 100% escaneado, e os
  # itens 11 (destrutivo) e 7 (debug) continuam ativos nesses arquivos.
  # Lista minima e explicita: SO arquivos que gerenciador de pacote
  # escreve — nunca glob largo. Marcador allow= na linha nao funciona em
  # arquivo gerado (o gerenciador reescreve e o marcador some).
  case "$file" in
    *package-lock.json|*yarn.lock|*pnpm-lock.yaml|*poetry.lock|*go.sum|*Cargo.lock|*Gemfile.lock|*composer.lock) ;;
    *) printf '%s' "$content" | grep -iEq "$SECRET_ASSIGN|$SECRET_AWS|$SECRET_PEM" \
         && report 4 BLOQUEIA "$file" "$content" "secret hardcoded" ;;
  esac
  # item 11 — operacao destrutiva. Isento os arquivos GDAS-managed que DEFINEM
  # padroes destrutivos (a deny-list em policy.json; os checks que detectam esses
  # comandos): eles DESCREVEM o padrao, nao COMMITAM o comando. Sem isso o
  # bootstrap do consumidor auto-bloqueia (policy.json traz o padrao de remocao
  # recursiva na deny-list — #74; o literal fora daqui, auto-match, recorte da
  # DEC-047). SECRET/DEBUG seguem ativos nesses arquivos; o codigo real do consumidor
  # (fora de agent/) continua 100% escaneado para DESTRUCTIVE.
  case "$file" in
    agent/policy.json|agent/checks/*.sh) ;;
    *)
      printf '%s' "$content" | grep -Eq "$DESTRUCTIVE" \
        && report 11 BLOQUEIA "$file" "$content" "operacao destrutiva"
      if printf '%s' "$content" | grep -iEq "$DELETE_FROM"; then
        if ! printf '%s' "$content" | grep -iq 'WHERE' \
           || printf '%s' "$content" | grep -iEq "$DELETE_TAUTOLOGY"; then
          report 11 BLOQUEIA "$file" "$content" "operacao destrutiva"
        fi
      fi
      ;;
  esac
  printf '%s' "$content" | grep -Eq "$DEBUGPRINT" \
    && report 7 ALERTA "$file" "$content" "debug print"
done < <(collect "$@")

if [ "$BLOCKED" -ne 0 ]; then
  echo "senior-baseline: bloqueio. Corrija, ou declare excecao com" >&2
  echo "  senior-baseline:allow=<N> reason=\"<por que>\"" >&2
  exit 2
fi
exit 0
