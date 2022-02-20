import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const {ipcMain, ipcRenderer, dialog} = require('electron')
const sass = require('sass')
const unzipper = require("unzipper")
const Tar = require('tar');

const Store = require('electron-store')
const store = new Store()

const log = require('electron-log')
const logger = log.scope('Mods')

const assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
const modsDir = (assetDir ? path.join(assetDir, "mods") : undefined)
const modsAssetsRoot = "assets://mods/"

const imodsDir = (assetDir ? path.join(assetDir, "archive", "imods") : undefined)
const imodsAssetsRoot = "assets://archive/imods/"

var modChoices
var routes = undefined

const store_modlist_key = 'localData.settings.modListEnabled'
const store_devmode_key = 'localData.settings.devMode'

let win = null
function giveWindow(new_win) {
  win = new_win
  logger.info("Got window")
}

let validatedState = false
function expectWorkingState(){
  if (validatedState) return true
  validatedState = (assetDir && fs.existsSync(path.join(assetDir, "archive")))
  return validatedState
}

// ====================================
// Routing

// Function exposed for SubSettingsModal, which directly writes to store
function getModStoreKey(mod_id, k){
  if (k) {return `mod.${mod_id}.${k}`}
  return `mod.${mod_id}`
}

function getAssetRoute(url) {
  // If the asset url `url` should be replaced by a mod file,
  // returns the path of the mod file. 
  // Otherwise, returns undefined.
  if (!expectWorkingState())
    return undefined

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

// ====================================
// Installation and list managment

function extractimods(){
  if (!expectWorkingState()) {
    logger.info("Not yet in working state, not extracting imods.")
    return
  }
  // TODO: Some people report occasionally getting "__webpack_require__.match is not a function or its return value is not iterable" at this line. Have not been able to reproduce the error so far.

  // eslint-disable-next-line import/no-webpack-loader-syntax
  const [match, contentType, base64] = require("url-loader!./imods.tar").match(/^data:(.+);base64,(.*)$/)
  const tar_buffer = Buffer.from(base64, 'base64')

  const outpath = path.join(assetDir, "archive")
  const temp_tar_path = path.join(outpath, '_imods.tar')
  logger.info("Saving imods tar to ", temp_tar_path)
  // sorry! this is very silly but javascript refuses to let me
  // wait for a promise before returning, so here we are
  fs.writeFileSync(temp_tar_path, tar_buffer)
  Tar.extract({
    file: temp_tar_path,
    sync: true,
    cwd: outpath
  })
  fs.unlink(temp_tar_path, err => {
    if (err) logger.error(err)
  })
  logger.info("Extracting imods to ", outpath)
}

function removeModsFromEnabledList(responsible_mods) {
  // Clear enabled mods
  const old_enabled_mods = getEnabledMods()
  const new_enabled_mods = old_enabled_mods.filter(x => !responsible_mods.includes(x)).filter(x => !x.startsWith("_"))
  logger.info("Changing modlist", old_enabled_mods, new_enabled_mods)

  // Fully reactive settings clobber
  if (ipcMain) {
    logger.info("Trying to change modlist from main")
    store.set(store_modlist_key, new_enabled_mods)
    if (win) {
      win.webContents.send('RELOAD_LOCALDATA')
    } else {
      // probably pre-window, don't need to worry here
      logger.warn("Don't have win!")
    }
  } else if (window.vm) {
    logger.info("Changing modlist from vm")
    window.vm.$localData.settings["modListEnabled"] = new_enabled_mods
    logger.info(window.vm.$localData.settings["modListEnabled"])
    window.vm.$localData.VM.saveLocalStorage()
  } else {
    logger.info("Trying to change modlist before vm")
    store.set(store_modlist_key, new_enabled_mods)
  }
}

var onModLoadFail;

if (ipcMain) {
  onModLoadFail = function (responsible_mods, e) {
    if (modsDir == undefined || !fs.existsSync(modsDir) || !fs.existsSync(path.join(assetDir, "archive")))
      return // Pre-setup, we're probably fine ignoring this.

    store.set("needsRecovery", true)

    if (win) {
      win.webContents.send('MOD_LOAD_FAIL', responsible_mods, e)
    } else {
      logger.info("MAIN: Mod load failure with issues in", responsible_mods)
      logger.error(e)
      logger.error("Don't have win!")
      // This only happens if we can't even display the pretty traceback. Absolute fallback.
      dialog.showMessageBoxSync({
        type: 'error',
        title: 'Mod load error',
        message: `Something went wrong while loading mods ${responsible_mods}! These have been disabled for safety; you should remove them from the Active list and you may need to restart the application.\nCheck the console log for details`
      })
      removeModsFromEnabledList(responsible_mods)
    }
  }
} else {
  // We are in the renderer process.
  onModLoadFail = function (responsible_mods, e) {
    if (modsDir == undefined || !fs.existsSync(modsDir) || !fs.existsSync(path.join(assetDir, "archive")))
      return // Pre-setup, we're probably fine ignoring this.

    store.set("needsRecovery", true)

    logger.info("RENDER: Mod load failure with modlist", responsible_mods)
    logger.error(e)

    window.doErrorRecover = () => {
      removeModsFromEnabledList(responsible_mods)
      // Have to invoke reload because we probably don't even have the VM at this point
      ipcRenderer.invoke('reload')
    }
    window.doReloadNoRecover = () => ipcRenderer.invoke('reload')
    window.doFullRestart = () => ipcRenderer.invoke('restart')

    function sanitizeHTML(str) {
      var temp = document.createElement('div')
      temp.textContent = str
      return temp.innerHTML
    };

    document.body.innerHTML = `
    <style>
    div {
      background: #fff;
      color: #000;
    }
    div > * { max-width: 100% }
    div > div { padding: 1em; }
    p { font-family: sans-serif; }
    pre { white-space: pre-wrap; }
    </style>
    <div>
      <p style="-webkit-app-region: drag; background: #aaa;">Error</p>
      <div>
        <p>Something went wrong while loading mods <em>${responsible_mods}</em>! 
        These have been disabled for safety.</p>
        <pre>${sanitizeHTML(e)}</pre>
        <input type="button" value="1. Disable blamed mods and Reload" onclick="doErrorRecover()" /><br />
        <input type="button" value="2. Restart and attempt auto-recovery (if 1 didn't work)" onclick="doFullRestart()" /><br />
        <input type="button" value="3. Attempt reload without making changes (if you made external changes)" onclick="doReloadNoRecover()" /><br />
        <p>For troubleshooting, save this error message or the <a href="${log.transports.file.getFile()}">log file</a></p><br />
        <p>Stacktrace:</p>
        <pre>${sanitizeHTML(e.stack)}</pre>
      </div>
    </div>`
  }
  ipcRenderer.on('MOD_LOAD_FAIL', (event, responsible_mods, e) => {
    onModLoadFail(responsible_mods, e)
  })
}

function bakeRoutes() {
  const enabled_mods = getEnabledMods()
  if (!expectWorkingState()) {
    logger.info("No asset directory set, not baking any routes")
    return
  }
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
            const route_href = new URL(asset_tree + route).href
            all_mod_routes[route_href] =
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
}

function doFullRouteCheck(){
  logger.debug("Doing full resources check (devMode on)")
  const enabled_mods = getEnabledMods()
  const Resources = require("@/resources.js")
  if (Resources.isReady()) {
    Object.keys(routes).forEach(url => {
      try {
        Resources.resolveURL(url)
      } catch (e) {
        logger.warn("Testing routes failed")
        logger.error(url, e)
        onModLoadFail(enabled_mods, e)
      }
    })
  } else {
    logger.warn("Resources uninitialized, can't check.")
  }
}

function getEnabledMods() {
  // Get modListEnabled from settings, even if vue is not loaded yet.
  const list = store.has(store_modlist_key) ? store.get(store_modlist_key) : []

  list.push("_twoToThree")

  if (store.get('localData.settings.unpeachy'))
    list.push("_unpeachy")
  if (store.get('localData.settings.pxsTavros'))
    list.push("_pxsTavros")
  if (store.get('localData.settings.jsFlashes'))
    list.push("_replaybound")

  // Soluslunes must load after bolin
  if (store.get('localData.settings.soluslunes'))
    list.push("_soluslunes")

  // Bolin must come before hqaudio in the stack so it loads after it.
  if (store.get('localData.settings.bolin'))
    list.push("_bolin")

  if (store.get('localData.settings.hqAudio'))
    list.push("_hqAudio")

  if (!store.get('localData.settings.newReader.limit'))
    list.push("_secret")

  return list
}

function getEnabledModsJs() {
  if (!modsDir) {
    logger.info("No asset directory set, can't load any mods.")
    return []
  }
  try {
    return getEnabledMods().map((dir) => getModJs(dir)).filter(Boolean)
  } catch (e) {
    logger.error("Couldn't load enabled mod js'", e)
    return []
  }
}

function crawlFileTree(root, recursive=false) {
  // Gives a object that represents the file tree, starting at root
  // Values are objects for directories or true for files that exist
  const dir = fs.opendirSync(root)
  let ret = {}
  let dirent
  // eslint-disable-next-line no-cond-assign
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

function buildApi(mod) {
  function readFileSyncLocal(local_path, method_name) {
    console.assert(!mod._singlefile, `Singlefile mods cannot use api.${method_name}`)
    console.assert(local_path.startsWith("./"), local_path, `${method_name} paths must be mod relative (./)`)
    console.assert(!local_path.includes("/.."), local_path, "You know what you did")

    // TODO probably unsafe
    return fs.readFileSync(path.join(mod._mod_root_dir, local_path), 'utf8')
  }

  let api = {
    store: {
      set: (k, v) => store.set(getModStoreKey(mod._id, k), v),
      get: (k, default_) => store.get(getModStoreKey(mod._id, k), default_),
      has: (k) => store.has(getModStoreKey(mod._id, k)),
      delete: (k) => store.delete(getModStoreKey(mod._id, k)),
      onDidChange: (k, cb) => store.onDidChange(getModStoreKey(mod._id, k), cb),
      clear: () => store.clear(getModStoreKey(mod._id, null))
    }, 
    readFile(asset_path) {
      let data = readFileSyncLocal(asset_path, "readFile")
      return data
    },
    readJson(asset_path) {
      return JSON.parse(readFileSyncLocal(asset_path, "readJson"))
    },
    readYaml(asset_path) {
      return yaml.safeLoad(readFileSyncLocal(asset_path, "readYaml"))
    } 
  }
  var logger
  Object.defineProperty(api, 'logger', {
    get: function() {
      if (logger) return logger
      logger = log.scope(mod._id)
      return logger
    }
  })
  return api
}

function getModJs(mod_dir, options={}) {
  // Tries to load a mod from a directory
  // If mod_dir/mod.js is not found, tries to load mod_dir.js as a single file
  // Errors passed to onModLoadFail and raised
  let modjs_path // full path to js file
  let modjs_name // relative path to js file from mods dir
  var mod

  try {
    // const use_webpack_require = false

    // Global, but let us overwrite it for some cases
    let thisModsDir = modsDir
    let thisModsAssetRoot = modsAssetsRoot

    if (mod_dir.startsWith("_")) {
      // use_webpack_require = true
      thisModsDir = imodsDir
      thisModsAssetRoot = imodsAssetsRoot
    } 

    let is_singlefile = false
    if (mod_dir.endsWith(".js")) {
      // logger.debug(mod_dir, "is explicit singlefile.")
      is_singlefile = true
      modjs_name = mod_dir
      modjs_path = path.join(thisModsDir, mod_dir)
    } else {
      // Mod isn't explicitly a singlefile js, but might still be a singlefile that needs coercion
      try {
        const is_directory = !fs.lstatSync(path.join(thisModsDir, mod_dir)).isFile() // allow for junctions, symlinks
        if (!is_directory) throw new Error("Not a directory")

        // logger.debug(mod_dir, "confirmed as directory.")
        is_singlefile = false
        modjs_name = path.join(mod_dir, "mod.js")
        modjs_path = path.join(thisModsDir, modjs_name)
      } catch (e) {
        // Mod isn't an explicit singlefile or a directory
        // logger.debug(mod_dir, "must be singlefile.")
        is_singlefile = true
        modjs_name = mod_dir + ".js"
        modjs_path = path.join(thisModsDir, modjs_name)
      }
    }

    // if (use_webpack_require) {
    //   console.log(modjs_path)
    //   mod = require(modjs_path)
    // } else {
    /* eslint-disable no-undef */
    if (__non_webpack_require__.cache[modjs_path]) {
      // logger.info("Removing cached version", modjs_path)
      delete __non_webpack_require__.cache[modjs_path]
    } else {
      // logger.info(modjs_name, modjs_path, "not in cache")
      Object.keys(__non_webpack_require__.cache)
        .filter(cachepath => cachepath.endsWith(modjs_name))
        .forEach(cachepath => {
        logger.info("Removing partial match from cache", cachepath)
        delete __non_webpack_require__.cache[cachepath]
      })
    }

    try {
      // eslint-disable-next-line no-undef
      mod = __non_webpack_require__(modjs_path)
    } catch (e) {
      // imod 
      if (mod_dir.startsWith("_")) {
        console.log("Caught error importing imod")
        if (options.noReextractImods) {
          console.log("Already tried to re-extract imods, refusing to infinite loop")
          throw e
        }
        if (expectWorkingState()) {
          console.log("Couldn't load imod, trying re-extract")
          extractimods()
        } else {
          console.log('Asset pack not found.')
          throw e
        }
        console.log("Retrying import")
        // eslint-disable-next-line no-undef
        return getModJs(mod_dir, {...options, noReextractImods: true})
      } else {
        console.log("mod", mod_dir, "is not imod, unrecoverable require error")
        throw e
      }
    }
    // }

    mod._id = mod_dir
    mod._singlefile = is_singlefile
    mod._internal = mod_dir.startsWith("_")

    if (!is_singlefile) {
      mod._mod_root_dir = path.join(thisModsDir, mod._id)
      mod._mod_root_url = new URL(mod._id, thisModsAssetRoot).href + "/"
    }

    if (!options.liteload && (mod.computed != undefined)) {
      const api = buildApi(mod)
      Object.assign(mod, mod.computed(api))
    }

    // Computed properties don't automatically require a reload because
    // the object has been assigned any computed properties by now.
    mod._needsArchiveReload = [
      'edit', 'mspfa'
    // eslint-disable-next-line no-prototype-builtins
    ].some(k => mod.hasOwnProperty(k))
    mod._needsHardReload = [
      'styles', 'vueHooks', 'themes', 
      'browserPages', 'browserActions', 'browserToolbars'
    // eslint-disable-next-line no-prototype-builtins
    ].some(k => mod.hasOwnProperty(k))

    return mod
  } catch (e1) {
    const e1_is_notfound = (e1.code && e1.code == "MODULE_NOT_FOUND")
    if (e1_is_notfound) {
      // Tried singlefile, missing
      logger.error("Missing file", mod_dir)
      removeModsFromEnabledList([mod_dir])
      return null
    } else {
      // Singlefile found, other error
      logger.error("File found, other error")
      onModLoadFail([mod_dir], e1)
      throw e1
    }
  }
}

const footnote_categories = ['story']

// ====================================
// Interface

function editArchive(archive) {
  if (!expectWorkingState()) {
    logger.info("No asset directory set, probably in new reader setup mode. Not editing the archive.")
    return
  }
  const enabledModsJs = getEnabledModsJs()
  enabledModsJs.reverse().forEach((js) => {
    try {
      const editfn = js.edit
      if (editfn) {        
        logger.info(js._id, "editing archive")
        editfn(archive)
        console.assert(archive, js.title, "You blew it up! You nuked the archive!")
      
        // Sanity checks
        // let required_keys = ['mspa', 'social', 'news', 'music', 'comics', 'extras']
        // required_keys.forEach(key => {
        //   if (!archive[key]) throw new Error("Archive object missing required key", key)
        // })
      }
    } catch (e) {
      onModLoadFail([js._id], e)
      throw e
    }
  })

  // Footnotes
  archive.footnotes = {}

  footnote_categories.forEach(category => {
    archive.footnotes[category] = []
  })

  enabledModsJs.reverse().forEach((js) => {
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
      onModLoadFail([js._id], e)
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
        if (!archive.footnotes[category][page_num]) archive.footnotes[category][page_num] = []

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
        if (!Array.isArray(modstyles)) {
          throw Error(`${js._id} styles object is not a list`)
        }
        modstyles.forEach((customstyle, i) => {
          const style_id = `style-${js._id}-${i}`
          
          var body
          if (customstyle.source) {
            console.assert(!customstyle.body, style_id, "Styles cannot set both source and body. Use multiple style objects.")
            body = sass.renderSync({
              file: path.resolve(js._mod_root_dir, customstyle.source),
              sourceComments: true
            }).css.toString()
          } else if (customstyle.body) {
            console.assert(!customstyle.source, style_id, "Styles cannot set both source and body. Use multiple style objects.")
            body = sass.renderSync({
              data: customstyle.body,
              sourceComments: true
            }).css.toString() || customstyle.body
          } else {
            console.assert(false, customstyle, "Styles must define some sort of body!")
          }

          this.stylesheets.push({
            id: style_id, body
          })
        })

        const modThemes = js.themes || []
        modThemes.forEach((theme, i) => {
          const theme_class = `theme-${js._id}-${i}`

          let body = fs.readFileSync(path.resolve(js._mod_root_dir, theme.source))
          body = sass.renderSync({
            data: `#app.${theme_class}, #app > .${theme_class} {\n${body}\n}`,
            sourceComments: true
          }).css.toString()

          this.stylesheets.push({
            id: theme_class, body
          })
        })
      })
    }
  }
}

