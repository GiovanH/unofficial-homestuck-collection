<template>
  <GenericPage>
    <h2 class="pageTitle">DESKTOP WALLPAPERS</h2>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/PS_office_desktop_thumb.jpg"/><br>
      <a href="assets://desktops/PS_office_desktop.jpg">1280x1024</a><br>
      <a href="assets://desktops/office_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/office_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/PS_endpose_desktop_thumb.jpg"/><br>
      <a href="assets://desktops/PS_endpose_desktop.jpg">1280x1024</a><br>
      <a href="assets://desktops/endpose_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/endpose_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/johnhouse_thumb.jpg"/><br>
      <a href="assets://desktops/johnhouse_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/johnhouse_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/johnhouse_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/skaia_thumb.jpg"/><br>
      <a href="assets://desktops/skaia_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/skaia_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/skaia_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/daveapt_thumb.jpg"/><br>
      <a href="assets://desktops/daveapt_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/daveapt_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/daveapt_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/craterblastoff_thumb.jpg"/><br>
      <a href="assets://desktops/craterblastoff_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/craterblastoff_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/craterblastoff_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/craterdesert_thumb.jpg"/><br>
      <a href="assets://desktops/craterdesert_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/craterdesert_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/craterdesert_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/craterisland_thumb.jpg"/><br>
      <a href="assets://desktops/craterisland_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/craterisland_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/craterisland_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/jadehouse_thumb.jpg"/><br>
      <a href="assets://desktops/jadehouse_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/jadehouse_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/jadehouse_1920x1080.jpg">1920x1080</a>
    </div>
    <div class="wallpaper">
      <MediaEmbed url="assets://desktops/mcwpp_thumb.jpg"/><br>
      <a href="assets://desktops/mcwpp_1280x1024.jpg">1280x1024</a><br>
      <a href="assets://desktops/mcwpp_1440x900.jpg">1440x900</a><br>
      <a href="assets://desktops/mcwpp_1920x1080.jpg">1920x1080</a>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/UIElements/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'desktops',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    GenericPage, MediaEmbed
  },
  title(ctx) {
    return "Desktops"
  }
}
</script>

<style scoped lang="scss">
  .wallpaper {
    margin: 15px 0;
    text-align: center;
    font-size: 18px;
  }
</style>
