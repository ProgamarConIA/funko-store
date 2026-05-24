-- ============================================================
-- FunkoStore — Actualizar precios a EUR
-- Ejecutar en Supabase SQL Editor → New query → Run
-- ============================================================

-- ── MARVEL ──────────────────────────────────────────────────
UPDATE products SET price = 12.99 WHERE character ILIKE '%Spider%';
UPDATE products SET price = 13.99 WHERE character ILIKE '%Iron Man%';
UPDATE products SET price = 11.99 WHERE character ILIKE '%Captain America%';
UPDATE products SET price = 12.99 WHERE character = 'Thor';
UPDATE products SET price = 13.99 WHERE character ILIKE '%Black Panther%';
UPDATE products SET price = 15.99 WHERE character ILIKE '%Deadpool%';
UPDATE products SET price = 14.99 WHERE character ILIKE '%Wolverine%';
UPDATE products SET price = 14.99 WHERE character ILIKE '%Venom%';
UPDATE products SET price = 11.99 WHERE character = 'Hulk';
UPDATE products SET price = 16.99 WHERE character ILIKE '%Thanos%';

-- ── DC ──────────────────────────────────────────────────────
UPDATE products SET price = 11.99 WHERE character ILIKE '%Batman%';
UPDATE products SET price = 10.99 WHERE character = 'Superman';
UPDATE products SET price = 12.99 WHERE character ILIKE '%Wonder Woman%';
UPDATE products SET price = 13.99 WHERE character ILIKE '%Joker%';
UPDATE products SET price = 10.99 WHERE character ILIKE '%Aquaman%';
UPDATE products SET price = 11.99 WHERE character ILIKE '%Flash%';

-- ── DISNEY ──────────────────────────────────────────────────
UPDATE products SET price = 10.99 WHERE character ILIKE '%Mickey%';
UPDATE products SET price = 10.99 WHERE character = 'Elsa';
UPDATE products SET price = 10.99 WHERE character = 'Moana';
UPDATE products SET price = 10.99 WHERE character ILIKE '%Simba%';
UPDATE products SET price = 12.99 WHERE character ILIKE '%Stitch%';

-- ── STAR WARS ───────────────────────────────────────────────
UPDATE products SET price = 13.99 WHERE character ILIKE '%Darth Vader%';
UPDATE products SET price = 12.99 WHERE character = 'Yoda';
UPDATE products SET price = 14.99 WHERE character ILIKE '%Grogu%' OR character ILIKE '%Baby Yoda%' OR character ILIKE '%The Child%';
UPDATE products SET price = 13.99 WHERE character ILIKE '%Mandalorian%';

-- ── ANIME ───────────────────────────────────────────────────
UPDATE products SET price = 13.99 WHERE character = 'Naruto';
UPDATE products SET price = 12.99 WHERE character ILIKE '%Goku%';
UPDATE products SET price = 12.99 WHERE character ILIKE '%Luffy%';
UPDATE products SET price = 14.99 WHERE character ILIKE '%Itachi%';
UPDATE products SET price = 13.99 WHERE character ILIKE '%Tanjiro%';

-- ── HARRY POTTER ────────────────────────────────────────────
UPDATE products SET price = 10.99 WHERE franchise = 'Harry Potter' AND character ILIKE '%Harry%';
UPDATE products SET price = 11.99 WHERE character ILIKE '%Hermione%';
UPDATE products SET price = 12.99 WHERE character ILIKE '%Dumbledore%';

-- ── JUEGOS ──────────────────────────────────────────────────
UPDATE products SET price = 13.99 WHERE character ILIKE '%Link%';
UPDATE products SET price = 14.99 WHERE character ILIKE '%Master Chief%';
UPDATE products SET price = 15.99 WHERE character ILIKE '%Kratos%';

-- ── VERIFICACION ────────────────────────────────────────────
SELECT name, franchise, price FROM products ORDER BY franchise, price;
