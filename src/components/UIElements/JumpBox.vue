<template>
  <transition name="jumpbox">
    <div class="jumpBox" v-show="isActive" @keydown.esc="close()" @focusout="onFocusOut" tabindex="-1">
      <div class="wrapper">
        <a :href="jumpboxText" class="jumpboxLink" ref="link">
        </a>
        <vue-simple-suggest
            v-model="jumpboxText" 
            :list="allUrlSuggestions"
            display-attribute="title"
            value-attribute="url"
            @select="onSuggestSelect"
            :filter-by-query="true"
            :max-suggestions="15"
            ref="suggest" 
          >
          <input 
            class="jumpBoxInput"
            ref="input"
            type="text"
            spellcheck="false"
            v-model="jumpboxText"
            @keydown.enter="focusLink"
          />
        </vue-simple-suggest> 
      </div>
    </div>
  </transition>
</template>

<script>
import VueSimpleSuggest from 'vue-simple-suggest'
import AddressBar from '@/components/AppMenu/AddressBar.vue'

export default {
  name: 'jumpBox',
  props: [
		'tab'
  ],
  components: {
    VueSimpleSuggest
  },
  data() {
    return {
      isActive: false,
      jumpboxText: ""
    }
  },
  computed: {
    allHistory(){
      return [...new Set(this.$localData.root.tabData.tabList.map(
        key => this.$localData.root.tabData.tabs[key]
      ).reduce((a, t) => {
        return a.concat(t.history)
      }, []))]
    },
    allUrlSuggestions: AddressBar.computed.allUrlSuggestions
  },
  methods: {
		open() {
      this.isActive = true
      this.$nextTick(() => {
        this.jumpboxText = this.tab.url
        setTimeout(() => {
          this.$refs.input.focus()
          this.$refs.input.select()
        }, 10)
      })
    },
    onFocusOut(event) {
      if (document.getElementById('contextMenu')?.contains(event.relatedTarget)) {
        this.$root.app.$refs.contextMenu.lendFocus(event.target)
      } else if (!this.$el.contains(event.relatedTarget))
        this.close()
    },
		close(){
      this.isActive = false
		},
		toggle(){
      if (this.isActive) this.close()
      else this.open()
    },
    focusLink(){
      this.$refs.link.click()
    },
    onSuggestSelect(event){
      this.jumpboxText = event.url
      // this.$nextTick(this.focusLink)
      this.$localData.root.TABS_PUSH_URL(event.url) // avoids some weird focus cases
      this.$refs.suggest.hideList()
      document.activeElement.blur()
    }
  },
  mounted() {
  },
	watch: {
		'tab.history'() {
			this.close()
		}
	}  
}
</script>

<style lang="scss" scoped>
  .jumpBox::v-deep {
    font-family: initial;
    font-weight: initial;
    font-size: initial;
    color: #000;
    
    position: fixed;
    width: 100%;
    top: 80px;
    z-index: 4;

    .wrapper {
      box-shadow: 0 0 4px 0 var(--ctx-shadow);
      border: 4px solid var(--ctx-frame);
      flex-flow: row nowrap;
      width: max-content;
      margin: 0 auto;
      display: flex;

      .jumpboxLink {
        background: #fff;
        font-size: 25px;
        text-decoration: none;
        color: #000;

        justify-content: center;
        align-items: center;
        display: flex;

        &::after {
          text-align: center;
          width: 34px;
          margin: 0;
        }
      }
      input {
        padding: 2px 0;
        font-size: 22px;
        font-family: var(--font-family-ui);
        height: 30px;
        width: 500px;
        border: none;
      }
      .suggestions {
        background-color: var(--ctx-bg);
        border: solid 1px var(--ctx-frame);
        color: var(--font-ctx);

        font-family: var(--font-family-ui);
        font-weight: normal;

        list-style: none;

        li[aria-selected="true"] {
          background: var(--ctx-select);
        }

        z-index: 5;
        padding: 5px;
        outline: none;
        cursor: default;
        position: fixed;
        user-select: none;
        white-space: nowrap;
      }
    }
  }

  .jumpbox-enter-active, .jumpbox-leave-active {
		transition: all 0.1s;
	}
	.jumpbox-enter, .jumpbox-leave-to {
    opacity: 0;
		transform: translateY(-10px);
	}
</style>
