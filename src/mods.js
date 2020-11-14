import fs from 'fs'
import path from 'path'

const Store = require('electron-store')
const store = new Store()

var assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
var mod_root = path.join(assetDir, "mods")

function crawlFileTree(root, recursive=false){
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
    try {
        // Look for a single-file mod
        let modjs_path = path.join(mod_root, mod_dir)
        var mod = __non_webpack_require__(modjs_path)
        return mod
    } catch (e2) {
        console.error(e2)
        throw e2
    }
  }
}

function loadModChoices(){
  // TODO mod stuff

  var mod_folders = Object.keys(crawlFileTree(mod_root, false))
  var items = mod_folders.map((dir) => {
    let js = getModJs(dir)
    return {
      label: js.title,
      desc: js.desc,
      key: dir
    }
  })

  return items
}

export default {
  loadModChoices,
  getModJs
}