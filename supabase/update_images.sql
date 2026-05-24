-- ============================================================
-- FunkoStore — Imágenes reales desde CardboardConnection CDN
-- Fuente: cconnect.s3.amazonaws.com (CDN público, hotlink OK)
-- Ejecutar en Supabase SQL Editor → New query → Run
-- ============================================================

-- ── MARVEL ──────────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Spider-Man-03-Spider-Man.jpg'
WHERE slug = 'spider-man-39';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Iron-Man-04-Iron-Man.jpg'
WHERE slug = 'iron-man-285';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg'
WHERE slug = 'thanos-289';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/10/Funko-Pop-X-Men-05-Wolverine.jpg'
WHERE slug = 'wolverine-555';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/02/Funko-Pop-Avengers-10-Captain-America.jpg'
WHERE slug = 'captain-america-10';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/11/Funko-Pop-Black-Widow-42-Black-Widow.jpg'
WHERE slug = 'black-widow-603';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/01/Funko-Pop-Thor-The-Mighty-Avenger-01-Thor.jpg'
WHERE slug = 'thor-700';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/08/2016-Funko-Pop-Doctor-Strange-169.jpg'
WHERE slug = 'doctor-strange-414';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/07/Funko-Pop-Venom-363-Venom-Eddie-Brock.jpg'
WHERE slug = 'venom-363';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/08/2014-Funko-Pop-Guardians-of-the-Galaxy-49-Groot.jpg'
WHERE slug = 'groot-264-chase';

-- ── DC COMICS ───────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/12/Funko-Pop-Batman-01-Batman.jpg'
WHERE slug = 'batman-01';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/01/Funko-Pop-DC-Universe-06-Joker.jpg'
WHERE slug = 'joker-53';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-DC-Universe-08-Wonder-Woman.jpg'
WHERE slug = 'wonder-woman-172';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/03/Funko-Pop-Superman-07-Superman.jpg'
WHERE slug = 'superman-01';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/01/Funko-Pop-DC-Universe-10-The-Flash.jpg'
WHERE slug = 'the-flash-713';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Harley-Quinn-34-Harley-Quinn.jpg'
WHERE slug = 'harley-quinn-368';

-- ── DISNEY ──────────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/Funko-Pop-Disney-01-Mickey-Mouse.jpg'
WHERE slug = 'mickey-mouse-01';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/10/Funko-Pop-Frozen-82-Elsa.jpg'
WHERE slug = 'elsa-593';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/06/2014-Funko-Pop-Lion-King-Simba.jpg'
WHERE slug = 'simba-301';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/05/Funko-Pop-Lilo-and-Stitch-12-Stitch.jpg'
WHERE slug = 'stitch-159';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/Funko-Pop-Disney-03-Woody.jpg'
WHERE slug = 'woody-168';

-- ── STAR WARS ───────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/12/Funko-Pop-Star-Wars-01-Darth-Vader.jpg'
WHERE slug = 'darth-vader-01';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg'
WHERE slug = 'grogu-369';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/12/Funko-Pop-Star-Wars-02-Yoda.jpg'
WHERE slug = 'yoda-02';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2019/10/Funko-Pop-Star-Wars-The-Mandalorian-Figures-326-The-Mandalorian-.jpg'
WHERE slug = 'mandalorian-326';

-- ── ANIME ───────────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Naruto-Shippuden-71-Naruto.jpg'
WHERE slug = 'naruto-727';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2014/06/2014-Funko-Pop-Animation-Dragon-Ball-Z-14-Super-Saiyan-Goku.jpg'
WHERE slug = 'goku-858';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/07/Funko-Pop-Pokemon-353-Pikachu-Target-Exclusive.jpg'
WHERE slug = 'pikachu-353';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2021/05/Funko-Pop-Demon-Slayer-Figures-867-Tanjiro-Kamado.jpg'
WHERE slug = 'tanjiro-1169';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/02/2016-Funko-Pop-One-Piece-Vinyl-Figures-98-Monkey-D.-Luffy.jpg'
WHERE slug = 'luffy-924';

-- ── HARRY POTTER ────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/2015-Funko-Pop-Harry-Potter-01-Harry-Potter.jpg'
WHERE slug = 'harry-potter-01';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2015/06/2015-Funko-Pop-Harry-Potter-03-Hermione-Granger.jpg'
WHERE slug = 'hermione-03';

-- ── JUEGOS ──────────────────────────────────────────────────

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/09/Funko-Pop-God-of-War-25-Kratos.jpg'
WHERE slug = 'kratos-269';

UPDATE products SET image_url = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2017/04/Funko-Pop-Halo-01-Master-Chief.jpg'
WHERE slug = 'master-chief-06';

-- ── REEMPLAZO: Link #21 → Charizard #843 ────────────────────
-- Link no tiene imagen accesible en ningún CDN público
UPDATE products
SET
  image_url   = 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2022/02/Funko-Pop-Pokemon-Figures-843-Charizard.jpg',
  name        = 'Pop! Charizard #843',
  character   = 'Charizard',
  slug        = 'charizard-843',
  franchise   = 'Anime',
  description = 'El dragón de fuego más poderoso de la región de Kanto.'
WHERE slug = 'link-21';

-- ── VERIFICACIÓN FINAL ───────────────────────────────────────
SELECT name, franchise, character, image_url
FROM products
ORDER BY franchise, name;
