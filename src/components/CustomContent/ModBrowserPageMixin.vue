<script>

import NavBanner from '@/components/UIElements/NavBanner.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'

const Sass = require('sass')

const GlobalComponents = {
  NavBanner, 
  FlashCredit,
  MediaEmbed,
  SpoilerBox,
  StoryPageLink
}

var instances = 0

export default {
  created(){
    // this.$logger.info("MBP created")
    this.$options.components = Object.assign(this.$options.components, GlobalComponents)
  },
  mounted() {
    // this.$logger.info("MBP mounted")
    instances += 1
    
    if (this.$options.scss) {
      this.$el.setAttribute('data-instance', instances) 

      const style = document.createElement("style")
      style.id = `browserpage-style-${instances}`
      style.rel = "stylesheet"
      style.innerHTML = Sass.renderSync({
        data: `.tabFrame [data-instance='${instances}'] {\n${this.$options.scss}\n}`,
        sourceComments: true
      }).css.toString()
      // this.$logger.info("MBP injected style")
      this.$el.appendChild(style)
    }
  }
}
</script>
