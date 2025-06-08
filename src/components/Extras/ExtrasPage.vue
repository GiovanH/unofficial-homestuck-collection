<template>
  <GenericPage>
    <MediaEmbed url="images/logo.gif" />
    <div v-html="thisPage" class="slot" :class="{faq: /^\/faqs\//.test(this.tab.url)}" />
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/UIElements/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

import Resources from '@/resources.js'

export default {
  name: 'extras',
  mixins: [Resources.UrlFilterMixin],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, GenericPage
  },
  theme(ctx) {
    if (ctx.routeParams.p in ctx.$archive.mspa.psExtras) return 'retro'
  },
  title(ctx) {
    if (ctx.routeParams.base == 'oilretcon') 
      return 'Oil Retcon'
    else if (ctx.routeParams.base == 'waywardvagabond' && ctx.routeParams.p in ctx.$archive.mspa.wv) 
      return "Homestuck"
    if (ctx.routeParams.base == 'faqs') {
      if (ctx.routeParams.p == 'science') 
        return 'Science FAQ'
      return 'FAQ'
    } else 
      return 'Extra Content'
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
  ::v-deep {
    font[size='6'] {
      color: var(--font-header);
    }
    p {
      max-width: 600px;
    }
    a { color: var(--page-links); }
    a:link:active { color: var(--page-links-active); }
    .faq {
      font-family: Verdana, Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: initial;
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
