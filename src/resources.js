//Rules for transforming intercepted URLS

var assets_root

function resolveURL(url) {
    // TODO URL handling
    let resource_url = getResourceURL(url)

    if (resource_url.startsWith("assets://")) {
        console.log("[Offline]", "Converted", url, "to", resource_url)
        resource_url = resolveAssetsProtocol(resource_url, assets_root) 
    } 

    return resource_url
}

function getResourceURL(request_url){
    // Transforms URLS into logical resource paths, usually assets://
    //
    // Things this might get:
    // *.mspaintadventures
    // arbitrary HTTP urls
    //
    // Things this should not get:
    // assets://

    let resource_url = request_url
        .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") //Linked from a few flashes
        .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") //Covers for 99% of flashes that link to other pages
        .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") //Covers for story links without page numbers
        .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") //Link from CD rack flash
        .replace(/http:\/\/www\.sweetcred\.com/, `assets://archive/sweetcred`)
        .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `assets://storyfiles/hs2/00338`) // phat beat machine
        .replace(/.+?www\.timelesschaos\.com\/transferFiles/, `assets://storyfiles/hs2/03318` ) // return to core - 618heircut.mp3
        .replace(/http\:\/\/((www|cdn)\.)?mspaintadventures\.com/, `assets://`) //Complete, should ideally never happen and probably won't work properly if it does
    
    return resource_url
}

function resolveAssetsProtocol(assets_url, asset_root) {
    // Finally, redirect mspa:// to local mspa    
    // let resource_url = mspa_url.replace("mspa://", "")

    // let routes = getModRoutes()
    // if (routes[resource_url]) {
    //     console.log("[Offline]", "Mod resolved", mspa_url, "to", routes[resource_url])
    //     return routes[resource_url]
    // }

    // resource_url = mspaData + resource_url

    // console.log("[Offline]", "Resolved", mspa_url, "to", resource_url)
    // return resource_url
    let resource_url = assets_url.replace("assets://", "")
    resource_url = `${assets_root}/${resource_url}`
    console.log("[Offline]", "Resolved", assets_url, "to", resource_url)
    return resource_url
}

module.exports = {
    init(settings){
        assets_root = settings.assets_root
    },
    resolveURL,
    getResourceURL,
    resolveAssetsProtocol
}