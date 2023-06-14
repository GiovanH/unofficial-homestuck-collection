<template>
    <div id="appHeader" :class="{hidden: isHidden}">
      <TitleBar :style="{display: $localData.settings.useSystemWindowDecorations ? 'none' : 'inherit'}"/>
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
      windowHeight: window.innerHeight
    }
  },
  computed: {
    isHidden() {
      const isFullscreen = (this.windowHeight === screen.height)
      return isFullscreen && this.$localData.settings.hideFullscreenHeader
    }
  },
  methods: {

  },
  mounted () {
    // Vue won't let us use innerWidth in a computed function otherwise
    // since the window object isn't a reactive vue element
    window.onresize = () => {
      this.windowHeight = window.innerHeight
    }
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
