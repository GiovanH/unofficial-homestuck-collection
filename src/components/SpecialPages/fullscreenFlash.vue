<template>
  <div class="pageBody" :class="bgClass" :data-pageid="`${storyNum}/${thisPage.pageId}`">
    <div class="pageFrame">
      <div class="pageContent">
          <div 
            :class="note.class ? 'preface ' + note.class : 'preface'"
            v-for="note in prefaces">
            <p v-html="note.content"/>
            <span v-if="note.author" class="author" v-text="note.author" />
          </div>
          <div class="mediaContent">
              <Media :url="flashUrl" ref="flash" />
          </div>      
          <div class="textContent">
              <PageNav :thisPage="thisPage" :nextPages="nextPagesArray" :class="(needsNav ? '' : 'hidden')" />
          </div>
          <div 
            :class="note.class ? 'footnote ' + note.class : 'footnote'"
            v-for="note in footnotes">
            <p v-html="note.content"/>
            <span v-if="note.author" class="author" v-text="note.author" />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'

export default {
  name: 'fullscreenFlash',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, PageNav
  },
  data: function() {
    return {
      appThemeOverride: 'default'
    }
  },
  computed: {
    flashUrl() {
      return this.thisPage.media[0]
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
    },
    pageNum() {
      return this.$isVizBase(this.routeParams.base) ? this.$vizToMspa(this.routeParams.base, this.routeParams.p).p : this.routeParams.p
    },
    storyNum() {
      return this.$getStory(this.pageNum)
    },
    footnotes() {
      return (this.$archive.footnotes['story'][this.pageNum] || []).filter(n => !n.preface)
    },
    prefaces() {
      return (this.$archive.footnotes['story'][this.pageNum] || []).filter(n => n.preface)
    },
    thisPage() {
      return {
        ...this.$archive.mspa.story[this.pageNum],
        storyId: this.storyId,
        isRyanquest: this.isRyanquest
      }
    },
    nextPagesArray() {
      this.$logger.info(`${this.tab.url} - ${this.thisPage.title}`)
      let nextPages = []
      this.thisPage.next.forEach(nextID => {
        nextPages.push(this.$archive.mspa.story[nextID])
      })
      return nextPages
    }
  },
  methods:{
  },
  mounted() {
    if (this.thisPage.flag.includes('GAMEOVER')) {
      this.$parent.gameOverThemeOverride = 'A6A6'
      this.$watch(
        "$refs.flash.gameOver.count", (count) => {
          switch(count) {
            //Swipe to A6A6I3
            case 1:
              this.$el.style.transition = 'background-position 0.15s ease'
              this.$el.style.backgroundPosition = 'right bottom'
              this.$parent.gameOverThemeOverride = 'default'
              this.$parent.setTitle()
              break
            //Swipe to A6A6A3
            case 2:
              this.$el.style.backgroundPosition = 'left bottom'
              this.$parent.gameOverThemeOverride = 'A6A6'
              this.$parent.setTitle()
              break
            //Swipe to A6A6I3
            case 3:
              this.$el.style.backgroundPosition = 'right bottom'
              this.$parent.gameOverThemeOverride = 'default'
              this.$parent.setTitle()
              break
            //Fade to dark
            case 4:
              // 2984 -> 3034 = 50 frames at 25fps = 2s
              this.$el.style.transition = 'background-color 2s linear'
              this.$el.style.background = '#313131'
              break
            //Fade to white
            case 5:
              // 3619 -> 3689 = 70 frames at 25fps = 2.8s
              this.$el.style.transition = 'background-color 2.8s linear'
              this.$el.style.background = '#ffffff'
              break
            //Fade to normal
            case 6:
              //3694 -> 3696 = 3 frames at 25fps = 0.06s
              this.$el.style.transition = 'background-color 0.06s linear'
              this.$el.style.background = '#535353'
              break
            //Swipe to A6A6A3
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
    }
    else {
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
        
        .footnote {
          width: 600px;
          // border-top: solid 23px var(--page-pageBorder, var(--page-pageFrame));
          padding: 30px 25px;
          p {
            text-align: center;
            margin: 0 auto;
            width: 600px;
          }
        }
        .preface {
          width: 600px;
          margin: 1em 0;

          border-style: dashed;
          border-width: 1px;

          border-color: var(--page-log-border);
          background-color: var(--page-pageFrame);
          color: var(--page-nav-divider);
          p {
            text-align: center;
            margin: 0 auto;
            width: 600px;
          }
        }

        .footnote, .preface {
          .author {
            font-weight: 300;
            font-size: 10px;
            font-family: Verdana, Arial, Helvetica, sans-serif;

            display: flex;
            justify-content: flex-end;

            position: relative;
            top: 12px;
            margin-top: -12px;

            color: var(--page-nav-meta);
          }
        }
      }	
    }

  }
  

</style>

