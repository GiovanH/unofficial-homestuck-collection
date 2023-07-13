import yaml from 'js-yaml'

// isWebApp for main-process electron execution
const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false

var ipcMain, dialog, unzipper, fs
var store, store_mods, log
if (!isWebApp) {
  var {ipcMain, dialog} = require('electron')

  log = require('electron-log')

  unzipper = require("unzipper")

  const Store = require('electron-store')
  store = new Store()

  store_mods = new Store({
    name: "mods",
    migrations: {
      '2.3.0': store_mods => {
        if (store.has('mod')) {
          store_mods.set(store.get('mod'))
          store.delete('mod')
        }
      }
    }
  })

  fs = require('fs')
}

const path = (isWebApp ? require('path-browserify') : require('path'))
const ipcRenderer = require('electron').ipcRenderer

// const sass = require('sass')
const SassJs = require('sass.js')

const logger = log.scope('Mods')

const assetDir = store.has('assetDir') ? store.get('assetDir') : undefined
const modsDir = (isWebApp && window.webAppModsDir) || (assetDir ? path.join(assetDir, "mods") : undefined)
const modsAssetsRoot = "assets://mods/"

const imodsDir = (isWebApp && window.webAppIModsDir) || (assetDir ? path.join(assetDir, "archive", "imods") : undefined)
const imodsAssetsRoot = "assets://archive/imods/"

var modChoices = undefined
var routes = undefined

const store_modlist_key = 'settings.modListEnabled'
// const store_devmode_key = 'settings.devMode'

let validatedState = false
function expectWorkingState(){
  if (validatedState || isWebApp) return true
  validatedState = (modsDir && assetDir && fs.existsSync(path.join(assetDir, "archive")))
  return validatedState
}

var want_imods_extracted = false

var setLoadStage

if (ipcRenderer) {
  ipcRenderer.on('MODS_EXTRACT_IMODS_PLEASE', (event, payload) => {
    want_imods_extracted = true
  })
  setLoadStage = function(stage) {
    ipcRenderer._events['SET_LOAD_STAGE'](null, stage)
  }
}

// ====================================
// Routing

// Function exposed for SubSettingsModal, which directly writes to store

function getModStoreKey(mod_id, k){
  if (k) {return `${getModStoreKey(mod_id)}.${k}`}
  return `${mod_id.replace('.', '-')}`
}

function getAssetRoute(url) {
  // If the asset url `url` should be replaced by a mod file,
  // returns the path of the mod file. 
  // Otherwise, returns undefined.
  if (!expectWorkingState())
    return undefined

  // Lazily bake routes as needed instead of a init hook
  if (routes == undefined) {
    logger.warn("Routes not loaded yet", (ipcMain ? 'main' : 'render'))
    return undefined
  //   logger.info("Baking routes lazily, triggered by", url)
  //   bakeRoutes()
  }

  if (!url.startsWith("assets://")) {
    throw Error("getAssetRoute passed a non-asset URI " + url)
  }

  const file_route = routes[url]
  if (file_route) logger.debug(url, "to", file_route)
  return file_route
}

