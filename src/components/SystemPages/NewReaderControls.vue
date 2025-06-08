<template>
  <div class="newReaderControls">
    <template v-if="featureList.includes('pagenumber')">
      <div class="newReaderInput">
        <!-- Settings for adjusting new reader mode -->
        <template v-if="$isNewReader">
          <p class="pageStatus">
            <strong>New reader mode</strong> set to 
            <strong>page {{$mspaOrVizNumber($newReaderCurrent)}}</strong> 
            ({{$getChapter($newReaderCurrent)}})</strong>.
          </p>
          <div class="row">
            <div class="left">
              <select class="vizStorySelect" 
                v-if="!$localData.settings.mspaMode"
                v-model="vizStory" >
                <option
                  value="homestuck"
                  key="homestuck">
                  Homestuck
                </option>
                <option 
                  value="problem-sleuth" 
                  key="problem-sleuth">
                  Problem Sleuth
                </option>
              </select>
              <select class="vizStorySelect" 
                v-else
                disabled>
                <option>MSPA</option>
              </select>
            </div>
            <input type="number" size="1" maxlength="6" 
              v-model="newReaderPageInput"
              @keydown.enter="changeNewReader()"
              :class="{
                invalid: !isValidPageSet, 
                empty: !newReaderPageInput || !newReaderPageInput.length, 
                changed: newReaderPageChanged
              }" >
            <div class="right">
              <span :class="{ urgent: isValidPageSet && newReaderPageChanged }">
                <button :disabled="!(isValidPageSet && newReaderPageChanged)" 
                  @click="changeNewReader()" 
                  class="rightBtn"
                  >Adjust</button>
              </span>
              <span v-html="pageInvalidReason" class="errorHint"/>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="pageStatus">
            <strong>New reader mode disabled.</strong>
          </p>
          <div class="row">
            <div class="left">
              <select class="vizStorySelect" 
                v-if="!$localData.settings.mspaMode"
                v-model="vizStory" >
                <option 
                  value="homestuck" 
                  key="homestuck">
                  Homestuck
                </option>
                <option
                  value="problem-sleuth"
                  key="problem-sleuth">
                  Problem Sleuth
                </option>
              </select>
              <select class="vizStorySelect" 
                v-else
                disabled>
                <option>MSPA</option>
              </select>
            </div>
            <input type="number" size="1" maxlength="6" 
              v-model="newReaderPageInput"
              @keydown.enter="setNewReader()"
              :class="{
                invalid: !isValidPageSet, 
                empty: !newReaderPageInput || !newReaderPageInput.length, 
                changed: newReaderPageChanged
              }" >
            <div class="right">
              <span :class="{ urgent: isValidPageSet && newReaderPage != '001901' }">
                <button :disabled="!isValidPageSet || newReaderPageInput.length < 1" 
                @click="setNewReader()"
                class="rightBtn">Activate</button>
              </span>
              <span v-html="pageInvalidReason" class="errorHint"/>
            </div>
          </div>
        </template>
        <p class="hint" v-if="$localData.settings.mspaMode">
          Enter an <strong>MS Paint Adventures</strong> page number between 000219 and 010029.<br>
          e.g. www.mspaintadventures.com/?s=6&p=<strong>004130</strong></p>
        <p class="hint" v-else-if="vizStory == 'problem-sleuth'">
          Enter a <strong>Homestuck.com</strong> page number between 1 and 1673.<br>
          e.g. www.homestuck.com/problem-sleuth/<strong>570</strong></p>
        <p class="hint" v-else>
          Enter a <strong>Homestuck.com</strong> page number between 1 and 8129.<br>
          e.g. www.homestuck.com/story/<strong>413</strong></p>
        <div style="height: 45px;" v-if="$isNewReader">
            <br />
          <div class="bigButtonRow">
            <button @click="clearNewReader()">Switch off new reader mode</button>
          </div>
        </div>
        <div style="height: 45px;" v-else>
          <p class="hint">Or activate a preset:</p>
          <div class="bigButtonRow">
            <button @click="setupProblemSleuth()">Start Problem Sleuth</button>
            <button @click="setupHomestuck()">Start Homestuck</button>
          </div>
        </div>
      </div>

      <!-- <pre v-if="$localData.settings.devMode">
        newReaderPageInput: {{newReaderPageInput}} 
        newReaderPage: {{newReaderPage}} {{$getChapter(newReaderPage)}}
        $newReaderCurrent: {{$newReaderCurrent}} {{$getChapter($newReaderCurrent)}}
        isValidPageSet: {{isValidPageSet}}
        vizStory: {{vizStory}}
      </pre> -->

      <div v-if="promptMspaMode" class="settings" >
        <dl>
          <template v-for="boolSetting in settingListBoolean">
            <dt :key="boolSetting.model"><label>
              <input type="checkbox" 
                :name="boolSetting.model" 
                :id="boolSetting.model" 
                v-model="$localData.settings[boolSetting.model]"
              >{{boolSetting.label}}</label></dt> 
              <!-- the spacing here is made of glass -->
            <label :for="boolSetting.model">
              <dd class="settingDesc" v-html="boolSetting.desc" />
            </label>
          </template>
        </dl>
      </div>
    </template>

    <div v-if="featureList.includes('fastforward')" class="settings" >
      <h3>Reading Experience</h3>
      <dl class="fastForwardSelection">
        <dt>
          <input type="radio" id="fast_forward=false" :value="false" 
            v-model="myFastForward"/>
          <label for="fast_forward=false">Replay (Recommended)</label>
        </dt>
        <dd><label for="fast_forward=false">Read as if you were reading it live.<br>
          All pages will be presented how they were as of the time of your most recent page. (with some minor exceptions; see 
          <!-- Don't link to CC in setup mode (no settings page yet!) -->
          <template v-if="$localData.assetDir">
            <a href='/settings/controversial'>controversial content</a>).
          </template>
          <template v-else>
            "controversial content" in Settings).
          </template>
        </label></dd>

        <dt>
          <input type="radio" id="fast_forward=true" :value="true" 
            v-model="myFastForward"/>
          <label for="fast_forward=true">Archival</label>
        </dt>
        <dd><label for="fast_forward=true">Read as an archival reader.<br>
          Stories will be presented approximately as they were at the time they were finished (or abandoned).</label></dd>
      </dl>
    </div>
  </div>
