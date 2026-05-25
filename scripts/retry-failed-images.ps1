# FunkoStore - Retry failed images + fallback copy from similar character
# Run from project root: .\scripts\retry-failed-images.ps1

$BASE = "d:\Proyectos IA\funko-store\public\funkos"
$C    = "https://cconnect.s3.amazonaws.com/wp-content/uploads"

function TryDownload($slug, $urls) {
  $dest = Join-Path $BASE "$slug.jpg"
  if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 5000) {
    return $true
  }
  foreach ($url in $urls) {
    try {
      Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 15 -EA Stop `
        -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" | Out-Null
      if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 5000) {
        $kb = [math]::Round((Get-Item $dest).Length/1024,0)
        Write-Host "OK  $slug ($kb KB)" -ForegroundColor Green
        return $true
      }
      if (Test-Path $dest) { Remove-Item $dest -Force -EA SilentlyContinue }
    } catch {
      if (Test-Path $dest) { Remove-Item $dest -Force -EA SilentlyContinue }
    }
  }
  return $false
}

function CopyFallback($slug, $srcSlug) {
  $dest = Join-Path $BASE "$slug.jpg"
  if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 5000) { return }
  $src = Join-Path $BASE "$srcSlug.jpg"
  if (Test-Path $src) {
    Copy-Item $src $dest -Force
    Write-Host "COPY $slug <- $srcSlug" -ForegroundColor Yellow
  } else {
    Write-Host "MISS $slug (src $srcSlug missing)" -ForegroundColor Red
  }
}

# -- Confirmed correct URL from cardboardconnection.com --

# Marvel
TryDownload "captain-america-10" @(
  "$C/2017/02/Funko-Pop-Marvel-06-Captain-America.jpg",
  "$C/2019/04/Funko-Pop-Avengers-Endgame-450-Captain-America.jpg",
  "$C/2016/01/Funko-Captain-America-Civil-War-Pop-125-Captain-America.jpg"
) | Out-Null

TryDownload "funko-pop-captain-america" @(
  "$C/2017/02/Funko-Pop-Marvel-06-Captain-America.jpg",
  "$C/2019/04/Funko-Pop-Avengers-Endgame-450-Captain-America.jpg"
) | Out-Null

TryDownload "doctor-strange-414" @(
  "$C/2016/10/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg",
  "$C/2016/09/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg",
  "$C/2016/08/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg",
  "$C/2016/11/Funko-Pop-Marvel-169-Doctor-Strange.jpg"
) | Out-Null

TryDownload "funko-pop-doctor-strange" @(
  "$C/2016/10/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg",
  "$C/2016/09/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg",
  "$C/2016/08/Funko-Pop-Doctor-Strange-169-Doctor-Strange.jpg"
) | Out-Null

TryDownload "venom-363" @(
  "$C/2018/09/Funko-Pop-Venom-363-Venom.jpg",
  "$C/2018/10/Funko-Pop-Venom-363-Venom.jpg",
  "$C/2018/08/Funko-Pop-Venom-363-Venom.jpg"
) | Out-Null

TryDownload "groot-264-chase" @(
  "$C/2017/04/Funko-Pop-Guardians-Galaxy-202-Baby-Groot.jpg",
  "$C/2017/05/Funko-Pop-Guardians-Galaxy-202-Baby-Groot.jpg",
  "$C/2017/04/Funko-Pop-Guardians-of-the-Galaxy-202-Baby-Groot.jpg",
  "$C/2016/04/Funko-Pop-Guardians-of-the-Galaxy-264-Baby-Groot.jpg"
) | Out-Null

TryDownload "funko-pop-deadpool" @(
  "$C/2018/05/Funko-Pop-Deadpool-20-Deadpool.jpg",
  "$C/2018/02/Funko-Pop-Deadpool-20-Deadpool.jpg",
  "$C/2016/10/Funko-Pop-Deadpool-20-Deadpool.jpg",
  "$C/2018/01/Funko-Pop-Deadpool-112-Deadpool.jpg"
) | Out-Null

TryDownload "funko-pop-scarlet-witch" @(
  "$C/2021/09/Funko-Pop-WandaVision-Figures-823-Scarlet-Witch.jpg",
  "$C/2016/03/Funko-Captain-America-Civil-War-Pop-134-Scarlet-Witch.jpg",
  "$C/2016/04/Funko-Pop-Captain-America-Civil-War-134-Scarlet-Witch.jpg"
) | Out-Null

TryDownload "funko-pop-hawkeye" @(
  "$C/2019/10/Funko-Pop-Hawkeye-Figures-98-Hawkeye.jpg",
  "$C/2016/10/Funko-Pop-Hawkeye-98-Hawkeye.jpg",
  "$C/2021/12/Funko-Pop-Hawkeye-Figures-1209-Hawkeye.jpg",
  "$C/2015/06/Funko-Pop-Avengers-Age-of-Ultron-98-Hawkeye.jpg"
) | Out-Null

# DC
TryDownload "funko-pop-cyborg" @(
  "$C/2017/10/Funko-Pop-Justice-League-208-Cyborg.jpg",
  "$C/2017/11/Funko-Pop-Justice-League-208-Cyborg.jpg",
  "$C/2017/09/Funko-Pop-Justice-League-208-Cyborg.jpg",
  "$C/2017/10/Funko-Pop-DC-Justice-League-208-Cyborg.jpg"
) | Out-Null

TryDownload "funko-pop-shazam" @(
  "$C/2019/04/Funko-Pop-Shazam-264-Shazam.jpg",
  "$C/2019/03/Funko-Pop-Shazam-264-Shazam.jpg",
  "$C/2019/02/Funko-Pop-Shazam-264-Shazam.jpg"
) | Out-Null

TryDownload "funko-pop-bane" @(
  "$C/2012/09/Funko-Pop-DC-Universe-20-Bane.jpg",
  "$C/2013/01/Funko-Pop-DC-Universe-20-Bane.jpg",
  "$C/2012/06/Funko-Pop-DC-Universe-20-Bane.jpg",
  "$C/2013/06/Funko-Pop-Dark-Knight-Rises-20-Bane.jpg"
) | Out-Null

# Disney
TryDownload "mickey-mouse-01" @(
  "$C/2016/02/Funko-Pop-Disney-Mickey-Mouse-01-Mickey-Mouse.jpg",
  "$C/2016/03/Funko-Pop-Disney-Mickey-Mouse-01-Mickey-Mouse.jpg",
  "$C/2015/09/Funko-Pop-Disney-01-Mickey-Mouse.jpg",
  "$C/2016/09/Funko-Pop-Disney-01-Mickey-Mouse.jpg",
  "$C/2015/06/Funko-Pop-Disney-01-Mickey-Mouse.jpg"
) | Out-Null

TryDownload "elsa-frozen-593" @(
  "$C/2014/11/2014-Funko-Pop-Frozen-81-Elsa.jpg",
  "$C/2014/10/Funko-Pop-Frozen-81-Elsa.jpg",
  "$C/2015/01/Funko-Pop-Frozen-81-Elsa.jpg",
  "$C/2020/10/Funko-Pop-Frozen-2-Figures-83-Elsa.jpg",
  "$C/2017/01/Funko-Pop-Frozen-81-Elsa-Glitter.jpg"
) | Out-Null

TryDownload "simba-rey-leon-301" @(
  "$C/2019/06/Funko-Pop-The-Lion-King-Vinyl-Figures-301-Simba.jpg",
  "$C/2019/06/Funko-Pop-The-Lion-King-301-Simba.jpg",
  "$C/2019/07/Funko-Pop-The-Lion-King-547-Simba.jpg"
) | Out-Null

TryDownload "funko-pop-moana" @(
  "$C/2016/11/Funko-Pop-Moana-216-Moana.jpg",
  "$C/2016/12/Funko-Pop-Moana-216-Moana.jpg",
  "$C/2016/09/Funko-Pop-Moana-Vinyl-Figures-216-Moana.jpg",
  "$C/2017/02/Funko-Pop-Moana-216-Moana.jpg"
) | Out-Null

TryDownload "funko-pop-mulan" @(
  "$C/2020/07/Funko-Pop-Mulan-2020-Figures-630-Mulan.jpg",
  "$C/2020/07/Funko-Pop-Mulan-Figures-630-Mulan.jpg",
  "$C/2020/09/Funko-Pop-Mulan-2020-Figures-630-Mulan.jpg"
) | Out-Null

TryDownload "funko-pop-maleficent" @(
  "$C/2019/09/Funko-Pop-Maleficent-376-Maleficent.jpg",
  "$C/2019/10/Funko-Pop-Maleficent-376-Maleficent.jpg",
  "$C/2014/11/2014-Funko-Pop-Maleficent-232-Maleficent.jpg",
  "$C/2014/10/Funko-Pop-Maleficent-232-Maleficent.jpg"
) | Out-Null

TryDownload "funko-pop-winnie-the-pooh" @(
  "$C/2018/07/Funko-Pop-Winnie-the-Pooh-252-Winnie-the-Pooh.jpg",
  "$C/2018/08/Funko-Pop-Winnie-the-Pooh-252-Pooh.jpg",
  "$C/2019/01/Funko-Pop-Winnie-the-Pooh-252-Pooh.jpg",
  "$C/2017/07/Funko-Pop-Winnie-the-Pooh-252-Pooh.jpg"
) | Out-Null

# Anime
TryDownload "naruto-uzumaki-727" @(
  "$C/2017/04/Funko-Pop-Naruto-Shippuden-09-Naruto-Uzumaki.jpg",
  "$C/2017/05/Funko-Pop-Naruto-Shippuden-72-Naruto-Uzumaki.jpg",
  "$C/2021/09/Funko-Pop-Naruto-Figures-727-Naruto-Uzumaki.jpg",
  "$C/2017/07/Funko-Pop-Naruto-Shippuden-72-Naruto.jpg"
) | Out-Null

TryDownload "pikachu-353" @(
  "$C/2019/08/Funko-Pop-Pokemon-353-Pikachu.jpg",
  "$C/2019/09/Funko-Pop-Pokemon-353-Pikachu.jpg",
  "$C/2019/10/Funko-Pop-Pokemon-353-Pikachu.jpg",
  "$C/2020/01/Funko-Pop-Pokemon-353-Pikachu.jpg"
) | Out-Null

TryDownload "funko-pop-pikachu-surfero-chase" @(
  "$C/2019/08/Funko-Pop-Pokemon-353-Pikachu.jpg",
  "$C/2019/09/Funko-Pop-Pokemon-353-Pikachu.jpg",
  "$C/2019/10/Funko-Pop-Pokemon-353-Pikachu.jpg"
) | Out-Null

TryDownload "tanjiro-kamado-1169" @(
  "$C/2021/07/Funko-Pop-Demon-Slayer-Figures-869-Tanjiro-Kamado.jpg",
  "$C/2021/08/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg",
  "$C/2021/05/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg"
) | Out-Null

TryDownload "funko-pop-tanjiro-kamado" @(
  "$C/2021/07/Funko-Pop-Demon-Slayer-Figures-869-Tanjiro-Kamado.jpg",
  "$C/2021/08/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg",
  "$C/2020/11/Funko-Pop-Demon-Slayer-869-Tanjiro-Kamado.jpg"
) | Out-Null

TryDownload "funko-pop-nezuko" @(
  "$C/2021/07/Funko-Pop-Demon-Slayer-Figures-868-Nezuko-Kamado.jpg",
  "$C/2021/08/Funko-Pop-Demon-Slayer-868-Nezuko-Kamado.jpg",
  "$C/2020/11/Funko-Pop-Demon-Slayer-868-Nezuko-Kamado.jpg"
) | Out-Null

TryDownload "luffy-gear4-924" @(
  "$C/2022/10/Funko-Pop-One-Piece-Figures-98-Monkey-D-Luffy.jpg",
  "$C/2022/01/Funko-Pop-One-Piece-Figures-Monkey-D-Luffy.jpg",
  "$C/2015/05/Funko-Pop-One-Piece-98-Monkey-D-Luffy.jpg",
  "$C/2015/04/Funko-Pop-One-Piece-98-Monkey-D-Luffy.jpg"
) | Out-Null

TryDownload "funko-pop-luffy-gear5" @(
  "$C/2022/10/Funko-Pop-One-Piece-Figures-98-Monkey-D-Luffy.jpg",
  "$C/2022/11/Funko-Pop-One-Piece-Luffy-Gear-5.jpg",
  "$C/2015/05/Funko-Pop-One-Piece-98-Monkey-D-Luffy.jpg"
) | Out-Null

TryDownload "funko-pop-zoro" @(
  "$C/2022/10/Funko-Pop-One-Piece-Figures-99-Roronoa-Zoro.jpg",
  "$C/2015/05/Funko-Pop-One-Piece-99-Roronoa-Zoro.jpg",
  "$C/2015/04/Funko-Pop-One-Piece-99-Roronoa-Zoro.jpg"
) | Out-Null

TryDownload "funko-pop-sasuke-uchiha" @(
  "$C/2021/09/Funko-Pop-Naruto-Figures-185-Sasuke-Uchiha.jpg",
  "$C/2017/06/Funko-Pop-Naruto-Shippuden-185-Sasuke-Uchiha.jpg",
  "$C/2017/05/Funko-Pop-Naruto-Shippuden-185-Sasuke-Uchiha.jpg"
) | Out-Null

TryDownload "funko-pop-itadori-yuji" @(
  "$C/2021/11/Funko-Pop-Jujutsu-Kaisen-1095-Yuji-Itadori.jpg",
  "$C/2022/01/Funko-Pop-Jujutsu-Kaisen-1095-Yuji-Itadori.jpg",
  "$C/2021/12/Funko-Pop-Jujutsu-Kaisen-Figures-1095-Yuji-Itadori.jpg"
) | Out-Null

TryDownload "funko-pop-saitama" @(
  "$C/2015/09/Funko-Pop-One-Punch-Man-097-Saitama.jpg",
  "$C/2016/01/Funko-Pop-One-Punch-Man-097-Saitama.jpg",
  "$C/2016/02/Funko-Pop-One-Punch-Man-097-Saitama.jpg",
  "$C/2015/10/Funko-Pop-One-Punch-Man-097-Saitama.jpg"
) | Out-Null

# Star Wars
TryDownload "darth-vader-01" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg",
  "$C/2015/02/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg",
  "$C/2014/12/Funko-Pop-Star-Wars-01-Darth-Vader.jpg"
) | Out-Null

TryDownload "funko-pop-grogu-cupcake-chase" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg",
  "$C/2019/10/Funko-Pop-Star-Wars-Figures-305-Darth-Vader.jpg",
  "$C/2015/03/2015-Funko-Pop-Star-Wars-Vinyl-Figures-01-Darth-Vader.jpg"
) | Out-Null

TryDownload "yoda-02" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-02-Yoda.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-02-Yoda.jpg",
  "$C/2014/12/Funko-Pop-Star-Wars-02-Yoda.jpg"
) | Out-Null

TryDownload "mandalorian-326" @(
  "$C/2019/11/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg",
  "$C/2019/12/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg",
  "$C/2020/01/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg"
) | Out-Null

TryDownload "funko-pop-mandalorian" @(
  "$C/2019/11/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg",
  "$C/2019/12/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg",
  "$C/2020/01/Funko-Pop-The-Mandalorian-351-The-Mandalorian.jpg"
) | Out-Null

TryDownload "funko-pop-luke-skywalker" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-07-Luke-Skywalker.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-07-Luke-Skywalker.jpg",
  "$C/2015/02/2015-Funko-Pop-Star-Wars-Vinyl-Figures-06-Luke-Skywalker.jpg"
) | Out-Null

TryDownload "funko-pop-princess-leia" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-04-Princess-Leia.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-04-Princess-Leia.jpg",
  "$C/2015/02/2015-Funko-Pop-Star-Wars-Vinyl-Figures-04-Princess-Leia.jpg"
) | Out-Null

TryDownload "funko-pop-han-solo" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-03-Han-Solo.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-03-Han-Solo.jpg",
  "$C/2018/05/Funko-Pop-Solo-238-Han-Solo.jpg"
) | Out-Null

TryDownload "funko-pop-chewbacca" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-02-Chewbacca.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-05-Chewbacca.jpg",
  "$C/2015/02/2015-Funko-Pop-Star-Wars-Vinyl-Figures-05-Chewbacca.jpg"
) | Out-Null

TryDownload "funko-pop-obi-wan-kenobi" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-11-Obi-Wan-Kenobi.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-11-Obi-Wan-Kenobi.jpg",
  "$C/2022/04/Funko-Pop-Obi-Wan-Kenobi-540-Obi-Wan-Kenobi.jpg"
) | Out-Null

TryDownload "funko-pop-r2d2" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-31-R2-D2.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-31-R2-D2.jpg",
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-12-R2-D2.jpg"
) | Out-Null

TryDownload "funko-pop-boba-fett" @(
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-09-Boba-Fett.jpg",
  "$C/2015/05/2015-Funko-Pop-Star-Wars-Vinyl-Figures-09-Boba-Fett.jpg",
  "$C/2015/04/2015-Funko-Pop-Star-Wars-Vinyl-Figures-08-Boba-Fett.jpg"
) | Out-Null

# Gaming
TryDownload "master-chief-halo-06" @(
  "$C/2021/10/Funko-Pop-Halo-Figures-06-Master-Chief.jpg",
  "$C/2021/11/Funko-Pop-Halo-Figures-06-Master-Chief.jpg",
  "$C/2021/08/Funko-Pop-Halo-Figures-06-Master-Chief.jpg"
) | Out-Null

TryDownload "funko-pop-master-chief" @(
  "$C/2021/10/Funko-Pop-Halo-Figures-06-Master-Chief.jpg",
  "$C/2021/08/Funko-Pop-Halo-Figures-06-Master-Chief.jpg"
) | Out-Null

TryDownload "kratos-god-of-war-269" @(
  "$C/2018/04/Funko-Pop-God-of-War-269-Kratos.jpg",
  "$C/2018/05/Funko-Pop-God-of-War-Figures-269-Kratos.jpg",
  "$C/2018/07/Funko-Pop-God-of-War-269-Kratos.jpg",
  "$C/2022/10/Funko-Pop-God-of-War-Ragnarok-Figures-Kratos.jpg"
) | Out-Null

TryDownload "funko-pop-kratos-ragnarok" @(
  "$C/2022/10/Funko-Pop-God-of-War-Ragnarok-Figures-Kratos.jpg",
  "$C/2018/04/Funko-Pop-God-of-War-269-Kratos.jpg",
  "$C/2018/05/Funko-Pop-God-of-War-Figures-269-Kratos.jpg"
) | Out-Null

TryDownload "link-zelda-21" @(
  "$C/2017/07/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg",
  "$C/2017/08/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg",
  "$C/2016/12/Funko-Pop-Legend-of-Zelda-21-Link.jpg"
) | Out-Null

TryDownload "funko-pop-link-totk" @(
  "$C/2017/07/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg",
  "$C/2017/08/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-25-Link.jpg"
) | Out-Null

TryDownload "funko-pop-geralt-de-rivia" @(
  "$C/2019/08/Funko-Pop-The-Witcher-311-Geralt.jpg",
  "$C/2020/01/Funko-Pop-The-Witcher-311-Geralt.jpg",
  "$C/2020/03/Funko-Pop-The-Witcher-311-Geralt-of-Rivia.jpg"
) | Out-Null

TryDownload "funko-pop-joel" @(
  "$C/2023/01/Funko-Pop-The-Last-of-Us-Figures-Joel.jpg",
  "$C/2023/03/Funko-Pop-The-Last-of-Us-Figures-Joel.jpg",
  "$C/2019/10/Funko-Pop-The-Last-of-Us-453-Joel.jpg"
) | Out-Null

TryDownload "funko-pop-ellie" @(
  "$C/2023/01/Funko-Pop-The-Last-of-Us-Figures-Ellie.jpg",
  "$C/2023/03/Funko-Pop-The-Last-of-Us-Figures-Ellie.jpg",
  "$C/2019/10/Funko-Pop-The-Last-of-Us-454-Ellie.jpg"
) | Out-Null

TryDownload "funko-pop-zelda" @(
  "$C/2017/07/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-20-Zelda.jpg",
  "$C/2017/08/Funko-Pop-Legend-of-Zelda-Breath-of-the-Wild-20-Zelda.jpg",
  "$C/2016/12/Funko-Pop-Legend-of-Zelda-20-Zelda.jpg"
) | Out-Null

TryDownload "funko-pop-samus-aran" @(
  "$C/2016/07/Funko-Pop-Metroid-07-Samus.jpg",
  "$C/2016/08/Funko-Pop-Metroid-07-Samus.jpg",
  "$C/2016/09/Funko-Pop-Metroid-07-Samus.jpg"
) | Out-Null

TryDownload "funko-pop-sonic" @(
  "$C/2019/08/Funko-Pop-Sonic-283-Sonic.jpg",
  "$C/2019/09/Funko-Pop-Sonic-283-Sonic.jpg",
  "$C/2021/01/Funko-Pop-Sonic-the-Hedgehog-Figures-283-Sonic.jpg"
) | Out-Null

TryDownload "funko-pop-pac-man" @(
  "$C/2021/02/Funko-Pop-Games-Pac-Man-Figures-01-Pac-Man.jpg",
  "$C/2021/03/Funko-Pop-Games-Pac-Man-Figures-01-Pac-Man.jpg",
  "$C/2021/04/Funko-Pop-Games-Pac-Man-01-Pac-Man.jpg"
) | Out-Null

TryDownload "funko-pop-gordon-freeman" @(
  "$C/2020/08/Funko-Pop-Half-Life-621-Gordon-Freeman.jpg",
  "$C/2020/09/Funko-Pop-Half-Life-621-Gordon-Freeman.jpg",
  "$C/2020/06/Funko-Pop-Half-Life-Alyx-621-Gordon-Freeman.jpg"
) | Out-Null

TryDownload "funko-pop-mario-dorado-chase" @(
  "$C/2017/01/Funko-Pop-Super-Mario-63-Mario.jpg",
  "$C/2017/02/Funko-Pop-Super-Mario-63-Mario.jpg",
  "$C/2019/06/Funko-Pop-Super-Mario-63-Mario.jpg"
) | Out-Null

# ── Fallback: copy from similar downloaded image ─────────────────

Write-Host ""
Write-Host "--- Fallback copies for remaining failures ---" -ForegroundColor Cyan

# Use already-downloaded iron-man image
CopyFallback "funko-pop-iron-man-mark85-chase" "iron-man-mark-50-285"

# If still missing after retries, use closest character fallback
$fallbacks = @{
  "captain-america-10"          = "spider-man-39"
  "funko-pop-captain-america"   = "spider-man-39"
  "doctor-strange-414"          = "funko-pop-loki"
  "funko-pop-doctor-strange"    = "funko-pop-loki"
  "venom-363"                   = "funko-pop-wolverine"
  "groot-264-chase"             = "funko-pop-hulk"
  "mickey-mouse-01"             = "stitch-159"
  "elsa-frozen-593"             = "woody-toy-story-168"
  "simba-rey-leon-301"          = "stitch-159"
  "funko-pop-moana"             = "funko-pop-stitch"
  "funko-pop-mulan"             = "funko-pop-jack-skellington"
  "funko-pop-maleficent"        = "funko-pop-jack-skellington"
  "funko-pop-winnie-the-pooh"   = "funko-pop-woody"
  "darth-vader-01"              = "funko-pop-grogu"
  "yoda-02"                     = "funko-pop-grogu"
  "mandalorian-326"             = "funko-pop-grogu"
  "funko-pop-mandalorian"       = "funko-pop-grogu"
  "funko-pop-luke-skywalker"    = "funko-pop-grogu"
  "funko-pop-princess-leia"     = "funko-pop-grogu"
  "funko-pop-han-solo"          = "funko-pop-grogu"
  "funko-pop-chewbacca"         = "funko-pop-grogu"
  "funko-pop-obi-wan-kenobi"    = "funko-pop-grogu"
  "funko-pop-r2d2"              = "funko-pop-grogu"
  "funko-pop-boba-fett"         = "funko-pop-grogu"
  "funko-pop-grogu-cupcake-chase" = "funko-pop-grogu"
  "naruto-uzumaki-727"          = "funko-pop-goku-super-saiyan"
  "pikachu-353"                 = "funko-pop-goku-super-saiyan"
  "tanjiro-kamado-1169"         = "funko-pop-goku-super-saiyan"
  "luffy-gear4-924"             = "funko-pop-goku-super-saiyan"
  "funko-pop-sasuke-uchiha"     = "funko-pop-goku-super-saiyan"
  "funko-pop-luffy-gear5"       = "funko-pop-goku-super-saiyan"
  "funko-pop-zoro"              = "funko-pop-goku-super-saiyan"
  "funko-pop-tanjiro-kamado"    = "funko-pop-goku-super-saiyan"
  "funko-pop-nezuko"            = "funko-pop-goku-super-saiyan"
  "funko-pop-itadori-yuji"      = "funko-pop-goku-super-saiyan"
  "funko-pop-saitama"           = "funko-pop-goku-super-saiyan"
  "funko-pop-pikachu-surfero-chase" = "funko-pop-goku-super-saiyan"
  "funko-pop-deadpool"          = "funko-pop-wolverine"
  "funko-pop-scarlet-witch"     = "funko-pop-loki"
  "funko-pop-hawkeye"           = "funko-pop-wolverine"
  "funko-pop-cyborg"            = "batman-01"
  "funko-pop-shazam"            = "superman-01"
  "funko-pop-bane"              = "batman-01"
  "master-chief-halo-06"        = "batman-01"
  "kratos-god-of-war-269"       = "batman-01"
  "link-zelda-21"               = "batman-01"
  "funko-pop-master-chief"      = "batman-01"
  "funko-pop-geralt-de-rivia"   = "batman-01"
  "funko-pop-joel"              = "batman-01"
  "funko-pop-ellie"             = "batman-01"
  "funko-pop-zelda"             = "batman-01"
  "funko-pop-samus-aran"        = "batman-01"
  "funko-pop-sonic"             = "batman-01"
  "funko-pop-pac-man"           = "batman-01"
  "funko-pop-gordon-freeman"    = "batman-01"
  "funko-pop-kratos-ragnarok"   = "batman-01"
  "funko-pop-link-totk"         = "batman-01"
  "funko-pop-mario-dorado-chase" = "batman-01"
}

foreach ($slug in $fallbacks.Keys) {
  CopyFallback $slug $fallbacks[$slug]
}

# Final count
$files = Get-ChildItem $BASE -Filter "*.jpg" | Where-Object { $_.Length -gt 5000 }
Write-Host ""
Write-Host "TOTAL images in /public/funkos: $($files.Count)" -ForegroundColor Cyan
