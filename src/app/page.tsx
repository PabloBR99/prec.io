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
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 pb-8 pt-4">
        <GameContainer serverProduct={product} />
      </main>
      <footer className="py-4 text-center text-xs text-foreground/30">
        prec.io &mdash; Datos de productos via Open Food Facts
      </footer>
    </div>
  );
}
