//Rules for transforming intercepted URLS
const path = require('path')

var assets_root

function fileIsAsset(url){
    // Given a url, *without considering the domain*, determine if this should
    // route to an asset of some sort. 

    // If this function is false, url is either an internal vue link
    // or an external web page.

    // ...except for these files that are part of the installer.
    let is_bundled = /\/assets\/[^/]+\.[^/]+/.test(url)
    if (is_bundled) return false

    let has_file_ext = /\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(url)

    // if you reference an html file in `archive/` that should match too, as a failsafe

    return has_file_ext // ||  /^archive\//i.test(url) // maybe not needed now?
}

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

function resolvePath(url, root_dir) {
    // Like resolveURL, but returns an os-path and not a file
    let resource_path = getResourceURL(url)

    if (resource_path.startsWith("assets://")) {
        resource_path = path.join(root_dir, resource_path.replace(/^assets:\/\//, ''))
        console.log("[Resource]", "[resPath]", url, "to", resource_path)
    } else {
        console.log("[Resource]", "[resPath]", "no change for", resource_path)
    }

    return resource_path
}

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

    // coerce logical vue resources to app://
    // // do not actually
    let resource_url = request_url
    //     .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:8080\//, "app://") 
    //     .replace(/^http(s{0,1}):\/\/localhost:8080\//, "app://") 

    // Preliminary filtering
    resource_url = resource_url
        .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") //Linked from a few flashes
        .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") //Covers for 99% of flashes that link to other pages
        .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") //Covers for story links without page numbers
        .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") //Link from CD rack flash
        .replace(/^http(s{0,1}):\/\/((www|cdn)\.)?mspaintadventures\.com/, "assets://") //Complete, should ideally never happen and probably won't work properly if it does
    
        .replace(/^http(s{0,1}):\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
        .replace(/^http(s{0,1}):\/\/www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318` ) // return to core - 618heircut.mp3
        .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
    

    // If it has a file extension, it should be an asset://
    // If it does not, it is a logical vue page.
    if (fileIsAsset(resource_url)) {
        resource_url = resource_url
            .replace(/^\//, "assets://")
            .replace(/^http(s{0,1}):\/\/127\.0\.0\.1:[0-9]+\//, "assets://")
            .replace(/^http(s{0,1}):\/\/localhost:[0-9]+\//, "assets://")  // if this accidently catches localhost:8080 we're boned

        if (!/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(resource_url))
            // files like 'archive/xxx'
            resource_url = "assets://" + resource_url
    }

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
                media[i].src = resolveURL(media[i].src)
                if (media[i].tagName == 'IMG') {  
                    media[i].ondragstart = (e) => {
                        e.preventDefault()
                        e.dataTransfer.effectAllowed = 'copy'
                        let fileStreamPath = this.$mspaFileStream(media[i].src)
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
    resolvePath,
    getResourceURL,
    resolveAssetsProtocol
}