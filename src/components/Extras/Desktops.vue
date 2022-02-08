<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <h2 class="">DESKTOP WALLPAPERS</h2>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/PS_office_desktop_thumb.jpg"/><br>
          <a href="/desktops/PS_office_desktop.jpg">1280x1024</a><br>
          <a href="/desktops/office_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/office_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/PS_endpose_desktop_thumb.jpg"/><br>
          <a href="/desktops/PS_endpose_desktop.jpg">1280x1024</a><br>
          <a href="/desktops/endpose_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/endpose_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/johnhouse_thumb.jpg"/><br>
          <a href="/desktops/johnhouse_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/johnhouse_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/johnhouse_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/skaia_thumb.jpg"/><br>
          <a href="/desktops/skaia_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/skaia_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/skaia_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/daveapt_thumb.jpg"/><br>
          <a href="/desktops/daveapt_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/daveapt_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/daveapt_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/craterblastoff_thumb.jpg"/><br>
          <a href="/desktops/craterblastoff_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/craterblastoff_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/craterblastoff_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/craterdesert_thumb.jpg"/><br>
          <a href="/desktops/craterdesert_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/craterdesert_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/craterdesert_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/craterisland_thumb.jpg"/><br>
          <a href="/desktops/craterisland_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/craterisland_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/craterisland_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/jadehouse_thumb.jpg"/><br>
          <a href="/desktops/jadehouse_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/jadehouse_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/jadehouse_1920x1080.jpg">1920x1080</a>
        </div>
        <div class="wallpaper">
          <MediaEmbed url="/desktops/mcwpp_thumb.jpg"/><br>
          <a href="/desktops/mcwpp_1280x1024.jpg">1280x1024</a><br>
          <a href="/desktops/mcwpp_1440x900.jpg">1440x900</a><br>
          <a href="/desktops/mcwpp_1920x1080.jpg">1920x1080</a>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'


export default {
  name: 'desktops',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }
    a {
      
      color: var(--page-links);
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      justify-content: center;
      
      .pageContent {
        background: var(--page-pageContent);

        width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        h2 {
          max-width: 590px;
          text-align: center;
          line-height: 1.1;
          font-size: 32px;
          padding: 15px 0;
        }
        .logo {
          margin-bottom: 25px;
        }
        .wallpaper {
          margin: 15px 0;
          text-align: center;
          font-size: 18px;
        }
      }	
    }
  }
</style>

