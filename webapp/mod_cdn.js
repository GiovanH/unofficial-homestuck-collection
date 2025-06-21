let logger;
let store;
let Resources;

function replaceContent(story, key, pat, repl){
  story[key].content = story[key].content.replace(pat, repl)
}

module.exports = {
  title: "UHC CDN",
  summary: "Pull resources from the internet, instead of using an asset pack",
  author: "GiovanH",
  modVersion: 0.2,

  computed(api) {
    logger = api.logger
    store = api.store
    Resources = api.Resources
  },

  vueHooks: [{
    matchName: "NamcoHigh",
    computed: {
      frameSrc($super){
        return "https://namcohigh.klonoa.org/index2.html"
      }
    }
  }],

  edit(archive) {
    replaceContent(archive.mspa.story, '004718', "<a href=\"/archive/external/miracles.mp4\"", "<a href=\"https://www.youtube.com/watch?v=8GyVx28R9-s\"")

    archive.mspa.story['004692'].media = ['https://mrcheeze.github.io/homestuck-ruffle-tester/flash/02791_local.swf']

    archive.music.albums['homestuck-vol-10'].bonus = [
      // "https://hsmusic.wiki/media/album-additional/homestuck-vol-10/Booklet.pdf",
      "Renewed Return Choral Parts.pdf"
    ]
    archive.music.albums['genesis-frog'].bonus = [
      // https://hsmusic.wiki/album/genesis-frog/
    ]
    archive.music.albums['mobius-trip-and-hadron-kaleido'].bonus = [
      // https://www.youtube.com/watch?v=CUDkBTYWtGk
    ]
    archive.music.albums['squiddles'].bonus = [
      // https://hsmusic.wiki/album/squiddles/
      "squiddlevid.swf"
    ]
  }
}

