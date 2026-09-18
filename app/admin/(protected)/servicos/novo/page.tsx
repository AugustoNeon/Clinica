import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { ServiceForm } from "@/components/sections/ServiceForm";
import { createServiceAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo serviço",
  robots: { index: false, follow: false },
};

export default function NewServicePage() {
  return (
    <EditorLayout
      title="Novo serviço"
      description="Cada serviço ganha uma página própria no site e entra nas listas da Home e de Serviços."
      back={{ href: "/admin/servicos", label: "Serviços" }}
      aside={
        <Tips
          items={[
            "O endereço (slug) é sugerido a partir do título; ajuste se quiser algo mais curto.",
            "A descrição longa pode explicar o que é a especialidade, para que serve e o que envolve — sem preço, prazo ou promessa de resultado.",
            "Deixe como rascunho até revisar; publique quando estiver pronto.",
          ]}
        />
      }
    >
      <ServiceForm action={createServiceAction} submitLabel="Criar serviço" />
    </EditorLayout>
  );
}
