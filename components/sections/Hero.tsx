import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface HeroProps {
  title: string;
  subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg opacity-80">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contato" className={buttonClasses("primary")}>
              Agendar avaliacao
            </Link>
            <Link href="/servicos" className={buttonClasses("secondary")}>
              Ver servicos
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
