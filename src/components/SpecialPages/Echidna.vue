<template>
  <div class="pageBody echidna">
    <div class="pageFrame">
      <div class="pageContent">
          <Media url="/storyfiles/hs2/echidna/echidna.swf" />
          <div class="mediaContent">
              <Media :url="thisPage.media[0]" class="hscroll" />
          </div>      
          <div class="textContent">
              <FlashCredit  :pageId="thisPage.pageId" />
              <PageNav baseURL="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav"/>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'

export default {
  name: 'echidna',
  props: [
    'tab', 'routeParams'
  ],
  components: {
     Media, PageNav, FlashCredit
  },
  data: function() {
    return {
    }
  },
  computed: {
    thisPage() {
      return {
        ...this.$archive.mspa.story['009535'],
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
    keyNavEvent(dir) {
      if (dir == 'left' && 'previous' in this.thisPage && this.$parent.$el.scrollLeft == 0) this.$pushURL(this.$refs.pageNav.backUrl)
      else if (dir == 'right' && this.nextPagesArray.length == 1 && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth) this.$pushURL(this.$refs.pageNav.nextUrl(this.nextPagesArray[0]))
    }
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
    background: #000;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .pageFrame {
    width: 1200px;
    padding-top: 60px;
    margin: 0 auto;

    flex: 0 1 auto;
    display: flex;
    justify-content: center;

      .pageContent {
        max-width: 1100px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .mediaContent {
          width: 1100px; 
          display: flex;
          overflow-x: scroll;

          align-items: flex-start;
          flex-flow: column;
        }

        .textContent{
          margin-top: 30px;
          width: 600px;

          .creditWrapper {
            max-width: 280px;
          }
        }
      }	
    }

  }
  

</style>

