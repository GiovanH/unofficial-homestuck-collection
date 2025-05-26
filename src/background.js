'use strict'

import { app, BrowserWindow, ipcMain, Menu, protocol, dialog, shell, clipboard } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import errorReporting from './js/errorReporting'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-assembler'
import fs from 'fs'

const { nativeImage } = require('electron')

const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

const handler = require('serve-handler')
const http = require('http')

const log = require('electron-log')
const Store = require('electron-store')

const windowStateKeeper = require('electron-window-state')

const store = new Store()
const logger = log.scope('ElectronMain')
const APP_VERSION = app.getVersion()

// const search = require('./search.js').default

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null
const gotTheLock = app.requestSingleInstanceLock()

if (!isDevelopment) {
  errorReporting.registerMainLogger(log)
}

// Improve overall performance by disabling GPU acceleration
// We're not running crysis or anything its all gifs

if (!store.get('settings.enableHardwareAcceleration')) {
  logger.info("Disabling hardware acceleration")
  app.disableHardwareAcceleration()
} else {
  logger.info("Not disabling hardware acceleration")
}

// Log settings, for debugging
logger.info(store.get('settings'))

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true } },
  {
    scheme: 'assets',
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
    win.webContents.send('ZOOM_IN')
  }
}
function zoomOut() {
  if (win) {
    win.webContents.send('ZOOM_OUT')
  }
}

var assetDir = store.has('assetDir') ? store.get('assetDir') : undefined

var port

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
        click: () => {
          if (win) win.webContents.send(
            'TABS_NEW',
            {parsedURL: '/', adjacent: false}
          )
        }
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

async function loadArchiveData(){
  // Attempt to set up with local files. If anything goes wrong, we'll invalidate the archive/port data. If the render process detects a failure it'll shunt over to setup mode
  // This returns an `archive` object, and does not modify the global archive directly.
  if (win) win.webContents.send('SET_LOAD_STAGE', "ARCHIVE")
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
      flags: {},
      mspfa: {}
    }
  } catch (e) {
    // Error loading json. Probably a bad asset pack installation.
    logger.error(e)
    return undefined
  }

  if (!data) throw new Error("Data empty after attempted load")

  try {
    // Sanity checks
    const required_keys = ['mspa', 'social', 'news', 'music', 'comics', 'extras']
    required_keys.forEach(key => {
      if (!data[key]) throw new Error("Archive object missing required key", key)
    })
  } catch (e) {
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Archive load error',
      message: `Something went wrong while loading the archive. This may be related to an incorrectly-written mod. Check the console log for details.`
    })

    throw e
  }

  if (win) win.webContents.send('SET_LOAD_STAGE', "PATCHES")
  logger.info("Loading patches")
  
  if (win) win.webContents.send('SET_LOAD_STAGE', "LOADED_ARCHIVE_VANILLA")
  return data
}

function getFlashPath(){
  let flashPlugin
  switch (process.platform) {
    case 'win32':
      flashPlugin = `archive/data/plugins/pepflashplayer${process.arch.replace('x', '')}.dll`
      break
    case 'darwin':
      flashPlugin = 'archive/data/plugins/PepperFlashPlayer.plugin'
      break
    case 'linux':
      flashPlugin = 'archive/data/plugins/libpepflashplayer.so'
      break
    default:
      throw Error("Unknown platform", process.platform)
  }

  if (assetDir === undefined) {
    throw Error("Asset directory not yet defined")
  }

  let flashPath = path.join(assetDir, flashPlugin)

  if (process.platform == "win32" && !fs.existsSync(flashPath)) {
    // On a windows install with the old asset pack and a unified DLL
    flashPlugin = 'archive/data/plugins/pepflashplayer.dll'
    flashPath = path.join(assetDir, flashPlugin)
  }
  return flashPath
}

