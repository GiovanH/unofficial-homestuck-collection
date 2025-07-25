// isWebApp for main-process electron execution
const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false

const semver = require('semver')

const importSassJs = () => import('sass.js')
const importYaml = () => import('js-yaml')
const importResources = import("@/resources.js")

var Resources // lazy
var yaml

if (!Array.prototype.toReversed) {
  const toReversed = require('array.prototype.toreversed')
  toReversed.shim()
}

var ipcMain, fs
var store, store_mods, log
if (!isWebApp) {
  var {ipcMain} = require('electron')

  log = require('electron-log')
  log.transports.console.level = "info"

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
const ipcRenderer = require('IpcRenderer')

// const sass = require('sass')
// const SassJs = require('sass.js')
const logger = log.scope('Mods')

const assetDir = store.has('assetDir') ? store.get('assetDir') : undefined
const modsDir = (isWebApp && window.webAppModsDir) || (assetDir ? path.join(assetDir, "mods") : undefined)
const modsAssetsRoot = "assets://mods/"

const imodsDir = (isWebApp && window.webAppIModsDir) || (assetDir ? path.join(assetDir, "archive", "imods") : undefined)
const imodsAssetsRoot = "assets://archive/imods/"

var routes = undefined

const store_modlist_key = 'settings.modListEnabled'

var flag_failures_dont_interrupt = false

if (ipcMain) {
  logger.error("Main background process loading modsjs")
  console.trace()
}

let validatedState = false
function expectWorkingState(){
  if (validatedState || isWebApp) return true
  validatedState = (modsDir && assetDir && fs.existsSync(path.join(assetDir, "archive")))
  return validatedState
}

function fsExistsAsync(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, function(err, stat) {
      if (err == null) {
        resolve(true)
      } else if (err.code === 'ENOENT') {
        resolve(false)
      } else {
        reject(err)
      }
    })
  })
}

var want_imods_extracted = false

var setLoadStage

if (ipcRenderer) {
  ipcRenderer.on('MODS_EXTRACT_IMODS_PLEASE', (event, payload) => {
    logger.info("mods will extract imods on next update")
    want_imods_extracted = true
  })
  setLoadStage = function(stage) {
    try {
      logger.debug(stage)
      window.vm.$root.loadStage = stage
      // ipcRenderer._events['SET_LOAD_STAGE'](null, stage)
    } catch (e) {
      logger.warn(e)
    }
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
    logger.warn("Routes not loaded yet", (ipcMain ? 'main' : 'render'), url)
    return undefined
  //   logger.info("Baking routes lazily, triggered by", url)
  //   bakeRoutes()
  }

  if (!url.startsWith("assets://")) {
    throw Error("getAssetRoute passed a non-asset URI " + url)
  }

  const file_route = routes[url]
  if (file_route) logger.debug("Routing", url, "to", file_route)
  return file_route
}

function getTreeRoutes(tree, parent = "") {
  let temp_routes = []
  for (const name in tree) {
    const dirent = tree[name]
    const subpath = (parent ? parent + "/" + name : name)
    if (dirent == true) {
      // Path points to a file of some sort
      temp_routes.push(subpath)
    } else {
      // Recurse through subpaths
      temp_routes = temp_routes.concat(getTreeRoutes(dirent, subpath))
    }
  }
  return temp_routes
}

// ====================================
// Installation and list managment

