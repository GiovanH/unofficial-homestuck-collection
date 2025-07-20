import Vue from 'vue'

import App from './App'
import router from './router'
import localData from './store/localData'
import errorReporting from './js/errorReporting'

import Memoization from '@/memoization.js'

import Mods from "./mods.js"
import Resources from "./resources.js"

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faExternalLinkAlt, faChevronUp, faChevronRight, faChevronDown, faChevronLeft,
  faSearch, faEdit, faSave, faTrash, faTimes, faPlus, faPen, faMusic, faLock, faUnlock,
  faRedo, faStar, faRandom, faMousePointer, faBookmark, faTerminal, faMapPin, faFolderOpen
} from '@fortawesome/free-solid-svg-icons'

const importAsyncComputed = import('vue-async-computed')
const importFontAwesomeIconObj = import('@fortawesome/vue-fontawesome')

library.add([
  faExternalLinkAlt, faChevronUp, faChevronRight, faChevronDown, faChevronLeft, 
  faSearch, faEdit, faSave, faTrash, faTimes, faPlus, faPen, faMusic, faLock, faUnlock,
  faRedo, faStar, faRandom, faMousePointer, faBookmark, faTerminal, faMapPin, faFolderOpen
])

// Global prereqs

window.isWebApp = (window.isWebApp || false)

const ipcRenderer = require('IpcRenderer')

// Must init resources first.
/* eslint-disable no-redeclare */
var shell, log, port, appVersion
if (!window.isWebApp) {
  var { shell } = require('electron')

  log = require('electron-log')
  log.transports.console.format = '{scope} {text}'
  errorReporting.registerRenderLogger(log)

  var {port, appVersion} = ipcRenderer.sendSync('STARTUP_GET_INFO')

  Resources.init({
    assets_root: `http://127.0.0.1:${port}/`
  })
}

// eslint-disable-next-line no-extend-native
Number.prototype.pad = function(size) {
  if (isNaN(this))
    return undefined
  return this.toString().padStart(size || 2, '0')
}

function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&')
}

const app_domain = window.location.host // (window.isWebApp ? window.webAppDomain : 'localhost:8080')

// Loading checks

// Vue
//
// Promises that all need to complete before we launch the Vue VM
var promises_loading = []

Vue.config.productionTip = false

window.appVersion = appVersion
Vue.use(localData) // Initializes and loads when Vue installs it

// FontAwesomeIconComponent
promises_loading.push((async function() {
  const { FontAwesomeIcon } = await importFontAwesomeIconObj
  Vue.component('fa-icon', FontAwesomeIcon)
})())

// Mixin asynccomputed
promises_loading.push((async function() {
  const AsyncComputed = await importAsyncComputed
  Vue.use(AsyncComputed)
})())

// Mixin mod mixins
promises_loading.push((async function() {
  try {
    const mixins = await Mods.getMixinsAsync()
    mixins.forEach((m) => Vue.mixin(m))
  } catch (e) {
    // Catch error but still allow the vm to init without mods
    log.scope('main.js init').error(e)
  }
})())

Vue.mixin(Memoization.mixin)

