import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Servicos",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Servicos</h1>
        <Link href="/admin/servicos/novo" className="underline underline-offset-2">
          + Novo servico
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
        {services.map((service) => (
          <li key={service.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{service.title}</p>
              <p className="text-sm opacity-70">
                /{service.slug} — {service.published ? "publicado" : "rascunho"}
              </p>
            </div>
            <Link
              href={`/admin/servicos/${service.id}/editar`}
              className="text-sm underline underline-offset-2"
            >
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
