'use strict'

import { app, BrowserWindow, ipcMain, Menu, protocol, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
import FlexSearch from 'flexsearch'

const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

const handler = require('serve-handler')
const http = require ('http')

const Store = require('electron-store')
const store = new Store()


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null
const gotTheLock = app.requestSingleInstanceLock()

//Improve overall performance by disabling GPU acceleration
//We're not running crysis or anything its all gifs
app.disableHardwareAcceleration()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true } },
  { scheme: 'css', privileges: { standard: true } }
])

var assetDir = store.has('localData.assetDir') ? store.get('localData.assetDir') : undefined
var archive
var port
var menuTemplate 
// Attempt to set up with local files. If anything goes wrong, we'll invalidate the archive/port data. If the render process detects a failure it'll shunt over to setup mode
try {
  if (!assetDir) throw "No reference to asset directory"

  //Grab and parse all data jsons
  archive = {
    ...JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/version.json'), 'utf8')),
    mspa : JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/mspa.json'), 'utf8')),
    log : JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/log.json'), 'utf8')),
    social : JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/social.json'), 'utf8')),
    music : JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/music.json'), 'utf8')),
    comics : JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/comics.json'), 'utf8')),
    search: JSON.parse(fs.readFileSync(path.join(assetDir, 'archive/data/search.json'), 'utf8'))
  }

  //Pick the appropriate flash plugin for the user's platform
  let flashPlugin
  switch (process.platform) {
    case 'win32':
      flashPlugin = 'archive/data/plugins/pepflashplayer.dll'
      break
    case 'darwin':
      flashPlugin = 'archive/data/plugins/PepperFlashPlayer.plugin'
      break
    case 'linux':
      flashPlugin = 'archive/data/plugins/libpepflashplayer.so'
      break
  }
  let flashPath = path.join(assetDir, flashPlugin)
  if (fs.existsSync(flashPath)) {
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath)
    if (process.platform == 'linux') app.commandLine.appendSwitch('no-sandbox')
    if (store.get('localData.settings.noSmoothScrolling')) app.commandLine.appendSwitch('disable-smooth-scrolling')
  }
  else throw `Flash plugin not located at ${flashPath}`

  //Set up search index
  var chapterIndex = new FlexSearch({
    doc: {
      id: 'key',
      field: 'content',
      tag: 'chapter'
    }
  })
  chapterIndex.add(archive.search)
  
  //Menu won't be visible to most users, but it helps set up default behaviour for most common key combos
  menuTemplate = [
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
          click: () => {win.webContents.send('ZOOM_IN')}
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {win.webContents.send('ZOOM_OUT')}
        },
        {
          label: 'Zoom In',
          visible: false,
          acceleratorWorksWhenHidden: true,
          accelerator: 'CommandOrControl+numadd',
          click: () => {win.webContents.send('ZOOM_IN')}
        },
        {
          label: 'Zoom Out',
          visible: false,
          acceleratorWorksWhenHidden: true,
          accelerator: 'CommandOrControl+numsub',
          click: () => {win.webContents.send('ZOOM_OUT')}
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {win.webContents.send('ZOOM_RESET')}
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
          click: () => {win.webContents.send('TABS_HISTORY_BACK')}
        },
        {
          label: 'Go forward one page',
          accelerator: 'Alt+Right',
          click: () => {win.webContents.send('TABS_HISTORY_FORWARD')}
        },
        { type: 'separator' },
        {
          label: 'New Tab',
          accelerator: 'CmdOrCtrl+T',
          click: () => {win.webContents.send('TABS_NEW', {parsedURL: '/', adjacent: false})}
        },
        {
          label: 'Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click: () => {win.webContents.send('TABS_CLOSE')}
        },
        { type: 'separator' },
        {
          label: 'Next Tab',
          accelerator: 'CmdOrCtrl+Tab',
          click: () => {win.webContents.send('TABS_CYCLE', {amount: 1})}
        },
        {
          label: 'Previous Tab',
          accelerator: 'CmdOrCtrl+Shift+Tab',
          click: () => {win.webContents.send('TABS_CYCLE', {amount: -1})}
        },
        { type: 'separator' },
        {
          label: 'Duplicate Tab',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: () => {win.webContents.send('TABS_DUPLICATE')}
        },
        {
          label: 'Restore Closed Tab',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => {win.webContents.send('TABS_RESTORE')}
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
          click: () => { win.webContents.send('OPEN_JUMPBOX') }
        },
        {
          label: 'Find in page',
          accelerator: 'CmdOrCtrl+F',
          click: () => { win.webContents.send('OPEN_FINDBOX') }
        },
        { role: 'minimize' },
      ]
    }
  ]
  
  //Spin up a static file server to grab assets from. Mounts on a dynamically assigned port, which is returned here as a callback.
  const server = http.createServer((request, response) => {
    return handler(request, response, {
        public: assetDir
    })
  })

  server.listen(0, '127.0.0.1', (error) => {
    if (error) throw error
    port = server.address().port
  })
} 
catch (error) {
  console.log(error)

  //If anything fails to load, the application will start in setup mode. This will always happen on first boot! It also covers situations where the assets failed to load.
  //Specifically, the render process bases its decision on whether archive is defined or not. If undefined, it loads setup mode.
  port = undefined
  archive = undefined
  
  //Throw together a neutered menu for setup mode
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
          click: () => {win.webContents.send('ZOOM_IN')}
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {win.webContents.send('ZOOM_OUT')}
        },
      ]
    }
  ]
}
finally {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

//The renderer process requests the chosen port on startup, which we're happy to oblige
ipcMain.on('STARTUP_REQUEST', (event) => {
  event.returnValue = { port, archive }
})

ipcMain.handle('win-minimize', async (event) => {
  win.minimize()
})
ipcMain.handle('win-maximize', async (event) => {
  if (win.isFullScreen()){
    win.setFullScreen(false)
  }
  else if(win.isMaximized()){
    win.unmaximize()
  }
  else{
    win.maximize()
  }
})
ipcMain.handle('win-close', async (event) => {
  win.close()
})

ipcMain.handle('save-file', async (event, payload) => {
  let newPath = dialog.showSaveDialogSync(win, {
    defaultPath: path.basename(payload.url)
  })
  if (newPath) fs.createReadStream(payload.url).pipe(fs.createWriteStream(newPath))
})

ipcMain.handle('inspect-element', async (event, payload) => {
  win.webContents.inspectElement(payload.x, payload.y)
})

ipcMain.handle('locate-assets', async (event, payload) => {
  let defaultPath = assetDir || undefined
  let newPath = dialog.showOpenDialogSync(win, {
    defaultPath,
    properties: [
      'openDirectory'
    ]
  })
  if (newPath) {
    let validated = true
    try {
      let testAssets = {
        ...JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/version.json'), 'utf8')),
        mspa : JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/mspa.json'), 'utf8')),
        log : JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/log.json'), 'utf8')),
        social : JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/social.json'), 'utf8')),
        music : JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/music.json'), 'utf8')),
        comics : JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/comics.json'), 'utf8')),
        search: JSON.parse(fs.readFileSync(path.join(newPath[0], 'archive/data/search.json'), 'utf8'))
      }

      let flashPlugin
      switch (process.platform) {
        case 'win32':
          flashPlugin = 'archive/data/plugins/pepflashplayer.dll'
          break
        case 'darwin':
          flashPlugin = 'archive/data/plugins/PepperFlashPlayer.plugin'
          break
        case 'linux':
          flashPlugin = 'archive/data/plugins/libpepflashplayer.so'
          break
      }
      if (!fs.existsSync(path.join(newPath[0], flashPlugin))) throw "Flash plugin not found"
    }
    catch(error) {
      console.log(error)
      validated = false
    }

    if (validated) {
      if (payload.restart) {
        let confirmation = dialog.showMessageBoxSync(win, {
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
      }
      else return newPath[0]
    }
    else {
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

ipcMain.handle('factory-reset', async (event) => {
  let confirmation = dialog.showMessageBoxSync(win, {
    type: 'warning',
    buttons: [
      'OK',
      'Cancel'
    ],
    cancelId: 1,
    defaultId: 1,
    title: 'Notice',
    message: 'Are you absolutely sure? This will reset everything: Your reading progress, tab history, save files, and settings will all be completely gone!'
  })
  if (confirmation == 0) {
    store.delete('localData')
  
    app.relaunch()
    app.exit()
  }
})

ipcMain.handle('disable-new-reader', async (event) => {
  return dialog.showMessageBoxSync(win, {
    type: 'warning',
    buttons: [
      'OK',
      'Cancel'
    ],
    cancelId: 1,
    defaultId: 1,
    title: 'Notice',
    message: 'Watch out! Once you disable new reader mode, major Homestuck spoilers will immediately become visible on many pages of the collection. Are you sure you want to go ahead?'
  })
})

ipcMain.handle('search', async (event, payload) => {
  let keyAlias = {
    "mc0001": 1892.5,
    "jb2_000000": 135.5,
    "pony": 2838.5,
    "pony2": 6517.5,
    "darkcage": 6273.5,
    "darkcage2": 6927.5
  }
  
  let limit = 1000
  let sort = (a, b) => {
    let aKey = Number.isNaN(parseInt(a.key)) ? keyAlias[a.key] : parseInt(a.key)
    let bKey = Number.isNaN(parseInt(b.key)) ? keyAlias[a.key] : parseInt(b.key)
    return (payload.sort == 'desc') 
      ? aKey > bKey ? -1 : aKey < bKey ? 1 : 0 
      : aKey < bKey ? -1 : aKey > bKey ? 1 : 0
  }

  let filteredIndex
  if (payload.filter[0]) {
    let items = chapterIndex.where(function(item) {
      return payload.filter.includes(item.chapter)
    })
    limit = items.length < 1000 ? items.length : 1000
    filteredIndex = new FlexSearch({doc: {id: 'key', field: 'content'}}).add(items)
  }
  else {
    filteredIndex = chapterIndex
  }

  let results = (payload.sort == 'asc' || payload.sort == 'desc') 
    ? filteredIndex.search(payload.input, {limit, sort})
    : filteredIndex.search(payload.input, {limit})

  let foundText = []
  for (const page of results) {
    let flex = new FlexSearch()
    let lines = page.content.split('###')
    for (let i = 0; i < lines.length; i++) {
      flex.add(i, lines[i])
    }
    let indexes = flex.search(payload.input)
    let output = []
    for (let i = 0; i < indexes.length; i++) {
      output.push(lines[indexes[i]])
    }
    if (output.length > 0){
      foundText.push({
        key: page.key,
        lines: output
      })
    }
  }
  return foundText
})


//Hook onto image drag events to allow images to be dragged into other programs
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: `${__static}/img/dragSmall.png`
  })
})

ipcMain.on('steam-open', async (event, id) => {
  const steamUrl = `steam://url/StoreAppPage/${id}`
  const browserUrl = `https://store.steampowered.com/app/${id}`
  if (app.getApplicationNameForProtocol(steamUrl)) {
    await shell.openExternal(steamUrl)
  } else {
    await shell.openExternal(browserUrl)
  }
})

//Define which URL schemes to be intercepted
const filter = {
  urls: [
    '*://*.mspaintadventures.com/*', 
    'css://*/*',
    "http://www.turner.com/planet/mp3/cp_close.mp3", 
    "http://fozzy42.com/SoundClips/Themes/Movies/Ghostbusters.mp3", 
    "http://pasko.webs.com/foreign/Aerosmith_-_I_Dont_Wanna_Miss_A_Thing.mp3", 
    "http://www.timelesschaos.com/transferFiles/618heircut.mp3",
    "*://*.sweetcred.com/*",
  ]
}
//Rules for transforming intercepted URLS
function filterURL(url) {
  return url
    .replace(/.*mspaintadventures.com(\/credits\/(?:sound|art)credits)/, "$1") //Linked from a few flashes
    .replace(/.*mspaintadventures.com\/((scratch|trickster|ACT6ACT5ACT1x2COMBO|ACT6ACT6)\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$4") //Covers for 99% of flashes that link to other pages
    .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1") //Covers for story links without page numbers
    .replace(/.*mspaintadventures.com\/extras\/PS_titlescreen\//, "/unlock/PS_titlescreen") //Link from CD rack flash
    .replace(/http:\/\/www\.sweetcred\.com/, `http://127.0.0.1:${port}/archive/sweetcred`)
    .replace(/(www\.turner\.com\/planet\/mp3|fozzy42\.com\/SoundClips\/Themes\/Movies|pasko\.webs\.com\/foreign)/, `127.0.0.1:${port}/storyfiles/hs2/00338`) // phat beat machine
    .replace(/www\.timelesschaos\.com\/transferFiles/, `127.0.0.1:${port}/storyfiles/hs2/03318` ) // return to core - 618heircut.mp3
    .replace(/css\:\/\//, `http://127.0.0.1:${port}/`) //Used to redirect CSS resource requests to asset folder
    .replace(/http\:\/\/((www|cdn)\.)?mspaintadventures\.com/, `http://127.0.0.1:${port}`) //Complete, should ideally never happen and probably won't work properly if it does
}

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
		'minWidth': 1000,
    'minHeight': 600,
    backgroundColor: '#535353',
    useContentSize: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      plugins: true
    }
  })

  //Catch-all to prevent navigating away from application page
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })
  
  //This should only ever trigger from flashes requesting resources or page redirects
  win.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
    console.log(`onBeforeRequest: ${details.url} ===> ${filterURL(details.url)}`)
    if (details.resourceType =="subFrame") win.webContents.send('TABS_PUSH_URL', filterURL(details.url))
		else callback({redirectURL: filterURL(details.url)})
	})

  //It's important that only one window is ever active at a time
  //Target="_blank"/external links are generally handled through the frontend filter, so should hopefully only intercept flashes
  //Thing is, there isn't a single flash that tries to open an external webpage/new window either! we're just going for the security here
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    let parsedURL = filterURL(url)
    console.log(`new-window: ${url} ===> ${parsedURL}`)
    if (/http/.test(parsedURL)) shell.openExternal(url) //if filterURL didnt work, open in the browser just to be safe
    else win.webContents.send('TABS_NEW', {url: parsedURL, adjacent: true})
  })


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } 
  else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
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


if (!gotTheLock) {
  app.quit()
} 
else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  app.whenReady().then(async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
  })
}

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
