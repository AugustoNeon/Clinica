import type { Metadata } from "next";
import { EditorLayout, Tips } from "@/components/admin/EditorLayout";
import { PatientForm } from "@/components/sections/PatientForm";
import { createPatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo paciente",
  robots: { index: false, follow: false },
};

export default function NewPatientPage() {
  return (
    <EditorLayout
      title="Novo paciente"
      description="Cadastro interno, para marcar consultas. Nada daqui aparece no site."
      back={{ href: "/admin/pacientes", label: "Pacientes" }}
      aside={
        <Tips
          items={[
            "Telefone com DDD — é por ele que a busca e o WhatsApp funcionam.",
            "Anote só o necessário para o atendimento (LGPD: dado mínimo).",
          ]}
        />
      }
    >
      <PatientForm action={createPatientAction} submitLabel="Cadastrar paciente" />
    </EditorLayout>
  );
}
