<template>
  <div class="pageBody">
    <NavBanner />
    <div class="pageFrame">
      <div class="pageContent">
        <div class="logItems">
          <h2>Intersections</h2>
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
          </ul>
        </div>
        <div class="logItems">
          <h2>Media Lookup</h2>
          <input type="text" v-model="swfLookup">
          <ul>
            <li v-for='id in swfResults' :key='id'>
              <StoryPageLink long :mspaId='id'></StoryPageLink>
            </li>
          </ul>
        </div>
        <div class="logItems">
          <h2>Flag Lookup</h2>
          <select v-model="flagLookup">
              <option v-for='flag in allFlags' v-text="flag" :value="flag" :key="flag"></option>
            </select>
          <ul>
            <li v-for='id in flagResults' :key='id'>
              <StoryPageLink long :mspaId='id'></StoryPageLink>
            </li>
          </ul>
        </div>
        <div class="logItems">
          <h2>Misc</h2>
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
            <li><a href="/mspa/009535">The Echidna page</a></li>
            <li><a href="/mspa/009987">Collide</a></li></li>
            <li><a href="/mspa/010019">Panel path routing</a>
            <li><a href="/mspa/010027">Act 7</a></li>
            <li><a href="/mspa/010029">Credits</a></li>
            <li><a href="/mspa/pony">pony</a></li>
            <li><a href="http://mspaintadventures.com/?s=3">Blood Spade</a></li>
            <li><a href="http://mspaintadventures.com/?s=ryanquest">Ryanquest & modal</a></li>
          </ul>
          <ul>
            <li><a href="s=6&p=001902.html">Static page test</a></li>
            <li><a href="http://homestuck.com/mspa?s=6&p=007395">Redirect</a></li>
          </ul>
        </div>
      </div>
    <PageFooter />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

import PAGE from '@/components/Page/Page.vue'
import FULLSCREENFLASH from '@/components/SpecialPages/fullscreenFlash.vue'
import X2COMBO from '@/components/SpecialPages/x2Combo.vue'
import TZPASSWORD from '@/components/SpecialPages/TzPassword.vue'
import ECHIDNA from '@/components/SpecialPages/Echidna.vue'
import ENDOFHS from '@/components/SpecialPages/EndOfHS.vue'

function intersect(...sets) {
    if (!sets.length) return new Set();
    const i = sets.reduce((m, s, i) => s.size < sets[m].size ? i : m, 0);
    const [smallest] = sets.splice(i, 1);
    const res = new Set();
    for (let val of smallest)
        if (sets.every(s => s.has(val)))
             res.add(val);
    return res;
}

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
      swfLookup: "",
      flagLookup: "",
      otherComponents: {PAGE, FULLSCREENFLASH, X2COMBO, TZPASSWORD, ECHIDNA, ENDOFHS},
      selectedIntersections: {},
      intersectionKeySelected: "computed",
      intersectionKeys: ["computed", "methods"]
    }
  },
  computed: {
    intersectResults(){
      return intersect(
        ...Object.keys(this.selectedIntersections).filter(
            k => this.selectedIntersections[k]
          ).map(k => new Set(
            Object.keys(this.otherComponents[k][this.intersectionKeySelected])
          )
        )
      )
    },
    swfResults(){
      if (!this.swfLookup || this.swfLookup.length < 4) {
        return []
      }

      return Object.values(this.$archive.mspa.story).filter(page => 
        page.media.some(url => url.includes(this.swfLookup))
      ).map(page => page.pageId)
    },
    allFlags(){
      return Object.values(this.$archive.mspa.story).filter(
        page => page.flag.length > 0
      ).reduce((acc, page) => {
        for (const i in page.flag){
          const f = page.flag[i]
          if (!acc.includes(f)) acc.push(f)
        }
        return acc
      }, [])
    },
    flagResults(){
      return Object.values(this.$archive.mspa.story).filter(page => 
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
  ::v-deep a{
    color: var(--page-links);
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
        .switchOrder {
          padding-left: 30px;
        }
        .logItems {
          padding: 30px;

          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 12px;
        }
      }
    }

  }
  

</style>

