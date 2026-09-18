import type { Service } from "@/types";

/**
 * Regras de APRESENTACAO dos servicos (issue #65). So organizam o que vem
 * do banco: nao criam servico, nao mudam texto. Servico com slug fora
 * destas listas continua aparecendo — cai no fallback de cada funcao.
 *
 * Os agrupamentos usam conhecimento generico da odontologia (o que cada
 * especialidade faz), dentro da excecao de 2026-08-05 das "Regras de
 * conteudo" do AGENTS.md — nada aqui e fato sobre esta clinica.
 */

/** Slugs em destaque na Home, na ordem de exibicao. */
export const FEATURED_SERVICE_SLUGS = [
  "clinico-geral",
  "clareamento-dental",
  "ortodontia",
  "implantodontia",
  "facetas",
  "odontopediatria",
];

export interface ServiceGroup {
  title: string;
  description: string;
  slugs: string[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: "Rotina e prevenção",
    description: "Consultas periódicas, limpeza e o acompanhamento que evita problema maior.",
    slugs: ["clinico-geral", "odontopediatria", "atendimento-necessidades-especiais"],
  },
  {
    title: "Estética do sorriso",
    description: "Cor, forma e harmonia — sempre a partir de uma avaliação individual.",
    slugs: ["clareamento-dental", "facetas", "dentistica", "harmonizacao-facial"],
  },
  {
    title: "Reposição e reabilitação",
    description: "Quando falta dente ou estrutura: repor, proteger e recuperar a mastigação.",
    slugs: ["implantodontia", "protese", "coroas", "reabilitacao-oral"],
  },
  {
    title: "Tratamentos e cirurgias",
    description: "Alinhamento, canal e procedimentos cirúrgicos feitos em consultório.",
    slugs: ["ortodontia", "endodontia", "cirurgias", "extracao-de-sisos"],
  },
];

const OTHER_GROUP: Omit<ServiceGroup, "slugs"> = {
  title: "Outras especialidades",
  description: "Demais serviços oferecidos pela clínica.",
};

export interface GroupedServices {
  title: string;
  description: string;
  services: Service[];
}

/**
 * Agrupa os servicos publicados pela ordem de `SERVICE_GROUPS`. Grupo sem
 * servico some; servico sem grupo vai para "Outras especialidades" no fim.
 */
export function groupServices(services: Service[]): GroupedServices[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  const placed = new Set<string>();

  const groups: GroupedServices[] = [];
  for (const group of SERVICE_GROUPS) {
    const members = group.slugs.flatMap((slug) => {
      const service = bySlug.get(slug);
      if (!service) return [];
      placed.add(slug);
      return [service];
    });
    if (members.length > 0) {
      groups.push({ title: group.title, description: group.description, services: members });
    }
  }

  const rest = services.filter((service) => !placed.has(service.slug));
  if (rest.length > 0) {
    groups.push({ ...OTHER_GROUP, services: rest });
  }

  return groups;
}

/**
 * Servicos em destaque para a Home: os de `FEATURED_SERVICE_SLUGS` na
 * ordem da lista; se nenhum bater (slugs renomeados no admin), os primeiros
 * `limit` por `order`. Devolve tambem o restante, para o indice compacto.
 */
export function pickFeatured(
  services: Service[],
  limit = FEATURED_SERVICE_SLUGS.length,
): { featured: Service[]; rest: Service[] } {
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  let featured = FEATURED_SERVICE_SLUGS.flatMap((slug) => {
    const service = bySlug.get(slug);
    return service ? [service] : [];
  }).slice(0, limit);

  if (featured.length === 0) {
    featured = services.slice(0, limit);
  }

  const featuredIds = new Set(featured.map((service) => service.id));
  const rest = services.filter((service) => !featuredIds.has(service.id));
  return { featured, rest };
}
