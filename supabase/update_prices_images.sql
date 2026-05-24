-- ============================================================
-- FunkoStore - Actualizar precios a ARS e imágenes reales
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- MARVEL
UPDATE products SET price = 12500,
  image_url = 'https://images.funko.com/catalog/category/35/72725_SpidermanNoWayHome_SpiderManBlack-Gold_GLAM.jpg'
WHERE character ILIKE '%Spider%';

UPDATE products SET price = 13000,
  image_url = 'https://images.funko.com/catalog/category/35/46650_Marvel80th_IRONMANMK3_GLAM.jpg'
WHERE character ILIKE '%Iron Man%';

UPDATE products SET price = 11500,
  image_url = 'https://images.funko.com/catalog/category/35/7229_Marvel_CaptainAmerica_GLAM.jpg'
WHERE character ILIKE '%Captain America%';

UPDATE products SET price = 12000,
  image_url = 'https://images.funko.com/catalog/category/35/7232_Marvel_Thor_GLAM.jpg'
WHERE character = 'Thor';

UPDATE products SET price = 13500,
  image_url = 'https://images.funko.com/catalog/category/35/16360_BlackPanther_GLAM.jpg'
WHERE character ILIKE '%Black Panther%';

UPDATE products SET price = 15000,
  image_url = 'https://images.funko.com/catalog/category/35/46979_Marvel_Deadpool_WithChimichanga_GLAM.jpg'
WHERE character ILIKE '%Deadpool%';

UPDATE products SET price = 14000,
  image_url = 'https://images.funko.com/catalog/category/35/6035_MARVEL_Wolverine_GLAM.jpg'
WHERE character ILIKE '%Wolverine%';

UPDATE products SET price = 14500,
  image_url = 'https://images.funko.com/catalog/category/35/37316_Marvel_Venom_GLAM.jpg'
WHERE character ILIKE '%Venom%';

UPDATE products SET price = 11000,
  image_url = 'https://images.funko.com/catalog/category/35/6023_MARVEL_Hulk_GLAM.jpg'
WHERE character = 'Hulk';

UPDATE products SET price = 16000,
  image_url = 'https://images.funko.com/catalog/category/35/26294_Marvel_Avengers3_Thanos_GLAM.jpg'
WHERE character ILIKE '%Thanos%';

-- DC
UPDATE products SET price = 11500,
  image_url = 'https://images.funko.com/catalog/category/35/10103_DC_BatmanHush_GLAM.jpg'
WHERE character ILIKE '%Batman%';

UPDATE products SET price = 11000,
  image_url = 'https://images.funko.com/catalog/category/35/7233_DC_Superman_GLAM.jpg'
WHERE character = 'Superman';

UPDATE products SET price = 12000,
  image_url = 'https://images.funko.com/catalog/category/35/10095_DC_WonderWoman_GLAM.jpg'
WHERE character ILIKE '%Wonder Woman%';

UPDATE products SET price = 13000,
  image_url = 'https://images.funko.com/catalog/category/35/36012_DC_Joker_GLAM.jpg'
WHERE character ILIKE '%Joker%';

UPDATE products SET price = 10500,
  image_url = 'https://images.funko.com/catalog/category/35/36009_DC_Aquaman_GLAM.jpg'
WHERE character ILIKE '%Aquaman%';

UPDATE products SET price = 11500,
  image_url = 'https://images.funko.com/catalog/category/35/37384_DCHeroes_TheFlash_GLAM.jpg'
WHERE character ILIKE '%Flash%';

-- DISNEY
UPDATE products SET price = 11000,
  image_url = 'https://images.funko.com/catalog/category/25/7224_Disney_MickeyMouse_GLAM.jpg'
WHERE character ILIKE '%Mickey%';

UPDATE products SET price = 10500,
  image_url = 'https://images.funko.com/catalog/category/25/24052_Disney_FrozenII_Elsa_GLAM.jpg'
