# FunkoStore - Download Funko Pop images to /public/funkos/
# Source: cconnect.s3.amazonaws.com (AWS S3 public, no hotlink protection)
# Run from project root: .\scripts\download-funko-images.ps1

$BASE  = "d:\Proyectos IA\funko-store\public\funkos"
$C     = "https://cconnect.s3.amazonaws.com/wp-content/uploads"

$IMAGES = [ordered]@{

  # ── SEED.SQL ORIGINALS ───────────────────────────────────────
  "spider-man-39"              = @("$C/2016/12/Funko-Pop-Spider-Man-03-Spider-Man.jpg")
  "iron-man-mark-50-285"       = @("$C/2016/12/Funko-Pop-Iron-Man-04-Iron-Man.jpg","$C/2018/03/Funko-Pop-Avengers-Infinity-War-285-Iron-Man.jpg")
  "thanos-guantelete-289"      = @("$C/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg")
  "wolverine-555"              = @("$C/2016/10/Funko-Pop-X-Men-05-Wolverine.jpg")
  "captain-america-10"         = @("$C/2016/12/Funko-Pop-Captain-America-06-Captain-America.jpg")
  "black-widow-603"            = @("$C/2020/04/Funko-Pop-Black-Widow-603-Black-Widow.jpg","$C/2017/03/Funko-Pop-Black-Widow-42-Black-Widow.jpg","$C/2017/11/Funko-Pop-Black-Widow-42-Black-Widow.jpg")
  "thor-stormbreaker-700"      = @("$C/2017/07/Funko-Pop-Thor-Ragnarok-216-Thor.jpg","$C/2018/03/Funko-Pop-Avengers-Infinity-War-286-Thor.jpg","$C/2019/04/Funko-Pop-Avengers-Endgame-450-Thor.jpg")
  "doctor-strange-414"         = @("$C/2016/11/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg","$C/2022/05/Funko-Pop-Doctor-Strange-Multiverse-of-Madness-Figures-1000-Doctor-Strange.jpg")
  "venom-363"                  = @("$C/2018/07/Funko-Pop-Venom-363-Venom.jpg")
  "groot-264-chase"            = @("$C/2015/07/2015-Funko-Pop-Guardians-of-the-Galaxy-49-Baby-Groot.jpg","$C/2017/04/Funko-Pop-Guardians-of-the-Galaxy-264-Baby-Groot.jpg")
  "batman-01"                  = @("$C/2017/12/Funko-Pop-Batman-01-Batman.jpg")
  "joker-53"                   = @("$C/2017/01/Funko-Pop-DC-Universe-06-Joker.jpg")
  "wonder-woman-172"           = @("$C/2017/05/2017-Funko-Pop-Wonder-Woman-Movie-172-Wonder-Woman.jpg","$C/2017/05/Funko-Pop-Wonder-Woman-172-Wonder-Woman.jpg","$C/2016/12/Funko-Pop-DC-Universe-08-Wonder-Woman.jpg")
  "superman-01"                = @("$C/2017/03/Funko-Pop-Superman-07-Superman.jpg")
  "the-flash-713"              = @("$C/2018/09/Funko-Pop-Flash-TV-713-The-Flash.jpg","$C/2017/01/Funko-Pop-DC-Universe-10-The-Flash.jpg")
  "harley-quinn-368"           = @("$C/2016/12/Funko-Pop-Harley-Quinn-34-Harley-Quinn.jpg")
  "mickey-mouse-01"            = @("$C/2016/01/Funko-Pop-Disney-Mickey-Mouse-01-Mickey-Mouse.jpg","$C/2018/01/Funko-Pop-Disney-01-Mickey-Mouse.jpg")
  "elsa-frozen-593"            = @("$C/2020/10/Funko-Pop-Frozen-2-Figures-593-Elsa.jpg","$C/2014/11/Funko-Pop-Frozen-81-Elsa.jpg")
  "simba-rey-leon-301"         = @("$C/2019/06/Funko-Pop-The-Lion-King-547-Simba.jpg","$C/2019/05/Funko-Pop-The-Lion-King-Vinyl-Figures-301-Simba.jpg")
  "stitch-159"                 = @("$C/2015/06/Funko-Pop-Disney-12-Stitch.jpg","$C/2020/01/Funko-Pop-Disney-Stitch-159-Stitch.jpg")
  "woody-toy-story-168"        = @("$C/2015/06/Funko-Pop-Disney-03-Woody.jpg","$C/2017/07/Funko-Pop-Toy-Story-168-Woody.jpg")
  "darth-vader-01"             = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg","$C/2019/10/Funko-Pop-Star-Wars-Figures-305-Darth-Vader.jpg")
  "grogu-mandalorian-369"      = @("$C/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg")
  "yoda-02"                    = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-02-Yoda.jpg")
  "mandalorian-326"            = @("$C/2019/10/Funko-Pop-Star-Wars-Mandalorian-351-The-Mandalorian.jpg","$C/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-326-The-Mandalorian.jpg")
  "naruto-uzumaki-727"         = @("$C/2017/04/Funko-Pop-Naruto-Shippuden-72-Naruto-Uzumaki.jpg","$C/2021/09/Funko-Pop-Naruto-Shippuden-Figures-727-Naruto-Uzumaki.jpg")
  "goku-super-saiyan-858"      = @("$C/2018/07/Funko-Pop-Dragon-Ball-Z-Super-386-Goku-Ultra-Instinct.jpg")
  "pikachu-353"                = @("$C/2019/06/Funko-Pop-Pokemon-353-Pikachu.jpg","$C/2019/07/Funko-Pop-Pokemon-353-Pikachu.jpg")
  "tanjiro-kamado-1169"        = @("$C/2020/11/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg","$C/2021/06/Funko-Pop-Demon-Slayer-Figures-Tanjiro-Kamado.jpg")
  "luffy-gear4-924"            = @("$C/2015/06/Funko-Pop-One-Piece-98-Monkey-D-Luffy.jpg","$C/2020/07/Funko-Pop-One-Piece-Figures-924-Monkey-D-Luffy-Gear-4.jpg")
  "harry-potter-01"            = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-01-Harry-Potter.jpg")
  "hermione-granger-03"        = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-03-Hermione-Granger.jpg")
  "albus-dumbledore-15"        = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-04-Albus-Dumbledore.jpg","$C/2015/11/Funko-Pop-Harry-Potter-04-Albus-Dumbledore.jpg")
  "master-chief-halo-06"       = @("$C/2021/09/Funko-Pop-Halo-Figures-06-Master-Chief.jpg","$C/2019/09/Funko-Pop-Halo-01-Master-Chief.jpg")
  "kratos-god-of-war-269"      = @("$C/2022/11/Funko-Pop-God-of-War-Ragnarok-270-Kratos.jpg","$C/2018/06/Funko-Pop-God-of-War-269-Kratos.jpg")
  "link-zelda-21"              = @("$C/2017/06/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg","$C/2016/01/Funko-Pop-Legend-of-Zelda-21-Link.jpg")

  # ── SEED-PRODUCTS.SQL ────────────────────────────────────────
  "funko-pop-captain-america"  = @("$C/2016/12/Funko-Pop-Captain-America-06-Captain-America.jpg")
  "funko-pop-black-widow"      = @("$C/2020/04/Funko-Pop-Black-Widow-603-Black-Widow.jpg","$C/2017/03/Funko-Pop-Black-Widow-42-Black-Widow.jpg","$C/2017/11/Funko-Pop-Black-Widow-42-Black-Widow.jpg")
  "funko-pop-hulk"             = @("$C/2019/04/Funko-Pop-Avengers-Endgame-451-Hulk.jpg","$C/2017/02/Funko-Pop-Marvel-08-The-Hulk.jpg")
  "funko-pop-doctor-strange"   = @("$C/2016/11/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg","$C/2022/05/Funko-Pop-Doctor-Strange-Multiverse-of-Madness-Figures-1000-Doctor-Strange.jpg")
  "funko-pop-black-panther"    = @("$C/2016/01/Funko-Captain-America-Civil-War-Pop-130-Black-Panther.jpg","$C/2019/12/Funko-Pop-Black-Panther-Movie-Figures-273-Black-Panther-new.jpg")
  "funko-pop-wolverine"        = @("$C/2016/10/Funko-Pop-X-Men-05-Wolverine.jpg")
  "funko-pop-deadpool"         = @("$C/2016/01/2016-Funko-Pop-Deadpool-20-Deadpool.jpg","$C/2017/01/Funko-Pop-Deadpool-20-Deadpool.jpg")
  "funko-pop-scarlet-witch"    = @("$C/2016/01/Funko-Captain-America-Civil-War-Pop-134-Scarlet-Witch.jpg","$C/2021/10/Funko-Pop-WandaVision-Figures-823-Scarlet-Witch.jpg")
  "funko-pop-loki"             = @("$C/2017/08/Funko-Pop-Loki-36-Loki.jpg")
  "funko-pop-thanos"           = @("$C/2018/03/Funko-Pop-Avengers-Infinity-War-289-Thanos.jpg")
  "funko-pop-hawkeye"          = @("$C/2017/08/Funko-Pop-Hawkeye-98-Hawkeye.jpg","$C/2016/12/Funko-Pop-Hawkeye-98-Hawkeye.jpg","$C/2021/12/Funko-Pop-Hawkeye-Figures-1209-Hawkeye.jpg")
  "funko-pop-iron-man-mark85-chase" = @("$C/2019/04/Funko-Pop-Avengers-Endgame-467-Iron-Man-Mark-85.jpg","$C/2016/12/Funko-Pop-Iron-Man-04-Iron-Man.jpg")
  "funko-pop-the-flash"        = @("$C/2017/01/Funko-Pop-DC-Universe-10-The-Flash.jpg")
  "funko-pop-aquaman"          = @("$C/2018/08/Funko-Pop-Aquaman-Movie-245-Aquaman.jpg","$C/2017/07/Funko-Pop-Aquaman-16-Aquaman-e1500297093361.jpg")
  "funko-pop-green-lantern"    = @("$C/2017/03/Funko-Pop-Green-Lantern-09-Green-Lantern.jpg")
  "funko-pop-joker"            = @("$C/2017/01/Funko-Pop-DC-Universe-06-Joker.jpg")
  "funko-pop-harley-quinn"     = @("$C/2016/12/Funko-Pop-Harley-Quinn-34-Harley-Quinn.jpg")
  "funko-pop-cyborg"           = @("$C/2017/10/Funko-Pop-Justice-League-110-Cyborg.jpg","$C/2016/09/Funko-Pop-DC-Superheroes-Cyborg-110-Cyborg.jpg")
  "funko-pop-shazam"           = @("$C/2019/03/Funko-Pop-Shazam-Figures-264-Shazam.jpg","$C/2019/04/Funko-Pop-Shazam-Movie-Figures-264-Shazam.jpg")
  "funko-pop-bane"             = @("$C/2017/01/Funko-Pop-DC-Universe-20-Bane.jpg","$C/2017/01/Funko-Pop-Dark-Knight-Trilogy-20-Bane.jpg")
  "funko-pop-batman-1966-chase" = @("$C/2017/12/Funko-Pop-Batman-01-Batman.jpg")
  "funko-pop-buzz-lightyear"   = @("$C/2017/06/Funko-Pop-Toy-Story-02-Buzz-Lightyear.jpg","$C/2015/06/Funko-Pop-Disney-02-Buzz-Lightyear.jpg","$C/2019/06/Funko-Pop-Toy-Story-4-Vinyl-Figures-523-Buzz-Lightyear.jpg")
  "funko-pop-woody"            = @("$C/2015/06/Funko-Pop-Disney-03-Woody.jpg","$C/2019/06/Funko-Pop-Toy-Story-4-Vinyl-Figures-522-Woody.jpg")
  "funko-pop-moana"            = @("$C/2016/10/Funko-Pop-Moana-216-Moana.jpg","$C/2016/11/Funko-Pop-Moana-216-Moana.jpg","$C/2017/01/Funko-Pop-Moana-216-Moana.jpg")
  "funko-pop-stitch"           = @("$C/2015/06/Funko-Pop-Disney-12-Stitch.jpg","$C/2020/01/Funko-Pop-Disney-Stitch-159-Stitch.jpg")
  "funko-pop-jack-skellington"  = @("$C/2015/06/Funko-Pop-Disney-15-Jack-Skellington.jpg")
  "funko-pop-mulan"            = @("$C/2016/01/Funko-Pop-Disney-Mulan-259-Mulan.jpg","$C/2020/07/Funko-Pop-Disney-Mulan-Figures-630-Mulan.jpg")
  "funko-pop-maleficent"       = @("$C/2014/11/Funko-Pop-Disney-232-Maleficent-with-Wings.jpg","$C/2019/09/Funko-Pop-Maleficent-Mistress-of-Evil-Figures-376-Maleficent.jpg")
  "funko-pop-winnie-the-pooh"  = @("$C/2017/06/Funko-Pop-Winnie-the-Pooh-252-Pooh.jpg","$C/2020/08/Funko-Pop-Disney-Winnie-the-Pooh-252-Winnie-the-Pooh.jpg")
  "funko-pop-stitch-glow-chase" = @("$C/2015/06/Funko-Pop-Disney-15-GITD-Jack-Skellington.jpg","$C/2015/06/Funko-Pop-Disney-12-Stitch.jpg")
  "funko-pop-goku-super-saiyan" = @("$C/2018/07/Funko-Pop-Dragon-Ball-Z-Super-386-Goku-Ultra-Instinct.jpg")
  "funko-pop-vegeta"           = @("$C/2020/08/Funko-Pop-Dragon-Ball-Z-Figures-Funko-Pop-Dragon-Ball-Super-814-Vegeta.jpg")
  "funko-pop-sasuke-uchiha"    = @("$C/2017/04/Funko-Pop-Naruto-Shippuden-185-Sasuke-Uchiha.jpg","$C/2021/09/Funko-Pop-Naruto-Shippuden-Figures-185-Sasuke-Uchiha.jpg")
  "funko-pop-luffy-gear5"      = @("$C/2022/11/Funko-Pop-One-Piece-Figures-Luffy-Gear-5.jpg","$C/2015/06/Funko-Pop-One-Piece-98-Monkey-D-Luffy.jpg")
  "funko-pop-zoro"             = @("$C/2015/06/Funko-Pop-One-Piece-99-Roronoa-Zoro.jpg","$C/2020/07/Funko-Pop-One-Piece-Figures-Zoro.jpg")
  "funko-pop-tanjiro-kamado"   = @("$C/2020/11/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg","$C/2021/06/Funko-Pop-Demon-Slayer-Figures-Tanjiro-Kamado.jpg")
  "funko-pop-nezuko"           = @("$C/2020/11/Funko-Pop-Demon-Slayer-868-Nezuko-Kamado.jpg","$C/2021/06/Funko-Pop-Demon-Slayer-Figures-Nezuko-Kamado.jpg")
  "funko-pop-itadori-yuji"     = @("$C/2021/10/Funko-Pop-Jujutsu-Kaisen-1095-Itadori-Yuji.jpg","$C/2021/10/Funko-Pop-Jujutsu-Kaisen-Figures-1095-Yuji-Itadori.jpg")
  "funko-pop-saitama"          = @("$C/2015/06/Funko-Pop-One-Punch-Man-097-Saitama.jpg","$C/2016/06/Funko-Pop-One-Punch-Man-097-Saitama.jpg")
  "funko-pop-pikachu-surfero-chase" = @("$C/2019/06/Funko-Pop-Pokemon-353-Pikachu.jpg","$C/2019/07/Funko-Pop-Pokemon-353-Pikachu.jpg")
  "funko-pop-grogu"            = @("$C/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-368-The-Child-Baby-Yoda.jpg")
  "funko-pop-mandalorian"      = @("$C/2019/10/Funko-Pop-Star-Wars-Mandalorian-351-The-Mandalorian.jpg","$C/2020/03/Funko-Pop-Star-Wars-Figures-Funko-Pop-The-Mandalorian-Star-Wars-Figures-326-The-Mandalorian.jpg")
  "funko-pop-luke-skywalker"   = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-07-Luke-Skywalker.jpg","$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-06-Luke-Skywalker.jpg")
  "funko-pop-princess-leia"    = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-04-Princess-Leia.jpg","$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-03-Princess-Leia.jpg")
  "funko-pop-han-solo"         = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-03-Han-Solo.jpg","$C/2018/05/Funko-Pop-Solo-Star-Wars-Story-238-Han-Solo.jpg")
  "funko-pop-chewbacca"        = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-02-Chewbacca.jpg","$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-05-Chewbacca.jpg")
  "funko-pop-obi-wan-kenobi"   = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-11-Obi-Wan-Kenobi.jpg","$C/2022/04/Funko-Pop-Obi-Wan-Kenobi-Figures-540-Obi-Wan-Kenobi.jpg")
  "funko-pop-r2d2"             = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-31-R2-D2.jpg","$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-12-R2-D2.jpg")
  "funko-pop-boba-fett"        = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-09-Boba-Fett.jpg","$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-08-Boba-Fett.jpg")
  # Grogu Chase -> replaced with Darth Vader
  "funko-pop-grogu-cupcake-chase" = @("$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg","$C/2019/10/Funko-Pop-Star-Wars-Figures-305-Darth-Vader.jpg")
  "funko-pop-ron-weasley"      = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-02-Ron-Weasley.jpg")
  "funko-pop-voldemort"        = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-06-Lord-Voldemort.jpg")
  "funko-pop-snape"            = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-05-Severus-Snape.jpg")
  "funko-pop-dobby"            = @("$C/2016/01/Funko-Pop-Harry-Potter-17-Dobby.jpg")
  "funko-pop-luna-lovegood"    = @("$C/2016/01/Funko-Pop-Harry-Potter-14-Luna-Lovegood.jpg")
  "funko-pop-draco-malfoy"     = @("$C/2016/01/Funko-Pop-Harry-Potter-13-Draco-Malfoy.jpg")
  "funko-pop-hagrid"           = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-07-Rubeus-Hagrid.jpg")
  "funko-pop-neville-longbottom" = @("$C/2016/02/Funko-Pop-Harry-Potter-22-Neville-Longbottom-Barnes-Noble-Pre-Release.jpg")
  "funko-pop-harry-potter-capa-chase" = @("$C/2015/06/2015-Funko-Pop-Harry-Potter-01-Harry-Potter.jpg")
  "funko-pop-master-chief"     = @("$C/2021/09/Funko-Pop-Halo-Figures-06-Master-Chief.jpg","$C/2019/09/Funko-Pop-Halo-01-Master-Chief.jpg")
  "funko-pop-geralt-de-rivia"  = @("$C/2019/07/Funko-Pop-The-Witcher-311-Geralt.jpg","$C/2020/02/Funko-Pop-The-Witcher-311-Geralt-of-Rivia.jpg")
  "funko-pop-joel"             = @("$C/2023/02/Funko-Pop-The-Last-of-Us-Figures-1-Joel.jpg","$C/2019/09/Funko-Pop-The-Last-of-Us-453-Joel.jpg")
  "funko-pop-ellie"            = @("$C/2023/02/Funko-Pop-The-Last-of-Us-Figures-2-Ellie.jpg","$C/2019/09/Funko-Pop-The-Last-of-Us-454-Ellie.jpg")
  "funko-pop-zelda"            = @("$C/2017/06/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-20-Zelda.jpg","$C/2023/06/Funko-Pop-Zelda-Tears-of-the-Kingdom-Figures-Zelda.jpg")
  "funko-pop-samus-aran"       = @("$C/2016/06/Funko-Pop-Metroid-07-Samus.jpg","$C/2016/06/Funko-Pop-Metroid-Samus-07-Samus.jpg")
  "funko-pop-sonic"            = @("$C/2019/07/Funko-Pop-Sonic-283-Sonic.jpg","$C/2019/07/Funko-Pop-Sonic-the-Hedgehog-283-Sonic.jpg")
  "funko-pop-pac-man"          = @("$C/2021/01/Funko-Pop-Games-Pac-Man-Figures-01-Pac-Man.jpg","$C/2021/01/Funko-Pop-Games-Pac-Man-Figures.jpg")
  "funko-pop-gordon-freeman"   = @("$C/2020/07/Funko-Pop-Half-Life-621-Gordon-Freeman.jpg","$C/2020/07/Funko-Pop-Half-Life-Figures-621-Gordon-Freeman.jpg")
  "funko-pop-kratos-ragnarok"  = @("$C/2022/11/Funko-Pop-God-of-War-Ragnarok-270-Kratos.jpg","$C/2018/06/Funko-Pop-God-of-War-269-Kratos.jpg")
  "funko-pop-link-totk"        = @("$C/2017/06/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg","$C/2023/06/Funko-Pop-Zelda-Tears-of-the-Kingdom-Figures-Link.jpg")
  "funko-pop-mario-dorado-chase" = @("$C/2019/05/Funko-Pop-Super-Mario-63-Mario.jpg","$C/2016/01/Funko-Pop-Super-Mario-63-Mario.jpg")
}

