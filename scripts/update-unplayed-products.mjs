import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const replacements = [
  { fecha: '2026-03-14', nombre: 'Crema de cacao con avellanas Nutella', imagen_url: 'https://prod-mercadona.imgix.net/images/c2dddb8c129b6e17ebf2af26631d0df9.jpg?fit=crop&h=600&w=600', precio: 4.00, categoria: 'Desayuno', marca: 'Nutella', cantidad: '350g', off_barcode: null },
  { fecha: '2026-03-15', nombre: 'Chocolate con leche Milka', imagen_url: 'https://prod-mercadona.imgix.net/images/e6cbab042ce93bc6756ef45ff91a19bc.jpg?fit=crop&h=600&w=600', precio: 2.15, categoria: 'Snacks', marca: 'Milka', cantidad: '150g', off_barcode: null },
  { fecha: '2026-03-16', nombre: 'Leche semidesnatada Asturiana', imagen_url: 'https://prod-mercadona.imgix.net/images/599728432d51afa362440f7a580864c7.jpg?fit=crop&h=600&w=600', precio: 1.85, categoria: 'Lacteos', marca: 'Central Lechera Asturiana', cantidad: '1.5L', off_barcode: '8410297012150' },
  { fecha: '2026-03-17', nombre: 'ColaCao Original', imagen_url: 'https://prod-mercadona.imgix.net/images/22cdf053d37e905dbd4b4a3ae6d59b58.jpg?fit=crop&h=600&w=600', precio: 5.00, categoria: 'Desayuno', marca: 'ColaCao', cantidad: '383g', off_barcode: null },
  { fecha: '2026-03-18', nombre: 'Kelloggs Corn Flakes', imagen_url: 'https://prod-mercadona.imgix.net/images/2692711f88c9f20e6004998019e64504.jpg?fit=crop&h=600&w=600', precio: 2.50, categoria: 'Desayuno', marca: 'Kelloggs', cantidad: '500g', off_barcode: '3159470000120' },
  { fecha: '2026-03-19', nombre: 'Zumo pura naranja', imagen_url: 'https://prod-mercadona.imgix.net/images/b6d2cecc3bad138c6020b6d7eb67ef83.jpg?fit=crop&h=600&w=600', precio: 1.79, categoria: 'Bebidas', marca: 'Hacendado', cantidad: '1L', off_barcode: '8480000390103' },
  { fecha: '2026-03-20', nombre: 'Galletas caramelizadas Lotus Biscoff', imagen_url: 'https://prod-mercadona.imgix.net/images/5563e0f563ab97a575c2842aec27303a.jpg?fit=crop&h=600&w=600', precio: 1.25, categoria: 'Snacks', marca: 'Lotus', cantidad: '186g', off_barcode: null },
  { fecha: '2026-03-21', nombre: 'Pringles Crema agria y cebolla', imagen_url: 'https://prod-mercadona.imgix.net/images/f073e900385c00f0fe9a761086076724.jpg?fit=crop&h=600&w=600', precio: 1.95, categoria: 'Snacks', marca: 'Pringles', cantidad: '165g', off_barcode: null },
  { fecha: '2026-03-22', nombre: 'Chocolate puro Valor', imagen_url: 'https://prod-mercadona.imgix.net/images/aa913b2fa1c66a54865c286a31ccb51c.jpg?fit=crop&h=600&w=600', precio: 5.25, categoria: 'Snacks', marca: 'Valor', cantidad: '300g', off_barcode: null },
  { fecha: '2026-03-23', nombre: 'Galletas tostadas Tosta Rica', imagen_url: 'https://prod-mercadona.imgix.net/images/e3e73dbb54453a3fc7d187dec30f4c21.jpg?fit=crop&h=600&w=600', precio: 2.95, categoria: 'Snacks', marca: 'Cuetara', cantidad: '570g', off_barcode: null },
  { fecha: '2026-03-24', nombre: 'Nachos Hacendado', imagen_url: 'https://prod-mercadona.imgix.net/images/5ea6209ff18125614b1c278484587d91.jpg?fit=crop&h=600&w=600', precio: 1.39, categoria: 'Snacks', marca: 'Hacendado', cantidad: '150g', off_barcode: '8480000336408' },
  { fecha: '2026-03-25', nombre: 'Chocolate con leche extrafino Nestle', imagen_url: 'https://prod-mercadona.imgix.net/images/9428764c15483648201a00f1560fd907.jpg?fit=crop&h=600&w=600', precio: 1.50, categoria: 'Snacks', marca: 'Nestle', cantidad: '125g', off_barcode: null },
  { fecha: '2026-03-26', nombre: 'Nesquik cacao soluble', imagen_url: 'https://prod-mercadona.imgix.net/images/06273f58632b6178bc30831c642dc92b.jpg?fit=crop&h=600&w=600', precio: 4.20, categoria: 'Desayuno', marca: 'Nesquik', cantidad: '390g', off_barcode: null },
  { fecha: '2026-03-27', nombre: 'Nocilla original', imagen_url: 'https://prod-mercadona.imgix.net/images/853eeead5986a678da9f49fc986f343c.jpg?fit=crop&h=600&w=600', precio: 2.95, categoria: 'Desayuno', marca: 'Nocilla', cantidad: '360g', off_barcode: null },
  { fecha: '2026-03-28', nombre: 'Gnocchi', imagen_url: 'https://prod-mercadona.imgix.net/images/cba9ea825acfc6789572d4088ac61392.jpg?fit=crop&h=600&w=600', precio: 1.49, categoria: 'Pasta', marca: 'Hacendado', cantidad: '500g', off_barcode: '8015057003760' },
  { fecha: '2026-03-29', nombre: 'Barritas de avena Nature Valley chocolate negro', imagen_url: 'https://prod-mercadona.imgix.net/images/ab5be32491002de5c7fddad34d25fde4.jpg?fit=crop&h=600&w=600', precio: 1.95, categoria: 'Snacks', marca: 'Nature Valley', cantidad: '210g', off_barcode: null },
  { fecha: '2026-03-30', nombre: 'Mayonesa Hellmanns', imagen_url: 'https://prod-mercadona.imgix.net/images/4532a40515867d803fa054c5d18f5d12.jpg?fit=crop&h=600&w=600', precio: 2.65, categoria: 'Salsas', marca: 'Hellmanns', cantidad: '450ml', off_barcode: null },
  { fecha: '2026-03-31', nombre: 'Patatas fritas Extra Crunch', imagen_url: 'https://prod-mercadona.imgix.net/images/879832bc0b56bbec28d90be8baab7426.jpg?fit=crop&h=600&w=600', precio: 1.59, categoria: 'Snacks', marca: 'Hacendado', cantidad: '150g', off_barcode: '8480000861467' },
  { fecha: '2026-04-01', nombre: 'Garbanzos cocidos', imagen_url: 'https://prod-mercadona.imgix.net/images/b8b807948038c4b64791632f799e9bd8.jpg?fit=crop&h=600&w=600', precio: 0.89, categoria: 'Conservas', marca: 'Hacendado', cantidad: '570g', off_barcode: '8480000260291' },
  { fecha: '2026-04-02', nombre: 'Choco Krispies Kelloggs', imagen_url: 'https://prod-mercadona.imgix.net/images/3aa570213697c9cd80248d024110faf1.jpg?fit=crop&h=600&w=600', precio: 2.95, categoria: 'Desayuno', marca: 'Kelloggs', cantidad: '420g', off_barcode: null },
  { fecha: '2026-04-03', nombre: 'Galletas mini Oreo', imagen_url: 'https://prod-mercadona.imgix.net/images/5f23108e1655a080e08563ce3ad4a5c4.jpg?fit=crop&h=600&w=600', precio: 1.95, categoria: 'Snacks', marca: 'Oreo', cantidad: '160g', off_barcode: null },
  { fecha: '2026-04-04', nombre: 'Mermelada de fresa', imagen_url: 'https://prod-mercadona.imgix.net/images/899369e0e11783224596d6489a4228b0.jpg?fit=crop&h=600&w=600', precio: 1.59, categoria: 'Desayuno', marca: 'Hacendado', cantidad: '400g', off_barcode: '8480000867551' },
  { fecha: '2026-04-05', nombre: 'Special K Classic Kelloggs', imagen_url: 'https://prod-mercadona.imgix.net/images/7217d5cc7c1294828207ae7eab262d1e.jpg?fit=crop&h=600&w=600', precio: 3.25, categoria: 'Desayuno', marca: 'Kelloggs', cantidad: '450g', off_barcode: null },
  { fecha: '2026-04-06', nombre: 'Crema de verduras', imagen_url: 'https://prod-mercadona.imgix.net/images/84004f26c61b916e664619ebaa88a44f.jpg?fit=crop&h=600&w=600', precio: 1.79, categoria: 'Conservas', marca: 'Hacendado', cantidad: '350ml', off_barcode: '8480000087225' },
  { fecha: '2026-04-07', nombre: 'Surtido bombones Caja Roja Nestle', imagen_url: 'https://prod-mercadona.imgix.net/images/be36f58e752b6920adb7e8ecc4a653e7.jpg?fit=crop&h=600&w=600', precio: 6.95, categoria: 'Snacks', marca: 'Nestle', cantidad: '198g', off_barcode: null },
  { fecha: '2026-04-08', nombre: 'Barritas de galleta Chips Ahoy chocolate con leche', imagen_url: 'https://prod-mercadona.imgix.net/images/fc1f3da1290f5b6e78f240714ebe9094.jpg?fit=crop&h=600&w=600', precio: 1.50, categoria: 'Snacks', marca: 'Chips Ahoy', cantidad: '140g', off_barcode: null },
  { fecha: '2026-04-09', nombre: 'Chocolate negro 70% Valor con nueces macadamia', imagen_url: 'https://prod-mercadona.imgix.net/images/b6eb77fc1373ceeaddd2c152cf99f17b.jpg?fit=crop&h=600&w=600', precio: 3.95, categoria: 'Snacks', marca: 'Valor', cantidad: '150g', off_barcode: null },
];

