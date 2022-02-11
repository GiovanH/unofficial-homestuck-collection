<template>
  <div id="jumpBox">
    <div class="jumpBoxWrapper">
      <a :href="jumpboxText" class="jumpboxLink" ref="link" />
      <vue-simple-suggest
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
          @keydown.esc="resetJumpbox" 
        />
      </vue-simple-suggest>    
      <div id="browserActions">
        <!-- Browser actions go here -->
        <component v-for="(__, actionkey) in browserActions" :is="actionkey" :key="actionkey" :data-key="actionkey" />
        <div class="systemButton"
          v-if="$localData.settings.devMode && thisTabPageId" 
          :title="`Change current page from ${$newReaderCurrent} to p=${thisTabPageId}\n(Middle click to disable newreader)`"
          :class="{active: thisTabPageId != $newReaderCurrent}"
          @click="$updateNewReader(thisTabPageId, true)" 
          @click.middle="$localData.root.NEW_READER_CLEAR">
          <fa-icon icon="lock"></fa-icon>
          <span class="badge" v-text="$newReaderCurrent"></span>
        </div>
        <div class="systemButton"
          @click="isCurrentPageBookmarked ? tabComponent.$refs.bookmarks.open() : tabComponent.$refs.bookmarks.newSave()"
          :class="{active: isCurrentPageBookmarked}">
          <fa-icon 
            :icon="isCurrentPageBookmarked ? 'star' : 'star'"></fa-icon>
        </div>
      </div>      
    </div>
  </div>
</template>

<script>

import VueSimpleSuggest from 'vue-simple-suggest'

// Mixin currently unused
// import ModBrowserActionMixin from '@/components/CustomContent/ModBrowserActionMixin.vue'

export default {
  name: 'addressBar',
  components: {
    VueSimpleSuggest
  },
  data(){
    return {
      jumpboxText: this.$localData.root.activeTabObject.url,
      browserActions: {}
    }
  },        
  created(){
    // for (const COM in this.browserActions) {
    //     let mixins = this.browserActions[COM].mixins || []
    //     if (!mixins.includes(ModBrowserActionMixin)) {
    //         mixins.push(ModBrowserActionMixin)
    //         this.browserActions[COM].mixins = mixins
    //     }
    // }
    Object.assign(this.$options.components, this.browserActions)
  },
  computed: {
    isCurrentPageBookmarked(){
      return Object.values(this.$localData.saveData.saves).some(
        s => (s.url == this.$localData.root.activeTabObject.url)
      )
    },
    tabComponent() {
      return this.$root.app.activeTabComponent
    },
    thisTabPageId(){
      // // This is a good implementation to grab an inner page, so I'm leaving 
      // // it as a reference, but it has a race condition which makes it
      // // a poor fit here.
      // try {
      //   const page = this.$root.app.activeTabComponent.$refs.page
      //   if (page.$options.name == "page")
      //     return page.thisPage.pageId
      //   else
      //     return undefined
      // } catch {
      //   return undefined
      // }
      const activeTabUrl = this.$localData.root.activeTabObject.url
      let match
      // eslint-disable-next-line no-cond-assign
      if (match = /^\/mspa\/(\d+)$/.exec(activeTabUrl))
        return match[1]
      // eslint-disable-next-line no-cond-assign
      if (match = /^\/(\w+?)\/(\d+)$/.exec(activeTabUrl)) {
        const viz = this.$vizToMspa(match[1], match[2])
        if (viz) return viz.p
      }
    
      return undefined
    },
    allUrlSuggestions(){
      const dumbUrlMap = url => ({
        title: url,
        url: url
      })
      const simple = ['/credits', '/decode', '/map', '/music', '/news', '/sbahj', '/settings', '/settings/mod', '/tso'].map(dumbUrlMap)
      const unlocked = [
        {url: "/formspring", show: this.$pageIsSpoiler('003478')},
        {url: "/tumblr",     show: this.$pageIsSpoiler('006010')},
        {url: "/namcohigh",  show: this.$pageIsSpoiler('008135')},
        {url: "/pxs",        show: this.$pageIsSpoiler('008753')},
        {url: "/snaps",      show: !this.isNewReader}
      ].filter(t => t.show).map(t => t.url).map(dumbUrlMap)
      const history = this.$localData.allHistory.map(dumbUrlMap)

      const bookmarks = Object.values(this.$localData.saveData.saves).map(bookmark => ({
        title: `${bookmark.url} - ${bookmark.name}`,
        url: bookmark.url
      }))

      return [...bookmarks, ...simple, ...unlocked, ...history].filter((obj, pos, arr) => {
        // Deduplicate based on 'url' param
        return arr.map(mapObj => mapObj['url']).indexOf(obj['url']) === pos
      })
    }
  },
  methods: {
    focusLink(){
      if (!this.$refs.suggest.hovered) {
        const do_refresh_instead = (this.jumpboxText == this.$localData.root.activeTabObject.url)
        
        if (do_refresh_instead) {
          this.reloadTab()
        } else {
          this.$refs.link.click()
          this.resetJumpbox()
          document.activeElement.blur()
        }
      }
    },
    reloadTab(e) {
      this.$root.app.activeTabComponent.reload()
    },
    onSuggestSelect(event){
      if (!event) return
      const url = this.$resolvePath(event.url)
      this.jumpboxText = url
      // this.$nextTick(this.focusLink)
      this.$localData.root.TABS_PUSH_URL(url) // avoids some weird focus cases
      this.$refs.suggest.hideList()
      document.activeElement.blur()

      // Very icky way to force the displayed input value correct
      // without it showing the label text as the url value.
      // TODO: Keep the input value correct without using $nextTick
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$logger.info("Suggestion: forcing input value from", this.$refs.input.value)
          this.$refs.input.value = url
        })
      })
    },
    resetJumpbox() {
      this.jumpboxText = this.$localData.root.activeTabObject.url
      
      this.$nextTick(() => this.$refs.input.select())
    }
  },
  watch: {
    '$localData.root.activeTabObject.url'(to, from){
      this.jumpboxText = to
    },
    '$localData.tabData.activeTabKey'(to, from){
      this.jumpboxText = this.$localData.root.activeTabObject.url
    }
  }
}
</script>

