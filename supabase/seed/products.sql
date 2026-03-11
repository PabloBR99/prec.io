-- Seed data: curated products with VERIFIED good-quality images from Open Food Facts
-- Run: DELETE FROM guesses; DELETE FROM products; before re-seeding

INSERT INTO products (nombre, imagen_url, precio, categoria, marca, cantidad, off_barcode, fecha_asignada) VALUES
-- ✅ Fondo blanco, foto limpia
('Coca-Cola Original 1L', 'https://images.openfoodfacts.org/images/products/544/900/005/4227/front_en.406.400.jpg', 1.25, 'Bebidas', 'Coca-Cola', '1L', '5449000054227', '2026-03-11'),
-- ✅ Fondo blanco, foto de estudio
('Pringles Original', 'https://images.openfoodfacts.org/images/products/505/399/012/7726/front_en.68.400.jpg', 2.49, 'Snacks', 'Pringles', '165g', '5053990127726', '2026-03-12'),
-- ✅ Foto limpia de producto
('Digestive Avena', 'https://images.openfoodfacts.org/images/products/848/000/014/2139/front_es.170.400.jpg', 1.35, 'Snacks', 'Hacendado', '425g', '8480000142139', '2026-03-13'),
-- ✅ Foto limpia fondo blanco
('Atun claro en aceite de oliva', 'https://images.openfoodfacts.org/images/products/848/000/018/0025/front_en.82.400.jpg', 5.29, 'Conservas', 'Hacendado', '6x80g', '8480000180025', '2026-03-14'),
-- ✅ Packaging oscuro, limpio
('Chocolate negro 85% cacao', 'https://images.openfoodfacts.org/images/products/848/000/060/7225/front_es.15.400.jpg', 1.25, 'Snacks', 'Hacendado', '100g', '8480000607225', '2026-03-15'),
-- ✅ Producto claro
('Leche desnatada Proteinas y Calcio', 'https://images.openfoodfacts.org/images/products/848/000/010/6780/front_es.166.400.jpg', 1.09, 'Lacteos', 'Hacendado', '1L', '8480000106780', '2026-03-16'),
-- ✅ Producto se ve bien
('Avena Crunchy', 'https://images.openfoodfacts.org/images/products/848/000/015/6112/front_es.138.400.jpg', 2.29, 'Desayuno', 'Hacendado', '400g', '8480000156112', '2026-03-17'),
-- ✅ Producto claro
('Kelloggs Corn Flakes', 'https://images.openfoodfacts.org/images/products/315/947/000/0120/front_en.147.400.jpg', 3.19, 'Desayuno', 'Kelloggs', '500g', '3159470000120', '2026-03-18'),
-- ✅ Fondo oscuro, producto visible
('Zumo pura naranja', 'https://images.openfoodfacts.org/images/products/848/000/039/0103/front_es.51.400.jpg', 1.79, 'Bebidas', 'Hacendado', '1L', '8480000390103', '2026-03-19'),
-- ✅ Producto bien visible
('Galletas de espelta 0% azucares', 'https://images.openfoodfacts.org/images/products/848/000/014/2429/front_es.168.400.jpg', 1.49, 'Snacks', 'Hacendado', '200g', '8480000142429', '2026-03-20'),
-- ✅ Pringles Paprika fondo blanco (misma calidad que Original)
('Pringles Paprika', 'https://images.openfoodfacts.org/images/products/505/399/016/1669/front_en.185.400.jpg', 2.49, 'Snacks', 'Pringles', '165g', '5053990161669', '2026-03-21'),
-- ✅ Lay's Horno, producto claro
('Lays Horno al punto de sal', 'https://images.openfoodfacts.org/images/products/841/019/900/2402/front_es.140.400.jpg', 1.99, 'Snacks', 'Lays', '150g', '8410199002402', '2026-03-22'),
-- ✅ Lay's Gourmet, packaging visible
('Lays Gourmet Original', 'https://images.openfoodfacts.org/images/products/841/019/902/3094/front_es.60.400.jpg', 2.29, 'Snacks', 'Lays', '170g', '8410199023094', '2026-03-23'),
-- ✅ Nachos packaging claro
('Nachos Hacendado', 'https://images.openfoodfacts.org/images/products/848/000/033/6408/front_en.57.400.jpg', 1.39, 'Snacks', 'Hacendado', '150g', '8480000336408', '2026-03-24'),
-- ✅ Foto limpia
('Chocolate negro 72%', 'https://images.openfoodfacts.org/images/products/848/000/023/7736/front_es.15.400.jpg', 1.10, 'Snacks', 'Hacendado', '100g', '8480000237736', '2026-03-25'),
-- ✅ Muesli foto aceptable
('Muesli con quinoa, chia y chocolate negro', 'https://images.openfoodfacts.org/images/products/848/000/009/5367/front_es.90.400.jpg', 2.75, 'Desayuno', 'Hacendado', '400g', '8480000095367', '2026-03-26'),
-- ✅ Digestive choco, buen packaging
('Digestive Avena Choco', 'https://images.openfoodfacts.org/images/products/841/037/602/6962/front_en.138.400.jpg', 1.89, 'Snacks', 'Gullon', '425g', '8410376026962', '2026-03-27'),
-- ✅ Gnocchi packaging limpio
('Gnocchi', 'https://images.openfoodfacts.org/images/products/801/505/700/3760/front_es.94.400.jpg', 1.49, 'Pasta', 'Hacendado', '500g', '8015057003760', '2026-03-28'),
-- ✅ Helices packaging claro
('Helices Vegetales', 'https://images.openfoodfacts.org/images/products/848/000/006/3441/front_es.67.400.jpg', 1.19, 'Pasta', 'Hacendado', '1kg', '8480000063441', '2026-03-29'),
-- ✅ Penne packaging aceptable
('Penne Rigate Integral', 'https://images.openfoodfacts.org/images/products/840/200/101/0194/front_es.32.400.jpg', 0.95, 'Pasta', 'Hacendado', '500g', '8402001010194', '2026-03-30'),
-- ✅ Patatas fritas packaging limpio
('Patatas fritas Extra Crunch', 'https://images.openfoodfacts.org/images/products/848/000/086/1467/front_es.57.400.jpg', 1.59, 'Snacks', 'Hacendado', '150g', '8480000861467', '2026-03-31'),
-- ✅ Garbanzos foto aceptable
('Garbanzos cocidos', 'https://images.openfoodfacts.org/images/products/848/000/026/0291/front_en.46.400.jpg', 0.89, 'Conservas', 'Hacendado', '570g', '8480000260291', '2026-04-01'),
-- ✅ Atun al natural foto OK
('Atun claro al natural', 'https://images.openfoodfacts.org/images/products/848/000/018/0186/front_en.57.400.jpg', 3.49, 'Conservas', 'Hacendado', '480g', '8480000180186', '2026-04-02'),
-- ✅ Corn Flakes 0% foto aceptable
('Corn Flakes 0% azucares', 'https://images.openfoodfacts.org/images/products/848/000/022/9663/front_en.52.400.jpg', 1.69, 'Desayuno', 'Hacendado', '300g', '8480000229663', '2026-04-03'),
-- ✅ Mermelada packaging visible
('Mermelada de fresa', 'https://images.openfoodfacts.org/images/products/848/000/086/7551/front_en.28.400.jpg', 1.59, 'Desayuno', 'Hacendado', '400g', '8480000867551', '2026-04-04'),
-- ✅ Confitura foto aceptable
('Confitura de fresa 0%', 'https://images.openfoodfacts.org/images/products/840/200/100/9266/front_es.69.400.jpg', 2.15, 'Desayuno', 'Hacendado', '380g', '8402001009266', '2026-04-05'),
-- ✅ Fritada foto aceptable
('Fritada Pisto', 'https://images.openfoodfacts.org/images/products/848/000/017/1122/front_en.60.400.jpg', 1.69, 'Conservas', 'Hacendado', '380g', '8480000171122', '2026-04-06'),
-- ✅ Crema verduras foto OK
('Crema de verduras', 'https://images.openfoodfacts.org/images/products/848/000/008/7225/front_es.37.400.jpg', 1.79, 'Conservas', 'Hacendado', '350ml', '8480000087225', '2026-04-07'),
-- ✅ Spaghetti Gallo
('Spaghetti Integral Gallo', 'https://images.openfoodfacts.org/images/products/841/006/901/8441/front_es.45.400.jpg', 1.39, 'Pasta', 'Gallo', '450g', '8410069018441', '2026-04-08'),
-- ✅ Leche semi CLA
('Leche semidesnatada', 'https://images.openfoodfacts.org/images/products/841/029/701/2150/front_en.78.400.jpg', 0.99, 'Lacteos', 'Central Lechera Asturiana', '1L', '8410297012150', '2026-04-09');