console.log(`Updating ${replacements.length} unplayed products...\n`);

for (const r of replacements) {
  const { data: product, error: fetchErr } = await supabase
    .from('products')
    .select('id, nombre')
    .eq('fecha_asignada', r.fecha)
    .single();

  if (fetchErr || !product) {
    console.error(`  ${r.fecha}: product not found`, fetchErr?.message);
    continue;
  }

  // Delete synthetic guesses
  const { error: delErr } = await supabase
    .from('guesses')
    .delete()
    .eq('product_id', product.id)
    .like('session_id', 'synthetic-%');

  if (delErr) {
    console.error(`  ${r.fecha}: error deleting guesses`, delErr.message);
    continue;
  }

  // Update product
  const { error: updErr } = await supabase
    .from('products')
    .update({
      nombre: r.nombre,
      imagen_url: r.imagen_url,
      precio: r.precio,
      categoria: r.categoria,
      marca: r.marca,
      cantidad: r.cantidad,
      off_barcode: r.off_barcode,
    })
    .eq('id', product.id);

  if (updErr) {
    console.error(`  ${r.fecha}: error updating`, updErr.message);
  } else {
    const old = product.nombre.padEnd(45);
    console.log(`  ${r.fecha} | ${old} -> ${r.nombre} (${r.marca})`);
  }
}

console.log('\nDone updating products.');
