<template>
  <div class="pageBody">
    <NavBanner />
    <div class="pageFrame">
      <div class="pageContent" v-if="$isNewReader">
          <div class="textContent">
            <p>no</p>
          </div>
      </div>
      <div class="pageContent" v-else>
        <h2 class="pageTitle">Gio's super cool thing-testing page</h2>
        <div class="testSection" style="border-top: none;">
          <p>i make absolutely no promises about anything here</p>
          <p>also this isn't the secret. that's something else</p>
          <br />
          <p>some of these I might make into full-fledged features at some point, like the conversation search. that's rad</p>
        </div>

        <div class="testSection" v-if="otherComponents.length">
          <h2>Overview</h2>
          <div v-for="ikey in intersectionKeys" :key="ikey" class="flexbox">
            <h3 v-text="ikey" /><br />
            <div v-for="COMP in otherComponents" :key="COMP" class="column">
              <h4 v-text="COMP.name" />
              <ul class="intersectionOverview">
                <li v-for='(__, k) in COMP[ikey]' :key="__">
                  <span class="match" v-if="COMP[ikey][k] == otherComponents['PAGE'][ikey][k]" v-text="k" :data-value="COMP[ikey][k]"/>
                  <span class="notmatch" v-else-if="k in otherComponents['PAGE'][ikey]" v-text="k" />
                  <span class="new" v-else v-text="k" />
                </li>
              </ul>
            </div>
          </div>
          <!-- <h2>Intersections</h2>
          <select v-model="intersectionKeySelected">
            <option v-for="k in intersectionKeys" :value="k" :key="k" v-text="k" />
          </select>
          <ul>
            <li v-for='c in Object.keys(otherComponents)' :key='c'>
              <label><input type="checkbox" v-model="selectedIntersections[c]" />{{ c }}</label>
            </li>
          </ul>
          <hr />
          <ul>
            <li v-for='r in intersectResults' :key='r' v-text="r">
              
            </li>
          </ul> -->
        </div>
        <div class="testSection">
          <h2>Vue template compiler</h2>
          <p>Okay this one might be legitimately useful to mod developers: put vue styled html here, get a render function out.</p>
          <textarea v-model="compileTemplate" style="width: 100%;" />
          <pre v-text="compiledResult" class="output" style="
            white-space: pre-wrap;
          "/>
        </div>
        <div class="testSection">
          <h2>Conversations</h2>
          <p>filter conversations by speaker</p>
          <p>speakers are id'd by color, not label (so 'DAVE: ' = 'TG: ')</p>
          <p>multiple selections load the intersection ("convos with both dirk and jane")</p>
          <ul v-if="loadConversations">
            <li  v-for="__, color in speakerColorData.pagesByColor" :key="color">
              <label>
                <input type="checkbox" v-model="selectedConvoColors[color]" />
                <span :style="`color: #${color}`">
                  #{{color}} {{speakerColorData.speakersByColor[color]}}</span>
              </label>
            </li>
          </ul>
          <button v-else @click="loadConversations = true">Load</button>
          <ul class="output" v-if="Object.values(selectedConvoColors).some(Boolean)">
            <hr />
            <li v-for='idc in convoResults' :key='idc[0]'>
              <StoryPageLink long :mspaId='idc[0]'></StoryPageLink> {{idc[1]}} <span v-text="$archive.mspa.story[idc[0]].content.match(/<span/g).length" /> spans
            </li>
          </ul>
        </div>
        <div class="testSection">
          <h2>Media Lookup</h2>
          <p>swf# -> page#</p>
          <p>works on media that isn't swf too I guess</p>
          <input type="text" v-model="swfLookup">
          <ul class="output">
            <li v-for='id in swfResults' :key='id'>
              <StoryPageLink long :mspaId='id'></StoryPageLink>
            </li>
          </ul>
        </div>
        <div class="testSection">
          <h2>Flag Lookup</h2>
          <p>look up pages by secret flags</p>
          <select v-model="flagLookup">
              <option v-for='flag in allFlags' v-text="flag" :value="flag" :key="flag"></option>
            </select>
          <ul class="output">
            <li v-for='id in flagResults' :key='id'>
              <StoryPageLink long :mspaId='id'></StoryPageLink>
            </li>
          </ul>
        </div>
        <div class="testSection">
          <h2>Misc</h2>
          <p>just arbitrary links to some pages</p>
          <ul>
            <li><a href="/mspa/000110">Multiple images</a></li>
            <li><a href="/mspa/000136">Multiple commands</a></li>
            <li><a href="/mspa/002148">Exile links</a></li>
            <li><a href="/mspa/002926">Advanced bass solo (retcon)</a></li>
            <li><a href="/mspa/003503">Pesterlogs</a></li>
            <li><a href="/mspa/003840">Descend</a></li>
            <li><a href="/mspa/004572">hummingbird</a></li>
            <li><a href="/mspa/004718">motherfuckinmiracles</a></li>
            <li><a href="/mspa/005314">LIFDOFF (SBAHJ link)</a></li>
            <li><a href="/mspa/005643">Insert disk 2</a></li>
            <li><a href="/mspa/005663">Visit doctor</a></li>
            <li><a href="/mspa/005919">Click the panels</a></li>
            <li><a href="/mspa/005951">Scratch panels</a></li>
            <li><a href="/mspa/005976">LEtips</a></li>
            <li><a href="/mspa/005982">SNOP</a></li>
            <li><a href="/mspa/006009">Cascade</a></li>
            <li><a href="/mspa/006465">Tinyurl</a></li>
            <li><a href="/mspa/006517">Link to pony</a></li>
            <li><a href="/mspa/006713">DOTA</a></li>
            <li><a href="/mspa/006870">Googl</a></li>
            <li><a href="/mspa/007163">Openbound 1</a></li>
            <li><a href="/mspa/007178">Retconair</a></li>
            <li><a href="/mspa/007208">Openbound 2</a></li>
            <li><a href="/mspa/007298">Openbound 3</a></li>
            <li><a href="/mspa/007395">Banging</a></li>
            <li><a href="/mspa/007396">Authorlog</a></li>
            <li><a href="/mspa/007611">Engage trickster mode</a></li>
            <li><a href="/mspa/007623">Caucasian</a></li>
            <li><a href="/mspa/007680">Banging 2</a></li>
            <li><a href="/mspa/007687">2x engage</a></li>
            <li><a href="/mspa/007688">x2</a></li>
            <li><a href="/mspa/008143">Homosuck</a></li>
            <li><a href="/mspa/008282">Web 3.0 flash</a></li>
            <li><a href="/mspa/008801">Game Over</a></li>
            <li><a href="/mspa/009002">Fireflies</a></li>
            <li><a href="/mspa/009058">Passwords</a></li>
            <li><a href="/mspa/009165">Dialoglog</a></li>
            <li><a href="/mspa/009304">8ack</a></li>
            <li><a href="/mspa/009432">Rose/Roxy double label</a></li>
            <li><a href="/mspa/009535">The Echidna page</a></li>
            <li><a href="/mspa/009549">Sprite²</a></li>
            <li><a href="/mspa/009823">Inline images</a></li>
            <li><a href="/mspa/009987">Collide</a></li>
            <li><a href="/mspa/010019">Panel path routing</a></li>
            <li><a href="/mspa/010027">Act 7</a></li>
            <li><a href="/mspa/010029">Credits</a></li>
            <li><a href="/mspa/pony">pony</a></li>
            <!-- <li><a href="http://mspaintadventures.com/?s=3">Blood Spade</a></li> -->
            <li><a href="/mspa/3">Blood Spade</a></li>
            <!-- <li><a href="http://mspaintadventures.com/?s=ryanquest">Ryanquest & modal</a></li> -->
          </ul>
          <ul>
            <li><a href="s=6&p=001902.html">Static page test</a></li>
            <li><a href="http://homestuck.com/mspa?s=6&p=007395">Redirect</a></li>
          </ul>
        </div>
        <div class="testSection">
          <h2>Error report</h2>
          <pre v-text="errorBody" />
        </div>
      </div>
    <PageFooter />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/StoryPage/PageFooter.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