</template>

<script>
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

export default {
  name: 'NewReaderControls',
  emits: ['enable', 'disable', 'change', 'test', 'ffchange'],
  components: { 
    StoryPageLink 
  },
  props: {
    promptMspaMode: {
      type: Boolean,
      default: true
    },
    features: {
      type: String,
      default: "pagenumber fastforward"
    },
    forceGateChoice: {
      default: false
    },
    handleEnable: {},
    handleDisable: {},
    handleChange: {}
  },
  data: function() {
    return {
      // The number in the input field. May be an mspa number or viz number depending on settings. Mutable.
      // TODO: This assignment sometimes doesn't work, and assigns 001901 anyway?
      newReaderPageInput: undefined,
      vizStory: 'homestuck',
      // myFastForward is kept out-of-sync and undefined by default if forceGateChoice is set.
      myFastForward: this.forceGateChoice ? undefined : this.$localData.settings['fastForward'],
      settingListBoolean: [
        {
          model: "mspaMode",
          label: "Use MSPA page numbers",
          desc: "Use the original 6-digit index.php page IDs used on mspaintadventures.com and the TopatoCo paperbacks instead of the new numbering Viz introduced."
        }
      ]
    }
  },
  computed: {
    featureList(){
      return this.features.toLowerCase().split(" ")
    },
    newReaderPage() {
      // The actual MSPA number corresponding to the input box. Immutable. May be invalid. May be undefined, if there's no validl way to set a page.
      if (!this.newReaderPageInput) {
        return undefined
      }

      return this.$parseMspaOrViz(this.newReaderPageInput, this.vizStory)
    },
    pageInvalidReason() {
      if (this.isValidPageSet) return undefined

      const pageId = this.newReaderPage
      const pageInStory = this.$archive ? pageId in this.$archive.mspa.story : true
      
      if (pageId < '000219') return `Can't start before Problem Sleuth<br />
        Minimum page ${this.$mspaOrVizNumber('000219')}`
      if (pageId > '010029') return `Can't start after Homestuck!<br />
        Maximum page ${this.$mspaOrVizNumber('010029')}`
      if (!pageInStory) return "Page not in story"
      if (/\D/.test(pageId)) return ""

      throw new Error(`Page '${pageId}'/'${this.newReaderPageInput}' invalid, but reason unknown?`)
    },
    isValidPageSet(){
      const pageId = this.newReaderPage
      const pageInStory = this.$archive ? pageId in this.$archive.mspa.story : true

      return pageInStory && 
        pageId >= '000219' && 
        pageId <= '010029' && 
        !/\D/.test(pageId)
    },
    newReaderPageChanged(){
      if (!this.$newReaderCurrent) return false
      return this.newReaderPage != this.$newReaderCurrent
    },
    isNewReadingPreHS(){
      return (!this.$localData.settings.mspaMode && this.$newReaderCurrent && this.$newReaderCurrent < '001901')
    }
  },
  methods: {
    genInputString(){
      // Returns a good string to use as the input.
      // Usually just the input string, but may reset it
      // if the string has been cleared.
      return this.newReaderPageInput || 
        (this.$newReaderCurrent && this.$mspaOrVizNumber(this.$newReaderCurrent)) || 
        this.$mspaOrVizNumber('001901')
    },
    genVizStory(){
      if (this.$newReaderCurrent && this.$getChapter(this.$newReaderCurrent).startsWith('Problem Sleuth'))
        return 'problem-sleuth'
      return 'homestuck'
    },
    changeNewReader(){
      if (this.isValidPageSet) {
        this.$emit('change', this.newReaderPage) 
        if (this.handleChange) {
          this.handleChange(this.newReaderPage)
        } else {
          this.$updateNewReader(this.newReaderPage, true)
        }
      }
    },
    setNewReader() {
      if (this.isValidPageSet) {
        this.$emit('enable', this.newReaderPage) 
        if (this.handleEnable) {
          this.handleEnable(this.newReaderPage)
        } else {
          this.$updateNewReader(this.newReaderPage, true)
        }
      }
    },
    clearNewReader() {
      this.$emit('disable')
      if (this.handleDisable) {
        this.handleDisable()
      } else {
        const prev_input = this.genInputString()
        this.$localData.root.NEW_READER_CLEAR()
        this.$nextTick(() => {
          this.newReaderPageInput = prev_input
          this.$logger.info("resetting input to", prev_input, this.newReaderPageInput)
        })
      }
    },
    setupHomestuck() {
      this.$localData.settings.mspaMode = false
      this.vizStory = 'homestuck'
      this.$nextTick(() => {
        this.$logger.info("Set HS number")
        this.newReaderPageInput = this.$mspaOrVizNumber("001901")
        this.setNewReader()
      })
    },
    setupProblemSleuth() {
      this.$localData.settings.mspaMode = true
      this.vizStory = 'problem-sleuth'
      this.$nextTick(() => {
        this.$logger.info("Set PS number")
        this.newReaderPageInput = "000219"
        this.setNewReader()
      })
    }
  },
  watch: {
    // Any change to myFastForward should write to the actual setting.
    myFastForward(to, from){
      this.$emit('ffchange', to)
      this.$localData.settings['fastForward'] = to
    },
    '$localData.settings.fastForward'(to, from){
      this.myFastForward = to
    },
    "$localData.settings.newReader.current"(to, from){
      if (to && !this.$parent.tabIsActive)
        this.newReaderPageInput = this.$mspaOrVizNumber(to)
    },
    '$localData.settings.mspaMode'(to, from) {
      if (to == true) {
        // to mspa mode
        this.newReaderPageInput = this.$vizToMspa(this.vizStory, this.newReaderPageInput).p
        const newto = this.genInputString()
        this.$logger.info("to mspa", this.newReaderPageInput, this.$newReaderCurrent, newto)
        this.newReaderPageInput = newto
      } else {
        // to viz mode
        const newto = this.$mspaToViz(this.newReaderPageInput)
        this.$logger.info("to viz", newto.s, from, to, newto.p)
        this.newReaderPageInput = newto.p
        this.vizStory = newto.s
      }
    },
    newReaderPageInput(to, from){
      if (to && this.$localData.settings.mspaMode){
        const newto = this.$mspaOrVizNumber(this.$parseMspaOrViz(to))
        this.$logger.info("pageInput", from, to, newto)
        this.newReaderPageInput = newto
      }
    }
  },
  mounted(){
    this.newReaderPageInput = this.genInputString()
    this.vizStory = this.genVizStory()
  }
}

