<template>
  <div class="creditWrapper" v-if="$localData.settings.credits && credit">
    <a class="frame" target="_blank" v-for="(track, i) in credit" :key="track" :href="musicLink(track) || false" ref="credit"  @mouseenter="startScroll(i)" @mouseleave="endScroll(i)">
      <span class="icon"><fa-icon icon="music"></fa-icon></span>
      <div class="credit"><span class="marquee" v-text="musicText(track)" /></div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'FlashCredit',
  props: [
    'pageId'
  ],
  components: {
  },
  data: function() {
    return {
      marqueeInterval: undefined,
      marqueeText: undefined
    }
  },
  computed: {
    credit() {
      // Manual exception to prevent appearance on A6A6 introduction
      // TODO: why does this get special treatment?
      if (this.pageId in this.$archive.music.flashes && this.pageId != '008143') {
        if (this.$localData.settings.bolin && 'bolin' in this.$archive.music.flashes[this.pageId]) return this.$archive.music.flashes[this.pageId].bolin
        else return this.$archive.music.flashes[this.pageId].tracks
      } else 
        return false
    }
  },
  methods: {
    musicLink(ref){
      if (ref in this.$archive.music.tracks) return `/music/track/${ref}`
      else return false
    },
    musicText(ref){
      if (ref in this.$archive.music.tracks) {
        let track = this.$archive.music.tracks[ref]
        let names = []
        track.artists.forEach(artist => {names.push(this.$archive.music.artists[artist.who].name)})
        return track.name + ' - ' + names.join(', ')
      }
      else return ref
    },
    startScroll(i) {
      let marquee = this.$refs.credit[i].querySelector('.marquee')
      let overflow = marquee.clientWidth - this.$refs.credit[i].querySelector('.credit').clientWidth + 5
      if (overflow > 0) {
        let distance = marquee.clientWidth + 25

        this.marqueeText = marquee.innerText
        marquee.innerText = `${this.marqueeText} • ${this.marqueeText}`

        let time = distance/80

        marquee.style.transition = `margin ${time}s linear`
        marquee.style.marginLeft = `-${distance}px`
        this.marqueeInterval = setInterval(() => {
          marquee.style.transition = ''
          marquee.style.marginLeft = 0

          window.getComputedStyle(marquee).marginLeft

          marquee.style.transition = `margin ${time}s linear`
          marquee.style.marginLeft = `-${distance}px`
        }, time * 1000)
      }
    },
    endScroll(i) {
      let marquee = this.$refs.credit[i].querySelector('.marquee')
      if (this.marqueeText) {
        marquee.style.transition = ''
        marquee.style.marginLeft = 0

        clearInterval(this.marqueeInterval)

        marquee.innerText = this.marqueeText
        this.marqueeText = ''
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.marqueeInterval)
  }
}
</script>

<style scoped lang="scss">

.creditWrapper {
  width: min-content;
  max-width: 100%;
  margin: 0 auto 30px;
  padding: 2px;
  background-color: #ff9000;
  border: solid 2px #ff9000;
  transition: opacity 1s;
}

.modalContainer .creditWrapper {
  margin: 1em;
}

.frame {
  display: flex;
  text-decoration: none;
  color: white;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
  &:hover {
    text-decoration: underline;

    &[href] .marquee {
      text-decoration: underline;
    }
    &:not([href]) {
      cursor: default;
    }
  }
  &:after {
    content: none !important;
  }
}
.icon {
  font-size: 14px;
  background: black;
  border: 2px solid #ffff00;
  margin-right: 4px;
  padding: 4px;
  line-height: 0;
  &:after {
    content: none !important;
  }
}
.credit {
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  white-space: nowrap;

  width: 100%;
  padding: 0 5px;

  background: black;
  border: 2px solid #ffff00;
  box-shadow: 0 0 0 2px #ff9000;

  &:after {
    content: none !important;
  }
  .marquee {
    display: inline-block;
    &:after {
      content: none !important;
    }
  }
}

</style>

