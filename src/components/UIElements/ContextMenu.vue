<template>
  <div tabindex="-1" class="contextMenu" id="contextMenu" @click="handleClick()" @blur="away">
    <template v-if="tags.length <= 0">
      <ul>
        <li @mouseup="back()">Back</li>
        <li @mouseup="forward()">Forward</li>
      </ul>
      <ul>
        <li @mouseup="selectAll()">Select All</li>
        <li @mouseup="saveGame()">Save/Load</li>
      </ul>
    </template>
    <ul v-if="tags.includes('History')">
      <li @mouseup="back()">Back</li>
      <li @mouseup="forward()">Forward</li>
    </ul>
    <template v-if="tags.includes('Tab')">
      <ul>
        <li @mouseup="duplicateTab()">Duplicate Tab</li>
        <li @mouseup="closeTab()">Close Tab</li>
      </ul>
      <ul>
        <li @mouseup="closeTabsToRight()">Close Tabs to the Right</li>
        <li @mouseup="closeAllOtherTabs()">Close Other Tabs</li>  
      </ul>
    </template>
    <ul v-if="tags.includes('TabSection')">
      <li @mouseup="newTab()">New Tab</li>
      <li @mouseup="reopenTab()">Reopen Closed Tab</li>
      <li @mouseup="closeCurrentTab()">Close Current Tab</li>  
    </ul>
    <ul v-if="tags.includes('Selection')">
      <li @mouseup="copy()">Copy</li>
      <li @mouseup="selectAll()">Select All</li>  
      <li @mouseup="googleSearch()">Search with Google</li>  
      <li v-for="(action, index) in actionsText" :key="index" @mouseup="bind(action.cb, $event)" v-text="action.title"></li>
    </ul>
    <template v-if="tags.includes('Input')">
      <ul>
        <li @mouseup="cut()">Cut</li>
        <li @mouseup="copy()">Copy</li>
        <li @mouseup="paste()">Paste</li>  
      </ul>
      <ul>
        <li @mouseup="deleteText()">Delete</li>
        <li @mouseup="selectAll()">Select All</li>
      </ul>
    </template>
    <ul v-if="tags.includes('Link')">
      <li v-if="tags.includes('External')" @mouseup="openLinkInNewTab()">Open Link in Browser</li>
      <li v-else-if="tags.includes('MediaModal')" @mouseup="openLinkInNewTab()">Open Link in Popup</li>
      <li v-else @mouseup="openLinkInNewTab()">Open Link in New Tab</li>
      <li @mouseup="copyLink()">Copy Link</li>
      <li v-if="targetAnchor.innerText.length > 0" @mouseup="copyLinkText()">Copy Link Text</li>
      <li v-for="(action, index) in actionsLink" :key="index" @mouseup="bind(action.cb, $event)" v-text="action.title"></li>
    </ul>
    <ul v-if="tags.includes('Image')">
      <li v-for="(action, index) in actionsImage" :key="index" @mouseup="bind(action.cb, $event)" v-text="action.title"></li>
    </ul>
    <ul v-if="actionsEx.length">
      <li v-for="(action, index) in actionsEx" :key="index" @mouseup="bind(action.cb, $event)" v-text="action.title"></li>
    </ul>
    <ul v-if="$parent.zoomLevel != 0">
      <li @mouseup="resetZoom()">Reset Zoom</li>
    </ul>
    <ul v-if="$localData.settings.devMode">
      <li @mouseup="inspectElement()">Inspect</li>
    </ul>
  </div>
</template>

<script>
const {shell, clipboard, ipcRenderer} = require('electron')

