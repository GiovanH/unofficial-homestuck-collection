<template>
    <div id="tabBar" :class="{showAddressBar: $localData.settings.showAddressBar}">
      <div id="tabNavigation">
        <div class="systemButton historyButton" @click="historyBack" @click.middle="historyBackNewTab" :disabled="!activeTabHasHistory"><fa-icon icon="chevron-left"></fa-icon></div>
        <div class="systemButton historyButton" @click="historyForward" @click.middle="historyForwardNewTab" :disabled="!activeTabHasFuture"><fa-icon icon="chevron-right"></fa-icon></div>

        <div class="systemButton historyButton" @click="reloadTab" @click.middle="forceReload" style="font-size: 21px;"><fa-icon icon="redo"></fa-icon></div>
      </div>
      <div id="jumpBox">
        <div class="jumpBoxWrapper">
          <a :href="jumpboxText" class="jumpboxLink" ref="link" />
          <vue-simple-suggest
            v-model="jumpboxText" 
            :list="allUrlSuggestions"
            display-attribute="title"
            value-attribute="url"
            @select="onSuggestSelect"
            :filter-by-query="true"
            :max-suggestions="15"
            ref="suggest" 
          >
            <input 
              class="jumpBoxInput" 
              ref="input" 
              type="text" 
              spellcheck="false" 
              v-model="jumpboxText" 
              @keydown.enter="focusLink"
              @keydown.esc="resetJumpbox" 
            />
          </vue-simple-suggest>    
          <div id="browserActions">
            <div class="systemButton"
              v-if="$localData.settings.devMode && thisTabPageId" 
              :title="`Change current page from ${$newReaderCurrent} to p=${thisTabPageId}\n(Middle click to disable newreader)`"
              :class="{active: thisTabPageId != $newReaderCurrent}"
              @click="$updateNewReader(thisTabPageId, true)" 
              @click.middle="$localData.root.NEW_READER_CLEAR">
              <fa-icon icon="lock"></fa-icon>
              <span class="badge" v-text="$newReaderCurrent"></span>
            </div>
            <div class="systemButton"
              @click="isCurrentPageBookmarked ? tabComponent.$refs.bookmarks.open() : tabComponent.$refs.bookmarks.newSave()"
              :class="{active: isCurrentPageBookmarked}">
              <fa-icon icon="save"></fa-icon>
            </div>
          </div>      
        </div>
      </div>
      <div class="lineBreak"/>
      <div id="tabSection">
        <div id="dragTab" class="tab activeTab" tabindex="-1" v-show="showDragTab">
          <div class="tabTitle" :class="{dragTitleFade}"></div>
          <div class="systemButton closeTabButton">✕</div>
        </div>
        <transition-group name="tab-list" tag="ul" id="tabs">
          <Tab v-for="key in sortedTabList" :key="key" :tab="tabs[key]" :ref="'tab_' + key" @mousedown.left.native="initDrag()" />
        </transition-group>
        <div class="systemButton newTabButton" @click="newTab()">＋</div>
      </div>
      <div />
    </div>
</template>

<script>
import Tab from '@/components/AppMenu/Tab.vue'
import VueSimpleSuggest from 'vue-simple-suggest'

const { ipcRenderer } = require('electron')

export default {
  name: 'tabBar',
  components: {
    Tab, VueSimpleSuggest
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
      jumpboxText: this.$localData.root.activeTabObject.url
    }
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
      //   const page = this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0].$refs.page
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
    isCurrentPageBookmarked(){
      return Object.values(this.$localData.saveData.saves).some(
        s => (s.url == this.$localData.root.activeTabObject.url)
      )
    },
    tabComponent() {
      return this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0]
    },
    allHistory(){
      return this.$localData.root.tabData.tabList.map(
        key => this.$localData.root.tabData.tabs[key]
      ).reduce((a, t) => {
        return a.concat(t.history)
      }, [])
    },
    allUrlSuggestions(){
      const dumbUrlMap = url => ({
        title: url,
        url: url
      })
      const simple = ['/credits', '/decode', '/map', '/music', '/news', '/sbahj', '/settings', '/settings/mod', '/tso'].map(dumbUrlMap)
      const unlocked = [
        {url: "/formspring", show: this.$pageIsSpoiler('003478')},
        {url: "/tumblr",     show: this.$pageIsSpoiler('006010')},
        {url: "/namcohigh",  show: this.$pageIsSpoiler('008135')},
        {url: "/pxs",        show: this.$pageIsSpoiler('008753')},
        {url: "/snaps",      show: !this.isNewReader}
      ].filter(t => t.show).map(t => t.url).map(dumbUrlMap)
      const history = this.allHistory.map(dumbUrlMap)

      const bookmarks = Object.values(this.$localData.saveData.saves).map(bookmark => ({
        title: `${bookmark.url} - ${bookmark.name}`,
        url: bookmark.url
      }))

      return [...bookmarks, ...simple, ...unlocked, ...history].filter((obj, pos, arr) => {
        // Deduplicate based on 'url' param
        return arr.map(mapObj => mapObj['url']).indexOf(obj['url']) === pos
      })
    }
  },
  methods: {
    focusLink(){
      if (!this.$refs.suggest.hovered) {
        const do_refresh_instead = (this.jumpboxText == this.$localData.root.activeTabObject.url)
        
        if (do_refresh_instead) {
          this.reloadTab()
        } else {
          this.$refs.link.click()
          this.resetJumpbox()
          document.activeElement.blur()
        }
      }
    },
    onSuggestSelect(event){
      this.jumpboxText = event.url
      // this.$nextTick(this.focusLink)
      this.$localData.root.TABS_PUSH_URL(event.url) // avoids some weird focus cases
      this.$refs.suggest.hideList()
      document.activeElement.blur()
    },
    resetJumpbox() {
      this.jumpboxText = this.$localData.root.activeTabObject.url
      
      this.$nextTick(() => this.$refs.input.select())
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
      this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0].reload()
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
  },
  watch: {
    '$localData.root.activeTabObject.url'(to, from){
      this.jumpboxText = to
    },
    '$localData.tabData.activeTabKey'(to, from){
      this.jumpboxText = this.$localData.root.activeTabObject.url
    }
  },
  created(){
  },
  updated(){
  }
}
</script>

