import type { Metadata } from "next";
import { TestimonialForm } from "@/components/sections/TestimonialForm";
import { createTestimonialAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo depoimento",
  robots: { index: false, follow: false },
};

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Novo depoimento</h1>
      <TestimonialForm action={createTestimonialAction} submitLabel="Criar depoimento" />
    </div>
  );
}