function getMixins(){
  // This is absolutely black magic

  const nop = () => undefined

  const enabledModsJs = getEnabledModsJs()

  // List of mods
  var mixable_mods = enabledModsJs.reverse()

  // Add mod that contains custom themes
  var newThemes = enabledModsJs.reverse().reduce((themes, js) => {
    if (!js.themes) return themes
    return themes.concat(js.themes.map((theme, i) => 
        ({text: theme.label, value: `theme-${js._id}-${i}`})
      ))
  }, [])
  if (newThemes) {
    mixable_mods.push({
      name: "!themes",
      vueHooks: [{
        matchName: "settings",
        data: {themes($super) {return $super.concat(newThemes)}}
      }]
    })
  }

  // Add mod that contains custom pages
  var newPages = enabledModsJs.reverse().reduce((pages, js) => {
    if (!js.browserPages) return pages
    return {...js.browserPages, ...pages}
  }, {})
  if (newPages) {
    var pageComponents = {}
    for (let k in newPages)
      pageComponents[k] = newPages[k].component

    mixable_mods.push({
      title: "!pages",
      vueHooks: [{
        matchName: "TabFrame",
        data: {modBrowserPages($super) {return {...newPages, ...$super}}},
        created(){
          this.$options.components = Object.assign(this.$options.components, pageComponents)
        }
      }]
    })
  }

  // Add mod that contains custom browser actions
  var newBrowserActions = enabledModsJs.reverse().reduce((actions, js) => {
    if (js.browserActions) {
      for (let k in js.browserActions) {
        const componentkey = `${js._id}-${k}`
        actions[componentkey] = js.browserActions[k]
      }
    }
    return actions
  }, {})
  if (newBrowserActions) {
    var actionComponents = {}
    for (let ck in newBrowserActions)
      actionComponents[ck] = newBrowserActions[ck].component

    mixable_mods.push({
      title: "!actions",
      vueHooks: [{
        matchName: "addressBar",
        // browserActions are raw components
        data: {browserActions($super) {return {...actionComponents, ...$super}}}
      }]
    })
  }

  // Add mod that contains custom browser toolbars
  var newBrowserToolbars = enabledModsJs.reverse().reduce((toolbars, js) => {
    if (js.browserToolbars) {
      for (let k in js.browserToolbars) {
        const componentkey = `${js._id}-${k}`
        toolbars[componentkey] = js.browserToolbars[k]
      }
    }
    return toolbars
  }, {})
  if (newBrowserToolbars) {
    var toolbarComponents = {}
    for (let ck in newBrowserToolbars)
      toolbarComponents[ck] = newBrowserToolbars[ck].component

    mixable_mods.push({
      title: "!toolbars",
      vueHooks: [{
        matchName: "tabBar",
        // browserToolbars are raw components
        data: {browserToolbars($super) {return {...toolbarComponents, ...$super}}}
      }]
    })
  }

  // mixable_mods is now a list of mods that may add mixins.
  // logger.info(mixable_mods)

  const vueHooksByName = {}
  const vueHooksMatchFn = []

  mixable_mods.forEach((js) => {
    const vueHooks = js.vueHooks || []
    if (vueHooks.length == 0) {
      return null
    }

    // Precompute as much as possible since mixins run everywhere
    vueHooks.forEach((hook) => {
      // Not actually shorthand
      if (hook.matchName) {
        vueHooksByName[hook.matchName] = (vueHooksByName[hook.matchName] || [])
        vueHooksByName[hook.matchName].push(hook)
      } else {
        vueHooksMatchFn.push(hook)
      }
    })
  })

  const mixin =  {
    created() {
      const vueComponent = this

      this._uhc_matching_hooks = [
        ...(this._uhc_matching_hooks || []), // existing hooks
        ...vueHooksMatchFn.filter(hook => hook.match(this)), // Complex hooks
        ...(vueHooksByName[this.$options.name] || [])        // named hooks 
      ]

      // Hook things
      // Normally mixins are ignored on name collision
      // We need to do the opposite of that, so we hook `created`
      this._uhc_matching_hooks.forEach(hook => {
        // Literal created hook
        if (hook.created)
          hook.created.bind(this)()

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
      })
    },
    updated() {
      this._uhc_matching_hooks.filter(hook => hook.updated).forEach(hook => {
        hook.updated.bind(this)()
      })
    },
    mounted() {
      this._uhc_matching_hooks.filter(hook => hook.mounted).forEach(hook => {
        hook.mounted.bind(this)()
      })
    },
    destroyed() {
      this._uhc_matching_hooks.filter(hook => hook.destroyed).forEach(hook => {
        hook.destroyed.bind(this)()
      })
    }
  }

  return [mixin]
}

