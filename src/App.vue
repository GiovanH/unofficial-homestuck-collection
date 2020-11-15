<template>
  <div id="app" :class="[$root.theme, $localData.settings.showAddressBar ? 'addressBar' : 'noAddressBar']" v-if="$archive">
    <AppHeader />
    <TabFrame v-for="key in tabList" :key="key" :ref="key"  :tab="tabObject(key)"/>
    <Notifications ref="notifications" />
    <ContextMenu ref="contextMenu" />
  </div>
  <div id="app" class="default"  v-else>
    <Setup />
    <ContextMenu ref="contextMenu" />
  </div>
</template>

<script>
  const electron = require('electron')

  import Setup from '@/components/SystemPages/Setup.vue'
  import AppHeader from '@/components/AppMenu/AppHeader.vue'
  import TabFrame from '@/components/TabFrame.vue'
  import Notifications from '@/components/UIElements/Notifications.vue'
  
  import ContextMenu from '@/components/UIElements/ContextMenu.vue'
  
  import Mods from "./mods.js"

  export default {
    name: 'HomestuckCollection',
    mixins: [ Mods.getMainMixin() ],
    components: {
      Setup, AppHeader, TabFrame, ContextMenu, Notifications
    },
    data() {
      return {
        zoomLevel: 0
      }
    },
    computed: {
      tabList() {
        return this.$localData.tabData.tabList;
      }
    },
    methods: {
      tabObject(key) {
        return this.$localData.tabData.tabs[key]
      },
      resetZoom() {
        this.zoomLevel = 0
        electron.webFrame.setZoomLevel(this.zoomLevel)
      },
      zoomIn() {
        if (this.zoomLevel < 5) {
          this.zoomLevel += 0.5
          electron.webFrame.setZoomLevel(this.zoomLevel)
        }
      },
      zoomOut() {
        if (this.zoomLevel > -5) {
          this.zoomLevel -= 0.5
          electron.webFrame.setZoomLevel(this.zoomLevel)
        }
      },
      openJumpbox() {
        if (this.$localData.settings.showAddressBar) {
          document.querySelector('#jumpBox input').select()
        }
        else {
          this.$refs[this.$localData.tabData.activeTabKey][0].$refs.jumpbox.toggle()
        }
      }
    },
    mounted () {
      this.$localData.root.TABS_SWITCH_TO()

      electron.webFrame.setZoomFactor(1)

      //Sets up listener for the main process
      electron.ipcRenderer.on('TABS_NEW', (event, payload) => {
        this.$localData.root.TABS_NEW(payload.url, payload.adjacent)
      })
      electron.ipcRenderer.on('TABS_CLOSE', (event, key) => {
        this.$localData.root.TABS_CLOSE(key)
      })
      electron.ipcRenderer.on('TABS_DUPLICATE', (event) => {
        this.$localData.root.TABS_DUPLICATE()
      })
      electron.ipcRenderer.on('TABS_RESTORE', (event) => {
        this.$localData.root.TABS_RESTORE()
      })
      electron.ipcRenderer.on('TABS_CYCLE', (event, payload) => {
        this.$localData.root.TABS_CYCLE(payload.amount)
      })
      electron.ipcRenderer.on('TABS_PUSH_URL', (event, to) => {
        this.$pushURL(to)
      })
      electron.ipcRenderer.on('TABS_HISTORY_BACK', (event) => {
        this.$localData.root.TABS_HISTORY_BACK()
      })
      electron.ipcRenderer.on('TABS_HISTORY_FORWARD', (event) => {
        this.$localData.root.TABS_HISTORY_FORWARD()
      })
      electron.ipcRenderer.on('ZOOM_IN', (event) => {
        this.zoomIn()
      })
      electron.ipcRenderer.on('ZOOM_OUT', (event) => {
        this.zoomOut()
      })
      electron.ipcRenderer.on('ZOOM_RESET', (event) => {
        this.resetZoom()
      })
      electron.ipcRenderer.on('OPEN_FINDBOX', (event) => {
        this.$refs[this.$localData.tabData.activeTabKey][0].$refs.findbox.open()
      })      
      electron.ipcRenderer.on('OPEN_JUMPBOX', (event) => {
        this.openJumpbox()
      })      
      
      electron.ipcRenderer.on('ARCHIVE_UPDATE', (event, archive) => {
        this.archive = archive
      })

      document.addEventListener('dragover', event => event.preventDefault())
      document.addEventListener('drop', event => event.preventDefault())

      window.addEventListener('keydown', event => {
        let activeFrame = document.getElementById(this.$localData.tabData.activeTabKey)
        if (activeFrame && !activeFrame.contains(document.activeElement) && document.activeElement.tagName != "INPUT") activeFrame.focus()
      })

      window.addEventListener('click', event => {
        // ensure we use the link, in case the click has been received by a subelement
        let { target } = event
        while (target && (target.tagName !== 'A' && target.tagName !== 'AREA')) target = target.parentNode
        // handle only links that do not reference external resources
        if (target && target.href) { //
          // some sanity checks taken from vue-router:
          // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
          const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event
          // don't handle when preventDefault called
          if (defaultPrevented) return
          // don't handle right clicks
          if (button !== undefined && button !== 0) return
          // don't handle if `target="_blank"`
          let targetBlank = (target && target.getAttribute) ? (/\b_blank\b/i.test(target.getAttribute('target'))) : false;


          if (event.preventDefault) {
            event.preventDefault()
            let auxClick = metaKey || altKey || ctrlKey || shiftKey || targetBlank
            this.$openLink(target.href, auxClick)
          }
        }
      })

      window.addEventListener('auxclick', event => {
        // ensure we use the link, in case the click has been received by a subelement
        let { target, button } = event
        if (button == 2) {
          event.preventDefault()
          this.$refs.contextMenu.open(event, target)
          return
        }
        else if (button == 3) {
          this.$localData.root.TABS_HISTORY_BACK()
        }
        else if (button == 4) {
          this.$localData.root.TABS_HISTORY_FORWARD()
        }
        while (target && (target.tagName !== 'A' && target.tagName !== 'AREA')) target = target.parentNode
        // handle only links that do not reference external resources
        if (target && target.href) {
          // some sanity checks taken from vue-router:
          // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
          const { altKey, ctrlKey, metaKey, shiftKey, defaultPrevented } = event
          // don't handle with control keys
          // if (metaKey || altKey || ctrlKey || shiftKey) return
          // don't handle when preventDefault called
          if (defaultPrevented) return
          // don't handle if `target="_blank"`
          let targetBlank = (target && target.getAttribute) ? (/\b_blank\b/i.test(target.getAttribute('target'))) : false;
          // don't handle right clicks
          if (button !== undefined && button !== 1) return

          if (event.preventDefault) {    
            event.preventDefault()
            this.$openLink(target.href, true)
          }
        }
      })
      
    },
  }
