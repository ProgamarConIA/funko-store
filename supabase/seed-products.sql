-- ============================================================
--  Seed: productos adicionales FunkoStore
--  Ejecutar en Supabase SQL Editor
--  Franquicias: Marvel, DC, Disney, Anime, Star Wars,
--               Harry Potter, Juegos
-- ============================================================

INSERT INTO products
  (name, slug, description, price, image_url, franchise, character, category, stock, is_featured)
VALUES

-- ── MARVEL ──────────────────────────────────────────────────
('Funko Pop! Captain America', 'funko-pop-captain-america',
 'Steve Rogers con su icónico escudo del Capi.', 16.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Marvel', 'Captain America', 'Standard', 25, false),

('Funko Pop! Black Widow', 'funko-pop-black-widow',
 'Natasha Romanoff en su traje de combate.', 15.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Marvel', 'Black Widow', 'Standard', 20, false),

('Funko Pop! Hulk', 'funko-pop-hulk',
 'Bruce Banner en su forma más furiosa.', 18.99,
 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
 'Marvel', 'Hulk', 'Deluxe', 15, true),

('Funko Pop! Doctor Strange', 'funko-pop-doctor-strange',
 'El hechicero supremo con la Capa de Levitación.', 16.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Marvel', 'Doctor Strange', 'Standard', 18, false),

('Funko Pop! Black Panther', 'funko-pop-black-panther',
 'T''Challa, el rey de Wakanda.', 17.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Marvel', 'Black Panther', 'Standard', 22, true),

('Funko Pop! Wolverine', 'funko-pop-wolverine',
 'Logan con sus garras de adamantio extendidas.', 19.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Marvel', 'Wolverine', 'Deluxe', 12, false),

('Funko Pop! Deadpool', 'funko-pop-deadpool',
 'El Mercenario Bocazas en toda su gloria.', 17.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Marvel', 'Deadpool', 'Standard', 30, true),

('Funko Pop! Scarlet Witch', 'funko-pop-scarlet-witch',
 'Wanda Maximoff con el Caos de la Bruja Escarlata.', 16.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Marvel', 'Scarlet Witch', 'Standard', 17, false),

('Funko Pop! Loki', 'funko-pop-loki',
 'El dios de las travesuras con su casco.', 15.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Marvel', 'Loki', 'Standard', 20, false),

('Funko Pop! Thanos', 'funko-pop-thanos',
 'El Titán Loco con el Guantelete del Infinito.', 22.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Marvel', 'Thanos', 'Deluxe', 10, true),

('Funko Pop! Hawkeye', 'funko-pop-hawkeye',
 'Clint Barton listo para disparar.', 14.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Marvel', 'Hawkeye', 'Standard', 16, false),

('Funko Pop! Iron Man Mark 85 Chase', 'funko-pop-iron-man-mark85-chase',
 'Edición Chase del Iron Man Mark 85 — brillante.', 34.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Marvel', 'Iron Man', 'Chase', 5, true),

-- ── DC ──────────────────────────────────────────────────────
('Funko Pop! The Flash', 'funko-pop-the-flash',
 'Barry Allen, el hombre más rápido vivo.', 15.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'DC', 'The Flash', 'Standard', 22, false),

('Funko Pop! Aquaman', 'funko-pop-aquaman',
 'Arthur Curry, rey del océano.', 16.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'DC', 'Aquaman', 'Standard', 18, false),

('Funko Pop! Green Lantern', 'funko-pop-green-lantern',
 'Hal Jordan con el anillo del poder verde.', 15.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'DC', 'Green Lantern', 'Standard', 14, false),

('Funko Pop! Joker', 'funko-pop-joker',
 'El Príncipe Payaso del Crimen.', 17.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'DC', 'Joker', 'Standard', 25, true),

('Funko Pop! Harley Quinn', 'funko-pop-harley-quinn',
 'Harley Quinn con su mazo gigante.', 16.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'DC', 'Harley Quinn', 'Standard', 20, true),

('Funko Pop! Cyborg', 'funko-pop-cyborg',
 'Victor Stone, mitad humano, mitad máquina.', 14.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'DC', 'Cyborg', 'Standard', 12, false),

('Funko Pop! Shazam!', 'funko-pop-shazam',
 'Billy Batson transformado en el campeón eterno.', 15.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'DC', 'Shazam', 'Standard', 16, false),

('Funko Pop! Bane', 'funko-pop-bane',
 'El villano que quebró la espalda del Murciélago.', 18.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'DC', 'Bane', 'Deluxe', 9, false),

('Funko Pop! Batman (1966) Chase', 'funko-pop-batman-1966-chase',
 'El Batman clásico de la serie TV — edición Chase.', 39.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'DC', 'Batman', 'Chase', 4, true),

-- ── DISNEY ──────────────────────────────────────────────────
('Funko Pop! Buzz Lightyear', 'funko-pop-buzz-lightyear',
 'Al infinito y más allá.', 14.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Disney', 'Buzz Lightyear', 'Standard', 25, true),

('Funko Pop! Woody', 'funko-pop-woody',
 'El vaquero favorito de Andy.', 13.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Disney', 'Woody', 'Standard', 22, false),

('Funko Pop! Moana', 'funko-pop-moana',
 'Moana, hija del jefe de Motunui.', 15.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Disney', 'Moana', 'Standard', 18, false),

('Funko Pop! Stitch', 'funko-pop-stitch',
 'Experimento 626 — adorable y travieso.', 16.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Disney', 'Stitch', 'Standard', 30, true),

('Funko Pop! Jack Skellington', 'funko-pop-jack-skellington',
 'El Rey de Halloween en toda su elegancia.', 17.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Disney', 'Jack Skellington', 'Standard', 15, true),

('Funko Pop! Mulan', 'funko-pop-mulan',
 'Hua Mulan, guerrera legendaria.', 15.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Disney', 'Mulan', 'Standard', 14, false),

('Funko Pop! Maleficent', 'funko-pop-maleficent',
 'La Señora del Mal en versión Funko.', 18.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Disney', 'Maleficent', 'Deluxe', 10, false),

('Funko Pop! Winnie the Pooh', 'funko-pop-winnie-the-pooh',
 'El osito más famoso del Bosque de los Cien Acres.', 13.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Disney', 'Winnie the Pooh', 'Standard', 20, false),

('Funko Pop! Stitch Glow Chase', 'funko-pop-stitch-glow-chase',
 'Stitch edición Chase — brilla en la oscuridad.', 44.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Disney', 'Stitch', 'Chase', 4, true),

-- ── ANIME ───────────────────────────────────────────────────
('Funko Pop! Goku Super Saiyan', 'funko-pop-goku-super-saiyan',
 'Son Goku transformado en Super Saiyan.', 19.99,
 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
 'Anime', 'Goku', 'Deluxe', 20, true),

('Funko Pop! Vegeta', 'funko-pop-vegeta',
 'El Príncipe de los Saiyajin.', 17.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Anime', 'Vegeta', 'Standard', 18, false),

('Funko Pop! Sasuke Uchiha', 'funko-pop-sasuke-uchiha',
 'Sasuke con el Sharingan activado.', 16.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Anime', 'Sasuke', 'Standard', 22, false),

('Funko Pop! Luffy Gear 5', 'funko-pop-luffy-gear5',
 'Monkey D. Luffy en Gear 5 — Nika.', 21.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Anime', 'Luffy', 'Deluxe', 15, true),

('Funko Pop! Zoro', 'funko-pop-zoro',
 'Roronoa Zoro con sus tres espadas.', 17.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Anime', 'Zoro', 'Standard', 16, false),

('Funko Pop! Tanjiro Kamado', 'funko-pop-tanjiro-kamado',
 'El cazador de demonios con su espada Nichirin.', 16.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Anime', 'Tanjiro', 'Standard', 25, true),

('Funko Pop! Nezuko', 'funko-pop-nezuko',
 'Nezuko Kamado en su caja de bambú.', 15.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Anime', 'Nezuko', 'Standard', 20, false),

('Funko Pop! Itadori Yuji', 'funko-pop-itadori-yuji',
 'El portador de Sukuna de Jujutsu Kaisen.', 17.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Anime', 'Itadori', 'Standard', 18, false),

('Funko Pop! Saitama', 'funko-pop-saitama',
 'One Punch Man — un golpe y listo.', 15.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Anime', 'Saitama', 'Standard', 22, false),

('Funko Pop! Pikachu Surfero Chase', 'funko-pop-pikachu-surfero-chase',
 'Pikachu en tabla de surf — edición Chase exclusiva.', 49.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Anime', 'Pikachu', 'Chase', 3, true),

-- ── STAR WARS ───────────────────────────────────────────────
('Funko Pop! Grogu (Baby Yoda)', 'funko-pop-grogu',
 'El Niño. Grogu con sus grandes orejas verdes.', 16.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Star Wars', 'Grogu', 'Standard', 35, true),

('Funko Pop! The Mandalorian', 'funko-pop-mandalorian',
 'Din Djarin con su armadura Beskar.', 17.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Star Wars', 'Mandalorian', 'Standard', 28, true),

('Funko Pop! Luke Skywalker', 'funko-pop-luke-skywalker',
 'Luke con su sable de luz verde de Jedi.', 15.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Star Wars', 'Luke Skywalker', 'Standard', 20, false),

('Funko Pop! Princess Leia', 'funko-pop-princess-leia',
 'La Princesa Leia con su peinado icónico.', 15.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Star Wars', 'Princess Leia', 'Standard', 18, false),

('Funko Pop! Han Solo', 'funko-pop-han-solo',
 'El contrabandista más famoso de la galaxia.', 15.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Star Wars', 'Han Solo', 'Standard', 16, false),

('Funko Pop! Chewbacca', 'funko-pop-chewbacca',
 'El copiloto Wookiee de Han Solo.', 16.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Star Wars', 'Chewbacca', 'Standard', 15, false),

('Funko Pop! Obi-Wan Kenobi', 'funko-pop-obi-wan-kenobi',
 'El maestro Jedi Obi-Wan con sable azul.', 15.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Star Wars', 'Obi-Wan Kenobi', 'Standard', 14, false),

('Funko Pop! R2-D2', 'funko-pop-r2d2',
 'El droide astromecánico más querido.', 14.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Star Wars', 'R2-D2', 'Standard', 20, false),

('Funko Pop! Boba Fett', 'funko-pop-boba-fett',
 'El cazarrecompensas mandaloriano.', 17.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Star Wars', 'Boba Fett', 'Standard', 18, true),

('Funko Pop! Grogu con Cupcake Chase', 'funko-pop-grogu-cupcake-chase',
 'Grogu sosteniendo un cupcake — edición Chase exclusiva.', 54.99,
 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
 'Star Wars', 'Grogu', 'Chase', 3, true),

-- ── HARRY POTTER ────────────────────────────────────────────
('Funko Pop! Ron Weasley', 'funko-pop-ron-weasley',
 'El mejor amigo de Harry, con su varita.', 14.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Harry Potter', 'Ron Weasley', 'Standard', 20, false),

('Funko Pop! Voldemort', 'funko-pop-voldemort',
 'El que no debe ser nombrado.', 17.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Harry Potter', 'Voldemort', 'Standard', 16, true),

('Funko Pop! Snape', 'funko-pop-snape',
 'El Príncipe Mestizo con su capa negra.', 15.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Harry Potter', 'Snape', 'Standard', 15, false),

('Funko Pop! Dobby', 'funko-pop-dobby',
 'El elfo doméstico libre más leal.', 13.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Harry Potter', 'Dobby', 'Standard', 25, true),

('Funko Pop! Luna Lovegood', 'funko-pop-luna-lovegood',
 'Luna con sus gafas de Culo de Botella.', 14.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Harry Potter', 'Luna Lovegood', 'Standard', 18, false),

('Funko Pop! Draco Malfoy', 'funko-pop-draco-malfoy',
 'Draco con su varita, listo para el duelo.', 14.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Harry Potter', 'Draco Malfoy', 'Standard', 16, false),

('Funko Pop! Hagrid', 'funko-pop-hagrid',
 'Rubeus Hagrid, guardabosques de Hogwarts.', 19.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Harry Potter', 'Hagrid', 'Deluxe', 10, false),

('Funko Pop! Neville Longbottom', 'funko-pop-neville-longbottom',
 'El héroe inesperado de Gryffindor.', 13.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Harry Potter', 'Neville Longbottom', 'Standard', 14, false),

('Funko Pop! Harry Potter con Capa Invisible Chase', 'funko-pop-harry-potter-capa-chase',
 'Harry Potter usando la Capa de Invisibilidad — edición Chase.', 47.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Harry Potter', 'Harry Potter', 'Chase', 3, true),

-- ── JUEGOS ──────────────────────────────────────────────────
('Funko Pop! Master Chief', 'funko-pop-master-chief',
 'El Spartan 117 con su armadura Mjolnir.', 17.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Juegos', 'Master Chief', 'Standard', 20, true),

('Funko Pop! Geralt de Rivia', 'funko-pop-geralt-de-rivia',
 'El Brujo de Rivia con sus dos espadas.', 18.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Juegos', 'Geralt', 'Standard', 16, true),

('Funko Pop! Joel (The Last of Us)', 'funko-pop-joel',
 'Joel Miller, superviviente post-apocalíptico.', 17.99,
 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
 'Juegos', 'Joel', 'Standard', 18, false),

('Funko Pop! Ellie (The Last of Us)', 'funko-pop-ellie',
 'Ellie Williams con su arco y flechas.', 17.99,
 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
 'Juegos', 'Ellie', 'Standard', 15, false),

('Funko Pop! Zelda', 'funko-pop-zelda',
 'La Princesa Zelda de Hyrule.', 15.99,
 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
 'Juegos', 'Zelda', 'Standard', 18, false),

('Funko Pop! Samus Aran', 'funko-pop-samus-aran',
 'La cazarrecompensas galáctica de Metroid.', 17.99,
 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&q=80',
 'Juegos', 'Samus Aran', 'Standard', 12, false),

('Funko Pop! Sonic the Hedgehog', 'funko-pop-sonic',
 'El erizo más veloz del mundo.', 14.99,
 'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?w=400&q=80',
 'Juegos', 'Sonic', 'Standard', 25, true),

('Funko Pop! Pac-Man', 'funko-pop-pac-man',
 'El ícono del gaming de los 80 en Funko.', 12.99,
 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
 'Juegos', 'Pac-Man', 'Standard', 22, false),

('Funko Pop! Gordon Freeman', 'funko-pop-gordon-freeman',
 'El físico del Black Mesa con su palanca.', 18.99,
 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=400&q=80',
 'Juegos', 'Gordon Freeman', 'Standard', 10, false),

('Funko Pop! Kratos God of War Ragnarök', 'funko-pop-kratos-ragnarok',
 'Kratos con el Hacha Leviatán en Ragnarök.', 21.99,
 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
 'Juegos', 'Kratos', 'Deluxe', 12, true),

('Funko Pop! Link (Tears of the Kingdom)', 'funko-pop-link-totk',
 'Link con poderes de Ultrahand de TotK.', 19.99,
 'https://images.unsplash.com/photo-1560343787-491cc0f5a3c4?w=400&q=80',
 'Juegos', 'Link', 'Deluxe', 14, true),

('Funko Pop! Mario Dorado Chase', 'funko-pop-mario-dorado-chase',
 'Mario en dorado metálico — edición Chase exclusiva.', 59.99,
 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
 'Juegos', 'Mario', 'Chase', 3, true)

ON CONFLICT (slug) DO NOTHING;
