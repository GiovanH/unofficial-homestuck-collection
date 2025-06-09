<template>
  <div class="errorWithMods" v-if="modsEnabled.length">
    <p>You currently have mods enabled:</p><br>
    <ol class="modlist">
      <li
        v-for="option in modsEnabled"
        :key="option.key"
        :data-value="option.key"
      >
        <b v-text='option.label' />
        <span class='summary' v-if='option.summary' v-text='option.summary' />
      </li>
    </ol>
    <br>
    <p>It's likely one of these is causing the problem, or else some interaction between them. </p><br>
    <p>Please disable all mods and then restart.</p><br>
    <div class="center">
      <button @click="clearEnabledMods()">Disable all and reload</button><br>
    </div>
    <span class="hint">If this issue persists when you re-enable a specific mod, please contact the mod's author!</span>
  </div>

  <div class="errorWithoutMods" v-else>
    <p>This version of the program ({{$data.$appVersion}}) requires asset pack <strong>v{{$data.$expectedAssetVersion}}</strong>, which it expects in:</p><br>
    <p class="center"><strong>{{$localData.assetDir}}</strong></p><br>
    <p>If you just updated the app, you might have asset pack <strong>v1</strong> installed already. This version requires <strong>v{{$data.$expectedAssetVersion}}</strong>; if you don't have it already, go to our <a href='https://bambosh.github.io/unofficial-homestuck-collection/'>website</a> for information on downloading it.</p><br>
    <p>If you moved the asset pack somewhere else, just update the directory below and you'll be able to hop right back into things.</p><br>
    <p>If you were using v2 already but made a change and something broke, try reverting your changes to see if it fixes anything. This program only really checks to make sure the JSON data is legible and that the Flash plugin exists, so that's probably where your problems are.</p><br>
    <div class="center" v-if="!$isWebApp">
      <button @click="locateAssets()">Locate Asset Pack v{{$data.$expectedAssetVersion}}</button>
      <span class="hint">Directory: {{assetDir || 'None selected'}}</span>
      <span v-if="isExpectedAssetVersion === false" class="error hint">That looks like asset pack v{{selectedAssetVersion}}, which is not the correct version. Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}</strong></span>
    </div>

    <div class="center">
      <button class="letsroll" :disabled="!isExpectedAssetVersion" @click="errorModeRestart()">All done. Let's roll!</button>
    </div>
  </div>
</template>

<script>
const ipcRenderer = require('IpcRenderer')

export default {
  name: 'SetupErrorRecovery',
  data: function() {
    return {
      assetDir: undefined,
      selectedAssetVersion: undefined
    }
  },
  computed: {
    modsEnabled() {
      return this.$localData.settings.modListEnabled.map((key) =>
        this.$root.$modChoices[key]).filter(val => !!val)
    },
    isExpectedAssetVersion() {
      return (this.selectedAssetVersion == this.$data.$expectedAssetVersion)
    }
  },
  mounted() {

  },
  methods: {
    clearEnabledMods(){
      this.$localData.settings["modListEnabled"] = []
      this.$localData.VM._saveLocalStorage()

      this.loadingTooLongTimeout = false

      this.modSoftRestart()
    },
    locateAssets(){
      ipcRenderer.invoke('locate-assets', {restart: false}).then(result => {
        this.assetDir = result || this.assetDir
        this.checkAssetVersion(this.assetDir)
      })
    },
    checkAssetVersion(assetDir){
      ipcRenderer.invoke('check-archive-version', {assetDir}).then(result => {
        this.selectedAssetVersion = result
        this.isExpectedAssetVersion = (result == this.$data.$expectedAssetVersion)
        this.$logger.info("Version check: got", result, "eq?", this.$data.$expectedAssetVersion, this.isExpectedAssetVersion)
      })
    },
    errorModeRestart() {
      if (!!this.assetDir && this.assetDir != this.$localData.assetDir) this.$localData.root.SET_ASSET_DIR(this.assetDir)

      // SET_ASSET_DIR flushes persistent store for us
      ipcRenderer.invoke('restart')
    },
    modSoftRestart() {
      this.$localData.root.applySaveIfPending()
      ipcRenderer.send("RELOAD_ARCHIVE_DATA")
    }
  },
  watch: {
  }
}
</script>
