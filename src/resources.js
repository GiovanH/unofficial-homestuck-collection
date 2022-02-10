// Rules for transforming intercepted URLS
const path = require('path')
const Mods = require('@/mods.js').default

const log = require('electron-log');
const logger = log.scope('Resources');

// const Memoization = require('@/memoization.js').default

var assets_root = undefined

function linkIsOutlink(url) {
  return /^http(s{0,1}):\/\//.test(url) && !/^http(s{0,1}):\/\/localhost/.test(url) && !/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com/.test(url)
}

// Pure
function fileIsAsset(url) {
  // Given a url, *without considering the domain*, determine if this should
  // route to an asset of some sort. (bool)

  // If this function is false, url is either an internal vue link
  // or an external web page.
  // html files are assets, but don't show up in modals due to logic elsewhere.

  // ...except for these files that are part of the installer.
  const is_bundled = /\/assets\/[^/]+\.[^/]+/.test(url)
  if (is_bundled) return false

  if (linkIsOutlink(url)) return false

  // There used to be some cases where /archive urls were meant to redirect to assets, but those should be fixed in data now.

  const has_file_ext = /\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm|mov|html)$/i.test(url)

  // if you reference an html file in `archive/` that should match too, as a failsafe

  return has_file_ext || /^archive\//i.test(url) || /^\/archive\//i.test(url) // maybe not needed now?
}

// NOT PURE
function resolveURL(url) {
  // The main logic
  let resource_url = getResourceURL(url)
  // logger.debug("Got resource URL", resource_url)

  if (resource_url.startsWith("assets://")) {
    // logger.debug("[resvUrl]", url, "to", resource_url, "to", resolveAssetsProtocol(resource_url))
    resource_url = resolveAssetsProtocol(resource_url) 
  } else {
    // logger.debug("[resvUrl]", "no change for", resource_url)
  }

  return resource_url
}

