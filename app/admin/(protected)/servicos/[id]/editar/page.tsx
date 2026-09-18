import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { DangerZone, EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { ServiceForm } from "@/components/sections/ServiceForm";
import { buttonClasses } from "@/components/ui/Button";
import { IconExternal } from "@/components/ui/icons";
import { getServiceById } from "@/lib/data/services";
import { deleteServiceAction, updateServiceAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar serviço",
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
    <EditorLayout
      title={service.title}
      description="Alterações valem para o site assim que você salvar."
      back={{ href: "/admin/servicos", label: "Serviços" }}
      actions={
        service.published ? (
          <Link
            href={`/servicos/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary")}
          >
            <IconExternal width={18} height={18} />
            Ver no site
          </Link>
        ) : undefined
      }
      aside={
        <>
          <Tips
            items={[
              "Mudar o slug muda o endereço da página — links antigos (e o Google) param de achar a página.",
              "Para tirar do ar sem apagar, desmarque “Publicado”.",
            ]}
          />
          <DangerZone text="Excluir apaga o serviço de vez. Se a ideia é só esconder, use “Publicado”.">
            <ConfirmAction
              action={deleteWithId}
              label="Excluir serviço"
              question={`Excluir “${service.title}”? Ele some do site na hora.`}
            />
          </DangerZone>
        </>
      }
    >
      <ServiceForm service={service} action={updateWithId} submitLabel="Salvar alterações" />
    </EditorLayout>
  );
}
