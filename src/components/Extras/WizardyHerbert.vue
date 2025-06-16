<template>
  <GenericPage>
    <a :href="url_browse_index" v-text="url_browse" class="book-srclink-header" />

    <div class="note" v-if="page_num == undefined">
      <p>
        Wizardy Herbert, as presented here, is an unfinished book draft of Andrew Hussie's, last revised July 2008.
        The draft was accidently published to an open server and leaked <a href="https://web.archive.org/web/20160224201321/http://mspaforums.com/showthread.php?52179">on the mspa forums in 2012</a>.
      </p>
      <p>
        Themes from Wizardy Herbert heavily influenced the story, structure, and themes of Homestuck. Additionally, some characters were directly borrowed for Rose's <i>Complacency of the Learned</i> and Roxy's <i>Wizardy Herbert</i> (Herbert, Beatrix, Russet). Sketches of the characters also feature on the walls of Rose's room.
      </p>
      <p>Andrew directly discusses some of this in a <a href="/formspring/question159268867502284664">Feb 2011 Formspring answer</a>.</p>
      <MediaEmbed url="assets://archive/wizardyherbert/herbertsketch2_sm.jpg" />
      <p>
        Note from Gio: <span class="gio">The version of Wizardy Herbert contained in Asset Pack V2 is broken up somewhat awkwardly. I would love to fix this in a future version of the pack, but we're trying to put that off as long as possible, because it's a big download and it makes it a pain for people to upgrade. For now you can use this in-app viewer or <a :href="url_browse_index" class="book-srclink-header">use one of the other formats provided in the asset pack.</a></span>
      </p>
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

    <!-- <div class="comicNav">
      <a :style="{visibility: (prev_page_url ? 'visible' : 'hidden')}" :href="prev_page_url" class="goBack" >
        <MediaEmbed url="assets://images/msoffice_prev.png" />
      </a>
      <a :style="{visibility: (next_page_url ? 'visible' : 'hidden')}" :href="next_page_url" class="nextArrowLink">
        <MediaEmbed url="assets://images/msoffice_next.png" />
      </a>
    </div> -->
    <div class="comicNav">
      <a :style="{visibility: (prev_page_url ? 'visible' : 'hidden')}" :href="prev_page_url" class="goBack" >
        <MediaEmbed url="assets://images/msoffice_prev.png" />
        <span>Prev</span>
      </a>
      <a :style="{visibility: (next_page_url ? 'visible' : 'hidden')}" :href="next_page_url" class="nextArrowLink">
        <span>Next</span>
        <MediaEmbed url="assets://images/msoffice_next.png" />
      </a>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/Template/GenericPage.vue'
import PageFooter from '@/components/StoryPage/PageFooter.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

// import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

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
    GenericPage, MediaEmbed,
    // VuePdfEmbed
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
      url_browse_index: 'assets://archive/wizardyherbert/index.html',
      max_pages: 209,
      min_page: 1,
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
      this.rendition.display(spine_num - 1)
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
    this.book = ePub(this.$getResourceURL(this.url_epub))

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
          if (this.page_num >= this.min_page) this.display(this.page_num)
        });
      });
    })
  },
  watch: {
    'page_num': function (to, from) {
      if (to >= this.min_page) this.display(to)
    }
  }
}
</script>

<style scoped lang="scss">
  #viewer {
    padding: 3em 0;
    width: 900px;
    overflow: hidden;
  }
  .comicNav {
    a {
      cursor: pointer;
      span {
        font-size: 22px;
        vertical-align: super;
      }
    }
    width: -webkit-fill-available;
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
    background: #BFDBFF;
    border-top: 1px solid black;
  }
  .note {
    padding: 2em 110px;
    font-family: sans-serif;
    font-weight: normal;
    p {
      margin: revert;
    }
    .gio {
      color: #aa0001;
    }
  }
</style>

