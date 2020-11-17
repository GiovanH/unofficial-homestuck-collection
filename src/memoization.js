var LRUCache = require('mnemonist/lru-cache');

var all_caches = {}

function getCache(size, funkey) {
    if (funkey == undefined)
        throw `Function key is undefined!`

    let exist_cache = all_caches[funkey]
    if (exist_cache)
        return funkey

    console.log("new cache for", funkey)
    all_caches[funkey] = new LRUCache(size)
    return funkey
}
function cacheHas(cache_id, key) {return all_caches[cache_id].has(key)}
function cacheGet(cache_id, key) {return all_caches[cache_id].get(key)}
function cacheSet(cache_id, key, value) {all_caches[cache_id].set(key, value)}
function memoizedClearAll() {
    for (let c in all_caches)
        all_caches[c].clear()
}

// function hashCode(string, seed=0) {
//     let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
//     for (let i = 0, ch; i < string.length; i++) {
//         ch = string.charCodeAt(i);
//         h1 = Math.imul(h1 ^ ch, 2654435761);
//         h2 = Math.imul(h2 ^ ch, 1597334677);
//     }
//     h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
//     h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
//     return 4294967296 * (2097151 & h2) + (h1>>>0);
// };

function memoized(fun, funkey, size = 1000){
    // We need to detect here if there is already a cache for our function
    var cache_id = getCache(size, funkey)
    return function (){
        const key = [...arguments] // Must create immutable
        
        if (cacheHas(cache_id, key)) {
            const result = cacheGet(cache_id, key)
            return result
        } else {
            const result = fun(...key)
            cacheSet(cache_id, key, result)
            return result
        }
    }
}

export default {
    memoized,
    memoizedClearAll
}