-- Seed data: all images from Mercadona imgix CDN (professional studio photos)
-- Source: tienda.mercadona.es/api — products available in Mercadona online
-- Run: DELETE FROM guesses; DELETE FROM products; before re-seeding

INSERT INTO products (nombre, imagen_url, precio, categoria, marca, cantidad, off_barcode, fecha_asignada) VALUES
-- 📸 Mercadona imgix — PLAYED
('Coca-Cola Original 1L', 'https://prod-mercadona.imgix.net/images/8c40e7d49e1d8cacb3fe57f84f87138a.jpg?fit=crop&h=600&w=600', 1.25, 'Bebidas', 'Coca-Cola', '1L', '5449000054227', '2026-03-11'),
-- 📸 Mercadona imgix — PLAYED
('Pringles Original', 'https://prod-mercadona.imgix.net/images/f2c0ce59a9f58aba9aceea1b6322a801.jpg?fit=crop&h=600&w=600', 2.49, 'Snacks', 'Pringles', '165g', '5053990127726', '2026-03-12'),
-- 📸 Mercadona imgix — PLAYED
('Digestive Avena', 'https://prod-mercadona.imgix.net/images/2c600264c524fe6816b355533474d814.jpg?fit=crop&h=600&w=600', 1.35, 'Snacks', 'Hacendado', '425g', '8480000142139', '2026-03-13'),
-- 📸 Mercadona imgix
('Crema de cacao con avellanas Nutella', 'https://prod-mercadona.imgix.net/images/c2dddb8c129b6e17ebf2af26631d0df9.jpg?fit=crop&h=600&w=600', 4.00, 'Desayuno', 'Nutella', '350g', NULL, '2026-03-14'),
-- 📸 Mercadona imgix
('Chocolate con leche Milka', 'https://prod-mercadona.imgix.net/images/e6cbab042ce93bc6756ef45ff91a19bc.jpg?fit=crop&h=600&w=600', 2.15, 'Snacks', 'Milka', '150g', NULL, '2026-03-15'),
-- 📸 Mercadona imgix
('Leche semidesnatada Asturiana', 'https://prod-mercadona.imgix.net/images/599728432d51afa362440f7a580864c7.jpg?fit=crop&h=600&w=600', 1.85, 'Lacteos', 'Central Lechera Asturiana', '1.5L', '8410297012150', '2026-03-16'),
-- 📸 Mercadona imgix
('ColaCao Original', 'https://prod-mercadona.imgix.net/images/22cdf053d37e905dbd4b4a3ae6d59b58.jpg?fit=crop&h=600&w=600', 5.00, 'Desayuno', 'ColaCao', '383g', NULL, '2026-03-17'),
-- 📸 Mercadona imgix
('Kelloggs Corn Flakes', 'https://prod-mercadona.imgix.net/images/2692711f88c9f20e6004998019e64504.jpg?fit=crop&h=600&w=600', 2.50, 'Desayuno', 'Kelloggs', '500g', '3159470000120', '2026-03-18'),
-- 📸 Mercadona imgix
('Zumo pura naranja', 'https://prod-mercadona.imgix.net/images/b6d2cecc3bad138c6020b6d7eb67ef83.jpg?fit=crop&h=600&w=600', 1.79, 'Bebidas', 'Hacendado', '1L', '8480000390103', '2026-03-19'),
-- 📸 Mercadona imgix
('Galletas caramelizadas Lotus Biscoff', 'https://prod-mercadona.imgix.net/images/5563e0f563ab97a575c2842aec27303a.jpg?fit=crop&h=600&w=600', 1.25, 'Snacks', 'Lotus', '186g', NULL, '2026-03-20'),
-- 📸 Mercadona imgix
('Pringles Crema agria y cebolla', 'https://prod-mercadona.imgix.net/images/f073e900385c00f0fe9a761086076724.jpg?fit=crop&h=600&w=600', 1.95, 'Snacks', 'Pringles', '165g', NULL, '2026-03-21'),
-- 📸 Mercadona imgix
('Chocolate puro Valor', 'https://prod-mercadona.imgix.net/images/aa913b2fa1c66a54865c286a31ccb51c.jpg?fit=crop&h=600&w=600', 5.25, 'Snacks', 'Valor', '300g', NULL, '2026-03-22'),
-- 📸 Mercadona imgix
('Galletas tostadas Tosta Rica', 'https://prod-mercadona.imgix.net/images/e3e73dbb54453a3fc7d187dec30f4c21.jpg?fit=crop&h=600&w=600', 2.95, 'Snacks', 'Cuetara', '570g', NULL, '2026-03-23'),
-- 📸 Mercadona imgix
('Nachos Hacendado', 'https://prod-mercadona.imgix.net/images/5ea6209ff18125614b1c278484587d91.jpg?fit=crop&h=600&w=600', 1.39, 'Snacks', 'Hacendado', '150g', '8480000336408', '2026-03-24'),
-- 📸 Mercadona imgix
('Chocolate con leche extrafino Nestle', 'https://prod-mercadona.imgix.net/images/9428764c15483648201a00f1560fd907.jpg?fit=crop&h=600&w=600', 1.50, 'Snacks', 'Nestle', '125g', NULL, '2026-03-25'),
-- 📸 Mercadona imgix
('Nesquik cacao soluble', 'https://prod-mercadona.imgix.net/images/06273f58632b6178bc30831c642dc92b.jpg?fit=crop&h=600&w=600', 4.20, 'Desayuno', 'Nesquik', '390g', NULL, '2026-03-26'),
-- 📸 Mercadona imgix
('Nocilla original', 'https://prod-mercadona.imgix.net/images/853eeead5986a678da9f49fc986f343c.jpg?fit=crop&h=600&w=600', 2.95, 'Desayuno', 'Nocilla', '360g', NULL, '2026-03-27'),
-- 📸 Mercadona imgix
('Gnocchi', 'https://prod-mercadona.imgix.net/images/cba9ea825acfc6789572d4088ac61392.jpg?fit=crop&h=600&w=600', 1.49, 'Pasta', 'Hacendado', '500g', '8015057003760', '2026-03-28'),
-- 📸 Mercadona imgix
('Barritas de avena Nature Valley chocolate negro', 'https://prod-mercadona.imgix.net/images/ab5be32491002de5c7fddad34d25fde4.jpg?fit=crop&h=600&w=600', 1.95, 'Snacks', 'Nature Valley', '210g', NULL, '2026-03-29'),
-- 📸 Mercadona imgix
('Mayonesa Hellmanns', 'https://prod-mercadona.imgix.net/images/4532a40515867d803fa054c5d18f5d12.jpg?fit=crop&h=600&w=600', 2.65, 'Salsas', 'Hellmanns', '450ml', NULL, '2026-03-30'),
-- 📸 Mercadona imgix
('Patatas fritas Extra Crunch', 'https://prod-mercadona.imgix.net/images/879832bc0b56bbec28d90be8baab7426.jpg?fit=crop&h=600&w=600', 1.59, 'Snacks', 'Hacendado', '150g', '8480000861467', '2026-03-31'),
-- 📸 Mercadona imgix
('Garbanzos cocidos', 'https://prod-mercadona.imgix.net/images/b8b807948038c4b64791632f799e9bd8.jpg?fit=crop&h=600&w=600', 0.89, 'Conservas', 'Hacendado', '570g', '8480000260291', '2026-04-01'),
-- 📸 Mercadona imgix
('Choco Krispies Kelloggs', 'https://prod-mercadona.imgix.net/images/3aa570213697c9cd80248d024110faf1.jpg?fit=crop&h=600&w=600', 2.95, 'Desayuno', 'Kelloggs', '420g', NULL, '2026-04-02'),
-- 📸 Mercadona imgix
('Galletas mini Oreo', 'https://prod-mercadona.imgix.net/images/5f23108e1655a080e08563ce3ad4a5c4.jpg?fit=crop&h=600&w=600', 1.95, 'Snacks', 'Oreo', '160g', NULL, '2026-04-03'),
-- 📸 Mercadona imgix
('Mermelada de fresa', 'https://prod-mercadona.imgix.net/images/899369e0e11783224596d6489a4228b0.jpg?fit=crop&h=600&w=600', 1.59, 'Desayuno', 'Hacendado', '400g', '8480000867551', '2026-04-04'),
-- 📸 Mercadona imgix
('Special K Classic Kelloggs', 'https://prod-mercadona.imgix.net/images/7217d5cc7c1294828207ae7eab262d1e.jpg?fit=crop&h=600&w=600', 3.25, 'Desayuno', 'Kelloggs', '450g', NULL, '2026-04-05'),
-- 📸 Mercadona imgix
('Crema de verduras', 'https://prod-mercadona.imgix.net/images/84004f26c61b916e664619ebaa88a44f.jpg?fit=crop&h=600&w=600', 1.79, 'Conservas', 'Hacendado', '350ml', '8480000087225', '2026-04-06'),
-- 📸 Mercadona imgix
('Surtido bombones Caja Roja Nestle', 'https://prod-mercadona.imgix.net/images/be36f58e752b6920adb7e8ecc4a653e7.jpg?fit=crop&h=600&w=600', 6.95, 'Snacks', 'Nestle', '198g', NULL, '2026-04-07'),
-- 📸 Mercadona imgix
('Barritas de galleta Chips Ahoy chocolate con leche', 'https://prod-mercadona.imgix.net/images/fc1f3da1290f5b6e78f240714ebe9094.jpg?fit=crop&h=600&w=600', 1.50, 'Snacks', 'Chips Ahoy', '140g', NULL, '2026-04-08'),
-- 📸 Mercadona imgix
('Chocolate negro 70% Valor con nueces macadamia', 'https://prod-mercadona.imgix.net/images/b6eb77fc1373ceeaddd2c152cf99f17b.jpg?fit=crop&h=600&w=600', 3.95, 'Snacks', 'Valor', '150g', NULL, '2026-04-09');
