<template>
  <div class="bannerDiv" v-if="!!banner"  @mouseover="mouseEnter" @mousemove="positionTooltip" @mouseleave="mouseLeave" >
    <Media :url="banner.url" :title="banner.title" class="bannerImage" noncritical />
    <img v-if="imgTooltip" :src="imgTooltip" class="imgTooltip" />
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
          url: `assets://storyfiles/hs2/scratch/${this.page.scratchBanner}`,
          title: this.page.scratchTooltip ? this.page.scratchTooltip : undefined
        }
      }
      else if (this.page.theme == 'cascade')
        return {url: 'assets://images/header_cascade.gif', title: undefined}
      else if (this.page.theme == 'trickster' && !this.$localData.settings.reducedMotion)
        return {url: 'assets://images/trickster_sitegraphics/menu.swf', title: undefined}
      else if (this.page.flag.includes('X2COMBO'))
        return {url: 'assets://images/act6act5act1x2combo.gif', title: undefined}
      else if (num == 9987)
        return {url: 'assets://images/collide_header.gif', title: undefined}
      else if (num == 10027)
        return {url: 'assets://images/act7_header.gif', title: undefined}
      else 
        return undefined
    },
    imgTooltip() {
      const num = parseInt(this.page.pageId)
      if (this.page.theme == 'scratch' && num >= 5976 && num <= 5981) {
        const LEnumber = num - 5975
        return `assets://storyfiles/hs2/scraps/LEtext${LEnumber}.gif`
      } else {
        return false
      }
    }
  },
  methods: {
    mouseEnter(e) {
      e = e || window.event
      e.preventDefault()
      if (this.imgTooltip) {
        const tooltip = document.getElementById(this.tab.key).getElementsByClassName('imgTooltip')[0]  
        tooltip.style.display = 'block'
        this.tooltipActive = true
        this.positionTooltip(e)
      } else {
        this.tooltipActive = false
      }
    },
    mouseLeave(e) {
      e = e || window.event
      e.preventDefault()
      if (this.imgTooltip) {
        if (this.tooltipActive) {
          const tooltip = document.getElementById(this.tab.key).getElementsByClassName('imgTooltip')[0]
          tooltip.style.display = 'none'
          this.tooltipActive = false
        }
      } else {
        this.tooltipActive = false
      }
    },
    positionTooltip(e) {
      e = e || window.event
      e.preventDefault()
      if (this.tooltipActive) {
        const page = document.getElementById(this.tab.key)
        const tooltip = page.getElementsByClassName('imgTooltip')[0]
        // const banner = page.getElementsByClassName('bannerImage')[0] // unused?
        const offsetXY = [20, 30]

        const tooltipX = e.clientX + offsetXY[0]  // mouse X
        const tooltipY = e.clientY - offsetXY[1]  // mouse Y
        const tooltipWidth = tooltip.clientWidth
        const tooltipHeight = tooltip.clientHeight

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
