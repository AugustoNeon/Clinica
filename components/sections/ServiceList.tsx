import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/serviceIcons";
import { groupServices } from "@/lib/config/services";
import type { Service } from "@/types";

interface ServiceListProps {
  services: Service[];
}

/*
 * Cada grupo tem a propria tinta de icone — o paciente que rola a pagina
 * ve a mudanca de "familia" pela cor, alem do titulo.
 */
/*
 * Cor do icone por grupo: o paciente que rola a pagina ve a mudanca de
 * "familia" pela cor, alem do titulo. Sem circulo tingido atras (issue #73).
 */
const GROUP_ICON_COLORS = ["text-blue-dark", "text-terracotta-text", "text-blue-deep", "text-blue-dark"];

/**
 * Lista completa de servicos (pagina /servicos), agrupada por intencao do
 * paciente ("rotina", "estetica", "reposicao", "tratamentos") em vez de
 * uma grade unica de 15 cards. O agrupamento e so apresentacao
 * (`lib/config/services.ts`); servico novo no admin cai em "Outras
 * especialidades" ate ganhar grupo. Camada rica (issue #71): icone
 * proprio em cada servico (Griddy Icons), ao lado do titulo, com tinta por
 * grupo.
 */
export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Container className="py-16">
        <p className="text-ink-muted">Nenhum serviço cadastrado ainda.</p>
      </Container>
    );
  }

  const groups = groupServices(services);

  return (
    <div className="py-6 sm:py-10">
      {groups.map((group, index) => (
        <section
          key={group.title}
          aria-labelledby={`grupo-${index}`}
          className={`relative ${index % 2 === 1 ? "overflow-hidden bg-surface-tint" : ""}`}
        >
          <Container className="relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* Grupos nao sao uma sequencia: sem numero, so o titulo (critique 2026-09-25). */}
              <h2 id={`grupo-${index}`} className="text-3xl font-bold sm:text-4xl">
                {group.title}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">{group.description}</p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {group.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className={`group flex h-full flex-col rounded-3xl p-6 transition-colors duration-200 ease-out ${index % 2 === 1 ? "bg-surface hover:bg-surface-sunken" : "bg-surface-sunken hover:bg-surface-tint"} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark`}
                  >
                    <div className="flex items-center gap-4">
                      <ServiceIcon
                        slug={service.slug}
                        className={`service-icon shrink-0 ${GROUP_ICON_COLORS[index % GROUP_ICON_COLORS.length]}`}
                        width={34}
                        height={34}
                      />
                      <h3 className="text-xl font-bold transition-colors ease-out group-hover:text-blue-dark">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">
                      {service.description}
                    </p>
                    <span className="mt-5 text-sm font-semibold text-blue-dark underline decoration-blue-dark/30 underline-offset-4 transition-colors group-hover:decoration-blue-dark">
                      Saiba mais
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}
    </div>
  );
}
