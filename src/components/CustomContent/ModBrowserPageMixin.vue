<script>

import NavBanner from '@/components/UIElements/NavBanner.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
import HomeRowItem from '@/components/UIElements/HomeRowItem.vue'
import Page from '@/components/Page/Page.vue'
import PageBanner from '@/components/Page/PageBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import PageMetadata from '@/components/Page/PageMetadata.vue'
import PageNav from '@/components/Page/PageNav.vue'
import PageText from '@/components/Page/PageText.vue'
import SinglePage from '@/components/Page/SinglePage.vue'

const Sass = require('sass')

const GlobalComponents = {
  NavBanner, 
  FlashCredit,
  MediaEmbed,
  SpoilerBox,
  StoryPageLink,
  HomeRowItem,
  Page,
  PageBanner,
  PageFooter,
  PageMetadata,
  PageNav,
  PageText,
  SinglePage
}

var instances = 0

const reset_sass = `
h1, h2, h3, h4, h5, h6, p, ul, ol, li, div {
  margin: unset;
  padding: unset;
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
& {
  font-family: unset;
  font-size: unset;
  font-weight: normal;
  overflow-wrap: initial;
}`

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
        data: `.tabFrame [data-instance='${instances}'] {\n${reset_sass}\n${this.$options.scss}\n}`,
        sourceComments: true
      }).css.toString()
      // this.$logger.info("MBP injected style")
      this.$el.appendChild(style)
    }
  }
}
</script>
