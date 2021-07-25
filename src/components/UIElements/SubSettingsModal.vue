<template>
  <transition name="modal">
    <div class="modalMask" v-if="isActive" tabindex="-1" @keydown.esc="close()" @click.self="close()">
      <div class="modalContainer" >
        <div class="modalContent">
          <h1>{{title}}</h1>
          <div class="bools">
            <h2>Boolean Settings</h2>
            <dl>
              <template v-for="boolSetting in settingListBoolean">
                <dt :key="boolSetting.model"><label>
                  <input type="checkbox" 
                    :name="boolSetting.model" 
                    v-model="buffer[boolSetting.model]"
                  >{{boolSetting.label}}</label></dt> 
                  <!-- the spacing here is made of glass -->
                <dd class="settingDesc" v-html="boolSetting.desc" :key="boolSetting.model + '-desc'"></dd>
              </template>
            </dl>

            <dl class="radios">
              <template v-for="ratioSetting in settingListRadio">
                <label v-text="ratioSetting.label" :key="ratioSetting.model + '-label'"></label>
                <dd v-html="ratioSetting.desc" :key="ratioSetting.model + '-desc'"></dd>
                <template v-for="option in ratioSetting.options">
                  <dt :key="option.value"><label>
                    <input type="radio" 
                      :name="`${ratioSetting.model}=${option.value}`" 
                      :value="option.value"
                      v-model="buffer[ratioSetting.model]"
                    >{{option.label}}</label>
                  </dt> 
                  <dd class="settingDesc" v-html="option.desc" :key="option.value + '-desc'"></dd>
                </template>
              </template>
            </dl>
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

export default {
  name: 'modal',
  props: ['tab'],
  components: {
  },
  data() {
    return {
      isActive: false,
      title: undefined,
      settingsModel: undefined,
      storeKey: undefined,
      buffer: undefined
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
    openMod(modopt) {
      this.settingsModel = modopt.settingsmodel
      this.title = modopt.label
      this.storeKey = getModStoreKey(modopt.key, null)
      this.buffer = store.get(this.storeKey) || {}

      this.isActive = true
      this.$nextTick(() => {
        this.$el.focus()
      })
    },
    close() {
      this.save()
      this.isActive = false 
      this.settingsModel = undefined
      this.title = undefined
      this.buffer = undefined
      this.storeKey = undefined
    },
    save() {
      this.$logger.info("saving", this.buffer, this.storeKey)
      store.set(this.storeKey, this.buffer)
    }
  },
  watch: {
    'tab.url'() {
      this.close()
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
}

.modalContent {
  width: 100%;
  height: 100%;
  overflow: auto;

  * {
    display: block;
  }
}

.modalLinks {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  color: #ffffffcc;
  
  span {
    color: #ffffffcc;
    font-size: 12px;
    font-weight: normal;
    font-family: Verdana, Geneva, sans-serif;
    transition: color 0.15s;
      user-select: none;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: #ffffff;
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
