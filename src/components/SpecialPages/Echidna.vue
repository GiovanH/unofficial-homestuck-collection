<template>
  <div class="pageBody echidna" :data-pageid="`${storyNum}/${thisPage.pageId}`">
    <div class="pageFrame">
      <div class="pageContent">
        <div 
          :class="note.class ? 'preface ' + note.class : 'preface'"
          v-for="note in prefaces">
          <p v-html="note.content"/>
          <span v-if="note.author" class="author" v-text="note.author" />
        </div>
          <Media url="/storyfiles/hs2/echidna/echidna.swf" />
          <div class="mediaContent">
              <Media :url="thisPage.media[0]" class="hscroll" />
          </div>      
          <div class="textContent">
              <FlashCredit  :pageId="thisPage.pageId" />
              <PageNav baseURL="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav"/>
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
    footnotes() {
      return (this.$archive.footnotes['story'][this.pageNum] || []).filter(n => !n.preface)
    },
    prefaces() {
      return (this.$archive.footnotes['story'][this.pageNum] || []).filter(n => n.preface)
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

