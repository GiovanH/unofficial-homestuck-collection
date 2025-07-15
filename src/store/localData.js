import Vue from 'vue'
const semver = require("semver");

// isWebApp for main-process electron execution
const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false

const migrations = {
  '2.3.0': store => {
    // Migrate storage
    console.log("Migrating localData monolith for 2.3.0")
    const local_data_prev = store.get('localData', {})
    store.delete('localData')
    store.set(local_data_prev)
  },
  '2.4.4': store => {
    // Migrate storage
    console.log("Migrating line height for 2.4.4")
    const settings_prev = store.get('settings', {})
    if (settings_prev && settings_prev.textOverride) {
      const incremented_height = Number(settings_prev.textOverride.lineHeight) + 1
      store.set('settings.textOverride.lineHeight', incremented_height)
    }
  },
  '2.5.8': store => {
    console.log("Migrating text size for 2.5.8")
    const settings_prev = store.get('settings', {})
    if (settings_prev && settings_prev.textOverride) {
      const incremented_size = Number(settings_prev.textOverride.fontSize) + 1
      console.log("textOverride.fontSize:", settings_prev.textOverride.fontSize, '->', incremented_size)
      store.set('settings.textOverride.fontSize', incremented_size)
    }
  },
  '2.6.9': store => {
    const settings_prev = store.get('settings', {})
    if (settings_prev && !isWebApp && settings_prev.ruffleFallback) {
      store.set('settings.ruffleFallback', false)
    }
  }
}

var store, log;
if (!window.isWebApp) {
  const Store = require('electron-store')
  store = new Store({migrations})
  log = require('electron-log')
} else {
  store = require('@/../webapp/localstore.js')
  log = { scope() { return console; } }
}

const LOADED_TAB_LIMIT = 10
const DEAD_TAB_LIMIT = 15
const HISTORY_LIMIT = 350

const DEFAULT_TABDATA = {
  activeTabKey: "000",
  tabs: {
    "000": {
      key: "000",
      url: '/',
      title: '',
      hasEmbed: false,
      history: [],
      future: []
    }
  },
  tabList: [
    "000"
  ],
  sortedTabList: [
    "000"
  ],
  closedTabList: [
  ]
}

const DEFAULT_SETTINGS = {
  newReader: {
    current: '001901',
    limit: '001902'
  },
  notifications: true,
  subNotifications: false,

  showAddressBar: true,
  urlTooltip: true,
  switchToNewTabs: false,
  forceScrollBar: true,
  hideFullscreenHeader: false,
  smoothScrolling: true,
  pixelScaling: true,
  mspaMode: false,
  bandcampEmbed: true,
  allowSysUpdateNotifs: true,
  lastCheckedUpdate: "",
  devMode: false,
  enableHardwareAcceleration: false,
  useSystemWindowDecorations: false,
  useTabbedBrowsing: true,

  themeOverride: "default",
  themeOverrideUI: "default",
  forceThemeOverride: false,
  forceThemeOverrideUI: false,

  textOverride: {
    fontFamily: "",
    bold: false,
    fontSize: 1,
    lineHeight: 1,
    paragraphSpacing: false,
    highContrast: false
  },
  arrowNav: true,
  openLogs: false,
  hqAudio: true,
  jsFlashes: true,
  reducedMotion: false,
  credits: true,

  fastForward: false,

  retcon1: true,
  retcon2: true,
  retcon3: true,
  retcon4: true,
  retcon5: true,
  retcon6: true,

  bolin: false,
  soluslunes: false,
  unpeachy: false,
  pxsTavros: false,
  cursedHistory: false,
  ruffleFallback: false,

  modListEnabled: [],  // name hardcoded in mods.js, be careful
  ...(window.webAppOpinionatedDefaults || {})
}

const DEFAULT_SAVEDATA = {
  saves: {
  },
  saveList: [
  ]
}

