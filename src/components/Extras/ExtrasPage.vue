<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <MediaEmbed url="images/logo.gif" class="logo"/>
        <div v-html="thisPage" class="slot" :class="{faq: /^\/faqs\//.test(this.tab.url)}" />
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

export default {
  name: 'extras',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
  data: function() {
    return {
    }
  },
  computed: {
    pageData() {
      if (this.routeParams.base === 'waywardvagabond') return this.$archive.mspa.wv
      else if (this.routeParams.base === 'faqs') return this.$archive.mspa.faqs
      else if (this.routeParams.base === 'oilretcon') return this.$archive.mspa.oilRetcon
      return this.$archive.mspa.psExtras
    },
    thisPage() {
      return typeof this.pageData == 'string' ? this.pageData : this.pageData[this.routeParams.p].content
    },
  },
  methods:{
    filterLinksAndImages(){
      let el = this.$el.querySelector('.pageContent')

      // Check if this is a comment
      if (el.nodeType !== 8){
        let links = el.getElementsByTagName('A')
        for(let i = 0;i < links.length; i++) {
          links[i].href = this.$filterURL(links[i].href)
        }
        
        //Normally, this process would be handled by the MediaEmbed component. Gotta get the behaviour into all them images somehow!
        let images = el.getElementsByTagName('IMG')
        for(let i = 0;i < images.length; i++) {
          images[i].src = this.$mspaURL(images[i].src)
          images[i].ondragstart = (e) => {
            e.preventDefault()
            e.dataTransfer.effectAllowed = 'copy'
            require('electron').ipcRenderer.send('ondragstart', this.$mspaFileStream(images[i].src))
          }
        }
      }
    }
  },
  updated() {
    this.filterLinksAndImages()
  },
  mounted() {
    this.filterLinksAndImages()
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      justify-content: center;
      .pageContent {
        background: var(--page-pageContent);

        max-width: 650px;
        width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          margin-bottom: 25px;
        }
        ::v-deep {
          image-rendering: pixelated;
          font[size='6'] {
            color: var(--font-header);
          }
          p {
            max-width: 600px;
          }
          a {
            color: var(--page-links);
          }
          .faq {
            font-family: Verdana, Arial, Helvetica, sans-serif;
            font-size: 12px;
            font-weight: initial;
          }
        }
      }	
    }
  }
  .retro {
    .pageContent {
      background: #EEEEEE !important;
    }
    .slot {
      background: white;
    }
  }  

</style>

