import fs from 'fs'
import path from 'path'

const Store = require('electron-store')
const store = new Store()

const log = require('electron-log');
const logger = log.scope('Mods');

const assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
const modsDir = path.join(assetDir, "mods")
const modsAssetsRoot = "assets://mods/"

var modChoices
var routes = undefined

function getAssetRoute(url){
  // If the asset url `url` should be replaced by a mod file,
  // returns the path of the mod file. 
  // Otherwise, returns undefined.

  // Lazily bake routes as needed instead of a init hook
  if (routes == undefined) bakeRoutes()

  console.assert(url.startsWith("assets://"), "mods", url)

  const file_route = routes[url]
  if (file_route) logger.debug(url, "to", file_route)
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
  logger.info("Mod load failure")
  logger.debug(enabled_mods)
  logger.debug(e)
  clearEnabledMods()
}

function bakeRoutes(){
    let enabled_mods = getEnabledMods()
    logger.info("Baking routes for", enabled_mods)
    let all_mod_routes = {}
    // Start with least-priority so they're overwritten
    getEnabledModsJs().reverse().forEach(js => {
        try {
            let mod_root = path.join(modsDir, js._id)
            let mod_root_url = new URL(js._id, modsAssetsRoot).href + "/"

            // Lower priority: Auto routes
            if (js.trees) {
              console.assert(!js._singlefile, js.title, "Single file mods cannot use treeroute!")
              
              for (let mod_tree in js.trees) {
                let asset_tree = js.trees[mod_tree] 

                console.assert(mod_tree.endsWith("/"), mod_tree, "Tree paths must be directories! (end with /)")
                console.assert(asset_tree.endsWith("/"), asset_tree, "Tree paths must be directories! (end with /)")
                console.assert(asset_tree.startsWith("assets://"), asset_tree, "Asset paths must be on the assets:// protocol!")

                let treeroutes = getTreeRoutes(crawlFileTree(path.join(mod_root, mod_tree), true))
                treeroutes.forEach(route => {
                  all_mod_routes[asset_tree + route] =
                    new URL(path.posix.join(mod_tree, route), mod_root_url).href
                })
              }
            }
            
            // Higher priority: manual routes
            for (let key in js.routes || {}) {
                let local = new URL(js.routes[key], mod_root_url).href
                all_mod_routes[key] = local
            }
        } catch (e) {
            logger.error(e)
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
      throw e
    }
}

const store_modlist_key = 'localData.settings.modListEnabled'

function getEnabledMods(){
  // Get modListEnabled from settings, even if vue is not loaded yet.
  const list = store.has(store_modlist_key) ? store.get(store_modlist_key) : []
  return list
}

function clearEnabledMods(){
  // TODO: This doesn't trigger the settings.modListEnabled observer,
  // which results in bad settings-screen side effects
  store.set(store_modlist_key, [])
  bakeRoutes()
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

function getModJs(mod_dir, singlefile=false){
  // Tries to load a mod from a directory
  // If mod_dir/mod.js is not found, tries to load mod_dir.js as a single file
  // Errors passed to onModLoadFail and raised
  try {
      let modjs_path
      if (singlefile) {
        modjs_path = path.join(modsDir, mod_dir)
      } else {
        modjs_path = path.join(modsDir, mod_dir, "mod.js")
      }
      var mod = __non_webpack_require__(modjs_path)
      // mod.logger = log.scope(mod_dir);
      mod._id = mod_dir
      mod._singlefile = singlefile
      return mod
  } catch (e1) {
    // elaborate error checking w/ afllback
    let e1_is_notfound = (e1.code && e1.code == "MODULE_NOT_FOUND")
    if (singlefile) {
      if (e1_is_notfound) {
        // Tried singlefile, missing
        throw e1
      } else {
        // Singlefile found, other error
        logger.error("Singlefile found, other error 1")
        onModLoadFail([mod_dir], e1)
        throw e1
      }
    } else if (e1_is_notfound) {
      // Tried dir/mod.js, missing
      try {
        // Try to find singlefile
        return getModJs(mod_dir, true)
      } catch (e2) {
        let e2_is_notfound = (e2.code && e2.code == "MODULE_NOT_FOUND")
        if (e2_is_notfound) {
          // Singlefile not found either
          logger.error(mod_dir, "is missing required file 'mod.js'")
          onModLoadFail([mod_dir], e2)
        } else {
          // Singlefile found, other error
          logger.error("Singlefile found, other error 2")
          onModLoadFail([mod_dir], e2)
        } 
        // finally
        throw e2

      }
    } else {
      // dir/mod.js found, other error
      onModLoadFail([mod_dir], e1)
      throw e1
    }
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

function getMainMixin(){

  let styles = []
  getEnabledModsJs().forEach(js => {
    let mod_root_url = new URL(js._id, modsAssetsRoot).href + "/"
    const modstyles = js.styles || []
    modstyles.forEach(style_link => styles.push(new URL(style_link, mod_root_url).href))
  })

  return {
    mounted() {
      logger.info("Mounted main mixin")

      styles.forEach((style_link) => {
        let link = document.createElement("link")
        link.rel = "stylesheet"
        link.type = "text/css"
        link.href = style_link

        this.$el.appendChild(link)
        logger.debug(link)
      })
    }
  }
}

// Black magic
function getMixins(){
  const nop = ()=>undefined;
  
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
      try {
        var mod_folders = Object.keys(crawlFileTree(modsDir, false))
      } catch {
        // No mod folder at all. That's okay.
        return []
      }
      var items = mod_folders.reduce((acc, dir) => {
        let js = getModJs(dir)
        acc[dir] = {
          label: js.title,
          desc: js.desc,
          key: dir
        }
        return acc
      }, {})
      logger.info("Mod choices loaded")
      logger.debug(items)
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
  getEnabledMods,
  getMixins,
  getMainMixin,
  editArchive,
  bakeRoutes,
  getAssetRoute,

  modChoices
}