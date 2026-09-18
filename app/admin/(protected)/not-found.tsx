import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Registro não encontrado",
  robots: { index: false, follow: false },
};

/**
 * 404 dentro do painel (ex.: link de edição de um registro já excluído).
 * Sem este arquivo o `notFound()` caía no 404 do site público, com menu e
 * rodapé públicos no meio do painel (issue #69).
 */
export default function AdminNotFound() {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Registro não encontrado"
        description="O item pode ter sido excluído ou o endereço está errado. Nada foi alterado."
      />
      <div className="flex flex-wrap gap-3">
        <Link href="/admin" className={buttonClasses("primary")}>
          Voltar ao início do painel
        </Link>
      </div>
    </div>
  );
}
