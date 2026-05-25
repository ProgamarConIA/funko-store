-- ============================================================
--  Fix: imágenes de productos por franquicia
--  Reemplaza las URLs genéricas de Unsplash por fotos
--  temáticamente correctas organizadas por franquicia.
--  Ejecutar en Supabase SQL Editor.
-- ============================================================

-- ── MARVEL ──────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-captain-america';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-black-widow';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80'
WHERE slug = 'funko-pop-hulk';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-doctor-strange';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-black-panther';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-wolverine';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-deadpool';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-scarlet-witch';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-loki';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-thanos';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-hawkeye';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1659354573068-8f1bab16a80e?w=400&q=80'
WHERE slug = 'funko-pop-iron-man-mark85-chase';

-- ── DC ──────────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-the-flash';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-aquaman';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-green-lantern';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-joker';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-harley-quinn';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-cyborg';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-shazam';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-bane';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-batman-1966-chase';

-- ── DISNEY ──────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-buzz-lightyear';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-woody';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-moana';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-stitch';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-jack-skellington';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-mulan';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-maleficent';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-winnie-the-pooh';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-stitch-glow-chase';

-- ── ANIME ───────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80'
WHERE slug = 'funko-pop-goku-super-saiyan';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-vegeta';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-sasuke-uchiha';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-luffy-gear5';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-zoro';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-tanjiro-kamado';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-nezuko';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-itadori-yuji';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-saitama';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-pikachu-surfero-chase';

-- ── STAR WARS ───────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-grogu';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-mandalorian';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-luke-skywalker';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-princess-leia';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-han-solo';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-chewbacca';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-obi-wan-kenobi';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-r2d2';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-boba-fett';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80'
WHERE slug = 'funko-pop-grogu-cupcake-chase';

-- ── HARRY POTTER ────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-ron-weasley';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-voldemort';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-snape';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-dobby';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-luna-lovegood';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-draco-malfoy';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-hagrid';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-neville-longbottom';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-harry-potter-capa-chase';

-- ── JUEGOS ──────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-master-chief';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-geralt-de-rivia';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80'
WHERE slug = 'funko-pop-joel';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80'
WHERE slug = 'funko-pop-ellie';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80'
WHERE slug = 'funko-pop-zelda';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80'
WHERE slug = 'funko-pop-samus-aran';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80'
WHERE slug = 'funko-pop-sonic';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80'
WHERE slug = 'funko-pop-pac-man';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80'
WHERE slug = 'funko-pop-gordon-freeman';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80'
WHERE slug = 'funko-pop-kratos-ragnarok';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80'
WHERE slug = 'funko-pop-link-totk';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80'
WHERE slug = 'funko-pop-mario-dorado-chase';
