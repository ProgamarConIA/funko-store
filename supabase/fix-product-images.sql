-- ============================================================
--  FunkoStore — Imágenes reales de productos
--  EJECUTAR EN: Supabase Dashboard → SQL Editor → Run
--
--  Fuentes usadas:
--  ✅ cconnect.s3.amazonaws.com  — CDN oficial del blog de Funko
--  ☑  images.hobbydb.com         — Fotos reales de coleccionistas
--
--  Si alguna imagen falla al cargar, el componente ProductCard
--  usa DEFAULT_PRODUCT_IMAGE como fallback automático.
-- ============================================================

-- ── MARVEL ──────────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://cconnect.s3.amazonaws.com/wp-content/uploads/2016/12/Funko-Pop-Captain-America-06-Captain-America.jpg'
WHERE slug = 'funko-pop-captain-america';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462012/Black_Widow_%2528w%252F_Shield%2529_Vinyl_Art_Toys_118b35b7-0b88-450e-85f5-7a0b72fc6fb6_medium.jpg'
WHERE slug = 'funko-pop-black-widow';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/504782/Hulk_%2528Ragnarok%2529_Vinyl_Art_Toys_8c862a34-d1a5-4fd7-a52a-19d75097c6f5_medium.jpg'
WHERE slug = 'funko-pop-hulk';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1172400/Doctor_Strange_Vinyl_Art_Toys_1da58aef-5a85-4d2f-b5d6-724c9bac9cdb_medium.jpg'
WHERE slug = 'funko-pop-doctor-strange';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1298006/Civil_War%253A_Black_Panther_Vinyl_Art_Toys_0619c3dc-9539-4d18-bf20-e1ab9662ef03_medium.jpeg'
WHERE slug = 'funko-pop-black-panther';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/837743/Wolverine_%2528Brown%2529_Vinyl_Art_Toys_66c5fc4f-0834-4ba0-b204-130b6f1c30be_medium.jpg'
WHERE slug = 'funko-pop-wolverine';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1186912/Deadpool_With_Chimichanga_Vinyl_Art_Toys_8d46f6fe-9179-44ea-a58e-e69da3145fa0_medium.jpg'
WHERE slug = 'funko-pop-deadpool';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462236/Scarlet_Witch_%2528Civil_War%2529_Vinyl_Art_Toys_9e8268af-3322-4fc6-846e-8e56725a8ad3_medium.jpg'
WHERE slug = 'funko-pop-scarlet-witch';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/854645/Loki_%2528The_Avengers%2529_Vinyl_Art_Toys_2dd5d422-0927-4667-8533-02603c653457_medium.jpeg'
WHERE slug = 'funko-pop-loki';

UPDATE products SET image_url =
  'https://cconnect.s3.amazonaws.com/wp-content/uploads/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg'
WHERE slug = 'funko-pop-thanos';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/470776/Hawkeye_Vinyl_Art_Toys_f589b182-36f6-4448-9911-2c14d60d6481_medium.jpg'
WHERE slug = 'funko-pop-hawkeye';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/852283/Iron_Man_%2528Bobble-Head%2529_%257B2011%257D_Vinyl_Art_Toys_2db46c66-c0fd-49ab-9f8d-9dcf6983e3d8_medium.jpeg'
WHERE slug = 'funko-pop-iron-man-mark85-chase';

