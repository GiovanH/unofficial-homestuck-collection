// const Resources = require('./resources.js')

const assets_root = "http://localhost:8413/"

async function testArchiveMusic(){
  const archive = window.vm.archive

  logger.info("Flash art")
  // // from discography.vue
  // const flash_urls = Object.keys(archive.music.flashes).map(flash => `assets://archive/music/flash/${flash}.png`)
  // logger.info(flash_urls)

  // await Promise.all(flash_urls.map(u => fetch(u, {mode: 'no-cors'})))
  // logger.info("Done (opaque)")

  logger.info("Album art...")
  // from discography.vue
  const album_urls = Object.values(archive.music.albums).map(album => `assets://archive/music/${album.directory}/cover.jpg`)
  album_urls.push(`assets://archive/music/spoiler.png`)

  await Promise.all(album_urls.map(u => fetch(Resources.resolveAssetsProtocol(u), {mode: 'no-cors'})))
  logger.info("Done (opaque)")

  logger.info("Track art...")
  // from track.vue
  const track_urls = Object.values(archive.music.tracks).map(track => {
    const dirName = track.album.find(album => archive.music.albums[album].hasTrackArt) || track.album[0]
    const fileName = track.coverArtists && archive.music.albums[dirName].hasTrackArt ? track.directory : 'cover'
    return `assets://archive/music/${dirName}/${fileName}.jpg`
  })
  track_urls.push(`assets://archive/music/spoiler.png`)

  await Promise.all([...new Set(track_urls)].map(u => fetch(Resources.resolveAssetsProtocol(u), {mode: 'no-cors'})))
  logger.info("Done (opaque)")
}

async function testArchiveComic(archive){
  archive = archive || window.vm.archive

  // logger.info("Flash art")
  // // from discography.vue
  // const flash_urls = Object.keys(archive.music.flashes).map(flash => `assets://archive/music/flash/${flash}.png`)
  // logger.info(flash_urls)

  // await Promise.all(flash_urls.map(u => fetch(u, {mode: 'no-cors'})))
  // logger.info("Done (opaque)")

  logger.info("MSPA story...")
  // from discography.vue
  const media_urls = Object.values(archive.mspa.story).reduce((acc, page) => [...acc, ...page.media], [])
  let array = [...new Set(media_urls)]
  const chunk_size = 1000
  for (let i = 0; i < array.length; i += chunk_size) {
    const chunk = array.slice(i, i + chunk_size)
    await Promise.all(chunk.map(u => fetch(getResourceURL(u), {mode: 'no-cors'})))
    logger.info(i)
  }
  logger.info("Done (opaque)")
}


const libGetStory = {
  "sentinal": undefined,
  134: 1,
  135: 1,
  '000135': 1,
  136: 2,
  215: 2,
  216: 2,
  '000216': 2,
  217: undefined,
  "mc0000": undefined,
  "mc0001": 3,
  "mc0002": undefined,
  1891: 4,
  1892: 4,
  '001892': 4,
  1893: 5,
  1899: 5,
  1900: 5,
  '001900': 5,
  1901: 6,
  10029: 6,
  10030: 6,
  '010030': 6,
  10031: undefined
}

const libAllPages = {
  '1': 134,
  '2': 47,
  '3': 1,
  '4': 1673,
  '5': 8,
  '6': 8124,
  '7': 0,
  'ryanquest': 15
}
const libAllPagesSec = { ...libAllPages, '6': 8128 }

