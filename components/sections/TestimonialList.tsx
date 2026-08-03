import { Card, CardBody } from "@/components/ui/Card";
import type { Testimonial } from "@/types";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps) {
  if (testimonials.length === 0) {
    return <p className="opacity-80">Nenhum depoimento publicado ainda.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id}>
          <Card className="h-full">
            <p className="text-xs uppercase tracking-wide opacity-60">
              Avaliacao: {testimonial.rating}/5
            </p>
            <CardBody>{testimonial.content}</CardBody>
            <p className="mt-4 text-sm font-medium">{testimonial.patient_name}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
