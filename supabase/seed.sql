-- ═══════════════════════════════════════════════════════════════
--  FunkoStore — Seed de productos Funko Pop
--  Ejecutar DESPUÉS del schema.sql
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.products (name, slug, description, price, image_url, franchise, character, category, stock, is_featured)
VALUES

-- ── MARVEL ────────────────────────────────────────────────────
('Pop! Spider-Man #39', 'spider-man-39',
 'El icónico Spider-Man en su traje clásico rojo y azul. Figura estándar de 9cm.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Spider-Man', 'Standard', 25, true),

('Pop! Iron Man Mark 50 #285', 'iron-man-mark-50-285',
 'Tony Stark con la armadura Mark 50 de Infinity War. Detalles metálicos premium.',
 16.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Iron Man', 'Deluxe', 18, true),

('Pop! Thanos con guantelete #289', 'thanos-guantelete-289',
 'Thanos portando el guantelete del infinito con todas las Gemas del Infinito.',
 19.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Thanos', 'Deluxe', 12, true),

('Pop! Wolverine #555', 'wolverine-555',
 'Logan con sus garras de adamantio extendidas, traje clásico amarillo y azul.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Wolverine', 'Standard', 20, false),

('Pop! Captain America #10', 'captain-america-10',
 'Steve Rogers con su escudo indestructible. Edición del Primer Vengador.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Captain America', 'Standard', 30, false),

('Pop! Black Widow #603', 'black-widow-603',
 'Natasha Romanoff con traje negro y pistolas. Edición de Infinity War.',
 13.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Black Widow', 'Standard', 22, false),

('Pop! Thor con Stormbreaker #700', 'thor-stormbreaker-700',
 'El dios del trueno con su nueva hacha Stormbreaker forjada en Nidavellir.',
 15.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Thor', 'Standard', 15, false),

('Pop! Doctor Strange #414', 'doctor-strange-414',
 'Stephen Strange con la Capa de Levitación y el Ojo de Agamotto brillante.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Doctor Strange', 'Standard', 17, false),

('Pop! Venom #363', 'venom-363',
 'Eddie Brock fusionado con el simbionte. ¡Con lengua extendida!',
 16.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Venom', 'Deluxe', 8, true),

('Pop! Groot #264 Chase', 'groot-264-chase',
 'Baby Groot en su versión Chase con flor. Edición rara y coleccionable.',
 24.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Marvel', 'Groot', 'Chase', 5, true),

-- ── DC COMICS ─────────────────────────────────────────────────
('Pop! Batman #01', 'batman-01',
 'El Caballero Oscuro en su traje clásico con capa y máscara icónica.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'Batman', 'Standard', 28, true),

('Pop! Joker #53', 'joker-53',
 'El Payaso Príncipe del Crimen en su versión clásica con smoking morado.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'Joker', 'Standard', 20, false),

('Pop! Wonder Woman #172', 'wonder-woman-172',
 'Diana de Themyscira con escudo y lasso dorado de la verdad.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'Wonder Woman', 'Standard', 18, false),

('Pop! Superman #01', 'superman-01',
 'El Hombre de Acero en pose de vuelo con capa roja.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'Superman', 'Standard', 22, false),

('Pop! The Flash #713', 'the-flash-713',
 'Barry Allen en traje escarlata con efectos de relámpago.',
 15.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'The Flash', 'Standard', 14, false),

('Pop! Harley Quinn #368', 'harley-quinn-368',
 'Harley con mazo gigante y outfit bicolor clásico.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/1280px-DC_Comics_logo.svg.png',
 'DC', 'Harley Quinn', 'Standard', 25, true),

-- ── DISNEY / PIXAR ────────────────────────────────────────────
('Pop! Mickey Mouse #01', 'mickey-mouse-01',
 'El ratón más famoso del mundo en su versión clásica con guantes blancos.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Disney', 'Mickey Mouse', 'Standard', 35, true),

('Pop! Elsa Frozen #593', 'elsa-frozen-593',
 'La reina de las nieves de Arendelle con su vestido de hielo brillante.',
 13.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Disney', 'Elsa', 'Standard', 20, false),

('Pop! Simba El Rey León #301', 'simba-rey-leon-301',
 'El cachorro Simba en la famosa escena de El Rey León.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Disney', 'Simba', 'Standard', 18, false),

('Pop! Stitch #159', 'stitch-159',
 'El experimento 626 en su versión adorable color azul.',
 13.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Disney', 'Stitch', 'Standard', 22, true),

('Pop! Woody Toy Story #168', 'woody-toy-story-168',
 'El vaquero favorito de Andy con su sombrero y bota puntiaguda.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Disney', 'Woody', 'Standard', 15, false),

-- ── STAR WARS ─────────────────────────────────────────────────
('Pop! Darth Vader #01', 'darth-vader-01',
 'El Señor Sith más poderoso de la galaxia con su sable de luz rojo.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Star Wars', 'Darth Vader', 'Standard', 30, true),

('Pop! Grogu El Mandaloriano #369', 'grogu-mandalorian-369',
 'Baby Yoda/Grogu usando la Fuerza. ¡El más adorable de la galaxia!',
 15.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Star Wars', 'Grogu', 'Standard', 40, true),

('Pop! Yoda #02', 'yoda-02',
 'El maestro Jedi más sabio de la galaxia con su bastón.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Star Wars', 'Yoda', 'Standard', 18, false),

('Pop! Mandalorian #326', 'mandalorian-326',
 'Din Djarin con armadura de beskar y jetpack. Esto es el camino.',
 15.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Star Wars', 'The Mandalorian', 'Standard', 12, false),

-- ── ANIME ─────────────────────────────────────────────────────
('Pop! Naruto Uzumaki #727', 'naruto-uzumaki-727',
 'El Hokage de Konoha en modo Sennin con chakra de rana.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Anime', 'Naruto', 'Standard', 20, true),

('Pop! Goku Super Saiyan #858', 'goku-super-saiyan-858',
 'Son Goku en modo Super Saiyan con cabello amarillo y aura dorada.',
 16.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Anime', 'Goku', 'Standard', 22, true),

('Pop! Pikachu #353', 'pikachu-353',
 'El Pokémon número 1, Pikachu, en pose de ataque eléctrico.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Anime', 'Pikachu', 'Standard', 45, true),

('Pop! Tanjiro Kamado #1169', 'tanjiro-kamado-1169',
 'El cazador de demonios de Kimetsu no Yaiba con su katana.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Anime', 'Tanjiro', 'Standard', 15, false),

('Pop! Luffy Gear 4 #924', 'luffy-gear4-924',
 'Monkey D. Luffy en Gear Fourth Boundman con los brazos inflados.',
 18.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Anime', 'Luffy', 'Deluxe', 10, true),

-- ── HARRY POTTER ──────────────────────────────────────────────
('Pop! Harry Potter #01', 'harry-potter-01',
 'El niño que vivió con su varita y cicatriz característica.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Harry Potter', 'Harry Potter', 'Standard', 20, false),

('Pop! Hermione Granger #03', 'hermione-granger-03',
 'La mejor bruja de su generación con libro de hechizos.',
 12.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Harry Potter', 'Hermione', 'Standard', 18, false),

('Pop! Albus Dumbledore #15', 'albus-dumbledore-15',
 'El director de Hogwarts con su varita de saúco.',
 13.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Harry Potter', 'Dumbledore', 'Standard', 12, false),

-- ── JUEGOS ────────────────────────────────────────────────────
('Pop! Master Chief Halo #06', 'master-chief-halo-06',
 'El espartano más legendario con armadura Mjolnir y rifle de asalto.',
 15.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Juegos', 'Master Chief', 'Standard', 12, false),

('Pop! Kratos God of War #269', 'kratos-god-of-war-269',
 'El Fantasma de Esparta con las Hojas del Caos en llamas.',
 16.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Juegos', 'Kratos', 'Standard', 10, true),

('Pop! Link The Legend of Zelda #21', 'link-zelda-21',
 'El héroe de Hyrule con su espada Maestra y Escudo Hyliano.',
 14.99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1280px-Marvel_Logo.svg.png',
 'Juegos', 'Link', 'Standard', 15, false);

-- ═══════════════════════════════════════════════════════════════
--  Crear primer admin (ejecutar después de registrarte)
--  Reemplazá TU_EMAIL con el email de tu cuenta
-- ═══════════════════════════════════════════════════════════════
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'TU_EMAIL';
