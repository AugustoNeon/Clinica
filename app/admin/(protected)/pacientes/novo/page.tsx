import type { Metadata } from "next";
import { PatientForm } from "@/components/sections/PatientForm";
import { createPatientAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo paciente",
  robots: { index: false, follow: false },
};

export default function NewPatientPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Novo paciente</h1>
      <PatientForm action={createPatientAction} submitLabel="Criar paciente" />
    </div>
  );
}