// Runtime
// Grey magic. This file can be run from either process, but only the main process will do file handling.
function jsToChoice(js, dir){
  return {
    label: js.title,
    summary: js.summary,
    description: js.description,
    author: js.author,
    modVersion: js.modVersion,
    locked: js.locked,

    hasmeta: Boolean(js.author || js.modVersion || js.settings || js.description),
    needsArchiveReload: js._needsArchiveReload,
    needsHardReload: js._needsHardReload,
    settingsmodel: js.settings,
    key: dir,

    includes: {
      routes: Boolean(js.routes || js.treeroute || js.trees),
      edits: Boolean(js.edit),
      hooks: (js.vueHooks 
        ? Array.from(new Set(js.vueHooks.map(h => (h.matchName || "[complex]")))) 
        : false),
      browserPages: js.browserPages ? Object.keys(js.browserPages) : false,
      toolbars: Boolean(js.browserToolbars),
      browserActions: Boolean(js.browserActions),
      styles: Boolean(js.styles),
      footnotes: Boolean(js.footnotes),
      themes: Boolean(js.themes)
    }
  }
}

if (ipcMain) {
  // We are in the main process.
  function loadModChoices(){
    // Get the list of mods players can choose to enable/disable
    var mod_folders
    try {
      if (fs.existsSync(assetDir) && !fs.existsSync(modsDir)){
        logger.info("Asset pack exists but mods dir doesn't, making empty folder")
        fs.mkdirSync(modsDir)
      }
      const tree = crawlFileTree(modsDir, false)

      // Extract zips
      const outpath = path.join(assetDir, "mods")

      if (!fs.existsSync(outpath))
        fs.mkdirSync(outpath)

      const zip_archives = Object.keys(tree).filter(p => /\.zip$/.test(p))
      zip_archives.forEach(zip_name => {
        const zip_path = path.join(modsDir, zip_name)
        console.log(`Extracting ${zip_path} to ${outpath}`)
        fs.createReadStream(zip_path).pipe(
          unzipper.Extract({
            path: outpath, 
            concurrency: 5
          })
        ).on('finish', function() {
          setTimeout(() => fs.unlink(zip_path, err => {
            if (err) console.log(err)
          }), 200) // OS doesn't release it right away even after finish
        })
      })

      // .js file or folder of some sort
      mod_folders = Object.keys(tree).filter(p => 
        /\.js$/.test(p) || 
        (tree[p] === undefined && fs.existsSync(path.join(modsDir, p, "mod.js"))) || 
        logger.warn("Not a mod:", p, path.join(p, "mod.js"))
      )
    } catch (e) {
      // No mod folder at all. That's okay.
      logger.error(e)
      return []
    }

    var items = mod_folders.reduce((acc, dir) => {
      try {
        const js = getModJs(dir, {liteload: true})
        if (js === null || js.hidden === true)
          return acc // continue

        acc[dir] = jsToChoice(js, dir)
      } catch (e) {
        // Catch import-time mod-level errors
        logger.error("Couldn't load mod choice", e)
        // Can't fail here: haven't loaded enough main to even show a dialog.
        // onModLoadFail([dir], e)
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
}

function getModChoices() {
  if (ipcMain) {
    return modChoices
  } else {
    return ipcRenderer.sendSync('GET_AVAILABLE_MODS')
  }
}

export default {
  getEnabledModsJs,  // bg
  getEnabledMods,
  getModChoices, // fg
  getMixins, // fg
  getMainMixin, // fg
  editArchive, // bg
  bakeRoutes, // bg
  getAssetRoute, // bg, fg
  getModStoreKey, // fg
  giveWindow, // bg
  modChoices,
  modsDir, // fg
  extractimods, // bg

  doFullRouteCheck // fg
}
