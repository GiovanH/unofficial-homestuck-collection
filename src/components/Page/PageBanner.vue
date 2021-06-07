<template>
  <div class="bannerDiv" v-if="!!banner"  @mouseover="mouseEnter" @mousemove="positionTooltip" @mouseleave="mouseLeave" >
    <Media :url="banner.url" :title="banner.title" class="bannerImage" />
    <img v-if="imgTooltip" :src="$resolveURL(imgTooltip)" class="imgTooltip" />
    <!-- TODO if imgTooltip is always an asset using asset:// would be cheaper -->
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'pageBanner',
  props: ['tab', 'page'],
  components: {
    Media
  },
  data() {
    return {   
      tooltipActive: false
    }
  },
  computed: {
    banner() {
      let num = parseInt(this.page.pageId)
      if (this.page.theme == 'scratch') {
        return {
          url: `/storyfiles/hs2/scratch/${this.page.scratchBanner}`, 
          title: this.page.scratchTooltip ? this.page.scratchTooltip : undefined
        }
      }
      else if (this.page.theme == 'cascade')
        return {url: '/images/header_cascade.gif', title: undefined}
      else if (this.page.theme == 'trickster')
        return {url: '/images/trickster_sitegraphics/menu.swf', title: undefined}
      else if (this.page.flag.includes('X2COMBO'))
        return {url: '/images/act6act5act1x2combo.gif', title: undefined}
      else if (num == 9987)
        return {url: '/images/collide_header.gif', title: undefined}
      else if (num == 10027)
        return {url: '/images/act7_header.gif', title: undefined}
      else 
        return undefined
    },
    imgTooltip() {
      let num = parseInt(this.page.pageId)
      if (this.page.theme == 'scratch' && num >= 5976 && num <= 5981) {
        let LEnumber = num - 5975
        return `/storyfiles/hs2/scraps/LEtext${LEnumber}.gif`
      } else {
        this.tooltipActive = false
        return false
      }
    }
  },
  methods: {
    mouseEnter(e) {
      e = e || window.event
      e.preventDefault()
      if (this.imgTooltip) {
        let tooltip = document.getElementById(this.tab.key).getElementsByClassName('imgTooltip')[0]  
        tooltip.style.display = 'block'
        this.tooltipActive = true
        this.positionTooltip(e)
      }
    },
    mouseLeave(e) {
      e = e || window.event
      e.preventDefault()
      if (this.tooltipActive && this.imgTooltip) {
        let tooltip = document.getElementById(this.tab.key).getElementsByClassName('imgTooltip')[0]
        tooltip.style.display = 'none'
        this.tooltipActive = false
      }
    },
    positionTooltip(e) {
      e = e || window.event
      e.preventDefault()
      if (this.tooltipActive) {
        let page = document.getElementById(this.tab.key)
        let tooltip = page.getElementsByClassName('imgTooltip')[0]
        // let banner = page.getElementsByClassName('bannerImage')[0] // unused?
        let offsetXY = [20, 30]

        let tooltipX = e.clientX + offsetXY[0]  //mouse X
        let tooltipY = e.clientY - offsetXY[1]  //mouse Y
        let tooltipWidth = tooltip.clientWidth
        let tooltipHeight = tooltip.clientHeight

        tooltip.style.left = 
          (tooltipX + tooltipWidth > page.scrollLeft + page.clientWidth ? 
          tooltipX - tooltipWidth - 2 * offsetXY[0] : 
          tooltipX) + 'px'

        tooltip.style.top = 
          (tooltipY + tooltipHeight > page.scrollTop + page.clientHeight ? 
          page.scrollTop + page.clientHeight - tooltipHeight - offsetXY[1] : 
          tooltipY) + 'px'
      } else {
        this.mouseEnter(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bannerDiv{
    margin: 0;
    * {
      display: block;
    }
    .imgTooltip {
      display: none;
      z-index: 1;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
