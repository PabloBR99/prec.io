/**
 * Download product images via Open Food Facts API and upload to Supabase Storage.
 * Falls back to alternative image URLs when the main CDN is down.
 *
 * Usage: node --env-file=.env.local scripts/migrate-images-v2.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = "product-images";

async function tryDownload(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { "User-Agent": "prec.io/1.0 (image-migration)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "image/jpeg";
  return { buffer: Buffer.from(await res.arrayBuffer()), contentType: ct };
}

async function getImageFromApi(barcode) {
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=image_front_url,image_front_small_url,image_url`,
    {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "prec.io/1.0 (image-migration)" },
    }
  );
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const data = await res.json();
  const p = data.product || {};

  // Try multiple image fields in order of preference
  const urls = [
    p.image_front_url,
    p.image_url,
    p.image_front_small_url,
  ].filter(Boolean);

  for (const url of urls) {
    try {
      return await tryDownload(url);
    } catch {
      console.log(`  ↳ Failed: ${url}`);
    }
  }
  throw new Error("No working image URL found");
}

async function main() {
  const { data: products } = await supabase
    .from("products")
    .select("id, nombre, imagen_url")
    .eq("activo", true)
    .order("fecha_asignada");

  const pending = products.filter((p) => !p.imagen_url.includes("supabase.co"));
  console.log(`${pending.length} products need migration\n`);

  let success = 0;

  for (const product of pending) {
    const m = product.imagen_url.match(/\/images\/products\/([\d/]+)\//);
    const barcode = m ? m[1].replace(/\//g, "") : null;

    if (!barcode) {
      console.log(`✗ ${product.nombre} — no barcode found`);
      continue;
    }

    try {
      console.log(`↓ ${product.nombre} (${barcode})...`);

      // First try direct URL
      let result;
      try {
        result = await tryDownload(product.imagen_url);
      } catch {
        // Fall back to API
        console.log("  ↳ Direct failed, trying API...");
        result = await getImageFromApi(barcode);
      }

      const ext = result.contentType.includes("png") ? ".png" : ".jpg";
      const storagePath = `${barcode}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, result.buffer, {
          contentType: result.contentType,
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

      await supabase
        .from("products")
        .update({ imagen_url: urlData.publicUrl })
        .eq("id", product.id);

      console.log(`✓ ${product.nombre} → uploaded\n`);
      success++;
    } catch (err) {
      console.error(`✗ ${product.nombre} — ${err.message}\n`);
    }
  }

  console.log(`\nDone: ${success}/${pending.length} migrated`);
}

main();
