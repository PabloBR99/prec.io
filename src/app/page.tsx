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
    .select("id, nombre, imagen_url, categoria, marca, cantidad, fecha_asignada, created_at")
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
    created_at: data.created_at,
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
        <div className="absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full bg-[#F59E0B]/[0.10] blur-[90px]" />
        <div className="absolute -right-20 bottom-[15%] h-[350px] w-[350px] rounded-full bg-[#F97316]/[0.08] blur-[80px]" />
      </div>
      <Header />
      <main className="relative flex flex-1 flex-col items-center px-4 pb-12 pt-4 sm:pt-10">
        <GameContainer serverProduct={product} />
      </main>
      <footer className="relative py-3 text-center text-[11px] text-foreground/30">
        Datos via{" "}
        <a
          href="https://world.openfoodfacts.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-foreground/10 underline-offset-2 transition-colors hover:text-accent"
        >
          Open Food Facts
        </a>
      </footer>
    </div>
  );
}