// Pure(?)
function resolvePath(url, root_dir) {
  // Like resolveURL, but returns an os-path and not a file URL
  let resource_path = getResourceURL(url)

  if (resource_path.startsWith("assets://")) {
    resource_path = path.join(root_dir, resource_path.replace(/^assets:\/\//, ''))
    // logger.debug("[resPath]", url, "to", resource_path)
  } else {
    // logger.debug("[resPath]", "no change for", resource_path)
  }

  return resource_path
}

// Pure
function getResourceURL(request_url){
  // Transforms URLS into logical resource paths, usually assets://
  //
  // Things this might get:
  // *.mspaintadventures
  // arbitrary HTTP urls
  // http://localhost:8080/ or app:// urls
  // http://localhost:{port}/ urls
  // Links from storyPages, like external links, sbahj, tinyurl...
  //
  // Things this should not get:
  // assets://

  // Examples
  // /storyfiles/hs2/00008.gif to assets://storyfiles/hs2/00008.gif
  // /images/mspalogo_mspa.png to assets://images/mspalogo_mspa.png

  let resource_url = request_url

  // Preliminary filtering
  resource_url = resource_url
    .replace(/^app:\/\/\.\//, "/") // app://./archive/ comes up on non-windows platforms, sometimes?
    .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") // Linked from a few flashes
    .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") // Covers for 99% of flashes that link to other pages
    .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") // Covers for story links without page numbers
    .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") // Link from CD rack flash
    .replace(/.*mspaintadventures.com\/sweetbroandhellajeff\/(?:(?:comoc\.php)?\?cid=0(\d{2})\.jpg)?/, "/sbahj/$1") // TODO double-check this regex
    .replace(/^http(s{0,1}):\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
    .replace(/^http(s{0,1}):\/\/www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318`) // return to core - 618heircut.mp3
    .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
    .replace('http://www.whatpumpkin.com/squiddles.htm', '/squiddles/credits')

  if (resource_url != request_url)
    // logger.debug("[getResU prelim]", request_url, "to", resource_url)

  request_url = resource_url

  // If it has a file extension, it should be an asset://
  // If it does not, it is a logical vue page.
  if (fileIsAsset(resource_url)) {
    resource_url = resource_url
      .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com\//, "assets://")
      .replace(/^\//, "assets://")
      .replace(/^\\/, "assets://")
      .replace(/\/Sfiles/, "")
      .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:[0-9]+\//, "assets://")
      .replace(/^http(s{0,1}):\/\/localhost:[0-9]+\//, "assets://")  // TODO if this accidently catches localhost:8080 we're boned
          
    // if (!/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(resource_url))
    //     // files like 'archive/xxx'
    //     resource_url = "assets://" + resource_url
    if (!resource_url.startsWith("assets://"))
      resource_url = resource_url.replace(/^(?=\w)/, "assets://")

    if (resource_url != request_url)
      // logger.debug("[getResU asset]", request_url, "to", resource_url)
    request_url = resource_url
  } else {
    // waywardvagabond has assets in its folder but we redirect some paths to vue
    resource_url = resource_url
      .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com\/storyfiles\/hs2\/waywardvagabond/, "/waywardvagabond")
  
    if (resource_url != request_url) 
      // logger.debug("[getResU nonas]", request_url, "to", resource_url)
    request_url = resource_url
  }
  return resource_url
}

// NOT PURE
function resolveAssetsProtocol(asset_url, loopcheck=[]) {
  // Resolves assets:// urls to real urls on the localhost:{port} server

  // Examples
  // assets://images/candycorn.gif to http://127.0.0.1:21780/images/candycorn.gif

  console.assert(asset_url.startsWith("assets://"), "resources", asset_url)

  const mod_route = Mods.getAssetRoute(asset_url)
  if (mod_route) {
    // logger.debug("[resolvA]", asset_url, "mod to", mod_route)
    if (loopcheck.includes(mod_route)) {
      loopcheck.push(mod_route)
      throw Error("Circular asset path!" + loopcheck)
    } else {
      loopcheck.push(mod_route)
      return resolveAssetsProtocol(mod_route, loopcheck)
    }
  }

  if (assets_root == undefined) {
    logger.error("Asked to resolve assets protocol before resources initialized!", asset_url)
    throw Error("RESOURCES UNINITIALIZED")
  }
  const resource_url = asset_url.replace("assets://", assets_root)

  if (asset_url != resource_url) {
    // logger.debug("[resolvA]", asset_url, "to", resource_url)
  } else {
    // logger.debug("[resolvA]", "no change for", resource_url)
  }
  return resource_url
}

const UrlFilterMixin = {
  methods: {
    filterLinksAndImages(el){
      // dynamic default
      // this.$el can be a comment because fuck me of course it can
      if (!el) { 
        if (this.$el.nodeType === 8) return
        else el = this.$el.querySelector('.pageContent')
      }

      // Check if this is a comment
      if (el.nodeType === 8) return
      
      // else
      el.querySelectorAll("A").forEach((link) => {
        if (link.href) {
          const pseudLinkHref = link.href // link.href.replace(/^http:\/\/localhost:8080\//, '/')
          link.href = getResourceURL(pseudLinkHref)
          if (link.href != pseudLinkHref) {
            logger.debug("[filterL]", pseudLinkHref, "->", link.href)
          }
        }
      })

      // Normally, this process would be handled by the MediaEmbed component. 
      // Gotta get the behaviour into all them images somehow!

      // Internal links in the renderer already have the localhost:8080 prefix, which is different
      // than how the other resources are handled. 
      const media = [...el.getElementsByTagName('IMG'), ...el.getElementsByTagName('VIDEO')]

      for (let i = 0; i < media.length; i++) {
        const pseudMediaSrc = media[i].src // media[i].src.replace(/^http:\/\/localhost:8080\//, '/')
        media[i].src = resolveURL(pseudMediaSrc)
        if (media[i].src != pseudMediaSrc) {
          logger.debug("[filterL]", pseudMediaSrc, "->", media[i].src)
        }

        if (media[i].tagName == 'IMG' && !media[i].ondragstart) {  
          media[i].ondragstart = (e) => {
            e.preventDefault()
            e.dataTransfer.effectAllowed = 'copy'
            const fileStreamPath = this.$mspaFileStream(media[i].src)
            require('electron').ipcRenderer.send('ondragstart', fileStreamPath)
          }
        }
      }
    },
    filterLinksAndImagesInternetArchive(el, best_date=1){
      // dynamic default
      // this.$el can be a comment because fuck me of course it can
      if (!el) { 
        if (this.$el.nodeType === 8) return
        else el = this.$el.querySelector('.pageContent')
      }

      // Check if this is a comment
      if (el.nodeType === 8) return
      
      // else
      el.querySelectorAll("a[href]").forEach((link) => {
        const input_href = link.href
        if (linkIsOutlink(link.href) && !/web\.archive\.org/.test(link.href)) {
          link.href = `https://web.archive.org/web/${best_date}/` + link.href
          this.$logger.debug(input_href, "->", link.href)
        }
      })
    }
  }
}

