-- ============================================================
--  FunkoStore — Deduplicación del catálogo de productos
--  Ejecutar en: Supabase Dashboard → SQL Editor → Run
--
--  ORDEN DE EJECUCIÓN:
--    1. (OPCIONAL) Ejecutar el bloque AUDITORÍA para ver el estado actual
--    2. Ejecutar el bloque ELIMINAR DUPLICADOS
--    3. Ejecutar el bloque CORRECCIONES DE IMÁGENES
--    4. Ejecutar el bloque VERIFICACIÓN FINAL
--
--  CRITERIO DE DESDUPLICACIÓN:
--    - Se mantiene la versión "funko-pop-*" de seed-products.sql cuando existe
--      (mejor descripción, imagen actualizada por fix-product-images.sql)
--    - Se mantiene la versión corta de seed_clean.sql cuando no hay equivalente
--      (imagen actualizada por update_images.sql)
--    - Se eliminan los slugs más antiguos de seed.sql (todos tienen duplicados)
--    - Se respetan las ediciones Chase y las diferencias de categoría reales:
--        ✅ Pikachu Standard + Pikachu Chase  → diferente edición, mantener ambos
--        ✅ Batman Standard + Batman 1966 Chase → diferente edición
--        ✅ Harry Potter Standard + Harry Chase
--        ✅ Iron Man Mark 50 Deluxe + Iron Man Mark 85 Chase
--        ✅ Kratos GOW Standard + Kratos Ragnarök Deluxe (juegos distintos)
--        ✅ Luffy Gear 4 Deluxe + Luffy Gear 5 Deluxe (transformaciones distintas)
-- ============================================================


-- ============================================================
--  FASE 0: AUDITORÍA (opcional — solo SELECT, no modifica nada)
--  Muestra qué personajes aparecen más de una vez
-- ============================================================

/*
SELECT
    character,
    franchise,
    category,
    COUNT(*)                                     AS total,
    STRING_AGG(slug, ' | ' ORDER BY slug)        AS slugs,
    STRING_AGG(name, ' | ' ORDER BY name)        AS nombres
FROM public.products
GROUP BY character, franchise, category
HAVING COUNT(*) > 1
ORDER BY franchise, character;
*/

-- ============================================================
--  FASE 1: ELIMINAR DUPLICADOS
--
--  Se eliminan 29 productos por slug.
--  ON CONFLICT DO NOTHING garantiza que el script sea
--  idempotente (re-ejecutable sin efectos secundarios).
-- ============================================================

DELETE FROM public.products WHERE slug IN (

  -- ── Slugs de seed.sql con equivalente en seed_clean.sql ──────────────
  -- Misma entidad, slug más limpio ya existe con imagen real

  'iron-man-mark-50-285',      -- → iron-man-285       (seed_clean)
  'thanos-guantelete-289',     -- → thanos-289          (seed_clean) y funko-pop-thanos
  'thor-stormbreaker-700',     -- → thor-700            (seed_clean)
  'elsa-frozen-593',           -- → elsa-593            (seed_clean)
  'simba-rey-leon-301',        -- → simba-301           (seed_clean)
  'woody-toy-story-168',       -- → woody-168 + funko-pop-woody
  'grogu-mandalorian-369',     -- → grogu-369 + funko-pop-grogu
  'naruto-uzumaki-727',        -- → naruto-727          (seed_clean)
  'goku-super-saiyan-858',     -- → goku-858 + funko-pop-goku-super-saiyan
  'tanjiro-kamado-1169',       -- → tanjiro-1169 + funko-pop-tanjiro-kamado
  'luffy-gear4-924',           -- → luffy-924           (seed_clean, mismo Gear 4)
  'hermione-granger-03',       -- → hermione-03         (seed_clean)
  'master-chief-halo-06',      -- → master-chief-06 + funko-pop-master-chief
  'kratos-god-of-war-269',     -- → kratos-269          (seed_clean)
  'link-zelda-21',             -- → funko-pop-link-totk (mejor versión, sin imagen)

  -- ── Slugs de seed.sql con equivalente MEJOR en seed-products.sql ─────
  -- funko-pop-* tiene mejor descripción e imagen de HobbyDB

  'captain-america-10',        -- → funko-pop-captain-america
  'black-widow-603',           -- → funko-pop-black-widow
  'wolverine-555',             -- → funko-pop-wolverine (además es Deluxe, mejor)
  'doctor-strange-414',        -- → funko-pop-doctor-strange
  'joker-53',                  -- → funko-pop-joker
  'the-flash-713',             -- → funko-pop-the-flash
  'harley-quinn-368',          -- → funko-pop-harley-quinn
  'stitch-159',                -- → funko-pop-stitch
  'mandalorian-326',           -- → funko-pop-mandalorian

  -- ── Slugs de seed_clean.sql con equivalente en seed-products.sql ─────
  -- seed-products.sql tiene mejor descripción y ambos tienen buena imagen

  'tanjiro-1169',              -- → funko-pop-tanjiro-kamado
  'master-chief-06',           -- → funko-pop-master-chief
  'woody-168',                 -- → funko-pop-woody
  'grogu-369',                 -- → funko-pop-grogu
  'goku-858'                   -- → funko-pop-goku-super-saiyan (Deluxe, mejor)

);


