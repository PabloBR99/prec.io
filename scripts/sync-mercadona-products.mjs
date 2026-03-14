#!/usr/bin/env node
/**
 * Fetch products from the Mercadona API and seed upcoming game dates in Supabase.
 *
 * ALL product data comes from the API:
 *   nombre, imagen_url, precio, categoria, marca, cantidad
 *
 * Usage:
 *   node scripts/sync-mercadona-products.mjs              # Seed next 30 days
 *   node scripts/sync-mercadona-products.mjs --days=60     # Custom range
 *   node scripts/sync-mercadona-products.mjs --dry-run     # Preview only
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────

const WH = 'vlc1'; // Warehouse: Valencia
const API = 'https://tienda.mercadona.es/api';
const MIN_PRICE = 0.50;
const MAX_PRICE = 15.00;
const DELAY_MS = 100; // polite delay between API calls

/** Top-level Mercadona categories to include (exact names from their API). */
const INCLUDE_CATEGORIES = new Set([
  'Aperitivos',                      // Patatas, frutos secos, aceitunas
  'Cereales y galletas',             // Cereales, galletas, tortitas
  'Azúcar, caramelos y chocolate',   // Chocolate, mermelada, golosinas
  'Conservas, caldos y cremas',      // Atún, conservas, sopas, gazpacho
  'Arroz, legumbres y pasta',        // Pasta, arroz, legumbres
  'Aceite, especias y salsas',       // Aceite, salsas, ketchup
  'Agua y refrescos',                // Refrescos, agua, isotónicos
  'Zumos',                           // Zumos de fruta
  'Cacao, café e infusiones',        // Café, cacao, té
  'Huevos, leche y mantequilla',     // Leche, mantequilla
  'Bodega',                          // Cerveza, vino
]);

/** Map Mercadona top-level category → our game category. */
const CATEGORY_MAP = {
  'Aperitivos': 'Snacks',
  'Cereales y galletas': 'Desayuno',
  'Azúcar, caramelos y chocolate': 'Dulces',
  'Conservas, caldos y cremas': 'Conservas',
  'Arroz, legumbres y pasta': 'Pasta',
  'Aceite, especias y salsas': 'Salsas',
  'Agua y refrescos': 'Bebidas',
  'Zumos': 'Bebidas',
  'Cacao, café e infusiones': 'Cafés',
  'Huevos, leche y mantequilla': 'Lácteos',
  'Bodega': 'Bebidas',
};

/** Brands we can reliably detect inside display_name. */
const KNOWN_BRANDS = [
  'Hacendado', 'Coca-Cola', 'Pepsi', 'Fanta', 'Schweppes', 'Aquarius',
  'Monster', 'Red Bull', 'KAS',
  'Pringles', "Lay's", 'Doritos', 'Cheetos', 'Ruffles',
  "Kellogg's", 'Nestlé', 'Nestle',
  'Milka', 'Valor', 'Lindt',
  'ColaCao', 'Nocilla', 'Nutella',
  'Philadelphia', "Hellmann's", 'Heinz',
  'Gallo', 'Bimbo', 'Lotus', 'Oreo',
  'Pascual', 'Puleva', 'Central Lechera Asturiana',
  'Cuétara', 'Gullón',
  'Nature Valley', 'Chips Ahoy',
  'Nescafé', 'Marcilla', 'Carmencita',
  'Carbonell', 'Koipe', 'La Española',
  'Mahou', 'Estrella Galicia', 'Amstel', 'Heineken',
  'Tosta Rica', 'Príncipe', 'Dinosaurus',
  'Maggi', 'Knorr', 'Gallina Blanca',
];

// ─── API helpers ─────────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

async function fetchTopCategories() {
  const data = await fetchJSON(`${API}/categories/?lang=es&wh=${WH}`);
  return data.results || data;
}

function extractProducts(node) {
  const products = [];
  for (const p of node.products || []) products.push(p);
  for (const sub of node.categories || []) products.push(...extractProducts(sub));
  return products;
}

async function fetchSubcategoryProducts(id) {
  try {
    const data = await fetchJSON(`${API}/categories/${id}/?lang=es&wh=${WH}`);
    return extractProducts(data);
  } catch {
    return [];
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Mapping ─────────────────────────────────────────────────────────────────

function extractBrand(displayName) {
  const lower = displayName.toLowerCase();
  for (const brand of KNOWN_BRANDS) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  return null;
}

function formatQuantity(pi) {
  if (!pi) return null;
  const { unit_size, size_format, total_units, is_pack } = pi;
  if (!unit_size || !size_format) return null;

  let qty;
  if (size_format === 'kg' && unit_size < 1) {
    qty = `${Math.round(unit_size * 1000)}g`;
  } else if (size_format === 'l' && unit_size < 1) {
    qty = `${Math.round(unit_size * 1000)}ml`;
  } else {
    const unit = size_format === 'l' ? 'L' : size_format;
    // Avoid trailing decimals for whole numbers
    const num = Number.isInteger(unit_size) ? unit_size : unit_size;
    qty = `${num}${unit}`;
  }

  if (is_pack && total_units > 1) qty = `${total_units}x ${qty}`;
  return qty;
}

function mapProduct(apiProduct, parentCategory) {
  const pi = apiProduct.price_instructions;
  const price = parseFloat(pi?.unit_price);
  if (!price || price <= 0) return null;

  const thumbnail = apiProduct.thumbnail || '';
  if (!thumbnail) return null;

  const imageUrl = thumbnail.replace('h=300&w=300', 'h=600&w=600');

  return {
    mercadona_id: String(apiProduct.id),
    nombre: apiProduct.display_name,
    imagen_url: imageUrl,
    precio: price,
    categoria: CATEGORY_MAP[parentCategory] || parentCategory,
    marca: extractBrand(apiProduct.display_name),
    cantidad: formatQuantity(pi),
  };
}

// ─── Selection ───────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Round-robin pick across categories for maximum variety.
 */
function selectDiverse(products, count) {
  const byCategory = {};
  for (const p of products) {
    const cat = p.categoria;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  }
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat] = shuffle(byCategory[cat]);
  }

  const selected = [];
  const cats = shuffle(Object.keys(byCategory));
  let idx = 0;
  while (selected.length < count) {
    const cat = cats[idx % cats.length];
    const pool = byCategory[cat];
    if (pool && pool.length > 0) selected.push(pool.pop());
    idx++;
    if (Object.values(byCategory).every((p) => p.length === 0)) break;
  }
  return selected;
}

