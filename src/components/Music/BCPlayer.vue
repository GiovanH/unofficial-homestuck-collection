<template>
  <div class="toolbar">
    <div class="systemButton musicButton" 
      @click="track = getRandomTrack()" ><fa-icon icon="random"></fa-icon></div>
    <webview v-if="$localData.settings.bandcampEmbed" 
      class="bandcamp" 
      allowtransparency 
      disablewebsecurity
      seamless
      src="about://blank"
      ref="webview"
      ></webview>
      <div class="systemButton musicButton" 
      @click="$localData.root.TABS_NEW($resolvePath(`/music/track/${track.directory}`), true)()" ><fa-icon icon="music"></fa-icon></div>
    
  </div>
</template>

<!-- Music: Wolf Spider ([Stop music](javascript:stopBandcampEmbeds())) <iframe alt="Wolf Spider" style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1859004217/size=small/bgcol=ffffff/linkcol=0687f5/track=335878925/transparent=true/" seamless></iframe> -->
<script>
const electron = require('electron')

export default {
  name: 'BCPlayer',
  components: {
  },
  props: [
    // 'track'
  ],
  data(){
    return {
      webContents: undefined,
      track: undefined
    }
  },
  computed: {
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
    nonSpoilerAlbums(){
      return Object.keys(this.$archive.music.albums).filter(a => !this.$albumIsSpoiler(a)).map(a => this.$archive.music.albums[a])
    },
    nonSpoilerTracks(){
      return this.nonSpoilerAlbums.map(a => a.tracks).reduce((all, album) => all.concat(album), [])
    },
    webview(){
      return this.$refs['webview']
    }
  },
  methods: {
    renderBcParams(bc_params){
      return Object.keys(bc_params).reduce(
        (out, k) => `${out}${k}=${bc_params[k]}/`, 
        "")
    },
    setAudioMuted(muted) {
      this.webview.setAudioMuted(muted)
    },
    getRandomTrack(){
      function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
      }
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
  created(){
    this.track = this.getRandomTrack()
  },
  mounted(){
    this.webview.addEventListener('did-finish-load', () => {
      this.webview.executeJavaScript(`document.getElementById("player").style.maxWidth = "none"
        var audio = document.querySelector('audio');
        if (!audio) console.log("Audio Complete")
        else {
          audio.addEventListener('ended', () => {
            if (!audio.seeking) console.log("Audio Complete")
          })
          audio.style = "height: 42px; position: absolute; right: 68px; padding-top: 1px;";
          audio.controls = true;
          
          setTimeout(function() {
            if (!audio.playing)
            document.getElementById("big_play_button").click()
          }, 500)
        }
        `)

      this.webview.addEventListener("console-message", (event) => {
        if (event.message == "Audio Complete") {
          this.$logger.info(`Audio complete!`)
          this.track = this.getRandomTrack()
        }
      })

      this.webview.openDevTools()

      this.webContents = electron.remote.webContents.fromId(this.webview.getWebContentsId())
    })
  },
  watch: {
    'track' (to, from){
      try {
        this.webview.loadURL(`https://bandcamp.com/EmbeddedPlayer/${this.renderBcParams(this.bc_params)}`)
      } catch {
        // This seems to be the only way to see if a webview is loaded. Yikes.
        this.webview.addEventListener('dom-ready', () => {
          this.$logger.info("Track: webview ready")
          this.webview.loadURL(`https://bandcamp.com/EmbeddedPlayer/${this.renderBcParams(this.bc_params)}`)
        }, { once: true })
      }
    }
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
      width: 100%; 
      height: 42px;
      background: var(--header-bg);
  }
</style>