function getTreeRoutes(tree, parent = "") {
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

async function extractimods() {
  if (!expectWorkingState()) {
    logger.info("Not yet in working state, not extracting imods.")
    return
  }
  // TODO: Some people report occasionally getting "__webpack_require__.match is not a function or its return value is not iterable" at this line. Have not been able to reproduce the error so far.

  const Tar = await import('tar')
  let tardata
  try {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    tardata = (await import("!url-loader!./imods.tar")).default // Require *must* have a literal string here
  } catch (e) {
    logger.error(`Couldn't read bundled tar data: webpack issue?`)
    throw e
  }
  const [match, contentType, base64] = tardata.match(/^data:(.+);base64,(.*)$/)
  const tar_buffer = Buffer.from(base64, 'base64')

  const outpath = path.join(assetDir, "archive")
  const temp_tar_path = path.join(outpath, '_imods.tar')
  logger.info("Saving imods tar to ", temp_tar_path)

  await fs.promises.writeFile(temp_tar_path, tar_buffer)
  logger.info("Extracting imods to ", outpath)
  await Tar.extract({
    file: temp_tar_path,
    cwd: outpath
  })
  fs.unlink(temp_tar_path, err => {
    if (err) logger.error(err)
  })
}

function removeModsFromEnabledList(responsible_mods) {
  // Clear enabled mods
  const old_enabled_mods = getEnabledMods()
  const new_enabled_mods = old_enabled_mods.filter(x => !responsible_mods.includes(x)).filter(x => !x.startsWith("_"))
  logger.debug("Changing modlist", old_enabled_mods, new_enabled_mods)

  if ((typeof window !== 'undefined') && window.vm) {
    window.vm.$localData.settings.modListEnabled = new_enabled_mods
    window.vm.$localData.VM.saveLocalStorage()
    window.vm.$localData.VM._saveLocalStorage()
  } else {
    logger.warn("No VM, updating store directly.")
    store.set(store_modlist_key, new_enabled_mods)
  }
}

// var onModLoadFail;

// if (ipcMain) {
//   onModLoadFail = function (responsible_mods, e) {
//     if (!expectWorkingState())
//       return // Pre-setup, we're probably fine ignoring this.

//     store.set("needsRecovery", true)

//     if (win) {
//       console.error(e) // Error can't serialize to the window
//       win.webContents.send('MOD_LOAD_FAIL', responsible_mods, e)
//     } else {
//       logger.warn("MAIN: Mod load failure with issues in", responsible_mods)
//       logger.error(e)
//       logger.error("Don't have win!")
//       // This only happens if we can't even display the pretty traceback. Absolute fallback.
//       dialog.showMessageBoxSync({
//         type: 'error',
//         title: 'Mod load error',
//         message: `Something went wrong while loading mods ${responsible_mods}! These have been disabled for safety; you should remove them from the Active list and you may need to restart the application.\nCheck the console log for details`
//       })
//       removeModsFromEnabledList(responsible_mods)
//     }
//   }
// } else {
  // We are in the renderer process.
// if (!ipcMain) {
function onModLoadFail(responsible_mods, e) {
  if (!expectWorkingState())
    return // Pre-setup, we're probably fine ignoring this.

  store.set("needsRecovery", true)

  logger.warn("RENDER: Mod load failure with modlist", responsible_mods)
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
      <p>For troubleshooting, save this error message or the <a href="${log.transports ? log.transports.file.getFile() : ''}">log file</a></p><br />
      <p>Stacktrace:</p>
      <pre>${sanitizeHTML(e.stack)}</pre>
    </div>
  </div>`
}
//   ipcRenderer.on('MOD_LOAD_FAIL', (event, responsible_mods, e) => {
//     onModLoadFail(responsible_mods, e)
//   })
// }

async function bakeRoutes(enabled_mods_js) {
  const enabled_mods = getEnabledMods()
  if (!expectWorkingState()) {
    logger.warn("No asset directory set, not baking any routes")
    return
  }
  logger.info("Baking routes for", enabled_mods)
  const all_mod_routes = {}
  // Start with least-priority so they're overwritten
  enabled_mods_js.reverse().forEach(js => {
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
      logger.error(js.trees, js.routes, e)
      onModLoadFail([js._id], e)
    }
  })

  routes = all_mod_routes

  // logger.debug(all_mod_routes)
  if (ipcRenderer) {
    // logger.debug('Render sending routes to main')
    ipcRenderer.invoke('MODS_UPDATE_ROUTES', routes)
  }
}
if (ipcMain) {
  // Update `routes` in the background process scope, for when
  // Resources needs to fetch route info statically.
  ipcMain.handle('MODS_UPDATE_ROUTES', (event, all_mod_routes) => {
    // logger.debug('Main updating routes from render msg')
    routes = all_mod_routes
  })
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
  const list = ((isWebApp && window.vm)
    ? [...window.vm.$localData.settings["modListEnabled"]]
    : (store.has(store_modlist_key)
        ? store.get(store_modlist_key)
        : []))

  // logger.debug("got mod settings", store_modlist_key, list)

  list.push("_twoToThree")

  if (store.get('settings.unpeachy'))
    list.push("_unpeachy")
  if (store.get('settings.pxsTavros'))
    list.push("_pxsTavros")
  if (store.get('settings.jsFlashes'))
    list.push("_replaybound")

  // Soluslunes must load after bolin
  if (store.get('settings.soluslunes'))
    list.push("_soluslunes")

  // Bolin must come before hqaudio in the stack so it loads after it.
  if (store.get('settings.bolin'))
    list.push("_bolin")

  if (store.get('settings.hqAudio'))
    list.push("_hqAudio")

  if (!store.get('settings.newReader.limit'))
    list.push("_secret")

  return list
}

async function getEnabledModsJs(opts) {
  // Get the array of currently enabled mod modules. opts are passed to getModJs (i.e. nocache)
  var options = opts || {}
  if (!modsDir) {
    logger.warn("No asset directory set, can't load any mods.")
    return []
  }
  try {
    const enabled_mod_modules = await Promise.all(
      getEnabledMods().map(
        async (dir) => await Promise.resolve(getModJs(dir, options))
      )
    )
    return enabled_mod_modules.filter(Boolean)
  } catch (e) {
    logger.error("Couldn't load enabled mod js'", e)
    return []
  }
}

function searchWebAppModTrees(path) {
  function * search(data, values) {
    for (const value of values)
      yield * search1(data, value)
  }

  function * search1(data, value) {
    if (Object(data) === data) {
      for (const key of Object.keys(data)) {
        if (key === value)
          yield data[key]
        else
          yield * search1(data[key], value)
      }
    }
  }

  let result
  for (result of search(window.webAppModTrees, path.split('/'))) {
    // result = result
  }

  return result
}

function crawlFileTree(root, recursive = false) {
  // Gives a object that represents the file tree, starting at root
  // Values are objects for directories or true for files that exist
  const dir = fs.opendirSync(root)
  const ret = {}
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
  const Resources = require("@/resources.js")
  function safetyChecks(local_path) {
    if (mod._singlefile) throw new Error(`Singlefile mods cannot use this method`)
    if (!local_path.startsWith("./")) throw new Error(local_path, `Paths must be mod relative (./)`)
    if (local_path.includes("/..")) throw new Error(local_path, "You know what you did")
  }
  function readFileSyncLocal(local_path, method_name) {
    safetyChecks(local_path)
    return fs.readFileSync(path.join(mod._mod_root_dir, local_path), 'utf8')
  }
  function readFileAsyncLocal(local_path, method_name) {
    safetyChecks(local_path)
    return fs.promises.readFile(path.join(mod._mod_root_dir, local_path))
  }

  var this_store_cache = {}
  var cached_undefined = "_CACHED_UNDEFINED_"

  const api = {
    store: {
      set: (k, v) => {
        this_store_cache[k] = (v == undefined ? cached_undefined : v)
        return store_mods.set(getModStoreKey(mod._id, k), v)
      },
      get: (k, default_) => {
        if (this_store_cache[k] != undefined) {
          if (this_store_cache[k] == cached_undefined) return undefined
          else return this_store_cache[k]
        } else {
          const v = store_mods.get(getModStoreKey(mod._id, k), default_)
          this_store_cache[k] = (v == undefined ? cached_undefined : v)
          return v
        }
      },
      has: (k) => this_store_cache[k] || store_mods.has(getModStoreKey(mod._id, k)),
      delete: (k) => {
        delete this_store_cache[k]
        store_mods.delete(getModStoreKey(mod._id, k))
      },
      onDidChange: (k, cb) => store_mods.onDidChange(getModStoreKey(mod._id, k), cb),
      clear: () => {
        this_store_cache = {}
        store_mods.clear(getModStoreKey(mod._id, null))
      }
    }, 
    readFile(asset_path) {
      return readFileSyncLocal(asset_path, "readFile")
    },
    readJson(asset_path) {
      return JSON.parse(readFileSyncLocal(asset_path, "readJson"))
    },
    readYaml(asset_path) {
      return yaml.safeLoad(readFileSyncLocal(asset_path, "readYaml"))
    },
    readFileAsync(asset_path, callback) {
      return readFileAsyncLocal(asset_path, "readFileAsync").then(callback)
    },
    readJsonAsync(asset_path, callback) {
      return readFileAsyncLocal(asset_path, "readJsonAsync").then(text => JSON.parse(text)).then(callback)
    },
    readYamlAsync(asset_path, callback) {
      return readFileAsyncLocal(asset_path, "readYamlAsync").then(text => yaml.safeLoad(text)).then(callback)
    },
    Resources
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

const mod_js_cache = {}

async function getModJs(mod_dir, options = {}) {
  // Tries to load a mod (`require'd module) from a directory
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

      if (options.nocache) {
        /* eslint-disable no-undef */
        if (__non_webpack_require__.cache[modjs_path]) {
          // logger.info("Removing cached version", modjs_path)
          delete __non_webpack_require__.cache[modjs_path]
        } else {
          // logger.info(modjs_name, modjs_path, "not in cache")
          Object.keys(__non_webpack_require__.cache)
            .filter(cachepath => cachepath.endsWith(modjs_name))
            .forEach(cachepath => {
            // logger.info("Removing partial match from cache", modjs_path, modjs_name, cachepath)
            delete __non_webpack_require__.cache[cachepath]
          })
        }
      } else {
        if (mod_js_cache[modjs_path]) {
          console.debug("Using cached", modjs_path)
          return mod_js_cache[modjs_path]
        }
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
          return await Promise.resolve(getModJs(mod_dir, {...options, noReextractImods: true}))
        } else {
          console.log("mod", mod_dir, "is not imod, unrecoverable require error")
        throw e
      }
    }

    mod._id = mod_dir
    mod._singlefile = is_singlefile
    mod._internal = mod_dir.startsWith("_")

    if (!is_singlefile) {
      mod._mod_root_dir = path.join(thisModsDir, mod._id)
      mod._mod_root_url = new URL(mod._id, thisModsAssetRoot).href + "/"
    }

    if (!options.liteload) {
      let api
      if (mod.computed != undefined) {
        api = api || buildApi(mod)
        Object.assign(mod, mod.computed(api))
      }
      if (mod.asyncComputed != undefined) {
        api = api || buildApi(mod)
        mod._fullyLoadedPromise = mod.asyncComputed(api).then(result => {
          Object.assign(mod, result)
        })
      } else {
        mod._fullyLoadedPromise = false
      }
    }

    // Computed properties don't automatically require a reload because
    // the object has been assigned any computed properties by now.

    // Anything editArchive depends on
    mod._needsArchiveReload = [
      'edit', 'footnotes',
      'routes', 'trees'
    // eslint-disable-next-line no-prototype-builtins
    ].some(k => mod.hasOwnProperty(k))

    // Anything that needs to recompute vueHooks (and restart the vm)
    mod._needsHardReload = [
      'styles', 'vueHooks', 'themes', 
      'browserPages', 'browserActions', 'browserToolbars'
    // eslint-disable-next-line no-prototype-builtins
    ].some(k => mod.hasOwnProperty(k))

    if (!options.liteload) {
      // console.debug("Caching", modjs_path)
      mod_js_cache[modjs_path] = mod
    }

    return mod
  } catch (e1) {
    const e1_is_notfound = (e1.code && e1.code === "MODULE_NOT_FOUND")
    if (e1_is_notfound) {
      // Tried singlefile, missing
      logger.error("Missing file", mod_dir, e1)
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

async function editArchive(archive) {
  if (!expectWorkingState()) {
    logger.warn("No asset directory set, probably in new reader setup mode. Not editing the archive.")
    return
  }

  if (want_imods_extracted) {
    setLoadStage("EXTRACT_IMODS")
    await extractimods()
    want_imods_extracted = false // we did it
  }

  setLoadStage("READ_MODS")
  const enabledModsJs = await Promise.resolve(getEnabledModsJs({nocache: true}))

  const bakeRoutesPromise = bakeRoutes(enabledModsJs) // run in background

  // Footnotes
  archive.footnotes = {}

  footnote_categories.forEach(category => {
    archive.footnotes[category] = []
  })

  for (const js of enabledModsJs.reverse()) {
    // Fully await any computed properties to be resolved
    await Promise.resolve(js._fullyLoadedPromise)

    // Load footnotes into archive
    try {
      if (js.footnotes) {
        !js._internal && setLoadStage(`${js._id} adding footnotes`)
        if (typeof js.footnotes == "string") {
          console.assert(!js._singlefile, js.title, "Single file mods cannot use footnote files!")

          const json_path = path.join(
            js._mod_root_dir,
            js.footnotes
          )

          logger.info(js.title, "Loading footnotes from file", json_path)
          const footObj = JSON.parse(
            await fs.promises.readFile(json_path)
          )
          mergeFootnotes(archive, footObj)
        } else if (Array.isArray(js.footnotes)) {
          logger.info(js.title, "Loading footnotes from object")
          mergeFootnotes(archive, js.footnotes)
        } else {
          throw new Error(`${js.title} Incorrectly formatted mod. Expected string or array, got '${typeof jsfootnotes}'`)
        }
      }
    } catch (e) {
      console.error(e)
      onModLoadFail([js._id], e)
    }

    // Run archive edit function
    try {
      const editfn = js.edit
      if (editfn) {
        !js._internal && setLoadStage(`${js._id} editing story`)
        logger.debug(js._id, "editing archive")
        editfn(archive)
      }
    } catch (e) {
      onModLoadFail([js._id], e)
      throw e
    }
  }
  await bakeRoutesPromise
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

  const enabledModsJsPromise = Promise.resolve(getEnabledModsJs()) // Promise
  return {
    mounted() {
      const addScssStyle = (style_id, body) => {
        SassJs.compile(body, (result) => {
          if (result.status !== 0) throw Error(result)
          this.stylesheets.push({
            id: style_id,
            body: result.text
          })
        })
      }

      enabledModsJsPromise.then(modules => {
        modules.forEach(js => {
          const modstyles = js.styles || []
          if (!Array.isArray(modstyles)) {
            throw Error(`${js._id} styles object is not a list`)
          }

          // Render stylesheets from mod css
          modstyles.forEach((customstyle, i) => {
            const style_id = `style-${js._id}-${i}`

            if (customstyle.source && customstyle.body) {
              throw Error("Styles cannot set both source and body. Use multiple style objects.")
            }

            if (customstyle.source) {
              const scss_path = path.resolve(js._mod_root_dir, customstyle.source)
              fs.readFile(scss_path, 'utf8', (err, body) => {
                if (err) throw err
                addScssStyle(style_id, body)
              })
            } else if (customstyle.body) {
              addScssStyle(style_id, customstyle.body)
            } else {
              throw Error("Styles must define some sort of body!")
            }
          })

          // Render stylesheets from mod themes
          const modThemes = js.themes || []
          modThemes.forEach((theme, i) => {
            const theme_class = `theme-${js._id}-${i}`
            const scss_path = fs.readFileSync(path.resolve(js._mod_root_dir, theme.source))
            fs.readFile(scss_path, 'utf8', (err, body) => {
              if (err) throw err
              addScssStyle(theme_class, `#app.${theme_class}, #app > .${theme_class} {\n${body}\n}`)
            })
          })
        }) // end modules.foreach
      })
    }
  }
}

async function getMixinsAsync(){
  // This is absolutely black magic

  const nop = () => undefined

  const enabledModsJs = await Promise.resolve(getEnabledModsJs())

  // List of mods, ordered
  var mixable_mods = enabledModsJs.reverse()

  // Add mod that contains vue hooks for custom themes
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

  // Add mod that contains vue hooks custom pages
  var newPages = enabledModsJs.reverse().reduce((pages, js) => {
    if (!js.browserPages) return pages
    return {...js.browserPages, ...pages}
  }, {})
  if (Object.keys(newPages).length) {
    var pageComponents = {}
    for (const k in newPages)
      pageComponents[k.toUpperCase()] = newPages[k].component

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
      for (const k in js.browserActions) {
        const componentkey = `${js._id}-${k}`
        actions[componentkey] = js.browserActions[k]
      }
    }
    return actions
  }, {})
  if (newBrowserActions) {
    var actionComponents = {}
    for (const ck in newBrowserActions)
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
      for (const k in js.browserToolbars) {
        const componentkey = `${js._id}-${k}`
        toolbars[componentkey] = js.browserToolbars[k]
      }
    }
    return toolbars
  }, {})
  if (newBrowserToolbars) {
    var toolbarComponents = {}
    for (const ck in newBrowserToolbars)
      toolbarComponents[ck] = newBrowserToolbars[ck].component

    mixable_mods.push({
      title: "!toolbars",
      vueHooks: [{
        matchName: "tabBar",
        // browserToolbars are raw components
        data: {
          browserToolbars($super) {
            return {...toolbarComponents, ...$super}
          }
        }
      }]
    })
  }

  // mixable_mods is now a list of mods (including our fake ones) that may add mixins.
  // logger.info(mixable_mods)

  const vueHooksByName = {}
  const vueHooksMatchFn = []

  mixable_mods.forEach((js) => {
    const vueHooks = js.vueHooks || []
    if (vueHooks.length === 0) {
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

  // Finally, create one master mixin
  const mixin = {
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
          const sup = () => this._computedWatchers[cname].getter.call(this) || nop
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

async function loadModChoicesAsync(){
  // Get the list of mods players can choose to enable/disable
  var mod_folders
  try {
    if (fs.existsSync(assetDir) && !fs.existsSync(modsDir)){
      logger.warn("Asset pack exists but mods dir doesn't, making empty folder")
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

  var items = mod_folders.reduce(async (acc_, dir) => {
    const acc = await acc_
    try {
      const js = await Promise.resolve(getModJs(dir, {liteload: true, nocache: true}))
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

async function getModChoicesAsync() {
  if (modChoices !== undefined) {
    return modChoices
  } else {
    modChoices = await loadModChoicesAsync()
    return modChoices
  }
}

export default {
  store_mods, // store object
  extractimods, // async, internal

  getModStoreKey, // sync, pure, used by subsettingsmodal
  modsDir, // var, referenced by settings

  modChoices, // var
  getModChoicesAsync, // async, main mixin $modChoices
  loadModChoicesAsync, // async, called by settings to refresh (promise-resolved)

  getMixinsAsync, // async, Mixed in in main.js
  getMainMixin, // sync, OK, Mixed in in app.vue to the main app only
  editArchive, // async, awaited in app.vue after loading archive

  getEnabledModsJs, // internal
  getEnabledMods, // internal

  bakeRoutes, // bakeRoutes(enabled_mods_js), sync, internal
  getAssetRoute, // sync, used by resources

  crawlFileTree, // internal/debug
  doFullRouteCheck, // internal/debug
  getRoutes() {return routes}, // debug
  ipcRenderer
}

// TODO Double-check all cases of calling MOD_ or MODS_ ipc calls
