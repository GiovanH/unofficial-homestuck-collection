<template>
  <div class="pageBody">
    <div class="editor">
      <div class="linked" v-if="bboxes"
       :style="{height: bboxes.textContent.top + bboxes.textContent.height + scroll + 'px'}">
        <div :style="{marginTop: bboxes.pageTitle.top + 'px'}">
          <input v-model="livePage.title" class="title" />
        </div>
        <div :style="{marginTop: bboxes.media.top + 'px'}">
          <input v-model="editMedia" />
        </div>
        <div :style="{marginTop: bboxes.textContent.top + 'px', height: bboxes.textContent.height + 'px'}">
          <textarea class="textContent" v-model="editContent" />
        </div>
      </div>
      <div class="meta">
        <p>Next Page(s): <input v-model="editNext" /></p>
        <p>Flags: <input v-model="editFlag" /></p>
      </div>
      <p>JSON output:</p>
      <pre class="code" v-text="jsonDump" />
    </div>
    <div class="page">
      <LivePage ref="LivePage"
        :thisPage="livePage" @update="reloadBboxes" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VanillaPage from '@/components/Page/Page.vue'

const LivePage = {
  ...VanillaPage,
  name: 'LivePage',
  emits: ['update', ...(VanillaPage.emits || [])],
  data() {
    return {
      ...VanillaPage.data(),
      tab: {},
      routeParams: {}
    }
  },
  props: ['thisPage'],
  computed: {
    ...VanillaPage.computed,
    isRyanquest(){ return false },
    pageNum() { return undefined },
    pageCollection() { return this.$archive.mspa['story'] }
  },
  updated() {
    this.$nextTick(() => {
      this.$emit('update')
    })
  }
}
delete LivePage.computed.thisPage

function listEditor(prop) {
  return {
    get() {return this.livePage[prop].join(",")},
    set(newValue) {this.livePage[prop] = newValue ? newValue.split(",") : []}
  }
}

export default {
  name: 'PageEditor',
  data: function() {
    return {
      scroll: 0,
      bboxes: undefined,
      livePage: window.vm.$archive.mspa.story['001904']
    }
  },
  props: [
    'tab', 'routeParams'
  ],
  components: {LivePage},
  theme: function(ctx) {
    const args = {} // urlToArgObj(ctx.tab.url)
    return args.th || 'default'
  },
  title: function(ctx) {
    const args = {} // urlToArgObj(ctx.tab.url)
    return args.c || 'SinglePage'
  },
  methods: {
    handleScroll () {
      // this.$logger.info("scrolled", this.tabFrame.scrollTop)
      this.scroll = this.tabFrame.scrollTop
      this.$nextTick(() => {
        setTimeout(this.reloadBboxes(), 100)
      })
    },
    reloadBboxes(){
      this.$logger.info("reloadBboxes")
      if (!this.$refs.LivePage) {
        this.$logger.warn("Deferring height reload")
        this.$nextTick(() => {
          setTimeout(this.reloadBboxes(), 100)
        })
      } else {
        const liverefs = this.$refs.LivePage.$refs
        this.bboxes = {
          pageTitle: liverefs.pageTitle.getBoundingClientRect(),
          media: liverefs.media.getBoundingClientRect(),
          textContent: liverefs.textContent.$el.getBoundingClientRect(),
          pageNav: liverefs.pageNav.$el.getBoundingClientRect()
        }
        // this.$logger.info(this.bboxes.textContent)
      }
    }
  },
  computed: {
    editContent: {
      get() {return this.livePage.content.replace(/<br \/>/g, "\n")},
      set(newValue) {this.livePage.content = newValue.replace(/\n/g, "<br />")}
    },
    editNext: listEditor('next'),
    editMedia: listEditor('media'),
    editFlag: listEditor('flag'),
    tabFrame(){
      return this.$root.app.$refs[this.tab.key][0].$el
    },
    jsonDump(){
      return JSON.stringify(this.livePage, undefined, 2)
    }
  },
  watch: {
    'scroll'(to, from) {
      this.$logger.info("scrolled", to)
      this.reloadBboxes()
    }
  },
  created () {
    this.$logger.info("Created")
    this.$nextTick(() => {
      this.tabFrame.addEventListener('scroll', this.handleScroll)
      this.reloadBboxes()
    })
  },
  destroyed () {
    this.tabFrame.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    display: flex;
    justify-content: center;
  }
  .editor {
    // margin-top: calc(var(--headerHeight) + 17px);
    width: 650px;
    padding: 0 25px;
    position: relative;
    border-top: solid black 17px;
    // margin-bottom: 110px;

    text-align: center;
    background: var(--page-pageContent);

    .linked {
      margin-top: calc(var(--headerHeight) * -1 - 17px);
      // position: fixed;
      padding-bottom: 2em;
      > div {
        position: fixed;
        width: inherit;
      }
    }

    div {
      width: inherit;
      min-height: 1em;
    }
    .title {
      line-height: 1.1;
      font-size: 32px;
    }
    textarea {
      width: 100%;
      &.textContent {
        resize: none;
        height: 100%; /* inside a div */
        font-size: 1em;
        line-height: 1.15;
        font-weight: bold;
      }

    }
    .code {
      text-align: left;
      background: white;
      resize: auto;
      white-space: pre-wrap;
      height: auto;
    }
  }
  ::v-deep .page {
    flex-grow: 1;
    .pageFrame {
      max-width: 950px;
      width: auto;
    }

    .navBanner {
      max-width: 950px;
      width: auto;
    }

    .pageBody {
      max-width: 950px;
      width: auto;
    }

    .footer {
      display: none;
    }
  }
</style>