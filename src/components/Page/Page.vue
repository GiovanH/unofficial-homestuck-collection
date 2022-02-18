<template>
  <div class="pageBody customStyles" :class="{pixelated, supercartridge, hscroll, scratchIntermission}" :data-pageid="`${thisPage.storyId}/${thisPage.pageId}`">
    <Banner :tab="tab" :page="thisPage"/>
    <Firefly :tab="tab" v-if="fireflies"/>
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <Metadata v-if="showMetadata == true" :thisPage="thisPage" />
      <div class="pageContent">
        <Footnotes :pageId="thisPage.pageId" preface class="footnotesContainer"/>
          <div class="mediaContent">
              <h2 class="pageTitle" v-text="thisPage.title" v-if="!supercartridge" />
              <div class="media" ref="media">
                  <Media v-for="url in pageMedia" :key="url" :url="url" class="panel"/>
              </div>
          </div>
          <div class="textContent">
              <FlashCredit  :pageId="thisPage.pageId"/>
              <TextContent :key="thisPage.pageId" :pageId="thisPage.pageId"  :content="thisPage.content"/>
              <PageNav :thisPage="thisPage" 
                :nextPages="nextPagesArray" ref="pageNav"
                :class="{'hidden': hideNav}" />
          </div>
        <Footnotes :pageId="thisPage.pageId" class="footnotesContainer"/>
      </div>
      <div class="hidden">
        <Media v-for="url in nextPagesMedia" :key="url" :url="url" class="panel"/>
      </div>
    </div>
    <PageFooter :pageWidth="scratchIntermission ? '940px' : hscroll ? '1200px' : '950px'" />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Banner from '@/components/Page/PageBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import TextContent from '@/components/Page/PageText.vue'
import PageNav from '@/components/Page/PageNav.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import Footnotes from '@/components/Page/PageFootnotes.vue'
import Metadata from '@/components/Page/PageMetadata.vue'

import Firefly from '@/components/SpecialPages/Firefly.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'

