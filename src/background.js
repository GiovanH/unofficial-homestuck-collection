'use strict'

import { app, BrowserWindow, ipcMain, Menu, protocol, dialog, shell, clipboard } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
import FlexSearch from 'flexsearch'

import Resources from "./resources.js"
import Mods from "./mods.js"

const { nativeImage } = require('electron');
const APP_VERSION = app.getVersion()
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

const handler = require('serve-handler')
const http = require('http')

const Store = require('electron-store')
const store = new Store()

const log = require('electron-log')
const logger = log.scope('ElectronMain')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null
const gotTheLock = app.requestSingleInstanceLock()

// Improve overall performance by disabling GPU acceleration
// We're not running crysis or anything its all gifs

if (!store.get('localData.settings.enableHardwareAcceleration')) {
  console.log("Disabling hardware acceleration")
  app.disableHardwareAcceleration()
} else {
  console.log("Not disabling hardware acceleration")
}

// Log settings, for debugging
logger.info(store.get('localData.settings'))

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true } },
  { scheme: 'assets', 
    privileges: { 
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
])

// zoom functions
function zoomIn() {
  if (win) {
    win.webContents.send('ZOOM_IN');
  }
}
function zoomOut() {
  if (win) {
    win.webContents.send('ZOOM_OUT');
  }
}

var assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined

var port
var chapterIndex;

// Menu won't be visible to most users, but it helps set up default behaviour for most common key combos
var menuTemplate = [
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    role: 'editMenu'
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+=',
        click: () => {if (win) win.webContents.send('ZOOM_IN')}
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: () => {if (win) win.webContents.send('ZOOM_OUT')}
      },
      {
        label: 'Zoom In',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+numadd',
        click: () => {if (win) win.webContents.send('ZOOM_IN')}
      },
      {
        label: 'Zoom Out',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+numsub',
        click: () => {if (win) win.webContents.send('ZOOM_OUT')}
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click: () => {if (win) win.webContents.send('ZOOM_RESET')}
      },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Tabs',
    submenu: [
      {
        label: 'Go back one page',
        accelerator: 'Alt+Left',
        click: () => {if (win) win.webContents.send('TABS_HISTORY_BACK')}
      },
      {
        label: 'Go forward one page',
        accelerator: 'Alt+Right',
        click: () => {if (win) win.webContents.send('TABS_HISTORY_FORWARD')}
      },
      { type: 'separator' },
      {
        label: 'New Tab',
        accelerator: 'CmdOrCtrl+T',
        click: () => {if (win) win.webContents.send('TABS_NEW', {parsedURL: '/', adjacent: false})}
      },
      {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W',
        click: () => {if (win) win.webContents.send('TABS_CLOSE')}
      },
      { type: 'separator' },
      {
        label: 'Next Tab',
        accelerator: 'CmdOrCtrl+Tab',
        click: () => {if (win) win.webContents.send('TABS_CYCLE', {amount: 1})}
      },
      {
        label: 'Previous Tab',
        accelerator: 'CmdOrCtrl+Shift+Tab',
        click: () => {if (win) win.webContents.send('TABS_CYCLE', {amount: -1})}
      },
      {
        label: 'Next Tab (Alternate)',
        accelerator: 'CmdOrCtrl+PageDown',
        visible: false,   
        acceleratorWorksWhenHidden: true,
        click: () => {if (win) win.webContents.send('TABS_CYCLE', {amount: 1})}
      },
      {
        label: 'Previous Tab (Alternate)',
        accelerator: 'CmdOrCtrl+PageUp',
        visible: false,   
        acceleratorWorksWhenHidden: true,
        click: () => {if (win) win.webContents.send('TABS_CYCLE', {amount: -1})}
      },
      { type: 'separator' },
      {
        label: 'Duplicate Tab',
        accelerator: 'CmdOrCtrl+Shift+D',
        click: () => {if (win) win.webContents.send('TABS_DUPLICATE')}
      },
      {
        label: 'Restore Closed Tab',
        accelerator: 'CmdOrCtrl+Shift+T',
        click: () => {if (win) win.webContents.send('TABS_RESTORE')}
      }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      {
        label: 'Open Jump Bar',
        accelerator: 'CmdOrCtrl+L',
        click: () => {if (win) win.webContents.send('OPEN_JUMPBOX') }
      },
      {
        label: 'Find in page',
        accelerator: 'CmdOrCtrl+F',
        click: () => {if (win) win.webContents.send('OPEN_FINDBOX') }
      },
      { role: 'minimize' }
    ]
  }
]

