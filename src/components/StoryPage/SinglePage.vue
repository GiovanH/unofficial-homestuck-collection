<script>
// @ is an alias to /src
import VanillaPage from '@/components/StoryPage/Page.vue'

function urlToArgObj(url) {
  // Can't be sure URL has a real protocol :(
  const querystr = url.replace(/.+?\//, '').replace(/\//g, "&")
  const params = new URL('phony://?' + querystr).searchParams
  return Object.fromEntries(params.entries())
}

export default {
  extends: VanillaPage,
  name: 'singlepage',
  data: function() {
    return {
      shortVer: {
        "title": 'c',
        "pageId": 'id',
        "timestamp": 't',
        "flag": 'f',
        "next": 'n',
        "media": 'm',
        "content": 'b',
        "storyId": 's'
      }
    }
  },
  props: [
    'tab', 'routeParams', 'args'
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
    argLookup(key, def) {
      const islist = Array.isArray(def)
      if (islist) {
        return this.$props[key] 
          ? this.$props[key]
          : (this.queryArgs[key] ? this.queryArgs[key].split(',') : def)
      } else 
        return this.$props[key] || this.queryArgs[key] || def
    },
    makeUrl(thispage) {
      let url = "/page/"
      Object.keys(thispage).forEach(k => {
        if (this.shortVer[k] && thispage[k])
          url += `${this.shortVer[k]}=${encodeURIComponent(thispage[k])}/`
      })
      return url
    }
  },
  computed: {
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
      return this.args || urlToArgObj(this.tab.url)
    },
    thisPage() {
      // Add useful information to archive object
      return {
        "title": this.argLookup(this.shortVer['title'], ''),
        "pageId": this.argLookup(this.shortVer['pageId'], ''),
        "timestamp": this.argLookup(this.shortVer['timestamp'], ''),
        "flag": this.argLookup(this.shortVer['flag'], []),
        "next": this.argLookup(this.shortVer['next'], []),
        "media": this.argLookup(this.shortVer['media'], []),
        "content": this.argLookup(this.shortVer['content'], ''),
        "storyId": this.argLookup(this.shortVer['storyId'], '')
      }
    }
    // audioData(){
    //   let media = Array.from(this.thisPage.media)
    //   this.deretcon(media)
    //   return this.$archive.audioData[media[0]]
    // },
  }
}
</script>