-- ── DC ──────────────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/458301/The_Flash_%2528DC_Super_Heroes%2529_Vinyl_Art_Toys_39a94c1b-872f-47bc-a46f-272439999ad4_medium.jpg'
WHERE slug = 'funko-pop-the-flash';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1232530/Aquaman_Vinyl_Art_Toys_8355e395-e6ec-495c-89e7-2f591a34074b_medium.png'
WHERE slug = 'funko-pop-aquaman';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1332189/Green_Lantern_Vinyl_Art_Toys_6ae6db8a-c30d-4a3e-ad58-f096958c1981_medium.png'
WHERE slug = 'funko-pop-green-lantern';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1329750/The_Joker_Vinyl_Art_Toys_c5595d7b-c14d-447c-b07c-cb05e5dda2e3_medium.png'
WHERE slug = 'funko-pop-joker';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/796496/Harley_Quinn_Vinyl_Art_Toys_2b974562-db20-4a3e-8e23-13b86bcbcf47_medium.png'
WHERE slug = 'funko-pop-harley-quinn';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462356/Cyborg_Vinyl_Art_Toys_2c4bdf86-b6d8-4800-92c4-3571b713872f_medium.jpg'
WHERE slug = 'funko-pop-cyborg';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1332202/Shazam%2521_Vinyl_Art_Toys_9a2e0936-e4ba-4c25-9da5-34ecb8c6c6d9_medium.png'
WHERE slug = 'funko-pop-shazam';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/2149217/Bane_Art_Toys_84a09bbe-a4c1-404f-a3fd-46a1f2458e13(2)_medium.webp'
WHERE slug = 'funko-pop-bane';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/458260/Batman_%2528DC_Super_Heroes%2529_Vinyl_Art_Toys_7735ca73-5f0a-4dd2-ac26-900dd1a498b1_medium.jpg'
WHERE slug = 'funko-pop-batman-1966-chase';

-- ── DISNEY ──────────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/458205/Buzz_Lightyear_Vinyl_Art_Toys_8be7abd8-2e45-41ed-9518-04648a217a7e_medium.jpg'
WHERE slug = 'funko-pop-buzz-lightyear';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1386297/Woody_Vinyl_Art_Toys_e0e40a35-4642-42f3-8d64-ff7737adc284_medium.png'
WHERE slug = 'funko-pop-woody';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/966380/Moana_Vinyl_Art_Toys_fa5114f5-de88-4aeb-9edb-80f24882cfe9_medium.png'
WHERE slug = 'funko-pop-moana';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1469337/Stitch_Vinyl_Art_Toys_73e23b45-d755-4b3d-b961-1719262469fc_medium.jpg'
WHERE slug = 'funko-pop-stitch';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1386330/Jack_Skellington_Vinyl_Art_Toys_77b02345-4097-4b14-8dac-22a1fff5403d_medium.png'
WHERE slug = 'funko-pop-jack-skellington';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/461934/Mulan_Vinyl_Art_Toys_198a3ec4-3d7c-4a81-a371-ae85b31b5a7e_medium.jpg'
WHERE slug = 'funko-pop-mulan';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1344897/Maleficent_%2528metallic_9%25E2%2580%259D%2529_Vinyl_Art_Toys_3800112e-8f4f-49bb-beca-de22c807beea_medium.jpeg'
WHERE slug = 'funko-pop-maleficent';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1004323/Winnie_The_Pooh_%2528Flocked%2529_Vinyl_Art_Toys_3c475d30-c252-4c7e-9260-ed15f1ef3e61_medium.jpg'
WHERE slug = 'funko-pop-winnie-the-pooh';

-- Chase de Stitch (reutilizamos la misma imagen con variante glow)
UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1469337/Stitch_Vinyl_Art_Toys_73e23b45-d755-4b3d-b961-1719262469fc_medium.jpg'
WHERE slug = 'funko-pop-stitch-glow-chase';

