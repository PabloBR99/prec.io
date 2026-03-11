import { Header } from "@/components/ui/Header";
import { GameContainer } from "@/components/game/GameContainer";
import { createServiceClient } from "@/lib/supabase/server";
import { getGameDate } from "@/lib/game/date-utils";
import type { Product } from "@/types/game";

async function getTodayProduct(): Promise<Product | null> {
  const supabase = createServiceClient();
  const today = getGameDate();

  const { data } = await supabase
    .from("products")
    .select("id, nombre, imagen_url, categoria, marca, cantidad, fecha_asignada")
    .eq("fecha_asignada", today)
    .eq("activo", true)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    nombre: data.nombre,
    imagen_url: data.imagen_url,
    categoria: data.categoria,
    marca: data.marca,
    cantidad: data.cantidad,
    fecha: data.fecha_asignada,
  };
}

export const revalidate = 60;

export default async function Home() {
  const product = await getTodayProduct();

  return (
    <div className="relative mx-auto flex min-h-screen max-w-lg flex-col">
      {/* Radial clearing — very subtle, dots visible everywhere */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_35%_30%_at_50%_42%,var(--background)_0%,transparent_50%)] opacity-70" />

      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Warm blobs */}
        <div className="absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full bg-[#F59E0B]/[0.10] blur-[90px]" />
        <div className="absolute -right-20 bottom-[15%] h-[350px] w-[350px] rounded-full bg-[#F97316]/[0.08] blur-[80px]" />

        {/* € watermarks — more visible */}
        <span
          className="absolute right-[2%] top-[5%] select-none font-[family-name:var(--font-space-grotesk)] text-[160px] font-black leading-none text-accent/[0.08] sm:right-[4%] sm:text-[200px]"
          style={{ animation: "euro-drift-1 9s ease-in-out infinite" }}
        >€</span>
        <span
          className="absolute -left-4 bottom-[8%] select-none font-[family-name:var(--font-space-grotesk)] text-[130px] font-black leading-none text-[#F97316]/[0.07] sm:left-[1%] sm:text-[160px]"
          style={{ animation: "euro-drift-2 11s ease-in-out infinite" }}
        >€</span>
        <span
          className="absolute right-[6%] bottom-[30%] select-none font-[family-name:var(--font-space-grotesk)] text-[70px] font-bold leading-none text-accent/[0.07] sm:text-[90px]"
          style={{ animation: "euro-drift-3 8s ease-in-out infinite" }}
        >€</span>
      </div>
      <Header />
      <main className="relative flex flex-1 flex-col items-center px-4 pb-8 pt-6">
        <GameContainer serverProduct={product} />
      </main>
      <footer className="relative border-t border-foreground/[0.08] py-4 text-center text-xs text-foreground/40">
        <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-foreground/50">prec.io</span>
        {" "}&mdash; Datos de productos via{" "}
        <a
          href="https://world.openfoodfacts.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline decoration-accent/20 underline-offset-2 transition-colors hover:text-accent"
        >
          Open Food Facts
        </a>
      </footer>
    </div>
  );
}
