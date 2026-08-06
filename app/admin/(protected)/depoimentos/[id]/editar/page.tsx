import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar depoimento</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            Excluir
          </button>
        </form>
      </div>
      <div className="mt-6">
        <TestimonialForm
          testimonial={testimonial}
          action={updateWithId}
          submitLabel="Salvar alteracoes"
        />
      </div>
    </div>
  );
}