async function extractimods() {
  if (!expectWorkingState()) {
    logger.info("Not yet in working state, not extracting imods.")
    return
  }
  if (isWebApp) {
    logger.error("Refusing to extract imods in webapp mode. Should not have called this!")
    return
  }
  // Some people report occasionally getting "__webpack_require__.match is not a function or its return value is not iterable" at this line. Have not been able to reproduce the error so far.

  setLoadStage("VALIDATE_IMODS_EXTRAS")
  try {
    const Validation = await import('@/js/validation.js')
    const crc_table_imods = await import('@/js/crc_imods.json')
    const state = await Validation.validateFiles(imodsDir, crc_table_imods)
    for (const extra_path of state.extra_paths) {
      const target_path = path.join(imodsDir, extra_path)
      logger.warn("Deleting extra imod file", target_path)
      fs.unlink(target_path, err => {
        if (err) logger.error(err)
      })
    }
  } catch (e) {
    if (e.code == "ENOENT") {
      // First run, pass
    } else {
      throw e
    }
  }
  // There may be validation entries for missing files here
  // if imods' crc file was built with WIP files in the working tree.
  // Since we just extracted the tar file successfully, ignore these...

  setLoadStage("EXTRACT_IMODS")
  const Tar = await import('tar')
  let tardata
  try {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    tardata = (await import("!url-loader!./imods.tar.gz")).default // Require *must* have a literal string here
  } catch (e) {
    logger.error(`Couldn't read bundled tar data: webpack issue?`)
    throw e
  }
  const [match, contentType, base64] = tardata.match(/^data:(.+);base64,(.*)$/)
  const tar_buffer = Buffer.from(base64, 'base64')

  const outpath = path.join(assetDir, "archive")
  const temp_tar_path = path.join(outpath, '_imods.tar.gz')
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

function onModLoadFail(responsible_mods, e) {
  if (!expectWorkingState() || flag_failures_dont_interrupt)
    return // Pre-setup, we're probably fine ignoring this.

  // eslint-disable-next-line no-debugger
  debugger // If you have devtools open, break here! Inspection time!

  if (window.vm && window.vm.loadStage) {
    // If we have a functional VM, pass error info to error recovery
    logger.warn("RENDER: Mod load failure with modlist", responsible_mods)
    logger.error(e)

    window.vm.$root.loadState = "ERROR"
    window.vm.$root.loadError = e
    window.vm.$root.loadErrorResponsibleMods = responsible_mods
  } else {
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
}

async function bakeRoutes(enabled_mods_js) {
  if (!expectWorkingState()) {
    logger.warn("No asset directory set, not baking any routes")
    return
  }
  logger.debug("Baking routes for", enabled_mods_js.map(j => j._id))
  const all_mod_routes = {}
  // Start with least-priority so they're overwritten
  for (const js of enabled_mods_js.toReversed()) {
    try {
      // Lower priority: Auto routes
      if (js.trees) {
        console.assert(!js._singlefile, js.title, "Single file mods cannot use treeroute!")
        
        for (const mod_tree in js.trees) {
          const asset_tree = js.trees[mod_tree] 

          console.assert(mod_tree.endsWith("/"), mod_tree, "Tree paths must be directories! (end with /)")
          console.assert(asset_tree.endsWith("/"), asset_tree, "Tree paths must be directories! (end with /)")
          console.assert(asset_tree.startsWith("assets://"), asset_tree, "Asset paths must be on the assets:// protocol!")

          const tree = await crawlFileTree(path.join(js._mod_root_dir, mod_tree), true)
          const treeroutes = getTreeRoutes(tree)

          treeroutes.forEach(route => {
            const route_href = new URL(asset_tree + route).href
            const dest_href = new URL((path.posix || path).join(mod_tree, route), js._mod_root_url).href
            if (route_href == dest_href) {
              console.warn(`${js._id} tried to route an asset to itself: ${route_href}`)
            } else {
              all_mod_routes[route_href] = dest_href
            }
          })
        }
      }
      
      // Higher priority: explicit routes
      for (const key in js.routes || {}) {
        const local = new URL(js.routes[key], js._mod_root_url).href
        console.assert(!(js._singlefile && local.includes(js._mod_root_url)), js.title, "Single file mods cannot use local route!")
                
        all_mod_routes[key] = local
      }
    } catch (e) {
      logger.error(js.trees, js.routes, e)
      onModLoadFail([js._id], e)
    }
  }

  routes = all_mod_routes
}

async function doFullRouteCheck(){
  logger.debug("Doing full resources check (devMode on)")
  const enabled_mods = getEnabledMods()
  Resources = Resources || await importResources
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

  // Easy tweaks

  list.push("_twoToThree")

  if (store.get('settings.unpeachy'))
    list.push("_unpeachy")
  if (store.get('settings.pxsTavros'))
    list.push("_pxsTavros")
  if (store.get('settings.notitty'))
    list.push("_notitty")
  if (!store.get('settings.newReader.limit'))
    list.push("_secret")

  // Complicated flash ones

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

  return list
}

async function getEnabledModsJsAsync(opts) {
  // Get the array of currently enabled mod modules. opts are passed to getModJs (i.e. reload)
  var options = opts || {}
  if (!modsDir) {
    logger.warn("No asset directory set, can't load any mods.")
    return []
  }
  try {
    const enabled_mod_modules = await Promise.all(
      getEnabledMods().map(
        async (dir) => await getModJsAsync(dir, options)
      )
    )
    return enabled_mod_modules.filter(Boolean)
  } catch (e) {
    logger.error("Couldn't load enabled mod js'", e)
    return []
  }
}

async function searchWebAppModTrees(path) {
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
  const tree_root = await Promise.resolve(window.webAppModTrees)
  for (result of search(tree_root, path.split('/'))) {
    // result = result
  }

  if (Object.values(tree_root).includes(result)) {
    throw new Error(`Failed to find '${path} in webapp mod trees! Old data?'`)
  }
  return result
}

async function crawlFileTree(root, recursive = false) {
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
        ret[dirent.name] = await crawlFileTree(subpath, true)
      } else ret[dirent.name] = undefined // Is directory, but not doing a recursive scan
    } else {
      ret[dirent.name] = true
    }
  }
  dir.close()
  return ret
}

