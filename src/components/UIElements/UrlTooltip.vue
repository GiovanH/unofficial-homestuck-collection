<template>
  <span v-text="url" :class="(show ? 'show' : 'hide')"></span>
</template>

<script>

var electron;
if (!window.isWebApp) {
  var electron = require('electron')
}

export default {
  name: 'UrlTooltip',
  props: [],
  data() {
    return {
      url: "",
      show: false
    }
  },
  mounted() {
    electron.ipcRenderer.on('update-target-url', this.onNewUrl)
  },
  computed: {
  },
  methods: {
    onNewUrl(event, new_url) {
      if (new_url) this.url = this.getDisplayUrl(new_url)
      this.show = Boolean(new_url)
    },
    getDisplayUrl(new_url){
      new_url = new_url
        .replace(/^http:\/\/localhost:8080\//, "/")
        .replace(/^app:\/\/\.\//, "/")

      if (!new_url.startsWith('http') && !new_url.startsWith('assets:')) {
        // Not an external link; resolve the path
        new_url = this.$resolvePath(new_url)
      }
      return new_url
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
  span {
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 2px;

    background-color: var(--ctx-bg);
    border: solid 1px var(--ctx-frame);
    box-shadow: 2px 2px 2px -2px var(--ctx-shadow);

    font-weight: normal;
    color: var(--font-ctx);
    font-family: var(--font-family-ui);
    
    transition: opacity 0.2s ease;
    opacity: 0;
    &.show {
      opacity: 1;
    }
  }
</style>