function loadArchiveData(){
  // Attempt to set up with local files. If anything goes wrong, we'll invalidate the archive/port data. If the render process detects a failure it'll shunt over to setup mode
  // This returns an `archive` object, and does not modify the global archive directly. 
  win.webContents.send('SET_LOAD_STAGE', "ARCHIVE")
  logger.info("Loading archive")

  if (!assetDir) throw Error("No reference to asset directory")
  if (!fs.existsSync(assetDir)) throw Error("Asset directory is missing!")

  let data

  try {
    // Grab and parse all data jsons
    data = {
      ...JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/version.json'), 'utf8')),
      mspa: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/mspa.json'), 'utf8')),
      social: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/social.json'), 'utf8')),
      news: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/news.json'), 'utf8')),
      music: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/music.json'), 'utf8')),
      comics: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/comics.json'), 'utf8')),
      extras: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/extras.json'), 'utf8')),
      tweaks: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/tweaks.json'), 'utf8')),
      audioData: {},
      flags: {}
    }
  } catch (e) {
    // Error loading json. Probably a bad asset pack installation.
    logger.error(e)
    return undefined
  }

  if (!data) throw new Error("Data empty after attempted load")

  data.tweaks.tzPasswordPages = Object.values(data.mspa.story)
    .filter(v => v.flag.includes('TZPASSWORD'))
    .map(v => v.pageId)

  // We pre-build this here so mods have access to it
  // TODO: This is unused now, remove it
  data.search = Object.values(data.mspa.story).map(storypage => {
    return {
      key: storypage.pageId,
      chapter: Resources.getChapter(storypage.pageId),
      content: `${storypage.title}###${storypage.content}`
    }
  })

  win.webContents.send('SET_LOAD_STAGE', "MODS")
  logger.info("Loading mods")

  try {
    logger.debug("Applying mod archive edits")
    Mods.editArchive(data)
    // This isn't strictly part of loading the archive data,
    // but we should do this only when we reload the archive
    logger.debug("Baking mod routes")
    Mods.bakeRoutes()

    // Sanity checks
    const required_keys = ['mspa', 'social', 'news', 'music', 'comics', 'extras']
    required_keys.forEach(key => {
      if (!data[key]) throw new Error("Archive object missing required key", key)
    })
  } catch (e) {
    // Errors should already log/handle themselves by now
    // but we need to update the application state to react to it
    // This is probably due to a poorly written mod, somehow.
    // specifically $localdata can be in an invalid state
    logger.error("Error applying mods to archive? DEBUG THIS!!!", e)
    console.log("Error applying mods to archive? DEBUG THIS!!!", e)

    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Archive load error',
      message: `Something went wrong while loading the archive. This may be related to an incorrectly-written mod. Check the console log for details.`
    })

    throw e
  }

  win.webContents.send('SET_LOAD_STAGE', "PATCHES")
  logger.info("Loading patches")
  // TEMPORARY OVERWRITES UNTIL ASSET PACK V2
  if (data.version == "1") {
    logger.info("Applying asset pack v1 patches")
    const gankraSearchPage = data.search.find(x => x.key == '002745')
    if (gankraSearchPage) gankraSearchPage.content = gankraSearchPage.content.replace('Gankro', 'Gankra')

    data.mspa.story['002745'].content = data.mspa.story['002745'].content.replace('Gankro', 'Gankra')

    data.mspa.faqs.new.content = data.mspa.faqs.new.content.replace(/bgcolor="#EEEEEE"/g, '')

    data.music.tracks['ascend'].commentary = data.music.tracks['ascend'].commentary.replace('the-king-in-red>The', 'the-king-in-red">The')
  }

  chapterIndex = undefined
  
  return data
}

