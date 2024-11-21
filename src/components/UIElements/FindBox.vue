<template>
<transition name="findBox">
  <div class="findBoxFrame" v-if="isActive" @keydown.esc="close()" tabindex="-1">
    <div class="tray search">
      <input class="findBox" type="text" v-model="inputText" spellcheck="false" @keydown.enter="onEnterDown" ref="input" />
      <button class="systemButton close" @click="close()"><span>✕</span></button>
    </div>
    <div v-if="!freshStart" class="tray results">
      <div class="buttons">
        <button class="systemButton prev" @click="prev()"><fa-icon icon="chevron-up"></fa-icon></button>
        <button class="systemButton next" @click="next()"><fa-icon icon="chevron-down"></fa-icon></button>
      </div>
      <div class="results" v-if="markLength > 0"><strong>{{step + 1}}</strong> of <strong>{{markLength}}</strong> matches</div>
      <div class="results" v-else>0 matches</div>
    </div>
  </div>
</transition>
</template>

<script>
const Mark = require('mark.js')

export default {
  name: 'findBox',
	props: [
		'tab'
	],
  data(){
    return {
      isActive: false,
      freshStart: true,

      inputText: "",
      markedTab: undefined,
      marks: [],
      markLength: 0,
      step: 0,
      recurseGuard: false
    }
  },
  computed: {

  },
  methods: {
		open() {
      this.isActive = true

      if (document.getSelection().toString().length > 0) {
        this.inputText = document.getSelection().toString()
      }
      
      this.$nextTick(() => {
        this.markedTab = new Mark(this.$parent.$el)
        this.$refs.input.select()
      })
		},
		close(){
      this.reset()
			this.isActive = false
      this.freshStart = true
		},
		toggle(){
      if (this.isActive) this.close()
      else this.open()
		},
    search(){
      var regex, matches,
      // test for regex (e.g. "/(lorem|ipsum)/gi")
      testRegex = /^\/((?:\\\/|[^\/])+)\/([mig]{0,3})?$/
      if (testRegex.test(this.inputText)) {
        matches = testRegex.exec(this.inputText)
        try {
          regex = new RegExp(matches[1], matches[2])
        } catch (err) {
          regex = null
        }
      }

      // Determine selected options
      var options = {
        "separateWordSearch": false,
        "diacritics": true,
        "ignoreJoiners": true,
        "acrossElements": true,
        "iframes": true,

        "exclude": [
          ".findBoxFrame *"
        ]
      }
      // Remove previous marked elements and mark
      // the new keyword inside the context
      if (regex instanceof RegExp) {
        this.markedTab.unmark().markRegExp(regex, options)
      } else {
        this.markedTab.unmark().mark(this.inputText, options)
      }

      this.marks = this.$parent.$el.getElementsByTagName("mark")      
      this.step = 0
      this.markLength = this.marks.length
      
      if (this.marks.length > 0) {
        this.marks[this.step].classList.add('findBoxSelected')
        this.marks[this.step].scrollIntoView({block: "center"})
      }

      this.freshStart = false
    },
    reset(){
      if (this.markedTab) this.markedTab.unmark()
      this.marks = []
      this.step = 0
      this.markLength = 0
      this.recurseGuard = false
    },
    onEnterDown(event) {
      if (event.shiftKey === true) this.prev()
      else this.next()
    },
    next(){
      if (this.marks.length > 0) {
        const prev = this.step
        if (++this.step >= this.markLength) this.step = 0
        this.marks[prev].classList.remove('findBoxSelected')
        this.marks[this.step].classList.add('findBoxSelected')
        this.marks[this.step].scrollIntoView({block: "center"})
      } else {
        this.search()
      }
    },
    prev(){
      if (this.marks.length > 0) {
        this.recurseGuard = false
        const prev = this.step
        if (--this.step < 0) this.step = this.markLength - 1
        this.marks[prev].classList.remove('findBoxSelected')
        this.marks[this.step].classList.add('findBoxSelected')
        this.marks[this.step].scrollIntoView({block: "center"})
      } else if (!this.recurseGuard) {
        this.recurseGuard = true
        this.search()
        this.prev()
      }
    }
  },
  watch: {
    inputText(to, from){
      this.reset()
    },
    'tab.history'(to, from) {
      this.freshStart = true
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
  .findBoxFrame {
    z-index: 3;
    background-color: var(--ctx-bg);
    border: solid 2px var(--ctx-frame);
    box-shadow: 2px 2px 2px -2px var(--ctx-shadow);
    border-top: none;
    padding: 10px 10px 5px 10px;
    position: fixed;
    left: 25px;

    .systemButton {
      color: var(--font-default);
      padding: 0;

      flex: 0 0 auto;
      width: 21px;
      height: 21px;
    }

    .tray {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      
      &.search {
        margin-bottom: 5px;

        input {
          border: 1px solid var(--ctx-frame);
          min-width: 35px;
          width: 300px;
          border-radius: 2px;
          padding: 2px 3px;
          margin-right: 5px;
        }
        .close {
          line-height: 22px;
          font-size: 14px;
          font-family: Arial, Helvetica, sans-serif;
        }
      }
      &.results {
        .prev {
          margin-right: 2px;
        }
        .results {
          margin-left: 10px;
          color: var(--page-nav-meta)
        }
      }
    }
    
  }
  .findBox-enter-active, .findBox-leave-active {
		transition: all .1s;
	}
	.findBox-enter, .findBox-leave-to {
		transform: translateY(-100%);
	}
</style>
