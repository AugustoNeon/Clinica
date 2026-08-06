import type { Metadata } from "next";
import Link from "next/link";
import { getAllTestimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Depoimentos",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Depoimentos</h1>
        <Link href="/admin/depoimentos/novo" className="underline underline-offset-2">
          + Novo depoimento
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{testimonial.patient_name}</p>
              <p className="text-sm opacity-70">
                {testimonial.published ? "publicado" : "rascunho"} —{" "}
                {testimonial.consent_confirmed
                  ? "consentimento confirmado"
                  : "SEM consentimento"}
              </p>
            </div>
            <Link
              href={`/admin/depoimentos/${testimonial.id}/editar`}
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
