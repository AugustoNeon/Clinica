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
