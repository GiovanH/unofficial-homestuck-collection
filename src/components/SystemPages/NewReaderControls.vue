<template>
  <div class="newReaderControls">
    <template v-if="featureList.includes('pagenumber')">
      <!-- <span v-if="$localData.settings['devMode']" v-text="newReaderPage" /> -->
      <div class="newReaderInput" v-if="$isNewReader">
        <!-- Settings for adjusting new reader mode -->
        <p>New reader mode enabled.<br>
          Currently up to page 
          <!-- Can't show picker if you're in viz mode. -->
          <StoryPageLink
            v-if="isNewReadingPreHS" 
            :mspaId='$newReaderCurrent'/>
          <input type="number" size="1" maxlength="6" 
            v-model="newReaderPageInput"
            v-else
            @keydown.enter="changeNewReader()"
            :class="{
              invalid: !isValidPageSet, 
              empty: !newReaderPageInput || !newReaderPageInput.length, 
              changed: newReaderPageChanged
            }" >
        </p>
        <button v-if="isValidPageSet && newReaderPageChanged" 
          @click="changeNewReader()">Set adjusted page</button>
        <br />
        <button @click="clearNewReader()">Switch off new reader mode</button>
      </div>
      <div class="newReaderInput" v-else>
        <!-- Settings for turning on new reader mode -->
        <p class="hint">Quick Setup</p>
        <div class="quickset">
          <button @click="setupProblemSleuth()">Start Problem Sleuth</button>
          <button @click="setupHomestuck()">Start Homestuck</button>
        </div>
        <p class="hint">Or enter a page manually</p>
        <input type="number" size="1" maxlength="6" 
          v-model="newReaderPageInput"
          @keydown.enter="setNewReader()"
          :class="{
            invalid: !isValidPageSet, 
            empty: !newReaderPageInput || !newReaderPageInput.length, 
            changed: newReaderPageChanged
          }" >
        <button :disabled="!isValidPageSet || newReaderPageInput.length < 1" @click="setNewReader()">Activate</button>
        <!-- <StoryPageLink :mspaId='newReaderPage' titleOnly="true"/> -->
        <p class="hint" v-if="$localData.settings.mspaMode">
          Enter an <strong>MS Paint Adventures</strong> page number<br>
          e.g. www.mspaintadventures.com/?s=6&p=<strong>004130</strong></p>
        <p class="hint" v-else>
          Enter a <strong>Homestuck.com</strong> page number between 1 and 8129.<br>
          e.g. www.homestuck.com/story/<strong>413</strong></p>
      </div>

      <!-- <pre v-if="$localData.settings.devMode">
        newReaderPageInput: {{newReaderPageInput}}
        newReaderPage: {{newReaderPage}}
        $newReaderCurrent: {{$newReaderCurrent}}
        isValidPageSet: {{isValidPageSet}}
      </pre> -->

      <div v-if="promptMspaMode" class="settings application" >
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

    <div v-if="featureList.includes('fastforward')" class="settings application" >
      <h3>Reading Experience</h3>
      <dl class="fastForwardSelection">
        <dt>
          <input type="radio" id="fast_forward=false" :value="false" 
            v-model="myFastForward"/>
          <label for="fast_forward=false">Replay</label>
        </dt>
        <dd><label for="fast_forward=false">Read as if you were reading it live.<br>
          All pages will be presented how they were as of the time of your most recent page. (with some minor exceptions; see 
          <!-- Don't link to CC in setup mode (no settings page yet!) -->
          <template v-if="false && $localData.assetDir">
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
  components: {StoryPageLink},
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
      newReaderPageInput: this.$newReaderCurrent || this.$mspaOrVizNumber('001901'),
      // myFastForward is kept out-of-sync and undefined by default if forceGateChoice is set.
      myFastForward: this.forceGateChoice ? undefined : this.$localData.settings['fastForward'],
      settingListBoolean: [
        {
          model: "mspaMode",
          label: "Use MSPA page numbers",
          desc: "Instead of having individual sets of page numbers for each story, the original MS Paint Adventures website had one continuous page count that covered the beginning of Jailbreak all the way to the end of Homestuck."
        }
      ]
    }
  },
  computed: {
    featureList(){
      return this.features.toLowerCase().split(" ")
    },
    newReaderPage() {
      // The actual MSPA number corresponding to the inpupt box. Immutable. May be invalid. May be undefined, if there's no validl way to set a page.
      if (!this.newReaderPageInput) {
        return undefined
      }

      return this.$parseMspaOrViz(this.newReaderPageInput)
    },
    isValidPageSet(){
      // Can't set a valid PS page in viz mode
      if (this.isNewReadingPreHS) return false
      
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
        const prev_input = this.newReaderPageInput
        this.$localData.root.NEW_READER_CLEAR()
        this.$nextTick(() => {
          this.newReaderPageInput = prev_input
          this.$logger.info("resetting input to", prev_input, this.newReaderPageInput)
        })
      }
    },
    setupHomestuck() {
      this.newReaderPageInput = this.$mspaOrVizNumber("001901")
      this.setNewReader()
    },
    setupProblemSleuth() {
      this.$localData.settings.mspaMode = true
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
    "$localData.settings.newReader.current"(to, from){
      if (to && !this.$parent.tabIsActive)
        this.newReaderPageInput = this.$mspaOrVizNumber(to)
    },
    '$localData.settings.mspaMode'(to, from) {
      if (to == true) {
        // to mspa mode
        const newto = this.$vizToMspa('homestuck', this.newReaderPageInput).p
        this.$logger.info("to mspa", this.newReaderPageInput, newto)
        this.newReaderPageInput = newto
      } else {
        // to viz mode
        const newto = this.$mspaToViz(this.newReaderPageInput)
        if (newto.s == 'homestuck') {
          this.$logger.info("to viz", newto.s, from, to, newto.p)
          this.newReaderPageInput = newto.p
        } else {
          this.$logger.info("to viz non-hs", newto.s, this.newReaderPageInput)
          this.newReaderPageInput = undefined
        }
      }
    },
    newReaderPageInput(to, from){
      if (to && this.$localData.settings.mspaMode){
        const newto = this.$mspaOrVizNumber(this.$parseMspaOrViz(to))
        this.$logger.info("pageInput", from, to, newto)
        this.newReaderPageInput = newto
      }
    }
  }
}

</script>

<style scoped lang="scss">
  .newReaderControls {
    font-size: 14px;
    font-weight: bolder;
    overflow-wrap: break-word;
  }
  .newReaderInput {
    margin-top: 20px;
    text-align: center;

    button {
      // display: block;
      margin: 0 auto;
      // margin-bottom: 1em;
    }
    input {
      border: 1px solid #777;
      width: 70px;
      font-size: 16px;
      border-radius: 2px;
      padding: 2px 3px;
      margin: 5px;

      &.invalid:not(:disabled):not(.empty) {
        background: pink;
        border-color: rgb(187, 0, 37);
        box-shadow: 0 0 3px 1px red;
      }
      &.changed {
        border-color: #ffaa00;
        box-shadow: 0 0 3px 1px red;
      }
    }
    .quickset {
      display: flex;
      justify-content: space-evenly;
      width: 400px;
      margin: auto;
      button {
        margin: 0.5em;
        padding: 0.5em;
        min-width: 140px;
      }
    }
  }
  .hint {
    font-size: 13px;
    color: var(--page-nav-meta);
    font-weight: normal;
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

    dt { margin: 20px 0 5px 10px; }
    div.subOption { margin-left: 40px; }

  }
  .fastForwardSelection {
    dd {
      font-weight: normal;
    }
  }
</style>
