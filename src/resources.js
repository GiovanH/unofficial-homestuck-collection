// Rules for transforming intercepted URLS

// isWebApp for main-process electron execution
const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false
const path = (isWebApp ? require('path-browserify') : require('path'))

var logger
if (!isWebApp) {
  try {
    const log = require('electron-log')
    logger = log.scope('Resources')
  } catch (err) {
    // console.warn(err)
    logger = console
  }
} else {
  logger = console
}

// ====================================
// Asset resolution

var assets_root = undefined

const app_domain = ((typeof window !== 'undefined') ? window.location.host : "localhost:8080")
const RE_THIS_DOMAIN = new RegExp(`https?://${app_domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`)

function linkIsOutlink(url) {
  return (/^http(s{0,1}):\/\//.test(url) &&
    !/^http(s{0,1}):\/\/localhost/.test(url) &&
    !RE_THIS_DOMAIN.test(url) &&
    !/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com/.test(url))
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
  // The main logic. Takes an unsanitized input url (that may be from old data) and
  // resolves it to... whatever real http* url is appropriate. Resolves the assets protocol.
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
function toFilePath(url, root_dir) {
  // Takes an unsanitized like resolveURL, but returns an os-path and not a file URL
  let resource_path = getResourceURL(url)

  if (resource_path.startsWith("assets://")) {
    resource_path = path.join(root_dir, resource_path.replace(/^assets:\/\//, ''))
    // logger.debug("[resPath]", url, "to", resource_path)
  } else if (resource_path.startsWith(assets_root)) {
    resource_path = path.join(root_dir, resource_path.replace(assets_root, ''))
    // logger.debug("[resPath]", url, "to", resource_path)
  } else {
    // logger.debug("[resPath]", "no change for", resource_path)
  }

  return decodeURI(resource_path)
}

// Pure
function getResourceURL(request_url){
  // Transforms external URLS into logical resource paths, usually assets://
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

  if (/\.[0-9a-f]{8}\..{3,4}$/.exec(request_url)) {
    logger.error("URL", request_url, "is webpacked! Replacing would break it. This probably means you're running getResourceURL somewhere you shouldn't!")
    return request_url // webpacked
  }

  // Preliminary filtering
  resource_url = resource_url
    .replace(/^app:\/\/\.\//, "/") // app://./archive/ comes up on non-windows platforms, sometimes?
    .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") // Linked from a few flashes
    .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") // Covers for 99% of flashes that link to other pages
    .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") // Covers for story links without page numbers
    .replace(/.*mspaintadventures.com\/extras\/(.+?)\.html/, "/unlock/$1") // Links to unlock pages
    .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") // Link from CD rack flash
    .replace(/.*mspaintadventures.com\/sweetbroandhellajeff\/(?:(?:comoc\.php)?\?cid=0(\d{2})\.jpg)?/, "/sbahj/$1")
    .replace(/^http(s{0,1}):\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
    .replace(/^http(s{0,1}):\/\/www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318`) // return to core - 618heircut.mp3
    .replace(/^http(s{0,1}):\/\/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
    .replace(/^http(s{0,1}):\/\/www.whatpumpkin\.com\/squiddles\.htm(l)?/, '/squiddles/credits')
    .replace(/^http(s{0,1}):\/\/asset\.uhc\//, 'assets://')

  // if (resource_url != request_url)
  //   logger.debug("[getResU prelim]", request_url, "to", resource_url)

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

    // if (resource_url != request_url)
    //   logger.debug("[getResU asset]", request_url, "to", resource_url)

    request_url = resource_url
  } else {
    // waywardvagabond has assets in its folder but we redirect some paths to vue
    resource_url = resource_url
      .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com\/storyfiles\/hs2\/waywardvagabond/, "/waywardvagabond")

    // if (resource_url != request_url)
    //   logger.debug("[getResU nonas]", request_url, "to", resource_url)

    request_url = resource_url
  }
  return resource_url
}

// NOT PURE
function resolveAssetsProtocol(asset_url, loopcheck=[]) {
  // Resolves assets:// urls to real urls on the asset server, usually localhost:{random}

  // Examples
  // assets://images/candycorn.gif to http://127.0.0.1:21780/images/candycorn.gif

  console.assert(asset_url.startsWith("assets://"), "resources", asset_url + " is not on the assets protocol!")

  const Mods = require('@/mods.js').default
  if (Mods) {
    const mod_route = Mods.getAssetRoute(asset_url)
    if (mod_route) {
      // logger.debug("[resolvA]", asset_url, "mod to", mod_route)
      if (loopcheck.includes(mod_route)) {
        loopcheck.push(mod_route)
        console.error("Circular asset path!", loopcheck)
        throw Error("Circular asset path!" + loopcheck)
      } else {
        loopcheck.push(mod_route)
        // mod_route may no longer be an assets:// url, perform full resolve
        return resolveURL(mod_route)
      }
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
      const ipcRenderer = require('IpcRenderer')

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
          const pseudLinkHref = link.href.replace(RE_THIS_DOMAIN, '/')
          link.href = this.$getResourceURL(pseudLinkHref) // Resolved in onLinkClick
          // if (link.href != pseudLinkHref) {
          //   logger.debug("[filterL]", pseudLinkHref, "->", link.href)
          // }
        }
      })

      // Normally, this process would be handled by the MediaEmbed component.
      // Gotta get the behaviour into all them images somehow!

      // Internal links in the renderer already have the localhost:8080 prefix, which is different
      // than how the other resources are handled.
      const media = [...el.getElementsByTagName('IMG'), ...el.getElementsByTagName('VIDEO'), ...el.getElementsByTagName('AUDIO')]

      for (let i = 0; i < media.length; i++) {
        const pseudMediaSrc = media[i].src.replace(RE_THIS_DOMAIN, '/')
        // Need to use overwritable getResourceURL here to route before strict resolution
        media[i].src = resolveURL(this.$getResourceURL(pseudMediaSrc))
        // if (media[i].src != pseudMediaSrc) {
        //   logger.debug("[filterL]", pseudMediaSrc, "->", media[i].src)
        // }

        if (!isWebApp && media[i].tagName == 'IMG' && !media[i].ondragstart) {
          media[i].ondragstart = (e) => {
            e.dataTransfer.effectAllowed = 'copy'
            const fileStreamPath = this.$mspaFileStream(media[i].src)
            ipcRenderer.send('ondragstart', fileStreamPath)
            e.preventDefault()
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

// ====================================
// Story logic

const all_stories = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  'ryanquest',
  'snaps'
]

function getStoryNum(pageNumber) {
  // Given a MSPA page number, determine the numerical story ID it is associated with.
  pageNumber = parseInt(pageNumber) || pageNumber

  // JAILBREAK
  if (pageNumber <= 135 || pageNumber == "jb2_000000")
    return 1
  // BARD QUEST
  else if (pageNumber >= 136 && pageNumber <= 216)
    return 2
  // BLOOD SPADE
  else if (pageNumber == "mc0001")
    return 3
  // PROBLEM SLEUTH
  else if (pageNumber >= 219 && pageNumber <= 1892)
    return 4
  // HOMESTUCK BETA
  else if (pageNumber >= 1893 && pageNumber <= 1900)
    return 5
  // HOMESTUCK
  else if ((pageNumber >= 1901 && pageNumber <= 10030) || 
    (pageNumber == "pony" || pageNumber == "pony2" || 
    pageNumber == "darkcage" || pageNumber == "darkcage2"))
    return 6

  return undefined
}

function getAllPagesInStory(story_id, incl_secret=false) {
  const page_nums = []
  if (story_id == '1'){
    for (let i = 2; i <= 6; i++) page_nums.push(i.pad(6))
    for (let i = 8; i <= 135; i++) page_nums.push(i.pad(6))
    page_nums.push("jb2_000000")
  } else if (story_id == '2'){
    page_nums.push(Number(136).pad(6))
    for (let i = 171; i <= 216; i++) page_nums.push(i.pad(6))
  } else if (story_id == '3'){
    page_nums.push("mc0001")
  } else if (story_id == '4'){
    for (let i = 219; i <= 991; i++) page_nums.push(i.pad(6))
    for (let i = 993; i <= 1892; i++) page_nums.push(i.pad(6))
  } else if (story_id == '5'){
    for (let i = 1893; i <= 1900; i++) page_nums.push(i.pad(6))
  } else if (story_id == '6'){
    for (let i = 1901; i <= 4298; i++) page_nums.push(i.pad(6))
    for (let i = 4300; i <= 4937; i++) page_nums.push(i.pad(6))
    for (let i = 4939; i <= 4987; i++) page_nums.push(i.pad(6))
    for (let i = 4989; i <= 9801; i++) page_nums.push(i.pad(6))
    for (let i = 9805; i <= 10030; i++) page_nums.push(i.pad(6))
    if (incl_secret) {
      page_nums.push("darkcage")
      page_nums.push("darkcage2")
      page_nums.push("pony")
      page_nums.push("pony2")
    }
  } else if (story_id == 'ryanquest'){
    for (let i = 1; i <= 15; i++) page_nums.push(i.pad(6))
  }

  if (story_id == 'snaps') {
    for (let i = 1; i <= 64; i++) page_nums.push(String(i))
  }
  return page_nums
}

function vizToMspa(vizStory, vizPage) {
  let mspaPage
  const vizNum = (!isNaN(vizPage) ? parseInt(vizPage) : undefined)
  const undef_page = {s: undefined, p: undefined}

  switch (vizStory) {
    case 'jailbreak':
      mspaPage = (vizNum == 135) ? 'jb2_000000' : (vizNum + 1).pad(6)
      if (1 > vizNum || vizNum > 135) return undef_page
      break
    case 'bard-quest':
      mspaPage = (vizNum == 1) ? "000136" : (vizNum + 169).pad(6)
      if (1 > vizNum || vizNum > 47) return undef_page
      break
    case 'blood-spade':
      if (vizNum == 1) mspaPage = "mc0001"
      else return undef_page
      break
    case 'problem-sleuth':
      mspaPage = (vizNum + 218).pad(6)
      if (1 > vizNum || vizNum > 1674) return undef_page
      break
    case 'beta':
      mspaPage = (vizNum + 1892).pad(6)
      if (1 > vizNum || vizNum > 8) return undef_page
      break
    case 'homestuck':
      mspaPage = vizNum ? (vizNum + 1900).pad(6) : vizPage
      if (1 > vizNum || vizNum > 8130) return undef_page
      break
    case 'ryanquest':
      mspaPage = vizNum.pad(6)
      if (1 > vizNum || vizNum > 15) return undef_page
      break
  }

  const storyNum = (vizStory == 'ryanquest' ? 'ryanquest' : getStoryNum(mspaPage))
  if (!storyNum) {
    logger.error(`Page not in any story: ${mspaPage}`)
    return undef_page
  }

  return {s: storyNum, p: mspaPage}
  // return (storyNum && mspaPage) ? {s: storyNum, p: mspaPage} : undef_page
}

function mspaToViz(mspaInput, isRyanquest = false) {
  const mspaPage = isNaN(mspaInput) ? mspaInput : mspaInput.padStart(6, '0')
  const mspaStory = (isRyanquest ? 'ryanquest' : getStoryNum(mspaPage))
  let vizStory, vizPage

  if (isRyanquest) {
    return {s: 'ryanquest', p: parseInt(mspaPage).toString() }
  } else {
    switch (mspaStory) {
      case 1:
        vizStory = "jailbreak"
        vizPage = (mspaPage == 'jb2_000000') ? '135' : (parseInt(mspaPage) - 1).toString()
        break
      case 2:
        vizStory = "bard-quest"
        if (parseInt(mspaPage) == 136) vizPage = "1"
        else vizPage = (parseInt(mspaPage) - 169).toString()
        break
      case 3:
        vizStory = "blood-spade"
        vizPage = "1"
        break
      case 4:
        vizStory = "problem-sleuth"
        vizPage = (parseInt(mspaPage) - 218).toString()
        break
      case 5:
        vizStory = "beta"
        vizPage = (parseInt(mspaPage) - 1892).toString()
        break
      case 6:
        vizStory = "homestuck"
        vizPage = isNaN(mspaPage) ? mspaPage : (parseInt(mspaPage) - 1900).toString()
        break
    }
    return (vizStory && vizPage) ? {s: vizStory, p: vizPage} : undefined
  }
}

function isVizBase(base){
  return ['jailbreak', 'bard-quest', 'blood-spade', 'problem-sleuth', 'beta', 'homestuck'].includes(base)
}

// Pure
function getChapter(key) {
  // Given an MSPA page number, return what section of the comic the page is in,
  // including chapter/act information.
  const p = parseInt(key)
  if (!p) {
    switch (key) {
      case 'jb2_000000': return 'Jailbreak'
      case 'MC00001': return 'Blood Spade'
      case 'pony': return 'Homestuck Act 3'
      case 'darkcage': return 'Homestuck Act 6 Intermission 1'
      case 'pony2': return 'Homestuck Act 2'
      case 'darkcage2': return 'Homestuck Act 6 Act 3'
    }
  } else if (p <= 135 && p >= 1) return 'Jailbreak'
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
  } else if (p <= 1900 && p >= 1893) return 'Homestuck Beta'
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

// ====================================
// Export

module.exports = {
  init(settings){
    assets_root = settings.assets_root || assets_root
    logger.info("Resources initialized to", assets_root)

    const ipcRenderer = require('IpcRenderer')
    ipcRenderer.on('RESOURCES_RESOLVE_ASSETS_PROTOCOL', (event, reply_channel, url) => {
      event.sender.send(reply_channel, resolveAssetsProtocol(url))
    })
    ipcRenderer.on('RESOURCES_RESOLVE_URL', (event, reply_channel, url) => {
      if (url) event.sender.send(reply_channel, resolveURL(url))
      else return url
    })
  },
  isReady(){
    return assets_root !== undefined
  },
  all_stories,

  UrlFilterMixin,
  resolveURL,
  toFilePath,
  getResourceURL,
  linkIsOutlink,
  resolveAssetsProtocol,

  getChapter,
  getStoryNum,
  getAllPagesInStory,
  isVizBase,
  vizToMspa,
  mspaToViz,

  fileIsAsset // for test suite only
}