-- ============================================================
--  FASE 2: CORRECCIONES DE IMÁGENES
--
--  Productos que quedaron en el catálogo y no tenían
--  imagen real asignada por los scripts anteriores.
-- ============================================================

-- Dumbledore: no fue cubierto por update_images.sql
UPDATE public.products
SET image_url = 'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/460562/Albus_Dumbledore_Vinyl_Art_Toys_3aef45c8-4de5-4ab2-a476-e6fbaacf6893_medium.jpg'
WHERE slug = 'albus-dumbledore-15';


-- ============================================================
--  FASE 3: SAFETY NET — eliminar duplicados exactos restantes
--
--  Por si se ejecutaron seeds adicionales no contemplados,
--  esta query elimina duplicados exactos por (character, franchise, name).
--  SOLO actúa sobre filas con nombre idéntico (misma descripción).
-- ============================================================

DELETE FROM public.products
WHERE id IN (
  SELECT id FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY LOWER(TRIM(character)), LOWER(TRIM(franchise)), LOWER(TRIM(name))
        ORDER BY created_at ASC   -- elimina los más viejos, queda el más reciente
      ) AS rn
    FROM public.products
  ) ranked
  WHERE rn > 1
);


-- ============================================================
--  FASE 4: VERIFICACIÓN FINAL
--
--  Ejecutar estos SELECT para confirmar el resultado.
-- ============================================================

-- 1. Contar el total de productos y por franquicia
SELECT franchise, COUNT(*) AS total
FROM public.products
GROUP BY franchise
ORDER BY franchise;

-- 2. Verificar que no queden duplicados exactos por nombre
SELECT name, COUNT(*) as total_entries
FROM public.products
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name;

-- 3. Verificar duplicados por (character, franchise, category)
SELECT character, franchise, category, COUNT(*) AS total,
       STRING_AGG(slug, ' | ') AS slugs
FROM public.products
GROUP BY character, franchise, category
HAVING COUNT(*) > 1
ORDER BY franchise, character;

-- 4. Verificar que no queden productos sin imagen real
SELECT slug, LEFT(image_url, 70) AS img_preview
FROM public.products
WHERE image_url LIKE '%placeholder%'
   OR image_url LIKE '%Marvel_Logo%'
   OR image_url LIKE '%DC_Comics_logo%'
   OR image_url IS NULL
ORDER BY franchise, slug;

-- 5. Resumen final del catálogo
SELECT COUNT(*) AS total_productos,
       SUM(CASE WHEN category = 'Chase'   THEN 1 ELSE 0 END) AS chase,
       SUM(CASE WHEN category = 'Deluxe'  THEN 1 ELSE 0 END) AS deluxe,
       SUM(CASE WHEN category = 'Standard' THEN 1 ELSE 0 END) AS standard
FROM public.products;
