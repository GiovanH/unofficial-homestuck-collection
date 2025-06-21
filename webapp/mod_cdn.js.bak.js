let logger;
let store;

const cdn_domain = "https://www.homestuck.com/"

const asset_pack_supplemental_href = 'https://file.garden/YOVpTKX47HhECOuA/AssetPack'

const routes = {
  'assets://archive/tbiy/The%20Baby%20Is%20You%20-%20Complete.mp3': asset_pack_supplemental_href + '/The%20Baby%20Is%20You%20-%20Complete.mp3',
  'assets://archive/external/howdoilive.mp4': asset_pack_supplemental_href + '/external/howdoilive.mp4',
  'assets://archive/external/rufio.mp4': asset_pack_supplemental_href + '/external/rufio.mp4',
  'assets://archive/external/midnightcrew.mp4': asset_pack_supplemental_href + '/external/midnightcrew.mp4',
  'assets://archive/external/bunny.mp4': asset_pack_supplemental_href + '/external/bunny.mp4',
  'assets://archive/wizardyherbert/WH.epub': asset_pack_supplemental_href + '/archive/wizardyherbert/WH.epub',
  'assets://images/trickster_sitegraphics/menu.swf': asset_pack_supplemental_href + '/archive/trickster_menu.swf',
  'assets://extras/PS_titlescreen/PS_titlescreen.swf': asset_pack_supplemental_href + '/PS_titlescreen.swf'
}

function replaceContent(story, key, pat, repl){
  story[key].content = story[key].content.replace(pat, repl)
}

function cdnify(media_url) {
  const assets_url = media_url.replace(/^(assets:\/)?\//, 'assets://')
  if (assets_url.endsWith('.html')) {
    // Don't touch openbound
    return assets_url
  }
  if (assets_url.endsWith('.mp4') && !assets_url.endsWith('08123.mp4')) {
    // Don't touch collide, act 7
    return assets_url
  }
  // if (assets_url.includes('04106')) {
  //   // Don't touch cascade
  //   return assets_url
  // }
  // if (module.exports.routes[assets_url]) {
  //   return module.exports.routes[assets_url]
  // }

  // .replace(/^assets:\/\/storyfiles\/hs2\/scraps\//, cdn_domain + 'images/storyfiles/hs2/scraps/')

  var mapped = media_url
  if (cdn_domain) {
    mapped = media_url
      .replace(/^assets:\/\/storyfiles\/(.+)\/Sfiles\/(.+?)\/\2/, asset_pack_supplemental_href + "/$1/$2/$3")
      .replace(/^assets:\/\/storyfiles\/(.+)\/(.+?)\/\2([0-9a-z_]+)?(\.swf|\.mp4|\.mp3)/, asset_pack_supplemental_href + "/$1/$2/$2$3$4")
      .replace(/^assets:\/\/storyfiles\/hs2\/(06276\/A6A6I1\.swf)/, asset_pack_supplemental_href + "/$1")
      .replace(/^assets:\/\/storyfiles\/(.+(?:\.gif|\.png|\.jpg))/, cdn_domain + 'images/storyfiles/$1')
      .replace(/^assets:\/\/ryanquest\//, cdn_domain + 'images/ryanquest/')
      .replace(/^assets:\/\/advimgs\//, cdn_domain + 'images/advimgs/')
      .replace(/^assets:\/\/scraps\//, cdn_domain + 'images/scraps/')
      .replace(/^assets:\/\/storyfiles\/hs2\/waywardvagabond\//, cdn_domain + 'images/storyfiles/hs2/waywardvagabond/')
  }

  console.assert(!(mapped.includes('.swf') && mapped.includes(cdn_domain)), mapped, media_url)
  // if (media_url == mapped) {
  //   logger.warn("Could not map", media_url)
  // } else {
  //   // module.exports.routes[assets_url] = mapped
  //   if (media_url.includes("Sfiles")) {
  //     // apparently, bambosh stripped this manually
  //     // module.exports.routes[assets_url.replace(/\/Sfiles/, "")] = mapped
  //   }
  // }
  return mapped
}

module.exports = {
  title: "UHC CDN",
  summary: "Pull resources from the internet, instead of using an asset pack",
  author: "GiovanH",
  modVersion: 0.1,

  routes: routes,
  styles: [],

  computed(api) {
    logger = api.logger
    store = api.store
    Resources = api.Resources
  },

  vueHooks: [{
    matchName: "NamcoHigh",
    computed: {
      frameSrc($super){
        return "https://namcohigh.klonoa.org/index2.html"
      }
    }
  }, {
    match: () => true,
    methods: {
      $getResourceURL(url, $super){
        // We actually want to inject *between* getResourceUrl and resolveURL here
        // return cdnify($super(url))

        // get assets:// resource
        const resource_url = Resources.getResourceURL(url)
        // redirect assets:// to live urls when applicable
        const cdned = cdnify(resource_url)
        // resolve to real url
        const resolved = Resources.resolveURL(cdned)
        // logger.debug({resource_url, cdned, resolved})
        return resolved
      }
    }
  }],

  edit(archive) {

    // ['story', 'ryanquest'].forEach(story => {
    //   Object.keys(archive.mspa[story]).forEach(key => {
    //     // archive.mspa[story][key].media.map(cdnify)
    //     archive.mspa[story][key].media = archive.mspa[story][key].media.map(cdnify)
    //   })
    // })

    // let pxs_i = 1
    // function pxsify(media_url) {
    //   mapped = `http://hs.hiveswap.com/paradoxspace/comic_${pxs_i.toString().padStart(3, '0')}.png`
    //   // logger.info(media_url, mapped)
    //   pxs_i += 1
    //   return mapped
    // }
    // Object.keys(archive.comics.pxs.comics).forEach(comic => {
    //   archive.comics.pxs.comics[comic].pages = archive.comics.pxs.comics[comic].pages.map(pxsify)
    // })

    replaceContent(archive.mspa.story, '004718', "<a href=\"/archive/external/miracles.mp4\"", "<a href=\"https://www.youtube.com/watch?v=8GyVx28R9-s\"")

    archive.mspa.story['004692'].media = ['https://mrcheeze.github.io/homestuck-ruffle-tester/flash/02791_local.swf']

    archive.music.albums['homestuck-vol-10'].bonus = [
      // "https://hsmusic.wiki/media/album-additional/homestuck-vol-10/Booklet.pdf",
      "Renewed Return Choral Parts.pdf"
    ]
    archive.music.albums['genesis-frog'].bonus = [
      // https://hsmusic.wiki/album/genesis-frog/
    ]
    archive.music.albums['mobius-trip-and-hadron-kaleido'].bonus = [
      // https://www.youtube.com/watch?v=CUDkBTYWtGk
    ]
    archive.music.albums['squiddles'].bonus = [
      // https://hsmusic.wiki/album/squiddles/
      "squiddlevid.swf"
    ]
  }
}