Vue.mixin({
  data(){
    return {
      $appVersion: appVersion,
      $expectedAssetVersion: '2'
    }
  },
  computed: {
    $archive() {return this.$root.archive},
    $isNewReader() {
      if (this.$root.guestMode) return false
      return (this.$newReaderCurrent && this.$localData.settings.newReader.limit)
    },
    $newReaderCurrent() {
      return this.$localData.settings.newReader.current
    },
    $logger() { return log.scope(this.$options.name || this.$options._componentTag || "undefc!")},
    $isWebApp() { return window.isWebApp || false }
  },
  methods: {
    $resolvePath(to){
      // Resolves a logical path within the vue router
      // Currently just clamps story URLS to the user specified mspamode setting
      const route = this.$router.resolve(to).route
      const base = route.path.split("/")[1]

      let resolvedUrl = route.path

      if (!this.$localData.settings.mspaMode && base == 'mspa') {
        // Route /mspa/# to /homestuck/#
        const vizNums = this.$mspaToViz(route.params.p)
        if (vizNums) resolvedUrl = `/${vizNums.s}/${vizNums.p}`
      } else if (this.$localData.settings.mspaMode) {
        if (base == 'mspa') {
          const p_padded = route.params.p.padStart(6, '0')
          if (p_padded in this.$archive.mspa.story) resolvedUrl =  `/mspa/${p_padded}` 
        } else if (this.$isVizBase(base)) {
          // Route /homestuck/# to /mspa/#
          const mspaNums = this.$vizToMspa(base, route.params.p)
          if (mspaNums.p) resolvedUrl = `/mspa/${mspaNums.p}`
        }
      }
      return resolvedUrl
    },
    $openModal(to) {
      this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0].openModal(to)
    },
    $openLink(url, auxClick = false) {
      // Open a link. Could be intra-app, external, or an assets:// uri
      //
      const re_local = new RegExp(`^(http://|https://)?(${regExpEscape(app_domain)}|app:\/\/\\.(index)?)`)
      const re_local_index = new RegExp(`^(http://|https://)?(${regExpEscape(app_domain)}|app:\/\/\\.\/)index\\.html\\??`)
      // const re_local_asset = new RegExp(`(http:\/\/127.0.0.1:${port}\/|assets:\/\/)`)

      // Normalize implied proto://./index.html links back to proto://./
      const url_str = url.replace(re_local_index, '$1')
      const urlObject = new URL(url_str)

      function _openExternal(to_) {
        if (!window.isWebApp) {
          shell.openExternal(to_)
        } else {
          window.open(Resources.resolveURL(to_), '_blank').focus()
        }
      }

      // If asset, open in modal or externally as appropriate
      if (urlObject.protocol == "assets:") {
        const to_ = Resources.resolveAssetsProtocol(url)
        if (!/\.(html|pdf|epub)$/i.test(url)) {
          this.$openModal(to_)
        } else {
          _openExternal(to_)
        }
        return
      }
      
      // Else, tests on a real link
      let to = (/mspaintadventures/.test(urlObject.href) && !!urlObject.search) ? urlObject.href : urlObject.pathname
      to = to.replace(/.*mspaintadventures.com\/(\w*\.php)?\?s=(\w*)&p=(\w*)/, "/mspa/$3")
             .replace(/.*mspaintadventures.com\/\?s=(\w*)/, "/mspa/$1")

      if (!re_local.test(urlObject.origin)) {
        // Link is external
        if (urlObject.href.includes('steampowered.com/app')) {
          ipcRenderer.invoke('steam-open', urlObject.href)
        } else _openExternal(urlObject.href)
      } else if (/\.(html|pdf)$/i.test(to)){
        // TODO: Not sure resolveURL is needed here? This should always be external?
        _openExternal(Resources.resolveURL(to))
      } else if (/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(to)){
        this.$logger.error("UNCAUGHT ASSET? Tried to externally open internal(?) asset", to)
        this.$openModal(to)
      } else if (auxClick) {
        this.$localData.root.TABS_NEW(this.$resolvePath(to), true)
      } else {
        this.$pushURL(to)
      }
    },
    $getResourceURL(url) {
      const resource_url = Resources.getResourceURL(url)
      if (window.isWebApp) {
        // simulate webRequest redirection here
        return Resources.resolveURL(url)
      } else {
        return resource_url
      }
    },
    $getChapter: Resources.getChapter,
    $filterURL(u) {return this.$getResourceURL(u)},
    $pushURL(to, key = this.$localData.tabData.activeTabKey){
      const url = this.$resolvePath(to)
      this.$localData.root.TABS_PUSH_URL(url, key)
    },
    $mspaFileStream(url) {
      if (url.startsWith('data:')) {
        return url
      }
      return Resources.toFilePath(Resources.resolveURL(url), this.$localData.assetDir)
    },
    $getStoryNum: Resources.getStoryNum,
    $getAllPagesInStory: Resources.getAllPagesInStory,
    $isVizBase: Resources.isVizBase,
    $parseMspaOrViz(userInput, story = 'homestuck') {
      // Takes a user-formatted string and returns a MSPA page number.
      // The output page number may not be real!
      if (Number.isInteger(userInput)) {
        this.$logger.warn("parseMspaOrViz got int, not string: ", userInput)
        userInput = String(userInput)
      }
      if (this.$localData.settings.mspaMode) {
        return userInput.replace(/^0+/, '').padStart(6, '0')
      } else {
        return this.$vizToMspa(story, userInput).p
      }
    },
    $vizToMspa(vizStory, vizPage) {
      // Resources.vizToMspa, but also checks the archive.
      const undef_page = {s: undefined, p: undefined}
      const {s, p} = Resources.vizToMspa(vizStory, vizPage)
      if (this.$archive) {
        const pageInStory = (p in this.$archive.mspa.story || p in this.$archive.mspa.ryanquest)
        if (!pageInStory) {
          this.$logger.info("$vizToMspa: p", p, "not in story!", vizStory, vizPage)
          return undef_page
        }
      }
      return {s, p}
    },
    $mspaToViz(mspaInput, isRyanquest = false){
      // Resources.mspaToViz, but also checks the archive.
      if (this.$archive) {
        const mspaPage = isNaN(mspaInput) ? mspaInput : mspaInput.padStart(6, '0')
        const pageInStory = (mspaPage in (isRyanquest ? this.$archive.mspa.ryanquest : this.$archive.mspa.story))
        if (!pageInStory) {
          return undefined
        }
      }
      return Resources.mspaToViz(mspaInput, isRyanquest)
    },
    $mspaOrVizNumber(mspaId){
      // Formates a mspaId as either an mspaId or viz number, depending on user settings.
      // Future Gio: This used to be here:
      // || !(mspaId in this.$archive.mspa.story)
      // We shouldn't need that, but if something breaks, that's why.
      return this.$localData.settings.mspaMode 
        ? mspaId 
        : this.$mspaToViz(mspaId).p
    },
    $updateNewReader(thisPageId, forceOverride = false) {
      if (!this.$isNewReader && !forceOverride)
        return // don't reset non-new reader back to new-reader mode unless explicitly forced

      const isSetupMode = !this.$archive
      const isNumericalPage = /\d/.test(thisPageId)
      const endOfHSPage = (this.$archive ? this.$archive.tweaks.endOfHSPage : "010030")
      const isInRange = '000219' <= thisPageId && thisPageId <= endOfHSPage // in the "keep track of spoilers" range

      if (isNumericalPage && isInRange && (isSetupMode || thisPageId in this.$archive.mspa.story)) {
        let nextLimit

        // Some pages don't directly link to the next page. These are manual exceptions to catch them up to speed
        /* eslint-disable brace-style */
        if (!isSetupMode) {
          // Calculate nextLimit
          var offByOnePages = this.$archive.tweaks.offByOnePages

          if (offByOnePages.includes(thisPageId)) {
            nextLimit = (parseInt(thisPageId) + 1).pad(6)
          }

          // else if ('000373' == thisPageId) nextLimit = '000375' // Problem sleuth multiple options

          // End of problem sleuth
          else if (thisPageId == '001892') nextLimit  = '001902'

          // A6 CHARACTER SELECTS
          else if ('006021' <= thisPageId && thisPageId <= '006094') nextLimit = '006095' // Jane+Jake
          else if ('006369' <= thisPageId && thisPageId <= '006468') nextLimit = '006469' // Roxy+Dirk

          // A6A5A1x2 COMBO
          else if ('007688' <= thisPageId && thisPageId <= '007825') {
            // Sets the next page an extra step ahead to account for the x2 shittery
            const isLeftPage = !(thisPageId % 2)
            const page = this.$archive.mspa.story[thisPageId]
            const nextPageOver = this.$archive.mspa.story[page.next[0]].next[0]
            let nextPageId 
            if (isLeftPage) {
              nextPageId = this.$archive.mspa.story[nextPageOver].next[0]
            } else {
              nextPageId = nextPageOver
            }
            nextLimit = nextPageId
          }

          else if (this.$archive.tweaks.tzPasswordPages.includes(thisPageId)) {
            this.$logger.info("Not advancing to terezi page")
            return
          }
          // IF NEXT PAGE ID IS LARGER THAN WHAT WE STARTED WITH, JUST USE THAT
          // On normal pages, always pick the lowest next-pageId available. The higher one is a Terezi password 100% of the time
          else nextLimit = [...this.$archive.mspa.story[thisPageId].next].sort()[0]
        }
        // Safeguard to catch an unset nextLimit
        if (isSetupMode || !nextLimit) nextLimit = thisPageId

        if (thisPageId == endOfHSPage) {
          // Finished Homestuck.
          this.$localData.root.NEW_READER_CLEAR()
          this.$root.$children[0].$refs.notifications.allowEndOfHomestuck()
        } else {
          const resultCurrent = (forceOverride || !this.$newReaderCurrent || this.$newReaderCurrent < thisPageId) ? thisPageId : false
          const resultLimit = (forceOverride || !this.$localData.settings.newReader.limit || this.$localData.settings.newReader.limit < nextLimit) ? nextLimit :  false

          // If you've reached that page where a retcon happened, mark the flag.
          if (resultCurrent) {
            this.$localData.settings.retcon1 = (resultCurrent >= '007999')
            this.$localData.settings.retcon2 = (resultCurrent >= '008053')
            this.$localData.settings.retcon3 = (resultCurrent >= '008317')
            this.$localData.settings.retcon4 = (resultCurrent >= '008991')
            this.$localData.settings.retcon5 = (resultCurrent >= '009026')
            this.$localData.settings.retcon6 = (resultCurrent >= '009057')
          }
          
          if (resultCurrent || resultLimit) {
            this.$localData.root.NEW_READER_SET(resultCurrent, resultLimit)
            if (!isSetupMode) this.$popNotifFromPageId(resultCurrent)
          }
        }
      } else this.$logger.warn(`Invalid page ID '${thisPageId}', not updating progress`)
    },
    $shouldRetcon(retcon_id){
      console.assert(/retcon\d/.test(retcon_id), retcon_id, "isn't a retcon ID! Should be something like 'retcon4'")
      // If fast-forward, always retcon.
      if (this.$localData.settings.fastForward)
        return true

      // Else, only if the flag is set.
      return this.$localData.settings[retcon_id]
    },
    $popNotifFromPageId(pageId) {
      // Don't error even if triggered from setup page
      const notifications = this.$root.$children[0].$refs.notifications
      if (notifications) {
        notifications.queueFromPageId(pageId)
      } else {
        this.$logger.error("Missing notifications ref!")
      }
    },
    $pushNotif(notif) {
      // Don't error even if triggered from setup page
      const notifications = this.$root.$children[0].$refs.notifications
      if (notifications) {
        notifications.queueNotif(notif)
      } else {
        this.$logger.error("Missing notifications ref!")
      }
    },
    $timestampIsSpoiler(timestamp){
      if (!this.$isNewReader) return false

      const latestTimestamp = this.$archive.mspa.story[this.$newReaderCurrent].timestamp
      let nextTimestamp
      try {
        nextTimestamp = this.$archive.mspa.story[this.$archive.mspa.story[this.$newReaderCurrent].next[0]].timestamp
      } catch {
        this.$logger.warn("Couldn't get 'next page' for timestampIsSpoiler")
        nextTimestamp = latestTimestamp
      }

      if (timestamp > nextTimestamp) {
        // this.$logger.info(`Checked timestamp ${timestamp} is later than ${latestTimestamp}, spoilering`)
        // const { DateTime } = require('luxon');
        // let time_zone = "America/New_York"
        // this.$logger.info(`Checked timestamp ${DateTime.fromSeconds(Number(timestamp)).setZone(time_zone).toFormat("MM/dd/yy")} is earlier than ${DateTime.fromSeconds(Number(latestTimestamp)).setZone(time_zone).toFormat("MM/dd/yy")}, spoilering`)
        
        return true
      } else return false
    },
    $pageIsSpoiler(page, useLimit = false) {
      // The new-reader setting is split into two values: "current", and "limit"
      // "current" is the highest page the reader has actually visited. By setting "useLimit" to false, you can use this function to only display content up to a point the reader has seen.
      // "limit" is the highest page the reader is *allowed* to visit. This is generally set one page ahead of the current page, but in some circumstances like character select screens, it can go much further.
      
      // "Hiveswap Friendsim" and "Pesterquest" are pseudopages used by the bandcamp viewer
      // to reference tracks and volumes, i.e. "Pesterquest: Volume 14"

      if (this.$root.guestMode) return false
      if (!this.$archive) return true // Setup mode

      const parsedLimit = parseInt(this.$localData.settings.newReader[useLimit ? 'limit' : 'current'])
      const parsedPage = parseInt(page)
      return this.$isNewReader && (
        (page in this.$archive.mspa.story && (
          (!!parsedPage && parsedLimit < parsedPage) ||
          (page == 'pony' && parsedLimit < (useLimit ? 2839 : 2838)) ||
          (page == 'darkcage' && parsedLimit < (useLimit ? 6274 : 6273)) ||
          (page == 'pony2' && parsedLimit < (useLimit ? 6518 : 6517)) ||
          (page == 'darkcage2' && parsedLimit < (useLimit ? 6928 : 6927))
        )) || page.includes('Hiveswap Friendsim: ') || page.includes('Pesterquest: ')
      )
    },
    $trackIsSpoiler(ref) {
      if (this.$isNewReader && ref in this.$archive.music.tracks) {
        const track = this.$archive.music.tracks[ref]
        // Try to find a single linked page or album that isn't a spoiler. If we can't, block it.
        // if it's referenced by an unreleased track, that's not good enough. it has to be reference that unreleased track *itself* 
        // From the unreleased track's perspective: if it's referenced by a known track, it's ok. Whether or not it references a known track shouldn't affect it.
        
        return !(
          (track.pages && track.pages.find(page => !this.$pageIsSpoiler(page))) ||
          (track.album && track.album.find(album => {
            if (album == 'unreleased-tracks' && track.referencedBy) {
              return track.referencedBy.find(track => !this.$trackIsSpoiler(track))
            } else return !this.$albumIsSpoiler(album)
          }))
        )
      } else return false
    },
    $albumIsSpoiler(ref) {
      if (this.$isNewReader && ref in this.$archive.music.albums && this.$archive.music.albums[ref].date) {
        // It's a spoiler if it belongs to an album with a more recent timestamp than the current page
        let date

        if (ref == 'homestuck-vol-1') date = this.$archive.mspa.story['002340'].timestamp // During third Rose GameFAQs, after Nanna expodump
        else if (ref == 'homestuck-vol-5') date = this.$archive.mspa.story['003841'].timestamp // Curtains after [S] Descend
        else if (ref == 'homestuck-vol-6') date = this.$archive.mspa.story['005127'].timestamp // During LE/Recap 3 Huss interruption
        else if (ref == 'song-of-skaia') date = this.$archive.mspa.story['006291'].timestamp // Immediately after EOA6I1
        else if (ref == 'colours-and-mayhem-universe-b') date = this.$archive.mspa.story['006716'].timestamp // Immediately after DOTA, before EOY3 shown
        else if (ref == 'homestuck-vol-9') date = this.$archive.mspa.story['006928'].timestamp // After Terry: FF to Liv, before cherub chess
        else if (ref == 'symphony-impossible-to-play') date = this.$archive.mspa.story['007162'].timestamp // Just after Caliborn: Enter, before openbound 1
        else if (ref == 'one-year-older') date = this.$archive.mspa.story['007162'].timestamp // Just after Caliborn: Enter, before openbound 1
        else if (ref == 'cherubim') date = this.$archive.mspa.story['007882'].timestamp // After Interfishin, right when Caliborn/Calliope expodump begins

        else date = new Date(this.$archive.music.albums[ref].date).getTime() / 1000
        this.$logger.debug(ref, this.$archive.mspa.story['006716'].timestamp)
        return date > this.$archive.mspa.story[this.$newReaderCurrent].timestamp
      } else return false
    }
  } 
})

