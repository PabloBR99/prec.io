import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data } = await supabase
  .from("products")
  .select("id, nombre, imagen_url")
  .eq("activo", true)
  .order("fecha_asignada");

for (const p of data) {
  if (p.imagen_url.includes("supabase.co")) continue;
  const m = p.imagen_url.match(/\/images\/products\/([\d/]+)\//);
  const barcode = m ? m[1].replace(/\//g, "") : "?";
  console.log(`${barcode}|${p.id}|${p.nombre}`);
}
