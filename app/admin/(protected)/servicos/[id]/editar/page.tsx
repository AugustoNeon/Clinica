import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/sections/ServiceForm";
import { getServiceById } from "@/lib/data/services";
import { deleteServiceAction, updateServiceAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar servico",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const updateWithId = updateServiceAction.bind(null, id);
  const deleteWithId = deleteServiceAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar servico</h1>
        <form action={deleteWithId}>
          <button type="submit" className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400">
            Excluir
          </button>
        </form>
      </div>
      <div className="mt-6">
        <ServiceForm service={service} action={updateWithId} submitLabel="Salvar alteracoes" />
      </div>
    </div>
  );
}