class LocalData {
  constructor(init) {
    const data = init || {
      assetDir: '',
      tabData: DEFAULT_TABDATA,
      saveData: DEFAULT_SAVEDATA,
      settings: DEFAULT_SETTINGS,
      store: store
    }

    this.VM = new Vue({ 
      data: () => ({
        ...data,
        temp: {
          visited: [],
          loadedTabList: [],
          tabChainIndex: undefined,
          isPoppingState: false,
          saveDebounce: false
        }
      }),
      computed: {
        $logger() { return log.scope("localData") },
        activeTabIndex() {
          return this.tabData.sortedTabList.indexOf(this.tabData.activeTabKey)
        },
        activeTabObject() {
          return this.tabData.tabs[this.tabData.activeTabKey]
        },
        allHistory() {
          return this.tabData.tabList.map(
            key => this.tabData.tabs[key]
          ).reduce((a, t) => {
            a.push(t.url)
            return a.concat(t.history)
          }, [])
        },
        openUrls() {
          return this.tabData.tabList.map(
            key => this.tabData.tabs[key]
          ).map(tab => tab.url)
        }
      },
      methods: {
        _migrateStorage(new_version) {
          const MIGRATION_KEY = 'last_migrated_version'

          const prev_version = this.store.get(MIGRATION_KEY) || '2.5.0'

          if (prev_version != new_version) {
            console.log("Migrating storage from", prev_version, "to", new_version)
            for (const migration_version in migrations) {
              if (semver.gt(migration_version, prev_version)) {
                console.log("Performing migration for", migration_version)
                migrations[migration_version](this.store)
                this.store.set(MIGRATION_KEY, migration_version)
              }
            }
          }
        },
        _saveLocalStorage() {
          if (this.saveDebounce) {
            clearTimeout(this.saveDebounce)
            this.saveDebounce = undefined
          }
          const all = this.store.get()
          delete all['__internal__'] // Not allowed to save this key

          all["timestamp"] = Date.now()
          all['assetDir'] = this.assetDir
          all['tabData'] = this.tabData
          all['saveData'] = this.saveData
          all['settings'] = this.settings
          try {
            this.store.set(all)
          } catch (e) {
            this.$logger.debug(all)
            throw e
          }
        },
        applySaveIfPending() {
          if (this.saveDebounce) {
            this._saveLocalStorage()
          }
        },
        saveLocalStorage() {
          if (this.saveDebounce) clearTimeout(this.saveDebounce)
          this.saveDebounce = setTimeout(this._saveLocalStorage, 1000)
        },
        clearLocalStorage() {
          this.applySaveIfPending()
          this.store.delete('timestamp')
          this.store.delete('assetDir')
          this.store.delete('tabData')
          this.store.delete('saveData')
          this.store.delete('settings')
          this.reloadLocalStorage()
        },
        reloadLocalStorage() {
          this.applySaveIfPending()
          const all = this.store.get()
          const back = {
            assetDir: all['assetDir'] || '',
            saveData: all['saveData'] || DEFAULT_SAVEDATA,
            settings: {...DEFAULT_SETTINGS, ...all['settings']},
            tabData: all['tabData'] || DEFAULT_TABDATA
          }

          this.assetDir = back.assetDir
          this.saveData = back.saveData
          this.settings = back.settings
          if (this.settings.useTabbedBrowsing) {
            this.temp.isPoppingState = true
            this.tabData = back.tabData
            this.$nextTick(_ => {
              // Watcher runs here
              this.$nextTick(_ => {
                // If the watcher *didn't* run (path was root) unset flag now
                this.temp.isPoppingState = false
              })
            })
          }
          // console.log(this.settings)
        },
        HISTORY_CLEAR() {
          this.tabData.tabList.forEach(k => {
            this.tabData.tabs[k].history = []
          })
          this.saveLocalStorage()
        },
        TABS_RESET() {
          this.$set(this, 'tabData', {
            activeTabKey: "000",
            tabs: {
              "000": {
                key: "000",
                url: '/',
                title: '',
                hasEmbed: false,
                history: [],
                future: []
              }
            },
            tabList: [
              "000"
            ],
            sortedTabList: [
              "000"
            ],
            closedTabList: [
            ]
          })
          this.temp.loadedTabList = []
          this.temp.tabChainIndex = undefined

          this.saveLocalStorage()
        },

        TABS_PUSH_URL (url="/", key = this.tabData.activeTabKey) {
          window.getSelection().empty()
          try {
            document.getElementById(key).scrollTop = 0
            document.getElementById(key).scrollLeft = 0
          } catch {
            console.warn("Tab key element not loaded in document", key)
          }

          this.tabData.tabs[key].history.push(this.tabData.tabs[key].url)
          this.tabData.tabs[key].future = []
          while (this.tabData.tabs[key].history.length > HISTORY_LIMIT) this.tabData.tabs[key].history.shift()
          this.$set(this.tabData.tabs[key], 'url', url)

          this.push_new_history()
          this.saveLocalStorage()
        },

        TABS_NEW (url = '/', adjacent = false) {
          if (!this.settings.useTabbedBrowsing) {
            return this.TABS_PUSH_URL(url)
          }
          let key
          do {
            key = Math.random().toString(36).substring(2, 5)
          } while (key in this.tabData.tabs)

          this.$set(this.tabData.tabs, key, {
            key: key,
            url: url,
            title: '',
            hasEmbed: false,
            history: [],
            future: []
          })

          this.tabData.tabList.push(key)

          // If adjacent, chain new tabs along in sequence next to the current tab. Otherwise, place tab at end of array
          if (adjacent) {
            this.temp.tabChainIndex = this.temp.tabChainIndex ? this.temp.tabChainIndex + 1 : this.activeTabIndex + 1
            this.tabData.sortedTabList.splice(this.temp.tabChainIndex, 0, key)
          } else {
            this.tabData.sortedTabList.push(key)
          }

          if (this.tabData.tabList.length > this.tabData.sortedTabList.length) this.TABS_RESYNC()

          if (!adjacent || this.tabData.tabList.length == 1 || this.settings.switchToNewTabs){
            this.TABS_SWITCH_TO(key)
          } else {
            // TABS_SWITCH_TO also saves localStorage, so we only need to run this here if we're not switching tabs
            this.saveLocalStorage()
          }
        },

        TABS_DUPLICATE (target = this.tabData.activeTabKey, adjacent = true, historyMode = false) {
          if (target in this.tabData.tabs) {
            if (!this.settings.useTabbedBrowsing) {
              return
            }
            let key
            do {
              key = Math.random().toString(36).substring(2, 5)
            } while (key in this.tabData.tabs)

            this.tabData.tabList.push(key)
            
            // If adjacent, chain new tabs along in sequence next to the current tab. Otherwise, place tab at end of array
            if (adjacent) {
              this.temp.tabChainIndex = this.temp.tabChainIndex ? this.temp.tabChainIndex + 1 : this.activeTabIndex + 1
              this.tabData.sortedTabList.splice(this.temp.tabChainIndex, 0, key)
            } else {
              this.tabData.sortedTabList.push(key)
            }
            
            const targetTab = this.tabData.tabs[target]

            let url = targetTab.url
            const history = [...targetTab.history]
            const future = [...targetTab.future]

            if (historyMode == 'back') {
              future.push(url)
              url = history.pop()
            } else if (historyMode == 'forward') {
              history.push(url)
              url = future.pop()
            }
            console.log(history)
            
            this.$set(this.tabData.tabs, key, {
              key: key,
              url,
              title: '',
              hasEmbed: false,
              history,
              future
            })

            if (this.tabData.tabList.length > this.tabData.sortedTabList.length) this.TABS_RESYNC()

            this.TABS_SWITCH_TO(key)
          } else console.warning(`Tried to duplicate nonexistent key '${target}'`)
        },

        TABS_SWITCH_TO(key = this.tabData.activeTabKey) {
          this.temp.tabChainIndex = undefined
          
          if (this.tabData.tabList.includes(key)) {
            this.tabData.activeTabKey = key
          }

          this.push_new_history()
          this.saveLocalStorage()
        },

        TABS_CYCLE(amount = 1) {
          let newIndex  = this.tabData.sortedTabList.indexOf(this.tabData.activeTabKey) + amount
          if (newIndex < 0) newIndex = this.tabData.sortedTabList.length + newIndex
          else if (newIndex >= this.tabData.sortedTabList.length) newIndex = newIndex - this.tabData.sortedTabList.length
          this.TABS_SWITCH_TO(this.tabData.sortedTabList[newIndex])
        },

        TABS_PUSH_TO_LOADED_LIST (key) {
          if (key) {
            if (!this.temp.loadedTabList.includes(key)) {
              this.temp.loadedTabList.push(key)
              while (this.temp.loadedTabList.length > LOADED_TAB_LIMIT) this.temp.loadedTabList.shift()
            } else {
              this.temp.loadedTabList.splice(this.temp.loadedTabList.indexOf(key), 1)
              this.temp.loadedTabList.push(key)
            }
          }

          this.saveLocalStorage()
        },

        TABS_CLOSE (key = this.tabData.activeTabKey) {
          if (!this.tabData.tabList.includes(key) || this.tabData.tabList.length <= 1) return

          if (key === this.tabData.activeTabKey){
            const activeIndex = (this.activeTabIndex >= this.tabData.sortedTabList.length - 1) ? this.tabData.sortedTabList.length - 2 : this.activeTabIndex + 1
            this.TABS_SWITCH_TO(this.tabData.sortedTabList[activeIndex])
          }

          const sortedIndex = this.tabData.sortedTabList.indexOf(key)

          this.tabData.tabList.splice(this.tabData.tabList.indexOf(key), 1)
          this.tabData.sortedTabList.splice(this.tabData.sortedTabList.indexOf(key), 1)
          this.temp.loadedTabList.splice(this.temp.loadedTabList.indexOf(key), 1)

          this.tabData.closedTabList.push({key: key, index: sortedIndex})
          while (this.tabData.closedTabList.length > DEAD_TAB_LIMIT) {
            this.tabData.closedTabList.shift()
          }

          const tabsToKeep = [...this.tabData.tabList]
          this.tabData.closedTabList.forEach(closedTab => {
            tabsToKeep.push(closedTab.key)
          })

          const toClear =  Object.keys(this.tabData.tabs).filter(x => !tabsToKeep.includes(x))

          toClear.forEach(key => {
            if (key in this.tabData.tabs) {
              this.$delete(this.tabData.tabs, key)
            }
          })

          if (this.tabData.tabList.length <= 0) {
            this.TABS_NEW()
          }

          if (this.tabData.tabList.length > this.tabData.sortedTabList.length) this.TABS_RESYNC()

          this.saveLocalStorage()
          // Dont remove tab from tab object, so it can be re-opened
        },

        TABS_CLOSE_ON_RIGHT(key = this.tabData.activeTabKey) {
          const hitlist = this.tabData.sortedTabList.slice(this.tabData.sortedTabList.indexOf(key) + 1, this.tabData.sortedTabList.length)
          hitlist.reverse().forEach(key => this.TABS_CLOSE(key))
        },

        TABS_CLOSE_ALL_OTHERS(key = this.tabData.activeTabKey) {
            const hitlist = [...this.tabData.sortedTabList]
            hitlist.splice(this.tabData.sortedTabList.indexOf(key), 1)
            hitlist.reverse().forEach(key => this.TABS_CLOSE(key))
        },

        TABS_RESTORE() {
          if (this.tabData.closedTabList.length > 0) {
            const tab = this.tabData.closedTabList.pop()
            this.tabData.tabList.push(tab.key)
            this.tabData.sortedTabList.splice(tab.index, 0, tab.key)
            this.TABS_SWITCH_TO(tab.key)
          }

          if (this.tabData.tabList.length > this.tabData.sortedTabList.length) this.TABS_RESYNC()
        },

        TABS_RESYNC() {
          const lostTabs = this.tabData.tabList.filter(key => !this.tabData.sortedTabList.includes(key))
          lostTabs.forEach(key => {
            this.tabData.sortedTabList.push(key)
          })
        },

        TABS_SET_TITLE(key, title) {
          if (!key) {
            console.warn("Can't set title of a tab you haven't sent me")
            return
          }
          this.tabData.tabs[key].title = title

          this.saveLocalStorage()
        },

        TABS_SET_HASEMBED(key, hasEmbed) {
          if (!key) {
            console.warn("Can't set hasEmbed of a tab you haven't sent me")
            return
          }
          this.tabData.tabs[key].hasEmbed = hasEmbed

          // this.saveLocalStorage()
        },

        TABS_SWAP(key1, key2) {
          this.temp.tabChainIndex = undefined

          const index1 = this.tabData.sortedTabList.indexOf(key1)
          const index2 = this.tabData.sortedTabList.indexOf(key2)
          if (index1 < 0 || index2 < 0) {
            console.warn(`One of the tabs you're trying to swap doesn't exist. Tab 1: ${key1}, Tab 2: ${key2}`)
            return
          }
          this.$set(this.tabData.sortedTabList, index1, key2)
          this.$set(this.tabData.sortedTabList, index2, key1)
        },
        
        TABS_HISTORY_FORWARD() {
          const tab = this.activeTabObject
          if (tab.future.length > 0) {
            window.getSelection().empty()
            document.getElementById(tab.key).scrollTop = 0
            document.getElementById(tab.key).scrollLeft = 0

            tab.history.push(tab.url)
            tab.url = tab.future.pop()
          }
          
          this.saveLocalStorage()
        },
        TABS_HISTORY_BACK() {
          const tab = this.activeTabObject
          if (tab.history.length > 0) {
            window.getSelection().empty()
            document.getElementById(tab.key).scrollTop = 0
            document.getElementById(tab.key).scrollLeft = 0

            tab.future.push(tab.url)
            tab.url = tab.history.pop()
          }

          this.saveLocalStorage()
        },

        SAVES_NEW(name, url) {
          let key
          do {
            key = Math.random().toString(36).substring(2, 5)
          } while (key in this.saveData.saves)
          this.$set(this.saveData.saves, key, {key, name, url})
          this.saveData.saveList.unshift(key)

          this.saveLocalStorage()

          return key
        },
        SAVES_EDIT(key, name, url) {
          this.saveData.saves[key].name = name
          this.saveData.saves[key].url = url

          this.saveLocalStorage()
        },
        SAVES_SWAP(key1, key2) {
          const index1 = this.saveData.saveList.indexOf(key1)
          const index2 = this.saveData.saveList.indexOf(key2)
          if (index1 < 0 || index2 < 0) {
            console.warn(`One of the tabs you're trying to swap doesn't exist. Tab 1: ${key1}, Tab 2: ${key2}`)
            return
          }
          this.$set(this.saveData.saveList, index1, key2)
          this.$set(this.saveData.saveList, index2, key1)
        },
        SAVES_DELETE(key){
          if (key in this.saveData.saves) {
            this.saveData.saveList.splice(this.saveData.saveList.indexOf(key), 1)
            this.$delete(this.saveData.saves, key)

            this.saveLocalStorage()
          }
        },
        NEW_READER_SET(current = false, limit = false) {
          if (current) this.settings.newReader.current = current
          if (limit) this.settings.newReader.limit = limit

          this.saveLocalStorage()
        },
        NEW_READER_CLEAR() {
          this.settings.newReader.current = false
          this.settings.newReader.limit = false

          this.settings.retcon1 = true
          this.settings.retcon2 = true
          this.settings.retcon3 = true
          this.settings.retcon4 = true
          this.settings.retcon5 = true
          this.settings.retcon6 = true
          
          this.saveLocalStorage()
        },
        SET_ASSET_DIR(path) {
          this.assetDir = path
          this._saveLocalStorage()
        },
        push_new_history(to) {
          const history_state = {
            tabData: this.tabData
          }
          // console.log("Saving", history_state)
          window.history.pushState(history_state, "", this.activeTabObject.url)
        }
      },
      watch: {
        // 'activeTabObject.url'(to, from) {
        //   if (to != from) {
        //     if (this.temp.isPoppingState) {
        //       // Consume URL change from popped history state (navigation backwards)
        //       console.warn("Not double-counting history navigation", to, from)
        //       this.temp.isPoppingState = false;
        //       return
        //     }

        //   }
        // }
      },
      created() {
        window.addEventListener("popstate", (event) => {
          // console.log("Loading", event.state)
          this.temp.isPoppingState = true // next url change should not count as navigation
          if (event?.state?.tabData)
            this.tabData = {...this.tabData, ...event.state.tabData}
        })
      },
      destroyed() {
        if (this.saveDebounce) {
          this.$logger.info("DESTROYING: flushing debounce")
          this.applySaveIfPending()
        }
      }
    })
    
    // this.VM.saveLocalStorage()
  }

  get root() {
    return this.VM
  }

  get assetDir() {
    return this.VM.$data.assetDir
  }

  get tabData() {
    return this.VM.$data.tabData
  }

  get saveData() {
    return this.VM.$data.saveData
  }

  get settings() {
    return this.VM.$data.settings
  }

  get temp() {
    return this.VM.$data.temp
  }

  get allHistory() {
    return this.VM.allHistory
  }
}

export default {
  // Store: LocalData,
  install (Vue, options) {
    const the_store = new LocalData()
    the_store.VM._migrateStorage(window.appVersion)

    the_store.VM.reloadLocalStorage()
    // the_store.VM.saveLocalStorage()

    Vue.mixin({
      beforeCreate() {
        this.$localData = the_store
        // this.reloadLocalStorage()
      }
    })
  }
}
