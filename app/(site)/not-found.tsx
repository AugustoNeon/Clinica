import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/** `notFound()` dentro do site (ex.: slug de servico inexistente). */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
