import fs from 'fs'
import path from 'path'

const Store = require('electron-store')
const store = new Store()

const assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
const mod_root = path.join(assetDir, "mods")

const VERBOSE = true

function print(){
    if (VERBOSE) return console.log("[Mods]", ...arguments)
}

function getEnabledMods(){
  // Get modListEnabled from settings, even if vue is not loaded yet.
  const key = 'localData.settings.modListEnabled'
  const list = store.has(key) ? store.get(key) : []
  print(store.has(key), list)
  return list
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
      let modjs_path = path.join(mod_root, mod_dir, "mod.js")
      var mod = __non_webpack_require__(modjs_path)
      return mod
  } catch (e1) {
    if (e1.code && e1.code == "MODULE_NOT_FOUND") {
      try {
          // Look for a single-file mod
          let modjs_path = path.join(mod_root, mod_dir) + ".js"
          var mod = __non_webpack_require__(modjs_path)
          return mod
      } catch (e2) {
          console.error(e1)
          throw e2
      }
    } else throw e1
  }
}

function loadModChoices(){
  // Get the list of mods players can choose to enable/disable
  var mod_folders = Object.keys(crawlFileTree(mod_root, false))
  var items = mod_folders.map((dir) => {
    let js = getModJs(dir)
    return {
      label: js.title,
      desc: js.desc,
      key: dir
    }
  })
  print("Mod choices loaded")
  print(items)
  return items
}

function editArchive(archive){
  getEnabledModsJs().forEach((js) => {
    const editfn = js.edit
    if (editfn) {
      archive = editfn(archive)
    }
  })
}

function getMixins(){
  const nop = ()=>undefined;
  return getEnabledModsJs().map((js) => {
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
                get: () => (hook.computed[cname](sup))
              })
            }
            for (const dname in (hook.data || {})) {
              const value = hook.data[dname]
              if (typeof(value) == "function") {
                // Precomputed super function
                this[dname] = value(this[dname])
              } else {
                this[dname] = value
              }
            }
          }
        })
      }
    }
    return mixin
  })
}

export default {
  loadModChoices,
  getModJs,
  getMixins,
  editArchive
}