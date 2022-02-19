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
            <p class="hint">MSPA text content. See <a href="https://github.com/Bambosh/unofficial-homestuck-collection/wiki/MSPA-Story-Format">Reference</a></p>
          </div>
        </div>
        <div class="meta">
          <span>Next Page(s): <input v-model="editNext" /></span>
          <span>Flags: <input v-model="editFlag" /></span>
          <span>Theme:
            <select class="themeSelector" v-model="livePage.theme" >
              <option v-for="theme in themes" :value="theme.value" :key="theme.value">
                {{ theme.text }}
              </option>
            </select>
          </span>
        </div>
        <p>JSON output:</p>
        <pre class="code" v-text="jsonDump" @click="selectText" />
        <span>
          Load page:
          <input style="width: 6em;" v-model="pginput"
            @keydown.enter="livePage = {...$archive.mspa.story[pginput]}" />
          <Button @click="livePage = {...$archive.mspa.story[pginput]}">
            <StoryPageLink titleOnly :mspaId='pginput' style="pointer-events: none; color: black;"/>
          </Button>
        </span>
        <span>
          <label>
            <input type="checkbox" v-model="jsonPatchMode" />
            Patch mode
          </label>
        </span>
      </div>
      <div class="page">
        <LivePage ref="LivePage"
          :thisPage="livePage" @update="reloadBboxes()" />
      </div>
    </div>
    <PageFooter pageWidth="1400px" />
  </div>
</template>

<script>
// @ is an alias to /src
import VanillaPage from '@/components/Page/Page.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import Settings from '@/components/SystemPages/Settings.vue'

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
  components: {LivePage, StoryPageLink, PageFooter},
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
    this.$nextTick(() => {
      this.tabFrame.$el.addEventListener('scroll', this.handleScroll)
      setTimeout(this.reloadBboxes(), 500)
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
    padding: 0 25px;
    position: relative;
    border-top: solid black 17px;
    padding-bottom: 2em;
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
  }
  .editor {
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
    a {
      color: var(--page-links);
    }
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