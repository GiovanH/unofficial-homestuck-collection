<template>
  <GifSeeker v-if="mediaType === 'gif' && reduceMotion"
    :src='resourceUrl' :noanimate="$localData.settings.reducedMotion && (noncritical != undefined)"
    class='mediaembed' />
  <img v-else-if="mediaType === 'img' || mediaType === 'gif'"
    :src='resourceUrl'
    @dragstart="drag($event)" alt
    class='mediaembed' />
  <video v-else-if="mediaType ==='vid' && gifmode != undefined"
    :src='resourceUrl'
    :width="videoWidth"
    disablePictureInPicture
    autoplay="true" muted="true"
    loop
    class='mediaembed' />
  <video v-else-if="mediaType ==='vid' && gifmode == undefined"
    :src='resourceUrl'
    :width="videoWidth"
    disablePictureInPicture alt
    :autoplay="autoplay" @loadeddata="onVideoLoaded"
    class='mediaembed' />

  <button v-else-if="mediaType === 'swf' && (reduceMotion && !reducedMotionFlashConfirmed)"
    class="mediaembed confirm-button"
    @click="reducedMotionFlashConfirmed = true" >
    <div class="play-button">
      <div></div>
    </div>
    <canvas
      :width="width || flashProps.width"
      :height="height || ($localData.settings.jsFlashes && flashProps.id in cropHeight) ? cropHeight[flashProps.id] : flashProps.height"
      style="width: 100%; height: 100%;"></canvas>
  </button>
  <iframe v-else-if="mediaType === 'swf'"
    :key="url" :srcdoc='flashSrc'
    :width='width || flashProps.width'
    :height='height || (($localData.settings.jsFlashes && flashProps.id in cropHeight) ? cropHeight[flashProps.id] : flashProps.height)'
    @load="initIframe" seamless
    class='mediaembed' />
  <!-- HTML iframes must not point to assets :c -->

  <component v-else-if="mediaType === 'html'"
    :is="frameType"
    :src='resolveFrameUrl(url)'
    ref='frame'
    :style="`width: ${width || flashProps.width}px; height: ${height || flashProps.height}px; max-width: 100%; max-height: 100%;`"
    @did-finish-load="initHtmlFrame" seamless
    class='mediaembed' />
  <!-- <button @click='$refs.frame.openDevTools()'>Webframe</button> -->

  <div v-else-if="mediaType === 'txt'"
    v-html="getFile(url)" class="textEmbed" />
  <audio v-else-if="mediaType === 'audio'"
    class="audioEmbed"
    controls controlsList="nodownload"
    :src="resourceUrl"
    type="audio/mpeg" />
</template>

<script>
import Resources from "@/resources.js"
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'

const GifSeeker = () => import('@/components/UIElements/GifSeeker.vue')

const flashProps = require('@/js/flashProps.js')

const path = (window.isWebApp ? require('path-browserify') : require('path'))
const ipcRenderer = require('IpcRenderer')

var fs
if (!window.isWebApp) {
  fs = require('fs')
} else {
  fs = undefined
}

