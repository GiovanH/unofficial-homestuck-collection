<template>
  <div class="wizardWrap">
    <h2 class="pageTitle center">Asset Pack Validator</h2>

    <div v-if="!in_progress && !validation_completed">
      <p>Sometimes things go wrong with a UHC installation. Your asset pack may be missing some files, or your antivirus may have deleted files by mistake. This tool will verify your asset pack and let you know if anything doesn't match what it needs to.</p>
      <AssetPackSelector v-if="!packRootOverride" :showRestart="true" />
    </div>

    <img class="progress-ani" src="@/assets/shell32.gif" 
      :style="{'display': (in_progress ? 'block' : 'none')}"/>

    <table>
      <tr>
        <td>Status</td>
        <td><span class="value" v-text="status" /></td>
      </tr>
      <tr v-if="assetDir">
        <td>Asset Directory</td>
        <td><a class="value" :href="'file://' + assetDir + '/'" v-text="assetDir" /></td>
      </tr>
      <tr v-if="in_progress">
        <td>File</td>
        <td v-if="$isNewReader" class="filepath" style="color: black; background: black;">REDACTED</td>
        <td v-else class="filepath">{{current_file}}</td>
      </tr>
      <tr v-if="eta">
        <td>Time remaining</td>
        <td>{{Math.round(eta / 1000, 0)}} seconds</td>
      </tr>
    </table>

    <progress :max="total" :value="progress"></progress>

    <button class="main" :disabled="!assetDir || busy > 0" @click="validatePackAgainstTable">Validate asset pack</button>

    <hr />

    <div>
      <p v-if='!validation_completed && !in_progress'>
        Ready to verify.
      </p>
      <p v-if='mismatch_paths.length > 0'>
        Some of your files aren't what they're supposed to be. You may have edited some files yourself, or maybe your asset pack was tampered with when you got it.
      </p>
      <p v-if='missing_paths.length > 30'>
        You're missing a lot of files. You may need to redownload the asset pack.
      </p>
      <p v-if='extra_paths.length > 0'>
        Extra files usually don't hurt anything, but might signal something is installed incorrectly. Make sure your mods are in the correct mod folder.
      </p>
      <p v-if='in_progress && !validation_completed && (extra_paths.length == 0) && (missing_paths.length == 0) && (mismatch_paths.length == 0)'>
        Verification in progress...
      </p>
      <p v-if='validation_completed && (extra_paths.length == 0) && (missing_paths.length == 0) && (mismatch_paths.length == 0)'>
        Everything looks correct.
      </p>
    </div>

    <div>
      <div v-if="mismatch_paths && mismatch_paths.length > 0">
        <h3>Mismatched files</h3>
        <ul class="filelist">
          <li v-for="p in mismatch_paths" :key="p" v-html="pathToLink(p)">
            
          </li>
        </ul>
      </div>
      <div v-if="extra_paths && extra_paths.length > 0">
        <h3>Unexpected extra files</h3>
        <ul class="filelist">
          <li v-for="p in extra_paths" :key="p" v-html="pathToLink(p)">
            
          </li>
        </ul>
      </div>
      <div v-if="missing_paths && missing_paths.length > 0">
        <h3>Unexpected extra files</h3>
        <ul class="filelist">
          <li v-for="p in missing_paths" :key="p" v-html="pathToLink(p)">
            
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import AssetPackSelector from '@/components/UIElements/AssetPackSelector.vue'

const Validation = require('@/js/validation.js')

const crc_table_pack = require('@/js/crc_pack.json')
const crc_table_imods = require('@/js/crc_imods.json')

const ipcRenderer = require('IpcRenderer')
const fs = require('fs')
const path = require('path')

