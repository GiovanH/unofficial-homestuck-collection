<template>
  <div class="pageBody">
    <div class="editor">
      <div>
        <img src="assets://images/candycorn.gif" @click="reloadBboxes"/>

      </div>
      <template v-if="bboxes">
        <div :style="{top: bboxes.pageTitle.top + 'px'}">
          <img src="assets://images/candycorn.gif"/>
          <input v-model="livePage.title" />
        </div>
        <div :style="{top: bboxes.media.top + 'px'}">
          <img src="assets://images/candycorn.gif"/>
          <input v-model="livePage.media[0]" />
        </div>
        <div :style="`top: ${bboxes.textContent.top + 'px'}`">
          <img src="assets://images/candycorn.gif" />
          <textarea v-model="livePage.content" />
        </div>
        <div :style="`top: ${bboxes.pageNav.top + 'px'}`" >
          <img src="assets://images/candycorn.gif"/>
          <input v-model="livePage.next" />
        </div>
      </template>
    </div>
    <div class="page">
      <LivePage ref="LivePage" :thisPage="livePage" @update="reloadBboxes" />
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
  }
}
delete LivePage.computed.thisPage
const nop = () => null
LivePage.updated = function(){ (VanillaPage.updated || nop)(); this.$nextTick(() => this.$emit('update')); }
LivePage.created = function(){ (VanillaPage.created || nop)(); this.$nextTick(() => this.$emit('update')); }

export default {
  name: 'PageEditor',
  data: function() {
    return {
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
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    display: flex;
    justify-content: center;
  }
  .editor {
    position: relative;
    top: calc(var(--headerHeight) * -1);

    > div {
      position: relative;
    }
  }
</style>