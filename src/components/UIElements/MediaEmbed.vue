<template>
  <img    v-if="getExt(url) === 'img'" :src='$resolveURL(url)' @dragstart="drag($event)" alt />
  <video  v-else-if="getExt(url) ==='vid'" :src='$resolveURL(url)' :width="videoWidth" controls controlsList="nodownload" disablePictureInPicture alt />
  <iframe v-else-if="getExt(url) === 'swf'" :key="url" :srcdoc='flashSrc' :width='flashProps.width' :height='($localData.settings.jsFlashes && flashProps.id in cropHeight) ? cropHeight[flashProps.id] : flashProps.height' @load="initIframe()" seamless/>
  <!-- HTML iframes must not point to assets :c -->
  <iframe v-else-if="getExt(url) === 'html'" 
  :src='resolveFrameUrl(url)' 
  width="650px" height="450px" class="sburb" seamless />
  <div v-else-if="getExt(url) === 'txt'" v-html="getFile(url)"  class="textEmbed" />
  <audio v-else-if="getExt(url) === 'audio'" class="audioEmbed" controls controlsList="nodownload" :src="this.$resolveURL(url)" type="audio/mpeg" />
</template>

<script>
import fs from 'fs'
import path from 'path'
import Resources from "@/resources.js"

// TODO: All these flash properties and timings should be stored as data
export default {
  props: ['url'],
  data() {
    return {
      gameOver: {
        count: 0,
        steps: [22433, 82300, 94800, 118566, 143930, 146973, 224876]
      },
      cropHeight: {
        '04106': '550px',
        '06240': '560px',
        A6A6I1: '522px',
        '07095': '521px',
        '07122': '631px',
        '07445': '522px',
        '07953': '522px'
      },
      audioLoop: ['00980_1', '00980_bolin_1', '00980_2', '07921'],
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
        11931: -125,
        '02577': 300,
        '02625': 2100,
        '02786': -200,
        '02847': 4250,
        '02926': 850,
        '03085': 8000,
        '03676': 60,
        '03741': 6800,
        '03692': -100,
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
        darkcage: 350,
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
        A6A6I1: -100,
        '06898': 1300,
        '07095': -100,
        17445: 1700,
        '07445': 4530
      },
      audio: [],
      source: undefined,
      lastStartedAudio: undefined,

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
      let filename = path.parse(this.url).name
      if (/_hq/.test(filename)) filename = filename.substring(0, filename.length - 3)
      const size = {x: 650, y: 450}
      let bgcolor = '#fff'
      switch (filename){
        // CAPTCHA GENERATOR
        case "captchas": 
          size.x = 1100
          size.y = 600
          break
        // SWEET CRED
        case "kidshome": 
          size.x = 800
          size.y = 600
          break
        // CLOCKS
        case "03848": case "03857": case "06649": 
          size.y = 1612
          break
        // GENESIS FROG 
        case "04015": 
        // JOHN/JANE CURSOR
        case "05721":
        case "06202":                    
          size.y = 800
          break
        // SCRATCH ALTERNIA 
        case "04050": 
        // A6A6I1 SELECTION SCREEN
        case "06277":
        // A6A6I5 SELECTION SCREENS
        case "07482": case "07668": case "07677": case "07682": case "07689": case "07692": case "07696": case "07709": case "07721": case "07729": case "07762": case "07800": case "07905":
          size.y = 650
          break
        // TYPHEUS, YALDABOATH
        case "05994":  case "07083":
          size.y = 1400
          break
        // HOMOSUCK ANTHEM
        case "06240":
          size.y = 576
          break
        // CASCADE
        case "04106": case "cascade":
          bgcolor = '#262626'
          size.x = 950
          size.y = 650
          break
        // DOTA
        case "04812":  
          bgcolor = '#000'
          size.x = 950
          size.y = 650
          break
          // A6A6I4 FULLPAGERS
        case "07095": case "07122": 
          // SHE'S 8ACK
        case "07402": 
          size.x = 950
          size.y = 650
          break
          // A6A6I1 SELECTION SCREENS
        case "06379": case "06394": case "06398": case "06402": case "06413":
          // VRISKAGRAM 
        case "07445":
          bgcolor = '#C6C6C6'
          size.x = 950
          size.y = 600
          break

          // REMEM8ER
        case "07953":
          bgcolor = '#C6C6C6'
          size.x = 950
          size.y = 675
          break

          // HUGBUNP
        case "07921":
          size.x = 950
          size.y = 700
          break

          // GOLD PILOT
        case "A6A6I1":
          filename = "A6A6I1"
          bgcolor = '#C6C6C6'
          size.x = 950
          size.y = 750
          break
          // GAME OVER
        case "06898":
          bgcolor = '#042300'
          size.x = 950
          size.y = 786
          break

          // CROWBARS
        case "05492": case "05777":
          size.x = 950
          size.y = 1160
          break
						
          // TRICKSTER BANNER
        case "menu":
          size.x = 950
          size.y = 20
          break
          // TRICKSTER BANNER
        case "echidna":
          size.x = 30
          size.y = 30
          break
      }

      return {id: filename, width: size.x + "px", height: size.y + "px", bgcolor: bgcolor}
    },
    flashSrc() {
      return `
        <html>
        <head>
        <style>
          body{margin:0;overflow:hidden;background:${this.flashProps.bgcolor}}
          object{
          ${this.flashProps.id == '07095' ? 'position:relative;top:-21px;' : ''}
          ${this.flashProps.id == '07122' ? 'position:relative;top:-19px;' : ''}
          }
        </style>
        <script>
          //JS Enhancements: ${this.$localData.settings.jsFlashes}
          //HQ Audio: ${this.$localData.settings.hqAudio}
          window.onhashchange = (e) => {
            if (window.location.hash != '#unset') {
              let hash = window.location.hash.substr(1).split('&')
              window.location.hash = '#unset';
              hash.forEach((func)=>{
                vm.invokeFromFlash(func)
              })
            }
          }
        <\/script>
        </head>
        <body>
        <object type="application/x-shockwave-flash" width="${this.flashProps.width}" height="${this.flashProps.height}" data="${this.$resolveURL(this.url)}">
            <param name='movie' value="${this.$resolveURL(this.url)}"/>
            <param name='play' value="true"/>
            <param name='loop' value="true"/>
            <param name='quality' value="high" />
            <param name='bgcolor' value="${this.flashProps.bgcolor}"/>
            <param name='devicefont' value="false"/>
            <param name="allowScriptAccess" value="always" />
        </object>
        </body>
        </html>
      `
    }
  },
  methods: {
    initIframe() {
      this.$el.contentWindow.vm = this
    },
    resolveFrameUrl(url){
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

      console.log(func)
      const [funcName, param] = func.split('?')
      switch (funcName) {
        case 'audioInit':
          console.log(`Creating audio`)
          this.audioInit(param)
          break
        case 'audioStart':
          console.log(`Playing audio (${param})`)
          this.audioStart(param)
          break
        case 'audioPause':
          console.log(`Pausing audio`)
          this.audioPause()
          break
        case 'audioResume':
          console.log(`Resuming audio`)
          this.audioResume()
          break
        case 'audioReset':
          console.log(`Resetting audio`)
          this.audioReset()
          break
        case 'audioSeek': 
          console.log(`Seeking audio to ${param}`)
          this.audioSeek(param)
        case 'vol': 
          console.log(`Setting volume to ${param}`)
          this.audioVolume(param)
          break
        case 'link':
          this.$pushURL(param, this.$parent.tab.key)
          break
        case 'heightStart':
          if (this.$localData.settings.jsFlashes) {
            console.log(`Starting height (${param})`)
            this.heightStart(param)
          }
          break
        case 'heightPause':
          if (this.$localData.settings.jsFlashes) {
            console.log(`Pausing height (${param})`)
            this.pauseTimer()
          }
          break
        case 'heightResume':
          if (this.$localData.settings.jsFlashes) {
            console.log(`Resuming height (${param})`)
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
            this.gameOver.count = 0
            this.startTimer(() => {
              if (Date.now() >= this.timer.start + this.gameOver.steps[this.gameOver.count]) {
                this.gameOver.count++

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
        if (this.flashProps.id.startsWith('00980')){ 
          this.audio.push(this.createAudioElement(/bolin/.test(this.flashProps.id) ? `00980_bolin_1` : `00980_1`))
          this.audio.push(this.createAudioElement(`00980_2`))
        } else if (this.flashProps.id == '03435') {
          this.audio.push(this.createAudioElement(`03435_1`))
          this.audio.push(this.createAudioElement(`03435_2`))
        } else if (this.flashProps.id == '04106'){
          for (var i = 1; i <= 5; i++) 
            this.audio.push(this.createAudioElement(`cascade_segment${i}`))
        } else if (this.flashProps.id == '04370') {
          this.audio.push(this.createAudioElement(`04370_1`))
          this.audio.push(this.createAudioElement(`04370_2`))
        } else {
          this.audio.push(this.createAudioElement())
        }
      } else {
        this.audioReset()
      }
    },
    createAudioElement(id = this.flashProps.id) {
      const audioElement = new Audio(this.$resolveURL(path.join(path.parse(this.url).dir, id + '.mp3')))

      audioElement.preload = 'auto'

      if (this.audioLoop.includes(id)) audioElement.loop = true

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
      else if (replay && (`${this.flashProps.id}_replay`) in this.audioDelay)
        delay = this.audioDelay[`${this.flashProps.id}_replay`]
      else if (`${this.flashProps.id}_${n + 1}` in this.audioDelay)
        delay = this.audioDelay[`${this.flashProps.id}_${n + 1}`]
      else if (this.flashProps.id in this.audioDelay)
        delay = this.audioDelay[this.flashProps.id]
      console.log(`${this.flashProps.id}_${n + 1}: ${delay}ms delay`)
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
      let heightTo = this.flashProps.height
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
        this.$el.style.height = this.flashProps.height
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

    getFile(url) {
      return fs.readFileSync(this.$mspaFileStream(url), 'utf8')
    },
    getExt (url) {
      url = url.toLowerCase()
      const ext = path.extname(url)
      switch (ext) {
        case ".swf":
          return 'swf'
          break
        case ".mp4":
        case ".webm":
          return 'vid'
          break
        case ".txt":
          return 'txt'
          break
        case ".html":
          return 'html'
          break
        case ".mp3":
        case ".wav":
          return 'audio'
          break
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
