<template>
  <transition name="modal">
    <div class="modalMask" v-if="isActive" tabindex="-1" @keydown.esc="close()" @click.self="close()">
      <div class="modalContainer" >
        <div class="modalContent">
          <div class="includes">
            <span>includes</span>
            <ul>
              <li v-if="modopt.includes.routes">Assets</li>
              <li v-if="modopt.includes.edits">Edits</li>
              <li v-if="modopt.includes.styles">Styles</li>
              <li v-if="modopt.includes.themes">Themes</li>
              <li v-if="modopt.includes.footnotes">Footnotes</li>
              <li v-if="modopt.includes.toolbars">Toolbars</li>
              <li v-if="modopt.includes.browserActions">Browser Actions</li>
              <template v-if="modopt.includes.hooks">
                <li v-for="hook in modopt.includes.hooks" v-text="hook" :key="hook" />
              </template>
              <template v-if="modopt.includes.browserPages">
                <li v-for="baseurl in modopt.includes.browserPages" v-text="'/' + baseurl.toLowerCase()"  :key="baseurl" />
              </template>
            </ul>
          </div>

          <h1 v-text="modopt.label"></h1>

          <div class="metainfo">
            <span v-if="modopt.summary" v-text="modopt.summary"/>
            <br />
            <span v-if="modopt.author" v-html="'by <b>' + modopt.author + '</b>'" />
            <span v-if="modopt.modVersion" v-html="'v<b>' + modopt.modVersion + '</b>'" />
            <span v-if="modopt.locked">unlocked at page
              <StoryPageLink :mspaId='modopt.locked'></StoryPageLink>
            </span>
          </div>

          <div v-if="modopt.description" v-html="modopt.description" class="description"/>

          <div v-if="hasSettings" class="settings">
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
              <dl v-for="ratioSetting in settingListRadio">
                <dt v-text="ratioSetting.label" :key="ratioSetting.model + '-label'"></dt>
                <dd v-html="ratioSetting.desc" :key="ratioSetting.model + '-desc'"></dd>
                <template v-for="option, i in ratioSetting.options">
                  <dt :key="ratioSetting.model + '-' + slugifyOptionValue(option.value, i)">
                    <input type="radio" 
                      :name="`${ratioSetting.model}=${slugifyOptionValue(option.value, i)}`" 
                      :id="`${ratioSetting.model}=${slugifyOptionValue(option.value, i)}`" 
                      :value="option.value"
                      v-model="buffer[ratioSetting.model]"
                      :disabled="info_only"
                    >
                    <label 
                      :for="`${ratioSetting.model}=${slugifyOptionValue(option.value, i)}`"
                      v-text="option.label" />
                  </dt> 
                  <dd class="settingDesc" v-if="option.desc" v-html="option.desc" :key="ratioSetting.model + '-' + slugifyOptionValue(option.value, i) + '-desc'"></dd>
                </template>
              </dl>
            </div>
            <p v-if="modopt.needsHardReload">Changed settings <b>require</b> a reload to apply.</p>
            <p v-else>Changing some settings may require a reload.</p>
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

import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

const { getModStoreKey } = require('@/mods.js').default

var store;
if (!window.isWebApp) {
  const Store = require('electron-store')
  store = new Store()
} else {
  store = require('@/../webapp/localstore.js')
}

const ipcRenderer = (window.isWebApp ? require('@/../webapp/fakeIpc.js') : require('electron').ipcRenderer)


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
    },
    hasSettings() {
      return this.settingsModel && Object.entries(this.settingsModel).length !== 0
    }
  },
  methods: { 
    slugifyOptionValue(obj, i) {
      if (obj instanceof Object) return i
      else return obj
    },
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

      if (this.modopt.needsArchiveReload && this.$parent.queueArchiveReload) {
        this.$parent.queueArchiveReload()
      }
      // TODO: Track if options have been changed, and hardreload
      // if a reload is required & options have changed requiring it
      // if (this.modopt.needsHardReload && settingsHaveChanged) {
      //   ipcRenderer.invoke('reload')
      // }
    },
    save() {
      if (this.info_only) return
      if (!this.hasSettings) return
      this.$logger.debug("saving", this.buffer, this.storeKey)
      store.set(this.storeKey, this.buffer)
    },
    clearAll() {
      this.$logger.info("Clearing mod store key", this.storeKey)
      store.set(this.storeKey, {})
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
  font-weight: normal;

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

  // Needs to apply to user-injected html, description must be deep.
  .description::v-deep {
    margin: 1em 0;
    img {
      max-width: 100%;
    }

    h1, h2, h3, h4, h5 {
        margin-top: 1em;
    }

    p {
      margin-bottom: 1em;
    }

  }

  .settings {
    font-weight: bold;
    margin: 1em 0;

    dt {
      margin: 10px 0 5px 10px;
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
  }

  .metainfo > span {
    font-weight: normal;

    display: block;
  }

  .includes {
    float: right;
    position: relative;

    border: 4px solid #008C45;
    font-weight: normal;
    font-family: monospace;
    > span {
      width: 100%;
      display: block;

      color: #00E371;
      background: #008C45;
    }
    ul {
      padding: 0 0.5em;
      list-style: inside;
      background: white;
      color: black;
    }
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
