import type { Service } from "@/types";

/**
 * Camada de dados de `services`.
 *
 * IMPLEMENTACAO ATUAL: dados em memoria. Nao existe projeto Supabase ainda.
 * As assinaturas ja sao assincronas e retornam exatamente o que uma query do
 * Supabase retornaria, para que trocar o corpo destas funcoes (ver
 * `lib/supabase/server.ts`) nao toque em nenhuma pagina ou componente.
 *
 * CONTEUDO: lista REAL de especialidades desde 2026-08-04, conforme o
 * questionario respondido pela cliente. `image_url` segue `null` em todos os
 * itens: a clinica ainda nao enviou fotos dos procedimentos. `category` fica
 * `null` porque a cliente nao agrupou os servicos em categorias.
 *
 * `long_description` (2026-08-05) e descricao GENERICA da especialidade
 * odontologica — o que qualquer site da area escreveria sobre Ortodontia,
 * Endodontia etc. Nao e texto sobre esta clinica nem sobre a Dra. Ariane, e
 * por isso nao cai na regra de "nao inventar dado de clinica" do AGENTS.md
 * (excecao registrada em "Decisoes fechadas", autorizada pela doutora).
 * Nada aqui afirma prazo, preco, estatistica ou resultado.
 *
 * Troca futura, por exemplo:
 *   const supabase = getSupabaseServerClient();
 *   const { data, error } = await supabase
 *     .from("services").select("*").eq("published", true).order("order");
 */