/* eslint-disable key-spacing */
const libVizToMspa = {
  "jailbreak 1":         JSON.stringify({s: 1, p: "000002"}),
  "jailbreak 134":       JSON.stringify({s: 1, p: "000135"}),
  "jailbreak 135":       JSON.stringify({s: 1, p: "jb2_000000"}),
  "jailbreak 136":       JSON.stringify({}),
  "bard-quest 1":        JSON.stringify({s: 2, p: "000136"}),
  "bard-quest 136":      JSON.stringify({}),
  "bard-quest 169":      JSON.stringify({}),
  "blood-spade 1":       JSON.stringify({s: 3, p: "mc0001"}),
  "problem-sleuth 1":    JSON.stringify({s: 4, p: "000219"}),
  "problem-sleuth 218":  JSON.stringify({s: 4, p: "000436"}),
  "problem-sleuth 1673": JSON.stringify({s: 4, p: "001891"}),
  "problem-sleuth 1674": JSON.stringify({s: 4, p: "001892"}),
  "problem-sleuth 1675": JSON.stringify({}),
  "beta 1":              JSON.stringify({s: 5, p: "001893"}),
  "homestuck 1":         JSON.stringify({s: 6, p: "001901"}),
  "homestuck 1900":      JSON.stringify({s: 6, p: "003800"}),
  "homestuck 1902":      JSON.stringify({s: 6, p: "003802"}),

  "homestuck 7363":      JSON.stringify({s: 6, p: "009263"}),
  "homestuck 7364":      JSON.stringify({s: 6, p: "009264"}),
  "homestuck 7365":      JSON.stringify({s: 6, p: "009265"}),

  "homestuck 3742":      JSON.stringify({s: 6, p: "005642"}),
  "homestuck 3743":      JSON.stringify({s: 6, p: "005643"}),
  "homestuck 3744":      JSON.stringify({s: 6, p: "005644"}),

  "homestuck 8129":      JSON.stringify({s: 6, p: "010029"}),
  "homestuck 8130":      JSON.stringify({s: 6, p: "010030"}),
  "homestuck 8131":      JSON.stringify({}),
  "homestuck darkcage":  JSON.stringify({s: 6, p: "darkcage"}),
  "homestuck pony":      JSON.stringify({s: 6, p: "pony"}),
  // "homestuck pony3":     JSON.stringify({}),
  "ryanquest 1":         JSON.stringify({s: 'ryanquest', p: "000001"}),
  "ryanquest 15":        JSON.stringify({s: 'ryanquest', p: "000015"}),
  "ryanquest 16":        JSON.stringify({})
}
const libMspaToViz = {
  "000002":              JSON.stringify({s: 'jailbreak', p: "1"}),
  "000135":              JSON.stringify({s: 'jailbreak', p: "134"}),
  "jb2_000000":          JSON.stringify({s: 'jailbreak', p: "135"}),
  "jailbreak 136":       undefined,
  "000136":              JSON.stringify({s: 'bard-quest', p: "1"}),
  "bard-quest 136":      undefined,
  "mc0001":              JSON.stringify({s: 'blood-spade', p: "1"}),
  "000219":              JSON.stringify({s: 'problem-sleuth', p: "1"}),
  "000436":              JSON.stringify({s: 'problem-sleuth', p: "218"}),
  "001891":              JSON.stringify({s: 'problem-sleuth', p: "1673"}),
  "001892":              JSON.stringify({s: 'problem-sleuth', p: "1674"}),
  "problem-sleuth 1675": undefined,
  "001893":              JSON.stringify({s: 'beta', p: "1"}),
  "001901":              JSON.stringify({s: 'homestuck', p: "1"}),
  "003800":              JSON.stringify({s: 'homestuck', p: "1900"}),
  "003802":              JSON.stringify({s: 'homestuck', p: "1902"}),
  "009263":              JSON.stringify({s: 'homestuck', p: "7363"}),
  "009264":              JSON.stringify({s: 'homestuck', p: "7364"}),
  "009265":              JSON.stringify({s: 'homestuck', p: "7365"}),
  "005642":              JSON.stringify({s: 'homestuck', p: "3742"}),
  "005643":              JSON.stringify({s: 'homestuck', p: "3743"}),
  "005644":              JSON.stringify({s: 'homestuck', p: "3744"}),
  "010029":              JSON.stringify({s: 'homestuck', p: "8129"}),
  "010030":              JSON.stringify({s: 'homestuck', p: "8130"}),
  // "pony3":               undefined,
  "darkcage":            JSON.stringify({s: 'homestuck', p: "darkcage"}),
  "pony":                JSON.stringify({s: 'homestuck', p: "pony"}),
  "homestuck pony3":     undefined,
  // "000001":              JSON.stringify({s: 'ryanquest', p: 1}),
  // "000015":              JSON.stringify({s: 'ryanquest', p: 15}),
}


// Begin converted:


