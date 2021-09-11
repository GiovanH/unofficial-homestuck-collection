<template>
  <li class="tabShell" :class="{activeTabShell: isActiveTab}" @mousedown.left="clickTab()" @click.middle="closeTab()">
    <div class="tab" tabindex="-1" :id="'tab_' + tab.key" :class="{activeTab: isActiveTab}">
      <div class="tabTitle" :class="{titleFade}" ref="title" >
        <span v-html="title" ref="titleText"/>
      </div>
      <transition name="fade">
        <div class="systemButton closeTabButton" @mousedown.stop="" @click="closeTab()"  v-if="tabCount > 1">✕</div>
      </transition>
    </div>
  </li> 
</template>

<script>
export default {
  name: 'tab',
  props: [
    'tab'
  ],
  data() {
    return {
      pendingDeletion: false,
      resizeObserver: undefined,
      titleFade: false
    }
  },
  computed: {
    isActiveTab() {
      return this.tab.key === this.$localData.tabData.activeTabKey
    },    
    tabCount () {
      return this.$localData.tabData.tabList.length
    },
    title() {
        let result = !!this.tab.title ? this.tab.title : this.tab.url
        return result
    },
  },
  methods: {
    getId(){
      // Used by TabBar to swap tabs while dragging
      return this.tab.key
    },
    clickTab() {
      this.$localData.root.TABS_SWITCH_TO(this.tab.key)    
    },
    closeTab() {
      this.$localData.root.TABS_CLOSE(this.tab.key)
    },
    onResize() { 
      let titleWidth = this.$refs.title.getBoundingClientRect().width - 5 // Offsets 5px of padding on left
      let titleTextWidth = this.$refs.titleText.getBoundingClientRect().width
      
      this.titleFade = titleWidth < titleTextWidth
    }
  },
  watch: {
    'tab.title'(){
      this.$nextTick(this.onResize)
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(this.$refs.title)
  },
  beforeDestroy() {
    this.resizeObserver.disconnect()
  }
}
</script>

<style lang="scss" scoped>
.tabShell{
  border-right: solid 1px var(--header-border);
  display: inline-flex;
  width: 240px;
  min-width: 30px;
  flex: 0 10 auto;

  .tab {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 0;
    height: 28px;
    cursor: default;

    &:not(.activeTab) {
      &:hover {
        background: var(--header-buttonHoverState);
      }
      &:active {
        background: var(--header-buttonClickState);
      }
    }

    &.activeTab {
      background: var(--header-bg);
    }

    .tabTitle {
      flex: 1 10 auto;
      padding-left: 5px;
      white-space: nowrap;
      min-width: 0;
      overflow: hidden;
      pointer-events: none;
      
      &.titleFade {
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
}

.fade-enter-active, .fade-leave-active {
  transition: all .1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>