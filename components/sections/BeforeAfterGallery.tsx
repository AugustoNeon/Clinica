import Image from "next/image";
import { Card } from "@/components/ui/Card";
import type { BeforeAfterCase } from "@/lib/data/beforeAfter";

interface BeforeAfterGalleryProps {
  cases: BeforeAfterCase[];
}

export function BeforeAfterGallery({ cases }: BeforeAfterGalleryProps) {
  if (cases.length === 0) {
    return <p className="opacity-80">Nenhum caso publicado ainda.</p>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((item) => (
        <li key={item.id}>
          <Card className="overflow-hidden p-0">
            {/*
             * Sem aspect-square/object-cover de proposito: as fotos sao um
             * unico arquivo com antes (metade de cima) e depois (metade de
             * baixo) ja compostos, em proporcoes diferentes entre si —
             * cortar pra forcar quadrado arrisca cortar uma das duas metades.
             */}
            <Image
              src={item.imageUrl}
              alt={`Foto de antes e depois — ${item.procedure}`}
              width={1000}
              height={1000}
              className="h-auto w-full"
            />
            <p className="p-4 text-sm font-medium text-ink-muted">{item.procedure}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