const SERVICES: Service[] = [
  {
    id: "svc-reabilitacao-oral",
    slug: "reabilitacao-oral",
    title: "Reabilitação Oral",
    description:
      "Tratamento que combina as áreas necessárias para recuperar função e estética da boca.",
    long_description:
      "A reabilitação oral reúne várias áreas da odontologia — prótese, implantes, dentística, periodontia — para reconstruir a boca de quem perdeu dentes ou teve a mastigação comprometida. O tratamento parte de um diagnóstico que olha dentes, gengiva, mordida e articulação em conjunto, e não um dente isolado. A partir dele, o plano é executado em etapas, na ordem que cada caso pede. O objetivo é devolver função e estética ao mesmo tempo.",
    category: null,
    image_url: null,
    order: 1,
    published: true,
  },
  {
    id: "svc-clinico-geral",
    slug: "clinico-geral",
    title: "Clínico Geral",
    description:
      "Consultas de rotina, diagnóstico e prevenção para manter a saúde bucal em dia.",
    long_description:
      "A odontologia clínica geral é a porta de entrada do cuidado com a boca: consulta de rotina, exame clínico, limpeza profissional e diagnóstico precoce de cárie, problema de gengiva e desgaste. É nessa avaliação que se define o que pode ser resolvido ali mesmo e o que precisa de uma especialidade. O acompanhamento periódico existe justamente para encontrar alterações enquanto ainda são simples de tratar.",
    category: null,
    image_url: null,
    order: 2,
    published: true,
  },
  {
    id: "svc-dentistica",
    slug: "dentistica",
    title: "Dentística",
    description:
      "Restaurações e tratamentos estéticos para recuperar a forma e a função dos dentes.",
    long_description:
      "A dentística é a especialidade que restaura dentes danificados por cárie, fratura ou desgaste, devolvendo forma, cor e função. Trabalha com materiais como resina composta e cerâmica, em restaurações diretas (feitas na própria consulta) ou indiretas (confeccionadas fora da boca e depois cimentadas). Também cuida de ajustes estéticos como fechamento de pequenos espaços e correção de manchas.",
    category: null,
    image_url: null,
    order: 3,
    published: true,
  },
  {
    id: "svc-implantodontia",
    slug: "implantodontia",
    title: "Implantodontia",
    description: "Reposição de dentes ausentes com implantes, devolvendo função e estética.",
    long_description:
      "A implantodontia repõe dentes perdidos por meio de implantes: pinos de titânio instalados no osso da maxila ou da mandíbula, que passam a funcionar como a raiz de um dente novo. Sobre o implante se coloca uma coroa, uma ponte ou uma prótese maior, conforme o caso. Por se apoiar no osso, e não nos dentes vizinhos, é uma alternativa que preserva a estrutura ao redor. O planejamento envolve exames de imagem para avaliar volume ósseo e estruturas próximas.",
    category: null,
    image_url: null,
    order: 4,
    published: true,
  },
  {
    id: "svc-ortodontia",
    slug: "ortodontia",
    title: "Ortodontia",
    description:
      "Alinhamento dos dentes com aparelho, para uma mordida mais saudável e um sorriso mais harmônico.",
    long_description:
      "A ortodontia corrige a posição dos dentes e o encaixe da mordida, usando aparelhos fixos, aparelhos móveis ou alinhadores transparentes. Além da estética do sorriso, um alinhamento adequado facilita a higienização e distribui melhor a força da mastigação, reduzindo desgaste desigual. O tratamento é acompanhado por consultas periódicas de ajuste até chegar ao resultado planejado.",
    category: null,
    image_url: null,
    order: 5,
    published: true,
  },
  {
    id: "svc-endodontia",
    slug: "endodontia",
    title: "Endodontia",
    description: "Tratamento de canal para salvar dentes com a polpa comprometida.",
    long_description:
      "A endodontia trata o interior do dente — a polpa, onde ficam nervos e vasos — quando ela é atingida por cárie profunda, trauma ou infecção. O tratamento de canal remove o tecido comprometido, desinfeta e preenche os condutos, o que permite manter o dente natural em vez de extraí-lo. Costuma ser indicado diante de dor intensa, sensibilidade persistente ao calor ou sinais de abscesso.",
    category: null,
    image_url: null,
    order: 6,
    published: true,
  },
  {
    id: "svc-harmonizacao-facial",
    slug: "harmonizacao-facial",
    title: "Harmonização Facial",
    description: "Procedimentos estéticos faciais que complementam o sorriso.",
    long_description:
      "A harmonização orofacial reúne procedimentos estéticos da face que acompanham o resultado do tratamento odontológico, já que sorriso, lábios e contorno do rosto são lidos em conjunto. A proposta é equilibrar proporções respeitando as características de cada pessoa, e não padronizar o rosto. É uma área que cirurgiões-dentistas exercem dentro dos limites definidos pelo conselho da categoria, sempre após avaliação individual.",
    category: null,
    image_url: null,
    order: 7,
    published: true,
  },
  {
    id: "svc-cirurgias",
    slug: "cirurgias",
    title: "Cirurgias",
    description: "Procedimentos cirúrgicos odontológicos, da extração a casos mais complexos.",
    long_description:
      "A cirurgia odontológica cobre os procedimentos que envolvem tecido ósseo ou gengival: extrações, remoção de lesões, ajustes de gengiva e preparo do osso para receber implantes. A maior parte é feita em consultório, com anestesia local e orientações específicas de cuidado no pós-operatório. O planejamento costuma incluir exames de imagem para avaliar raízes, nervos e estrutura óssea antes de qualquer intervenção.",
    category: null,
    image_url: null,
    order: 8,
    published: true,
  },
  {
    id: "svc-clareamento-dental",
    slug: "clareamento-dental",
    title: "Clareamento Dental",
    description: "Clareamento profissional para deixar o sorriso mais claro com segurança.",
    long_description:
      "O clareamento dental usa géis à base de peróxido para reduzir a pigmentação do esmalte e da dentina, que escurecem com o tempo por causa de alimentos, bebidas e hábitos como o fumo. Pode ser feito em consultório, com moldeiras de uso domiciliar supervisionado, ou combinando os dois formatos. A avaliação prévia é o que define se existe cárie, restauração antiga ou sensibilidade que precise ser resolvida antes de começar.",
    category: null,
    image_url: null,
    order: 9,
    published: true,
  },
  {
    id: "svc-protese",
    slug: "protese",
    title: "Prótese",
    description: "Próteses dentárias para repor dentes perdidos e recuperar a mastigação.",
    long_description:
      "A prótese dentária repõe dentes perdidos com peças fixas ou removíveis — coroas, pontes, próteses parciais e totais — apoiadas nos dentes remanescentes ou em implantes. Repor o que falta não é só estética: ajuda a manter a mastigação, a fala e a posição dos dentes vizinhos, que tendem a se inclinar para o espaço vazio. Cada peça é planejada a partir de moldagem ou escaneamento da boca e ajustada na instalação.",
    category: null,
    image_url: null,
    order: 10,
    published: true,
  },
  {
    id: "svc-odontopediatria",
    slug: "odontopediatria",
    title: "Odontopediatria",
    description: "Atendimento odontológico voltado para crianças, em ambiente acolhedor.",
    long_description:
      "A odontopediatria cuida da saúde bucal de bebês, crianças e adolescentes, acompanhando o nascimento e a troca dos dentes. Envolve prevenção (orientação de higiene, aplicação de flúor, selantes), tratamento de cárie na dentição de leite e atenção a hábitos como uso prolongado de chupeta e respiração pela boca. Uma parte importante do trabalho é adaptar a criança ao consultório, para que a consulta não se torne fonte de medo.",
    category: null,
    image_url: null,
    order: 11,
    published: true,
  },
  {
    id: "svc-facetas",
    slug: "facetas",
    title: "Facetas",
    description: "Facetas para ajustar forma, cor e alinhamento do sorriso.",
    long_description:
      "As facetas são lâminas finas de resina ou de porcelana fixadas na face externa dos dentes para corrigir cor, formato, pequenos desalinhamentos e espaços entre eles. O preparo varia conforme o material e o caso, podendo exigir desgaste mínimo do esmalte ou nenhum. É um procedimento estético que costuma ser planejado antes com prévia visual ou enceramento, para que o resultado seja discutido antes de começar.",
    category: null,
    image_url: null,
    order: 12,
    published: true,
  },
  {
    id: "svc-coroas",
    slug: "coroas",
    title: "Coroas",
    description: "Coroas dentárias para proteger e restaurar dentes desgastados ou tratados.",
    long_description:
      "A coroa é uma peça que recobre todo o dente, indicada quando a estrutura que sobrou é insuficiente para uma restauração comum — por fratura, desgaste grande ou depois de um tratamento de canal. Pode ser feita em cerâmica, zircônia ou metalocerâmica, cimentada sobre o dente preparado ou sobre um implante. Protege o que restou do dente e devolve o formato original para a mastigação.",
    category: null,
    image_url: null,
    order: 13,
    published: true,
  },
  {
    id: "svc-extracao-de-sisos",
    slug: "extracao-de-sisos",
    title: "Extração de Sisos",
    description:
      "Remoção de dentes sisos, incluindo casos que precisam de acompanhamento cirúrgico.",
    long_description:
      "Os sisos são os terceiros molares, que costumam nascer no fim da adolescência ou no início da vida adulta. Quando não há espaço suficiente na arcada, podem ficar inclusos ou irromper pela metade, o que favorece dor, inflamação da gengiva e cárie no dente vizinho. A indicação de remover é avaliada caso a caso, com radiografia para verificar posição, raízes e proximidade de estruturas como o nervo.",
    category: null,
    image_url: null,
    order: 14,
    published: true,
  },
  {
    id: "svc-atendimento-necessidades-especiais",
    slug: "atendimento-necessidades-especiais",
    title: "Atendimento a Pacientes com Necessidades Especiais",
    description:
      "Atendimento odontológico adaptado para pacientes com necessidades especiais.",
    long_description:
      "A odontologia para pacientes com necessidades especiais atende pessoas cuja condição exige adaptação do atendimento: deficiências físicas ou intelectuais, transtornos do neurodesenvolvimento, doenças sistêmicas e limitações de mobilidade, entre outras. A adaptação pode envolver consultas mais curtas, ambiente com menos estímulos, mais tempo de acolhimento e comunicação próxima com quem acompanha o paciente. O cuidado bucal é o mesmo — o que muda é o formato, ajustado a cada pessoa.",
    category: null,
    image_url: null,
    order: 15,
    published: true,
  },
];

/** Servicos publicados, ja ordenados por `order`. */
export async function getServices(): Promise<Service[]> {
  return SERVICES.filter((service) => service.published).sort((a, b) => a.order - b.order);
}

/** Um servico publicado pelo slug, ou `null` se nao existir. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}
