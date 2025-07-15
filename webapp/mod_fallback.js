let logger = console

const asset_pack_supplemental_href = 'https://file.garden/YOVpTKX47HhECOuA/AssetPack'

const fallback_final = {}
const fallback_known = {
  'assets://archive/tbiy/The%20Baby%20Is%20You%20-%20Complete.mp3': [asset_pack_supplemental_href + '/The%20Baby%20Is%20You%20-%20Complete.mp3'],
  'assets://archive/external/howdoilive.mp4': [asset_pack_supplemental_href + '/external/howdoilive.mp4'],
  'assets://archive/external/rufio.mp4': [asset_pack_supplemental_href + '/external/rufio.mp4'],
  'assets://archive/external/midnightcrew.mp4': [asset_pack_supplemental_href + '/external/midnightcrew.mp4'],
  'assets://archive/external/bunny.mp4': [asset_pack_supplemental_href + '/external/bunny.mp4'],
  'assets://archive/wizardyherbert/WH.epub': [asset_pack_supplemental_href + '/archive/wizardyherbert/WH.epub'],
  'assets://images/trickster_sitegraphics/menu.swf': [asset_pack_supplemental_href + '/archive/trickster_menu.swf'],
  'assets://extras/PS_titlescreen/PS_titlescreen.swf': [asset_pack_supplemental_href + '/PS_titlescreen.swf']
}

function tryMapAndReplace(src, pattern, replacement) {
  if (pattern.exec(src)) {
    return src.replace(pattern, replacement)
  } else {
    return undefined
  }
}

function mapToSupplemental(media_url) {
  const u = new URL(media_url)

  let ret
  
  ret = tryMapAndReplace(u.pathname, 
    /^(?:.*AssetPackV2Lite)\/storyfiles\/(.+)\/Sfiles\/(.+?)\/\2/, 
    asset_pack_supplemental_href + "/$1/$2/$3")
  if (ret) return ret

  ret = tryMapAndReplace(u.pathname, 
    /^(?:.*AssetPackV2Lite)\/storyfiles\/(.+)\/(.+?)\/\2([0-9a-z_]+)?(\.swf|\.mp4|\.mp3)/, 
    asset_pack_supplemental_href + "/$1/$2/$2$3$4")
  if (ret) return ret

  ret = tryMapAndReplace(u.pathname, 
    /^(?:.*AssetPackV2Lite)\/storyfiles\/hs2\/(06276\/A6A6I1\.swf)/, 
    asset_pack_supplemental_href + "/$1")
  if (ret) return ret
}
function mapToVizCanonical(cdn_domain, media_url) {
  const u = new URL(media_url)

  let ret

  ret = tryMapAndReplace(u.pathname, 
    /^(?:.*AssetPackV2Lite)\/storyfiles\/(.+(?:\.gif|\.png|\.jpg))/, '/images/storyfiles/$1')
  if (ret) return cdn_domain + ret.slice(1)
  ret = tryMapAndReplace(u.pathname, 
/^(?:.*AssetPackV2Lite)\/ryanquest\//, '/images/ryanquest/')
  if (ret) return cdn_domain + ret.slice(1)
  ret = tryMapAndReplace(u.pathname, 
/^(?:.*AssetPackV2Lite)\/advimgs\//, '/images/advimgs/')
  if (ret) return cdn_domain + ret.slice(1)
  ret = tryMapAndReplace(u.pathname, 
/^(?:.*AssetPackV2Lite)\/scraps\//, '/images/scraps/')
  if (ret) return cdn_domain + ret.slice(1)
  ret = tryMapAndReplace(u.pathname, 
/^(?:.*AssetPackV2Lite)\/storyfiles\/hs2\/waywardvagabond\//, '/images/storyfiles/hs2/waywardvagabond/')
  if (ret) return cdn_domain + ret.slice(1)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function fallbacksFor(src_orig) {
  if (fallback_final[src_orig]) return fallback_final[src_orig]

  var ret = fallback_known[src_orig] || []

  // Two kinds of fallbacks: ones matching viz domain and ones matching
  // the fallback asset server
  const supplemental_src = mapToSupplemental(src_orig)

  if (supplemental_src) {
    ret.push(supplemental_src)
  } else {
    ret.push(mapToVizCanonical("https://www.homestuck.com/", src_orig))
    ret.push(mapToVizCanonical("https://mspaintadventures.com/", src_orig))
    ret.push(mapToVizCanonical("https://file.garden/ZMykmy0EPHK4dlCG/", src_orig))
    ret.push(mapToVizCanonical("https://homestuck.kici.moe/", src_orig))
    ret.push(mapToVizCanonical("https://mspa.chadthundercock.com/", src_orig).replace("/images/", "/mspa/"))
  }

  ret = [...new Set(ret)]
  shuffle(ret)

  ret = [...ret, ...ret.map(m => 'https://web.archive.org/web/0im_/' + m)]
  ret.push('https://web.archive.org/web/0im_/' + src_orig)

  fallback_final[src_orig] = ret
  return ret
}

function fallbackFor(src_orig, error) {
  const src_tried = error.target.src
  const my_list = fallbacksFor(src_orig)
  const next_index = my_list.indexOf(src_tried) + 1

  // TODO: try next item on list
  if (next_index < my_list.length) {
    return my_list[next_index]
  } else {
    logger.error("No next fallback image for", src_orig, my_list)
    return undefined
  }
}

function attachErrorHandler(img) {
  // Avoid duplicate handlers
  if (img.dataset.errorHandlerAttached) return;
  
  img.dataset.src_orig = img.src
  img.addEventListener('error', function(error) {
    logger.warn("Failed to load src, trying to fallback", img.dataset.src_orig)
    
    if (!img.dataset.resolveCheckAttached) {
      img.dataset.resolveCheckAttached = 'true'
      img.addEventListener('load', (event) => {
        // Unfortunately we still need to wait for onerror, but
        // jump directly to this next time
        fallback_final[img.dataset.src_orig] = [event.target.src]
      });
    }

    const my_fallback = fallbackFor(img.dataset.src_orig, error)
    if (my_fallback) {
      img.src = my_fallback
      logger.warn("Set img to fallback", img.dataset.src_orig, my_fallback)
    } else {
      logger.error("No next fallback image for", img.dataset.src_orig)
    }
  })
  img.addEventListener('error', function(error) {
    logger.warn("Failed to load src, trying to fallback", img.dataset.src_orig)
    
    const my_fallback = fallbackFor(img.dataset.src_orig, error)
    if (my_fallback) {
      img.src = my_fallback
      logger.warn("Set img to fallback", img.dataset.src_orig, my_fallback)
    } else {
      logger.error("No next fallback image for", img.dataset.src_orig)
    }
  })
  
  img.dataset.errorHandlerAttached = 'true';
}

// Watch for new images
const fallbackObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if the added node is an img
        if (node.tagName === 'IMG') {
          attachErrorHandler(node);
        }
        
        // Check for img tags within the added node
        const images = node.querySelectorAll && node.querySelectorAll('img');
        if (images) {
          images.forEach(attachErrorHandler);
        }
      }
    });
  });
});

module.exports = {
  title: "Fallbacks", 
  summary: "If images fail, try to load them from other sources",
  author: "GiovanH",
  modVersion: 0.1,

  computed(_api) { logger = _api.logger },

  vueHooks: [{
    matchName: "HomestuckCollection",
    mounted() {
      fallbackObserver.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  }]
}
