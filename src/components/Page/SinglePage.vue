<script>
// @ is an alias to /src
import VanillaPage from '@/components/Page/Page.vue'

function urlToArgObj(url) {
  // Can't be sure URL has a real protocol :(
  const querystr = url.replace(/.+?\//, '').replace(/\//g, "&")
  console.log(querystr)
  const params = new URL('phony://?' + querystr).searchParams
  console.log(Object.fromEntries(params.entries()))
  return Object.fromEntries(params.entries())
}

export default {
  ...VanillaPage,
  name: 'singlepage',
  props: [
    'tab', 'routeParams'
  ],
  theme: function(ctx) {
    const args = urlToArgObj(ctx.tab.url)
    return args.th || 'default'
  },
  title: function(ctx) {
    const args = urlToArgObj(ctx.tab.url)
    return args.c || 'SinglePage'
  },
  computed: {
    ...VanillaPage.computed,
    isRyanquest(){
      return false
    },
    pageNum() {
      return undefined // "001983"
    },
    pageCollection() {
      return this.$archive.mspa['story']
    },
    thisPage() {
      // Add useful information to archive object
      const args = urlToArgObj(this.tab.url)
      return {
        "title": args.c || "",
        "pageId": args.id || "",
        "timestamp": args.t || "",
        "flag": args.f ? [args.f] : [],
        "next": args.n ? [args.n] : [],
        "media": args.m ? [args.m] : [],
        "content": args.b || '',
        "storyId": args.s || ''
      }
    },
    // audioData(){
    //   let media = Array.from(this.thisPage.media)
    //   this.deretcon(media)
    //   return this.$archive.audioData[media[0]]
    // },
  }
}
</script>