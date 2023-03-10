<template>
  <div class="mspaPageSelector">
    <div class="row">
      <div class="left">
        <select class="vizStorySelect"
          v-if="!$localData.settings.mspaMode"
          v-model="vizStory" >
          <option
            value="problem-sleuth"
            key="problem-sleuth">
            Problem Sleuth
          </option>
          <option
            value="homestuck"
            key="homestuck">
            Homestuck
          </option>
        </select>
        <select class="vizStorySelect"
          v-else
          disabled>
          <option>MSPA</option>
        </select>
      </div>
      <input type="number" size="1" maxlength="6"
        v-model="currentInputValue"
        @keydown.enter="onValueSubmit()"
        :class="{
          invalid: !isValidPageSet,
          empty: !currentInputValue || !currentInputValue.length,
          changed: currentInputChanged
        }" >
      <div class="right">
        <span :class="{ urgent: isValidPageSet && currentInputChanged }">
          <button :disabled="!(isValidPageSet && currentInputChanged)"
            @click="onValueSubmit()"
            class="rightBtn"
            >Adjust</button>
        </span>
        <span v-html="pageInvalidReason" class="errorHint"/>
      </div>
    </div>
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
  </div>
</template>

<script>
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

export default {
  name: 'MspaPageSelector',
  emits: ['change', 'test'],
  components: { 
    StoryPageLink 
  },
  props: {
    promptMspaMode: {
      type: Boolean,
      default: false
    },
    // value: {
    //   type: String,
    //   default: undefined
    // },
  },
  data: function() {
    return {
      // The number in the input field. May be an mspa number or viz number depending on settings. Mutable.
      // TODO: This assignment sometimes doesn't work, and assigns 001901 anyway?
      currentInputValue: "001901",
      value: "001901",
      vizStory: undefined,
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
    selectionPageId() {
      // The actual MSPA number corresponding to the input box. Immutable. May be invalid. May be undefined, if there's no validl way to set a page.
      if (!this.currentInputValue) {
        return undefined
      }

      return this.$parseMspaOrViz(this.currentInputValue, this.vizStory)
    },
    pageInvalidReason() {
      if (this.isValidPageSet) return undefined

      const pageId = this.selectionPageId
      const pageInStory = this.$archive ? pageId in this.$archive.mspa.story : true
      
      if (pageId < '000219') return `Can't start before Problem Sleuth<br />
        Minimum page ${this.$mspaOrVizNumber('000219')}`
      if (pageId > '010029') return `Can't start after Homestuck!<br />
        Maximum page ${this.$mspaOrVizNumber('010029')}`
      if (!pageInStory) return "Page not in story"
      if (/\D/.test(pageId)) return ""

      throw new Error(`Page '${pageId}'/'${this.currentInputValue}' invalid, but reason unknown?`)
    },
    isValidPageSet(){
      const pageId = this.selectionPageId
      const pageInStory = this.$archive ?
        pageId in this.$archive.mspa.story
        : pageId >= '000219' &&
          pageId <= '010029' &&
          !/\D/.test(pageId)

      return pageInStory
    },
    currentInputChanged(){
      return this.selectionPageId != this.value
    },
  },
  methods: {
    genInputString(){
      // Returns a good string to use as the input.
      // Usually just the input string, but may reset it
      // if the string has been cleared.
      return this.currentInputValue ||
        (this.$newReaderCurrent && this.$mspaOrVizNumber(this.$newReaderCurrent)) || 
        this.$mspaOrVizNumber('001901')
    },
    genVizStory(){
      if (this.$newReaderCurrent && this.$getChapter(this.$newReaderCurrent).startsWith('Problem Sleuth'))
        return 'problem-sleuth'
      return 'homestuck'
    },
    onValueSubmit(){
      if (this.isValidPageSet) {
        this.value = this.selectionPageId
        // this.$emit('update:value', this.selectionPageId)
        this.$emit('change', this.selectionPageId)
        if (this.handleChange) {
          this.handleChange(this.selectionPageId)
        }
      }
    },
  },
  watch: {
    // Any change to myFastForward should write to the actual setting.
    '$localData.settings.mspaMode'(to, from) {
      if (to == true) {
        // to mspa mode
        this.currentInputValue = this.$vizToMspa(this.vizStory, this.currentInputValue).p
        const newto = this.genInputString()
        this.$logger.info("to mspa", this.currentInputValue, this.$newReaderCurrent, newto)
        this.currentInputValue = newto
      } else {
        // to viz mode
        const newto = this.$mspaToViz(this.currentInputValue)
        this.$logger.info("to viz", newto.s, from, to, newto.p)
        this.currentInputValue = newto.p
      }
    },
  },
  mounted(){
    this.currentInputValue = this.genInputString()
    this.vizStory = this.genVizStory()
  }
}

</script>

<style scoped lang="scss">
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
</style>
