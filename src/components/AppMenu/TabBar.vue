<template>
    <div id="tabBar" :class="{showAddressBar: $localData.settings.showAddressBar}">
      <div id="tabNavigation">
        <div class="systemButton historyButton" @click="historyBack" @click.middle="historyBackNewTab" :disabled="!activeTabHasHistory"><fa-icon icon="chevron-left"></fa-icon></div>
        <div class="systemButton historyButton" @click="historyForward" @click.middle="historyForwardNewTab" :disabled="!activeTabHasFuture"><fa-icon icon="chevron-right"></fa-icon></div>
      </div>
      <div id="jumpBox">
        <div class="jumpBoxWrapper">
          <a :href="jumpboxText" class="jumpboxLink" ref="link" />
          <input class="jumpBoxInput" ref="input" type="text" spellcheck="false" v-model="jumpboxText"  @keydown.enter="focusLink()" />
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

export default {
  name: 'tabBar',
  components: {
    Tab, 
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
    }
  },
  methods: {
    focusLink(){
      this.$refs.link.click()
      document.activeElement.blur()
    },
    historyBack(e) {
      this.$localData.root.TABS_HISTORY_BACK()
    },
    historyForward(e) {
      this.$localData.root.TABS_HISTORY_FORWARD()
    },
    historyBackNewTab(e) {
      console.log(e.button)
      this.$localData.root.TABS_DUPLICATE(this.$localData.tabData.activeTabKey, true, 'back')
    },
    historyForwardNewTab(e) {
      console.log(e.button)
      this.$localData.root.TABS_DUPLICATE(this.$localData.tabData.activeTabKey, true, 'forward')
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
          let titleWidth = this.dragTab.querySelector(".tabTitle").getBoundingClientRect().width - 5 //Offsets 5px of padding on left
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
  watch:{
    '$localData.root.activeTabObject.url'(to, from){
      this.jumpboxText = to
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

    #tabNavigation {
      display: inline-block;
      height: 28px;
      width: 58px;
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

      .jumpBoxWrapper {
        display: flex;
        flex-flow: row nowrap;
        
        border-radius: 2px;
        border: 1px solid var(--header-border);
        background: var(--header-tabSection);

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
          background: var(--header-tabSection);
          color: var(--font-header);
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