try {  
  // Spin up a static file server to grab assets from. Mounts on a dynamically assigned port, which is returned here as a callback.
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: assetDir
    })
  })

  server.listen(0, '127.0.0.1', (error) => {
    if (error) throw error
    port = server.address().port
  
    // Initialize Resources
    Resources.init({
      assets_root: `http://127.0.0.1:${port}/`
    })
  })
} catch (error) {
  logger.error(error)
  logger.info("Loading check failed, loading setup mode")

  // If anything fails to load, the application will start in setup mode. This will always happen on first boot! It also covers situations where the assets failed to load.
  // Specifically, the render process bases its decision on whether archive is defined or not. If undefined, it loads setup mode.
  port = undefined
  
  // Throw together a neutered menu for setup mode
  menuTemplate = [
    {
      role: 'fileMenu'
    },
    {
      role: 'editMenu'
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: zoomIn
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: zoomOut
        }
      ]
    }
  ]
} finally {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

// The renderer process requests the chosen port on startup, which we're happy to oblige
ipcMain.on('STARTUP_GET_INFO', (event) => {
  event.returnValue = {port: port, appVersion: APP_VERSION}
})

ipcMain.handle('check-archive-version', async (event, payload) => {
  try {
    const versionJson = JSON.parse(fs.readFileSync(
      path.join(payload.assetDir, 'archive/data/version.json'),
      'utf8'
    ))
    return versionJson.version
  } catch (e) {
    logger.error(e)
    return undefined
  }
})

if (assetDir && fs.existsSync(assetDir)) {
  // App version checks
  const last_app_version = store.has("appVersion") ? store.get("appVersion") : '1.0.0'

  const semverGreater = (a, b) => a.localeCompare(b, undefined, { numeric: true }) === 1
  if (!last_app_version || semverGreater(APP_VERSION, last_app_version)) {
    console.log(`App updated from ${last_app_version} to ${APP_VERSION}`)
    Mods.extractimods()
  } else {
    console.log(`last version ${last_app_version} gte current version ${APP_VERSION}`)
  }

  store.set("appVersion", APP_VERSION)
} else {
  console.log("Deferring app version checks until initial configuration is complete.")
}

// Speed hack, try to preload the first copy of the archive
var first_archive
var archive // Also, keep a reference to the latest archive, for lazy eval
try {
  archive = first_archive = loadArchiveData()
} catch (e) {
  // logger.warn(e)
  // don't even warn, honestly
}

ipcMain.on('RELOAD_ARCHIVE_DATA', (event) => {
  win.webContents.send('SET_LOAD_STATE', "LOADING")
  try {
    if (first_archive) {
      archive = first_archive
      first_archive = undefined;
    } else archive = loadArchiveData()
    win.webContents.send('ARCHIVE_UPDATE', archive)
  } catch (e) {
    logger.error("Error reloading archive", e)
    win.webContents.send('SET_LOAD_STATE', "ERROR")
  }
  win.webContents.send('SET_LOAD_STATE', "DONE")
})

ipcMain.handle('win-minimize', async (event) => {
  win.minimize()
})

ipcMain.handle('win-maximize', async (event) => {
  if (win.isFullScreen()){
    win.setFullScreen(false)
  } else if (win.isMaximized()){
    win.unmaximize()
  } else {
    win.maximize()
  }
})
ipcMain.handle('win-close', async (event) => {
  logger.info("Got asynchronous close event")
  win.close()
})
ipcMain.on('win-close-sync', (e) => {
  logger.warn("Got synchronous close event!")
  win.destroy()
  e.returnValue = true;
})

ipcMain.handle('copy-image', async (event, payload) => {
  logger.info(payload.url)
  Sharp(payload.url).png().toBuffer().then(buffer => {
    logger.info(buffer)
    const sharpNativeImage = nativeImage.createFromBuffer(buffer)
    logger.info("Sharp buffer ok", !sharpNativeImage.isEmpty())
    clipboard.writeImage(sharpNativeImage)
  })
})

ipcMain.handle('save-file', async (event, payload) => {
  const newPath = dialog.showSaveDialogSync(win, {
    defaultPath: path.basename(payload.url)
  })
  if (newPath) fs.createReadStream(payload.url).pipe(fs.createWriteStream(newPath))
})

ipcMain.handle('inspect-element', async (event, payload) => {
  win.webContents.inspectElement(payload.x, payload.y)
})

ipcMain.handle('locate-assets', async (event, payload) => {
  const defaultPath = assetDir || undefined
  const newPath = dialog.showOpenDialogSync(win, {
    defaultPath,
    properties: [
      'openDirectory'
    ]
  })
  if (newPath) {
    let validated = true
    try {
      // If there's an issue with the archive data, this should fail.
      assetDir = newPath[0]
      logger.info(assetDir)
      loadArchiveData()

    } catch (error) {
      logger.error(error)
      validated = false
    }

    if (validated) {
      if (payload.restart) {
        const confirmation = dialog.showMessageBoxSync(win, {
          type: 'warning',
          buttons: [
            'OK',
            'Cancel'
          ],
          cancelId: 1,
          defaultId: 1,
          title: 'Notice',
          message: 'This will restart the application. Continue?'
        })
        if (confirmation == 0) {
          store.set('localData.assetDir', newPath[0])
        
          app.relaunch()
          app.exit()
        }
      } else return newPath[0]
    } else {
      dialog.showMessageBoxSync(win, {
        type: 'warning',
        title: 'Assets not found',
        message: "That doesn't look like the right folder. Make sure you unzipped the asset pack, and select the singular folder that contains everything else."
      })
      return undefined
    }
  }
})

ipcMain.handle('restart', async (event) => {
  app.relaunch()
  app.exit()
})

ipcMain.handle('reload', async (event) => {
  win.reload()
})


ipcMain.handle('factory-reset', async (event, confirmation) => {
  if (confirmation === true) {
    store.delete('localData')
  
    app.relaunch()
    app.exit()
  }
})

ipcMain.handle('prompt-okay-cancel', async (event, args) => {
  const title = args.title || "Notice"
  const ok_string = args.okay || "OK"
  const cancel_string = args.cancel || "Cancel"
  const answer = dialog.showMessageBoxSync(win, {
    type: 'warning',
    buttons: [
      ok_string,
      cancel_string
    ],
    cancelId: 1,
    defaultId: 1,
    title,
    message: args.message
  })
  return (answer === 0)
})

function buildChapterIndex(){
  logger.info("Building new search index")
  chapterIndex = new FlexSearch({
    doc: {
      id: 'key',
      field: ['mspa_num', 'content'],
      tag: 'chapter'
    }
  })

  const storytextList = Object.keys(archive.mspa.story).map(page_num => {
    const page = archive.mspa.story[page_num]
    return {
      key: page_num,
      mspa_num: page_num,
      chapter: Resources.getChapter(page_num),
      content: `${page.title}<br />${page.content}`
    }
  })

  logger.info("Populating search index with", storytextList.length, "page documents")
  chapterIndex.add(storytextList)

  const footnoteList = Object.keys(archive.footnotes.story).map(page_num => {
    return {
      key: `${page_num}-notes`, // Duplicate keys are not allowed.
      mspa_num: page_num,
      chapter: Resources.getChapter(page_num),
      content: archive.footnotes.story[page_num].map(
        note => note.content
      ).join("###")
    }
  })

  logger.info("Populating search index with", footnoteList.length, "footnote documents")
  chapterIndex.add(footnoteList)
}

ipcMain.handle('search', async (event, payload) => {
  if (chapterIndex == undefined)
    buildChapterIndex()

  if (payload == undefined)
    return // Just wanted to ensure the index

  const keyAlias = {
    "mc0001": 1892.5,
    "jb2_000000": 135.5,
    "pony": 2838.5,
    "pony2": 6517.5,
    "darkcage": 6273.5,
    "darkcage2": 6927.5
  }
  
  let limit = 1000
  const sort = (a, b) => {
    const aKey = Number.isNaN(parseInt(a.key)) ? keyAlias[a.key] : parseInt(a.key)
    const bKey = Number.isNaN(parseInt(b.key)) ? keyAlias[a.key] : parseInt(b.key)
    return (payload.sort == 'desc') 
      ? aKey > bKey ? -1 : aKey < bKey ? 1 : 0 
      : aKey < bKey ? -1 : aKey > bKey ? 1 : 0
  }

  let filteredIndex
  if (payload.filter[0]) {
    const items = chapterIndex.where(function(item) {
      return payload.filter.includes(item.chapter)
    })
    limit = items.length < 1000 ? items.length : 1000
    filteredIndex = new FlexSearch({
      doc: {
        id: 'key', 
        field: ['mspa_num', 'content']
      }
    }).add(items)
  } else {
    filteredIndex = chapterIndex
  }

  const results = (payload.sort == 'asc' || payload.sort == 'desc') 
    ? filteredIndex.search(payload.input, {limit, sort})
    : filteredIndex.search(payload.input, {limit})

  const foundText = []
  for (const page of results) {
    const flex = new FlexSearch()
    const page_lines = page.content.split('<br />')
    for (let i = 0; i < page_lines.length; i++) {
      flex.add(i, page_lines[i])
    }
    const indexes = flex.search(payload.input)
    const spread_indexes = Array.from(
      indexes.reduce((acc, i) => {
        const spread = 2;
        for (let j = i - spread; j < i + spread; j++) {
          acc.add(j)
        }
        return acc
      }, new Set())
    ).sort()
    const matching_lines = spread_indexes.filter(i => page_lines[i]).map(i => page_lines[i])

    if (matching_lines.length > 0){
      foundText.push({
        key: page.key,
        mspa_num: page.mspa_num,
        lines: matching_lines
      })
    }
  }
  return foundText
})

ipcMain.handle('steam-open', async (event, browserUrl) => {
  const steamUrl = browserUrl.replace(/http(s){0,1}:\/\/[\w.]*steampowered.com\/app/i, 'steam://url/StoreAppPage')
  
  if (app.getApplicationNameForProtocol(steamUrl)) {
    await shell.openExternal(steamUrl)
  } else {
    await shell.openExternal(browserUrl)
  }
})

// Hook onto image drag events to allow images to be dragged into other programs
const Sharp = require('sharp')
ipcMain.on('ondragstart', (event, filePath) => {
  // logger.info("Dragging file", filePath)
  const cb = (icon) => event.sender.startDrag({ file: filePath, icon })
  try {
    // // We can use nativeimages for pngs, but sharp ones are scaled nicer.
    // const nativeIconFromPath = nativeImage.createFromPath(filePath)
    // if (!nativeIconFromPath.isEmpty()) {
    //   logger.info("Native icon from path", nativeIconFromPath)
    //   cb(nativeIconFromPath)
    // } else {
      Sharp(filePath).resize(150, 150, {fit: 'inside', withoutEnlargement: true})
      .png().toBuffer().then(buffer => {
        const sharpNativeImage = nativeImage.createFromBuffer(buffer)
        // logger.info("Sharp buffer ok", !sharpNativeImage.isEmpty())
        cb(sharpNativeImage)
      })
    // }
  } catch (err) {
    logger.error("Couldn't process image", err)
    // eslint-disable-next-line no-undef
    cb(`${__static}/img/dragSmall.png`)
  }
})

let openedWithUrl
const OPENWITH_PROTOCOL = 'mspa'

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    'minWidth': 1000,
    'minHeight': 600,
    backgroundColor: '#535353',
    useContentSize: true,
    frame: store.get('localData.settings.useSystemWindowDecorations'),
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      plugins: true,
      webviewTag: true
    }
  })

  win.webContents.on('zoom-changed', (e, zoomDirection) => {
    if (zoomDirection === 'in') {
      zoomIn()
    }
    if (zoomDirection === 'out') {
      zoomOut()
    }
  });

  // Catch-all to prevent navigating away from application page
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })
  //  ;[
  //   'will-navigate',
  //   'did-navigate-in-page',
  //   'did-start-navigation',
  //   'will-redirect',
  //   'did-redirect-navigation',
  //   'did-navigate',
  //   'did-frame-navigate'
  // ].forEach(eventName => {
  //   win.webContents.on(eventName, (event) => {
  //     logger.info("blocking", eventName)
  //     event.preventDefault()
  //   })
  // })

  win.webContents.on('update-target-url', (event, new_url) => {
    win.webContents.send('update-target-url', new_url)
  })
  
  // Resolve asset URLs
  
  // You can only have one of these, so all behavior has to go in here.
  // Yes, it's a pain.
  win.webContents.session.webRequest.onBeforeRequest({
    urls: [
      // 'assets://*/*',  // yes, both

      '*://*.mspaintadventures.com/*', 
      "assets://*/*",  // yes, both
      "http://www.turner.com/planet/mp3/cp_close.mp3", 
      "http://fozzy42.com/SoundClips/Themes/Movies/Ghostbusters.mp3", 
      "http://pasko.webs.com/foreign/Aerosmith_-_I_Dont_Wanna_Miss_A_Thing.mp3", 
      "http://www.timelesschaos.com/transferFiles/618heircut.mp3",
      "*://*.sweetcred.com/*"
    ]
  }, (details, callback) => {
    if (details.url.startsWith("assets://")) {
      const redirectURL = Resources.resolveAssetsProtocol(details.url)
      if (details.url == redirectURL) {
        const err = `${details.url} is assets url, resolved protocol to ${redirectURL} but is an infinite loop!`
        logger.error(err)
        throw Error(err)
      } else {
        // logger.info(details.url, "is assets url, resolved protocol to", redirectURL)
        callback({redirectURL})
      }
    } else {
      const destination_url = Resources.resolveURL(details.url)
      if (details.url == destination_url) {
        const err = `${details.url} is not assets url, resolving resource to ${destination_url} but is an infinite loop!`
        logger.error(err)
        throw Error(err)
      } else {
        // Okay
        // logger.info(details.url, "is not assets url, resolving resource to", destination_url)
        if (details.resourceType == "subFrame")
          win.webContents.send('TABS_PUSH_URL', destination_url)
        else callback({
          redirectURL: destination_url
        })
      }
    }
  })

  // It's important that only one window is ever active at a time
  // Target="_blank"/external links are generally handled through the frontend filter, so should hopefully only intercept flashes
  // Thing is, there isn't a single flash that tries to open an external webpage/new window either! we're just going for the security here
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()

    const parsedURL = Resources.resolveURL(url)
    logger.info(`new-window: ${url} ===> ${parsedURL}`)

    // If the given URL is still external, open a browser window.
    if (/http/.test(parsedURL))
      shell.openExternal(url) 
    else
      win.webContents.send('TABS_NEW', {url: parsedURL, adjacent: true})
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  var current_icon // = "@/icons/icon"
  // win.setIcon(current_icon)

  ipcMain.on('set-sys-icon', (event, new_icon) => {
    new_icon = (new_icon || `@/icons/icon`).replace(/^@/, __static)
    if (new_icon && new_icon != current_icon) {
      try {
        if (process.platform == "win32") {
          new_icon += ".ico"
        } else {
          new_icon += ".png"
        }
        logger.info("Changing icon to", new_icon, process.platform)
        win.setIcon(new_icon)
        current_icon = new_icon
      } catch (e) {
        logger.error("Couldn't change icon; platform issue?", process.platform, new_icon, e)
      }
    }
  })

  ipcMain.on('set-title', (event, new_title) => {
    win.setTitle(new_title)
  })

  // Give mods a reference to the window object so it can reload 
  Mods.giveWindow(win);

  if (openedWithUrl)
    win.webContents.send('TABS_PUSH_URL', openedWithUrl.replace(OPENWITH_PROTOCOL + '://', "/"))
}

app.removeAsDefaultProtocolClient(OPENWITH_PROTOCOL)
if (isDevelopment && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  // Setting this is required to get this working in dev mode.
  app.setAsDefaultProtocolClient(OPENWITH_PROTOCOL, process.execPath, [
    path.resolve(process.argv[1])
  ])
} else {
  app.setAsDefaultProtocolClient(OPENWITH_PROTOCOL)
}

app.on('open-url', function (event, url) {
  event.preventDefault()
  openedWithUrl = url
})

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.

    if (process.platform !== 'darwin') {
      // Find the arg that is our custom protocol url and store it
      openedWithUrl = commandLine.find((arg) => arg.startsWith(OPENWITH_PROTOCOL + '://'))
    }
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
      if (openedWithUrl)
        win.webContents.send('TABS_PUSH_URL', openedWithUrl.replace(OPENWITH_PROTOCOL + '://', "/"))
    }
  })
  app.whenReady().then(async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        logger.error('Vue Devtools failed to install:', e.toString())
      }
    }
    await createWindow()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
