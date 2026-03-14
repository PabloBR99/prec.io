/**
 * Match seed products with Mercadona API to get high-quality imgix images.
 *
 * Usage: node scripts/match-mercadona-images.mjs
 */

const WH = "vlc1";
const BASE = "https://tienda.mercadona.es/api";

// Subcategory IDs that cover our seed products
const SUBCATS = [
  132, // Patatas fritas y snacks
  80,  // Galletas
  122, // Atún y conservas
  92,  // Chocolate
  72,  // Leche y bebidas vegetales
  78,  // Cereales
  143, // Zumos naranja
  120, // Pasta y fideos
  121, // Legumbres
  90,  // Mermelada y miel
  127, // Conservas de verdura y frutas
  130, // Gazpacho y cremas
  158, // Refresco de cola
  129, // Sopa y caldo
];

// Our seed products — name used for fuzzy matching
const SEED = [
  { nombre: "Coca-Cola Original 1L", marca: "Coca-Cola" },
  { nombre: "Pringles Original", marca: "Pringles" },
  { nombre: "Digestive Avena", marca: "Hacendado" },
  { nombre: "Atun claro en aceite de oliva", marca: "Hacendado" },
  { nombre: "Chocolate negro 85% cacao", marca: "Hacendado" },
  { nombre: "Leche desnatada Proteinas y Calcio", marca: "Hacendado" },
  { nombre: "Avena Crunchy", marca: "Hacendado" },
  { nombre: "Kelloggs Corn Flakes", marca: "Kelloggs" },
  { nombre: "Zumo pura naranja", marca: "Hacendado" },
  { nombre: "Galletas de espelta 0% azucares", marca: "Hacendado" },
  { nombre: "Pringles Paprika", marca: "Pringles" },
  { nombre: "Lays Horno al punto de sal", marca: "Lays" },
  { nombre: "Lays Gourmet Original", marca: "Lays" },
  { nombre: "Nachos Hacendado", marca: "Hacendado" },
  { nombre: "Chocolate negro 72%", marca: "Hacendado" },
  { nombre: "Muesli con quinoa, chia y chocolate negro", marca: "Hacendado" },
  { nombre: "Digestive Avena Choco", marca: "Gullon" },
  { nombre: "Gnocchi", marca: "Hacendado" },
  { nombre: "Helices Vegetales", marca: "Hacendado" },
  { nombre: "Penne Rigate Integral", marca: "Hacendado" },
  { nombre: "Patatas fritas Extra Crunch", marca: "Hacendado" },
  { nombre: "Garbanzos cocidos", marca: "Hacendado" },
  { nombre: "Atun claro al natural", marca: "Hacendado" },
  { nombre: "Corn Flakes 0% azucares", marca: "Hacendado" },
  { nombre: "Mermelada de fresa", marca: "Hacendado" },
  { nombre: "Confitura de fresa 0%", marca: "Hacendado" },
  { nombre: "Fritada Pisto", marca: "Hacendado" },
  { nombre: "Crema de verduras", marca: "Hacendado" },
  { nombre: "Spaghetti Integral Gallo", marca: "Gallo" },
  { nombre: "Leche semidesnatada", marca: "Central Lechera Asturiana" },
];

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s) {
  return new Set(normalize(s).split(" ").filter(t => t.length > 1));
}

function score(seedName, seedMarca, mercaName) {
  const seedTokens = tokenize(seedName + " " + seedMarca);
  const mercaTokens = tokenize(mercaName);
  let matches = 0;
  for (const t of seedTokens) {
    for (const m of mercaTokens) {
      if (m.includes(t) || t.includes(m)) { matches++; break; }
    }
  }
  return matches / seedTokens.size;
}

async function fetchSubcategory(id) {
  const url = `${BASE}/categories/${id}/?lang=es&wh=${WH}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const products = [];
  const extract = (cats) => {
    for (const c of cats || []) {
      for (const p of c.products || []) {
        products.push({
          id: p.id,
          name: p.display_name,
          thumbnail: p.thumbnail,
          price: p.price_instructions?.unit_price,
        });
      }
      if (c.categories) extract(c.categories);
    }
  };
  extract(data.categories || [data]);
  // Also check top-level products
  if (data.products) {
    for (const p of data.products) {
      products.push({
        id: p.id,
        name: p.display_name,
        thumbnail: p.thumbnail,
        price: p.price_instructions?.unit_price,
      });
    }
  }
  return products;
}

async function main() {
  console.log("Fetching Mercadona products from", SUBCATS.length, "subcategories...\n");

  const allProducts = [];
  for (const id of SUBCATS) {
    const prods = await fetchSubcategory(id);
    allProducts.push(...prods);
    process.stderr.write(`  subcat ${id}: ${prods.length} products\n`);
  }

  console.log(`\nTotal Mercadona products: ${allProducts.length}\n`);
  console.log("=".repeat(80));
  console.log("MATCHING RESULTS");
  console.log("=".repeat(80));

  let matched = 0;
  let unmatched = 0;

  for (const seed of SEED) {
    let bestScore = 0;
    let bestProduct = null;

    for (const mp of allProducts) {
      const s = score(seed.nombre, seed.marca, mp.name);
      if (s > bestScore) {
        bestScore = s;
        bestProduct = mp;
      }
    }

    if (bestScore >= 0.4 && bestProduct) {
      matched++;
      // Upgrade thumbnail to 600x600
      const imgUrl = bestProduct.thumbnail.replace("h=300&w=300", "h=600&w=600");
      console.log(`\n✅ ${seed.nombre} (${seed.marca})`);
      console.log(`   → ${bestProduct.name} (score: ${bestScore.toFixed(2)}, price: ${bestProduct.price}€)`);
      console.log(`   IMG: ${imgUrl}`);
    } else {
      unmatched++;
      console.log(`\n❌ ${seed.nombre} (${seed.marca})`);
      console.log(`   Best: ${bestProduct?.name} (score: ${bestScore.toFixed(2)}) — TOO LOW`);
    }
  }

  console.log(`\n${"=".repeat(80)}`);
  console.log(`Matched: ${matched}/${SEED.length}, Unmatched: ${unmatched}`);
}

main().catch(console.error);
