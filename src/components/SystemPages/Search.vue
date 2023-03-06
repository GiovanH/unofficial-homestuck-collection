<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <div class="search">
          <h1>Search:</h1>
          <div class="searchBox">
            <input ref="input" class="searchInput" type="text" spellcheck="false" @keydown.enter="query = inputText" v-model="inputText" />
            <button class="searchButton" @click="query = inputText"><fa-icon icon="search"></fa-icon></button>
          </div>
          <div class="results" ref="markup">
            <div v-if="freshStart"><p>First search may take a few seconds!</p></div>
            <div v-else-if="results.length < 1" class="result noResult">
              <h2>No results found.</h2>
            </div>
            <div class="result" v-else>
              <p>Searching for "<span v-text="lastSearch.input" />" sorting by <span v-text="sortDictionary[lastSearch.sort] || lastSearch.sort" /></p>
              <!--  in {{lastSearch.filter}} -->
              <h2>{{results.length == 1000 ? '999+' : results.length}} results.</h2>
            </div>
            <div v-for="(page, i) in results" :key="page.key" class="result">
              <h2>
                <StoryPageLink titleOnly :mspaId='page.mspa_num'></StoryPageLink>
              </h2>
              <div class="chapter" v-html="`${$getChapter(page.mspa_num)} - ${$mspaOrVizNumber(page.mspa_num)}`" />
              <div class="match">
                <!-- <p v-for="(line, i) in page.lines" :key="'line'+i"  v-html="line" class="line" /> -->
                <PageText startopen="true" :content="page.lines.join('<br />')" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import PageText from '@/components/Page/PageText.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

// import FlexSearch from 'flexsearch'
const { ipcRenderer } = require('electron')
const Mark = require('../../../node_modules/mark.js/dist/mark.js')

export default {
  name: 'search',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageFooter, StoryPageLink, PageText
  },
  title: () => "Search",
  data: function() {
    return {
      results: [],
      freshStart: true,
      inputText: '',
      lastSearch: {},
      mark: undefined,
      sortDictionary: {
        "rel": "relevance",
        "asc": "date, ascending",
        "desc": "date, descending"
      },
      markOpts: {
        "separateWordSearch": true,
        "diacritics": true,
        "ignoreJoiners": true,
        "acrossElements": true,
        "iframes": true,
        "className": 'highlight'
      }
    }
  },
  computed: {
    query: {
      get() {
        return this.routeParams.query ? decodeURIComponent(this.routeParams.query) || '' : ''
      },
      set(newQuery) {
        this.$root.app.$pushURL(`/search/${encodeURIComponent(newQuery)}`)
      }
    }
  },
  mounted(){
    this.$nextTick(() => {
      console.log(this.$refs)
      console.assert(this.$refs.markup)
      this.mark = new Mark(this.$refs.markup)
    })
    if (this.query) {
      this.inputText = this.query
      this.search()
    }
  },
  methods: {
    invokeSearch(params){
      return ipcRenderer.invoke('search', params)
    },
    async search() {
      let input = this.query // this.inputText
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/-/g, "&#45;")
        .replace(/=/g, "&#61;")
        .replace(/\[/g, "&#91;")
        .replace(/\]/g, "&#93;")

      let sort = 'rel'
      let chapter = ''

      const ops = input.match(/(sort|order|in):((&quot;(.+)&quot;)|(\w+))/gi) || []
      for (let i = 0; i < ops.length; i++) {
        const [setting, value] = ops[i].toUpperCase().split(':')
        input = input.replace(ops[i], '')

        if (setting == 'SORT' || setting == 'ORDER') {
          if (value == 'ASC' || value == 'ASCENDING') sort = 'asc'
          if (value == 'DESC' || value == 'DESCENDING') sort = 'desc'
        }
        else if (setting == 'IN') {
          // TODO: Now that chapters are strings, rewrite this
          // if (value in this.chapters)
          if (chapter) {
            logger.warn("Can only have one selected IN: chapter. ")
          }
          chapter = value.replace(/&quot;/gi, '')
        }
      }
      input = input.trim()

      const searchPayload = {input, sort, chapter}

      this.lastSearch = searchPayload

      this.$logger.info(input, searchPayload)
      this.invokeSearch(searchPayload).then(results => {
        this.results = this.$isNewReader ? results.filter(result => !this.$pageIsSpoiler(result.mspa_num)) : results
        this.onSearchDone()
      })
    },
    onSearchDone(){
      this.freshStart = false
      this.$nextTick(() => {
        this.$refs.input.blur()
        this.$nextTick(() => {
          this.$refs.input.focus()
          this.mark.unmark().mark(this.lastSearch.input, this.markOpts)
        })
      })
    }
  },
  watch: {
    query(to, from){
      if (to) {
        this.inputText = to
        this.search()
      }
    }
  }
}

</script>

<style scoped lang="scss">
.pageBody {
  color: var(--font-default);
  background: var(--page-pageBody);

  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column;
  flex: 1 0 auto;
  align-items: center;

  > img {
    align-self: center;
  }

  .pageFrame {
    background: var(--page-pageFrame);

    width: 950px;
    padding-top: 7px;
    padding-bottom: 23px;
    margin: 0 auto;

    flex: 0 1 auto;
    display: flex;
    justify-content: center;

    ::v-deep a:not([disabled]) {
      color: var(--page-links);
    }

    .pageContent {
      background: var(--page-pageContent);

      width: 650px;
      display: flex;
      flex: 0 1 auto;
      align-items: center;
      flex-flow: column;
      text-align: center;

      h1 {
        margin-top: 20px;
      }
      
      a {
        color: var(--page-links);
      }

      ::v-deep .highlight {
        background: var(--find--highlight);
        color: var(--font-highlight, var(--font-default));
      }

      .searchBox {
        position: relative;
        margin: 0 auto;
        width: 450px;

        .searchInput {
          margin-top: 5px;
          font-size: 20px;
          width: 100%;
        }
        .searchButton {
          position: absolute;
          background: none;
          font-size: 20px;
          display: block;
          border: none;
          height: 29px;
          right: -8px;
          top: 5px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .results {
        margin: 25px 0;
        width: 600px;

        .result {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--page-pageBorder, var(--page-pageFrame));

          &.noResult {
            padding-top: 20px;
          }

          .chapter {
            margin-top: 5px;
            font-size: 16px;
            // font-weight: normal;
          }

          ::v-deep .match {
            padding-top: 10px;

            &:before {
              border-top: 1px dashed var(--page-pageBorder, var(--page-pageFrame));
              padding-top: 10px;
              margin: 0 auto;
              display: block;
              width: 400px;
              content: '';
            }
          }
        }
      }
    }	
  }
}


</style>

