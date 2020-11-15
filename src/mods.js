import fs from 'fs'
import path from 'path'

const Store = require('electron-store')
const store = new Store()

const assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
const modsDir = path.join(assetDir, "mods")
const modsAssetsRoot = "assets://mods/"

const VERBOSE = true

var modChoices
var routes = undefined

function print(){
    if (VERBOSE) return console.log("[Mods]", ...arguments)
}

function getAssetRoute(url){
  // If the asset url `url` should be replaced by a mod file,
  // returns the path of the mod file. 
  // Otherwise, returns undefined.

  // Lazily bake routes as needed instead of a init hook
  if (routes == undefined) bakeRoutes()

  console.assert(url.startsWith("assets://"), "mods", url)

  const file_route = routes[url]
  if (file_route) print(url, "to", file_route)
  return file_route
}

function getTreeRoutes(tree, parent=""){
    let routes = []
    for (let name in tree) {
        let dirent = tree[name]
        let subpath = (parent ? parent + "/" + name : name)
        if (dirent == true) {
            // File
            routes.push(subpath)
        } else {
            routes = routes.concat(getTreeRoutes(dirent, subpath))
        }
    }
    return routes
}

function onModLoadFail(enabled_mods, e){
  console.error(e)
  clearEnabledMods()
}

function bakeRoutes(){
    let enabled_mods = getEnabledMods()
    let all_mod_routes = {}
    // Start with least-priority so they're overwritten
    getEnabledModsJs().reverse().forEach(js => {
        try {
            let mod_root = path.join(modsDir, js._id, '')
            let mod_root_url = new URL(js._id, modsAssetsRoot).href + "/"

            // Lower priority: Auto routes
            if (js.treeroute) {
              console.assert(!js._singlefile, "Single file mods cannot use treeroute!")
              
              let treeroutes = getTreeRoutes(crawlFileTree(path.join(mod_root, js.treeroute), true))
              treeroutes.forEach((route) => {
                  all_mod_routes["assets://" + route] =
                    new URL(path.posix.join(js.treeroute, route), mod_root_url).href
              })
            }
            
            // Higher priority: manual routes
            for (let key in js.routes || {}) {
                let local = new URL(js.routes[key], mod_root_url).href
                all_mod_routes[key] = local
            }
        } catch (e) {
            console.error(e)
        }
    })
    routes = all_mod_routes

    // Test routes
    try {
      const Resources = require("@/resources.js")
      Object.keys(all_mod_routes).forEach(url => {
        Resources.resolveURL(url)
      })
    } catch (e) {
      onModLoadFail(enabled_mods, e)
    }

    console.log(routes)
}

const store_modlist_key = 'localData.settings.modListEnabled'

function getEnabledMods(){
  // Get modListEnabled from settings, even if vue is not loaded yet.
  const list = store.has(store_modlist_key) ? store.get(store_modlist_key) : []
  return list
}

function clearEnabledMods(){
  store.set(store_modlist_key, [])
}

function getEnabledModsJs(){
  return getEnabledMods().map((dir) => getModJs(dir))
}

function crawlFileTree(root, recursive=false){
  // Gives a object that represents the file tree, starting at root
  // Values are objects for directories or true for files that exist
  const dir = fs.opendirSync(root);
  let ret = {}
  let dirent
  while (dirent = dir.readSync()) {
    if (dirent.isDirectory() && recursive) {
      let subpath = path.join(root, dirent.name)
      ret[dirent.name] = crawlFileTree(subpath, true)
    } else {
      ret[dirent.name] = true
    }
  }
  dir.close()
  return ret
}

function getModJs(mod_dir){
  try {
      let modjs_path = path.join(modsDir, mod_dir, "mod.js")
      var mod = __non_webpack_require__(modjs_path)
      mod._id = mod_dir
      mod._singlefile = false
      return mod
  } catch (e1) {
    if (e1.code && e1.code == "MODULE_NOT_FOUND") {
      try {
          // Look for a single-file mod
          let modjs_path = path.join(modsDir, mod_dir)
          var mod = __non_webpack_require__(modjs_path)
          mod._id = mod_dir
          mod._singlefile = true
          return mod
      } catch (e2) {
          console.error(e1)
          throw e2
      }
    } else throw e1
  }
}

// Interface

function editArchive(archive){
  getEnabledModsJs().reverse().forEach((js) => {
    const editfn = js.edit
    if (editfn) {
      archive = editfn(archive)
    }
  })
}

// Black magic
function getMixins(){
  const nop = ()=>undefined;

  // TODO: How do mixin collisions work? Priorities
  return getEnabledModsJs().reverse().map((js) => {
    const vueHooks = js.vueHooks || []
    var mixin = {
      created() {
        // Normally mixins are ignored on name collision
        // We need to do the opposite of that, so we hook `created`
        vueHooks.forEach((hook) => {
          // Shorthand
          if (hook.matchName) {
            hook.match = (c)=>(c.$options.name == hook.matchName)
          }

          if (hook.match(this)) {
            for (const cname in (hook.computed || {})) {
              // Precomputed super function
              const sup = (()=>this._computedWatchers[cname].getter.call(this) || nop);
              Object.defineProperty(this, cname, {
                get: () => (hook.computed[cname](sup)),
                configurable: true
              })
            }
            for (const dname in (hook.data || {})) {
              const value = hook.data[dname]
              this[dname] = (typeof(value) == "function" ? value(this[dname]) : value)
            }
          }
        })
      }
    }
    return mixin
  })
}

// Runtime
const {ipcMain, ipcRenderer} = require('electron');
if (ipcMain) {
    // We are in the main process.
    function loadModChoices(){
      // Get the list of mods players can choose to enable/disable
      var mod_folders = Object.keys(crawlFileTree(modsDir, false))
      var items = mod_folders.reduce((acc, dir) => {
        let js = getModJs(dir)
        acc[dir] = {
          label: js.title,
          desc: js.desc,
          key: dir
        }
        return acc
      }, {})
      print("Mod choices loaded")
      print(items)
      return items
    }

    modChoices = loadModChoices()

    ipcMain.on('GET_AVAILABLE_MODS', (e) => {e.returnValue = modChoices})
} else {
    // We are in the renderer process.
    modChoices = ipcRenderer.sendSync('GET_AVAILABLE_MODS')
}


export default {
  getEnabledModsJs,  // probably shouldn't use
  getMixins,
  editArchive,
  bakeRoutes,
  getAssetRoute,

  modChoices
}