<style lang="scss" scoped>
  #tabBar {
    height: 28px;
    display: flex;
    flex-flow: row wrap;
    border-bottom: 1px solid var(--header-border);

    &.showAddressBar {
      height: 59px;
      #tabSection {
        width: 100%;
        max-width: 100%;
      }
    }

    &:not(.showAddressBar) {
      .lineBreak {
        display: none;
      }
      #jumpBox {
        display: none;
      }
    }
    #browserActions {
      display: inline-block;
      height: 28px;
      // width: 58px;
      display: flex; 
      > div {
        position: relative;
        padding: 2px;
        color: var(--font-header);
        font-size: 24px;

        .badge {
          display: block;
          position: absolute;
          background: var(--header-bg);
          font-size: 10px;
          height: 1em;
          line-height: normal;
          bottom: 0;
          right: 0;
        }
      }   
      svg {opacity: 40%;}
      div.active svg {opacity: 100%;
      }
    }
    #tabNavigation {
      display: inline-block;
      height: 28px;
      // width: 58px;
      display: flex;      
      .historyButton {
        height: 28px;
        width: 29px;
        //padding-top: 2px;
        margin: 0;

        line-height: 34px;
        font-size: 24px;
        text-decoration: none;
        text-align: center;
      }
    }
    #jumpBox {
      flex: 1 0 auto;
      margin: auto 5px;

      .jumpBoxWrapper::v-deep {
        display: flex;
        flex-flow: row nowrap;

        border-radius: 2px;
        border: 1px solid var(--header-border);
        background: var(--header-tabSection);

        .vue-simple-suggest {
          width: 100%;
        }

        .jumpboxLink {
          border-radius:  1px 0 0 1px ;
          background: var(--header-tabSection);
          color: var(--font-header);
          font-size: 16px;
          text-decoration: none;

          justify-content: center;
          align-items: center;
          display: flex;

          &::after {
            text-align: center;
            width: 22px;
            margin: 0;
          }
        }
        input {
          border-radius: 0 1px 1px 0;
          padding: 2px 0;
          font-size: 15px;
          line-height: 20px;
          width: 100%;
          border: none;
          font-family: var(--font-family-ui);
          background: var(--header-tabSection);
          color: var(--font-header);
        }
        .suggestions {
          background-color: var(--ctx-bg);
          border: solid 1px var(--ctx-frame);
          color: var(--font-ctx);

          font-family: var(--font-family-ui);
          font-weight: normal;

          list-style: none;

          li[aria-selected="true"] {
            background: var(--ctx-select);
          }

          z-index: 5;
          padding: 5px;
          outline: none;
          cursor: default;
          position: fixed;
          user-select: none;
          white-space: nowrap;
        }
      }
    }
    .lineBreak {
      flex-basis: 100%;
      height: 3px;
    }
    #tabSection {
      background: var(--header-tabSection);
      width: calc(100vw - 58px);
      max-width: calc(100vw - 58px);
      height: 28px;
      display: inline-flex;

      #dragTab {
        position: absolute;
        z-index: 1;
        pointer-events: none;

        background: var(--header-bg);

        //tab css copied
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
        width: 28px;
        height: 28px;
        font-size: 28px;
        line-height: 1;
      }
    }
  }
</style>
