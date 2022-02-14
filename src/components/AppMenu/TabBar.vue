<template>
  <div id="tabBar">
    <div class="navigationButtons">
      <button class="systemButton historyButton historyBack" @click="historyBack" 
        @click.middle="historyBackNewTab" :disabled="!activeTabHasHistory">
        <fa-icon icon="chevron-left"></fa-icon></button>
      <button class="systemButton historyButton historyForward" @click="historyForward" 
        @click.middle="historyForwardNewTab" :disabled="!activeTabHasFuture">
        <fa-icon icon="chevron-right"></fa-icon></button>

      <button class="systemButton historyButton refresh" 
        @click="reloadTab" @click.middle="forceReload">
        <fa-icon icon="redo"></fa-icon></button>
    </div>
    <template v-if="$localData.settings.showAddressBar">
      <AddressBar/>
      <!-- Toolbars go here -->
      <component v-for="(__, componentkey) in browserToolbars" 
        :is="componentkey" :key="componentkey" class="toolbar"/>
      <div class="lineBreak"/>
    </template>

    <div id="tabSection">
      <div id="dragTab" class="tab activeTab" 
        tabindex="-1" v-show="showDragTab">
        <div class="tabTitle" :class="{dragTitleFade}"></div>
        <button class="systemButton closeTabButton">✕</button>
      </div>
      <transition-group name="tab-list" tag="ul" id="tabs">
        <Tab v-for="key in sortedTabList" 
          :key="key" :tab="tabs[key]" 
          :ref="'tab_' + key" 
          @mousedown.left.native="initDrag()" />
      </transition-group>
      <!-- TODO: Replace this with an svg so it's consistent across systems -->
      <button class="systemButton newTabButton" @click="newTab()" title="New tab">
        <span>＋</span></button>
      <div class="sysActionButtons">
        <button class="systemButton sysActionButton jumpBoxButton" 
         v-if="!$localData.settings.showAddressBar" 
         @click="toggleJumpBox" title="Jump box">
          <fa-icon icon="terminal"></fa-icon></button>
        <button class="systemButton sysActionButton bookmarksButton" @click="toggleBookmarks" title="Bookmarks">
          <fa-icon icon="bookmark"></fa-icon></button>
      </div>
    </div>

    <template v-if="!$localData.settings.showAddressBar">
      <!-- Toolbars go here too (compact layout) -->
      <component v-for="(__, componentkey) in browserToolbars" 
        :is="componentkey" :key="componentkey" class="toolbar"/>
    </template>
    <div />
  </div>
</template>

<script>
import Tab from '@/components/AppMenu/Tab.vue'
import AddressBar from '@/components/AppMenu/AddressBar.vue'

import ModBrowserToolbarMixin from '@/components/CustomContent/ModBrowserToolbarMixin.vue'

const { ipcRenderer } = require('electron')

