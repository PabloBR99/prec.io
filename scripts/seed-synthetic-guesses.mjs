import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ── Config ───────────────────────────────────────────── */

const CV = 0.20; // coeficiente de variación (Weber-Fechner)
const SAMPLES = 150; // guesses sintéticos por producto
const SESSION_PREFIX = "synthetic";

/* ── Box-Muller: genera N(mean, σ²) ──────────────────── */

function normalRandom(mean, sigma) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * sigma;
}

/* ── Main ─────────────────────────────────────────────── */

const { data: products, error } = await supabase
  .from("products")
  .select("id, nombre, precio, fecha_asignada")
  .eq("activo", true)
  .order("fecha_asignada");

if (error || !products?.length) {
  console.error("Error fetching products:", error);
  process.exit(1);
}

console.log(`Found ${products.length} products\n`);

let totalInserted = 0;

for (const product of products) {
  const { id, nombre, precio, fecha_asignada } = product;

  // Skip if synthetic guesses already exist for this date
  const { count } = await supabase
    .from("guesses")
    .select("*", { count: "exact", head: true })
    .eq("fecha", fecha_asignada)
    .like("session_id", `${SESSION_PREFIX}-%`);

  if (count > 0) {
    console.log(`⏭  ${fecha_asignada} ${nombre} — already has ${count} synthetic guesses`);
    continue;
  }

  const sigma = precio * CV;
  const guesses = [];

  for (let i = 0; i < SAMPLES; i++) {
    // Generate guess from N(precio, σ²), clamp to [0, 100]
    const raw = normalRandom(precio, sigma);
    const guess = Math.round(Math.max(0, Math.min(100, raw)) * 100) / 100;

    const errorAbs = Math.round(Math.abs(guess - precio) * 100) / 100;
    const errorPct =
      precio > 0
        ? Math.round((errorAbs / precio) * 10000) / 100
        : 0;

    guesses.push({
      product_id: id,
      fecha: fecha_asignada,
      guess,
      error_abs: errorAbs,
      error_pct: errorPct,
      session_id: `${SESSION_PREFIX}-${i}`,
    });
  }

  const { error: insertError } = await supabase
    .from("guesses")
    .insert(guesses);

  if (insertError) {
    console.error(`❌ ${fecha_asignada} ${nombre}:`, insertError.message);
  } else {
    console.log(`✅ ${fecha_asignada} ${nombre} (${precio}€) — ${SAMPLES} guesses (σ=${sigma.toFixed(2)})`);
    totalInserted += SAMPLES;
  }
}

console.log(`\nDone: ${totalInserted} synthetic guesses inserted.`);
