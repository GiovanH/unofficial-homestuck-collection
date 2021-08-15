// Rules for transforming intercepted URLS
const path = require('path')
const Mods = require('@/mods.js').default

const log = require('electron-log');
const logger = log.scope('Resources');

// const Memoization = require('@/memoization.js').default

var assets_root = undefined

// Pure
function fileIsAsset(url) {
  // Given a url, *without considering the domain*, determine if this should
  // route to an asset of some sort. (bool)

  // If this function is false, url is either an internal vue link
  // or an external web page.

  // ...except for these files that are part of the installer.
  const is_bundled = /\/assets\/[^/]+\.[^/]+/.test(url)
  if (is_bundled) return false

  // There used to be some cases where /archive urls were meant to redirect to assets, but those should be fixed in data now.

  const has_file_ext = /\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm|mov|html)$/i.test(url)

  // if you reference an html file in `archive/` that should match too, as a failsafe

  return has_file_ext || /^archive\//i.test(url) || /^\/archive\//i.test(url) // maybe not needed now?
}

// NOT PURE
function resolveURL(url) {
  // The main logic
  let resource_url = getResourceURL(url)
  logger.debug("Got resource URL", resource_url)

  if (resource_url.startsWith("assets://")) {
    logger.debug("[resvUrl]", url, "to", resource_url, "to", resolveAssetsProtocol(resource_url))
    resource_url = resolveAssetsProtocol(resource_url) 
  } else {
    logger.debug("[resvUrl]", "no change for", resource_url)
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
  //
  // Things this should not get:
  // assets://

  // Examples
  // /storyfiles/hs2/00008.gif to assets://storyfiles/hs2/00008.gif
  // /images/mspalogo_mspa.png to assets://images/mspalogo_mspa.png

  let resource_url = request_url
  //     .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:8080\//, "app://") 
  //     .replace(/^http(s{0,1}):\/\/localhost:8080\//, "app://") 

  // Preliminary filtering
  resource_url = resource_url
    .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") // Linked from a few flashes
    .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") // Covers for 99% of flashes that link to other pages
    .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") // Covers for story links without page numbers
    .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") // Link from CD rack flash
    .replace(/.*mspaintadventures.com\/sweetbroandhellajeff\/(?:comoc\.php)?\?cid=0(\d{2})\.jpg/, "/sbahj/$1") // TODO double-check this regex
    .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com/, "assets://") // Complete, should ideally never happen and probably won't work properly if it does

    .replace(/^http(s{0,1}):\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
    .replace(/^http(s{0,1}):\/\/www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318`) // return to core - 618heircut.mp3
    .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
  
  // If it has a file extension, it should be an asset://
  // If it does not, it is a logical vue page.
  if (fileIsAsset(resource_url)) {
    resource_url = resource_url
      .replace(/^\//, "assets://")
      .replace(/^\\/, "assets://")
      .replace(/\/Sfiles/, "")
      .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:[0-9]+\//, "assets://")
      .replace(/^http(s{0,1}):\/\/localhost:[0-9]+\//, "assets://")  // TODO if this accidently catches localhost:8080 we're boned
          
    // if (!/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(resource_url))
    //     // files like 'archive/xxx'
    //     resource_url = "assets://" + resource_url
    if (!resource_url.startsWith("assets://")) {
      resource_url = resource_url.replace(/^(?=\w)/, "assets://")
    }
  }

  // if (resource_url != request_url) {
  //   logger.debug("[getResU]", request_url, "to", resource_url)
  // } else {
  //   logger.debug("[getResU]", "no change for", request_url, fileIsAsset(resource_url))
  // }
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
    logger.debug("[resolvA]", asset_url, "mod to", mod_route)
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
    logger.debug("[resolvA]", "no change for", resource_url)
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
      document.querySelectorAll("A").forEach((link) => {
        if (link.href) {
          const pseudLinkHref = link.href // link.href.replace(/^http:\/\/localhost:8080\//, '/')
          logger.debug("[filterL]", "looking up", pseudLinkHref)
          link.href = getResourceURL(pseudLinkHref)
        }
      })

      // Normally, this process would be handled by the MediaEmbed component. 
      // Gotta get the behaviour into all them images somehow!

      // Internal links in the renderer already have the localhost:8080 prefix, which is different
      // than how the other resources are handled. 
      const media = [...el.getElementsByTagName('IMG'), ...el.getElementsByTagName('VIDEO')]

      for (let i = 0; i < media.length; i++) {
        const pseudMediaSrc = media[i].src // media[i].src.replace(/^http:\/\/localhost:8080\//, '/')
        logger.debug("[fltrSrc]", "looking up", pseudMediaSrc)
        media[i].src = resolveURL(pseudMediaSrc)

        if (media[i].tagName == 'IMG') {  
          media[i].ondragstart = (e) => {
            e.preventDefault()
            e.dataTransfer.effectAllowed = 'copy'
            const fileStreamPath = this.$mspaFileStream(media[i].src)
            require('electron').ipcRenderer.send('ondragstart', fileStreamPath)
          }
        }
      }
    }
  }
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
  resolveAssetsProtocol
}
