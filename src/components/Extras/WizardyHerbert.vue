<template>
  <div class="pageBody customStyles" :class="{pixelated: $localData.settings.pixelScaling}">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <VuePdfEmbed
          ref="pdfRef"
          class="pdfmargin vue-pdf-embed"
          :source="url"
          :page="page_num"
          :scale="2"
          @rendered="handleDocumentRender"
          :disableAnnotationLayer="true"
          :width="width"
          :style="{width}"
        />

        <div class="comicNav">
          <a v-if="prev_page_url" :href="prev_page_url" class="goBack"><MediaEmbed url="/sweetbroandhellajeff/back.jpg" /></a>
          <a v-if="next_page_url" :href="next_page_url" class="nextArrowLink"><MediaEmbed url="/sweetbroandhellajeff/next.jpg" /></a>
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

// import Resources from '@/resources.js'

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
    return 'default'
  },
  title(ctx) {
    if (ctx.routeParams.p)
      return `Wizardy Herbert ${ctx.routeParams.p}`
    return 'Wizardy Herbert'
  },
  data () {
    return {
      url: 'assets://archive/wizardyherbert/WH.pdf',
      width: 950,
      max_pages: 1
    }
  },
  methods: {
    handleDocumentRender() {
      this.max_pages = this.$refs.pdfRef.pageCount
    },
    keyNavEvent(dir) {
      if (dir == 'left' && this.prev_page_url)
        this.$pushURL(this.prev_page_url)
      else if (dir == 'right' && this.next_page_url)
        this.$pushURL(this.next_page_url)
    },
  },
  computed: {
    page_num() {
      return Number.parseInt(this.routeParams.p) || 1
    },
    prev_page_url() {
      if (this.page_num > 1)
        return `/${this.routeParams.base}/${Math.max(1, this.page_num - 1)}`
      return undefined
    },
    next_page_url() {
      if (this.page_num < this.max_pages)
        return `/${this.routeParams.base}/${Math.min(this.page_num + 1, this.max_pages)}`
      return undefined
    }
  }
}
</script>

<style scoped lang="scss">
  .pixelated::v-deep img{
    image-rendering: pixelated;
  }

  .pdfmargin {
    clip-path: inset(100px);
    margin: -100px;
  }

  ::v-deep .vue-pdf-embed > div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
    // * {
    //   transform: none !important;
    // }
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

