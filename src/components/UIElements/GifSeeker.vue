<template>
  <img v-if="frames && frames.length == 1" :src="frame.dataURL" />
  <div v-else class="wrapper">
    <img v-if="frame" :src="frame.dataURL" />
    <!-- <img v-else :src="$getResourceURL(src)" :style="{'padding-bottom': '20px'}" /> -->
    <div v-else :style="{width: '650px', height: '450px', 'padding-bottom': '20px'}" />
    <div class='controls' v-if="frames.length > 1">
      <button
        style="width: 5em;"
        v-text="autoplay ? 'Pause' : 'Play'"
        @click="autoplay = !autoplay"
      />
      <div class="filmstrip" ref="filmstrip">
        <img v-for="frame, i in frames" :key="`frame${i}`"
          :src="frame.dataURL"
          class="clickable"
          :class="{active: (i == selected_index)}"
          @click="selected_index = i"
        />
      </div>
      <!-- <label>Loop
        <input
          type="checkbox"
          v-model="autoplay"
          title="Autoplay">
      </label> -->
      <!-- <input
        type="range"
        min="0" :max="frames.length-1"
        v-model.number="selected_index"
        @input="autoplay = false"
        class="slider"
        style="width: 100%;"
        :title="`${1 + selected_index}/${frames.length}`"> -->
      <!-- <span v-if="autoplay">Delay x
        <input type="number" style="width: 2em;" v-model="autoplay_delay_multiplier">
        :style="{width: `${12 * frames.length}px`}"
      </span> -->
    </div>
  </div>
</template>

<script>
const gifFrames = require('gif-frames')
const DELAY_TO_MS = 10

// Cache panel lists globally in order to make use of
// pre-page resource caching (like images do natively)
const LRUCache = require('mnemonist/lru-cache')
const GLOBAL_FRAME_CACHE = new LRUCache(1000)

export default {
  name: "GifSeeker",
  props: ['src', 'noanimate'],
  data() {
    return {
      selected_index: 0,
      autoplay: false,
      autoplay_delay_multiplier: 1.0,
      autoplay_timeout: undefined
    }
  },
  asyncComputed: {
    frames: {
      default: [],
      async get() {
        const resource_url = this.$getResourceURL(this.src)
        const disable_animation = (this.noanimate == true)
        const arg_key = [resource_url, disable_animation]
        if (GLOBAL_FRAME_CACHE.has(arg_key)) {
          return GLOBAL_FRAME_CACHE.get(arg_key)
        } else {
          const frameData = await gifFrames({
            url: resource_url,
            frames: (disable_animation ? 0 : 'all'),
            outputType: 'canvas',
            cumulative: true
          })
          const frameArray = frameData.map(frame => ({
            ...frame,
            dataURL: frame.getImage().toDataURL()
          }))
          GLOBAL_FRAME_CACHE.set(arg_key, frameArray)
          return frameArray
        }
      }
    }
  },
  computed: {
    frame() {
      return this.frames[this.selected_index]
    }
  },
  methods: {
    incrementFrame() {
      this.selected_index = (this.selected_index + 1) % this.frames.length
    },
    queueNextTimeout() {
      const timeout_ms = this.frame.frameInfo.delay * DELAY_TO_MS * this.autoplay_delay_multiplier

      this.autoplay_timeout = setTimeout(() => {
        this.incrementFrame()
        this.queueNextTimeout()
      }, timeout_ms)
    }
  },
  watch: {
    'autoplay'(to, from) {
      clearTimeout(this.autoplay_timeout)
      if (to == true) {
        this.queueNextTimeout()
      }
    },
    'selected_index'(to) {
      if (!this.$refs.filmstrip) return

      this.$refs.filmstrip.children[to].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      })
    }
  }
}
</script>

<style scoped lang="scss">
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}
div.wrapper {
  line-height: 0;
  img {
    max-width: inherit;
    max-height: inherit;
  }
  .filmstrip {
    display: flex;
    max-width: 650px;
    overflow-x: scroll;

    > img {
      flex: 1 1;
      flex-basis: 0;
      // width: 0;
      max-height: 64px;
      image-rendering: auto !important;
      margin: 4px;

      &.clickable {
        cursor: pointer;
      }

      &.active {
        filter: drop-shadow(2px 4px 6px black);
      }
    }
  }
}
</style>