const libGetResourceUrl = {
  "http://www.turner.com/planet/mp3/cp_close.mp3": "assets://storyfiles/hs2/00338/cp_close.mp3",
  "http://fozzy42.com/SoundClips/Themes/Movies/Ghostbusters.mp3": "assets://storyfiles/hs2/00338/Ghostbusters.mp3",
  "http://pasko.webs.com/foreign/Aerosmith_-_I_Dont_Wanna_Miss_A_Thing.mp3": "assets://storyfiles/hs2/00338/Aerosmith_-_I_Dont_Wanna_Miss_A_Thing.mp3",
  "http://www.mspaintadventures.com/extras/ps000015.html": "/unlock/ps000015",
  "/advimgs/jb/mspaintadventure08.gif": "assets://advimgs/jb/mspaintadventure08.gif",
  "/archive/collection/archive_beta.png": "assets://archive/collection/archive_beta.png",
  "/archive/collection/archive_vigilprince.png": "assets://archive/collection/archive_vigilprince.png",
  "/archive/collection/mspa_logo_dark.png": "assets://archive/collection/mspa_logo_dark.png",
  "/archive/collection/tso_logo.png": "assets://archive/collection/tso_logo.png",
  "/archive/music/bannerCrop.png": "assets://archive/music/bannerCrop.png",
  "/archive/music/homestuck-vol-5/cover.jpg": "assets://archive/music/homestuck-vol-5/cover.jpg",
  "/archive/namcohigh/bng-logo.png": "assets://archive/namcohigh/bng-logo.png",
  "/archive/namcohigh/btn_play.png": "assets://archive/namcohigh/btn_play.png",
  "/archive/namcohigh/logo_namcohigh_tm.png": "assets://archive/namcohigh/logo_namcohigh_tm.png",
  "/archive/namcohigh/recommend_left_btn.png": "assets://archive/namcohigh/recommend_left_btn.png",
  "/archive/namcohigh/recommend_right_btn.png": "assets://archive/namcohigh/recommend_right_btn.png",
  "/archive/namcohigh/text_artist_01.png": "assets://archive/namcohigh/text_artist_01.png",
  "/archive/namcohigh/text_lead.png": "assets://archive/namcohigh/text_lead.png",
  "/images/act7_header.gif": "assets://images/act7_header.gif",
  "/images/archive_bq.gif": "assets://images/archive_bq.gif",
  "/images/archive_hs.gif": "assets://images/archive_hs.gif",
  "/images/header_cascade.gif": "assets://images/header_cascade.gif",
  "/images/mspalogo_mspa.png": "assets://images/mspalogo_mspa.png",
  "/images/mspalogo_scratch.png": "assets://images/mspalogo_scratch.png",
  "/images/news.png": "assets://images/news.png",
  "/ryanquest/01.gif": "assets://ryanquest/01.gif",
  "/ryanquest/02.gif": "assets://ryanquest/02.gif",
  "/storyfiles/hs2/00248retcon.gif": "assets://storyfiles/hs2/00248retcon.gif",
  "/storyfiles/hs2/05260/05260.html": "assets://storyfiles/hs2/05260/05260.html",
  "/storyfiles/hs2/07631.gif": "assets://storyfiles/hs2/07631.gif",
  "/storyfiles/hs2/08112johndad.png": "assets://storyfiles/hs2/08112johndad.png",
  "/storyfiles/hs2/08113johndad.png": "assets://storyfiles/hs2/08113johndad.png",
  "/storyfiles/hs2/08120/08120.mp4": "assets://storyfiles/hs2/08120/08120.mp4",
  "/storyfiles/hs2/echidna/echidna.swf": "assets://storyfiles/hs2/echidna/echidna.swf",
  "/storyfiles/hs2/scratch/room112.gif": "assets://storyfiles/hs2/scratch/room112.gif",
  "/storyfiles/hs2/Sfiles/06379/06379.swf": "assets://storyfiles/hs2/06379/06379.swf",
  "/storyfiles/mc/00000.gif": "assets://storyfiles/mc/00000.gif",
  "assets://archive/collection/logo_v2_full.webm": "assets://archive/collection/logo_v2_full.webm",
  "assets://archive/collection/news_logo.png": "assets://archive/collection/news_logo.png",
  "assets://images/logo.gif": "assets://images/logo.gif",
  "assets://images/news.png": "assets://images/news.png",
  "assets://ryanquest/02.gif": "assets://ryanquest/02.gif",
  "assets://s%3D6%26p%3D001902.html/": "assets://s%3D6%26p%3D001902.html/",
  "assets://scraps2/jessfink_soulportrait.jpg": "assets://scraps2/jessfink_soulportrait.jpg",
  "assets://scraps2/knockknock.jpg": "assets://scraps2/knockknock.jpg",
  "assets://scraps2/sassacre_original.jpg": "assets://scraps2/sassacre_original.jpg",
  "assets://scraps2/tcafchillin.jpg": "assets://scraps2/tcafchillin.jpg",
  "assets://storyfiles/hs2/08113johndad.png": "assets://storyfiles/hs2/08113johndad.png",
  "assets://storyfiles/hs2/scraps/gate1map.jpg": "assets://storyfiles/hs2/scraps/gate1map.jpg",
  "assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf": "assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf",
  "file:///L:/Archive/Homestuck/Full%20Collections/TUHC/Asset%20Pack%20V2/mods": "file:///L:/Archive/Homestuck/Full%20Collections/TUHC/Asset%20Pack%20V2/mods",
  "http://127.0.0.1:1103/images/news.png": "http://127.0.0.1:1103/images/news.png",
  "http://127.0.0.1:19044/archive/external/miracles.mp4": "http://127.0.0.1:19044/archive/external/miracles.mp4",
  "http://127.0.0.1:19044/images/news.png": "http://127.0.0.1:19044/images/news.png",
  "http://127.0.0.1:19044/ryanquest/andrewhussie.png": "http://127.0.0.1:19044/ryanquest/andrewhussie.png",
  "http://127.0.0.1:19044/storyfiles/hs2/scraps/smuut25.gif": "http://127.0.0.1:19044/storyfiles/hs2/scraps/smuut25.gif",
  "http://alexandra-douglass.com/": "http://alexandra-douglass.com/",
  "http://alexandra-douglass.com/shop.html": "http://alexandra-douglass.com/shop.html",
  "http://byrobot.net/?cid=302.jpg": "http://byrobot.net/?cid=302.jpg",
  "http://byrobot.net/?cid=303.jpg": "http://byrobot.net/?cid=303.jpg",
  "http://darrencalvert.com/": "http://darrencalvert.com/",
  "http://darrencalvert.com/felt_fanart.jpg": "http://darrencalvert.com/felt_fanart.jpg",
  "http://darrencalvert.com/ps_desktop.jpg": "http://darrencalvert.com/ps_desktop.jpg",
  "http://dramaticshapes.blogspot.com/": "http://dramaticshapes.blogspot.com/",
  "http://drmcninja.com/": "http://drmcninja.com/",
  "http://dstrider.blogspot.com/": "http://dstrider.blogspot.com/",
  "http://en.wikipedia.org/wiki/Barkley,_Shut_Up_and_Jam:_Gaiden": "http://en.wikipedia.org/wiki/Barkley,_Shut_Up_and_Jam:_Gaiden",
  "http://en.wikipedia.org/wiki/EarthBound": "http://en.wikipedia.org/wiki/EarthBound",
  "http://firmanproductions.com/latrine/swordsmen.png": "http://firmanproductions.com/latrine/swordsmen.png",
  "http://gunshowcomic.com/": "http://gunshowcomic.com/",
  "http://homestuck.com/mspa?s=6&p=007395": "http://homestuck.com/mspa?s=6&p=007395",
  "http://homestuckgaiden.bandcamp.com/": "http://homestuckgaiden.bandcamp.com/",
  "http://i2.photobucket.com/albums/y25/Agrajag42/mspa/MC-timeline-page1.png": "http://i2.photobucket.com/albums/y25/Agrajag42/mspa/MC-timeline-page1.png",
  "http://i2.photobucket.com/albums/y25/Agrajag42/mspa/MC-timeline-page2.png": "http://i2.photobucket.com/albums/y25/Agrajag42/mspa/MC-timeline-page2.png",
  "http://iasos.com/artists/erial/celestial-soul-portraits/": "http://iasos.com/artists/erial/celestial-soul-portraits/",
  "http://iheartryan.com/": "http://iheartryan.com/",
  "http://jessfink.com/kwe/": "http://jessfink.com/kwe/",
  "http://localhost:8080/": "http://localhost:8080/",
  "http://localhost:8080/archive/external/midnightcrew.mp4": "assets://archive/external/midnightcrew.mp4",
  "http://localhost:8080/archive/external/miracles.mp4": "assets://archive/external/miracles.mp4",
  "http://localhost:8080/archive/external/mspa-record.gif": "assets://archive/external/mspa-record.gif",
  "http://localhost:8080/archive/social/news/v2_a_ps.gif": "assets://archive/social/news/v2_a_ps.gif",
  "http://localhost:8080/archive/social/news/vol5_album_banner.gif": "assets://archive/social/news/vol5_album_banner.gif",
  "http://localhost:8080/blogspot/end-of-problem-sleuth": "http://localhost:8080/blogspot/end-of-problem-sleuth",
  "http://localhost:8080/blogspot/soul-money": "http://localhost:8080/blogspot/soul-money",
  "http://localhost:8080/credits": "http://localhost:8080/credits",
  "http://localhost:8080/credits/artcredits": "http://localhost:8080/credits/artcredits",
  "http://localhost:8080/credits/soundcredits": "http://localhost:8080/credits/soundcredits",
  "http://localhost:8080/evenmore": "http://localhost:8080/evenmore",
  "http://localhost:8080/formspring": "http://localhost:8080/formspring",
  "http://localhost:8080/music/album/homestuck-vol-5": "http://localhost:8080/music/album/homestuck-vol-5",
  "http://localhost:8080/music/album/midnight-crew-drawing-dead": "http://localhost:8080/music/album/midnight-crew-drawing-dead",
  "http://localhost:8080/music/album/squiddles": "http://localhost:8080/music/album/squiddles",
  "http://localhost:8080/music/artist/bill-bolin": "http://localhost:8080/music/artist/bill-bolin",
  "http://localhost:8080/music/track/crystamanthequins": "http://localhost:8080/music/track/crystamanthequins",
  "http://localhost:8080/news": "http://localhost:8080/news",
  "http://localhost:8080/news/1-08-10": "http://localhost:8080/news/1-08-10",
  "http://localhost:8080/pxs/summerteen-romance/31": "http://localhost:8080/pxs/summerteen-romance/31",
  "http://localhost:8080/ryanquest": "http://localhost:8080/ryanquest",
  "http://localhost:8080/ryanquest/9": "http://localhost:8080/ryanquest/9",
  "http://localhost:8080/ryanquest/andrewhussie.png": "assets://ryanquest/andrewhussie.png",
  "http://localhost:8080/sbahj/11": "http://localhost:8080/sbahj/11",
  "http://localhost:8080/sbahj/21": "http://localhost:8080/sbahj/21",
  "http://localhost:8080/sbahj/22": "http://localhost:8080/sbahj/22",
  "http://localhost:8080/sbahj/4": "http://localhost:8080/sbahj/4",
  "http://localhost:8080/scraps2/jessfink_soulportrait.jpg": "assets://scraps2/jessfink_soulportrait.jpg",
  "http://localhost:8080/scraps2/knockknock.jpg": "assets://scraps2/knockknock.jpg",
  "http://localhost:8080/scraps2/sassacre_original.jpg": "assets://scraps2/sassacre_original.jpg",
  "http://localhost:8080/scraps2/tcafchillin.jpg": "assets://scraps2/tcafchillin.jpg",
  "http://localhost:8080/search": "http://localhost:8080/search",
  "http://localhost:8080/settings": "http://localhost:8080/settings",
  "http://localhost:8080/settings/controversial": "http://localhost:8080/settings/controversial",
  "http://localhost:8080/skaianet": "http://localhost:8080/skaianet",
  "http://localhost:8080/storyfiles/hs2/scraps/gate1map.jpg": "assets://storyfiles/hs2/scraps/gate1map.jpg",
  "http://localhost:8080/sweetbroandhellajeff/movies/SBAHJthemovie1.swf": "assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf",
  "http://localhost:8080/tumblr/more-so-i-just-dialed-down-the-joke-on-page": "http://localhost:8080/tumblr/more-so-i-just-dialed-down-the-joke-on-page",
  "http://localhost:8080/unlock/ps000039": "http://localhost:8080/unlock/ps000039",
  "http://localhost:8080/waywardvagabond/recordsastutteringstep/": "http://localhost:8080/waywardvagabond/recordsastutteringstep/",
  "http://mcmittens.com/": "http://mcmittens.com/",
  "http://mspaintadventures.com/?s=3": "/mspa/3",
  "http://mspaintadventures.com/?s=ryanquest": "/mspa/ryanquest",
  "http://mspaintadventures.com/scraps2/a6i3map1.gif": "assets://scraps2/a6i3map1.gif",
  "http://mspaintadventures.com/scraps2/A6I3walkthrough.gif": "assets://scraps2/A6I3walkthrough.gif",
  "http://mspaintadventures.wikia.com/wiki/413": "http://mspaintadventures.wikia.com/wiki/413",
  "http://nedroid.com/": "http://nedroid.com/",
  "http://overcompensating.com/": "http://overcompensating.com/",
  "http://proffate.deviantart.com/": "http://proffate.deviantart.com/",
  "http://qwantz.com/index.php": "http://qwantz.com/index.php",
  "http://roflcon.org/": "http://roflcon.org/",
  "http://s23.photobucket.com/albums/b392/Eyes5/?action=view&current=Imp2.jpg": "http://s23.photobucket.com/albums/b392/Eyes5/?action=view&current=Imp2.jpg",
  "http://s23.photobucket.com/albums/b392/Eyes5/?action=view&current=SawbuckClover.jpg": "http://s23.photobucket.com/albums/b392/Eyes5/?action=view&current=SawbuckClover.jpg",
  "http://s839.photobucket.com/albums/zz317/ellesterotakon2010/mspa%20peeps/": "http://s839.photobucket.com/albums/zz317/ellesterotakon2010/mspa%20peeps/",
  "http://samandfuzzy.com/": "http://samandfuzzy.com/",
  "http://samandfuzzy.com/1210": "http://samandfuzzy.com/1210",
  "http://sites.google.com/site/kainsirusque/homepage/vmap_p.PNG": "http://sites.google.com/site/kainsirusque/homepage/vmap_p.PNG",
  "http://smokinghippo.com/": "http://smokinghippo.com/",
  "http://spamtheweb.com/ul/s452010786_01940.html": "http://spamtheweb.com/ul/s452010786_01940.html",
  "http://spamtheweb.com/ul/upload/100210/4518_Gate1.php": "http://spamtheweb.com/ul/upload/100210/4518_Gate1.php",
  "http://spamtheweb.com/ul/upload/120210/4005_Gate1.php": "http://spamtheweb.com/ul/upload/120210/4005_Gate1.php",
  "http://spamtheweb.com/ul/upload/140110/20525_endact3.php": "http://spamtheweb.com/ul/upload/140110/20525_endact3.php",
  "http://sugar-stars.com/doodle/roseandjade.png": "http://sugar-stars.com/doodle/roseandjade.png",
  "http://topatoco.com/hey/": "http://topatoco.com/hey/",
  "http://torontocomics.com/": "http://torontocomics.com/",
  "http://twainquotes.com/19100423b.html": "http://twainquotes.com/19100423b.html",
  "http://twitpic.com/32tfv0": "http://twitpic.com/32tfv0",
  "http://twitter.com/andrewhussie": "http://twitter.com/andrewhussie",
  "http://twitter.com/BarackObana": "http://twitter.com/BarackObana",
  "http://webcomicsweekend.com/": "http://webcomicsweekend.com/",
  "http://wondermark.com/": "http://wondermark.com/",
  "http://www.alexandra-douglass.com/": "http://www.alexandra-douglass.com/",
  "http://www.alexandra-douglass.com/special/612_wallpaper.jpg": "http://www.alexandra-douglass.com/special/612_wallpaper.jpg",
  "http://www.c2e2.com/": "http://www.c2e2.com/",
  "http://www.cafepress.com/mspaartists2011.488790768": "http://www.cafepress.com/mspaartists2011.488790768",
  "http://www.cracked.com/video_18178_the-second-most-embarrassing-thing-to-die-doing.html": "http://www.cracked.com/video_18178_the-second-most-embarrassing-thing-to-die-doing.html",
  "http://www.emeraldcitycomicon.com/": "http://www.emeraldcitycomicon.com/",
  "http://www.epicsplosion.com/": "http://www.epicsplosion.com/",
  "http://www.firmanproductions.com/": "http://www.firmanproductions.com/",
  "http://www.firmanproductions.com/latrine/uglybish.jpg": "http://www.firmanproductions.com/latrine/uglybish.jpg",
  "http://www.independent.co.uk/arts-entertainment/books/news/after-keeping-us-waiting-for-a-century-mark-twain-will-finally-reveal-all-1980695.html": "http://www.independent.co.uk/arts-entertainment/books/news/after-keeping-us-waiting-for-a-century-mark-twain-will-finally-reveal-all-1980695.html",
  "http://www.iwantyoutofeelthepressure.com/": "http://www.iwantyoutofeelthepressure.com/",
  "http://www.metroidhat.com/": "http://www.metroidhat.com/",
  "http://www.metroidhat.com/gallery/lilcal.html": "http://www.metroidhat.com/gallery/lilcal.html",
  "http://www.mit.edu/~puzzle/10/puzzles/1983/edits/": "http://www.mit.edu/~puzzle/10/puzzles/1983/edits/",
  "http://www.mit.edu/~puzzle/10/puzzles/1983/edits/solution.html": "http://www.mit.edu/~puzzle/10/puzzles/1983/edits/solution.html",
  "http://www.moccany.com/": "http://www.moccany.com/",
  "http://www.msnbc.msn.com/id/37910015/ns/technology_and_science-tech_and_gadgets/": "http://www.msnbc.msn.com/id/37910015/ns/technology_and_science-tech_and_gadgets/",
  "http://www.mspaforums.com/": "http://www.mspaforums.com/",
  "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=2626": "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=2626",
  "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=3240": "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=3240",
  "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=4632": "http://www.mspaforums.com/memberlist.php?mode=viewprofile&u=4632",
  "http://www.mspaforums.com/viewtopic.php?f=34&t=7522": "http://www.mspaforums.com/viewtopic.php?f=34&t=7522",
  "http://www.mspaforums.com/viewtopic.php?f=35&t=5233&start=0": "http://www.mspaforums.com/viewtopic.php?f=35&t=5233&start=0",
  "http://www.mspaintadventures.com/storyfiles/hs2/scraps/smuut25.gif": "assets://storyfiles/hs2/scraps/smuut25.gif",
  "http://www.mspaintadventures.com/storyfiles/hs2/scraps/smuut26.gif": "assets://storyfiles/hs2/scraps/smuut26.gif",
  "http://www.mspaintadventures.com/storyfiles/hs2/waywardvagabond/recordsastutteringstep/": "/waywardvagabond/recordsastutteringstep/",
  "http://www.mspaintadventures.com/storyfiles/hs2/waywardvagabond/recordsastutteringstep/06.gif": "assets://storyfiles/hs2/waywardvagabond/recordsastutteringstep/06.gif",
  "http://www.mspaintadventures.com/sweetbroandhellajeff/": "/sbahj/",
  "http://www.mspaintadventures.com/sweetbroandhellajeff/comoc.php?cid=038.jpg": "/sbahj/38",
  "http://www.newgrounds.com/dump/item/f8ababf5e077e0fc05bacb3acad2a4b7": "http://www.newgrounds.com/dump/item/f8ababf5e077e0fc05bacb3acad2a4b7",
  "http://www.newyorkcomiccon.com/": "http://www.newyorkcomiccon.com/",
  "http://www.overcompensating.com/": "http://www.overcompensating.com/",
  "http://www.overcompensating.com/posts/20100315.html": "http://www.overcompensating.com/posts/20100315.html",
  "http://www.overcompensating.com/posts/20101001.html": "http://www.overcompensating.com/posts/20101001.html",
  "http://www.qwantz.com/index.php": "http://www.qwantz.com/index.php",
  "http://www.qwantz.com/index.php?comic=&butiwouldratherbereading=nedroid": "http://www.qwantz.com/index.php?comic=&butiwouldratherbereading=nedroid",
  "http://www.qwantz.com/index.php?comic=542&butiwouldratherbereading=problemsleuth": "http://www.qwantz.com/index.php?comic=542&butiwouldratherbereading=problemsleuth",
  "http://www.skepsisfox.deviantart.com/": "http://www.skepsisfox.deviantart.com/",
  "http://www.smokinghippo.com/random_art/HStuff/bfield_d2_small.jpg": "http://www.smokinghippo.com/random_art/HStuff/bfield_d2_small.jpg",
  "http://www.smokinghippo.com/random_art/HStuff/wv_castle_d3.jpg": "http://www.smokinghippo.com/random_art/HStuff/wv_castle_d3.jpg",
  "http://www.spxpo.com/about": "http://www.spxpo.com/about",
  "http://www.timelesschaos.com/teambffcomics/": "http://www.timelesschaos.com/teambffcomics/",
  "http://www.whatpumpkin.com/": "http://www.whatpumpkin.com/",
  "http://www.whatpumpkin.com/squiddles.html": "/squiddles/credits",
  "http://www.whatpumpkin.com/store/main.html": "http://www.whatpumpkin.com/store/main.html",
  "http://www.whatpumpkin.com/store/trollshirts.html": "http://www.whatpumpkin.com/store/trollshirts.html",
  "http://www.whatpumpkin.com/videos/squiddletrailer.html": "http://www.whatpumpkin.com/videos/squiddletrailer.html",
  "http://www.youtube.com/user/gazorra#p/u/4/lxCW9xmamzQ": "http://www.youtube.com/user/gazorra#p/u/4/lxCW9xmamzQ",
  "http://www.youtube.com/watch?v=0PZ5fLeLujI": "http://www.youtube.com/watch?v=0PZ5fLeLujI",
  "https://github.com/Bambosh/uhsc-mod-repo": "https://github.com/Bambosh/uhsc-mod-repo",
  "https://github.com/Bambosh/unofficial-homestuck-collection/blob/main/MODDING.md": "https://github.com/Bambosh/unofficial-homestuck-collection/blob/main/MODDING.md",
  "https://homestuck.com/story/248": "https://homestuck.com/story/248",
  "https://topatoco.com/collections/mspa": "https://topatoco.com/collections/mspa",
  "https://topatoco.com/collections/mspa/products/mspa-sbahj-sunshine": "https://topatoco.com/collections/mspa/products/mspa-sbahj-sunshine",
  "https://topatoco.com/collections/nedroid": "https://topatoco.com/collections/nedroid",
  "https://topatoco.com/products/mspa-record": "https://topatoco.com/products/mspa-record",
  "https://web.archive.org/web/20100417155738/http://www.mspaintadventures.com/MSPACP/": "https://web.archive.org/web/20100417155738/http://www.mspaintadventures.com/MSPACP/",
  "https://web.archive.org/web/20101215012041/http://www.whatpumpkin.com/store/trollshirts.html": "https://web.archive.org/web/20101215012041/http://www.whatpumpkin.com/store/trollshirts.html",
  "https://www.hopeforhaitinow.org/": "https://www.hopeforhaitinow.org/",
  "https://www.qwantz.com/": "https://www.qwantz.com/",
  "https://www.qwantz.com/index.php?comic=1810": "https://www.qwantz.com/index.php?comic=1810",
  "https://www.youtube.com/watch?v=K3-NZHCnyf4": "https://www.youtube.com/watch?v=K3-NZHCnyf4",
  "images/logo.gif": "assets://images/logo.gif",
  "mailto:whatpumpkin@gmail.com": "mailto:whatpumpkin@gmail.com",
}

