<template>
  <div class="pageBody">
    <div class="split">
      <div class="editor">
        <div class="linked" v-if="bboxes"
         :style="{height: bboxes.textContent.top + bboxes.textContent.height + scroll + 'px'}">
          <div class="title" :style="{marginTop: bboxes.pageTitle.top + 'px'}">
            <input v-model="livePage.title"/>
            <p class="hint">Both the page title and text of links to this page</p>
          </div>
          <div class="media" :style="{marginTop: bboxes.media.top + 'px', height: bboxes.media.height + 'px'}">
            <textarea v-model="editMedia" />
            <p class="hint">One URL per line. <code>assets://</code> urls recommended.</p>
          </div>
          <div class="textContent" :style="{marginTop: bboxes.textContent.top + 'px', height: bboxes.textContent.height + 'px'}">
            <textarea v-model="editContent" />
            <p class="hint">MSPA text content. See <a href="https://github.com/GiovanH/unofficial-homestuck-collection/wiki/MSPA-Story-Format">Reference</a></p>
          </div>
        </div>
        <span class="opt">Next Page(s): <input v-model="editNext" /></span>
        <div class="meta">
          <span class="opt">Flags: <input v-model="editFlag" /></span>
          <span class="opt">Theme:
            <select class="themeSelector" v-model="livePage.theme" >
              <option v-for="theme in themes" :value="theme.value" :key="theme.value">
                {{ theme.text }}
              </option>
            </select>
          </span>
        </div>
      </div>
      <div class="page">
        <LivePage ref="LivePage"
          :thisPage="livePage" @update="reloadBboxes()" />
      </div>
    </div>
    <div class="under">
      <div class="section">
        <p>JSON output:</p>
        <pre class="code" v-text="jsonDump" @click="selectText" />
        <p><a :href="singlepageLink">Singlepage Link</a></p>
        <!-- <pre class="code" v-text="singlepageLink" @click="selectText" /> -->
        <span>
          <label>
            <input type="checkbox" v-model="jsonPatchMode" />
            Patch mode
          </label>
        </span>
      </div>
      <div class="section">
        <span>
          Load page:
          <input style="width: 6em;" v-model="pginput"
            @keydown.enter="livePage = {...$archive.mspa.story[pginput]}" />
          <Button @click="livePage = {...$archive.mspa.story[pginput]}">
            <StoryPageLink titleOnly :mspaId='pginput' style="pointer-events: none; color: black;"/>
          </Button>
        </span>
<!--         <span>
          <MspaPageSelector promptMspaMode
           :handleChange="(pg) => {pginput = pg; livePage = {...$archive.mspa.story[pg]}}" />
        </span> -->
      </div>
    </div>
    <PageFooter pageWidth="1400px" />
  </div>
</template>

<script>
// @ is an alias to /src
import VanillaPage from '@/components/StoryPage/Page.vue'
import SinglePage from '@/components/StoryPage/SinglePage.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
import MspaPageSelector from '@/components/UIElements/MspaPageSelector.vue'
import PageFooter from '@/components/StoryPage/PageFooter.vue'
import Settings from '@/components/SystemPages/Settings.vue'

// FIXME: Vue update broke this
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
delete LivePage.computed.__file

function listEditor(prop, joiner=",") {
  return {
    get() {return this.livePage[prop].join(joiner)},
    set(newValue) {this.livePage[prop] = newValue ? newValue.split(joiner) : []}
  }
}