import errorReporting from '@/js/errorReporting'

// import PAGE from '@/components/StoryPage/Page.vue'
// import FULLSCREENFLASH from '@/components/SpecialPages/fullscreenFlash.vue'
// import X2COMBO from '@/components/SpecialPages/x2Combo.vue'
// import TZPASSWORD from '@/components/SpecialPages/TzPassword.vue'
// import ECHIDNA from '@/components/SpecialPages/Echidna.vue'
// import ENDOFHS from '@/components/SpecialPages/EndOfHS.vue'

import Vue from 'vue'
// const prettier = require("prettier");

// function intersect(...sets) {
//     if (!sets.length) return new Set();
//     const i = sets.reduce((m, s, i) => s.size < sets[m].size ? i : m, 0);
//     const [smallest] = sets.splice(i, 1);
//     const res = new Set();
//     for (let val of smallest)
//         if (sets.every(s => s.has(val)))
//              res.add(val);
//     return res;
// }

export default {
  name: 'tests',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageFooter, StoryPageLink
  },
  data: function() {
    return {
      loadConversations: false,
      swfLookup: "04812.swf",
      flagLookup: "",
      otherComponents: {}, // {PAGE, FULLSCREENFLASH, X2COMBO, TZPASSWORD, ECHIDNA, ENDOFHS},
      selectedIntersections: {},
      // intersectionKeySelected: "computed",
      intersectionKeys: ["computed", "methods"],
      compileTemplate: "",
      selectedConvoColors: {}
    }
  },
  computed: {
    storyPages(){
      return Object.values(this.$archive.mspa.story)
    },
    errorBody() {
      return errorReporting.buildReportBody(null, {
        "App": this.$data.$appVersion,
        "Asset Pack": this.$archive.version
      })
    },
    compiledResult(){
      try {
        const compiled = Vue.compile(this.compileTemplate)
        const code = compiled.render.toString()
        return code // prettier.format(code, { semi: false })
      } catch (e) {
        return e.stack
      }
    },
    allConversations(){
      const re = /<span style="color: #([A-Fa-f0-9]+)">([A-Z0-9^]+):/g
      return this.storyPages.filter(
          page => re.exec(page.content)
        ).reduce((acc, page) => {
          // Output 'color:nickname' strings and remove duplicates 
          // Strings are the only way to automatically remove duplicates :(
          acc[page.pageId] = [...new Set([...page.content.matchAll(re)].map(s => s[1] + ':' + s[2]))]
          return acc
      }, {})
    },
    speakerColorData(){
      // Compute color: list<page> and color: set<nickname> mappings
      const {pagesByColor, speakersByColor} = Object.keys(this.allConversations).reduce((acc, pageId) => {
          this.allConversations[pageId].forEach(pair => {
              let [color, nickname] = pair.split(":")
              color = color.toUpperCase()
              acc.pagesByColor[color] = acc.pagesByColor[color] || []
              acc.pagesByColor[color].push(pageId)
              acc.speakersByColor[color] = acc.speakersByColor[color] || []
              acc.speakersByColor[color].push(nickname)
          })
          return acc
      }, {pagesByColor: {}, speakersByColor: {}})
      return {
        pagesByColor,
        speakersByColor: Object.keys(speakersByColor).reduce((acc, k) => {
          acc[k] = [...new Set(speakersByColor[k])]
          return acc
        }, {})
      }
    },
    convoResults(){
      const selectedConvoColors = Object.keys(this.selectedConvoColors).filter(k => this.selectedConvoColors[k])
      return Object.entries(this.allConversations).filter(a => {
        // Conversations in which all selected colors are participants
        const [pageId, pairs] = a
        return selectedConvoColors.every(
          c => [...pairs].some(p => p.toUpperCase().includes(c))
      )}).map(
        // Just get the nicknames
        a => {a[1] = a[1].map(pair => pair.split(':')[1]); return a}
      )
    },    
    // intersectResults() {
    //   return intersect(
    //     ...Object.keys(this.selectedIntersections).filter(
    //         k => this.selectedIntersections[k]
    //       ).map(k => new Set(
    //         Object.keys(this.otherComponents[k][this.intersectionKeySelected])
    //       )
    //     )
    //   )
    // },
    swfResults() {
      if (!this.swfLookup || this.swfLookup.length < 4) {
        return []
      }

      return this.storyPages.filter(page => 
        page.media.some(url => url.includes(this.swfLookup))
      ).map(page => page.pageId)
    },
    allFlags() {
      return this.storyPages.filter(
        page => page.flag.length > 0
      ).reduce((acc, page) => {
        for (const i in page.flag){
          const f = page.flag[i]
          if (!acc.includes(f)) acc.push(f)
        }
        return acc
      }, []).concat([
        "*NO_NEXT",
        "*NO_NEXT_SWF"
      ])
    },
    flagResults() {
      if (this.flagLookup == "*NO_NEXT")
        return this.pagesNoNext
      if (this.flagLookup == "*NO_NEXT_SWF")
        return this.pagesNoNextSwf

      return this.pagesFlagResults
    },
    pagesNoNextSwf() {
      return this.storyPages.filter(page => 
        (page.next.length == 0) && (page.media[0].endsWith(".swf"))
      ).map(page => page.pageId)
    },
    pagesNoNext() {
      return this.storyPages.filter(page => 
        page.next.length == 0
      ).map(page => page.pageId)
    },
    pagesFlagResults() {
      return this.storyPages.filter(page => 
        page.flag.includes(this.flagLookup.toUpperCase())
      ).map(page => page.pageId)
    }
  },
  methods: {
  },
  updated() {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
  ::v:deep a { color: var(--page-links); }
  ::v:deep a:link:active { color: var(--page-links-active); }
  p {
    // fuck you *unresets your css*
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;

    font-weight: normal;
    color: #aa0001;
  }
  .output { 
    border: 1px dashed grey;
    padding: 4px;
    @at-root ul#{&}, ol#{&} {
      list-style: inside;
    }
  }
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      .pageContent{
        background: var(--page-pageContent);
        
        width: 650px;     
        h2.pageTitle {
          max-width: 590px;
          text-align: center;
          line-height: 1.1;
          font-size: 32px;
          padding: 15px 0;
          margin: 0 auto;
        }
        .adventureLinks {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          margin: 0 auto;
          width: 600px;

          .adventure {
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.1;
            font-size: 18px;
          }
        }
        .testSection {
          border-top: 1em solid var(--page-pageFrame);
          padding: 30px;

          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 12px;
        }
        .flexbox {
          display: flex;
          flex-flow: row wrap;
          h3, h4 {
            flex-basis: 100%
          }
          .column {
            flex: 1;
          }
        }
        .intersectionOverview {
          .match {color: green;}
          .new {color: orange;}
          .notmatch {color: darkred;}
        }
      }
    }
    .textContent{
      margin: 30px 0;
      width: 600px;
      text-align: center;
    }

  }

</style>
