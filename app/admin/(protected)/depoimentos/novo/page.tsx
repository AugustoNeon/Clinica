import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { TestimonialForm } from "@/components/sections/TestimonialForm";
import { createTestimonialAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo depoimento",
  robots: { index: false, follow: false },
};

export default function NewTestimonialPage() {
  return (
    <EditorLayout
      title="Novo depoimento"
      description="Depoimento de paciente é dado pessoal: só publique com consentimento por escrito."
      back={{ href: "/admin/depoimentos", label: "Depoimentos" }}
      aside={
        <Tips
          items={[
            "Guarde o consentimento (mensagem, e-mail ou papel assinado) junto com o prontuário.",
            "Pode usar só o primeiro nome ou iniciais, se o paciente preferir.",
            "Frases curtas e concretas convencem mais do que elogios genéricos.",
          ]}
        />
      }
    >
      <TestimonialForm action={createTestimonialAction} submitLabel="Criar depoimento" />
    </EditorLayout>
  );
}
