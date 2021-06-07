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
            <div v-for="(page, i) in results" :key="'page'+i" class="result">
              <h2>
                <a :href="$resolvePath(page.key)" v-html="$archive.mspa.story[page.key].title" />
              </h2>
              <div class="chapter" v-html="`${getChapter(page.key)} - ${$mspaOrVizNumber(page.key)}`" />
              <p v-for="(line, i) in page.lines" :key="'line'+i"  v-html="htmlEscape(line)" class="line" />
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
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

// import FlexSearch from 'flexsearch'
const { ipcRenderer } = require('electron')

export default {
  name: 'search',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
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
  methods:{
    async search() {
      let input = this.inputText

      let sort = 'rel'
      let filter = []

      let tags = input.match(/(sort|order|in):\w*/gi) || []
      for (let i = 0; i < tags.length; i++) {
        let [setting, value] = tags[i].toUpperCase().split(':')
        input = input.replace(tags[i], '')

        if (setting == 'SORT' || setting == 'ORDER') {
          if (value == 'ASC' || value == 'ASCENDING') sort = 'asc'
          if (value == 'DESC' || value == 'DESCENDING') sort = 'desc'
        }
        else if (setting == 'IN') {
          if (value in this.chapters) filter = filter.concat(this.chapters[value])
        }
      }
      filter = [...new Set(filter)] //remove duplicates

      this.query = input
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/-/g, "&#45;")
        .replace(/=/g, "&#61;")
        .replace(/\[/g, "&#91;")
        .replace(/\]/g, "&#93;")
      ipcRenderer.invoke('search', {input: this.query, sort, filter}).then( results => {
        this.results = this.$isNewReader ? results.filter(result => !this.$pageIsSpoiler(result.key)) : results
        this.freshStart = false
      })
    },
    htmlEscape(str) {
      let queries = this.query
        .split(/[^\w&#;]/g)
        .filter(word => word.length > 1)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')
      
      if (!queries) return str
      return str
        .replace(new RegExp(`(${queries})`, 'gi'), `<span class="match">$1</span>`)
    },
    getChapter(key) {
      // TODO: Rewrite chapter index as data driven
      let p = parseInt(key)
      if (!p) {
        switch (key) {
          case 'jb2_000000': return 'Jailbreak'
          case 'MC00001': return 'Blood Spade'
          case 'pony': return 'Homestuck Act 3'
          case 'darkcage': return 'Homestuck Act 6 Intermission 1'
          case 'pony2': return 'Homestuck Act 2'
          case 'darkcage2': return 'Homestuck Act 6 Act 3'
        }
      }
      else if (p <= 135 && p >= 1) return 'Jailbreak'
      else if (p <= 218 && p >= 136) return 'Bard Quest'
      else if (p <= 1892 && p >= 219) {
        let c = 'Problem Sleuth '
        if (p >= 1841) c += "Epilogue"
        else if (p >= 1708) c += "Chapter 22"
        else if (p >= 1655) c += "Chapter 21"
        else if (p >= 1589) c += "Chapter 20"
        else if (p >= 1507) c += "Chapter 19"
        else if (p >= 1466) c += "Chapter 18"
        else if (p >= 1406) c += "Chapter 17"
        else if (p >= 1299) c += "Chapter 16"
        else if (p >= 1257) c += "Chapter 15"
        else if (p >= 1149) c += "Chapter 14"
        else if (p >= 1069) c += "Chapter 13"
        else if (p >= 1030) c += "Chapter 12"
        else if (p >= 953) c += "Chapter 11"
        else if (p >= 873) c += "Chapter 10"
        else if (p >= 816) c += "Chapter 9"
        else if (p >= 742) c += "Chapter 8"
        else if (p >= 666) c += "Chapter 7"
        else if (p >= 604) c += "Chapter 6"
        else if (p >= 546) c += "Chapter 5"
        else if (p >= 448) c += "Chapter 4"
        else if (p >= 402) c += "Chapter 3"
        else if (p >= 302) c += "Chapter 2"
        else if (p >= 219) c += "Chapter 1"
        return c
      }
      else if (p <= 1900 && p >= 1893) return 'Homestuck Beta'
      else if (p >= 1901) {
        let c = 'Homestuck '
        if (p >= 10027) c += "Act 7"
        else if (p >= 9987) c += "Act 6 Act 6 Act 6"
        else if (p >= 9349) c += "Act 6 Act 6 Intermission 5"
        else if (p >= 9309) c += "Act 6 Act 6 Act 5"
        else if (p >= 8844) c += "Act 6 Act 6 Intermission 4"
        else if (p >= 8821) c += "Act 6 Act 6 Act 4"
        else if (p >= 8801) c += "Act 6 Act 6 Intermission 3"
        else if (p >= 8753) c += "Act 6 Act 6 Act 3"
        else if (p >= 8431) c += "Act 6 Act 6 Intermission 2"
        else if (p >= 8375) c += "Act 6 Act 6 Act 2"
        else if (p >= 8178) c += "Act 6 Act 6 Intermission 1"
        else if (p >= 8143) c += "Act 6 Act 6 Act 1"
        else if (p >= 8092) c += "Act 6 Intermission 5 Intermission 6"
        else if (p >= 8012) c += "Act 6 Intermission 5"
        else if (p >= 8011) c += "Act 6 Intermission 5 Intermission 5"
        else if (p >= 7965) c += "Act 6 Intermission 5 Intermission 4"
        else if (p >= 7922) c += "Act 6 Intermission 5 Intermission 3"
        else if (p >= 7882) c += "Act 6 Intermission 5"
        else if (p >= 7881) c += "Act 6 Intermission 5 Interfishin"
        else if (p >= 7866) c += "Act 6 Intermission 5"
        else if (p >= 7847) c += "Act 6 Intermission 5"
        else if (p >= 7846) c += "Act 6 Intermission 5 Intermission 2"
        else if (p >= 7840) c += "Act 6 Intermission 5"
        else if (p >= 7839) c += "Act 6 Intermission 5 Intermission 1"
        else if (p >= 7823) c += "Act 6 Intermission 5"
        else if (p >= 7688) c += "Act 6 Act 5 Act 1 x2 Combo"
        else if (p >= 7678) c += "Act 6 Act 5 Act 1"
        else if (p >= 7614) c += "Act 6 Act 5 Act 2"
        else if (p >= 7412) c += "Act 6 Act 5 Act 1"
        else if (p >= 7341) c += "Act 6 Intermission 4"
        else if (p >= 7338) c += "Act 6 Act 4"
        else if (p >= 7163) c += "Act 6 Intermission 3"
        else if (p >= 6720) c += "Act 6 Act 3"
        else if (p >= 6567) c += "Act 6 Intermission 2"
        else if (p >= 6320) c += "Act 6 Act 2"
        else if (p >= 6195) c += "Act 6 Intermission 1"
        else if (p >= 6013) c += "Act 6 Act 1"
        else if (p >= 6011) c += "Intermission 2"
        else if (p >= 4526) c += "Act 5 Act 2"
        else if (p >= 3889) c += "Act 5 Act 1"
        else if (p >= 3258) c += "Act 4"
        else if (p >= 3054) c += "Intermission"
        else if (p >= 2660) c += "Act 3"
        else if (p >= 2149) c += "Act 2"
        else c += "Act 1"
        return c
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

          .line {
            padding-top: 10px;

            ::v-deep .match {
              background: var(--find--highlight);
              color: var(--font-highlight, var(--font-default));
            }

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

