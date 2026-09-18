import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListRow } from "@/components/admin/ListRow";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal, IconList, IconPlus } from "@/components/ui/icons";
import { getAllServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Serviços",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const services = await getAllServices();
  const published = services.filter((service) => service.published).length;

  return (
    <div>
      <AdminPageHeader
        title="Serviços"
        description={`${published} de ${services.length} publicados no site. A ordem daqui é a ordem em que aparecem nas listas.`}
        actions={
          <Link href="/admin/servicos/novo" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Novo serviço
          </Link>
        }
      />

      <AdminPanel flush>
        {services.length === 0 ? (
          <EmptyState
            icon={<IconList />}
            title="Nenhum serviço cadastrado"
            text="Cadastre as especialidades que a clínica atende. Cada uma ganha uma página própria no site."
            action={
              <Link href="/admin/servicos/novo" className={buttonClasses("primary")}>
                Cadastrar o primeiro
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {services.map((service) => (
              <ListRow
                key={service.id}
                href={`/admin/servicos/${service.id}/editar`}
                title={service.title}
                leading={
                  <span className="hidden w-8 shrink-0 text-right font-display text-sm text-ink-muted sm:block">
                    {service.order}
                  </span>
                }
                meta={
                  <>
                    <span className="font-mono text-xs">/servicos/{service.slug}</span>
                    {service.category && <span> · {service.category}</span>}
                  </>
                }
                badges={
                  <StatusBadge tone={service.published ? "success" : "neutral"}>
                    {service.published ? "Publicado" : "Rascunho"}
                  </StatusBadge>
                }
                actions={
                  service.published ? (
                    <Link
                      href={`/servicos/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${service.title} no site`}
                      title="Ver no site"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors ease-out hover:bg-surface-sunken hover:text-blue-dark"
                    >
                      <IconExternal width={18} height={18} />
                    </Link>
                  ) : null
                }
              />
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