export default {
  name: 'contextMenu',
	props: [
	],
  data(){
    return {
      tags: [],
      actionsImage: [
        {
          title: "Open Image",
          cb() { shell.openPath(this.$mspaFileStream(this.target.src)) }
        },
        {
          title: "Open in Folder",
          cb() { shell.showItemInFolder(this.$mspaFileStream(this.target.src)) }
        },
        {
          title: "Save Image",
          cb() { ipcRenderer.invoke('save-file', {url: this.$mspaFileStream(this.target.src)}) }
        }
      ],
      actionsLink: [],
      actionsText: [],
      actionsEx: [],
      target: undefined,
      targetAnchor: undefined,
      partnerEl: undefined,
      wasClicked: false
    }
  },
  computed: {
  },
  methods: {
    bind(cb, $event){
      return cb.bind(this)($event)
    },
    back(){
      this.$localData.root.TABS_HISTORY_BACK()
    },
    forward(){
      this.$localData.root.TABS_HISTORY_FORWARD()
    },
    saveGame(){
      window.vm.$children[0].$refs[this.$localData.tabData.activeTabKey][0].toggleBookmarks()
    },
    resetZoom(){
      this.$parent.resetZoom()
      this.away()
    },
    selectAll(){
      document.execCommand('selectAll')
    },
    cut(){
      document.execCommand('cut')
    },
    copy(){
      document.execCommand('copy')
    },
    paste(){
      document.execCommand('paste')
    },
    deleteText(){
      document.getSelection().deleteFromDocument()
    },
    newTab() {
      this.$localData.root.TABS_NEW()
    },
    reopenTab() {
      this.$localData.root.TABS_RESTORE()
    },
    closeCurrentTab() {
      this.$localData.root.TABS_CLOSE()
    },
    closeTab() {
      this.$localData.root.TABS_CLOSE((this.target.closest('.tab') || this.target).id.slice(4))
    },
    closeTabsToRight() {
      this.$localData.root.TABS_CLOSE_ON_RIGHT((this.target.closest('.tab') || this.target).id.slice(4))
    },
    closeAllOtherTabs() {
      this.$localData.root.TABS_CLOSE_ALL_OTHERS((this.target.closest('.tab') || this.target).id.slice(4))
    },
    duplicateTab() {
      this.$localData.root.TABS_DUPLICATE((this.target.closest('.tab') || this.target).id.slice(4))
    },
    openLinkInNewTab(){
      let href = this.targetAnchor.href
      this.$openLink(href, true)
    },
    copyLink(){
      let target = this.targetAnchor.href
      clipboard.writeText(target.replace(/.*?:\/\/(?:localhost:\d*|\.)(\/.*)$/, "$1"))
    },
    copyLinkText(){
      clipboard.writeText(this.target.innerText)
    },
    inspectElement() {
      ipcRenderer.invoke('inspect-element', {x: this.clickPos.x, y: this.clickPos.y})
    },
    googleSearch() {
      let query = window.getSelection().toString()
      this.$openLink(`https://google.com/search?q=${encodeURIComponent(query)}`)
    },

    lendFocus(el) {
      this.partnerEl = el
    },

    open(e, target){
      if (target.id == 'titleBar' ||target.id == 'titleBarButtons' || target.parentNode.id == 'titleBarButtons') return
      let box = this.$el
      if (document.activeElement !== box) {
        this.clickPos = {x: e.clientX, y: e.clientY}
        this.target = target
        
        if (target.id == 'tabNavigation' || target.closest('#tabNavigation')) this.tags.push('History')
        else if (target.classList.contains('tab') || target.parentNode.classList.contains('tab')) this.tags.push('Tab')
        else if (target.id == 'tabSection' || target.classList.contains('newTabButton')) this.tags.push('TabSection')
        else if ((target.tagName == 'INPUT' && target.type == 'text') || target.tagName == 'TEXTAREA') this.tags.push('Input')
        else if (window.getSelection().toString().length > 0) this.tags.push('Selection')
        if (target.tagName == 'IMG') this.tags.push("Image")
        if (target.closest('a') && target.closest('a').href) {
          this.targetAnchor = target.closest('a')
          let urlObject = new URL( this.targetAnchor.href)
          if (!/(app:\/\/\.|:\/\/localhost:8080)/.test(urlObject.origin) || /\.(html|pdf)$/i.test(urlObject.pathname)) this.tags.push('External')
          else if (/\.(jpg|png|gif|swf|txt|mp3|wav|mp4|webm)$/i.test(urlObject.pathname)) this.tags.push('MediaModal')
          this.tags.push('Link')
        }

        this.$nextTick( () => {
          box.style.display = 'block'

          let page = document.body
          let boxX = e.clientX // mouse X
          let boxY = e.clientY // mouse Y
          let boxWidth = box.clientWidth
          let boxHeight = box.clientHeight

          box.style.left = 
              (boxX + boxWidth > page.scrollLeft + page.clientWidth ? 
              page.scrollLeft + page.clientWidth - boxWidth: 
              boxX) + 'px'

          box.style.top = 
              (boxY + boxHeight > page.scrollTop + page.clientHeight ? 
              boxY - boxHeight: 
              boxY) + 'px'
          box.focus()
        })
      }
    },
    handleClick() {
      this.wasClicked = true
      this.$el.blur()
    },
    away(event) {
      this.tags = []
      this.target = undefined
      this.targetAnchor = undefined
      this.$el.style.display = 'none'
      
      if (this.partnerEl) {
        if (this.wasClicked || !document.hasFocus()) {
          this.wasClicked = false
          this.partnerEl.focus()
        }
        else if (!this.partnerEl.contains(event.relatedTarget)) {
          this.partnerEl.focus()
          this.partnerEl.blur()
        }
        this.partnerEl = undefined
      }
    }
  },
  watch: {
    '$localData.tabData.activeTabKey'(to, from) {
      if (to != from) this.away()
    }
  }
}
</script>

<style lang="scss" scoped>
.contextMenu{
  background-color: var(--ctx-bg);
  border: solid 1px var(--ctx-frame);
  box-shadow: 2px 2px 2px -2px var(--ctx-shadow);
  color: var(--font-ctx);

  font-family: var(--font-family-ui);
  font-weight: normal;

  z-index: 5;
  padding: 5px;
  outline: none;
  display: none;
  cursor: default;
  position: fixed;
  user-select: none;
  white-space: nowrap;
  ul {
    list-style: none;
  }
  li {
    padding: 2px 5px;
    &:hover {
      background: var(--ctx-select);
    }
  }
  ul:not(:last-child) {
    border-bottom: 1px solid var(--ctx-divider);
    padding-bottom: 2px;
    margin-bottom: 2px;
  }
}
</style>
