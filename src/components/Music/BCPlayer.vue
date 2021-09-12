<template>
  <div v-if="$localData.settings.bandcampEmbed" >
    <template v-if="track">
      <div class="systemButton musicButton" 
        @click="turnOff" ><fa-icon icon="chevron-up"></fa-icon></div>
      <div class="systemButton musicButton" 
        @click="track = getRandomTrack()" ><fa-icon icon="random"></fa-icon></div>
    </template>
    <template v-else>
      <div class="systemButton musicButton" 
      @click="turnOn" ><fa-icon icon="chevron-down"></fa-icon></div>
    </template>
    <FlashCredit forceShow="true" class="FlashCredit" v-if="track" :trackIds="[track.directory]"/>
    <webview
      class="bandcamp" 
      allowtransparency 
      disablewebsecurity
      seamless
      :src="webviewTargetUrl"
      ref="webview"
      ></webview>
    <!-- <div v-if="track" class="systemButton musicButton" 
      @click="$localData.root.TABS_NEW($resolvePath(`/music/track/${track.directory}`), true)()" ><fa-icon icon="music"></fa-icon></div> -->
    <div v-if="$localData.settings.devMode" class="systemButton musicButton" 
      @click="webview.openDevTools()" ><fa-icon icon="mouse-pointer"></fa-icon></div>
    
  </div>
</template>

<!-- Music: Wolf Spider ([Stop music](javascript:stopBandcampEmbeds())) <iframe alt="Wolf Spider" style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1859004217/size=small/bgcol=ffffff/linkcol=0687f5/track=335878925/transparent=true/" seamless></iframe> -->
<script>
import FlashCredit from '@/components/UIElements/FlashCredit.vue'
const electron = require('electron')

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default {
  name: 'BCPlayer',
  components: {
    FlashCredit
  },
  props: [
    // 'track'
  ],
  data(){
    return {
      webContents: undefined,
      track: undefined,
      showAudio: false
    }
  },
  computed: {
    otherAudioSource() {
      return this.$localData.tabData.tabList
        .map(k => this.$localData.tabData.tabs[k])
        .some(t => t.hasAudio)
    },
    bc_params() {
      return {
        size: 'small',
        bgcol: this.getComputedStyle('--header-bg', '#ffffff').replace("#", ''),
        linkcol: this.getComputedStyle('--font-header', '#0687f5').replace("#", ''),
        // artwork: 'none',
        track: this.track.bandcampId,
        transparent: true
      }
    },
    webviewTargetUrl(){
      return (
        this.track 
        ? `https://bandcamp.com/EmbeddedPlayer/${this.renderBcParams(this.bc_params)}` 
        : "about://blank"
      )
    },
    nonSpoilerAlbums(){
      return Object.keys(this.$archive.music.albums).filter(a => !this.$albumIsSpoiler(a)).map(a => this.$archive.music.albums[a])
    },
    nonSpoilerTracks(){
      return this.nonSpoilerAlbums.map(a => a.tracks)
        .reduce((all, album) => all.concat(album), [])
        .filter(track => this.$archive.music.tracks[track].bandcampId)
    },
    webview() {return this.$refs['webview']}
  },
  methods: {
    turnOn(){
      this.$logger.info("Turning on")
      if (!this.track)
        this.track = this.getRandomTrack()
    },
    turnOff(){
      this.$logger.info("Turning off")
      this.track = undefined
    },
    renderBcParams(bc_params){
      return Object.keys(bc_params).reduce(
        (out, k) => `${out}${k}=${bc_params[k]}/`, 
        "")
    },
    getRandomTrack(){
      return this.$archive.music.tracks[randomChoice(this.nonSpoilerTracks)]
    },
    getComputedStyle(var_name, default_){
      try {
        return getComputedStyle(this.$el).getPropertyValue(var_name).trim() || default_
      } catch {
        return getComputedStyle(document.body).getPropertyValue(var_name).trim() || default_
      }
    },
    isCurrentlyAudible(){
      return this.webview.isCurrentlyAudible()
    }
  },
  mounted(){
    this.webview.addEventListener('did-finish-load', () => {
      if (this.track) {
        this.webview.executeJavaScript(`document.getElementById("player").style.maxWidth = "none"
          var audio = document.querySelector('audio');
          if (!audio) console.log("Audio Complete")
          else {
            audio.addEventListener('ended', () => {
              if (!audio.seeking) console.log("Audio Complete")
            })
            ${this.showAudio ? `audio.style = "height: 42px; position: absolute; right: 68px; padding: 1px 0;"; audio.controls = true;` : ''}
            
            setTimeout(function() {
              if (!audio.playing)
              document.getElementById("big_play_button").click()
            }, 500)
          }
          `)
//         this.webview.insertCSS(`
// div#infolayer, div#linkareaalt {
//     display: none;
// }}
// div#nonartarea {
//   width: unset !important;
// }
//         `)
        this.webview.addEventListener("console-message", (event) => {
          if (event.message == "Audio Complete") {
            this.$logger.info(`Audio complete!`)
            this.track = this.getRandomTrack()
          }
        })

        this.webContents = electron.remote.webContents.fromId(this.webview.getWebContentsId())
      }
    })
  },
  watch: {
    otherAudioSource (to, from) {
      if (to === true) {
        this.turnOff()
      }
    }
  //   'track' (to, from){
  //     this.$logger.info(`Track changed from ${from} to ${to} (${this.webviewTargetUrl})`)

  //     // This seems to be the only way to see if a webview is loaded. Yikes.
  //     try {
  //       this.webview.loadURL(this.webviewTargetUrl)
  //       this.$logger.info(`Loaded url ${this.webviewTargetUrl} (direct)`)
  //     } catch {
  //       this.webview.addEventListener('dom-ready', () => {
  //         this.$logger.info("Track: webview ready")
  //         this.webview.loadURL(this.webviewTargetUrl)
  //         this.$logger.info(`Loaded url ${this.webviewTargetUrl} (dom-ready)`)
  //       }, { once: true })
  //     }
  //   }
  }
}
</script>

<style scoped lang="scss">
  .toolbar {
    display: flex;
    align-items: center;
    > * {
      height: 100%;
    }
    .FlashCredit {
      margin: 4px 8px;
      height: auto;
      flex: 1;
    }
    .musicButton {
      height: 42px;
      width: 42px;
      //padding-top: 2px;
      margin: 0;

      line-height: 46px;
      font-size: 24px;
      text-decoration: none;
      text-align: center;
    }
    .bandcamp {
        flex: 1;
        height: 42px;
        background: var(--header-bg);
    }
  }
</style>