const libIsAsset = {
  "/storyfiles/hs2/05260/05260.html": true,
  "/advimgs/jb/mspaintadventure08.gif": true,
  "/archive/collection/archive_beta.png": true,
  "/archive/collection/archive_vigilprince.png": true,
  "/archive/collection/mspa_logo_dark.png": true,
  "/archive/collection/tso_logo.png": true,
  "/archive/music/bannerCrop.png": true,
  "/archive/music/homestuck-vol-5/cover.jpg": true,
  "/archive/namcohigh/bng-logo.png": true,
  "/archive/namcohigh/btn_play.png": true,
  "/archive/namcohigh/text_students_01.png": true,
  "/images/archive_bq.gif": true,
  "/images/header_cascade.gif": true,
  "/images/mspalogo_mspa.png": true,
  "/images/mspalogo_scratch.png": true,
  "/images/news.png": true,
  "/mspa/3": false,
  "/mspa/ryanquest": false,
  "/ryanquest/01.gif": true,
  "/ryanquest/02.gif": true,
  "/storyfiles/hs2/00248retcon.gif": true,
  "/storyfiles/hs2/00249_1.gif": true,
  "/storyfiles/hs2/04106/cascade_segment3.mp3": true,
  "/storyfiles/hs2/04106/cascade_segment4.mp3": true,
  "/storyfiles/hs2/08113johndad.png": true,
  "/storyfiles/hs2/echidna/echidna.swf": true,
  "/storyfiles/hs2/scratch/room112.gif": true,
  "/storyfiles/hs2/Sfiles/06379/06379.swf": true,
  "/storyfiles/mc/00000.gif": true,
  "assets://archive/collection/logo_v2_full.webm": true,
  "assets://archive/collection/news_logo.png": true,
  "assets://archive/namcohigh/game/index2.html": true,
  "assets://storyfiles/hs2/05261.gif": true,
  "assets://storyfiles/hs2/06380.gif": true,
  "assets://storyfiles/hs2/06381_retcon.gif": true,
  "assets://storyfiles/hs2/08113johndad.png": true,
  "http://localhost:8080/": false,
  "http://localhost:8080/archive/external/midnightcrew.mp4": true,
  "http://localhost:8080/archive/external/miracles.mp4": true,
  "http://localhost:8080/archive/external/mspa-record.gif": true,
  "http://localhost:8080/archive/social/news/v2_a_ps.gif": true,
  "http://localhost:8080/archive/social/news/vol5_album_banner.gif": true,
  "http://localhost:8080/blogspot/end-of-problem-sleuth": false,
  "http://localhost:8080/blogspot/soul-money": false,
  "http://localhost:8080/credits/artcredits": false,
  "http://localhost:8080/credits/soundcredits": false,
  "http://localhost:8080/formspring": false,
  "http://localhost:8080/formspring/andrewhussie1158290610": false,
  "http://localhost:8080/help": false,
  "http://localhost:8080/map/6": false,
  "http://localhost:8080/mspa/000110": false,
  "http://localhost:8080/mspa/004478": false,
  "http://localhost:8080/mspa/006715": false,
  "http://localhost:8080/mspa/2": false,
  "http://localhost:8080/mspa/3": false,
  "http://localhost:8080/mspa/5": false,
  "http://localhost:8080/mspa/pony": false,
  "http://localhost:8080/mspa/ryanquest": false,
  "http://localhost:8080/music/album/alternia": false,
  "http://localhost:8080/music/album/homestuck-vol-4": false,
  "http://localhost:8080/music/album/midnight-crew-drawing-dead": false,
  "http://localhost:8080/music/album/squiddles": false,
  "http://localhost:8080/music/track/crystamanthequins": false,
  "http://localhost:8080/news": false,
  "http://localhost:8080/news/1-08-10": false,
  "http://localhost:8080/news/1-14-10": false,
  "http://localhost:8080/news/9-30-10": false,
  "http://localhost:8080/ryanquest": false,
  "http://localhost:8080/ryanquest/9": false,
  "http://localhost:8080/ryanquest/andrewhussie.png": true,
  "http://localhost:8080/sbahj/11": false,
  "http://localhost:8080/sbahj/12": false,
  "http://localhost:8080/sbahj/4": false,
  "http://localhost:8080/scraps2/jessfink_soulportrait.jpg": true,
  "http://localhost:8080/scraps2/knockknock.jpg": true,
  "http://localhost:8080/scraps2/sassacre_original.jpg": true,
  "http://localhost:8080/scraps2/tcafchillin.jpg": true,
  "http://localhost:8080/storyfiles/hs2/scraps/gate1map.jpg": true,
  "http://localhost:8080/sweetbroandhellajeff/movies/SBAHJthemovie1.swf": true,
  "http://localhost:8080/unlock/ps000039": false,
  "http://localhost:8080/waywardvagabond/recordsastutteringstep/": false,
  "http://mspaintadventures.com/scraps2/a6i3map1.gif": true,
  "http://mspaintadventures.com/scraps2/A6I3walkthrough.gif": true,
  "http://www.mspaintadventures.com/storyfiles/hs2/scraps/smuut25.gif": true,
  "http://www.mspaintadventures.com/storyfiles/hs2/scraps/smuut26.gif": true,
  "http://www.mspaintadventures.com/storyfiles/hs2/waywardvagabond/recordsastutteringstep/": false,
  "http://www.mspaintadventures.com/storyfiles/hs2/waywardvagabond/recordsastutteringstep/01.gif": true,
  "images/logo.gif": true,
  "mailto:whatpumpkin@gmail.com": false,
}