export default {
  name: 'Validator',
  props: {
    packRootOverride: {
      type: String,
      default: undefined
    }
  },
  components: {
    AssetPackSelector
  },
  title(ctx){
    return "Validation Tools"
  },
  data: function() {
    return {
      status: "Ready",

      busy: 0,
      state: undefined,

      total: 0,
      progress: 0,
      current_file: "",
      start_time: undefined,
      interval: undefined,
      eta: undefined,
      
      in_progress: false,
      validation_completed: false,

      abort_cb: undefined,

      mismatch_paths: [],
      extra_paths: [],
      missing_paths: [],
      
      my_root_dir: undefined,
      my_table: undefined,
    }
  },
  destroyed() {
    if (this.abort_cb) {
      this.abort_cb()
    }
  },
  computed: {
    assetDir() {
      return this.packRootOverride || this.$localData.assetDir
    }
  },
  methods: {
    // Read table
    shouldTrackPath(p) {
      if (p.startsWith('mods/')) {// || p.startsWith('archive/imods/')) {
        return false
      }
      if (p == "readme.txt") {
        // known error
        return false
      }
      return true
    },
    setEta() {
      if (!this.in_progress) {this.eta = undefined; return}

      const now = Date.now()
      const elapsed = now - this.start_time
      const time_per_file = elapsed/this.progress
      this.eta = time_per_file * (this.total - this.progress)
    },
    pathToLink(p) {
      const dir = this.assetDir + path.sep + p.split('/').slice(0, -1).join('/')
      const link = 'file://' + dir + '/'
      return `<a href="${link}"/>${dir}</a>${p.split('/').slice(-1)}`
    },
    validatePackAgainstTable() {
      // this.validateAgainstTable(this.assetDir + "/archive/imods", json_table_imods)
      const merged_table = {...crc_table_pack}
      for (const key of Object.keys(crc_table_imods.checksums)) {
        merged_table.checksums['archive/imods/' + key] = crc_table_imods.checksums[key]
      }
      this.validateAgainstTable(this.assetDir, merged_table)
    },
    validateAgainstTable(root_dir, reference_table) {
      if (!reference_table || !reference_table.checksums) {
        throw Error("Reference table must be defined!")
      }
      this.status = `Validating`
      this.in_progress = true
      this.validation_completed = false
      this.start_time = Date.now()

      this.total = 0

      const component = this
      const channel = {
        total_paths(count) {
          component.total = count
        },
        pos(i, p) {
          component.status = `Validating ${i}/${component.total}`
          component.progress = i
          component.current_file = p
        },
        mismatch_path(p) {
          component.shouldTrackPath(p) && component.mismatch_paths.push(p)
        },
        extra_path(p) {
          component.shouldTrackPath(p) && component.extra_paths.push(p)
        }
      }

      this.abort_cb = () => {this.$logger.info("Aborting"); channel.abort()}

      this.eta = 90000
      this.interval = setInterval(() => {
        this.setEta()
      }, 1000)

      this.busy += 1
      this.$nextTick(() => {
        Validation.validateFiles(root_dir, reference_table, ['mods'], channel)
        .then(state => {
          this.status = `Validation complete`
          this.busy -= 1
          this.state = state
          this.in_progress = false
          this.abort_cb = undefined
          this.interval && clearInterval(this.interval)

          if (state) {
            this.validation_completed = true
            this.mismatch_paths = state.mismatch_files.filter(this.shouldTrackPath)
            this.extra_paths = state.extra_paths.filter(this.shouldTrackPath)
            this.missing_paths = state.missing_paths.filter(this.shouldTrackPath)
          } else {
            this.validation_completed = false
          }
        })
      })
    },
    // Create table
    pickRoot() {
      ipcRenderer.invoke('pick-directory').then(result => {
        if (!result) return
        this.my_root_dir = result[0]
      })
    },
    buildTable() {
      ipcRenderer.invoke('pick-new-file').then(result => {
        if (!result) return
        const out_path = result[0]

        this.status = `Building checksum table of ${this.my_root_dir}...`
        this.busy += 1

        this.$nextTick(() => {
          this.my_table = Validation.buildTable(this.my_root_dir)
          this.busy -= 1

          this.status = `Writing table to ${out_path}...`
          this.busy += 1

          fs.promises.writeFile(out_path, JSON.stringify(this.my_table, null, 2)).then(_ => {
            this.busy -= 1
            this.status = `Wrote table to ${out_path}`
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
// .wizardWrap{
//   text-align: center;
// }

img.progress-ani {
  height: 120px;
  image-rendering: pixelated;
  margin: 0 auto;
}

button.main {
  margin: 0 auto;
  display: block;
}

p {
  // fuck you *unresets your css*
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

button.main {
  font-size: 22px;
}

ul.filelist {
  list-style: inside;
  max-height: 20em;
  overflow-y: auto;
}

td:first-child {
  padding-right: 1em;
}

td.filepath {
  height: 1.15em;
  overflow: hidden;
  max-width: 400px;
  display: block;
}

progress {
  margin: 1em 0;
  width: 100%;
  box-sizing: content-box !important;
}
/*-------------------------------------------*\
    ProgressBar
\*-------------------------------------------*/

@keyframes sliding {
  0% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(100%);
  }
}

progress {

  &,
  &[value],
  &:not([value]) {
    --determinate-track: repeating-linear-gradient(
        to right,
        #fff 0px,
        #fff 2px,
        transparent 2px,
        transparent 10px
      ),
      linear-gradient(
        to bottom,
        #acedad 0%,
        #7be47d 14%,
        #4cda50 28%,
        #2ed330 42%,
        #42d845 57%,
        #76e275 71%,
        #8fe791 85%,
        #ffffff 100%
      );
    --indeterminate-track: repeating-linear-gradient(
        to right,
        transparent 0px,
        transparent 8px,
        #fff 8px,
        #fff 10px,
        transparent 10px,
        transparent 18px,
        #fff 18px,
        #fff 20px,
        transparent 20px,
        transparent 28px,
        #fff 28px,
        #fff 100%
      ),
      linear-gradient(
        to bottom,
        #acedad 0%,
        #7be47d 14%,
        #4cda50 28%,
        #2ed330 42%,
        #42d845 57%,
        #76e275 71%,
        #8fe791 85%,
        #ffffff 100%
      );
    --indeterminate-track-animation: sliding 2s linear 0s infinite;
    --track-shadow: inset 0px 0px 1px 0px rgba(104, 104, 104, 1);
    --track-height: 14px;
  }

  box-sizing: border-box;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  height: var(--track-height);

  border: 1px solid #686868;
  border-radius: 4px;

  padding: 1px 2px 1px 0px;

  overflow: hidden;
  background-color: #fff;

  -webkit-box-shadow: var(--track-shadow);
  -moz-box-shadow: var(--track-shadow);
  box-shadow: var(--track-shadow);

  /* Determinate styles */
  &[value] {
    /* Chrome, Safari, Edge */
    &::-webkit-progress-bar {
      background-color: transparent;
    }
    &::-webkit-progress-value {
      border-radius: 2px;
      background: var(--determinate-track);
    }
    /* Firefox */
    &::-moz-progress-bar {
      border-radius: 2px;
      background: var(--determinate-track);
    }
  }

  /* Indeterminate styles */
  &:not([value]) {
    /* Apply for Chrome, Safari and Edge but animation only works in Safari */
    &::-webkit-progress-bar {
      width: 100%;
      background: var(--indeterminate-track);
      animation: var(--indeterminate-track-animation);
    }

    /* Solution for Chrome and Edge: animate pseudo element :after */
    & {
      position: relative;
    }
    /* This pseudo element is to hide the not working -webkit-progress-bar animation above for Chrome and Edge */
    &::before {
      box-sizing: border-box;
      content: "";
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background-color: #fff;

      -webkit-box-shadow: var(--track-shadow);
      -moz-box-shadow: var(--track-shadow);
      box-shadow: var(--track-shadow);
    }
    /* Real animated element */
    &::after {
      box-sizing: border-box;
      content: "";
      position: absolute;
      top: 1px;
      left: 2px;

      width: 100%;
      height: calc(100% - 2px);

      padding: 1px 2px 1px 2px;

      border-radius: 2px;

      background: var(--indeterminate-track);
      animation: var(--indeterminate-track-animation);
    }
  }
}
</style>
