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
          <div class="results">
            <div v-if="freshStart"><p>First search may take a few seconds!</p></div>
            <div v-else-if="results.length < 1" class="result noResult">
              <h2>No results found.</h2>
            </div>
            <div class="result" v-else>
              <p>Searching for "{{lastSearch.input}}" sorting by date {{lastSearch.sort}}</p>
              <!--  in {{lastSearch.filter}} -->
              <h2>{{results.length == 1000 ? '999+' : results.length}} results.</h2>
            </div>
            <div v-for="(page, i) in results" :key="page.key" class="result">
              <h2>
                <StoryPageLink titleOnly :mspaId='page.mspa_num'></StoryPageLink>
              </h2>
              <div class="chapter" v-html="`${$getChapter(page.mspa_num)} - ${$mspaOrVizNumber(page.mspa_num)}`" />
              <div class="match">
                <p v-for="(line, i) in page.lines" :key="'line'+i"  v-html="htmlEscape(line)" class="line" />
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
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

// import FlexSearch from 'flexsearch'
const { ipcRenderer } = require('electron')

export default {
  name: 'search',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageFooter, StoryPageLink
  },
  title: () => "Search",
  data: function() {
    return {
      results: [],
      freshStart: true,
      inputText: '',
      lastSearch: {}
    }
  },
  computed: {
    query: {
      get() {
        return decodeURIComponent(this.routeParams.query) || ''
      },
      set(newQuery) {
        this.$root.app.$pushURL(`/search/${encodeURIComponent(newQuery)}`)
      }
    }
  },
  mounted(){
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
      let filter = []

      this.$logger.info("Input 1", input)
      const tags = input.match(/(sort|order|in):\w*/gi) || []
      for (let i = 0; i < tags.length; i++) {
        const [setting, value] = tags[i].toUpperCase().split(':')
        input = input.replace(tags[i], '')

        if (setting == 'SORT' || setting == 'ORDER') {
          if (value == 'ASC' || value == 'ASCENDING') sort = 'asc'
          if (value == 'DESC' || value == 'DESCENDING') sort = 'desc'
        }
      // else if (setting == 'IN') {
      //     // TODO: Now that chapters are strings, rewrite this
      //     if (value in this.chapters) filter = filter.concat(this.chapters[value])
      //   }
      }
      filter = [...new Set(filter)] // remove duplicates
      input = input.trim()

      this.lastSearch = {input, sort, filter}

      this.$logger.info({input, sort, filter})
      this.invokeSearch({input, sort, filter}).then(results => {
        this.results = this.$isNewReader ? results.filter(result => !this.$pageIsSpoiler(result.mspa_num)) : results
          this.freshStart = false
          this.$nextTick(() => {
            this.$refs.input.blur()
            this.$nextTick(() => {
              this.$refs.input.focus()
            })
          })
      })
    },
    htmlEscape(str) {
      const queries = this.lastSearch.input
        .split(/[^\w&#;]/g)
        .filter(word => word.length > 1)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
      
      if (!queries) return str
      return str
        .replace(new RegExp(`(${queries})`, 'gi'), `<span class="match">$1</span>`)
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

          .match {
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

          .line {
            ::v-deep .match {
              background: var(--find--highlight);
              color: var(--font-highlight, var(--font-default));
            }
          }
        }
      }
    }	
  }
}


</style>

