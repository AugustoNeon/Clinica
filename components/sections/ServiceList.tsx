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
          <Card className="h-full">
            {service.category && (
              <p className="text-xs uppercase tracking-wide opacity-60">{service.category}</p>
            )}
            <CardTitle>{service.title}</CardTitle>
            <CardBody>{service.description}</CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
