<template>
  <div class="assetWizard">
    <span class="hint">Asset Pack Location: {{assetDir || 'None selected'}}</span>
    <button @click="locateAssets()" v-text="findStr" />
    <!-- TODO: Unify this warning with the popup you get for entering an incorrect path -->
    <span v-if="selectedAssetVersion && isExpectedAssetVersion === false" class="error hint">
      That looks like asset pack v{{selectedAssetVersion}}, which is not the correct version. 
      Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}.</strong>
    </span>
    <button v-if="showRestart &&  this.assetDir != this.$localData.assetDir" @click="validateAndRestart()">
      Apply and restart
    </button>
      
  </div>
</template>

<script>
const ipcRenderer = require('IpcRenderer')

export default {
  name: 'AssetPackSelector',
  emits: ['change'],
  components: {
  },
  props: {
    showRestart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      assetDir: undefined,
      selectedAssetVersion: undefined,
    }
  },
  mounted() {
    if (this.$localData.assetDir) {
      this.assetDir = this.$localData.assetDir
    }
  },
  computed: {
    findStr() {
      if (this.assetDir) {
        return "Pick new location"
      } else {
        return "Locate Assets"
      }
    },
    state() {
      let isValid = true
      if (!this.isExpectedAssetVersion()) isValid = false
      if (!this.assetDir) isValid = false
      return {
        assetDir: this.assetDir,
        isValid: isValid
      }
    }
  },
  watch: {
    'state'(to, from) {
      this.$emit('change', this.state)
    }
  },
  methods: {
    async locateAssets(){
      const result = await ipcRenderer.invoke('locate-assets', {restart: false})
      this.assetDir = result || this.assetDir
      await this.checkAssetVersion(this.assetDir)
    },
    async checkAssetVersion(assetDir){
      ipcRenderer.invoke('check-archive-version', {assetDir}).then(result => {
        this.selectedAssetVersion = result
        this.$logger.info("Version check: got", result, "eq?", this.$data.$expectedAssetVersion, this.isExpectedAssetVersion)
      })
    },
    isExpectedAssetVersion() {
      return (this.selectedAssetVersion == this.$data.$expectedAssetVersion)
    },
    validateAndRestart(){
      if (this.$isWebApp) {
        this.$localData.root.SET_ASSET_DIR('web')
      } else {
        this.$localData.root.SET_ASSET_DIR(this.assetDir)

        ipcRenderer.invoke('restart')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .assetWizard {
    text-align: center;
  }
  .hint {
    display: block;
    font-size: 13px;
    color: #888888;
  }
</style>