</script>

<style scoped lang="scss">
  .newReaderControls {
    font-size: 14px;
    font-weight: bolder;
    overflow-wrap: break-word;
    font-weight: initial;
    position: relative;
  }
  .newReaderInput {
    margin-top: 20px;
    text-align: center;

    .urgent {
      display: inline-block;

      @keyframes urgent { from { 
        box-shadow: 0 0 0px 1px royalblue;
      } to { 
        box-shadow: 0 0 5px 1px royalblue;
      }  }

      animation: 0.5s linear 0s infinite alternate urgent;
    }

    button {
      // display: block;
      margin: 0 auto;
      // margin-bottom: 1em;
      &.rightBtn{
        min-width: 5em;
      }
    }
    input {
      border: 1px solid #777;
      width: 70px;
      font-size: 16px;
      border-radius: 2px;
      padding: 2px 3px;
      margin: 5px;
    }

    .bigButtonRow {
      display: flex;
      justify-content: space-evenly;
      width: 400px;
      margin: auto;
      button {
        margin: 0.5em;
        padding: 0.5em;
        min-width: 200px;
      }
    }
  }
  .pageStatus {
    margin-bottom: 10px;
  }
  .hint {
    font-size: 13px;
    color: var(--page-nav-meta);
    font-weight: normal;
  }
  .row {
    position: relative;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    > .left, .right {
      flex: 1;
    }
    > .right {
      text-align: left;
    }
    > .left {
      text-align: right;
    }
  }
  .errorHint {
    text-align: left;
    color: red;
    font-size: 0.8em;
    font-style: italic;
    margin-left: 6px;
  }
  .settings {
    p {
      font-weight: normal;
      margin: 0.5em;
      label {
        font-weight: bolder;
      }
    }
    .settingDesc {
      color: var(--page-nav-meta);
      font-weight: normal;
    }

    // Descriptions of whole sections
    > dd.settingDesc { margin-top: 1em; }

    dt { 
      margin: 20px 0 5px 10px; 
      label {
        font-weight: bolder;
      }
    }
    div.subOption { margin-left: 40px; }

  }
  .fastForwardSelection {
    dd {
      font-weight: normal;
    }
  }
</style>