</script>

<style lang="scss">
@import "@/css/fonts.scss";
@import "@/css/fa/scss/fontawesome.scss";
@import "@/css/fa/scss/solid.scss";

@import '@/css/mspaThemes.scss';

  .addressBar {
    --headerHeight: 79px;
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
  #app {
    display: flex;
    flex-flow: column;
    height: 100%;

    .invisible {
      visibility: hidden !important;
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

  a, .bookmarkUrlDisplay {
    &.jumpboxLink::after{
      @extend %fa-icon;
      @extend .fas;
      content: fa-content($fa-var-chevron-right);
    }
    &[href^="http://"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
    &[href^="https://"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
    &[href^="mailto"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
    &[href$=".pdf"],
    &[href$=".html"] {
      &::after{
        @extend %fa-icon;
        @extend .fas;
        content: fa-content($fa-var-external-link-alt);
        margin: 0 1px 0 2px;
        line-height: inherit;
      }
    }
    &[href$=".jpg"],&[href$=".png"],&[href$=".gif"],&[href$=".swf"],&[href$=".txt"],&[href$=".mp3"],&[href$=".wav"],&[href$=".mp4"],&[href$=".webm"]{
      &::after{
        @extend %fa-icon;
        @extend .fas;
        content: fa-content($fa-var-file-image);
        margin: 0 1px 0 2px;
        line-height: inherit;
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