export default {
  name: 'PageEditor',
  data: function() {
    return {
      scroll: 0,
      pginput: "001904",
      bboxes: undefined,
      jsonPatchMode: false,
      livePage: {...window.vm.$archive.mspa.story['001904']},
      themes: Settings.data().themes
    }
  },
  props: [
    'tab', 'routeParams'
  ],
  components: {LivePage, StoryPageLink, PageFooter, MspaPageSelector},
  theme: function(ctx) {
    const theme = ctx.$refs.page && ctx.$refs.page.livePage ? ctx.$refs.page.livePage.theme : 'default'
    ctx.$logger.info("Editor current theme is ", theme)
    return theme
  },
  title: function(ctx) {
    return 'Live Editor'
  },
  methods: {
    handleScroll () {
      if (this.scroll != this.tabFrame.$el.scrollTop) {
        this.scroll = this.tabFrame.$el.scrollTop
        // this.$nextTick(() => {
        //   setTimeout(this.reloadBboxes(), 100)
        // })
      }
    },
    reloadBboxes(){
    //   setTimeout(this._reloadBboxes(), 100)
    // },
    // _reloadBboxes(){
      if (!this.$refs.LivePage) {
        this.$logger.warn("Deferring height reload")
        // this.$nextTick(() => {
        //   setTimeout(this.reloadBboxes(), 500)
        // })
      } else {
        const liverefs = this.$refs.LivePage.$refs
        // Need a fallback element in case a page renders without one of these (i.e. supercartridge)
        const fallbackElem = this.$el.querySelector("div.page")
        this.bboxes = {
          pageTitle: (liverefs.pageTitle || fallbackElem).getBoundingClientRect(),
          media: (liverefs.media || fallbackElem).getBoundingClientRect(),
          textContent: (liverefs.textContent.$el || fallbackElem).getBoundingClientRect(),
          pageNav: (liverefs.pageNav.$el || fallbackElem).getBoundingClientRect()
        }
      }
    },
    selectText(event) {
      const node = event.srcElement
      const selection = window.getSelection()
      if (selection.isCollapsed) {
        const range = document.createRange()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  },
  computed: {
    editContent: {
      get() {return this.livePage.content.replace(/<br \/>/g, "\n")},
      set(newValue) {this.livePage.content = newValue.replace(/\n/g, "<br />")}
    },
    editNext: listEditor('next'),
    editMedia: listEditor('media', '\n'),
    editFlag: listEditor('flag'),
    tabFrame(){
      return this.$root.app.$refs[this.tab.key][0]
    },
    jsonDump(){
      const pageJson = {...this.livePage}
      if (!this.jsonPatchMode) {
        return JSON.stringify(pageJson, undefined, 2)
      } else {
        const reference = this.$archive.mspa.story[this.pginput]
        for (const key in this.livePage) {
          this.$logger.info(key, pageJson[key], reference[key])
          if (JSON.stringify(pageJson[key]) == JSON.stringify(reference[key])) {
            delete pageJson[key]
          }
        }
        return pageJson
      }
    },
    singlepageLink(){
      return SinglePage.methods.makeUrl.bind({
        ...SinglePage.data()
      })(this.livePage)
    }
  },
  watch: {
    'livePage.content'(to, from){
      // Force logs open
      this.$refs.LivePage.$refs.textContent.logHidden = false
    },
    'livePage.theme'(to, from){
      if (to == 'default') {
        this.livePage.theme = undefined
      }
      this.tabFrame._computedWatchers.contentTheme.run()
      this.tabFrame._computedWatchers.theme.run()
      this.tabFrame.$forceUpdate()
    },
    'scroll'(to, from) {
      this.reloadBboxes()
    }
  },
  created () {
    this.$logger.info("Created")
    // Sometimes this doesn't "stick"? Reapply.
    delete LivePage.computed.thisPage
    delete LivePage.computed.__file
    this.$nextTick(() => {
      this.tabFrame.$el.addEventListener('scroll', this.handleScroll)
      setTimeout(this.reloadBboxes(), 2000)
    })
  },
  destroyed () {
    this.tabFrame.$el.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="scss">
  .split {
    display: flex;
    justify-content: space-evenly;
  }
  .editor {
    // Various position hacks
    width: 650px;
    position: relative;
    // margin-bottom: 110px;

    .linked {
      margin-top: calc(var(--headerHeight) * -1 - 17px);
      // position: fixed;
      padding-bottom: 2em;
      > div {
        position: fixed;
        width: inherit;
      }
    }
  }
  .editor, .under {
    border-top: solid black 17px;
    text-align: center;
    background: var(--page-pageContent);
    padding: 0 25px;
    // padding-bottom: 2em;
  }
  .under {
    max-width: 1300px;
    margin: 1em auto;
    padding-bottom: 2em;
  }
  .editor, .section {
    // Actual control styles
    color: var(--font-log);
    div {
      width: inherit;
      min-height: 1em;
    }
    p {
      margin-top: 1em;
    }
    span {
      display: block;
      &.opt {
        margin: 1em auto;
      }
    }
    textarea {
      width: 100%;
      max-width: 100%;
      resize: horizontal;
    }
    textarea, input, pre, select {
      background-color: white;
      color: black;
      // background: var(--page-log-bg);
      // color: var(--font-log);
    }
    input {
      // For some reason, setting an input's background breaks the border in weird ways.
      border-width: thin;
    }
    a { color: var(--page-links); }
    a:link:active { color: var(--page-links-active); }
    .hint {
      margin-top: 0;
      font-family: sans-serif;
      color: gray;
      font-weight: normal;
    }
    .title input {
      line-height: 1.1;
      font-size: 32px;
    }
    .media textarea,
    .textContent textarea {
      height: 100%; /* inside a div */
    }
    .textContent textarea {
      font-size: 1em;
      line-height: 1.15;
      font-weight: bold;
    }
    .code {
      margin-top: 0;
      text-align: left;
      resize: auto;
      white-space: pre-wrap;
      height: auto;
    }
    .meta {
      margin-top: 2em;
      display: flex;
      justify-content: space-between;
    }
  }
  .page {
    // flex-grow: 1;
    width: 650px;
    ::v-deep & {
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
      a:not([target]) {
        opacity: 0.4;
        pointer-events: none;
      }
    }
  }
</style>