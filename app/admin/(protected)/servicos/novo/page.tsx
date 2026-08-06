import type { Metadata } from "next";
import { ServiceForm } from "@/components/sections/ServiceForm";
import { createServiceAction } from "./actions";

export const metadata: Metadata = {
  title: "Novo servico",
  robots: { index: false, follow: false },
};

export default function NewServicePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Novo servico</h1>
      <ServiceForm action={createServiceAction} submitLabel="Criar servico" />
    </div>
  );
}
