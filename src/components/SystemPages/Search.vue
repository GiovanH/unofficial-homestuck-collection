<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <div class="search">
          <h1>Search:</h1>
          <div class="searchBox">
            <input class="searchInput" type="text" spellcheck="false" @keydown.enter="search()" v-model="inputText" />
            <button class="searchButton" @click="search()"><fa-icon icon="search"></fa-icon></button>
          </div>
          <div class="results">
            <div v-if="!freshStart && results.length < 1" class="result noResult"> 
              <h2>No results found.</h2>
            </div>
            <div v-if="freshStart"><p>First search may take a few seconds!</p></div>
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
      query: '',
      chapters: {
        "JB": [0],
        "BQ": [1],

        "PS":   [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        "PS1":  [2],
        "PS2":  [3],
        "PS3":  [4],
        "PS4":  [5],
        "PS5":  [7],
        "PS7":  [8],
        "PS8":  [9],
        "PS9":  [10],
        "PS10": [11],
        "PS11": [12],
        "PS12": [13],
        "PS13": [14],
        "PS14": [15],
        "PS15": [16],
        "PS16": [17],
        "PS17": [18],
        "PS18": [19],
        "PS19": [20],
        "PS20": [21],
        "PS21": [22],
        "PS22": [23],
        "PSE":  [24],

        "BETA": [99],

        "HS": [100, 200, 300, 350, 400, 510, 520, 530, 550, 610, 615, 620, 630, 635, 640, 645, 651, 652, 653, 655, 700, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 800],
        "SIDE1": [100, 200, 300, 350, 400, 510, 520, 530, 550],
        "PART1": [100, 200, 300, 350, 400],
        "A1": [100],
        "A2": [200],
        "A3": [300],
        "I":  [350],
        "I1": [350],
        "A4": [400],
        "PART2": [510, 520, 530, 550],
        "A5": [510, 520, 530],
        "A5A1": [510],
        "A5A2": [520, 530],
        "A5O": [530],
        "I2": [550],
        "SIDE2": [610, 615, 620, 630, 635, 640, 645, 651, 652, 653, 655, 700, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 800],
        "A6": [610, 615, 620, 630, 635, 640, 645, 651, 652, 653, 655, 700, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760],
        "PART3": [610, 615, 620, 630, 635, 640, 645, 651, 652, 653, 655],
        "A6A1": [610],
        "A6I1": [615],
        "A6A2": [620],
        "A6I2": [625],
        "A6A3": [630],
        "A6I3": [635],
        "A6A4": [640],
        "A6I4": [645],
        "A6A5": [651, 652, 653],
        "A6A5A1": [651, 653],
        "A6A5A2": [652],
        "A6A5A1X2": [653],
        "A6A5X2": [653],
        "A6I5": [655, 656, 657, 658, 659, 660, 661, 662],
        "A6I5I1": [656],
        "A6I5I2": [657],
        "A6I5IF": [658],
        "A6I5I3": [659],
        "A6I5I4": [660],
        "A6I5I5": [661],
        "A6I5I6": [662],
        "PART4": [710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760],
        "A6A6": [710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760],
        "A6A6A1": [710],
        "A6A6I1": [715],
        "A6A6A2": [720],
        "A6A6I2": [725],
        "A6A6A3": [730],
        "A6A6I3": [735],
        "A6A6A4": [740],
        "A6A6I4": [745],
        "A6A6A5": [750],
        "A6A6I5": [755],
        "A6A6A6": [760],
        "A7": [800]
      }
    }
  },
  computed: {
  },
  mounted(){
    // Fire a search request to populate the index
    // ipcRenderer.invoke('search') 
  },
  methods: {
    invokeSearch(params){
      this.$logger.info(params)
      return ipcRenderer.invoke('search', params)
    },
    async search() {
      let input = this.inputText

      let sort = 'rel'
      let filter = []

      const tags = input.match(/(sort|order|in):\w*/gi) || []
      for (let i = 0; i < tags.length; i++) {
        const [setting, value] = tags[i].toUpperCase().split(':')
        input = input.replace(tags[i], '')

        if (setting == 'SORT' || setting == 'ORDER') {
          if (value == 'ASC' || value == 'ASCENDING') sort = 'asc'
          if (value == 'DESC' || value == 'DESCENDING') sort = 'desc'
        } else if (setting == 'IN') {
          // TODO: Now that chapters are strings, rewrite this
          if (value in this.chapters) filter = filter.concat(this.chapters[value])
        }
      }
      filter = [...new Set(filter)] // remove duplicates

      this.query = input
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/-/g, "&#45;")
        .replace(/=/g, "&#61;")
        .replace(/\[/g, "&#91;")
        .replace(/\]/g, "&#93;")
      this.invokeSearch({input: this.query, sort, filter}).then(results => {
        this.results = this.$isNewReader ? results.filter(result => !this.$pageIsSpoiler(result.key)) : results
        // TODO: Trim long pages to only show relevant context in search
        this.freshStart = false
      })
    },
    htmlEscape(str) {
      this.$logger.info("escape", str)
      const queries = this.query
        .split(/[^\w&#;]/g)
        .filter(word => word.length > 1)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
      
      if (!queries) return str
      return str
        .replace(new RegExp(`(${queries})`, 'gi'), `<span class="match">$1</span>`)
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