-- ── ANIME ───────────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/457996/Super_Saiyan_Goku_Vinyl_Art_Toys_6e8950e3-9c41-46af-9f76-6a19f9779ece_medium.jpg'
WHERE slug = 'funko-pop-goku-super-saiyan';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1377190/Majin_Vegeta_Vinyl_Art_Toys_744ec280-bb7b-4ce6-835c-d9ee73e60638_medium.png'
WHERE slug = 'funko-pop-vegeta';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/795050/Sasuke_Uchiha_Art_Toys_7ab4bac1-e8ac-4bc1-bad3-51b1c1cc0b4c_medium.JPG'
WHERE slug = 'funko-pop-sasuke-uchiha';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462344/Monkey_D._Luffy_Vinyl_Art_Toys_9bfa2ff7-a503-48d6-8c44-d471bd6ad830_medium.jpg'
WHERE slug = 'funko-pop-luffy-gear5';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1302820/Roronoa_Zoro_Vinyl_Art_Toys_c4f428b7-aa57-4c68-81f7-3431c81ad4a2_medium.jpg'
WHERE slug = 'funko-pop-zoro';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1269798/Tanjiro_Kamado_Vinyl_Art_Toys_06a16d7b-37fe-4a18-970d-c82c4c781f97_medium.png'
WHERE slug = 'funko-pop-tanjiro-kamado';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/968825/Nezuko_Kamado_Art_Toys_588ff7b0-053c-4b1c-b76f-070f4905e633_medium.JPG'
WHERE slug = 'funko-pop-nezuko';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1152066/Yuji_Itadori_Vinyl_Art_Toys_25c64041-2833-4d34-82c3-d67dfea0c46c_medium.jpg'
WHERE slug = 'funko-pop-itadori-yuji';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1035911/Saitama__Vinyl_Art_Toys_44c72215-997d-4222-b2cb-06e73c2ceb0d_medium.jpg'
WHERE slug = 'funko-pop-saitama';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/924468/Pikachu_%252810-Inch%2529_Vinyl_Art_Toys_e333f41a-15aa-40fa-8731-b911e2cf37d8_medium.png'
WHERE slug = 'funko-pop-pikachu-surfero-chase';

-- ── STAR WARS ───────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://cconnect.s3.amazonaws.com/wp-content/uploads/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg'
WHERE slug = 'funko-pop-grogu';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/767049/The_Mandalorian_Art_Toys_b39bad62-6dc5-4bee-8e77-ff4e0839e35c_medium.jpg'
WHERE slug = 'funko-pop-mandalorian';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/459861/Luke_Skywalker_%2528Jedi%2529_Vinyl_Art_Toys_4ed7e1ac-3910-4cb8-b5d5-33b5769cedc3_medium.jpg'
WHERE slug = 'funko-pop-luke-skywalker';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/950255/Princess_Leia_%2528Black_Box%2529_Vinyl_Art_Toys_2776c997-a024-4ae7-83a1-b52af9b67143_medium.jpg'
WHERE slug = 'funko-pop-princess-leia';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1366926/Han_Solo_Vinyl_Art_Toys_587f2f26-6328-4b06-aee5-8242824e0b5d_medium.jpeg'
WHERE slug = 'funko-pop-han-solo';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1139765/Chewbacca_Vinyl_Art_Toys_3895d4ad-a0c1-4baf-95d6-39bb00e7fb58_medium.png'
WHERE slug = 'funko-pop-chewbacca';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1754928/Obi-Wan_Kenobi_Art_Toys_a2a37e1c-5494-419d-ab4a-893c24250621(2)_medium.png'
WHERE slug = 'funko-pop-obi-wan-kenobi';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/459882/R2-D2_Vinyl_Art_Toys_dadb81a4-5ac7-4d98-a56c-0bc8a4a4e4d6_medium.jpg'
WHERE slug = 'funko-pop-r2d2';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/738179/Boba_Fett_%2528Animated%2529_Vinyl_Art_Toys_02be3aca-7f75-491c-901a-58341ea1eba8_medium.jpg'
WHERE slug = 'funko-pop-boba-fett';

UPDATE products SET image_url =
  'https://cconnect.s3.amazonaws.com/wp-content/uploads/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg'
WHERE slug = 'funko-pop-grogu-cupcake-chase';

