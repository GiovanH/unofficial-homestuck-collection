<template>
  <div class='media'>
    <img v-if="frame" :src="frame.dataURL" />
    <div class='controls'
      v-if="frames.length > 1">
      <span>GIF</span>
      <input
        type="checkbox"
        v-model="autoplay"
        title="Autoplay">
      <input
        type="range"
        min="0" :max="frames.length-1"
        v-model.number="selected_index"
        @input="autoplay = false"
        class="slider"
        :style="{width: `${12 * frames.length}px`}"
        :title="`${1 + selected_index}/${frames.length}`">
      <!-- <span v-if="autoplay">Delay x
        <input type="number" style="width: 2em;" v-model="autoplay_delay_multiplier">
      </span> -->
    </div>
  </div>
</template>

<script>
const gifFrames = require('gif-frames');
const DELAY_TO_MS = 10

export default {
  name: "GifSeeker",
  props: ['src'],
  data() {
    return {
      selected_index: 0,
      autoplay: false,
      autoplay_delay_multiplier: 1.0,
      autoplay_timeout: undefined,
    }
  },
  asyncComputed: {
    frames: {
      default: [],
      async get() {
        const frameData = await gifFrames({
          url: this.$getResourceURL(this.src),
          frames: 'all',
          outputType: 'canvas',
          cumulative: true
        })
        return frameData.map(frame => ({
          ...frame,
          dataURL: frame.getImage().toDataURL()
        }))
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
    }
  }
}
</script>

<style scoped lang="scss">
.controls {
  display: flex;
  align-items: center;
}
</style>