WHERE character = 'Elsa';

UPDATE products SET price = 10500,
  image_url = 'https://images.funko.com/catalog/category/25/12043_Disney_Moana_GLAM.jpg'
WHERE character = 'Moana';

UPDATE products SET price = 10500,
  image_url = 'https://images.funko.com/catalog/category/25/6001_Disney_Simba_GLAM.jpg'
WHERE character ILIKE '%Simba%';

UPDATE products SET price = 12000,
  image_url = 'https://images.funko.com/catalog/category/25/21395_Disney_LiloandStitch_Stitch_GLAM.jpg'
WHERE character ILIKE '%Stitch%';

-- STAR WARS
UPDATE products SET price = 13000,
  image_url = 'https://images.funko.com/catalog/category/23/7229_StarWars_DarthVader_GLAM.jpg'
WHERE character ILIKE '%Darth Vader%';

UPDATE products SET price = 12500,
  image_url = 'https://images.funko.com/catalog/category/23/7228_StarWars_Yoda_GLAM.jpg'
WHERE character = 'Yoda';

UPDATE products SET price = 14000,
  image_url = 'https://images.funko.com/catalog/category/23/45534_SWMando_BabyYoda_GLAM.jpg'
WHERE character ILIKE '%Grogu%' OR character ILIKE '%Baby Yoda%';

UPDATE products SET price = 13500,
  image_url = 'https://images.funko.com/catalog/category/23/39370_Mandalorian_GLAM.jpg'
WHERE character ILIKE '%Mandalorian%';

-- ANIME
UPDATE products SET price = 13000,
  image_url = 'https://images.funko.com/catalog/category/35/6455_animation_Naruto_naruto_GLAM.jpg'
WHERE character = 'Naruto';

UPDATE products SET price = 12500,
  image_url = 'https://images.funko.com/catalog/category/35/11062_animation_DragonBall_GokuSSJ_GLAM.jpg'
WHERE character ILIKE '%Goku%';

UPDATE products SET price = 12000,
  image_url = 'https://images.funko.com/catalog/category/35/98728_animation_OnePiece_LuffyGear5_GLAM.jpg'
WHERE character ILIKE '%Luffy%';

UPDATE products SET price = 14500,
  image_url = 'https://images.funko.com/catalog/category/35/47851_animation_Naruto_Itachi_GLAM.jpg'
WHERE character = 'Itachi';

UPDATE products SET price = 13500,
  image_url = 'https://images.funko.com/catalog/category/35/55735_animation_DemonSlayer_Tanjiro_GLAM.jpg'
WHERE character ILIKE '%Tanjiro%';

-- HARRY POTTER
UPDATE products SET price = 11000,
  image_url = 'https://images.funko.com/catalog/category/35/5891_HarryPotter_HarryPotter_GLAM.jpg'
WHERE character = 'Harry Potter';

UPDATE products SET price = 11500,
  image_url = 'https://images.funko.com/catalog/category/35/5892_HarryPotter_Hermione_GLAM.jpg'
WHERE character ILIKE '%Hermione%';

UPDATE products SET price = 12500,
  image_url = 'https://images.funko.com/catalog/category/35/5889_HarryPotter_Dumbledore_GLAM.jpg'
WHERE character ILIKE '%Dumbledore%';

-- GAMES
UPDATE products SET price = 13000,
  image_url = 'https://images.funko.com/catalog/category/35/21_Games_Zelda_Link_GLAM.jpg'
WHERE character ILIKE '%Link%';

UPDATE products SET price = 14000,
  image_url = 'https://images.funko.com/catalog/category/35/6453_games_Halo_MasterChief_GLAM.jpg'
WHERE character ILIKE '%Master Chief%';

UPDATE products SET price = 15000,
  image_url = 'https://images.funko.com/catalog/category/35/44938_GOW_Kratos_GLAM.jpg'
WHERE character ILIKE '%Kratos%';
