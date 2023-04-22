<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <a :href="url_browse + 'index.html'" v-text="url_browse" class="book-srclink-header" />

        <div class="note" v-if="page_num == undefined">
          <p>bambosh i know you'll want to write some hand-wringing preface thing here</p>
          <MediaEmbed url="assets://archive/wizardyherbert/herbertsketch2_sm.jpg" />
        </div>

        <div
          id="viewer"
          ref="viewer"
          :style="{
            // Because this is managed in `created`, the element must exist
            // as long as the component exists, so no v-if here.
            height: (page_num == undefined ? '1px' : 'inherit'),
            padding: (page_num == undefined ? '0' : undefined)
          }"
        />

        <div class="comicNav">
          <a :style="{visibility: (prev_page_url ? 'visible' : 'hidden')}" :href="prev_page_url" class="goBack" >
            <MediaEmbed url="assets://images/msoffice_prev.png" />
          </a>
          <a :style="{visibility: (next_page_url ? 'visible' : 'hidden')}" :href="next_page_url" class="nextArrowLink">
            <MediaEmbed url="assets://images/msoffice_next.png" />
          </a>
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

import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

import ePub from 'epubjs'

export default {
  name: 'wizardyherbert',
  mixins: [
    // Resources.UrlFilterMixin
  ],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter, VuePdfEmbed
  },
  theme(ctx) {
    return 'msword'
  },
  title(ctx) {
    if (ctx.routeParams.p)
      return `Wizardy Herbert | ${ctx.routeParams.p}`
    return 'Wizardy Herbert'
  },
  data () {
    return {
      url_epub: 'assets://archive/wizardyherbert/WH.epub',
      url_browse: 'assets://archive/wizardyherbert/',
      max_pages: 209,
      min_page: 0,
      renderer: undefined,
      rendition: undefined,
      book: undefined,
      style_override: {
        // Fix centered 0/business card
        'ul.calibre6': {
          width: 'max-content',
          margin: 'auto'
        },
        // Tight spacing around comic sans on cards
        'p.western3, ul.calibre6 li p.western, ol.calibre12 li p.western': {
          'margin-top': '0'
        },
        // Fix 1/seinfeld script
        '.calibre8': {
          'font-size': 'unset'
        }
      }
    }
  },
  methods: {
    keyNavEvent(dir) {
      if (dir == 'left' && this.prev_page_url)
        this.$pushURL(this.prev_page_url)
      else if (dir == 'right' && this.next_page_url)
        this.$pushURL(this.next_page_url)
    },
    display(spine_num){
      this.rendition.display(spine_num)
    }
  },
  computed: {
    page_num() {
      return (this.routeParams.p != undefined) ? Number.parseInt(this.routeParams.p) : undefined
    },
    prev_page_url() {
      if (this.page_num > this.min_page)
        return `/${this.routeParams.base}/${Math.max(this.min_page, this.page_num - 1)}`
      else if (this.page_num != undefined)
        return `/${this.routeParams.base}/`
    },
    next_page_url() {
      if (this.page_num == undefined)
        return `/${this.routeParams.base}/${this.min_page}`
      else if (this.page_num < this.max_pages)
        return `/${this.routeParams.base}/${Math.min(this.page_num + 1, this.max_pages)}`
      return undefined
    }
  },
  created(){
    this.book = ePub(this.url_epub)

    // Wait for refs
    this.$nextTick(() => {
      this.rendition = this.book.renderTo(this.$refs.viewer, {
        method: "default",
        flow: "scrolled-doc",
        width: 900,
      })

      this.book.ready.then((renderer) => {
        // Nab vars
        this.renderer = renderer
        this.max_pages = this.book.spine.spineItems.length

        // Display book
        this.book.opened.then(() => {
          this.rendition.themes.default(this.style_override)

          // this.$logger.info(this.renderer, this.rendition.themes)
          this.display(this.page_num)
        });
      });
    })
  },
  watch: {
    'page_num': function (to, from) {
      this.display(to)
    }
  }
}
</script>

<style scoped lang="scss">
  .pixelated::v-deep img{
    image-rendering: pixelated;
  }

  #viewer {
    padding: 3em 0;
    width: 900px;
    overflow: hidden;
  }

  .comicNav {
    a {
      cursor: pointer;
    }

    width: -webkit-fill-available;
    display: block;
    margin: 0 80px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
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

        .note {
          margin: 2em;
        }
      }
    }
  }
</style>

