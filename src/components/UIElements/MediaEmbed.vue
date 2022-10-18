<template>
  <img    v-if="getMediaType(url) === 'img'" :src='$getResourceURL(url)' @dragstart="drag($event)" alt />
  <video  v-else-if="getMediaType(url) ==='vid' && gifmode != undefined" :src='$getResourceURL(url)' :width="videoWidth" autoplay="true" muted="true" loop disablePictureInPicture />
  <video  v-else-if="getMediaType(url) ==='vid' && gifmode == undefined" :src='$getResourceURL(url)' :width="videoWidth" controls controlsList="nodownload" disablePictureInPicture alt />
  <div    v-else-if="getMediaType(url) === 'swf'" class="swf-renderer"></div>

  <component v-else-if="getMediaType(url) === 'html'"
  :is="frameType"
  :src='resolveFrameUrl(url)' 
  ref='frame'
  :style="`width: ${flashProps.width}px; height: ${flashProps.height}px; max-width: 100%; max-height: 100%;`"
  @did-finish-load="initHtmlFrame" seamless />
  <!-- <button @click='$refs.frame.openDevTools()'>Webframe</button> -->

  <div v-else-if="getMediaType(url) === 'txt'" v-html="getFile(url)"  class="textEmbed" />
  <audio v-else-if="getMediaType(url) === 'audio'" class="audioEmbed" controls controlsList="nodownload" :src="this.$getResourceURL(url)" type="audio/mpeg" />
</template>

<script>
import fs from 'fs'
import path from 'path'
import Resources from "@/resources.js"

