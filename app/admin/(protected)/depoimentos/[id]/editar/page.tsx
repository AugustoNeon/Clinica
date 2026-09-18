import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { DangerZone, EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { TestimonialForm } from "@/components/sections/TestimonialForm";
import { getTestimonialByIdAdmin } from "@/lib/data/testimonials";
import { deleteTestimonialAction, updateTestimonialAction } from "./actions";

export const metadata: Metadata = {
  title: "Editar depoimento",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialByIdAdmin(id);

  if (!testimonial) {
    notFound();
  }

  const updateWithId = updateTestimonialAction.bind(null, id);
  const deleteWithId = deleteTestimonialAction.bind(null, id);

  return (
    <EditorLayout
      title={`Depoimento de ${testimonial.patient_name}`}
      back={{ href: "/admin/depoimentos", label: "Depoimentos" }}
      aside={
        <>
          <Tips
            items={[
              "Se o paciente pedir para retirar o depoimento, desmarque “Publicado” ou exclua — é direito dele (LGPD).",
            ]}
          />
          <DangerZone>
            <ConfirmAction
              action={deleteWithId}
              label="Excluir depoimento"
              question={`Excluir o depoimento de “${testimonial.patient_name}”?`}
            />
          </DangerZone>
        </>
      }
    >
      <TestimonialForm testimonial={testimonial} action={updateWithId} submitLabel="Salvar alterações" />
    </EditorLayout>
  );
}