try {
  if (assetDir === undefined) {
    throw Error("Asset directory not yet defined, triggering first run")
  }
  // Pick the appropriate flash plugin for the user's platform
  const flashPath = getFlashPath()

  if (fs.existsSync(flashPath)) {
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath)
  } else throw Error(`Flash plugin not located at ${flashPath}`)

  if (process.platform == 'linux')
    app.commandLine.appendSwitch('no-sandbox')

  if (store.has('settings.smoothScrolling') && store.get('settings.smoothScrolling') === false)
    app.commandLine.appendSwitch('disable-smooth-scrolling')
  
  // Spin up a static file server to grab assets from.
  // Mounts on a dynamically assigned port, which is returned here as a callback.
  const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    response.setHeader('Access-Control-Max-Age', 2592000)
    return handler(request, response, {
      public: assetDir
    })
  })

  server.listen(0, '127.0.0.1', (error) => {
    if (error) throw error
    port = server.address().port

    if (port === undefined) {
      throw Error("Could not initialize internal asset server", server, server.address())
    } else {
      logger.info("Successfully started server", `http://127.0.0.1:${port}/`)
    }
  })
} catch (error) {
  logger.debug(error)
  logger.warn("Loading check failed, loading setup mode")

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

var want_imods_extracted = false

if (assetDir && fs.existsSync(assetDir)) {
  // App version checks
  var last_app_version = store.has("appVersion") ? store.get("appVersion") : '1.0.0'
  if (app.commandLine.hasSwitch('reset-last-version')) {
    logger.warn(`Run with --reset-last-version flag, resetting version from ${last_app_version} to 0.0.0.`)
    last_app_version = '0.0.0'
  }

  const semverGreater = (a, b) => a.localeCompare(b, undefined, { numeric: true }) === 1
  if (!last_app_version || semverGreater(APP_VERSION, last_app_version)) {
    logger.warn(`App updated from ${last_app_version} to ${APP_VERSION}`)
    want_imods_extracted = true // Takes effect when client requests archive
  } else {
    logger.debug(`last version ${last_app_version} gte current version ${APP_VERSION}`)
  }

  store.set("appVersion", APP_VERSION)
} else {
  logger.warn("Deferring app version checks until initial configuration is complete.")
}

// Speed hack, try to preload the first copy of the archive
var first_archive
var archive // Also, keep a reference to the latest archive, for lazy eval

if (assetDir != undefined) {
  try {
    loadArchiveData().then(result => {
      archive = first_archive = result
    }).catch(error => {
      logger.debug(error, "(first load or missing asset pack?)")
    })
  } catch (e) {
    // logger.warn(e)
    // don't even warn, honestly
  }
}

ipcMain.on('RELOAD_ARCHIVE_DATA', async (event) => {
  win.webContents.send('SET_LOAD_STATE', "LOADING")
  try {
    if (first_archive) {
      // Use the preloaded "first archive"
      archive = first_archive
      first_archive = undefined
    } else {
      // Reload the archive data
      archive = await loadArchiveData()
    }
    // search.giveArchive(archive)

    // Communicate version state to imod
    if (want_imods_extracted) {
      logger.info("mods: before loading, please extract imods")
      win.webContents.send('MODS_EXTRACT_IMODS_PLEASE')
    }

    win.webContents.send('ARCHIVE_UPDATE', archive)
  } catch (e) {
    logger.error("Error reloading archive", e)
    win.webContents.send('SET_LOAD_STATE', "ERROR")
  }
  win.webContents.send('SET_LOAD_STATE', "DONE")
})

// search.registerIpc(ipcMain)

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
  e.returnValue = true
  process.exit()
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
      logger.info("New asset directory", assetDir)
      await loadArchiveData() // Run to check if this thows an error

      const flashPath = getFlashPath()
      // logger.info(assetDir, flashPlugin, flashPath)
      if (!fs.existsSync(flashPath)) throw Error(`Flash plugin not found at '${flashPath}'`)
    } catch (error) {
      logger.debug(error)
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
          store.set('assetDir', newPath[0])
        
          if (!isDevelopment) {
            app.relaunch()
            app.exit()
          }
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
  (!isDevelopment) && app.relaunch() // Can't relaunch app and maintain debugger connection
  app.exit()
})

ipcMain.handle('reload', async (event) => {
  win.reload()
})

