import fs from 'fs'
import path from 'path'

const {ipcMain, ipcRenderer, dialog, app} = require('electron')
const sass = require('sass');

const Store = require('electron-store')
const store = new Store()

const log = require('electron-log');
const logger = log.scope('Mods');

const assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
const modsDir = (assetDir ? path.join(assetDir, "mods") : undefined)
const modsAssetsRoot = "assets://mods/"

const imodsDir = (assetDir ? path.join(assetDir, "archive", "imods") : undefined)
const imodsAssetsRoot = "assets://archive/imods/"

var modChoices
var routes = undefined

const store_modlist_key = 'localData.settings.modListEnabled'
const store_devmode_key = 'localData.settings.devMode'

// Function exposed for SubSettingsModal, which directly writes to store
function getModStoreKey(mod_id, k){
  if (k) {return `mod.${mod_id}.${k}`}
  return `mod.${mod_id}`
}

function getAssetRoute(url) {
  // If the asset url `url` should be replaced by a mod file,
  // returns the path of the mod file. 
  // Otherwise, returns undefined.

  // Lazily bake routes as needed instead of a init hook
  if (routes == undefined) {
    logger.info("Baking routes lazily, triggered by", url)
    bakeRoutes()
  }

  console.assert(url.startsWith("assets://"), "mods", url)

  const file_route = routes[url]
  if (file_route) logger.debug(url, "to", file_route)
  return file_route
}

function getTreeRoutes(tree, parent=""){
  let routes = []
  for (const name in tree) {
    const dirent = tree[name]
    const subpath = (parent ? parent + "/" + name : name)
    if (dirent == true) {
      // Path points to a file of some sort
      routes.push(subpath)
    } else {
      // Recurse through subpaths
      routes = routes.concat(getTreeRoutes(dirent, subpath))
    }
  }
  return routes
}

var onModLoadFail;

if (ipcMain) {
  onModLoadFail = function (enabled_mods, e) {
    if (modsDir == undefined)
      return // Pre-setup, we're probably fine ignoring this.

    logger.info("Mod load failure with issues in", enabled_mods)
    logger.error(e)

    // TODO: Replace this with a good visual traceback so users can diagnose mod issues
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Mod load error',
      message: "Something went wrong while loading mods! All mods have been disabled for safety; you may need to restart the application.\nCheck the console log for details"
    })
    // Clear enabled mods
    // TODO: This doesn't trigger the settings.modListEnabled observer,
    // which results in bad settings-screen side effects
    store.set(store_modlist_key, [])
    logger.debug("Modlist cleared, clearing routes...")

    app.relaunch()
    app.exit()
  }
} else {
  // We are in the renderer process.
  onModLoadFail = function (enabled_mods, e) {
    if (modsDir == undefined)
      return // Pre-setup, we're probably fine ignoring this.

    logger.info("Mod load failure with modlist", enabled_mods)
    logger.debug(e)
    document.body.innerText = `Mod load failure with modlist ${enabled_mods}`
    store.set(store_modlist_key, [])
    logger.error("Did not expect to be in the renderer process for this! Debug")
    ipcRenderer.invoke('reload')
  }
}

function bakeRoutes() {
  const enabled_mods = getEnabledMods()
  logger.info("Baking routes for", enabled_mods)
  let all_mod_routes = {}
  // Start with least-priority so they're overwritten
  getEnabledModsJs().reverse().forEach(js => {
    try {
      // Lower priority: Auto routes
      if (js.trees) {
        console.assert(!js._singlefile, js.title, "Single file mods cannot use treeroute!")
        
        for (const mod_tree in js.trees) {
          const asset_tree = js.trees[mod_tree] 

          console.assert(mod_tree.endsWith("/"), mod_tree, "Tree paths must be directories! (end with /)")
          console.assert(asset_tree.endsWith("/"), asset_tree, "Tree paths must be directories! (end with /)")
          console.assert(asset_tree.startsWith("assets://"), asset_tree, "Asset paths must be on the assets:// protocol!")

          const treeroutes = getTreeRoutes(crawlFileTree(path.join(js._mod_root_dir, mod_tree), true))
          treeroutes.forEach(route => {
            all_mod_routes[asset_tree + route] =
              new URL(path.posix.join(mod_tree, route), js._mod_root_url).href
          })
        }
      }
      
      // Higher priority: manual routes
      for (const key in js.routes || {}) {
        const local = new URL(js.routes[key], js._mod_root_url).href
        console.assert(!(js._singlefile && local.includes(js._mod_root_url)), js.title, "Single file mods cannot use local route!")
                
        all_mod_routes[key] = local
      }
    } catch (e) {
      logger.error(e)
    }
  })

  logger.debug(all_mod_routes)
  
  // Modify script-global `routes`
  routes = all_mod_routes

  // Test routes
  const do_full_check = (store.has(store_devmode_key) ? store.get(store_devmode_key) : false)

  if (do_full_check) {
    logger.debug("Doing full resources check (devMode on)")
    const Resources = require("@/resources.js")
    if (Resources.isReady()) {
      Object.keys(all_mod_routes).forEach(url => {
        try {
          Resources.resolveURL(url)
        } catch (e) {
          logger.warn("Testing routes failed")
          onModLoadFail([url], e)
        }
      })
    }
  } else 
    logger.debug("Skipping full resources check (devMode off)")
}

