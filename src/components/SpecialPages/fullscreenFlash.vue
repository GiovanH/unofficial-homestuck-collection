<template>
  <div class="pageBody" :class="bgClass" :data-pageid="`${storyId}/${thisPage.pageId}`">
    <div class="pageFrame">
      <div class="pageContent">
        <Footnotes :pageId="thisPage.pageId" preface />
          <div class="mediaContent">
              <Media :url="flashUrl" ref="flash" />
          </div>      
          <div class="textContent">
              <PageNav :thisPage="thisPage" :nextPages="nextPagesArray" class="hidden" />
          </div>
        <Footnotes :pageId="thisPage.pageId" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'
import Footnotes from '@/components/Page/PageFootnotes.vue'

import PAGE from '@/components/Page/Page.vue'

export default {
  name: 'fullscreenFlash',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, PageNav, Footnotes
  },
  theme: function(ctx) {
    ctx.$logger.info("Checked theme", ctx.gameOverThemeOverride)
    if (ctx.gameOverThemeOverride) return ctx.gameOverThemeOverride
  },
  title: PAGE.title,
  data: function() {
    return {
      appThemeOverride: 'default'
    }
  },
  computed: {
    pageNum: PAGE.computed.pageNum,
    storyId: PAGE.computed.storyId,
    thisPage: PAGE.computed.thisPage,
    pageCollection: PAGE.computed.pageCollection,
    nextPagesArray: PAGE.computed.nextPagesArray,
    isRyanquest: PAGE.computed.isRyanquest,
    flashUrl() {
      let url = this.thisPage.media[0]
      if (this.$localData.settings.hqAudio && this.thisPage.flag.includes('HQ')) {
        return `${url.substring(0, url.length-4)}_hq.swf`
      }
      else return url
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
      this.$watch(
        "$refs.flash.gameOver.count", (count) => {
          switch(count) {
            // Swipe to A6A6I3
            case 1:
              this.$el.style.transition = 'background-position 0.15s ease'
              this.$el.style.backgroundPosition = 'right bottom'
              this.$parent.gameOverThemeOverride = 'default'
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
              this.$parent.gameOverThemeOverride = 'default'
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
    }
    &.shes8ack {
      background: #fff;
    }
    // banging
    // &[data-pageid="6/007395"] {
    //   background: #5a5a5a;
    // }
    &.gameover {
      background: linear-gradient(to right, #042300 50%, #535353 50%);
      background-size: 200% 100%;
      background-position: left bottom;
    }

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

