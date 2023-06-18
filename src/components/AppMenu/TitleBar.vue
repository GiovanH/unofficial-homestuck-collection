<template>
    <div id="titleBar" v-if="!$isWebApp">
      <div id="titleBarText" v-text="activeTabTitle" />
      <div id="titleBarButtons" tabindex="-1" v-if="showButtons">
        <div class="systemButton" id="minButton" @click="minimize()" >‒</div>
        <div class="systemButton" id="maxButton" @click="maximize()" >☐</div>
        <div class="systemButton" id="closeButton" @click="close()" >✕</div>
    </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')
export default {
  name: 'titleBar',
  components: {

  },
  data(){
    return {
    }
  },
  computed: {
    showButtons() {
      // Only show buttons if the navigator doesn't report a mac system
      return navigator.appVersion.indexOf('Macintosh') == -1
    },
    activeTabTitle() {
      return this.$archive ? this.$localData.root.activeTabObject.title : 'The Unofficial Homestuck Collection'
    },
    activeTabKey() {
      return this.$localData.tabData.activeTabKey
    }
  },
  methods: {
    minimize() {
      ipcRenderer.invoke('win-minimize')
    },
    maximize() {
      ipcRenderer.invoke('win-maximize')
    },
    close() {
      ipcRenderer.invoke('win-close')
      // Give the OS 2500 ms, then force close
      setTimeout(function() {
        ipcRenderer.sendSync('win-close-sync')
      }, 2500)
    }
  },
  mounted() {
  },
  watch: {
    activeTabTitle(to, from){
      ipcRenderer.send('set-title', to)
      document.title = to
    }
  }
}
</script>

<style lang="scss" scoped>

  #titleBar{
    position: relative;
    --title-bar-height: 22px;
    --title-button-margin: 0px;

    background: var(--header-bg);
    color: var(--font-header);

    // Margin gives mouse room to resize window
    margin-top: 1px;
    height: calc(var(--title-bar-height) - 1px);
    -webkit-app-region: drag;

    * {
      user-select: none;
    }
  }
  #titleBarText {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    width: 85%;
    margin: 0 auto;
    padding-top: 4px;
    padding-bottom: 2px;
    font-size: 14px;
  }
  #titleBarButtons {
    -webkit-app-region: no-drag;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    .systemButton {
      display: inline-block;
      pointer-events: auto;
      width: calc((8 / 7) * var(--title-bar-height));
      height: var(--title-bar-height);

      line-height: var(--title-bar-height);
      padding: 0 2px;
      margin: var(--title-button-margin);
    }
    #closeButton:hover {
      color: white;
			background: rgb(255, 73, 73);
		}
  }
</style>
