<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <a :href="url_browse + 'index.html'" v-text="url_browse" class="book-srclink-header" />
        <div id="viewer" ref="viewer"></div>

        <div class="comicNav">
          <a v-if="prev_page_url" ref="prev" :href="prev_page_url" class="goBack"><MediaEmbed url="/sweetbroandhellajeff/back.jpg" /></a>
          <a v-if="next_page_url" ref="next" :href="next_page_url" class="nextArrowLink"><MediaEmbed url="/sweetbroandhellajeff/next.jpg" /></a>
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
      book: undefined
    }
  },
  methods: {
    keyNavEvent(dir) {
      if (dir == 'left' && this.prev_page_url)
        this.$pushURL(this.prev_page_url)
      else if (dir == 'right' && this.next_page_url)
        this.$pushURL(this.next_page_url)
    },
  },
  computed: {
    page_num() {
      return Number.parseInt(this.routeParams.p)
    },
    prev_page_url() {
      if (this.page_num > this.min_page)
        return `/${this.routeParams.base}/${Math.max(this.min_page, this.page_num - 1)}`
      return undefined
    },
    next_page_url() {
      if (this.page_num < this.max_pages)
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
        this.renderer = renderer
        this.max_pages = this.book.spine.spineItems.length

        this.rendition.display(this.page_num)
      });
    })

  },
  watch: {
    'page_num': function (to, from) {
      this.rendition.display(to)
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
  }

  .comicNav {
    a {
      cursor: pointer;
    }
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
      }
    }
  }
</style>

