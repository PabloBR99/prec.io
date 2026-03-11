/**
 * Script to download product images and upload them to Supabase Storage.
 * Updates the imagen_url in the products table.
 *
 * Usage: node scripts/migrate-images.mjs
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = "product-images";

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });
    if (error) {
      console.error("Error creating bucket:", error.message);
      process.exit(1);
    }
    console.log(`Bucket '${BUCKET}' created`);
  } else {
    console.log(`Bucket '${BUCKET}' already exists`);
  }
}

async function downloadImage(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { "User-Agent": "prec.io/1.0 (image-migration)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function extractBarcode(url) {
  // URL pattern: .../images/products/544/900/005/4227/front_en.406.400.jpg
  const match = url.match(/\/images\/products\/([\d/]+)\//);
  if (!match) return null;
  return match[1].replace(/\//g, "");
}

async function main() {
  await ensureBucket();

  // Get all active products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, nombre, imagen_url, fecha_asignada")
    .eq("activo", true)
    .order("fecha_asignada", { ascending: true });

  if (error || !products) {
    console.error("Error fetching products:", error?.message);
    process.exit(1);
  }

  console.log(`Found ${products.length} products\n`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    const oldUrl = product.imagen_url;

    // Skip if already migrated to Supabase
    if (oldUrl.includes("supabase.co")) {
      console.log(`✓ ${product.nombre} — already migrated`);
      success++;
      continue;
    }

    const barcode = extractBarcode(oldUrl) || product.id;
    const ext = path.extname(new URL(oldUrl).pathname) || ".jpg";
    const storagePath = `${barcode}${ext}`;

    try {
      console.log(`↓ Downloading: ${product.nombre}...`);
      const imageData = await downloadImage(oldUrl);

      console.log(`↑ Uploading: ${storagePath} (${(imageData.length / 1024).toFixed(0)} KB)...`);
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, imageData, {
          contentType: `image/${ext.replace(".", "")}`,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

      const newUrl = publicUrlData.publicUrl;

      // Update product
      const { error: updateError } = await supabase
        .from("products")
        .update({ imagen_url: newUrl })
        .eq("id", product.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      console.log(`✓ ${product.nombre} → ${newUrl}\n`);
      success++;
    } catch (err) {
      console.error(`✗ ${product.nombre} — ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} migrated, ${failed} failed`);
}

main();