async function buildApi(mod) {
  Resources = Resources || await importResources
  yaml = yaml || await importYaml()

  function safetyChecks(local_path) {
    if (mod._singlefile) throw new Error(`Singlefile mods cannot use this method`)
    if (!local_path.startsWith("./")) throw new Error(`${local_path}: Paths must be mod relative (./)`)
    if (local_path.includes("/..")) throw new Error(`${local_path}: You know what you did`)
      
    if (isWebApp) throw new Error(`Cannot read files in webapp mode. You need to webpack these!`)
  }
  function readFileSyncLocal(local_path, method_name) {
    safetyChecks(local_path)
    return fs.readFileSync(path.join(mod._mod_root_dir, local_path), 'utf8')
  }
  function readFileAsyncLocal(local_path, method_name) {
    safetyChecks(local_path)
    return fs.promises.readFile(path.join(mod._mod_root_dir, local_path), 'utf8')
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
      has: (k) => this_store_cache[k] != undefined || store_mods.has(getModStoreKey(mod._id, k)),
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
    Resources,
    ipcRenderer
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

async function getModJsAsync(mod_dir, options = {}) {
  // Tries to load a mod (`require'd module) from a directory
  // If mod_dir/mod.js is not found, tries to load mod_dir.js as a single file
  // Errors passed to onModLoadFail and raised
  let modjs_path // full path to js file
  let modjs_name // relative path to js file from mods dir

  try {
    // const use_webpack_require = false

    const is_internal = mod_dir.startsWith("_")

    // Global, but let us overwrite it for some cases
    let thisModsDir = modsDir
    let thisModsAssetRoot = modsAssetsRoot
    let is_singlefile = false

    if (is_internal) {
      // use_webpack_require = true
      thisModsDir = imodsDir
      thisModsAssetRoot = imodsAssetsRoot
    } 

    // Set mod name, path, and is_directory:

    if (!isWebApp) {
      if (mod_dir.endsWith(".js")) {
        // logger.debug(mod_dir, "is explicit singlefile.")
        is_singlefile = true
        modjs_name = mod_dir
        modjs_path = path.join(thisModsDir, mod_dir)
      } else {
        // Mod isn't explicitly a singlefile js, but might still be a singlefile that needs coercion
        try {
          const is_directory = !(fs.lstatSync(path.join(thisModsDir, mod_dir)).isFile()) // allow for junctions, symlinks
          if (is_directory) {
            is_singlefile = false
            modjs_name = path.join(mod_dir, "mod.js")
            modjs_path = path.join(thisModsDir, modjs_name)
          } else {
            is_singlefile = true
            modjs_name = mod_dir + ".js"
            modjs_path = path.join(thisModsDir, modjs_name)
          }
        } catch (e) {
          // lstatsync threw error; js-less path didn't exist at all, so singlefile.
          // logger.error(mod_dir, "must be singlefile, errored", e)
          is_singlefile = true
          modjs_name = mod_dir + ".js"
          modjs_path = path.join(thisModsDir, modjs_name)
        }
      }
    }

    // Perform actual import using __non_webpack_require__:

    // else {
    //   if (mod_js_cache[modjs_path]) {
    //     // console.debug("Using cached", modjs_path)
    //     return mod_js_cache[modjs_path]
    //   }
    // }

    try {
      var mod_module
      if (isWebApp) {
        throw Error("Webapp cannot use non-webpack require!")
      } else {
        if (options.reload) {
          /* eslint-disable no-undef */
          if (__non_webpack_require__.cache[modjs_path]) {
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
        }
        // eslint-disable-next-line no-undef
        mod_module = __non_webpack_require__(modjs_path)
      }

      mod_module._id = mod_dir
      mod_module._singlefile = is_singlefile
      mod_module._internal = is_internal

      if (!is_singlefile) {
        mod_module._mod_root_dir = path.join(thisModsDir, mod_module._id)
        mod_module._mod_root_url = new URL(mod_module._id, thisModsAssetRoot).href + "/"
      }

      if (!options.liteload) {
        var b = mod_module.minAppVersion
        var a = window.appVersion
        if (a && b && !semver.gte(a, b)) {
          throw Error(`${mod_module._id} ${mod_module.modVersion} requires at least app ${mod_module.minAppVersion}`)
        }

        let api
        if (mod_module.computed != undefined) {
          api = api || await buildApi(mod_module)
          Object.assign(mod_module, mod_module.computed(api))
        }
        if (mod_module.asyncComputed != undefined) {
          api = api || await buildApi(mod_module)
          mod_module._fullyLoadedPromise = mod_module.asyncComputed(api).then(result => {
            Object.assign(mod_module, result)
          })
        } else {
          mod_module._fullyLoadedPromise = false
        }
      }

      // Computed properties don't automatically require a reload because
      // the object has been assigned any computed properties by now.

      // Anything editArchiveAsync depends on
      mod_module._needsArchiveReload = [
        'edit', 'footnotes',
        'routes', 'trees'
      // eslint-disable-next-line no-prototype-builtins
      ].some(k => mod_module.hasOwnProperty(k))

      // Anything that needs to recompute vueHooks (and restart the vm)
      mod_module._needsHardReload = [
        'styles', 'vueHooks', 'themes',
        'browserPages', 'browserActions', 'browserToolbars',
        'styles'
      // eslint-disable-next-line no-prototype-builtins
      ].some(k => mod_module.hasOwnProperty(k))

      // if (!options.liteload) {
      //   // console.debug("Caching", modjs_path)
      //   mod_js_cache[modjs_path] = mod_module
      // }
      return mod_module
    } catch (e) {
      // imod retry
      if (mod_dir.startsWith("_")) {
        console.log("Caught error importing imod")
        if (options.noReextractImods) {
          console.log("Already tried to re-extract imods, refusing to infinite loop")
          throw e
        }
        if (expectWorkingState()) {
          console.log("Couldn't load imod, trying re-extract")
          await extractimods()
        } else {
          console.log('Asset pack not found.')
          throw e
        }
        console.log("Retrying import")
        // eslint-disable-next-line no-undef
        return await getModJsAsync(mod_dir, {...options, noReextractImods: true})
      } else {
        console.log("Caught error importing non-imod", mod_dir, modjs_path, "; unrecoverable require error")
        throw e
      }
    }
  } catch (e1) {
    const e1_is_notfound = (e1.code && e1.code === "MODULE_NOT_FOUND")
    if (e1_is_notfound) {
      // Tried singlefile, missing
      if (mod_dir.startsWith("_")) {
        console.log("Failed loading imod. Asset pack broken.")
        onModLoadFail([mod_dir], e1)
      } else {
        logger.error("Missing file", mod_dir, e1)
        removeModsFromEnabledList([mod_dir])
        return null
      }
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

async function editArchiveFromModJs(archive, js) {
  !js.hidden && setLoadStage(`${js._id} initializing`)
  // Fully await any computed properties to be resolved
  await Promise.resolve(js._fullyLoadedPromise)

  // Load footnotes into archive
  if (js.footnotes) {
    !js.hidden && setLoadStage(`${js._id} adding footnotes`)
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

  // Run archive edit function
  const editfn = js.edit
  if (editfn) {
    !js.hidden && setLoadStage(`${js._id} editing story`)
    logger.debug(js._id, "editing archive")
    editfn(archive)
  }
  if (js.editPage) {
    if (!archive.tweaks.postprocessors) {
      archive.tweaks.postprocessors = []
    }
    archive.tweaks.postprocessors.push({
      mod_id: js._id,
      fn: js.editPage
    })
  }
}

async function editArchiveAsync(archive) {
  if (!expectWorkingState()) {
    logger.warn("No asset directory set, probably in new reader setup mode. Not editing the archive.")
    return
  }

  try {
    fs.lstatSync(path.resolve(imodsDir, '_replaybound/Sburb.dev.js'))
  } catch {
    logger.warn(`Sburb.dev.js missing from disk. Overzealous antivirus? Repairing...`)
    want_imods_extracted = true
  }

  if (want_imods_extracted) {
    logger.info("Extracting imods")
    await extractimods()
    want_imods_extracted = false // we did it
  }

  setLoadStage("READ_MODS")
  const enabledModsJs = await getEnabledModsJsAsync({reload: true})

  const bakeRoutesPromise = bakeRoutes(enabledModsJs) // run in background

  // Footnotes
  try {
    // doesn't exist
    archive.footnotes = {}
  } catch {
    // frozen
    logger.error("Vanilla archive object contains footnotes? Wiping.")
    for (var member in archive.footnotes) delete archive.footnotes[member]
  }

  footnote_categories.forEach(category => {
    archive.footnotes[category] = []
  })

  for (const js of enabledModsJs.reverse()) {
    try {
      await editArchiveFromModJs(archive, js)
    } catch (e) {
      if (js._id.startsWith("_")) await extractimods()
      onModLoadFail([js._id], e)
      throw e
    }
  }

  if (archive.tweaks.postprocessors) {
    function postprocessPage(page, page_data) {
      // Run postprocessor functions on page-copy
      archive.tweaks.postprocessors.forEach(p => {
        try {
          p.fn(page_data)
        } catch (e) {
          onModLoadFail([p.mod_id], e)
        }
      })

      // Write page-copy changes back to real page object
      // (including overwriting the getter triggering postprocessing)
      Object.keys(page_data).forEach(key => {
        Object.defineProperty(page, key, {value: page_data[key]})
      })
    }

    // Note: If multiple getters ever trigger postprocessing, some work is needed
    // to keep pages from being postprocessed multiple times by each property.
    Object.values(archive.mspa.story).forEach(page => {
      const page_data = {...page}
      Object.defineProperty(page, 'content', {
        get() {
          postprocessPage(this, page_data)
          return this.content
        }
      })
    })
  }

  setLoadStage("BAKE_ROUTES")
  await bakeRoutesPromise
  setLoadStage("MODS_DONE")
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

  const enabledModsJsPromise = getEnabledModsJsAsync() // Promise
  return {
    mounted() {
      const addScssStyle = (style_id, body) => {
        // Cache in store
        const cache_id = `stylecache.${style_id}`
        if (store_mods.has(cache_id)) {
          logger.info(`Using cached style ${style_id}`)
          this.stylesheets.push({
            id: style_id,
            body: store_mods.get(cache_id)
          })
        } else {
          importSassJs().then(SassJs => {
            logger.info(`Compiling style ${style_id}`)
            if (isWebApp) {
              // TODO: Can webpack do this?
              body = body.replace(/(assets:\/\/.+)(?=\);)/g, (match) => Resources.resolveAssetsProtocol(match))
            }
            SassJs.compile(body, (result) => {
              if (result.status !== 0) throw Error(JSON.stringify(result))
              store_mods.set(cache_id, result.text)
              this.stylesheets.push({
                id: style_id,
                body: result.text
              })
            })
          })
        }
      }

      enabledModsJsPromise.then(modules => {
        modules.forEach(async js => {
          await Promise.resolve(js._fullyLoadedPromise)

          // Render stylesheets from mod css
          try {
            const modstyles = js.styles || []
            if (!Array.isArray(modstyles)) {
              throw Error(`${js._id} styles object is not a list`)
            }

            modstyles.forEach((customstyle, i) => {
              const style_id = `style-${js._id}-${String(js.version).replace(/\./g, '_')}-${i}`

              if (customstyle.source && customstyle.body) {
                throw Error("Styles cannot set both source and body. Use multiple style objects.")
              }

              if (customstyle.source) {
                const scss_path = path.resolve(js._mod_root_dir, customstyle.source)
                fs.readFile(scss_path, 'utf8', (err, body) => {
                  if (err) return onModLoadFail([js._id], err)
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
              const scss_path = path.resolve(js._mod_root_dir, theme.source)
              fs.readFile(scss_path, 'utf8', (err, body) => {
                if (err) return onModLoadFail([js._id], err)
                addScssStyle(theme_class, `#app.${theme_class}, #app > .${theme_class} {\n${body}\n}`)
              })
            })

            // Render stylesheets from mod pages
            const reset_sass = `
            .pageFrame {
              h1, h2, h3, h4, h5, h6, p, ul, ol, li, div {
                margin: unset;
                padding: unset;
              }
              p {
                display: block;
                margin-block-start: 1em;
                margin-block-end: 1em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
              }
              ul {
                display: block;
                list-style-type: disc;
                margin-block-start: 1em;
                margin-block-end: 1em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                padding-inline-start: 40px;
              }
              & {
                font-family: unset;
                font-size: unset;
                font-weight: normal;
                overflow-wrap: initial;
              }
            }`
            const modPages = js.browserPages || {}
            Object.entries(modPages).forEach((t, i) => {
              const [componentTag, {component}] = t
              if (component.scss) {
                const style_id = `browserpage-style-${componentTag}`
                const sass_body = `.tabFrame [data-component='${componentTag}'] {\n${reset_sass}\n${component.scss}\n}`
                addScssStyle(style_id, sass_body)
              }
            })

            const modToolbars = js.browserToolbars || {}
            Object.entries(modToolbars).forEach((t, i) => {
              const [componentTag, {component}] = t
              // N.B. Unlike pages (which have URLs) toolbars are js-id namespaced.
              if (component.scss) {
                const style_id = `browsertoolbar-style-${js._id}-${componentTag}`
                const sass_body = `#tabBar [data-component='${js._id}-${componentTag}'] {\n${component.scss}\n}`
                addScssStyle(style_id, sass_body)
              }
            })
          } catch (e) {
            onModLoadFail([js._id], e)
          }
        }) // end modules.foreach
      })
    }
  }
}

async function getMixinsAsync(){
  // This is absolutely black magic

  // Since this is mixins, the vm isn't initialized yet. Try to wait.
  flag_failures_dont_interrupt = true

  const nop = () => undefined

  const enabledModsJs = await getEnabledModsJsAsync()

  flag_failures_dont_interrupt = false

  // List of mods, ordered
  var mixable_mods = enabledModsJs.toReversed()

  // Add mod that contains vue hooks for custom themes
  // Flatten mods with themes down to one mixin.
  var newThemes = mixable_mods.reduce((themes, js) => {
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
  // Flatten mods with pages down to one mixin.
  var newPages = mixable_mods.reduce((pages, js) => {
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
  // Flatten mods with actions down to one mixin.
  var newBrowserActions = mixable_mods.reduce((actions, js) => {
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
  // Flatten mods with toolbars down to one mixin.
  var newBrowserToolbars = mixable_mods.reduce((toolbars, js) => {
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
          if (this._computedWatchers[dname]) {
            console.warn(
              "Vue hook: component",
              this.$options.name,
              "hook is assigning", dname,
              "as data, but it is a computed value!"
            )
          }
          this[dname] = (typeof value == "function" ? value.bind(this)(this[dname]) : value)
        }
        // Computed
        for (const cname in (hook.computed || {})) {
          // Precomputed super value
          var sup;
          try {
            sup = this._computedWatchers[cname].getter.call(this)
          } catch (e) {
            console.warn(
              "Vue hook: component",
              this.$options.name,
              "does not have existing computed property", cname,
              "in", this._computedWatchers,
              "super function will return undefined"
            )
            sup = () => undefined
          }
          Object.defineProperty(this, cname, {
            get: hook.computed[cname].bind(vueComponent, sup),
            configurable: true
          })
        }
        // Methods w/ optional super argument
        for (const mname in (hook.methods || {})) {
          // Super function
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

function jsToChoice(js, dir){
  var mod_version = js.modVersion
  if (js.version) {
    logger.warn(`${js._id}: the 'version' property is deprecated. Use 'modVersion' and 'minAppVersion' instead.`)
    mod_version = mod_version || js.version
  }

  var compatible = true
  if (js.minAppVersion && !semver.gte(window.appVersion, js.minAppVersion)) {
    // throw Error(`${js._id} ${js.modVersion} requires at least app ${js.minAppVersion}`)
    compatible = false
  }

  return {
    label: js.title,
    summary: js.summary,
    description: js.description,
    author: js.author,
    modVersion: mod_version,
    locked: js.locked,
    compatible: compatible,
    minAppVersion: js.minAppVersion,

    hasmeta: Boolean(js.author || js.modVersion || js.settings || js.description),
    needsArchiveReload: js._needsArchiveReload,
    needsHardReload: js._needsHardReload,
    settingsmodel: js.settings,
    key: dir,

    includes: {
      routes: Boolean(js.routes || js.treeroute || js.trees),
      edits: Boolean(js.edit) || Boolean(js.editPage),
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

async function tryExtractZipsForFilesystemIlliteratesAsync(tree) {
  // Extract zips left incorrectly in mods folder

  const zip_archives = Object.keys(tree).filter(p => /\.zip$/.test(p))
  if (zip_archives.length > 0) {
    const unzipper = require("unzipper")
    const outpath = modsDir // path.join(assetDir, "mods")

    await Promise.all(zip_archives.map(async zip_name => {
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
        }), 1000) // OS doesn't release it right away even after finish
      })
    }))
  }
}

async function loadModChoicesAsync(){
  // Get the list of mods players can choose to enable/disable
  var mod_folders

  if (isWebApp) {
    throw new Error("Unimplemented")
  } else if (assetDir == undefined) {
    // No mod folder at all. That's okay.
    logger.info("Asset dir not yet defined. (First run)")
    return []
  } else {
    try {
      if ((await fsExistsAsync(assetDir)) && !(await fsExistsAsync(modsDir))){
        logger.warn("Asset pack exists but mods dir doesn't, making empty folder")
        fs.mkdirSync(modsDir)
      }
      const tree = await crawlFileTree(modsDir, false)

      try {
        await tryExtractZipsForFilesystemIlliteratesAsync(tree)
      } catch (e) {
        logger.info(e, "(who cares?)")
      }

      async function isRootValidMod(file_name) {
        if (/\.js$/.test(file_name))
          return true
        if (tree[file_name] === undefined) {
          if (await fsExistsAsync(path.join(modsDir, file_name, "mod.js")))
            return true
        }
        logger.warn("Not a mod:", file_name, path.join(file_name, "mod.js"))
        return false
      }

      // .js file or folder of some sort

      const roots = Object.keys(tree)
      const filter = await Promise.all(roots.map(isRootValidMod))
      mod_folders = roots.filter((_, i) => filter[i])
    } catch (e) {
      // No mod folder at all. That's okay.
      logger.error(e)
      return []
    }
  }

  const choice_promises = mod_folders.map(async (dir) => {
    try {
      const js = await getModJsAsync(dir, {liteload: true, reload: true})
      if (js === null || js.hidden === true)
        return false

      return jsToChoice(js, dir)
    } catch (e) {
      // Catch import-time mod-level errors
      logger.error("Couldn't load mod choice", e)
      // Can't fail here: haven't loaded enough main to even show a dialog.
      // onModLoadFail([dir], e)
    }
  })
  var items = (await Promise.all(choice_promises))
    .filter(Boolean)
    .reduce((acc, mod_module) => {
      acc[mod_module.key] = mod_module
      return acc
    }, {})

  logger.info("Mod choices loaded")
  logger.debug(Object.keys(items))
  return items
}

export default {
  store_mods, // store object
  getModStoreKey, // sync, pure, used by subsettingsmodal
  modsDir, // var, referenced by settings

  extractimods, // async, internal
  removeModsFromEnabledList,

  loadModChoicesAsync, // async, called by settings to refresh (promise-resolved)

  getEnabledModsJsAsync, // async, internal
  getEnabledMods, // sync, internal

  getMixinsAsync, // async, Mixed in in main.js
  getMainMixin, // sync, OK, Mixed in in app.vue to the main app only

  getRoutes() {return routes}, // debug
  bakeRoutes, // bakeRoutes(enabled_mods_js), sync, internal
  getAssetRoute, // sync, used by resources, unpure (depends on routes)

  editArchiveAsync, // async, awaited in app.vue after loading archive
  loadAllContent() { Object.values(vm.$archive.mspa.story).forEach(page => page.content) },

  crawlFileTree, // internal/debug
  doFullRouteCheck, // internal/debug
  ipcRenderer
}