function getChapter(key) {
  // Just putting this here because both processes need this logic.
  let p = parseInt(key)
  if (!p) {
    switch (key) {
      case 'jb2_000000': return 'Jailbreak'
      case 'MC00001': return 'Blood Spade'
      case 'pony': return 'Homestuck Act 3'
      case 'darkcage': return 'Homestuck Act 6 Intermission 1'
      case 'pony2': return 'Homestuck Act 2'
      case 'darkcage2': return 'Homestuck Act 6 Act 3'
    }
  }
  else if (p <= 135 && p >= 1) return 'Jailbreak'
  else if (p <= 218 && p >= 136) return 'Bard Quest'
  else if (p <= 1892 && p >= 219) {
    let c = 'Problem Sleuth '
    if (p >= 1841) c += "Epilogue"
    else if (p >= 1708) c += "Chapter 22"
    else if (p >= 1655) c += "Chapter 21"
    else if (p >= 1589) c += "Chapter 20"
    else if (p >= 1507) c += "Chapter 19"
    else if (p >= 1466) c += "Chapter 18"
    else if (p >= 1406) c += "Chapter 17"
    else if (p >= 1299) c += "Chapter 16"
    else if (p >= 1257) c += "Chapter 15"
    else if (p >= 1149) c += "Chapter 14"
    else if (p >= 1069) c += "Chapter 13"
    else if (p >= 1030) c += "Chapter 12"
    else if (p >= 953) c += "Chapter 11"
    else if (p >= 873) c += "Chapter 10"
    else if (p >= 816) c += "Chapter 9"
    else if (p >= 742) c += "Chapter 8"
    else if (p >= 666) c += "Chapter 7"
    else if (p >= 604) c += "Chapter 6"
    else if (p >= 546) c += "Chapter 5"
    else if (p >= 448) c += "Chapter 4"
    else if (p >= 402) c += "Chapter 3"
    else if (p >= 302) c += "Chapter 2"
    else if (p >= 219) c += "Chapter 1"
    return c
  }
  else if (p <= 1900 && p >= 1893) return 'Homestuck Beta'
  else if (p >= 1901) {
    let c = 'Homestuck '
    if (p >= 10027) c += "Act 7"
    else if (p >= 9987) c += "Act 6 Act 6 Act 6"
    else if (p >= 9349) c += "Act 6 Act 6 Intermission 5"
    else if (p >= 9309) c += "Act 6 Act 6 Act 5"
    else if (p >= 8844) c += "Act 6 Act 6 Intermission 4"
    else if (p >= 8821) c += "Act 6 Act 6 Act 4"
    else if (p >= 8801) c += "Act 6 Act 6 Intermission 3"
    else if (p >= 8753) c += "Act 6 Act 6 Act 3"
    else if (p >= 8431) c += "Act 6 Act 6 Intermission 2"
    else if (p >= 8375) c += "Act 6 Act 6 Act 2"
    else if (p >= 8178) c += "Act 6 Act 6 Intermission 1"
    else if (p >= 8143) c += "Act 6 Act 6 Act 1"
    else if (p >= 8092) c += "Act 6 Intermission 5 Intermission 6"
    else if (p >= 8012) c += "Act 6 Intermission 5"
    else if (p >= 8011) c += "Act 6 Intermission 5 Intermission 5"
    else if (p >= 7965) c += "Act 6 Intermission 5 Intermission 4"
    else if (p >= 7922) c += "Act 6 Intermission 5 Intermission 3"
    else if (p >= 7882) c += "Act 6 Intermission 5"
    else if (p >= 7881) c += "Act 6 Intermission 5 Interfishin"
    else if (p >= 7866) c += "Act 6 Intermission 5"
    else if (p >= 7847) c += "Act 6 Intermission 5"
    else if (p >= 7846) c += "Act 6 Intermission 5 Intermission 2"
    else if (p >= 7840) c += "Act 6 Intermission 5"
    else if (p >= 7839) c += "Act 6 Intermission 5 Intermission 1"
    else if (p >= 7823) c += "Act 6 Intermission 5"
    else if (p >= 7688) c += "Act 6 Act 5 Act 1 x2 Combo"
    else if (p >= 7678) c += "Act 6 Act 5 Act 1"
    else if (p >= 7614) c += "Act 6 Act 5 Act 2"
    else if (p >= 7412) c += "Act 6 Act 5 Act 1"
    else if (p >= 7341) c += "Act 6 Intermission 4"
    else if (p >= 7338) c += "Act 6 Act 4"
    else if (p >= 7163) c += "Act 6 Intermission 3"
    else if (p >= 6720) c += "Act 6 Act 3"
    else if (p >= 6567) c += "Act 6 Intermission 2"
    else if (p >= 6320) c += "Act 6 Act 2"
    else if (p >= 6195) c += "Act 6 Intermission 1"
    else if (p >= 6013) c += "Act 6 Act 1"
    else if (p >= 6011) c += "Intermission 2"
    else if (p >= 4526) c += "Act 5 Act 2"
    else if (p >= 3889) c += "Act 5 Act 1"
    else if (p >= 3258) c += "Act 4"
    else if (p >= 3054) c += "Intermission"
    else if (p >= 2660) c += "Act 3"
    else if (p >= 2149) c += "Act 2"
    else c += "Act 1"
    return c
  }
}

