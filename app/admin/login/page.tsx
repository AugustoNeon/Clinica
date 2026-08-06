import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/sections/AdminLoginForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center py-12">
      <h1 className="mb-6 text-2xl font-semibold">Painel administrativo</h1>
      <AdminLoginForm />
    </Container>
  );
}
