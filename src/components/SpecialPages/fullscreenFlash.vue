<template>
  <div>
    <GenericPage v-if="gameOverPreload"
      :tab="tab" >
      <div class="pageContent">
        <div class="mediaContent">
          <h2 class="pageTitle">[S] GAME OVER.</h2>
          <div class="media" ref="media">
            <div class="panel"
              style="width: 650px; height: 450px; background: #001800; border: none;" />
          </div>
        </div>
        <div class="textContent" style="height: 70px;"></div>
      </div>
    </GenericPage>
    <!-- <GenericPage v-if="gameOverPreload" /> -->
    <div :style="{visibility: gameOverPreload ? 'hidden' : 'visible', height: gameOverPreload ? '0' : undefined}" class="pageBody" :class="[bgClass, {hiddenGameOver: gameOverPreload}]" :data-pageid="`${storyId}/${thisPage.pageId}`">
      <div class="pageFrame">
        <div class="pageContent">
          <Footnotes :pageId="thisPage.pageId" preface />
          <div class="mediaContent">
              <Media :url="flashUrl" ref="flash" />
          </div>
          <div class="textContent">
              <PageNav :thisPage="thisPage" ref="pageNav" :nextPages="nextPagesArray" :class="(needsNav ? '' : 'hidden')" />
          </div>
          <Footnotes :pageId="thisPage.pageId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'
import Footnotes from '@/components/Page/PageFootnotes.vue'
import GenericPage from '@/components/UIElements/GenericPage.vue'

import PAGE from '@/components/Page/Page.vue'

export default {
  extends: PAGE,
  name: 'fullscreenFlash',
  components: {
    Media, PageNav, Footnotes, GenericPage
  },
  theme: function(ctx) {
    ctx.$logger.info("Checked theme", ctx.gameOverThemeOverride)
    if (ctx.gameOverThemeOverride) return ctx.gameOverThemeOverride
  },
  title: PAGE.title,
  data: function() {
    return {
      gameOverPreload: false,
      appThemeOverride: 'default'
    }
  },
  computed: {
    flashUrl() {
      // Mirrored from Page.vue:pageMedia()
      const media = Array.from(this.thisPage.media)
      
      if (this.$archive.audioData[media[0]]) {
        const flashPath = media[0].substring(0, media[0].length - 4)
        this.$logger.info("Found audio for", media[0], this.$archive.audioData[media[0]], "changing to", `${flashPath}_hq.swf`)
        media[0] = `${flashPath}_hq.swf`
      }

      return media[0]
    },
    needsNav() {
      // const base_url = this.flashUrl.split("/").slice(0, -1).join("/")
      // const plainname = filename.split(".").slice(0, -1).join(".")
      const filename = this.flashUrl.split('/').pop()
      const ext = filename.split('.').pop()
      return (ext !== "swf")
    },
    bgClass() {
      return {
        dota: this.thisPage.flag.includes('DOTA'),
        gameover: this.thisPage.flag.includes('GAMEOVER'),
        shes8ack: this.thisPage.flag.includes('SHES8ACK')
      }
    }
  },
  methods: {
  },
  mounted() {
    if (this.thisPage.flag.includes('GAMEOVER')) {
      this.$parent.gameOverThemeOverride = 'A6A6'
      if (!this.needsNav && !this.$localData.settings.reducedMotion) // only if we're using stock flash
        this.gameOverPreload = true // unset by MediaEmbed after we get gameOver signal

      this.$watch(
        "$refs.flash.gameOver.count", (count) => {
          switch(count) {
            // Swipe to A6A6I3
            case 1:
              this.$el.style.transition = 'background-position 0.15s ease'
              this.$el.style.backgroundPosition = 'right bottom'
              this.$parent.gameOverThemeOverride = 'mspa'
              this.$parent.setTitle()
              break
            // Swipe to A6A6A3
            case 2:
              this.$el.style.backgroundPosition = 'left bottom'
              this.$parent.gameOverThemeOverride = 'A6A6'
              this.$parent.setTitle()
              break
            // Swipe to A6A6I3
            case 3:
              this.$el.style.backgroundPosition = 'right bottom'
              this.$parent.gameOverThemeOverride = 'mspa'
              this.$parent.setTitle()
              break
            // Fade to dark
            case 4:
              //  2984 -> 3034 = 50 frames at 25fps = 2s
              this.$el.style.transition = 'background-color 2s linear'
              this.$el.style.background = '#313131'
              break
            // Fade to white
            case 5:
              //  3619 -> 3689 = 70 frames at 25fps = 2.8s
              this.$el.style.transition = 'background-color 2.8s linear'
              this.$el.style.background = '#ffffff'
              break
            // Fade to normal
            case 6:
              // 3694 -> 3696 = 3 frames at 25fps = 0.06s
              this.$el.style.transition = 'background-color 0.06s linear'
              this.$el.style.background = '#535353'
              break
            // Swipe to A6A6A3
            case 7:
              this.$el.style.background = 'linear-gradient(to right, #042300 50%, #535353 50%) right bottom'
              this.$el.style.backgroundSize = '200% 100%'
              window.getComputedStyle(this.$el).background
              this.$el.style.transition = 'background-position 0.15s ease'
              this.$el.style.backgroundPosition = 'left bottom'
              this.$parent.gameOverThemeOverride = 'A6A6'
              this.$parent.setTitle()
              break
          }
        }
      )
    }
  },
  watch: {
    '$localData.settings.jsFlashes'() {
      this.$forceUpdate()
    }
  },
  updated() {
    if (this.thisPage.flag.includes('GAMEOVER')) {
      this.$el.style.transition = 'none'
      this.$el.style.background = 'linear-gradient(to right, #042300 50%, #535353 50%)'
      this.$el.style.backgroundPosition = 'left bottom'
      this.$el.style.backgroundSize = '200% 100%'
      this.$parent.gameOverThemeOverride = 'A6A6'
      this.$parent.setTitle()
    } else {
      this.$el.style.cssText = ''
      this.$parent.gameOverThemeOverride = false
    }
  },
  destroyed() {
    this.$parent.gameOverThemeOverride = false
  }
}
</script>

<style scoped lang="scss">
  .hiddenGameOver {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }
  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }

    &.dota {
      background: #000;
      height: 100%;
    }
    &.shes8ack {
      background: #fff;
      height: 100%;
    }
    // banging
    // &[data-pageid="6/007395"] {
    //   background: #5a5a5a;
    // }
    // &.gameover {
    //   background: linear-gradient(to right, #042300 50%, #535353 50%);
    //   background-size: 200% 100%;
    //   background-position: left bottom;
    // }

    .pageFrame {
    flex: 0 1 auto;
    display: flex;
    justify-content: center;

      .pageContent {
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .mediaContent {
          display: flex;
          align-items: center;
          flex-flow: column;
        }
      }
    }
  }
</style>