function testResources(){
  const libGetResourceUrl = {
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
    "http://www.whatpumpkin.com/squiddles.html": "http://www.whatpumpkin.com/squiddles.html",
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

  ;[
    {
      fun: getResourceURL,
      library: libGetResourceUrl,
      name: 'getResourceURL'
    },
    {
      fun: fileIsAsset,
      library: libIsAsset,
      name: 'fileIsAsset'
    },
    {
      fun: resolveAssetsProtocol,
      library: libResolveAssetsProtocol,
      name: 'resolveAssetsProtocol'
    }
  ].forEach(kind => {
    let [ok, fail] = [0, 0]
    for (const query in kind.library) {
      const expected = kind.library[query]
      const result = kind.fun(query)
      if (result != expected) {
        logger.error(`Testing ${kind.name}: Assertion failed!\nQuery:    ${query}\nExpected: ${expected}\nActual:   ${result}`)
        fail += 1
      } else {
        ok += 1
      }
    }
    logger.info(kind.name, "tests:", fail, "fail,", ok, "ok")
  })
}

module.exports = {
  init(settings){
    assets_root = settings.assets_root || assets_root
    logger.info("Resources initialized to", assets_root)
  },
  isReady(){
    return assets_root !== undefined
  },
  UrlFilterMixin,
  resolveURL,
  resolvePath,
  getResourceURL,
  getChapter,
  resolveAssetsProtocol,
  testResources,
  linkIsOutlink
}