window.Vue = Vue

// Resolve all promises, then make app
Promise.all(promises_loading).then(_ => {
  // Once JS loads from network, replace barebones preloader with vue preloader.
  const preloader_div = document.getElementById("prepreloader")
  if (preloader_div) preloader_div.remove()

  // Mount vue
  window.vm = new Vue({
    data(){
      return {
        archive: undefined,
        loadState: undefined,
        loadError: undefined,
        loadErrorResponsibleMods: undefined,
        loadStage: undefined,
        guestMode: false,
        platform: (window.isWebApp ? "webapp" : "electron"),
        tabTheme: {} // Modified by App (avoid reacting to refs)
      }
    },
    computed: {
      // Easy access
      app(){ return this.$refs.App }
    },
    asyncComputed: {
      modChoices: {
        default: {},
        async get() {
          return (await Mods.loadModChoicesAsync())
        }
      }
    },
    router,
    render: function (h) { return h(App, {ref: 'App'}) },
    watch: {
      '$localData.settings.devMode'(to, from){
        if (log.transports) {
          const is_dev = to
          log.transports.console.level = (is_dev ? "silly" : "info")
          this.$logger.silly("Verbose log message for devs")
          this.$logger.info("Log message for everybody")
        }
        this.$localData.VM.saveLocalStorage()
      }
    }
  }).$mount('#app')
})

// Even though we cancel the auxclick, reallly *really* cancel mouse navigation.
window.addEventListener("mouseup", (e) => {
  if (e.button === 3 || e.button === 4){
    window.vm.$logger.info("blocking mouse navigation")
    e.preventDefault()
  }
})

// Expose for debugging
window.Resources = Resources
window.Mods = Mods
window.doFullRouteCheck = Mods.doFullRouteCheck

// window.onbeforeunload = () => "please.... stay";
