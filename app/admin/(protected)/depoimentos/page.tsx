import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ListRow } from "@/components/admin/ListRow";
import { Notice } from "@/components/admin/Notice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonClasses } from "@/components/ui/Button";
import { IconPlus, IconQuote, IconStar } from "@/components/ui/icons";
import { getAllTestimonials } from "@/lib/data/testimonials";
import { excerpt } from "@/lib/utils/text";

export const metadata: Metadata = {
  title: "Depoimentos",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();
  const live = testimonials.filter((item) => item.published && item.consent_confirmed).length;
  const placeholders = testimonials.filter((item) => item.published && /placeholder/i.test(item.patient_name));

  return (
    <div>
      <AdminPageHeader
        title="Depoimentos"
        description={`${live} no ar. Um depoimento só aparece no site quando está publicado E com consentimento por escrito confirmado.`}
        actions={
          <Link href="/admin/depoimentos/novo" className={buttonClasses("primary")}>
            <IconPlus width={18} height={18} />
            Novo depoimento
          </Link>
        }
      />

      {placeholders.length > 0 && (
        <Notice tone="warning" title="Depoimentos de exemplo no ar" className="mb-6">
          {placeholders.length === 1 ? "Há 1 depoimento" : `Há ${placeholders.length} depoimentos`} de
          exemplo publicado(s). Antes de divulgar o site, troque por depoimentos reais ou desmarque
          &quot;Publicado&quot;.
        </Notice>
      )}

      <AdminPanel flush>
        {testimonials.length === 0 ? (
          <EmptyState
            icon={<IconQuote />}
            title="Nenhum depoimento cadastrado"
            text="Peça a um paciente satisfeito uma frase curta e o consentimento por escrito para publicar."
            action={
              <Link href="/admin/depoimentos/novo" className={buttonClasses("primary")}>
                Cadastrar
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {testimonials.map((testimonial) => (
              <ListRow
                key={testimonial.id}
                href={`/admin/depoimentos/${testimonial.id}/editar`}
                title={testimonial.patient_name}
                meta={
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-0.5" aria-label={`${testimonial.rating} de 5`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <IconStar
                          key={index}
                          width={12}
                          height={12}
                          className={index < testimonial.rating ? "text-terracotta" : "text-ink/15"}
                        />
                      ))}
                    </span>
                    <span>{excerpt(testimonial.content, 110)}</span>
                  </span>
                }
                badges={
                  <>
                    <StatusBadge tone={testimonial.published ? "success" : "neutral"}>
                      {testimonial.published ? "Publicado" : "Rascunho"}
                    </StatusBadge>
                    <StatusBadge tone={testimonial.consent_confirmed ? "info" : "danger"}>
                      {testimonial.consent_confirmed ? "Consentimento ok" : "Sem consentimento"}
                    </StatusBadge>
                    {/placeholder/i.test(testimonial.patient_name) && <StatusBadge tone="warning">Exemplo</StatusBadge>}
                  </>
                }
              />
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
