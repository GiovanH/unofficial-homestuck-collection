<template>
    <div id="appHeader" :class="{hidden: isHidden}">
      <TitleBar :style="{display: ($localData.settings.useSystemWindowDecorations || $isWebApp) ? 'none' : 'inherit'}"/>
      <TabBar />
    </div>
</template>

<script>
import TitleBar from '@/components/AppMenu/TitleBar.vue'
import TabBar from '@/components/AppMenu/TabBar.vue'

export default {
  name: 'appHeader',
  components: {
    TitleBar, TabBar
  },
  data(){
    return {
      windowHeight: 0
    }
  },
  computed: {
    isHidden() {
      const window_is_fullscreen = (this.windowHeight === screen.height)
      return this.$localData.settings.hideFullscreenHeader && window_is_fullscreen
    }
  },
  mounted () {
    // Window object isn't a reactive vue element; react to size w/ listener
    window.addEventListener("resize", (e) => {
      this.windowHeight = window.outerHeight
    })
  }
}
</script>

<style lang="scss">
#appHeader {
  z-index: 4;
  background: var(--header-bg);
  color: var(--font-header);
  * {
    user-select: none;
  }

  --address-bar-height: 28px;
  --tab-height: 28px;
}
.systemButton {
  &:not([disabled]) {
    &:hover {
      background: var(--header-buttonHoverState);
    }
    &:active {
      background: var(--header-buttonClickState);
    }
  }
}
</style>