export default {
  name: 'page',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Banner, Media, TextContent, PageNav, PageFooter, Firefly, FlashCredit, Footnotes, Metadata
  },
  data: function() {
    return {
      preload: [],
      retcon6passwordPages: ["009058", "009109", "009135", "009150", "009188", "009204", "009222", "009263"],
      showMetadata: false
    }
  },
  theme: function(ctx) {
    let p = ctx.$isVizBase(ctx.routeParams.base) ? ctx.$vizToMspa(ctx.routeParams.base, ctx.routeParams.p).p : ctx.routeParams.p
    if (ctx.routeParams.base !== 'ryanquest' && ctx.$archive.mspa.story[p].theme) 
      return ctx.$archive.mspa.story[p].theme
  },
  title: function(ctx) {
    var title
    
    const exceptions = {
      '006715': 'DOTA',
      '008801': 'GAME OVER',
      '009305': 'shes8ack',
      '009987': "ACT 6 ACT 6 ACT 6",
      '010027': 'ACT 7',
      '010030': 'Credits'
    }
    const p = ctx.$isVizBase(ctx.routeParams.base) ? ctx.$vizToMspa(ctx.routeParams.base, ctx.routeParams.p).p : ctx.routeParams.p

    if (ctx.gameOverThemeOverride == 'mspa') title = "ACT 6 ACT 6 INTERMISSION 3"
    else if (ctx.routeParams.base === 'ryanquest' && p in ctx.$archive.mspa.ryanquest) {
      title = `${ctx.$archive.mspa.ryanquest[p].title} - Ryanquest`
    } else {
      if (p in exceptions) {
        title = exceptions[p]
      } else {
        title = ctx.$archive.mspa.story[p].title + [
          " - Jailbreak", " - Bard Quest", "", " - Problem Sleuth", " - Homestuck Beta", " - Homestuck"
        ][ctx.$getStory(p) - 1]
      }
    }
    return title
  },
  computed: {
    isRyanquest(){
      return (this.routeParams.base === 'ryanquest')
    },
    pageNum() {
      if (this.$isVizBase(this.routeParams.base)) {
        return this.$vizToMspa(this.routeParams.base, this.routeParams.p).p
      } else {
        return this.routeParams.p
      }
    },
    storyId() {
      return this.isRyanquest ? 'ryanquest' : this.$getStory(this.pageNum)
    },
    pageCollection() {
      const storyDataKey = this.isRyanquest ? 'ryanquest' : 'story'
      return this.$archive.mspa[storyDataKey]
    },
    thisPage() {
      // Add useful information to archive object
      return {
        ...this.pageCollection[this.pageNum],
        storyId: this.storyId,
        isRyanquest: this.isRyanquest
      }
    },
    audioData(){
      let media = Array.from(this.thisPage.media)
      this.deretcon(media)
      return this.$archive.audioData[media[0]]
    },
    pageMedia() {
      const media = Array.from(this.thisPage.media)
      this.deretcon(media)
      var mediakey = media[0]

      if (this.audioData) {
        const flashPath = mediakey.substring(0, mediakey.length - 4)
        this.$logger.info("Found audio for", mediakey, this.audioData, "changing to", `${flashPath}_hq.swf`)
        media[0] = `${flashPath}_hq.swf`
      } else if (mediakey.includes(".swf")) {
        this.$logger.info("Found no audio for", mediakey, this.audioData)
      }

      return media
    },
    nextPagesArray() {
      this.$logger.info(`${this.tab.url} - ${this.thisPage.title}`)
      let nextPages = []
      this.thisPage.next.forEach(nextID => {
        // Removes [??????] password links if the retcon hasn't been triggered yet
        if (!this.$shouldRetcon('retcon6') && this.retcon6passwordPages.includes(nextID)) return
        nextPages.push(this.pageCollection[nextID.trim()])
      })
      return nextPages
    },
    nextPagesMedia(){
      return this.nextPagesArray.reduce((acc, page) => {
        return [...acc, ...page.media.filter(x => /(gif|png)$/i.test(x))]
      }, []).map(this.$getResourceURL)
    },
    pixelated() {
      return this.$localData.settings.pixelScaling
    },
    scratchIntermission() {
      return this.thisPage.theme == 'scratch'
    },
    supercartridge() {
      return this.thisPage.flag.includes('S')
    },
    hscroll() {
      return this.thisPage.flag.includes('HSCROLL')
    },
    fireflies() {
      return this.thisPage.flag.includes('FIREFLY')
    },
    hideNav(){
      return this.thisPage.flag.includes('SWFNAV')
    },
    footerBanner() {
      switch (this.$root.tabTheme.rendered) {
        case 'scratch':
          return 'customScratchFooter.png'
        case 'sbahj':
          return 'mspalogo_sbahj.jpg'
        case 'trickster':
          return 'trickster_sitegraphics/bannerframe2.gif'
        case 'A6A6':
          return 'a6a6_bannerframe.png'
        default:
          return 'bannerframe.png'
      }
    }
  },
  methods: {
    deretcon(media) {
      // TODO: Refactor retcon resource reservations
      if (
      (this.thisPage.flag.includes('R1') && !this.$shouldRetcon('retcon1')) ||
      (this.thisPage.flag.includes('R2') && !this.$shouldRetcon('retcon2')) ||
      (this.thisPage.flag.includes('R3') && !this.$shouldRetcon('retcon3')) ||
      (this.thisPage.flag.includes('R4') && !this.$shouldRetcon('retcon4')) ||
      (this.thisPage.flag.includes('R5') && !this.$shouldRetcon('retcon5')) ){
          for (let i in media) {
            media[i] = media[i]
            .replace(/1([0-9]{4})\/1[0-9]{4}\.swf/g, "0$1/0$1.swf")
            .replace(/_?retcon(heir)?/, "")
            // if (media[i] != this.thisPage.media[i]) {
            //   console.log(`DERETCONNING: ${this.thisPage.media[i]} ==> ${media[i]}`)
            // }
          }
      }
      return media
    },
    keyNavEvent(dir) {
      // If navigation is hidden, abort now (unless force is on)
      if (this.hideNav && !this.$archive.tweaks.forceKeyboardEnable)
        return

      if (dir == 'left' && 'previous' in this.thisPage) 
        this.$pushURL(this.$refs.pageNav.backUrl)
      else if (dir == 'right') {
        if (this.thisPage.flag.includes("R6") && this.nextPagesArray.length == 2) this.$pushURL(this.$refs.pageNav.nextUrl(this.nextPagesArray[1]))
        else if (this.nextPagesArray.length == 1) this.$pushURL(this.$refs.pageNav.nextUrl(this.nextPagesArray[0]))
      }
    }
  },
  updated() {
    if (this.hscroll) this.$refs.media.scrollLeft = 0
  }
}
</script>

<style scoped lang="scss">
  .pixelated::v-deep img{
    image-rendering: pixelated;
  }

  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex: 1 0 auto;
    flex-flow: column;
    align-items: center;

    > img {
      align-self: center;
    }

    &.supercartridge {
      .pageFrame {
        padding-top: 0;
        .pageContent {
          max-width: 650px;
        }
      }
    }

    &.hscroll {
      .pageFrame, .navBanner {
        width: 1200px !important;

        .pageContent {
          max-width: 1100px;

          .media {
            align-items: flex-start !important;
            overflow-x: scroll;
            width: 1100px;  

            &:after{
              content: url(assets://scraps2/hscrollarrow.gif);
            }
          }   
        }
      }
    }

    &.scratchIntermission {
      .navBanner {
        width: 940px;
      }
      .pageFrame {
        width: 940px;
      }
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;
      position: relative; // Allow things to align to the page

      flex: 0 1 auto;
      display: flex;
      justify-content: center;

      .pageContent {
        background: var(--page-pageContent);

        max-width: 950px;
        min-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .footnotesContainer {
          width: 100%;
        }

        .mediaContent {
          display: flex;
          align-items: center;
          flex-flow: column;

          h2.pageTitle {
            max-width: 590px;
            text-align: center;
            line-height: 1.1;
            font-size: 32px;
            padding: 15px 0;
          }

          .media{
            display: flex;
            align-items: center;
            flex-flow: column;

            .panel {
              &:not(:last-child) {
                margin-bottom: 17px;
              }
            }            
          }
        }

        .textContent{
          margin-top: 30px;
          width: 600px;
          display: flex;
          flex-direction: column;
          
        }
      }
    }
  }
</style>
