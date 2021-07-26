<template>
  <transition name="modal">
    <div class="modalMask" v-if="isActive" tabindex="-1" @keydown.esc="close()" @click.self="close()">
      <div class="modalContainer" >
        <div class="modalContent">
          <h1 v-text="modopt.label"></h1>

          <div class="includes">
            <ul>
              <li v-if="modopt.includes.routes">Replacements</li>
              <li v-if="modopt.includes.edits">Edits</li>
              <li v-if="modopt.includes.styles">Styles</li>
              <li v-if="modopt.includes.themes">Themes</li>
              <li v-if="modopt.includes.themes">Footnotes</li>
              <template v-if="modopt.includes.hooks">
                <li v-for="hook in modopt.includes.hooks" v-text="hook" />
              </template>
            </ul>
          </div>

          <div class="metainfo">
            <span v-if="modopt.desc" v-html="modopt.desc"/>
            <br />
            <span v-if="modopt.author" v-html="'by <b>' + modopt.author + '</b>'" />
            <span v-if="modopt.modVersion" v-html="'v<b>' + modopt.modVersion + '</b>'" />
            <span v-if="modopt.locked">unlocked at page
              <StoryPageLink :mspaId='modopt.locked'></StoryPageLink>
            </span>
          </div>

          <div v-if="settingsModel">
            <hr/>

            <div class="bools">
              <dl>
                <template v-for="boolSetting in settingListBoolean">
                  <dt :key="boolSetting.model">
                    <input type="checkbox" 
                      :name="boolSetting.model" 
                      :id="boolSetting.model" 
                      v-model="buffer[boolSetting.model]"
                      :disabled="info_only"
                    >
                    <label :for="boolSetting.model" v-text="boolSetting.label"></label>
                  </dt> 
                    <!-- the spacing here is made of glass -->
                  <dd class="settingDesc" v-if="boolSetting.desc" v-html="boolSetting.desc" :key="boolSetting.model + '-desc'"></dd>
                </template>
              </dl>
            </div>
            <div class="radios">
              <dl>
                <template v-for="ratioSetting in settingListRadio">
                  <dt v-text="ratioSetting.label" :key="ratioSetting.model + '-label'"></dt>
                  <dd v-html="ratioSetting.desc" :key="ratioSetting.model + '-desc'"></dd>
                  <template v-for="option in ratioSetting.options">
                    <dt :key="ratioSetting.model + '-' + option.value">
                      <input type="radio" 
                        :name="`${ratioSetting.model}=${option.value}`" 
                        :id="`${ratioSetting.model}=${option.value}`" 
                        :value="option.value"
                        v-model="buffer[ratioSetting.model]"
                        :disabled="info_only"
                      >
                      <label 
                        :for="`${ratioSetting.model}=${option.value}`"
                        v-text="option.label" />
                    </dt> 
                    <dd class="settingDesc" v-if="option.desc" v-html="option.desc" :key="ratioSetting.model + '-' + option.value + '-desc'"></dd>
                  </template>
                </template>
              </dl>
            </div>
            <p>Changing some settings may require a reload.</p>
            <div class="buttonbox">
              <button @click="clearAll">Clear All</button>
              <button @click="forceReload">Reload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

const { getModStoreKey } = require('@/mods.js').default
const Store = require('electron-store')
const store = new Store()

import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
const { ipcRenderer } = require('electron')

export default {
  name: 'modal',
  props: ['tab'],
  components: {
    StoryPageLink
  },
  data() {
    return {
      isActive: false,
      modopt: undefined,
      settingsModel: undefined,
      storeKey: undefined,
      buffer: undefined,
      info_only: undefined
    }
  },
  computed: {
    settingListBoolean() {
      return this.settingsModel.boolean || []
    },
    settingListRadio() {
      return this.settingsModel.radio || []
    }
  },
  methods: { 
    openMod(modopt, info_only) {
      this.settingsModel = modopt.settingsmodel || {}
      this.modopt = modopt
      this.storeKey = getModStoreKey(modopt.key, null)
      this.buffer = store.get(this.storeKey) || {}
      this.info_only = Boolean(info_only)

      this.isActive = true
      this.$nextTick(() => {
        this.$el.focus()
      })
    },
    close() {
      this.save()
      this.isActive = false 
      this.settingsModel = undefined
      this.buffer = undefined
      this.storeKey = undefined
      this.info_only = undefined
    },
    save() {
      if (this.info_only) return
      if (!this.settingsModel) return
      this.$logger.info("saving", this.buffer, this.storeKey)
      store.set(this.storeKey, this.buffer)
    },
    clearAll() {
      store.clear(this.storeKey)
      this.buffer = store.get(this.storeKey) || {}
    },
    forceReload() {
      this.close()
      ipcRenderer.invoke('reload')
    }
  },
  watch: {
    'tab.url'() {
      this.close()
    },
    buffer: {
      deep: true,
      handler() {
        this.save()
      }
    }
  }
}
</script>

<style scoped lang="scss">

.modalMask {
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.85);
  position: fixed;

  width: 100%;
  height: calc(100% - var(--headerHeight));
  left: 0;
  overflow: hidden;

  display: flex;
  flex: 1 0 auto;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.modalContainer {
  max-width: 95%;
  max-height: 85%;
  margin-top: -25px;

  position: relative;

  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  align-content: center;

  border: solid 5px var(--page-pageBorder, var(--page-pageFrame));
  background: var(--page-pageContent);

  padding: 1em;
  width: 780px;

  font-family: Verdana,Arial,Helvetica,sans-serif;
  flex-flow: column nowrap;
  align-items: center;
  align-content: center;
}

.modalContent {
  width: 100%;
  height: 100%;
  overflow: auto;

  h2 {
    text-align: center;
  }
  p {
    font-weight: normal;
    margin: 10px 0 5px 10px;
    label {
      font-weight: bolder;
    }
  }
  dt {
    margin: 20px 0 5px 10px;
  }
  .radios {
    dt {
      margin-top: 0;
    }
    dd {
      margin-bottom: 1em;
    }
  }
  dd {
    color: var(--page-nav-meta);
    font-weight: normal;
  }

  > dd.settingDesc {
    // Descriptions of whole sections
    margin-top: 1em;
  }

  .metainfo > span {
    font-weight: normal;

    display: block;
  }

  .includes {
    float: right;
    position: relative;
  }

  .buttonbox {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    button {
      font-size: 110%;
    }
  }
  
}

.modal-enter-active, .modal-leave-active  {
  transition: all 0.15s;
  .modalContainer {
    transition: all 0.15s;
  }
}
.modal-enter, .modal-leave-to {
  background-color: #00000000;

  .modalContainer {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