$ok     = 0
$failed = @()
$total  = $IMAGES.Count
Write-Host "FunkoStore Image Downloader - $total images" -ForegroundColor Cyan

foreach ($slug in $IMAGES.Keys) {
  $dest = Join-Path $BASE "$slug.jpg"
  if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 5000) {
    $ok++; continue
  }
  $done = $false
  foreach ($url in $IMAGES[$slug]) {
    try {
      Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 15 -ErrorAction Stop `
        -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" | Out-Null
      if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 5000) {
        $kb = [math]::Round((Get-Item $dest).Length/1024,0)
        Write-Host "OK  $slug ($kb KB)" -ForegroundColor Green
        $ok++; $done = $true; break
      } else {
        Remove-Item $dest -Force -EA SilentlyContinue
      }
    } catch {
      if (Test-Path $dest) { Remove-Item $dest -Force -EA SilentlyContinue }
    }
  }
  if (-not $done) {
    Write-Host "FAIL $slug" -ForegroundColor Red
    $failed += $slug
  }
}

Write-Host ""
Write-Host "Downloaded: $ok / $total" -ForegroundColor Green
if ($failed.Count -gt 0) {
  Write-Host "Failed ($($failed.Count)):" -ForegroundColor Red
  foreach ($s in $failed) { Write-Host "  - $s" -ForegroundColor Yellow }
}
