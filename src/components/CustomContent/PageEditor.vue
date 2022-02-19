<template>
  <div class="pageBody">
    <div class="editor">
      <template v-if="bboxes">
        <div :style="{top: bboxes.pageTitle.top + 'px'}">
          <input v-model="livePage.title" />
        </div>
        <div :style="{top: bboxes.media.top + 'px'}">
          <input v-model="livePage.media[0]" />
        </div>
        <div :style="{top: bboxes.textContent.top + 'px', height: bboxes.textContent.height + 'px'}">
          <textarea v-model="livePage.content" />
        </div>
        <div :style="{top: bboxes.pageNav.top + 'px'}">
          <input v-model="livePage.next" />
        </div>
      </template>
      <div>
        <img src="assets://images/candycorn.gif" @click="reloadBboxes"/>

      </div>
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
    this.$emit('update')
  }
}
delete LivePage.computed.thisPage
const nop = () => null
// LivePage.updated = function(){ (VanillaPage.updated || nop)(); this.$nextTick(() => this.$emit('update')); }
LivePage.created = function(){ (VanillaPage.created || nop)(); this.$nextTick(() => this.$emit('update')); }

export default {
  name: 'PageEditor',
  data: function() {
    return {
      scroll: 0,
      bboxes: undefined,
      livePage: vm.$archive.mspa.story['001904']
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
      this.$logger.info("scrolled", this.tabFrame.scrollTop)
      this.scroll = this.tabFrame.scrollTop
    },
    reloadBboxes(){
      if (!this.$refs.LivePage) {
        this.$logger.warn("Deferring height reload")
        this.$nextTick(() => {
          this.reloadBboxes()
        })
      } else {
        const liverefs = this.$refs.LivePage.$refs
        this.bboxes = {
          pageTitle: liverefs.pageTitle.getBoundingClientRect(),
          media: liverefs.media.getBoundingClientRect(),
          textContent: liverefs.textContent.getBoundingClientRect(),
          pageNav: liverefs.pageNav.$el.getBoundingClientRect()
        }
        this.$logger.info(this.bboxes)
      }
    }
  },
  computed: {
    tabFrame(){
      return this.$root.app.$refs[this.tab.key][0].$el
    }
  },
  watch: {
    'scroll'(to, from) {
      this.reloadBboxes()
    }
  },
  created () {
    this.$logger.info("Created")
    this.$nextTick(() => {
      this.tabFrame.addEventListener('scroll', this.handleScroll)
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
    width: 650px;
    padding: 25px;
    position: relative;
    top: calc(var(--headerHeight) * -1);

    text-align: center;

    > div {
      position: fixed;
      width: inherit;
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
      }
    }
  }
</style>