function getEnabledMods() {
  // Get modListEnabled from settings, even if vue is not loaded yet.
  const list = store.has(store_modlist_key) ? store.get(store_modlist_key) : []

  if (store.get('localData.settings.unpeachy'))
    list.push("_unpeachy")
  if (store.get('localData.settings.pxsTavros'))
    list.push("_pxsTavros")
  if (store.get('localData.settings.jsFlashes'))
    list.push("_replaybound")

  return list
}

function getEnabledModsJs() {
  try {
    return getEnabledMods().map((dir) => getModJs(dir))
  } catch {
    logger.error("Couldn't load mod js'")
    return []
  }
}

function crawlFileTree(root, recursive=false) {
  // Gives a object that represents the file tree, starting at root
  // Values are objects for directories or true for files that exist
  const dir = fs.opendirSync(root)
  let ret = {}
  let dirent
  while (dirent = dir.readSync()) {
    if (dirent.isDirectory()) {
      if (recursive) {
        const subpath = path.join(root, dirent.name)
        ret[dirent.name] = crawlFileTree(subpath, true)
      } else ret[dirent.name] = undefined // Is directory, but not doing a recursive scan
    } else {
      ret[dirent.name] = true
    }
  }
  dir.close()
  return ret
}

function getModJs(mod_dir, singlefile=false) {
  // Tries to load a mod from a directory
  // If mod_dir/mod.js is not found, tries to load mod_dir.js as a single file
  // Errors passed to onModLoadFail and raised
  try {
    let modjs_path
    var mod

    // Global, but let us overwrite it for some cases
    let thisModsDir = modsDir
    let thisModsAssetRoot = modsAssetsRoot

    if (mod_dir.startsWith("_")) {
      thisModsDir = imodsDir
      thisModsAssetRoot = imodsAssetsRoot
    } 

    if (singlefile) {
      modjs_path = path.join(thisModsDir, mod_dir)
    } else {
      modjs_path = path.join(thisModsDir, mod_dir, "mod.js")
    }

    mod = __non_webpack_require__(modjs_path)

    mod._id = mod_dir
    mod._singlefile = singlefile
    mod._internal = mod_dir.startsWith("_")

    if (!singlefile) {
      mod._mod_root_dir = path.join(thisModsDir, mod._id)
      mod._mod_root_url = new URL(mod._id, thisModsAssetRoot).href + "/"
    }

    if (mod.computed != undefined) {
      const api = {
        logger: log.scope(mod._id),
        store: {
          set: (k, v) => store.set(getModStoreKey(mod._id, k), v),
          get: (k, default_) => store.get(getModStoreKey(mod._id, k), default_),
          has: (k) => store.has(getModStoreKey(mod._id, k)),
          delete: (k) => store.delete(getModStoreKey(mod._id, k)),
          onDidChange: (k, cb) => store.onDidChange(getModStoreKey(mod._id, k), cb),
          clear: () => store.clear(getModStoreKey(mod._id, null))
        }
      }
      Object.assign(mod, mod.computed(api))
    }

    mod._needsreload = ['styles', 'vueHooks', 'themes', 'withStore'].some(k => mod.hasOwnProperty(k))

    return mod
  } catch (e1) {
    // elaborate error checking w/ afllback
    const e1_is_notfound = (e1.code && e1.code == "MODULE_NOT_FOUND")
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
        const e2_is_notfound = (e2.code && e2.code == "MODULE_NOT_FOUND")
        if (e2_is_notfound) {
          // Singlefile not found either
          logger.error(mod_dir, "is missing required file 'mod.js'")
          onModLoadFail([mod_dir], e2)
        } else {
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

const footnote_categories = ['story']

// Interface

function editArchive(archive) {
  getEnabledModsJs().reverse().forEach((js) => {
    try {
      const editfn = js.edit
      if (editfn) {
        editfn(archive)
        console.assert(archive, js.title, "You blew it up! You nuked the archive!")
      
        // Sanity checks
        // let required_keys = ['mspa', 'social', 'news', 'music', 'comics', 'extras']
        // required_keys.forEach(key => {
        //   if (!archive[key]) throw new Error("Archive object missing required key", key)
        // })
      }
    } catch (e) {
      onModLoadFail(js._id, e)
    }
  })

  archive.footnotes = {}

  footnote_categories.forEach(category => {
    archive.footnotes[category] = []
  })

  // Footnotes
  getEnabledModsJs().reverse().forEach((js) => {
    try {
      if (js.footnotes) {
        if (typeof js.footnotes == "string") {
          console.assert(!js._singlefile, js.title, "Single file mods cannot use footnote files!")
          
          const json_path = path.join(
            js._mod_root_dir, 
            js.footnotes
          )

          logger.info(js.title, "Loading footnotes from file", json_path)
          const footObj = JSON.parse(
            fs.readFileSync(json_path, 'utf8')
          )
          mergeFootnotes(archive, footObj)
        } else if (Array.isArray(js.footnotes)) {
          logger.info(js.title, "Loading footnotes from object")
          mergeFootnotes(archive, js.footnotes)
        } else {
          throw new Error(js.title, `Incorrectly formatted mod. Expected string or array, got '${typeof jsfootnotes}'`)
        }
      }
    } catch (e) {
      onModLoadFail(e, "adding footnotes")
    }
  })
}

function mergeFootnotes(archive, footObj) {
  if (!Array.isArray(footObj)) {
    throw new Error(`Incorrectly formatted mod. Expected string or array, got '${typeof jsfootnotes}'`)
  }

  footObj.forEach(footnoteList => {
    const default_author = (footnoteList.author === undefined) ? "Undefined Author" : footnoteList.author 
    const default_class = footnoteList.class || undefined
    const default_ispreface = footnoteList.preface

    footnote_categories.forEach(category => {
      for (var page_num in footnoteList[category]) {
        // TODO replace this with some good defaultdict juice
        if (!archive.footnotes[category][page_num])
          archive.footnotes[category][page_num] = []

        footnoteList[category][page_num].forEach(note => {
          const new_note = {
            author: (note.author === null) ? null : (note.author || default_author),
            class: (note.class === null) ? null : (note.class || default_class),
            preface: note.preface || default_ispreface,
            content: note.content
          }

          archive.footnotes[category][page_num].push(new_note)
        })
      }
    })
  })
}

function getMainMixin(){
  // A mixin that injects on the main vue process.
  // Currently this just injects custom css

  return {
    mounted() {
      getEnabledModsJs().forEach(js => {
        const modstyles = js.styles || []
        modstyles.forEach((customstyle, i) => {
          const style_id = `style-${js._id}-${i}`
          this.$logger.debug(style_id)
          
          const body = sass.renderSync({
            file: path.resolve(js._mod_root_dir, customstyle.source),
            sourceComments: true
          }).css.toString()

          const style = document.createElement("style")
          style.id = style_id
          style.rel = "stylesheet"
          style.innerHTML = body
          this.$el.appendChild(style)
          this.$logger.debug(style_id, style)
        })

        const modThemes = js.themes || []
        modThemes.forEach((theme, i) => {
          const theme_class = `theme-${js._id}-${i}`
          this.$logger.debug(theme_class)

          let body = fs.readFileSync(path.resolve(js._mod_root_dir, theme.source))
          body = sass.renderSync({
            data: `#app.${theme_class} {\n${body}\n}`,
            sourceComments: true
          }).css.toString()

          const style = document.createElement("style")
          style.id = theme_class
          style.rel = "stylesheet"
          style.innerHTML = body
          this.$el.appendChild(style)
          this.$logger.debug(theme_class, style)
        })
      })
    }
  }
}

function getMixins(){
  // This is absolutely black magic

  const nop = () => undefined

  return getEnabledModsJs().reverse().map((js) => {
    const vueHooks = js.vueHooks || []
    const modThemes = js.themes || []

    // Keep this logic out here so it doesn't get repeated
    // TODO: Make sure other forEachs aren't being duplicated down there

    // Write theme hooks
    // Try to minimize vue hooks (don't want a huge stack!)
    if (modThemes.length) {
      const newThemes = modThemes.map((theme, i) => 
        ({text: theme.label, value: `theme-${js._id}-${i}`})
      )
      
      vueHooks.push({
        matchName: "settings",
        data: {themes($super) {return $super.concat(newThemes)}}
      })
    }

    if (vueHooks.length == 0) {
      return null
    }

    var mixin = {
      created() {
        const vueComponent = this

        // Normally mixins are ignored on name collision
        // We need to do the opposite of that, so we hook `created`
        vueHooks.forEach((hook) => {
          // Shorthand
          if (hook.matchName)
            hook.match = (c) => (c.$options.name == hook.matchName)
          
          if (hook.match(this)) {
            // Data w/ optional compute function
            this.$logger.debug(this.$options.name, "matched against vuehook in", js._id)

            for (const dname in (hook.data || {})) {
              const value = hook.data[dname]
              this[dname] = (typeof value == "function" ? value.bind(this)(this[dname]) : value)
            }
            // Computed
            for (const cname in (hook.computed || {})) {
              // Precomputed super function
              const sup = (() => this._computedWatchers[cname].getter.call(this) || nop)
              Object.defineProperty(this, cname, {
                get: hook.computed[cname].bind(vueComponent, sup),
                configurable: true
              })
            }
            // Methods w/ optional super argument
            for (const mname in (hook.methods || {})) {
              const sup = this[mname] || nop
              const bound = hook.methods[mname].bind(vueComponent)
              this[mname] = function(){return bound(...arguments, sup)}
            }
          }
        })
      },
      updated() {
        vueHooks.forEach((hook) => {
          // Shorthand
          if (hook.matchName)
            hook.match = (c) => (c.$options.name == hook.matchName)

          if (hook.updated && hook.match(this)) {
            hook.updated.bind(this)()
          }
        })
      }
    }
    return mixin
  }).filter(Boolean)
}

// Runtime
// Grey magic. This file can be run from either process, but only the main process will do file handling.

if (ipcMain) {
  // We are in the main process.
  function loadModChoices(){
    // Get the list of mods players can choose to enable/disable
    var mod_folders
    try {
      // TODO: Replace this with proper file globbing
      const tree = crawlFileTree(modsDir, false)
      // .js file or folder of some sort
      mod_folders = Object.keys(tree).filter(p => /\.js$/.test(p) || tree[p] === undefined || logger.warn("Not a mod:", p))
    } catch (e) {
      // No mod folder at all. That's okay.
      logger.error(e)
      return []
    }
    // logger.info("Mod folders seen")
    // logger.debug(mod_folders)

    var items = mod_folders.reduce((acc, dir) => {
      try {
        const js = getModJs(dir)
        if (js.hidden === true)
          return acc // continue

        acc[dir] = {
          label: js.title,
          summary: js.summary,
          description: js.description,
          author: js.author,
          modVersion: js.modVersion,
          locked: js.locked,

          hasmeta: Boolean(js.author || js.modVersion || js.settings),
          needsreload: js._needsreload,
          settingsmodel: js.settings,
          key: dir,

          includes: {
            routes: Boolean(js.routes || js.treeroute || js.trees),
            edits: Boolean(js.edit),
            hooks: (js.vueHooks ? js.vueHooks.map(h => (h.matchName || "[complex]")) : false),
            styles: Boolean(js.styles),
            footnotes: Boolean(js.footnotes),
            themes: Boolean(js.themes)
          }
        }
      } catch (e) {
        // Catch import-time mod-level errors
        logger.error("Couldn't load mod choice")
      }
      return acc
    }, {})

    logger.info("Mod choices loaded")
    logger.debug(Object.keys(items))
    return items
  }

  if (modsDir) {
    modChoices = loadModChoices()
  } else {
    logger.warn("modsDir is not defined! First run?")
  }

  ipcMain.on('GET_AVAILABLE_MODS', (e) => {e.returnValue = modChoices})
  ipcMain.on('MODS_FORCE_RELOAD', (e) => {
    modChoices = loadModChoices()
    e.returnValue = true
  })
} else {
  // We are in the renderer process.
  logger.info("Requesting modlist from main")
  modChoices = ipcRenderer.sendSync('GET_AVAILABLE_MODS')
  // TODO: It would be nice if force-reloading mods updated this variable too, somehow
}

export default {
  getEnabledModsJs,  // probably shouldn't use
  getEnabledMods,
  getMixins,
  getMainMixin,
  editArchive,
  bakeRoutes,
  getAssetRoute,
  getModStoreKey,

  modChoices
}
