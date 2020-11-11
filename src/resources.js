//Rules for transforming intercepted URLS

var assets_root

function resolveURL(url) {
    // TODO URL handling
    let resource_url = getResourceURL(url)

    if (resource_url.startsWith("assets://")) {
        // console.log("[Resource]", "[convAll]", url, "to", resource_url)
        resource_url = resolveAssetsProtocol(resource_url, assets_root) 
    } else {
        // console.log("[Resource]", "[convAll]", "no change for", resource_url)
    }

    return resource_url
}

function getResourceURL(request_url){
    // Transforms URLS into logical resource paths, usually assets://
    //
    // Things this might get:
    // *.mspaintadventures
    // arbitrary HTTP urls
    // http://localhost urls
    //
    // Things this should not get:
    // assets://

    let resource_url = request_url
        .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") //Linked from a few flashes
        .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") //Covers for 99% of flashes that link to other pages
        .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") //Covers for story links without page numbers
        .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") //Link from CD rack flash
        
        .replace(/^http(s{0,1}):\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
        .replace(/^http(s{0,1}):\/\/www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318` ) // return to core - 618heircut.mp3
        .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
        
        // .replace(/^http(s{0,1}):\/\/localhost:[0-9]+\//, "assets://") // same as app://
        .replace(/^\//, "assets://")
        .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:[0-9]+\//, "assets://")

        .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com/, "assets://") //Complete, should ideally never happen and probably won't work properly if it does
    
    if (resource_url != request_url) {
        console.log("[Resource]", "[getResU]", request_url, "to", resource_url)
    } else {
        console.log("[Resource]", "[getResU]", "no change for", request_url)
    }
    return resource_url
}

function resolveAssetsProtocol(assets_url, asset_root) {
    // Finally, redirect mspa:// to local mspa    
    // let resource_url = mspa_url.replace("mspa://", "")

    // let routes = getModRoutes()
    // if (routes[resource_url]) {
    //     console.log("[Resource]", "Mod resolved", mspa_url, "to", routes[resource_url])
    //     return routes[resource_url]
    // }

    // resource_url = mspaData + resource_url

    // console.log("[Resource]", "Resolved", mspa_url, "to", resource_url)
    // return resource_url
    let resource_url = assets_url.replace("assets://", assets_root)

    if (assets_url != resource_url) {
        console.log("[Resource]", "[resolvA]", assets_url, "to", resource_url)
    } else {
        console.log("[Resource]", "[resolvA]", "no change for", resource_url)
    }
    return resource_url
}

const UrlFilterMixin = {
    methods: {
        filterLinksAndImages(el){
            // dynamic default
            if (!el)
                el = this.$el.querySelector('.pageContent')

            // Check if this is a comment
            if (el.nodeType === 8)
                return
            
            // else
            document.querySelectorAll("A").forEach((link) => {
                if (link.href) {
                    console.log("[Resource]", "[filterL]", "looking up", link.href)
                    link.href = getResourceURL(link.href)
                }
            })

            // Normally, this process would be handled by the MediaEmbed component. 
            // Gotta get the behaviour into all them images somehow!
            let media = [...el.getElementsByTagName('IMG'), ...el.getElementsByTagName('VIDEO')]

            for (let i = 0;i < media.length; i++) {
                media[i].src = this.$mspaURL(media[i].src)
                if (media[i].tagName == 'IMG') {  
                    media[i].ondragstart = (e) => {
                        e.preventDefault()
                        e.dataTransfer.effectAllowed = 'copy'
                        let fileStreamPath = this.$mspaFileStream(media[i].src)
                        console.log(fileStreamPath)
                        require('electron').ipcRenderer.send('ondragstart', fileStreamPath)
                    }
                }
            }
        
        }
    }
}

module.exports = {
    init(settings){
        assets_root = settings.assets_root
    },
    UrlFilterMixin,
    resolveURL,
    getResourceURL,
    resolveAssetsProtocol
}