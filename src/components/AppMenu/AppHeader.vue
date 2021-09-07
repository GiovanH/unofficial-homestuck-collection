<template>
    <div id="appHeader" class="headerHoverEnabled">
      <TitleBar />
      <TabBar />
      <BCPlayer />
    </div>
</template>

<script>
import TitleBar from '@/components/AppMenu/TitleBar.vue'
import TabBar from '@/components/AppMenu/TabBar.vue'
import BCPlayer from '@/components/Music/BCPlayer.vue'

export default {
  name: 'appHeader',
  components: {
    TitleBar, TabBar, BCPlayer
  },
  data(){
    return {
    }
  },
  computed: {

  },
  methods: {

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
  &:not(.headerHoverEnabled) {
    .systemButton, .tab{
      pointer-events: none;
    }
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