const libResolveAssetsProtocol = {
  // "assets://archive/namcohigh/game/index2.html": assets_root + "archive/namcohigh/game/index2.html",
  "assets://storyfiles/hs2/waywardvagabond/recordsastutteringstep/01.gif": assets_root + "storyfiles/hs2/waywardvagabond/recordsastutteringstep/01.gif",
  "assets://archive/external/miracles.mp4": assets_root + "archive/external/miracles.mp4",
  "assets://archive/social/news/alternia_cover.gif": assets_root + "archive/social/news/alternia_cover.gif",
  "assets://archive/social/news/felt_cover.gif": assets_root + "archive/social/news/felt_cover.gif",
  "assets://archive/social/news/icon_clown.gif": assets_root + "archive/social/news/icon_clown.gif",
  "assets://archive/social/news/musiclogo_MC.gif": assets_root + "archive/social/news/musiclogo_MC.gif",
  "assets://archive/social/news/PSbookphoto.gif": assets_root + "archive/social/news/PSbookphoto.gif",
  "assets://archive/social/news/PScover2_thumb.gif": assets_root + "archive/social/news/PScover2_thumb.gif",
  "assets://archive/social/news/recordshirt_banner.gif": assets_root + "archive/social/news/recordshirt_banner.gif",
  "assets://archive/social/news/SBAHJ_shirtthumb1.gif": assets_root + "archive/social/news/SBAHJ_shirtthumb1.gif",
  "assets://archive/social/news/SBAHJ_shirtthumb2.gif": assets_root + "archive/social/news/SBAHJ_shirtthumb2.gif",
  "assets://archive/social/news/sburbwallpaper_sm.jpg": assets_root + "archive/social/news/sburbwallpaper_sm.jpg",
  "assets://archive/social/news/shirts12-13.jpg": assets_root + "archive/social/news/shirts12-13.jpg",
  "assets://archive/social/news/soulportrait_after_th.jpg": assets_root + "archive/social/news/soulportrait_after_th.jpg",
  "assets://archive/social/news/squiddles_cover.gif": assets_root + "archive/social/news/squiddles_cover.gif",
  "assets://archive/social/news/trollshirts_palette.gif": assets_root + "archive/social/news/trollshirts_palette.gif",
  "assets://archive/social/news/v2_a_ps.gif": assets_root + "archive/social/news/v2_a_ps.gif",
  "assets://archive/social/news/vol5_album_banner.gif": assets_root + "archive/social/news/vol5_album_banner.gif",
  "assets://images/logo.gif": assets_root + "images/logo.gif",
  "assets://images/news.png": assets_root + "images/news.png",
  "assets://ryanquest/andrewhussie.png": assets_root + "ryanquest/andrewhussie.png",
  "assets://storyfiles/hs2/05260/05260.html": assets_root + "storyfiles/hs2/05260/05260.html",
  "assets://storyfiles/hs2/scraps/smuut25.gif": assets_root + "storyfiles/hs2/scraps/smuut25.gif",
}