export default {
  name: "MediaEmbed",
  props: ['url', 'gifmode', 'webarchive'],
  emits: ['blockedevent'], 
  mounted() {
    if(this.$el.classList.contains("swf-renderer")) {
      window.onhashchange = (e) => {
        if (window.location.hash != '#/unset') {
          let hash = window.location.hash.substring(2).split('&')
          window.location.hash = '#unset';
          hash.forEach((func)=>{
            console.log(func);
            this.invokeFromFlash(func)
          })
        }
      }

      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();

      this.$el.appendChild(player);

      const data = this.getFileBuffer(`assets:/${this.url}`);
      const config = {
                    autoplay: "on",
                    unmuteOverlay: "hidden",
                    preloader: false,
                    letterbox: "on",
                    contextMenu: false,
                    quality: "best",
                    allowScriptAccess: true,
                };

      player.load({ data, ...config });
    }
  },
  data() {
    return {
      indexedFlashProps: {
        // CAPTCHA GENERATOR
        "captchas": {width: 1100, height: 600},
        // SWEET CRED
        "kidshome": {width: 800, height: 600},
        // CLOCKS
        "03848": {height: 1612},
        "03857": {height: 1612},
        "06649": {height: 1612},
        // GENESIS FROG 
        "04015": {height: 800},
        // JOHN/JANE CURSOR
        "05721": {height: 800},
        "06202": {height: 800},
        // SCRATCH ALTERNIA 
        "04050": {height: 650},
        // A6A6I1 SELECTION SCREEN
        "06277": {height: 650},
        // A6A6I5 SELECTION SCREENS
        "07482": {height: 650},
        "07668": {height: 650},
        "07677": {height: 650},
        "07682": {height: 650},
        "07689": {height: 650},
        "07692": {height: 650},
        "07696": {height: 650},
        "07709": {height: 650},
        "07721": {height: 650},
        "07729": {height: 650},
        "07762": {height: 650},
        "07800": {height: 650},
        "07905": {height: 650},        
        // TYPHEUS, YALDABOATH
        "05994": {height: 1400},
        "07083": {height: 1400},
        // HOMOSUCK ANTHEM
        "06240": {
          bgcolor: '#073C00',
          height: 576
        },
        // CASCADE
        "04106": {
          bgcolor: '#262626',
          width: 950, height: 650
        },
        "cascade": {
          bgcolor: '#262626',
          width: 950, height: 650
        },
        // DOTA
        "04812": {
          bgcolor: '#000',
          width: 950,
          height: 650
        },
        // A6A6I4 FULLPAGERS
        "07095": {width: 950, height: 650, rawStyle: 'position:relative;top:-21px;'},
        "07122": {width: 950, height: 650, rawStyle: 'position:relative;top:-19px;'},
        // SHE'S 8ACK
        "07402": {width: 950, height: 650},          
        // A6A6I1 SELECTION SCREENS
        "06379": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },
        "06394": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },
        "06398": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },
        "06402": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },
        "06413": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },
        // VRISKAGRAM 
        "07445": {
          bgcolor: '#C6C6C6',
          width: 950, height: 600
        },

        // REMEM8ER
        "07953": {
          bgcolor: '#C6C6C6',
          width: 950,
          height: 675
        },
        // HUGBUNP
        "07921": {
          width: 950,
          height: 700
        },
        // GOLD PILOT
        "A6A6I1": {
          filename: "A6A6I1",
          bgcolor: '#C6C6C6',
          width: 950,
          height: 750
        },
        // GAME OVER
        "06898": {
          bgcolor: '#042300',
          width: 950, height: 786
        },
        // CROWBARS
        "05492": {width: 950, height: 1160},
        "05777": {width: 950, height: 1160},
        // TRICKSTER BANNER
        "menu": {width: 950, height: 20},
        // TRICKSTER BANNER
        "echidna": {width: 30, height: 30},
        "Cheerfulbear%20-%20PLAY%20ME": {width: 1120, height: 750},
        "Dear%20Andrew": {width: 1120, height: 750},
        "SBaHJ%20Origins": {width: 1120, height: 750}
      },
      gameOver: {
        count: 0,
        steps: [22433, 82300, 94800, 118566, 143930, 146973, 224876]
      },
      cropHeight: {
        '04106': '550px',
        '06240': '560px',
        'A6A6I1': '522px',
        '07095': '521px',
        '07122': '631px',
        '07445': '522px',
        '07953': '522px'
      },
      audioDelay: {
        '00980_1': 1500,
        '00980_bolin_1': 3100,
        '01070': 1500,
        '01070_bolin': 2500,
        '01073': 6150,
        '01267': 250,
        '01407': 2500,
        '01641': 2550,
        '01668': 2950,
        '01801': -100,
        '01931': -125,
        '02577': 300,
        '02625': 2100,
        '02786': -200,
        '02847': 4250,
        '02926': 850,
        '03085': 8000,
        '03676': 60,
        '03692': -100,
        '03741': 6800,
        '04106_1': -50,
        '04106_2': 575,
        '04106_3': 1550,
        '04106_4': 600,
        '04106_5': 1200,
        '04108': -140,
        '04110': 3375,
        '04272': 3650,
        '04370_1': -100,
        '04370_2': 450,
        '04387': 600,
        '04483': 1860,
        '04569': 1300,
        '04614': 600,
        '04662': 1600,
        '04939': 2950,
        '04941': 2800,
        '05024': -100,
        '05235': 2150,
        '05249': 12050,
        '05258': -200,
        '05258_replay': 0,
        '05435': 50,
        '05509': -100,
        '06898': 1300,
        '07095': -100,
        '07445': 4530,
        '11931': -125,
        '17445': 1700,
        'A6A6I1': -100,
        'darkcage': 350,
      },
      audio: [],
      source: undefined,
      lastStartedAudio: undefined,
      shouldEnsaftenWebviews: true,

      timer: {
        interval: undefined,
        callback: undefined,
        start: undefined,
        delay: undefined,
        remaining: undefined
      }
    }
  },
  computed: {
    frameType() {
      if (this.webarchive) return 'webview'
      return 'iframe'
    },
    videoWidth() {
      const filename = path.parse(this.url).name
      let width = 950
      switch (filename){
        case "08120": 
          width = 1280
          break
      }

      return `${width}px`
    },
    flashProps() {
      // ID, before any underscores
      let filename = path.parse(this.url).name.split("_")[0]
      this.$logger.info("Getting flash props for", filename, this.url)

      const defaultProps = {
        id: filename, 
        width: 650, 
        height: 450, 
        bgcolor: '#fff',
        rawStyle: ''
      }

      let customProps = this.indexedFlashProps[filename] || {}

      if (Object.keys(customProps).length)
        this.$logger.info("Custom props for flash", filename, customProps)

      return {...defaultProps, ...customProps}
    },
    audioTracks() {
      const ret =  this.$archive.audioData[this.url.replace("_hq.swf", ".swf")] || []
      this.$logger.info("Getting audio tracks for", this.url, this.url.replace("_hq.swf", ".swf"), ret)
      return ret
    }
  },
  methods: {
    initHtmlFrame(event) {
      if (this.frameType == 'webview') {
        const webview = event.srcElement

        // copy console messages
        webview.addEventListener("console-message", (event) => {
          this.$logger.info(event.message)
          if (event.message == "!!onDisabledEvent") {
            this.$emit('blockedevent')
          }
        })

        // ensaften webviews
        if (this.shouldEnsaftenWebviews) {
          webview.executeJavaScript(`
console.log("initHtmlFrame")

document.addEventListener('click', function (e) {
  let shouldBlockClick = false

  var url = e.target.href;
  shouldBlockClick = shouldBlockClick || (url === undefined)

  const is_outlink = /^http(s{0,1}):\\/\\//.test(url) && !/^http(s{0,1}):\\/\\/localhost/.test(url)  // see src/resources.js
  shouldBlockClick = shouldBlockClick || is_outlink  

  console.log('element-clicked with path', url, "is_outlink:", is_outlink, "should block:", shouldBlockClick);
  if (shouldBlockClick) {
    e.preventDefault()
    e.stopPropagation()
    console.log("!!onDisabledEvent")
    return false
  }
}, true)
          `)
        }
      }
    },
    resolveFrameUrl(url){
      this.$logger.info('Resolving iframe url', url, Resources.resolveURL(url))
      return Resources.resolveURL(url)
    },
    invokeFromFlash(func) {
      // getURL "about:srcdoc#link?url" ""

      // getURL "about:srcdoc#audioInit" ""
      // getURL "about:srcdoc#audioStart?n" ""
      // getURL "about:srcdoc#audioPause" ""
      // getURL "about:srcdoc#audioResume" ""
      // getURL "about:srcdoc#audioReset" ""
      // getURL "about:srcdoc#audioSeek&n" ""

      // getURL "about:srcdoc#vol?1" ""
      // getURL "about:srcdoc#vol?0.6" ""
      // getURL "about:srcdoc#vol?0.2" ""
      // getURL "about:srcdoc#vol?0" ""

      // getURL "about:srcdoc#heightStart?mode" ""
      // getURL "about:srcdoc#heightPause" ""
      // getURL "about:srcdoc#heightResume" ""
      // getURL "about:srcdoc#heightReset" ""

      // getURL "about:srcdoc#gameOver" "" <- Get ready for some bullshit

      this.$logger.debug(func)
      const [funcName, param] = func.split('?')
      switch (funcName) {
        case 'audioInit':
          this.$logger.debug(`Creating audio`)
          this.audioInit(param)
          break
        case 'audioStart':
          this.$logger.debug(`Playing audio (${param})`)
          this.audioStart(param)
          break
        case 'audioPause':
          this.$logger.debug(`Pausing audio`)
          this.audioPause()
          break
        case 'audioResume':
          this.$logger.debug(`Resuming audio`)
          this.audioResume()
          break
        case 'audioReset':
          this.$logger.debug(`Resetting audio`)
          this.audioReset()
          break
        case 'audioSeek': 
          this.$logger.debug(`Seeking audio to ${param}`)
          this.audioSeek(param)
          break
        case 'vol': 
          this.$logger.debug(`Setting volume to ${param}`)
          this.audioVolume(param)
          break
        case 'link':
          this.$pushURL(param, this.$parent.tab.key)
          break
        case 'heightStart':
          if (this.$localData.settings.jsFlashes) {
            this.$logger.debug(`Starting height (${param})`)
            this.heightStart(param)
          }
          break
        case 'heightPause':
          if (this.$localData.settings.jsFlashes) {
            this.$logger.debug(`Pausing height (${param})`)
            this.pauseTimer()
          }
          break
        case 'heightResume':
          if (this.$localData.settings.jsFlashes) {
            this.$logger.debug(`Resuming height (${param})`)
            this.resumeTimer()
          }
          break
        case 'heightReset':
          if (this.$localData.settings.jsFlashes) {
            this.$el.style.transition = 'height 0.2s'
            this.$el.style.height = this.cropHeight[this.flashProps.id]
          }
          break

        case 'gameOver':
          if (this.$localData.settings.jsFlashes) {
            this.$logger.info("Initializing dynamic game over page")
            this.gameOver.count = 0
            this.startTimer(() => {
              const next_step = this.gameOver.steps[this.gameOver.count]
              if (Date.now() >= this.timer.start + next_step) {
                this.gameOver.count++
                this.$logger.info("Game over: reached count", this.gameOver.count, "at", next_step)

                if (this.gameOver.count >= this.gameOver.steps.length) {
                  clearInterval(this.timer.interval)
                  this.timer = {}
                }
              }
            }, 0)
          }
          break
      }
    },

    audioInit() {
      if (this.audio.length < 1) {
        if (this.audioTracks.length > 0) {
          this.audioTracks.forEach(track => {
            this.$logger.info("Adding track", track.href)
            this.audio.push(this.createAudioElement(track))
          })
        }
      } else {
        this.audioReset()
      }
    },
    createAudioElement(track) {
      const audioElement = new Audio(this.$getResourceURL(track.href))

      audioElement.preload = 'auto'
      
      audioElement.loop = track.loop

      audioElement.load()

      return audioElement
    },
    audioStart(n = 1) {
      this.audioInit()
      let cascadeDelay = 0
      if (this.flashProps.id == '04106') {
        if (n.toString().endsWith('.5')) {
          n = n.toString().substr(0, 1)
          if (n == '1')
            cascadeDelay = -52900
          else if (n == '4')
            cascadeDelay = -125250
          else if (n == '5')
            cascadeDelay = -77900
        }
      }
      n = parseInt(n) - 1
      if (!this.audio[n]) return

      this.lastStartedAudio = n
      let replay = false

      if (this.audio[n].currentTime > 30) {
        this.audioReset()
        replay = true
      }

      let delay = 0
      if (cascadeDelay)
        delay = cascadeDelay
      else if (this.audioTracks && this.audioTracks[0].audioDelay)
        delay = this.audioTracks[0].audioDelay
      else if (replay && (`${this.flashProps.id}_replay`) in this.audioDelay)
        delay = this.audioDelay[`${this.flashProps.id}_replay`]
      else if (`${this.flashProps.id}_${n + 1}` in this.audioDelay)
        delay = this.audioDelay[`${this.flashProps.id}_${n + 1}`]
      else if (this.flashProps.id in this.audioDelay)
        delay = this.audioDelay[this.flashProps.id]
      this.$logger.info(`${this.flashProps.id}_${n + 1}: ${delay}ms delay`)
      if (delay > 0) {setTimeout(() => {if (this.audio[n]) this.audio[n].play()}, delay)} else {
        if (delay < 0)
          this.audio[n].currentTime = -0.001 * delay
        this.audio[n].play()
      }
    },
    audioPause() {
      // Flash can take up to one frame (40ms) to play/pause. This is the best we can do to smooth that out.
      this.audio[this.lastStartedAudio].pause()
    },
    audioResume() {
      setTimeout(() => {if (this.audio[this.lastStartedAudio]) this.audio[this.lastStartedAudio].play()}, 30)
    },
    audioReset() {
      this.audio.forEach(track => {
        track.pause()
        track.currentTime = 0.0
      })
    },
    audioVolume(vol) {
      this.audio.forEach(track => {
        track.volume = vol
      })
    },
    audioSeek(param) {
      this.audio[this.lastStartedAudio].currentTime = param
    },

    heightStart(n) {
      if (this.$el.style.height != this.cropHeight[this.flashProps.id]) {
        this.$el.style.transition = 'height 0.2s'
        this.$el.style.height = this.cropHeight[this.flashProps.id]
        window.getComputedStyle(this.$el)
      }
      let time
      let transition = 'height 0.2s'
      let heightTo = this.flashProps.height + 'px'
      switch (n) {
        case 'cascade1':
          time = 60900
          transition = 'height 8s linear'
          break
        case 'cascade1.5':
          time = 8067
          transition = 'height 8s linear'
          break
        case 'A6A6I1':
          time = 18833
          transition = 'height 17.53s cubic-bezier(0.12, 0, 0.39, 0)'
          break
        case 'pipeorgan':
          time = 100100
          // time = 100
          transition = 'height 11.3s linear'
          heightTo = '629px'
          break
        case 'vriskagram': 
          time = 10650
          transition = 'height 1.3s'
          break
        case 'remem8er': 
          time = 16130
          transition = 'height 10s'
          break
      }

      if (time) {
        this.startTimer(() => {
          if (Date.now() >= this.timer.start + this.timer.delay) {
            this.$el.style.transition = transition
            this.$el.style.height = heightTo

            clearInterval(this.timer.interval)
            this.timer = {}
          }
        }, time)
      } else {
        this.$el.style.transition = transition
        this.$el.style.height = heightTo
      }
    },
    startTimer(callback, delay){
      this.timer.callback = callback
      this.timer.delay = delay
      this.resumeTimer()
    },
    pauseTimer(){
      clearInterval(this.timer.interval)
      this.timer.delay -= Date.now() - this.timer.start - 50 // Mitigate paused track from drifting
    },
    resumeTimer(){
      this.timer.start = Date.now()
      clearInterval(this.timer.interval)
      this.timer.interval = setInterval(this.timer.callback, 20)
    },

    getFileBuffer(url) {
      return fs.readFileSync(this.$mspaFileStream(url))
    },
    getFile(url) {
      return fs.readFileSync(this.$mspaFileStream(url), 'utf8')
    },
    getMediaType (url) {
      url = url.toLowerCase()
      const ext = path.extname(url)
      switch (ext) {
        case ".swf":
          return 'swf'
        case ".mp4":
        case ".webm":
          return 'vid'
        case ".txt":
          return 'txt'
        case ".html":
          return 'html'
        case ".mp3":
        case ".wav":
          return 'audio'
        default:
          return 'img'
      }
    },
    drag(e) {
      e.preventDefault()
      e.dataTransfer.effectAllowed = 'copy'
      require('electron').ipcRenderer.send('ondragstart', this.$mspaFileStream(this.url))
    }
  },
  updated() {
    this.audio.forEach(track => {
      track.pause()  
    })
    this.audio = []
    this.pauseTimer()
    this.$el.style = ''
  },
  beforeDestroy() {
    this.audio.forEach(track => {
      track.pause()  
    })
    this.audio = []
    this.pauseTimer()
  }
}
</script>

<style lang="scss" scoped>
  .textEmbed {
    overflow-y: scroll;
    background-color:white;
    white-space: pre-wrap;
    width: 80vw;
    height: 70vh;
    max-width: 1155px;
    max-height: 900px;
    padding: 10px;
  }
  audio {
    width: 100%;
    min-width: 650px;
  }
</style>
