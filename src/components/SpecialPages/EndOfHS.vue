<template>
  <div class="pageBody" :class="bgClass" :data-pageid="`${storyId}/${thisPage.pageId}`">
    <div class="tall">
      <div class="main">
        <div class="header">
          <Banner :id="tab.key" :page="thisPage"/>
        </div>
        <Footnotes :pageId="thisPage.pageId" preface />
        <div class="vid">
          <EndOfHSMedia :url="thisPage.media[0]" :autoplay="pageNum === '009987'" ref="embed" />
        </div>      
        <div class="links">
          <FlashCredit  :pageId="thisPage.pageId" />
          <PageNav base="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav" />
        </div>
        <Footnotes :pageId="thisPage.pageId" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'
import Banner from '@/components/Page/PageBanner.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'
import Footnotes from '@/components/Page/PageFootnotes.vue'

import PAGE from '@/components/Page/Page.vue'

const EndOfHSMedia = {
  extends: MediaEmbed,
  name: "EOHSMediaEmbed",
  methods: {
    onVideoLoaded(event) {
      MediaEmbed.methods.onVideoLoaded.bind(this)(event)
      if (this.flashProps.id == "08080") {
        // Collide hijinks
        const collide = function(){
          if (this.currentTime > 22) {
            this.style.transition = "width 1.5s cubic-bezier(0, 0, 0, 1)"
            // this.style.height = "650px"
            this.style.width = "950px"
            this.removeAttribute("controls")
            setTimeout(() => this.setAttribute("controls", "true"), 6000)
            this.removeEventListener("timeupdate", collide)
          }
        }
        event.srcElement.style.objectFit = "cover"
        event.srcElement.style.objectPosition = "top"
        event.srcElement.style.height = "650px"
        event.srcElement.style.width = "650px"
        event.srcElement.addEventListener("timeupdate", collide)
        // event.srcElement.currentTime = 17 // debug helper
      }
    }
  }
}

export default {
  extends: PAGE,
  name: 'EndOfHS',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    EndOfHSMedia, PageNav, Banner, FlashCredit, Footnotes
  },
  computed: {
    bgClass() {
      return {
        collide: this.pageNum === "009987",
        act7: this.pageNum === "010027",
        credits: this.pageNum === "010030"
      }
    }
  },
  beforeDestroy() {
    // Trigger EOH notifications if leaving new-reader mode
    if (this.pageNum === "010030") this.$popNotifFromPageId('010030')
  }
}
</script>

<style scoped lang="scss">

// Classes copied from original pages to preserve original theme through style changes
.pageBody {
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column;
  flex: 1 0 auto;
  align-items: center;

  &.collide {
    background: #000;
    .tall {
      background-color: #323232;
      border-left: 3px solid #535353;
      border-right: 3px solid #535353;

      .main {
        background-color: #323232;
        border-left: 4px solid #454545;
        border-right: 4px solid #454545;
      }
      .header {
        background-color: #1a1a1a;
      }
      .vid {
        height: 650px;
        background: #262626;
      }
      .links {
        background-color: #262626;

        ::v-deep nav {
          .nextArrow {
            font-size: 32px;
          }
          .nextArrow a,
          .navOptions,
          .navOptions a {
            color: red;
          }
        }
      }
    }
  }
  &.act7 {
    background: #fff;
    .tall {
      border-left: 3px solid #f3f3f3;
      border-right: 3px solid #f3f3f3;

      .main {
        background-color: #dbdbdb;
        border-left: 4px solid #e2e2e2;
        border-right: 4px solid #e2e2e2;
      }
      .vid {
        height: 720px;
      }
      .links {
        background-color: #cecece;

        ::v-deep nav {
          .nextArrow {
            font-size: 48px;
          }
          .nextArrow a,
          .navOptions,
          .navOptions a {
            color: white;
          }
        }
      }
    }
  }
  &.credits {
    background: black;

    ::v-deep nav {
      .navOptions a {
        font-size: 0 !important;
        visibility: hidden;
        &::after {
          content: "==>";
          visibility: visible;
          font-size: 32px;
          line-height: initial;
        }
      }
      .meta {
        display: none;
      }
    }
  }

  .tall {
    flex: 0 1 auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    .main {
      display: flex;
      flex: 0 1 auto;
      align-items: center;
      flex-flow: column;

      padding: 0 10px;

      .header {
        min-height: 129px;
      }
      .vid {
        display: flex;
        align-items: center;
        flex-flow: column;
        width: 100%;
      }

      .links {
        width: 100%;
        padding: 40px 0;
        margin: 10px 0;

        display: flex;
        align-items: center;
        flex-direction: column;
        flex-grow: 0;
        ::v-deep nav {
          width: 600px;
          .navOptions {
            font-size: 14px;
          }
        }
      }
    }
  }
}

</style>

