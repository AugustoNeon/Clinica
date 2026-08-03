---
description: Gerencia o ciclo de vida de documentos de comunicacao humana (readme, manual, fluxograma, relatorio). Use para criar, atualizar ou revisar doc seguindo o fluxo do projeto com cerimonia minima. Forma do comando: verbo + tipos + escopo/slug.
output: "Rascunho do(s) doc(s) no caminho da convencao, com front-matter, mais o tier de registro proposto (na unidade da feature, unidade propria + decisao enxuta, ou so registro). Nada e publicado nem aberto como unidade de revisao sem o ok humano."
quando-nao-usar: NÃO use para registro de incidente — use o template de postmortem; nem para evidência de verificação — o gate da skill gdas-verificar a gera.
---

# /documentar

Voce vai cuidar do ciclo de vida de um documento de comunicacao humana:
**criar**, **atualizar** ou **revisar** readme, manual, fluxograma ou
relatorio. Voce rascunha e **recomenda** — nao publica e nao abre unidade
de revisao por conta propria. O peso do processo acompanha o tamanho da
entrega: doc nao e cerimonia.

A forma do comando e **verbo + {tipos} + [escopo/slug]**:
- "atualizar readme, manual"                     -> verbo + tipos, escopo do repo
- "criar fluxograma de cadastro de produto"      -> verbo + tipo + slug
- "atualizar fluxograma e manual do cadastro de produto" -> verbo + tipos + slug

## Fonte do schema (nao duplique)

O catalogo de tipos de documento vive em `agent/policy.json`, bloco
`documentos` (fonte unica, legivel por maquina). Leia-o de la — id,
proposito, gatilho, mutabilidade, esqueleto, front-matter obrigatorio e
checks aplicaveis. Nao reescreva o schema em prosa; se o humano precisar
ler, renderize o bloco sob demanda.

Cada feature mora num feixe previsivel derivado do slug:
`docs/features/<slug>/{readme,manual,fluxo}.md`. A unidade de
documentacao NAO e o arquivo isolado — e o feixe inteiro (os docs de uma
feature ficam obsoletos juntos).

## Processo

1. **Resolva verbo + tipos + slug.** Se faltar o slug num doc de feature,
   ou se o verbo for ambiguo, pergunte antes de assumir (anti-A18). Sem
   slug, o escopo e o repo (ex.: readme de modulo).

2. **Leia o tipo no schema.** Para cada tipo pedido, carregue do
   `documentos` a mutabilidade, o esqueleto e o front-matter obrigatorio.

3. **Decida o tier pelo gatilho (peso proporcional):**
   - **Derivado** — o doc muda porque a feature mudou. NAO abre fluxo
     proprio: entra na MESMA unidade de revisao da feature. Seu trabalho
     e garantir que o doc esta DENTRO daquela unidade, nao criar uma
     paralela.
   - **Originado** — decisao de criar um doc sem gatilho de codigo.
     Pequena unidade propria, com registro leve de intencao (uma decisao
     enxuta). Nunca PRD.
   - **Trivial** — staleness, link quebrado, ajuste pontual. So registro
     (uma linha em licoes ou no registro de mudanca). Sem spec, sem decisao.

   Regra pratica: o peso do processo nunca deve superar a entrega. Em
   ambiguidade de tier, pergunte.

4. **Execute o verbo:**
   - **criar** — gere esqueleto + front-matter no caminho da convencao
     derivado do slug. Recomenda; nao publica.
   - **atualizar** — respeite a mutabilidade do tipo. Tipo `append-only`
     (relatorio) e **anexado**, nunca reescrito retroativamente. Para doc
     derivado, recomende anexar a entrega a unidade de revisao existente
     da feature.
   - **revisar** — sugira melhorias de conteudo. **Isto nao e o audit.**
     Voce aponta prosa que pode melhorar (clareza, se o relatorio conta a
     historia certa, se o fluxograma reflete o fluxo real); o humano
     decide. Nenhum veredito de "correto/incorreto" sobre qualidade textual.

5. **Co-obsolescencia.** Se voce tocou um doc do feixe `<slug>`, verifique
   os irmaos: um manual atualizado com um fluxograma que ficou para tras e
   divida. Aponte os irmaos candidatos a atualizar na mesma unidade.

## Front-matter

Todo doc carrega o cabecalho minimo declarado em `front_matter_obrigatorio`
(o schema e a fonte; tipicamente titulo, versao+status, data, slug/escopo
e fonte de onde o conteudo deriva). E o unico cabecalho obrigatorio — o
resto da estrutura o audit impoe a partir do schema, sem hardcode por doc.
Use data ISO `AAAA-MM-DD`, nunca termo relativo.

## Fluxograma

Fluxograma e **diagrama-em-texto versionado**, nao imagem — evolui em git
junto do codigo. A sintaxe concreta do diagrama nao se decide aqui: ela
mora no adapter do projeto (o core fala em termos neutros). Consulte o
mapeamento de plataforma antes de escolher a notacao.

## Limites

- Nao publica, nao abre unidade de revisao, nao executa acao com efeito
  colateral: rascunha e recomenda. Acao fica com o humano ou um adaptador.
- Nao emite veredito de qualidade de prosa — isso e do humano; o audit so
  cobre a fatia verificavel por maquina (presenca, estrutura, consistencia).
- Nao reescreve doc `append-only`; anexa.
- Nao inventa um PRD para documentar. PRD precede a feature; a documentacao
  a sucede.
- Nao duplica o schema em doc humano paralelo: fonte unica e o policy.json.