<style lang="scss" scoped>
#jumpBox {
  flex: 1 0 auto;
  margin: auto 0;
  padding: 0px 4px;
}
.jumpBoxWrapper::v-deep {
  display: flex;
  flex-flow: row nowrap;

  --border-size: 1px;

  border-radius: 2px;
  border: var(--border-size) solid var(--header-border);
  height: calc(var(--address-bar-height) - 2 * var(--border-size));

  background: var(--header-tabSection);

  .vue-simple-suggest {
    width: 100%;
  }

  .jumpboxLink {
    border-radius:  1px 0 0 1px ;
    background: var(--header-tabSection);
    color: var(--font-header);
    font-size: 16px;
    text-decoration: none;

    justify-content: center;
    align-items: center;
    display: flex;

    &::after {
      text-align: center;
      width: 22px;
      margin: 0;
    }
  }
  input {
    border-radius: 0 1px 1px 0;
    padding: 2px 0;
    font-size: calc(var(--address-bar-height) * (3/5));
    line-height: 20px;
    width: 100%;
    border: none;
    font-family: var(--font-family-ui);
    background: var(--header-tabSection);
    color: var(--font-header);
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
#browserActions::v-deep {
  display: inline-block;
  height: var(--address-bar-height);
  display: flex; 
  > div {
    position: relative;

    --padding: 2px;
    --square-size: calc(var(--address-bar-height) - 2 * var(--padding));

    width: var(--square-size);
    height: calc(var(--square-size) - 1px);
    padding: var(--padding);
    font-size: calc(var(--square-size) - 4px);

    color: var(--font-header);   

    > svg {
      display: block;
      margin: auto;
      height: 100%;
      opacity: 0.4;
    }
    &.active > svg {
      opacity: 1.0;
    }

    .badge {
      display: block;
      position: absolute;
      background: var(--header-bg);
      font-size: 10px;
      opacity: 0.8;
      // height: 1em;
      line-height: normal;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