-- ── HARRY POTTER ────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/460556/Ron_Weasley_Vinyl_Art_Toys_bd30c20b-e967-474e-9586-fa8168510ec9_medium.jpg'
WHERE slug = 'funko-pop-ron-weasley';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/460555/Lord_Voldemort_Vinyl_Art_Toys_02b9b87e-a09e-4bca-b727-cf4e01634ab7_medium.jpg'
WHERE slug = 'funko-pop-voldemort';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1963278/Severus_Snape_Art_Toys_e2b61f21-6aad-47e5-a997-54908abf5512(2)_medium.png'
WHERE slug = 'funko-pop-snape';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/3168069/Dobby_Art_Toys_50a50822-f56e-41c9-8192-25a3e7930483(2)_medium.jpeg'
WHERE slug = 'funko-pop-dobby';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462292/Luna_Lovegood_Vinyl_Art_Toys_2624d32f-a916-42c1-bb47-89d5e35cef28_medium.jpg'
WHERE slug = 'funko-pop-luna-lovegood';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1483130/Malfoy_with_Whip_Spider_Vinyl_Art_Toys_d8338511-7f14-498e-a425-3d8c669115fd_medium.jpeg'
WHERE slug = 'funko-pop-draco-malfoy';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/460560/Rubeus_Hagrid_Vinyl_Art_Toys_f1e04792-b690-449b-a3e6-44cacd9c65f2_medium.jpg'
WHERE slug = 'funko-pop-hagrid';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1232468/Neville_Longbottom_Vinyl_Art_Toys_d8da86cd-c14c-4c13-bcf3-6055bab593aa_medium.png'
WHERE slug = 'funko-pop-neville-longbottom';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/460554/Harry_Potter_Vinyl_Art_Toys_9d7abc17-d595-4ca1-b01f-6c73aa0a3b3a_medium.jpg'
WHERE slug = 'funko-pop-harry-potter-capa-chase';

-- ── JUEGOS ──────────────────────────────────────────────────────

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/2575576/1746125641_Master_Chief_Art_Toys_c592241e-2b16-4193-b9e3-c43c(2)_medium.jpg'
WHERE slug = 'funko-pop-master-chief';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/463328/Geralt_Vinyl_Art_Toys_488e84ba-1ae7-43aa-bf20-ed9e818d67d9_medium.jpeg'
WHERE slug = 'funko-pop-geralt-de-rivia';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1057036/Joel_Vinyl_Art_Toys_2bfa7ea1-e82b-4763-ad62-5cd3f528f224_medium.jpeg'
WHERE slug = 'funko-pop-joel';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/990738/Ellie_Vinyl_Art_Toys_3f848a5b-231f-4efc-98d3-364c1ecb7754_medium.png'
WHERE slug = 'funko-pop-ellie';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/852091/Princess_Zelda_Figures_and_Toy_Soldiers_4f83e683-63e9-4020-bd9b-9de39e5e0c16_medium.jpg'
WHERE slug = 'funko-pop-zelda';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/590735/Samus_Aran_Figures_and_Toy_Soldiers_c70a418b-222c-4fb1-972f-a396eef59ae7_medium.jpg'
WHERE slug = 'funko-pop-samus-aran';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/850326/Classic_Sonic_Art_Toys_3f59d47c-2139-474d-b9b2-cc766f6fbebd_medium.JPG'
WHERE slug = 'funko-pop-sonic';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/462299/Pac-Man_Vinyl_Art_Toys_a39ceb73-400a-40b9-ae9e-86874faea883_medium.jpg'
WHERE slug = 'funko-pop-pac-man';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/1194309/Gordon_Freeman_Action_Figures_12c9242d-8cde-40af-9663-0af3a0f18478_medium.jpg'
WHERE slug = 'funko-pop-gordon-freeman';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/848517/Kratos_with_the_Blades_of_Chaos_Art_Toys_8b3b7201-c7e7-4891-9042-ffd438472794_medium.JPG'
WHERE slug = 'funko-pop-kratos-ragnarok';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/590644/Link_-The_Legend_of_Zelda_Figures_and_Toy_Soldiers_a8f0255f-49a3-44be-9f38-2128a4a4e774_medium.jpg'
WHERE slug = 'funko-pop-link-totk';

UPDATE products SET image_url =
  'https://images.hobbydb.com/processed_uploads/catalog_item_photo/catalog_item_photo/image/591645/Mario_Figures_and_Toy_Soldiers_74d88e17-f0cc-4c92-9b9c-82fc8347ab3b_medium.jpg'
WHERE slug = 'funko-pop-mario-dorado-chase';

-- ============================================================
--  Verificación: muestra cuántos productos tienen imagen actualizada
--  (debería mostrar ~71 filas con image_url que NO contiene 'unsplash')
-- ============================================================
-- SELECT slug, LEFT(image_url, 60) AS img_preview
-- FROM products
-- WHERE image_url NOT LIKE '%unsplash%'
-- ORDER BY franchise, slug;
