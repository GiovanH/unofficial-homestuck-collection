<template>
    <div id="appHeader" :class="{hideInFullscreen: hideInFullscreen}">
      <TitleBar />
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
    hideInFullscreen() {
      const isFullscreen = this.windowHeight === screen.height;
      return isFullscreen && !this.$localData.settings.forceFullscreenHeader;
    }
  },
  methods: {

  },
  mounted () {
    // Vue won't let us use innerWidth in a computed function otherwise
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
  &.hideInFullscreen {
    display: none;
  }
}
.systemButton {
  &.historyButton[disabled] {
    color: var(--font-disabled);
  }
  &:not([disabled]):not(#closeButton) {
    &:hover {
      background: var(--header-buttonHoverState);
    }
    &:active {
      background: var(--header-buttonClickState);
    }
  }
}
  
</style>
