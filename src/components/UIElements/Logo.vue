<template>
  <div class="topLogo">
    <Media :url="logo_src"  gifmode />
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'
var isSafari = false
try {
  isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
} catch {}

export default {
  name: 'logo',
  components: {Media},
  computed: {
    logo_src() {
      if (this.$localData.settings.reducedMotion)
        return "assets://archive/collection/logo_v2_reduced.webm"

      if (isSafari) 
        return "assets://archive/collection/logo_v2_static.png"
        
      return "assets://archive/collection/logo_v2_full.webm"
    }
  }
}
</script>

<style scoped lang="scss">
  .topLogo {
    // margin-bottom: 25px;
    img, video {
      width: 800px;
      max-width: 100%;
    }
  }
</style>
