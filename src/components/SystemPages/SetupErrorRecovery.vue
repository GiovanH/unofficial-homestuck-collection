<template>
  <div style="max-width: 100%;">
    <div v-if="$root.loadStage === 'ARCHIVE'">
      <p>This error was caused by an invalid asset pack.</p>

      <AssetPackSelector :showRestart="true" />
    </div>
    <div class="errorWithMods" v-else-if="usingMods">
      <div v-if="responsibleModChoices.length > 0">
        <p>This error was caused by these mods:</p><br>
        <ol class="modlist">
          <li
            v-for="option in responsibleModChoices"
            :key="option.key"
            :data-value="option.key"
          >
            <b v-text='option.label' />
            <span class='summary' v-if='option.summary' v-text='option.summary' />
          </li>
        </ol>
        <br>
        <p>It's likely one of these is causing the problem, or else some interaction between them. </p><br>
        <p>Please disable these mods and then restart.</p><br>
        <div class="center">
          <button @click="disableMods($root.loadErrorResponsibleMods)">Disable these mods and reload</button><br>
        </div>
      </div>
      <div v-else>
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
      </div>
      <span class="hint">If this issue persists when you re-enable a specific mod, please contact the mod's author!</span><br />

      <p>Alternatively, you can try one of the less-common diagnostics:</p>
      <div class="center">
        <button class="less-common" @click="doReloadNoRecover()">Reload</button><br>
        <button class="less-common"  @click="doFullRestart()">Restart</button><br>
      </div>
    </div>

    <div class="errorWithoutMods" v-else>
      <p>This usually means the location of the asset pack has moved. This version of the program ({{$data.$appVersion}}) requires asset pack <strong>v{{$data.$expectedAssetVersion}}</strong>, which it expects in:</p><br>
      <p class="center"><strong>{{$localData.assetDir}}</strong></p><br>
      <p>If you just updated the app, you might have asset pack <strong>v1</strong> installed already. This version requires <strong>v{{$data.$expectedAssetVersion}}</strong>; if you don't have it already, go to our <a href='https://bambosh.github.io/unofficial-homestuck-collection/'>website</a> for information on downloading it.</p><br>
      <p>If you moved the asset pack somewhere else, just update the directory below and you'll be able to hop right back into things. If you were using v2 already but made a change and something broke, try reverting your changes to see if it fixes anything.</p><br>

      <p>If you're getting a different kind of error, you can report a bug. </p><br>

      <div class="center" v-if="!$isWebApp">
        <button @click="locateAssets()">Locate Asset Pack v{{$data.$expectedAssetVersion}}</button>
        <span class="hint">Directory: {{assetDir || 'None selected'}}</span>
        <span v-if="selectedAssetVersion && isExpectedAssetVersion === false" class="error hint">That looks like asset pack v{{selectedAssetVersion}}, which is not the correct version. Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}</strong></span>
      </div>

      <div class="center">
        <button class="letsroll" :disabled="!isExpectedAssetVersion" @click="errorModeRestart()">All done. Let's roll!</button>
      </div>
    </div>
    <div v-if="guruMediation">
      <hr />
      <h2>Guru Mediation</h2><br />
      <div v-html="guruMediation" />
    </div>
    <div v-if="$root.loadError">
      <hr />
      <p>If you report this error, please provide these error details:</p>
      <pre v-text="$root.loadError.stack" class="stack"/>
      <div v-if="!usingMods">
        <a :href="bug_report_link" target="_blank" class="anchorButton bugreport">Report a bug</a>
      </div>
    </div>
  </div>
</template>

<script>
import errorReporting from '@/js/errorReporting'
import Mods from "@/mods.js"
import AssetPackSelector from '@/components/UIElements/AssetPackSelector.vue';

const ipcRenderer = require('IpcRenderer')

export default {
  name: 'SetupErrorRecovery',
  components: {AssetPackSelector},
  data: function() {
    return {
      assetDir: undefined,
      selectedAssetVersion: undefined
    }
  },
  computed: {
    modsEnabled() {
      if (!this.$localData.settings.modListEnabled) return []

      return this.$localData.settings.modListEnabled.map((key) =>
        this.$root.modChoices[key]).filter(val => !!val)
    },
    usingMods() {
      if (this.modsEnabled.length) return true
      if (this.$root.loadErrorResponsibleMods) return true
      // if (this.$root.loadError) {
      //   if (this.$root.loadError.stack.includes('mods')) {
      //     return true
      //   }
      // }
      return false
    },
    responsibleModChoices() {
      if (!this.$root.loadErrorResponsibleMods) return []

      return this.$root.loadErrorResponsibleMods
        .map(k => this.$root.modChoices[k])
        .filter(Boolean)
    },
    isExpectedAssetVersion() {
      return (this.selectedAssetVersion == this.$data.$expectedAssetVersion)
    },
    bug_report_link(){
      return errorReporting.createIssueLink({
        "App": this.$data?.$appVersion,
        "Asset Pack": this.$archive?.version
      }, this.$root.loadError)
    },
    guruMediation() {
      const ans = []
      if (this.$root.loadStage === 'ARCHIVE') {
        ans.push(`<p>It looks like something is wrong with your asset pack.</p>`)
        if (this.$root.loadError?.code === 'ENOENT') {
          ans.push(`<p>We checked to make sure a key file existed and it did not.</p>`)
        }
        if (this.$root.loadError?.code === 'EPERM') {
          ans.push(`<p>You don't have permissions to read and write from the asset pack. 
            The collection needs to be able to read and edit files in this directory. 
            Please move the asset pack to another directory, or change the permissions.</p>`)
        }
      }
      if (ans.length > 0) {
        return ans.join('')
      } else {
        return undefined
      }
    }
  },
  mounted() {
    window.recovery = this;
  },
  methods: {
    doReloadNoRecover: () => ipcRenderer.invoke('reload'),
    doFullRestart: () => ipcRenderer.invoke('restart'),
    clearEnabledMods(){
      this.$localData.settings["modListEnabled"] = []
      this.$localData.VM._saveLocalStorage()

      this.loadingTooLongTimeout = false

      this.modSoftRestart()
    },
    disableMods(mod_list){
      Mods.removeModsFromEnabledList(mod_list)

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

      this.$root.loadState = "WAITING_ON_DATA"
      this.$root.loadError = undefined
      this.$root.loadErrorResponsibleMods = undefined
      ipcRenderer.send("RELOAD_ARCHIVE_DATA")
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss">

button {
  font-size: 110%;
}

button.less-common {
  font-size: 80%;
}
.modlist li {
  /*list-style-position: inside;*/
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: -1px;
  padding: 0.2em;
  .summary:before {
    content: " - ";
  }
}

a.anchorButton {
  padding: 10px 50px;
  margin: 0 1em;
  width: 225px;
  border-radius: 3px;
  background-color: #3edd41;
  display: inline-block;
  text-decoration: none;
  font-weight: bold;
  text-align: center;

  color: white !important;

  &:hover {
    background-color: #37bc3a;
  }
  &.bugreport {
    background-color: #ff3b22;
    &:hover {
      background-color: #e4331c;
    }
  }
}
.stack {
  // white-space: pre-wrap;
  overflow-x: auto;
  font-size: 14px;
}
</style>