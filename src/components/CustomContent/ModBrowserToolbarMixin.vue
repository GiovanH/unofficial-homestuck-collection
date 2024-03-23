<script>

const NavBanner = () => import('@/components/UIElements/NavBanner.vue')
const FlashCredit = () => import('@/components/UIElements/FlashCredit.vue')
const MediaEmbed = () => import('@/components/UIElements/MediaEmbed.vue')
const SpoilerBox = () => import('@/components/UIElements/SpoilerBox.vue')
const StoryPageLink = () => import('@/components/UIElements/StoryPageLink.vue')

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
      style.id = `browsertoolbar-style-${instances}`
      style.rel = "stylesheet"
      style.innerHTML = Sass.renderSync({
        data: `#tabBar .toolbar[data-instance='${instances}'] {\n${this.$options.scss}\n}`,
        sourceComments: true
      }).css.toString()
      // this.$logger.info("MBP injected style")
      this.$el.appendChild(style)
    }
  }
}
</script>
