<template>
  <div class="newReaderControls">
    <template v-if="featureList.includes('pagenumber')">
      <!-- <span v-if="$localData.settings['devMode']" v-text="newReaderPage" /> -->
      <div class="newReaderInput" v-if="$isNewReader">
        <!-- Settings for adjusting new reader mode -->
        <p>New reader mode enabled.<br>
          Currently up to page 
          <input type="number" size="1" maxlength="6" v-model="newReaderPageInput"
            :class="{
              invalid: !isValidPageSet, 
              empty: !newReaderPage.length, 
              changed: newReaderPage != $newReaderCurrent
            }" >
        </p>
        <!-- <StoryPageLink :mspaId='newReaderPage' titleOnly="true"/> -->
        <button v-if="isValidPageSet && (newReaderPage != $newReaderCurrent)" 
          @click="changeNewReader()">Set adjusted page</button>
        <br />
        <button @click="clearNewReader()">Switch off new reader mode</button>
      </div>
      <div class="newReaderInput" v-else>
        <!-- Settings for turning on new reader mode -->
        <input type="number" size="1" maxlength="6" 
          v-model="newReaderPageInput" @keydown.enter="setNewReader()"
          :class="{invalid: !isValidPageSet, empty: !newReaderPage.length}">
          
        <button :disabled="!isValidPageSet || newReaderPage.length < 1" @click="setNewReader()">Activate</button>
        <!-- <StoryPageLink :mspaId='newReaderPage' titleOnly="true"/> -->
        <p class="hint" v-if="$localData.settings.mspaMode">
          Enter an <strong>MS Paint Adventures</strong> page number<br>
          e.g. www.mspaintadventures.com/?s=6&p=<strong>004130</strong><br>
          Homestuck starts at 001901 and ends at 100029. Problem Sleuth starts at 000219.</p>
        <p class="hint" v-else>
          Enter a <strong>Homestuck.com</strong> page number between 1 and 8129.<br>
          e.g. www.homestuck.com/story/<strong>413</strong></p>
      </div>

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
      newReaderPageInput: this.$newReaderCurrent,
      // myFastForward is kept out-of-sync and undefined by default if forceGateChoice is set.
      myFastForward: this.forceGateChoice 
        ? (console.log("gating ff, undefined") && undefined)
        : (console.log("not gating ff") && this.$localData.settings['fastForward']),
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
      // The actual MSPA number corresponding to the inpupt box. Immutable. May be invalid.
      if (!this.newReaderPageInput) {
        // nya, it's a hack, see
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.newReaderPageInput = this.$mspaOrVizNumber('001901')
      }

      return this.$parseMspaOrViz(this.newReaderPageInput)
    },
    isValidPageSet(){
      const pageId = this.newReaderPage
      const pageInStory = this.$archive ? pageId in this.$archive.mspa.story : true
      return pageInStory && 
        pageId >= '000219' && 
        pageId <= '010029' && 
        !/\D/.test(pageId)
    }
  },
  methods: {
    changeNewReader(){
      if (this.isValidPageSet) {
        const pageId = this.$parseMspaOrViz(this.newReaderPage)
        // this.$emit('change', pageId) 
        if (this.handleChange) {
          this.handleChange(pageId)
        } else {
          this.$updateNewReader(pageId, true)
        }
      }
    },
    setNewReader() {
      if (this.isValidPageSet) {
        const pageId = this.$parseMspaOrViz(this.newReaderPage)
        this.$emit('enable', pageId) 
        if (this.handleEnable) {
          this.handleEnable(pageId)
        } else {
          this.$updateNewReader(pageId, true)
        }
      }
    },
    clearNewReader() {
      this.$emit('disable')
        if (this.handleDisable) {
          this.handleDisable()
        } else {
          this.$localData.root.NEW_READER_CLEAR()
        }
    }
  },
  watch: {
    // Any change to myFastForward should write to the actual setting.
    myFastForward(to, from){
      this.$emit('ffchange', to)
      this.$localData.settings['fastForward'] = to
    },
    "$localData.settings.newReader.current"(to, from){
      if (!this.$parent.tabIsActive)
        this.newReaderPageInput = this.$mspaOrVizNumber(to)
    },
    '$localData.settings.mspaMode'(to, from) {
      if (to == true) {
        // to mspa mode
        this.newReaderPageInput = this.$vizToMspa('homestuck', this.newReaderPageInput).p
      } else {
        // to viz mode
        this.newReaderPageInput = this.$mspaToViz(this.newReaderPageInput).p
      }
    },
    newReaderPage(to, from) {
      if (this.$localData.settings.mspaMode)
        this.newReaderPageInput = this.$mspaOrVizNumber(to)
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
      display: block;
      margin: 0 auto;
      margin-bottom: 1em;
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
  }
  .hint {
    font-size: 13px;
    color: var(--page-nav-meta);
    font-weight: normal;
  }
  .settings {
    p {
      font-weight: normal;
      margin: 10px 0 5px 10px;
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
