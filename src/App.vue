<template>
  <div id="window" :class="theme">
    <div id="app" :class="[
      // $root.loadState != 'DONE' ? 'busy' : '',
        $localData.settings.showAddressBar ? 'addressBar' : 'noAddressBar',
        $root.platform // webapp or electron
      ]" v-if="$localData.assetDir && $archive && $root.loadState !== 'ERROR'">
      <AppHeader :class="theme" ref="uistyle" />
      <TabFrame v-for="key in tabList" :key="key" :ref="key"  :tabKey="key"/>
      <Notifications :class="theme" ref="notifications" />
      <ContextMenu :class="theme" ref="contextMenu" v-if="!$isWebApp" />
      <Updater ref="Updater" v-if="!$isWebApp" />
      <UrlTooltip :class="theme" ref="urlTooltip" v-if="$localData.settings.urlTooltip && !$isWebApp"/>
      <component is="style" v-for="s in stylesheets" :id="s.id" :key="s.id" rel="stylesheet" v-text="s.body"/>
    </div>
    <div id="app" class="mspa"  v-else>
      <Setup ref="uistyle" />
      <ContextMenu ref="contextMenu" />
    </div>
  </div>
</template>

<script>
  import Setup from '@/components/SystemPages/Setup.vue'
  import AppHeader from '@/components/AppMenu/AppHeader.vue'

  const Notifications = () => '@/components/UIElements/Notifications.vue'
  const ContextMenu = () => import('@/components/UIElements/ContextMenu.vue')
  const UrlTooltip = () => import('@/components/UIElements/UrlTooltip.vue')
  const Updater = () => import('@/components/UIElements/Updater.vue')
  const TabFrame = () => import('@/components/TabFrame.vue')

  import Mods from "./mods.js"

  const ipcRenderer = require('electron').ipcRenderer

  var mixins = []
  var webFrame = undefined;

  if (!window.isWebApp) {
    webFrame = require('electron').webFrame
    mixins = [ Mods.getMainMixin() ];
  }

  export default {
    name: 'HomestuckCollection',
    mixins,
    components: {
      Setup, AppHeader, TabFrame, ContextMenu, Notifications, UrlTooltip, Updater
    },
    data() {
      return {
        zoomLevel: 0,
        needCheckTheme: false,
        stylesheets: [] // Mod optimization
      }
    },
    computed: {
      tabList() {
        return this.$localData.tabData.tabList
      },
      activeTabComponent() {
        this.needCheckTheme; // what a truly awful hack. vue's fault
        // (it's because $refs isn't reactive)
        const tab_components = this.$refs[this.$localData.tabData.activeTabKey]
        if (tab_components) {
          return tab_components[0]
        }
        return undefined
      },
      tabTheme() {
        if (this.activeTabComponent) {
          // Get theme from inner tab
          const page_theme = {
            defined: this.activeTabComponent.contentTheme, 
            rendered: this.activeTabComponent.theme
          }
          return page_theme
        } else {
          this.$logger.warn("App.vue:tabTheme: No active tab! Using default")
          return {defined: 'default', rendered: 'default'}
        }
      },
      theme() {
        const set_theme = this.$localData.settings.themeOverrideUI
        // Default UI theme should be whatever the page is using

        // If there is a theme override and a UI theme override,
        // the UI theme override should apply even if force is unset
        let theme = this.tabTheme.rendered

        if (set_theme != 'default') {
          // User has a specified theme
          if (this.tabTheme.defined != 'default') {
            // Page has a theme
            if (this.$localData.settings.forceThemeOverrideUI) {
              // If force is on, use the override theme
              theme = set_theme
            } else {
              // Page takes priority over setting
              theme = this.tabTheme.defined
              // If this were this.tabThem.rendered, you would get
              // page themes escaping to become app themes.
            }
          } else {
            // User specified a theme, page did not
            theme = set_theme
          } 
        }
        return (theme == 'default' ? 'mspa' : theme)
      }
    },
    methods: {
      resetZoom() {
        this.zoomLevel = 0
        webFrame.setZoomLevel(this.zoomLevel)
      },
      checkTheme() {
        this.needCheckTheme = !this.needCheckTheme;
      },
      zoomIn() {
        if (this.zoomLevel < 5) {
          this.zoomLevel += 0.5
          webFrame.setZoomLevel(this.zoomLevel)
        }
      },
      zoomOut() {
        if (this.zoomLevel > -5) {
          this.zoomLevel -= 0.5
          webFrame.setZoomLevel(this.zoomLevel)
        }
      },
      openJumpbox() {
        if (this.$localData.settings.showAddressBar) {
          document.querySelector('#jumpBox input').select()
        } else {
          this.activeTabComponent.$refs.jumpbox.toggle()
        }
      },
      updateAppIcon(){ 
        this.$nextTick(() => {
          if (!this.$refs["uistyle"]) {
            this.$logger.warn("trying to updateAppIcon, but no uistyle (appheader/setup) element yet")
            setTimeout(() => this.updateAppIcon(), 2000)
            return
          }
          let app_icon_var = window.getComputedStyle(this.$refs["uistyle"].$el).getPropertyValue('--app-icon')
          let match
          // eslint-disable-next-line no-cond-assign
          if (match = /url\(\\\/(.+)\\\/\)/.exec(app_icon_var)) {
            app_icon_var = this.$mspaFileStream(match[1].replace(/\\/g, ''))
          // eslint-disable-next-line no-cond-assign
          } else if (match = /"(.+)"/.exec(app_icon_var)) {
            app_icon_var = match[1]
          } else {
            this.$logger.error(`Couldn't match '${app_icon_var}'`)
            return
          }
          this.$logger.info("Requesting icon change to", app_icon_var)
          ipcRenderer.send('set-sys-icon', app_icon_var)
        })
      }
    },
    watch: {
      'theme'(to, from) {
        this.updateAppIcon()
      },
      'tabTheme'(to, from) {
        if (to != undefined)
          this.$root.tabTheme = to
      }
    },
    updated() {
      if (this.$isWebApp) this.filterLinksAndImages(window.document.body)
    },
    mounted () {
      this.$nextTick(() => this.updateAppIcon())
      const user_path_target = window.location.pathname

      this.$localData.root.TABS_SWITCH_TO()
      // Switch to the last tab (good) but replaces history (so we use the previously captured value)

      if (isWebApp) {
        if (user_path_target != this.$localData.root.activeTabObject.url) {
          this.$logger.warn("Navigating user to", user_path_target)
          this.$nextTick(() => {
            // this.$localData.root.TABS_PUSH_URL(user_path_target)
            this.$localData.root.TABS_NEW(user_path_target)
          })
        } else {
          // this.$logger.debug(this.$localData.root.activeTabObject.url, "and", user_path_target, "match")

        }
      }

      webFrame && webFrame.setZoomFactor(1)

      // Sets up listener for the main process
      ipcRenderer.on('TABS_NEW', (event, payload) => {
        this.$localData.root.TABS_NEW(this.$resolvePath(payload.url), payload.adjacent)
      })
      ipcRenderer.on('TABS_CLOSE', (event, key) => {
        this.$localData.root.TABS_CLOSE(key)
      })
      ipcRenderer.on('TABS_DUPLICATE', (event) => {
        this.$localData.root.TABS_DUPLICATE()
      })
      ipcRenderer.on('TABS_RESTORE', (event) => {
        this.$localData.root.TABS_RESTORE()
      })
      ipcRenderer.on('TABS_CYCLE', (event, payload) => {
        this.$localData.root.TABS_CYCLE(payload.amount)
      })
      ipcRenderer.on('TABS_PUSH_URL', (event, to) => {
        this.$pushURL(to)
      })
      ipcRenderer.on('TABS_HISTORY_BACK', (event) => {
        this.$localData.root.TABS_HISTORY_BACK()
      })
      ipcRenderer.on('TABS_HISTORY_FORWARD', (event) => {
        this.$localData.root.TABS_HISTORY_FORWARD()
      })
      ipcRenderer.on('ZOOM_IN', (event) => {
        this.zoomIn()
      })
      ipcRenderer.on('ZOOM_OUT', (event) => {
        this.zoomOut()
      })
      ipcRenderer.on('ZOOM_RESET', (event) => {
        this.resetZoom()
      })
      ipcRenderer.on('OPEN_FINDBOX', (event) => {
        this.activeTabComponent.$refs.findbox.open()
      })
      ipcRenderer.on('OPEN_JUMPBOX', (event) => {
        this.openJumpbox()
      })

      ipcRenderer.on('RELOAD_LOCALDATA', (event) => {
        this.$localData.VM.reloadLocalStorage()
      })

      ipcRenderer.on('SET_LOAD_STATE', (event, state) => {
        this.$root.loadState = state
      })

      this.$root.loadStage = "MOUNTED"
      ipcRenderer.on('SET_LOAD_STAGE', (event, stage) => {
        this.$root.loadStage = stage
      })

      ipcRenderer.on('ARCHIVE_UPDATE', async (event, archive) => {
        this.$root.loadStage = "MODS"
        try {
          await Mods.editArchiveAsync(archive)
          this.$root.archive = archive
          this.$root.loadStage = "LOADED_ARCHIVE"
          this.$root.loadState = "DONE"
        } catch (e) {
          this.$logger.error(e)
          this.$root.archive = undefined
          this.$root.loadState = "ERROR"
        }
      })

      // Ask for a fresh copy of the archive
      // Root must exist to receive it, so this calls from inside the app
      // and the app must have registered the receipt listener first to accept it!
      ipcRenderer.send("RELOAD_ARCHIVE_DATA")

      document.addEventListener('dragover', event => event.preventDefault())
      document.addEventListener('drop', event => event.preventDefault())

      window.addEventListener('keydown', event => {
        const activeFrame = document.getElementById(this.$localData.tabData.activeTabKey)
        if (activeFrame && !activeFrame.contains(document.activeElement) && document.activeElement.tagName != "INPUT") activeFrame.focus()
      })

      const app = this

      const parentLinkElement = (target) => {
        while (target && (target.tagName !== 'A' && target.tagName !== 'AREA')) target = target.parentNode
        return target
      }

      const onLinkClick = (event, force_aux_click=false) => {
        // ensure we use the link, in case the click has been received by a subelement
        const resolvedTarget = parentLinkElement(event.target)
        if (resolvedTarget && resolvedTarget.href) {
          // some sanity checks taken from vue-router:
          // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
          if (event.defaultPrevented) return // don't handle when preventDefault called
          const targetBlank = (resolvedTarget.getAttribute) ? (/\b_blank\b/i.test(resolvedTarget.getAttribute('target'))) : false // don't handle if `target="_blank"`

          if (event.preventDefault) {
            event.preventDefault()
            const { altKey, ctrlKey, metaKey, shiftKey } = event
            const auxClick = (metaKey || altKey || ctrlKey || shiftKey) || targetBlank
            const resolved_href = Resources.resolveURL(resolvedTarget.href)
            app.$openLink(resolved_href, auxClick || force_aux_click)
          }
        }
      }

      window.addEventListener('click', event => {
        if (event.button !== undefined && event.button !== 0) return // only handle left clicks
        onLinkClick(event)
      })

      window.addEventListener('auxclick', event => {
        // ensure we use the link, in case the click has been received by a subelement
        if (event.button == 2 && this.$refs.contextMenu) {
          event.preventDefault()
          this.$refs.contextMenu.open(event, event.target)
        } else {
          if (event.button !== undefined && event.button !== 1) return // only handle middle clicks
          onLinkClick(event, true)
        }
      })

      window.addEventListener("mousedown", (event) => {
        if (event.button == 3) {
          event.preventDefault()
          this.$localData.root.TABS_HISTORY_BACK()
        } else if (event.button == 4) {
          event.preventDefault()
          this.$localData.root.TABS_HISTORY_FORWARD()
        }
      })
    }
  }
