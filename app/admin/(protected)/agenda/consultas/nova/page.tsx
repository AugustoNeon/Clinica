import type { Metadata } from "next";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { getAllPatients } from "@/lib/data/patients";
import { getAllServices } from "@/lib/data/services";
import { createAppointmentAction } from "./actions";

export const metadata: Metadata = {
  title: "Nova consulta",
  robots: { index: false, follow: false },
};

interface NewAppointmentPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default async function NewAppointmentPage({ searchParams }: NewAppointmentPageProps) {
  const { data } = await searchParams;
  const [patients, services] = await Promise.all([getAllPatients(), getAllServices()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nova consulta</h1>
      <AppointmentForm
        patients={patients}
        services={services}
        defaultDate={data}
        action={createAppointmentAction}
        submitLabel="Criar consulta"
      />
    </div>
  );
}
