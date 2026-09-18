import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IconArrowRight } from "@/components/ui/icons";
import { groupServices } from "@/lib/config/services";
import type { Service } from "@/types";

interface ServiceListProps {
  services: Service[];
}

/**
 * Lista completa de servicos (pagina /servicos), agrupada por intencao do
 * paciente ("rotina", "estetica", "reposicao", "tratamentos") em vez de
 * uma grade unica de 15 cards. O agrupamento e so apresentacao
 * (`lib/config/services.ts`); servico novo no admin cai em "Outras
 * especialidades" ate ganhar grupo.
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
          className={index % 2 === 1 ? "bg-surface-tint" : ""}
        >
          <Container className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id={`grupo-${index}`} className="text-3xl font-semibold tracking-tight">
                {group.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">{group.description}</p>
            </div>

            <ul className="reveal grid gap-4 sm:grid-cols-2">
              {group.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-surface p-6 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue hover:shadow-lg hover:shadow-blue-dark/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                  >
                    <h3 className="text-xl font-medium transition-colors ease-out group-hover:text-blue-dark">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                      {service.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-dark">
                      Saiba mais
                      <IconArrowRight
                        width={16}
                        height={16}
                        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                      />
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