</script>

<style lang="scss">
@import "@/css/fonts.scss";
@import "@/css/fa/scss/fontawesome.scss";
@import "@/css/fa/scss/solid.scss";

@import '@/css/mspaThemes.scss';

  #window {
    position: relative;
    height: 100%;
    width: 100%;
  }

  #app.busy {
    cursor: progress;
  }

  // TODO: Replace --headerHeight with dynamic sizing
  .addressBar {
    --headerHeight: 82px;
  }
  .noAddressBar {
    --headerHeight: 51px;
  }

  html, body {
    height: 100%;
  }
  body, h1, h2, h3, h4, h5, h6, p, ul, ol, li, div{
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Courier New", courier, monospace;
    font-size: 14px;
    font-weight: bolder;
    overflow-wrap: break-word;
  }
  .tabFrame {
    input, img {
      &:focus {
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
  }
  #app {
    display: flex;
    flex-flow: column;
    height: 100%;

    .invisible {
      visibility: hidden !important;
    }

    .pixelated img {
        image-rendering: pixelated;
    }

    .hidden {
      &.forceLoad {
        height: 0;
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
        flex-grow: 0;
      }
      &:not(.forceLoad){
        display: none !important;
      }
    }
  }

  a.jumpboxLink::after{
    // By default, show > in the jump bar
    @extend %fa-icon;
    @extend .fas;
    content: fa-content($fa-var-chevron-right);
  }
  .electron {
    a, .urlDisplay {
      // Link-like links...
      &[href^="http://"], &[href^="https://"], &[href^="mailto"], &[href$=".pdf"], &[href$=".html"] {
        // ...that aren't on localhost
        &:not([href*="127.0.0.1"]):not([href*="localhost"]):not([href*="assets://"])::after{
          @extend %fa-icon;
          @extend .fas;
          content: fa-content($fa-var-external-link-alt);
          margin: 0 1px 0 2px;
          line-height: inherit;
        }
      }
      // Asset-like links
      &[href$=".jpg"], &[href$=".png"], &[href$=".gif"], &[href$=".swf"], &[href$=".txt"], &[href$=".mp3"], &[href$=".wav"], &[href$=".mp4"], &[href$=".webm"]{
        &::after{
          @extend %fa-icon;
          @extend .fas;
          content: fa-content($fa-var-file-image);
          margin: 0 1px 0 2px;
          line-height: inherit;
        }
      }
    }
  }
  
  iframe{
    border: 0;
  }
  .systemButton {
    font-weight: normal;
    text-align: center;
    vertical-align: middle;

    background: none;
    outline: none;
    border: none;
    transition: background-color 0.1s;
  }
  *:focus {
    outline: none;
  }
</style>
