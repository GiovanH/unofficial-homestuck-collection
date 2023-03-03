<template>
  <div class="pageBody customStyles">
    <Banner :id="tab.key" :page="thisPages[0]"/>
    <div class="navBanners">
      <NavBanner class="leftNavBanner" useCustomStyles="true" />
      <div class="navSpacer" />
      <NavBanner class="rightNavBanner" useCustomStyles="true" />
    </div>
    <div class="pageFrame">
      <Metadata v-if="showMetadata" :thisPage="thisPages[0]" />
      <div class="pageContent leftPage">
        <Footnotes :pageId="thisPages[0].pageId" preface />
          <div class="mediaContent">
              <h2 class="pageTitle" v-text="thisPages[0].title" />
              <div class="media">
                  <Media v-for="url in pageMedia[0]" :key="url" :url="url" class="panel"/>
              </div>
          </div>      
          <div class="textContent">
              <TextContent :key="thisPages[0].pageId" :content="thisPages[0].content" ref="textcontent1"/>
              <PageNav :thisPage="thisPages[0]" :nextPages="nextPagesArray[0]" ref="pageNav1"/>
          </div>
        <Footnotes :pageId="thisPages[0].pageId" />
      </div>
      <div class="pageContent rightPage">
        <Footnotes :pageId="thisPages[1].pageId" preface />
          <div class="mediaContent">
              <h2 class="pageTitle" v-html="thisPages[1].title" />
              <div class="media">
                  <Media v-for="url in pageMedia[1]" :key="url" :url="url" class="panel"/>
              </div>
          </div>      
          <div class="textContent">
              <TextContent :key="thisPages[1].pageId" :content="thisPages[1].content" ref="textcontent2"/>
              <PageNav :thisPage="thisPages[1]" :nextPages="nextPagesArray[1]" ref="pageNav2"/>
          </div>
        <Footnotes :pageId="thisPages[1].pageId" />
      </div>
    </div>
    <PageFooter pageWidth="1660px" />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Banner from '@/components/Page/PageBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import TextContent from '@/components/Page/PageText.vue'
import PageNav from '@/components/SpecialPages/x2ComboNav.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import Footnotes from '@/components/Page/PageFootnotes.vue'
import Metadata from '@/components/Page/PageMetadata.vue'

import PAGE from '@/components/Page/Page.vue'

export default {
  name: 'x2Combo',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Banner, Media, TextContent, PageNav, PageFooter, Footnotes, Metadata
  },
  data: function() {
    return {
      ...PAGE.data()
    }
  },
  theme: PAGE.theme,
  title: PAGE.title,
  computed: {
    pageNum: PAGE.computed.pageNum,  // Page number of one of the two pages (usually the left one)
    storyId: PAGE.computed.storyId,
    isRyanquest: PAGE.computed.isRyanquest,
    pageCollection: PAGE.computed.pageCollection,
    thisPage: PAGE.computed.thisPage,
    thisPages() {
      let thisPageId = this.pageNum
      let leftPageId, rightPageId
      if (parseInt(thisPageId) % 2 == 0) {
        leftPageId = thisPageId
        rightPageId = this.$archive.mspa.story[thisPageId].next[0]
      } else {
        leftPageId = this.$archive.mspa.story[thisPageId].previous
        rightPageId = thisPageId
      }

      return [
        {
          ...this.$archive.mspa.story[leftPageId],
          storyId: this.storyId,
          isRyanquest: this.isRyanquest
        },
        {
          ...this.$archive.mspa.story[rightPageId],
          storyId: this.storyId,
          isRyanquest: this.isRyanquest
        }
      ]
    },
    pageMedia() {
      // TODO: This doesn't seem to be used anywhere or do anything.
      // Also it's a side-effect in a computed statement for no good reason.
      this.preload = []
      let preloadPages = [
        this.nextPagesArray[1][0],
        this.$archive.mspa.story[this.nextPagesArray[1][0].next[0]]
      ]
      preloadPages.forEach(page => {
        page.media.forEach(media => {
          if (/(gif|png)$/i.test(media)) {
            let img = new Image()
            img.src = this.$getResourceURL(media)
            this.preload.push(img)
          }
        })
      })

      var media1 = Array.from(this.thisPages[0].media)
      var media2 = Array.from(this.thisPages[1].media)
      this.deretcon(media1)
      this.deretcon(media2)

      return [media1, media2]
    },
    nextPagesArray() {
      this.$logger.info(`${this.tab.url} - ${this.thisPages[1].title}`)
      let nextPages = [[], []]
      this.thisPages[0].next.forEach(nextID => {
        nextPages[0].push(this.$archive.mspa.story[nextID])
      })
      this.thisPages[1].next.forEach(nextID => {
        nextPages[1].push(this.$archive.mspa.story[nextID])
      })
      return nextPages
    }
  },
  methods: {
    deretcon: PAGE.methods.deretcon,
    keyNavEvent(dir) {
      if (dir == 'left') 
        this.$pushURL(this.$refs.pageNav1.backUrl)
      else if (dir == 'right') 
        this.$pushURL(this.$refs.pageNav2.nextUrl(this.nextPagesArray[1][0]))
    },
    spaceBarEvent(e) {
      if (this.$refs.textcontent1) {
        this.$refs.textcontent1.open()
      }
      if (this.$refs.textcontent2) {
        this.$refs.textcontent2.open()
      }
    }
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
  
  margin: 0 auto;

  > img {
    align-self: center;
  }

  .navBanners{
    width: 1660px;
    display: flex;
    flex-flow: row;
    justify-content: center;
    background: var(--nav-bg);
    .navSpacer {
      padding: 0 50px;
    }
    ::v-deep nav {
      width: auto;
    }
  }
  .pageFrame {
    background: var(--page-pageFrame);

    padding-top: 7px;
    padding-bottom: 23px;
    width: 1660px !important;

    flex: 0 1 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .pageContent {
      background: var(--page-pageContent);
      
      max-width: 950px;
      display: flex;
      flex: 0 1 auto;
      align-items: center;
      flex-flow: column;
      &.leftPage {
        margin-right: 30px;
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