describe('Resources', async () => {

  before(async () => {
    await browser.url('http://localhost:8080')
    // await browser.pause(1000);
  });

  expectMap = async (lib, fn) => {
    for (const query in lib) {
      const expected = lib[query]
      it(`should resolve ${query} as ${expected}`, async () => {
        const result = await browser.execute(fn, query)
        expect(result).toBe(expected)
      });
      // break; // Quick exit
    }
  }

  describe('path resolution', async () => {
    describe('getResourceURL', async () => {
      await expectMap(libGetResourceUrl, query => Resources.getResourceURL(query))
    })
    describe('fileIsAsset', async () => {
      await expectMap(libIsAsset, query => Resources.fileIsAsset(query))
    })
    describe('resolveAssetsProtocol', async () => {
      await expectMap(libResolveAssetsProtocol, query => Resources.resolveAssetsProtocol(query))
    })
  })


  describe('story logic', async () => {
    describe('getStoryNum', async () => {
      await expectMap(libGetStory, (q) => window.vm.$getStoryNum(q))
    })
    describe('getAllPagesInStory', async () => {
      await expectMap(libAllPages, (story) => window.vm.$getAllPagesInStory(story, false).length)
    })
    describe('getAllPagesInStory inclSecret', async () => {
      await expectMap(libAllPagesSec, (story) => window.vm.$getAllPagesInStory(story, true).length)
    })
    describe('vizToMspa', async () => {
      await expectMap(libVizToMspa,
        (t) => {const [b, p] = t.split(" "); return JSON.stringify(window.vm.$vizToMspa(b, p))})
    })
    describe('mspaToViz', async () => {
      await expectMap(libMspaToViz, (p) => JSON.stringify(window.vm.$mspaToViz(p)))
    })
  })

  // describe('Music', async () => {
  //   it(`should have valid music resources`, async () => {
  //     await browser.execute(async () => {
  //       const archive = window.vm.archive

  //       // logger.info("Flash art")
  //       // // from discography.vue
  //       // const flash_urls = Object.keys(archive.music.flashes).map(flash => `assets://archive/music/flash/${flash}.png`)
  //       // logger.info(flash_urls)

  //       // await Promise.all(flash_urls.map(u => fetch(u, {mode: 'no-cors'})))
  //       // logger.info("Done (opaque)")

  //       // logger.info("Album art...")
  //       // from discography.vue
  //       const album_urls = Object.values(archive.music.albums).map(album => `assets://archive/music/${album.directory}/cover.jpg`)
  //       album_urls.push(`assets://archive/music/spoiler.png`)

  //       await Promise.all(album_urls.map(u => fetch(Resources.resolveAssetsProtocol(u), {mode: 'no-cors'})))
  //             // logger.info("Done (opaque)")

  //       // logger.info("Track art...")
  //       // from track.vue
  //       const track_urls = Object.values(archive.music.tracks).map(track => {
  //         const dirName = track.album.find(album => archive.music.albums[album].hasTrackArt) || track.album[0]
  //         const fileName = track.coverArtists && archive.music.albums[dirName].hasTrackArt ? track.directory : 'cover'
  //         return `assets://archive/music/${dirName}/${fileName}.jpg`
  //       })
  //       track_urls.push(`assets://archive/music/spoiler.png`)

  //       await Promise.all([...new Set(track_urls)].map(u => fetch(Resources.resolveAssetsProtocol(u), {mode: 'no-cors'})))
  //     })
  //   })
  // })

  after(async () => {
    // await browser.pause(100000);
  });
  // browser.debug()
});