export default {
  name: "MediaEmbed",
  props: ['url', 'gifmode', 'webarchive', 'width', 'height', 'autoplay', 'noncritical'],
  components: {SpoilerBox, GifSeeker},
  emits: ['blockedevent'], 
  data() {
    return {
      indexedFlashProps: flashProps.indexedFlashProps,
      gameOver: flashProps.gameOver,
      cropHeight: flashProps.cropHeight,
      audioDelay: flashProps.audioDelay,
      pauseAt: flashProps.pauseAt,
      audio: [],
      source: undefined,
      lastStartedAudio: undefined,
      shouldEnsaftenWebviews: true,
      reducedMotionFlashConfirmed: false,
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
    resourceUrl() {
      return this.$getResourceURL(this.url)
    },
    mediaType() {
      return this.getMediaType(this.url)
    },
    reduceMotion() {
      return this.$localData.settings.reducedMotion
    },
    // Web frame
    frameType() {
      if (this.webarchive) return 'webview'
      return 'iframe'
    },
    // Video
    videoWidth() {
      let width = 950
      switch (this.flashId){
        case "08120": 
          width = 1280
          break
      }

      return `${width}px`
    },
    // Flash
    flashId() {
      // ID, before any underscores
      return path.parse(this.url).name.split("_")[0]
    },
    flashProps() {
      this.$logger.info("Getting flash props for", this.flashId, this.url)

      const defaultProps = {
        id: this.flashId,
        width: this.width || 650,
        height: this.height || 450,
        bgcolor: '#fff',
        rawStyle: ''
      }

      const customProps = this.indexedFlashProps[this.flashId] || {}

      if (Object.keys(customProps).length)
        this.$logger.info("Custom props for flash", this.flashId, customProps)

      return {...defaultProps, ...customProps}
    },
    audioTracks() {
      const ret =  this.$archive.audioData[this.url.replace("_hq.swf", ".swf")] || []
      this.$logger.info("Getting audio tracks for", this.url, this.url.replace("_hq.swf", ".swf"), ret)
      return ret
    },
    ruffleEmbed() {
      // At some point between 2025.3.14 and 2025.4.13 ruffle stopped supporting our old runtime. Damn. -->
      if (this.$localData.settings.ruffleFallback) {
        if (this.$isWebApp) {
          return '<script src="https://unpkg.com/@ruffle-rs/ruffle"><\/script>'
        } else {
          // 0.1.0-nightly.2024.04.13 OK
          // ...
          // 0.1.0-nightly.2024.07.19 OK
          // 0.1.0-nightly.2024.07.20 scale issue
          // ...
          // 0.1.0-nightly.2025.04.07 scale issue
          // 0.1.0-nightly.2025.04.13 syntax issue
          // return '<script src="https://unpkg.com/@ruffle-rs/ruffle@0.1.0-nightly.2024.7.19"><\/script>'
          return `<script src="${this.$getResourceURL("assets://js/ruffle/ruffle.js")}"><\/script>`
        }
      } else {
        return '<!-- Using real flash -->'
      }
    },
    flashSrc() {
      return `
        <html>
        <head>
        <style>
          body{margin:0;overflow:hidden;background:${this.flashProps.bgcolor}}
          object{${this.flashProps.rawStyle}}
        </style>
        <script>
          // JS Enhancements: ${this.$localData.settings.jsFlashes}
          // HQ Audio: ${this.$localData.settings.hqAudio}

          // Frag IPC
          window.onhashchange = (e) => {
            console.debug("srcdoc hash change: ", e, window.location.hash)

            if (window.location.hash != '#unset') {
              let hash = window.location.hash.substr(1).split('&')
              window.location.hash = '#unset';
              hash.forEach((func)=>{
                vm.invokeFromFlash(func)
              })
            }
          }

          // Intercept navigation events
          window.open = function(url, name, features, replace) {
            console.log("Flash invoked window.open")
            vm.invokeFromFlash("link?" + url)
          }

          if (typeof navigation !== 'undefined') {
            navigation.addEventListener("navigate", (e) => {
              console.log("srcdoc navigating: ", e, e.destination,
                e.destination.url
              )
              if (!e.destination.sameDocument && !e.destination.url.startsWith('about:srcdoc')) {
                console.log(e.destination.url)
                vm.invokeFromFlash("link?" + e.destination.url)
              } else {
                // Workaround for ruffle bug https://github.com/ruffle-rs/ruffle/issues/2092
                console.log("Internal frame navigation", e.destination, e.destination.url)
                e.preventDefault()

                const target = new URL(e.destination.url)
                const hash = target.hash.substr(1).split('&')
                hash.forEach((func)=>{
                  vm.invokeFromFlash(func)
                })
              }
            })
          } else {
            console.debug("Browser does not support 'navigation' listener")
          }
        <\/script>
        ${this.ruffleEmbed}
        </head>
        <body>
        <object type="application/x-shockwave-flash" 
          width="${this.flashProps.width}" 
          height="${this.flashProps.height}" 
          data="${this.$getResourceURL(this.url)}">
            <param name='movie' value="${this.$getResourceURL(this.url)}"/>
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
    getMediaType (url) {
      url = url.toLowerCase()
      const ext = path.extname(url)
      switch (ext) {
        case ".gif":
          return 'gif'
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
      if (!this.$isWebApp) {
        e.dataTransfer.effectAllowed = 'copy'
        ipcRenderer.send('ondragstart', this.$mspaFileStream(this.url))
        e.preventDefault()
      }
    },
    // Video
    onVideoLoaded(event) {
      // Don't show controls until video is loaded and element is sized
      event.srcElement.controls = true
      event.srcElement.controlsList = "nodownload"

      const pauseAt = this.pauseAt[this.flashProps.id]
      if (pauseAt) {
        const pause = function(){
          if (this.currentTime > pauseAt) {
            console.log("pausing video at", this.currentTime)
            this.controls = true
            this.pause()
            this.removeEventListener("timeupdate", pause)
          }
        }
        // Autoplay doesn't work consistently on the web.
        if (!this.$isWebapp) event.srcElement.controls = false
        event.srcElement.addEventListener("timeupdate", pause)
      }
    },
    // Frame
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
    initIframe(event) {
      const target = event.target || event.path[0]
      target.contentWindow.vm = this
    },
    resolveFrameUrl(url){
      // this.$logger.info('Resolving iframe url', url, Resources.resolveURL(url))
      return Resources.resolveURL(url)
    },
    // Flash
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

      this.$logger.debug("flash invoked function", func)
      const [funcName, ...params] = func.split('?')
      const param = params.join('?') // reconstitute params with ? in them
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
          if (param != 'about:srcdoc') {
            this.$pushURL(this.$getResourceURL(param))
          } else {
            this.$logger.warn("Tried to navigate page to srcdoc!")
          }
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
            this.$logger.info("Initializing game over media timer")

            this.$parent.gameOverPreload = false
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
    audioStart(n) {
      n = (n === "" ? 1 : n)
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
    // Text?
    getFile(url) {
      // Return the contents of the (text) file at url.
      this.$logger.info("Retrieving file", url)
      if (this.$isWebApp) {
        const request = new XMLHttpRequest()
        request.open("GET", url, false) // `false` makes the request synchronous
        request.send(null)
        if (request.status === 200) {
          return request.responseText
        } else {
          console.error(request)
        }
      } else {
        return fs.readFileSync(this.$mspaFileStream(url), 'utf8')
      }
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
  .confirm-button {
    position: relative;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    line-height: 0;
    background: var(--page-pageContent);

    .play-button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -30px;

      > div {
        width: 0;
        height:  0;
        border-top: 14px solid transparent;
        border-bottom: 14px solid transparent;
        border-left: 14px solid rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 26px;
        top: 16px;
      }
    }
  }
</style>