ipcMain.handle('prompt-okay-cancel', async (event, args) => {
  const title = args.title || "Notice"
  const ok_string = args.okay || "OK"
  const cancel_string = args.cancel || "Cancel"
  const type = args.type || 'warning'
  const answer = dialog.showMessageBoxSync(win, {
    type,
    buttons: [
      ok_string,
      cancel_string
    ],
    cancelId: 1,
    defaultId: 1,
    title,
    message: args.message,
    detail: args.detail
  })
  return (answer === 0)
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
try {
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
        }).catch(err => {throw err})
      // }
    } catch (err) {
      logger.error("Couldn't process image", err)
      // eslint-disable-next-line no-undef
      cb(`${__static}/img/dragSmall.png`)
    }
  })

  ipcMain.handle('copy-image', async (event, payload) => {
    // logger.info(payload.url)
    Sharp(payload.url).png().toBuffer().then(buffer => {
      // logger.info(buffer)
      const sharpNativeImage = nativeImage.createFromBuffer(buffer)
      // logger.info("Sharp buffer ok", !sharpNativeImage.isEmpty())
      clipboard.writeImage(sharpNativeImage)
    })
  })
} catch {
  logger.error("Couldn't install sharp!")
}

let openedWithUrl
const OPENWITH_PROTOCOL = 'mspa'

async function createWindow () {
  // Create the browser window.

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 780
  })

  win = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    'minWidth': 650,
    'minHeight': 600,
    backgroundColor: '#535353',
    useContentSize: true,
    frame: store.get('settings.useSystemWindowDecorations'),
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      plugins: true,
      webviewTag: true
    }
  })

  mainWindowState.manage(win)

  win.webContents.on('zoom-changed', (e, zoomDirection) => {
    if (zoomDirection === 'in') {
      zoomIn()
    }
    if (zoomDirection === 'out') {
      zoomOut()
    }
  })

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
      "*://asset.uhc/*",
      "*://*.sweetcred.com/*"
    ]
  }, (details, callback) => {
    if (details.url.startsWith("assets://")) {
      // const redirectURL = Resources.resolveAssetsProtocol(details.url)
      const reply_channel = 'RESOURCES_RESOLVE_ASSETS_PROTOCOL' + details.url
      win.webContents.send('RESOURCES_RESOLVE_ASSETS_PROTOCOL', reply_channel, details.url)
      ipcMain.once(reply_channel, (event, redirectURL) => {
        if (details.url == redirectURL) {
          const err = `${details.url} is assets url, resolved protocol to ${redirectURL} but is an infinite loop!`
          logger.error(err)
          throw Error(err)
        } else {
          // logger.info(details.url, "is assets url, resolved protocol to", redirectURL)
          const redirect_callback = {redirectURL}
          callback(redirect_callback)
        }
      })
    } else {
      // const destination_url = Resources.resolveURL(details.url)

      const reply_channel = 'RESOURCES_RESOLVE_URL' + details.url
      win.webContents.send('RESOURCES_RESOLVE_URL', reply_channel, details.url)
      ipcMain.once(reply_channel, (event, destination_url) => {
        if (details.url == destination_url) {
          const err = `${details.url} is not assets url, resolving resource to ${destination_url} but is an infinite loop!`
          logger.error(err)
          throw Error(err)
        } else {
          // Okay
          const redirect_callback = {
            redirectURL: destination_url
          }
          // logger.info(details.url, "is not assets url, resolving resource to", destination_url)
          if (details.resourceType == "subFrame")
            win.webContents.send('TABS_PUSH_URL', destination_url)
          else
            callback(redirect_callback)
        }
      })
    }
  })

  // It's important that only one window is ever active at a time
  // Target="_blank"/external links are generally handled through the frontend filter, so should hopefully only intercept flashes
  // Thing is, there isn't a single flash that tries to open an external webpage/new window either! we're just going for the security here
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()

    // const parsedURL = Resources.resolveURL(url)
    const reply_channel = 'RESOURCES_RESOLVE_URL_REPLY' + url
    win.webContents.send('RESOURCES_RESOLVE_URL', url)
    ipcMain.once(reply_channel, (event, parsedURL) => {
      logger.info(`new-window: ${url} ===> ${parsedURL}`)

      // If the given URL is still external, open a browser window.
      if (/http/.test(parsedURL))
        shell.openExternal(url)
      else
        win.webContents.send('TABS_NEW', {url: parsedURL, adjacent: true})
    })
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
    // eslint-disable-next-line no-undef
    new_icon = (new_icon || `@/icons/icon`).replace(/^@/, __static)
    if (new_icon && (new_icon != current_icon)) {
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
