<template>
    <div id="appHeader">
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
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
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
