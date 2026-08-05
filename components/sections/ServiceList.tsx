import Link from "next/link";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import type { Service } from "@/types";

interface ServiceListProps {
  services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return <p className="opacity-80">Nenhum servico cadastrado ainda.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service) => (
        <li key={service.id}>
          {/*
           * O card inteiro e o alvo do link (area de toque maior no celular).
           * O hover repete o do botao secundario do Design System
           * (`hover:bg-surface-tint hover:border-blue`) para nao inventar
           * estado novo; a linha "Saiba mais" existe porque hover nao da
           * affordance nenhuma em tela de toque.
           */}
          <Link
            href={`/servicos/${service.slug}`}
            className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
          >
            <Card className="flex h-full flex-col transition ease-out group-hover:border-blue group-hover:bg-surface-tint">
              {service.category && (
                <p className="text-xs uppercase tracking-wide opacity-60">{service.category}</p>
              )}
              <CardTitle>{service.title}</CardTitle>
              <CardBody>{service.description}</CardBody>
              <p className="mt-auto pt-4 text-sm font-medium text-blue-dark">Saiba mais &rarr;</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