// ─── Supabase ────────────────────────────────────────────────────────────────

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key);
}

async function getExistingDates(supabase) {
  const { data } = await supabase
    .from('products')
    .select('fecha_asignada')
    .not('fecha_asignada', 'is', null);
  return new Set((data || []).map((d) => d.fecha_asignada));
}

async function getExistingMercaIds(supabase) {
  const { data } = await supabase
    .from('products')
    .select('off_barcode')
    .not('off_barcode', 'is', null);
  return new Set((data || []).map((d) => d.off_barcode));
}

function getOpenDates(existingDates, days) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    if (!existingDates.has(iso)) dates.push(iso);
  }
  return dates;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const daysArg = args.find((a) => a.startsWith('--days='));
  const days = parseInt(daysArg?.split('=')[1] || '30', 10);
  const dryRun = args.includes('--dry-run');

  console.log(`\n🔄 Syncing Mercadona → Supabase (next ${days} days${dryRun ? ', DRY RUN' : ''})\n`);

  // 1. Discover subcategories from interesting top-level categories
  console.log('Fetching Mercadona categories...');
  const topCats = await fetchTopCategories();
  const subcats = [];
  for (const cat of topCats) {
    if (!INCLUDE_CATEGORIES.has(cat.name)) continue;
    for (const sub of cat.categories || []) {
      subcats.push({ id: sub.id, name: sub.name, parent: cat.name });
    }
  }
  console.log(`  → ${subcats.length} subcategories in ${INCLUDE_CATEGORIES.size} top-level categories\n`);

  // 2. Fetch products from each subcategory
  console.log('Fetching products...');
  const allMapped = [];
  for (const sub of subcats) {
    const raw = await fetchSubcategoryProducts(sub.id);
    const mapped = raw
      .map((p) => mapProduct(p, sub.parent))
      .filter(Boolean)
      .filter((p) => p.precio >= MIN_PRICE && p.precio <= MAX_PRICE);
    allMapped.push(...mapped);
    process.stderr.write(`  ${sub.name}: ${raw.length} raw → ${mapped.length} valid\n`);
    await sleep(DELAY_MS);
  }

  // 3. Deduplicate by mercadona_id
  const seen = new Set();
  const unique = allMapped.filter((p) => {
    if (seen.has(p.mercadona_id)) return false;
    seen.add(p.mercadona_id);
    return true;
  });
  console.log(`\nTotal: ${allMapped.length} → ${unique.length} unique products\n`);

  // 4. Check DB for existing dates and products
  const supabase = createSupabase();
  const existingDates = await getExistingDates(supabase);
  const existingMercaIds = await getExistingMercaIds(supabase);

  const available = unique.filter((p) => !existingMercaIds.has(p.mercadona_id));
  console.log(`Available (not already in DB): ${available.length}`);

  const openDates = getOpenDates(existingDates, days);
  console.log(`Open dates to fill: ${openDates.length}\n`);

  if (openDates.length === 0) {
    console.log('✅ No open dates — nothing to do.\n');
    return;
  }

  // 5. Select diverse products for open dates
  const selected = selectDiverse(available, openDates.length);
  console.log(`Selected ${selected.length} products for ${openDates.length} dates\n`);

  // 6. Prepare rows
  const rows = selected.map((product, i) => ({
    nombre: product.nombre,
    imagen_url: product.imagen_url,
    precio: product.precio,
    categoria: product.categoria,
    marca: product.marca,
    cantidad: product.cantidad,
    off_barcode: product.mercadona_id,
    fecha_asignada: openDates[i],
    activo: true,
  }));

  if (dryRun) {
    console.log('DRY RUN — would insert:\n');
    for (const r of rows) {
      console.log(`  ${r.fecha_asignada} | ${r.nombre} (${r.marca || '—'}) — ${r.precio}€ [${r.categoria}] ${r.cantidad || ''}`);
    }
    console.log(`\n  Total: ${rows.length} products\n`);
    return;
  }

  // 7. Insert in batches
  const BATCH = 20;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`  ❌ Batch ${Math.floor(i / BATCH) + 1} error:`, error.message);
    } else {
      for (const r of batch) {
        console.log(`  ✅ ${r.fecha_asignada} | ${r.nombre} — ${r.precio}€`);
      }
      inserted += batch.length;
    }
  }

  console.log(`\n✅ Done! Inserted ${inserted} products.\n`);
}

main().catch((err) => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
