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
  methods: {
    ...VanillaPage.methods,
    argLookup(key, def) {
      const islist = Array.isArray(def)
      if (islist) {
        return this.$props[key] 
          ? this.$props[key]
          : (this.queryArgs[key] ? this.queryArgs[key].split(',') : def)
      } else 
        return this.$props[key] || this.queryArgs[key] || def
    }
  },
  computed: {
    ...VanillaPage.computed,
    isRyanquest(){
      return false
    },
    pageNum() {
      return undefined
    },
    pageCollection() {
      return this.$archive.mspa['story']
    },
    queryArgs() {
      return urlToArgObj(this.tab.url)
    },
    thisPage() {
      // Add useful information to archive object
      return {
        "title": this.argLookup('c', ''),
        "pageId": this.argLookup('id', ''),
        "timestamp": this.argLookup('t', ''),
        "flag": this.argLookup('f', []),
        "next": this.argLookup('n', []),
        "media": this.argLookup('m', []),
        "content": this.argLookup('b', ''),
        "storyId": this.argLookup('s', '')
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