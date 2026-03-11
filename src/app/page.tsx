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
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#F59E0B]/[0.07] blur-[120px]" />
        <div className="absolute -right-[15%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#F97316]/[0.05] blur-[120px]" />
        <div className="absolute left-[20%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-[#EF4444]/[0.03] blur-[100px]" />
      </div>
      <Header />
      <main className="relative flex flex-1 flex-col items-center px-4 pb-8 pt-6">
        <GameContainer serverProduct={product} />
      </main>
      <footer className="relative border-t border-foreground/[0.06] py-4 text-center text-xs text-foreground/30">
        <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-foreground/40">prec.io</span>
        {" "}&mdash; Datos de productos via{" "}
        <a
          href="https://world.openfoodfacts.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-foreground/10 underline-offset-2 transition-colors hover:text-foreground/50"
        >
          Open Food Facts
        </a>
      </footer>
    </div>
  );
}
