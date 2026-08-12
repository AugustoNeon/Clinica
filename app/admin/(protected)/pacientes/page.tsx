import type { Metadata } from "next";
import Link from "next/link";
import { getAllPatients } from "@/lib/data/patients";

export const metadata: Metadata = {
  title: "Pacientes",
  robots: { index: false, follow: false },
};

export default async function AdminPatientsPage() {
  const patients = await getAllPatients();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pacientes</h1>
        <Link href="/admin/pacientes/novo" className="underline underline-offset-2">
          + Novo paciente
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/15">
        {patients.map((patient) => (
          <li key={patient.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm opacity-70">{patient.phone}</p>
            </div>
            <Link
              href={`/admin/pacientes/${patient.id}/editar`}
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
