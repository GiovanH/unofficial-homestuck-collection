<template>
  <div class="topLogo">
    <Media :url="logo_src"  gifmode />
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'logo',
  components: {Media},
  computed: {
    logo_src() {
      if (this.$localData.settings.reducedMotion)
        return "assets://archive/collection/logo_v2_reduced.webm"

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