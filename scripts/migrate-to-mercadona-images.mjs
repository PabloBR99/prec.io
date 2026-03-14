/**
 * Migrate product images from Open Food Facts to Mercadona imgix CDN.
 * Updates both the live Supabase database.
 *
 * Usage: node --env-file=.env.local scripts/migrate-to-mercadona-images.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE env vars. Run with --env-file=.env.local");
  process.exit(1);
}

const IMGIX = "https://prod-mercadona.imgix.net/images";
const SIZE = "?fit=crop&h=600&w=600";

// Mapping: off_barcode → imgix image hash (verified matches)
const MIGRATIONS = [
  { barcode: "5449000054227", hash: "8c40e7d49e1d8cacb3fe57f84f87138a", note: "Coca-Cola → Mercadona 1.25L" },
  { barcode: "5053990127726", hash: "f2c0ce59a9f58aba9aceea1b6322a801", note: "Pringles Original" },
  { barcode: "8480000142139", hash: "2c600264c524fe6816b355533474d814", note: "Digestive Avena" },
  { barcode: "8480000180025", hash: "f99f0a2b9e478cee5b0e02fac62d4686", note: "Atún claro aceite oliva" },
  { barcode: "8480000607225", hash: "cb7d3bfd6ed5ad578883c843a9945b03", note: "Chocolate negro 85%" },
  { barcode: "8480000106780", hash: "c4558a06013b7b9c1afb6d188f1692f2", note: "Leche desnatada +Proteínas 1L" },
  { barcode: "8480000156112", hash: "2efe810b6483e668c6638f403f9e41c8", note: "Avena Crunchy" },
  { barcode: "3159470000120", hash: "2692711f88c9f20e6004998019e64504", note: "Kelloggs Corn Flakes" },
  { barcode: "8480000390103", hash: "b6d2cecc3bad138c6020b6d7eb67ef83", note: "Zumo pura naranja" },
  { barcode: "8480000142429", hash: "f4728c6877bec8f45d07ee1ddbab02fa", note: "Galletas espelta 0%" },
  { barcode: "8480000336408", hash: "5ea6209ff18125614b1c278484587d91", note: "Nachos Hacendado" },
  { barcode: "8480000237736", hash: "3ed5b4ca49186c84761e868ea53bd450", note: "Chocolate negro 72%" },
  { barcode: "8480000095367", hash: "1e4439a34bd442baf972925ac34110b6", note: "Muesli quinoa chia choco" },
  { barcode: "8015057003760", hash: "cba9ea825acfc6789572d4088ac61392", note: "Gnocchi" },
  { barcode: "8480000063441", hash: "5bd047881961f8b0d75b872f9fca6c37", note: "Hélices Vegetales" },
  { barcode: "8480000861467", hash: "879832bc0b56bbec28d90be8baab7426", note: "Patatas fritas Extra Crunch" },
  { barcode: "8480000260291", hash: "b8b807948038c4b64791632f799e9bd8", note: "Garbanzos cocidos" },
  { barcode: "8480000180186", hash: "69aa188c64eb23f4855d6739832b09c1", note: "Atún claro al natural" },
  { barcode: "8480000229663", hash: "413f941aa57b4903cc693d93171b87f7", note: "Corn Flakes 0% azúcares" },
  { barcode: "8480000867551", hash: "899369e0e11783224596d6489a4228b0", note: "Mermelada de fresa" },
  { barcode: "8402001009266", hash: "61d7e70d6c4f3ff537231caafc94d1aa", note: "Confitura de fresa 0%" },
  { barcode: "8480000087225", hash: "84004f26c61b916e664619ebaa88a44f", note: "Crema de verduras" },
  { barcode: "8410297012150", hash: "4e47699cd59e42ae6a11b6b83651542d", note: "Leche semidesnatada CLA 1L" },
];

async function main() {
  console.log(`Migrating ${MIGRATIONS.length} products to Mercadona imgix images...\n`);

  let success = 0;
  let failed = 0;

  for (const { barcode, hash, note } of MIGRATIONS) {
    const newUrl = `${IMGIX}/${hash}.jpg${SIZE}`;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?off_barcode=eq.${barcode}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ imagen_url: newUrl }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        console.log(`✅ ${note} (${barcode})`);
        success++;
      } else {
        console.log(`⚠️  ${note} (${barcode}) — no matching row`);
        failed++;
      }
    } else {
      console.log(`❌ ${note} (${barcode}) — HTTP ${res.status}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} updated, ${failed} failed/skipped`);
}

main().catch(console.error);