export default {
  name: 'tabBar',
  components: {
    Tab, AddressBar
  },
  data(){
    return {
      cursorXPrev: 0,
      threshold: undefined,
      thresholdDirection: undefined,
      clickAnchor: undefined,
      dragTarget: undefined,
      showDragTab: false,
      dragTitleFade: false,
      browserToolbars: {}
    }
  },  
  created(){
    for (const COM in this.browserToolbars) {
        let mixins = this.browserToolbars[COM].mixins || []
        if (!mixins.includes(ModBrowserToolbarMixin)) {
            mixins.push(ModBrowserToolbarMixin)
            this.browserToolbars[COM].mixins = mixins
        }
    }
    Object.assign(this.$options.components, this.browserToolbars)
  },
  computed: {
    sortedTabList() {
      return this.$localData.tabData.sortedTabList
    },
    tabs() {
      return this.$localData.tabData.tabs
    },
    activeTabHasHistory(){
      return this.$localData.root.activeTabObject.history.length > 0
    },
    activeTabHasFuture(){
      return this.$localData.root.activeTabObject.future.length > 0
    },
    dragTab(){
      return document.getElementById("dragTab")
    },
    thisTabPageId(){
      // // This is a good implementation to grab an inner page, so I'm leaving 
      // // it as a reference, but it has a race condition which makes it
      // // a poor fit here.
      // try {
      //   const page = this.$root.app.activeTabComponent.$refs.page
      //   if (page.$options.name == "page")
      //     return page.thisPage.pageId
      //   else
      //     return undefined
      // } catch {
      //   return undefined
      // }
      const activeTabUrl = this.$localData.root.activeTabObject.url
      let match
      // eslint-disable-next-line no-cond-assign
      if (match = /^\/mspa\/(\d+)$/.exec(activeTabUrl))
        return match[1]
      // eslint-disable-next-line no-cond-assign
      if (match = /^\/(\w+?)\/(\d+)$/.exec(activeTabUrl)) {
        const viz = this.$vizToMspa(match[1], match[2])
        if (viz) return viz.p
      }
    
      return undefined
    },
    tabComponent() {
      return this.$root.app.activeTabComponent
    }
  },
  methods: {
    toggleBookmarks(){
      const tabComponent = this.$root.app.activeTabComponent
      tabComponent.$refs.bookmarks.toggle()
    },
    toggleJumpBox(){
      this.$root.app.openJumpbox()
    },
    historyBack(e) {
      this.$localData.root.TABS_HISTORY_BACK()
    },
    historyForward(e) {
      this.$localData.root.TABS_HISTORY_FORWARD()
    },
    historyBackNewTab(e) {
      this.$logger.info(e.button)
      this.$localData.root.TABS_DUPLICATE(this.$localData.tabData.activeTabKey, true, 'back')
    },
    historyForwardNewTab(e) {
      this.$logger.info(e.button)
      this.$localData.root.TABS_DUPLICATE(this.$localData.tabData.activeTabKey, true, 'forward')
    },
    reloadTab(e) {
      try {
        this.$root.app.activeTabComponent.reload()
      } catch (e) {
        this.$logger.warn("Couldn't reload tab (no page?)", e)
      }
    },
    forceReload(e) {
      ipcRenderer.sendSync('MODS_FORCE_RELOAD')
      ipcRenderer.invoke('reload')
    },
    newTab() {
      this.$localData.root.TABS_NEW()
    },

    getTabEl(el) {
      if (!el) return null
      return (el.classList.contains('tabShell')) ? el.firstChild : el.closest('.tab')
    },

    constrainXToTabArea(tabX) {
      let tabAreaRect = document.getElementById("tabs").getBoundingClientRect()

      if (tabX <= tabAreaRect.left) {
        tabX = tabAreaRect.left
        this.threshold = tabX + this.clickAnchor
        this.thresholdDirection = 'left'
      }

      if (tabX + this.dragTab.clientWidth >= tabAreaRect.right - 1) {
        tabX = (tabAreaRect.right - 1) - this.dragTab.clientWidth
        this.threshold = tabX + this.clickAnchor
        this.thresholdDirection = 'right'
      }

      return tabX
    },

    initDrag(e) {
      e = e || window.event
      e.preventDefault()

      if (e.target.classList.contains('closeTabButton') || this.sortedTabList.length <= 1) return
      
      this.clickAnchor = e.clientX
      this.dragTarget = this.getTabEl(e.target)

      document.onmousemove = this.startDragTab
      document.onmouseup = this.closeDragElement
    },

    startDragTab(e) {
      e = e || window.event
      e.preventDefault()

      if (Math.abs(e.clientX - this.clickAnchor) > 5) {
        let snapDistance = e.clientX - this.clickAnchor
        this.clickAnchor -= this.dragTarget.getBoundingClientRect().left

        this.dragTarget.style.visibility = "hidden"

        this.dragTab.querySelector(".tabTitle").innerHTML = this.dragTarget.querySelector(".tabTitle").innerHTML
        
        if (document.getElementById('appHeader').classList.contains('headerHoverEnabled')) document.getElementById('appHeader').classList.remove('headerHoverEnabled')

        this.showDragTab = true
        this.dragTab.style.width = this.dragTarget.clientWidth + 'px'
        this.dragTab.style.left = this.constrainXToTabArea(this.dragTarget.getBoundingClientRect().left + snapDistance) + "px"

        this.cursorXPrev = e.clientX
        document.onmousemove = this.elementDrag

        this.$nextTick(()=>{
          let titleWidth = this.dragTab.querySelector(".tabTitle").getBoundingClientRect().width - 5 // Offsets 5px of padding on left
          let titleTextWidth = this.dragTab.querySelector(".tabTitle span").getBoundingClientRect().width
          this.dragTitleFade = titleWidth < titleTextWidth

          this.dragTab.focus()
          this.dragTab.onblur = this.closeDragElement
        })
      }
    },

    elementDrag(e) {
      e = e || window.event
      e.preventDefault()
      let tabX, dragPos

      if (this.thresholdDirection){
        if ((this.thresholdDirection === 'left' && e.clientX > this.threshold) || (this.thresholdDirection === 'right' && e.clientX < this.threshold)){
          this.dragTab.style.left = (this.dragTab.offsetLeft + e.clientX - this.threshold) + "px"
          this.thresholdDirection = undefined
        }
      }
      else {
        dragPos = this.cursorXPrev - e.clientX
        tabX = this.constrainXToTabArea(this.dragTab.offsetLeft - dragPos)
        this.dragTab.style.left = tabX + "px"
      }  
      
      this.cursorXPrev = e.clientX

      let dragTabArea = this.dragTab.getBoundingClientRect()
      let xCenter = dragTabArea.left + ((dragTabArea.right - dragTabArea.left) / 2)
      let yCenter = dragTabArea.top + ((dragTabArea.bottom - dragTabArea.top) / 2)

      let tabRef = this.getTabEl(document.elementFromPoint(xCenter, yCenter)).id  
      let hoverId = this.$refs[tabRef][0].getId()
      let dragId = this.$refs[this.dragTarget.id][0].getId()

      if (dragId != hoverId) {
        this.$localData.root.TABS_SWAP(dragId, hoverId)
      }
    },

    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
      this.dragTab.onblur = null

      if (this.dragTarget) this.dragTarget.style.visibility = "visible"
      this.showDragTab = false
      if (!document.getElementById('appHeader').classList.contains('headerHoverEnabled')) document.getElementById('appHeader').classList.add('headerHoverEnabled')

      this.clickAnchor = this.thresholdDirection = this.dragTarget = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
  #tabBar {
    display: flex;
    flex-flow: row wrap;
    border-bottom: 1px solid var(--header-border);
  }

  .navigationButtons, .sysActionButtons {
    margin-left: auto;
    display: inline-block;
    height: var(--address-bar-height);
    display: flex;
  }
  .navigationButtons {
    --padding: 2px;
    padding: 0px var(--padding);
  }
  .sysActionButtons {
    // --padding: 4px;
    // padding: 2px var(--padding);
    .sysActionButton {
      width: 38px;
    }
  }
  .historyButton, .sysActionButton {
      color: var(--font-default);
      &[disabled] { color: var(--font-disabled); }

      height: var(--address-bar-height);
      width: calc(var(--address-bar-height) * (8/7));
      margin: 0;

      text-decoration: none;
      text-align: center;

      --symbol-font-size: calc(var(--address-bar-height) - 2*var(--padding));
      font-size: var(--symbol-font-size);

      > svg {
        display: block;
      margin: auto;
      height: 100%;
    }
  }
  .historyBack > svg { padding-right: 0.1em; }
  .refresh, .jumpBoxButton { 
    > svg { font-size: calc(var(--symbol-font-size) * 0.9) } 
  }

  .sysActionButton {
    opacity: 0.4;
    &:not([disabled]) {
      &:hover, &:active {
        opacity: 0.8;
      }
    }
  }

  .lineBreak {
    flex-basis: 100%;
    height: 3px;
  }
  .toolbar {
    flex-basis: 100%;
  }
  #tabSection {
    background: var(--header-tabSection);
    width: 1px; // Grow to fit
    flex-grow: 1;
    height: var(--tab-height);
    display: inline-flex;

    #dragTab {
      position: absolute;
      z-index: 1;
      pointer-events: none;

      background: var(--header-bg);

      // tab css copied
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      min-width: 0;
      height: 28px;
      cursor: default;

      .tabTitle {
        flex: 1 10 auto;
        padding-left: 5px;
        white-space: nowrap;
        min-width: 0;
        overflow: hidden;

        &.dragTitleFade {
          mask-image: linear-gradient(90deg, #000000 calc(100% - 20px), #00000000 100%);
        }
      }

      .closeTabButton {
        float: right;
        padding: 0;
        margin-right: 5px;

        flex: 0 0 auto;
        width: 21px;
        height: 21px;

        line-height: 22px;
        font-family: Arial, Helvetica, sans-serif;
      }
    }
    #tabs{
      display: inline-flex;
      max-width: calc(100% - 28px);
      overflow: hidden;
    }
    .tab-list-enter, .tab-list-leave-to  {
      opacity: 0;
      width: 0;
      min-width: 0;
    }
    .tab-list-enter-active, .tab-list-leave-active {
      transition: all 0.1s;
      ::v-deep .tabShell{
        transition: width 0.1s;
      }
    }

    // .tab-list-move {
    //   transition: transform 0.1s;
    // }

    .newTabButton {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--font-header);
      height: var(--tab-height);
      width: calc(var(--tab-height) * (8/7));
      font-size: 24px;
      // line-height: 1;

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
