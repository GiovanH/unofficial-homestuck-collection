const hq_pages = ['006844']

module.exports = {
  hidden: true,
  title: "No Titty",
  summary: "Censors the occasional exposed breast",

  author: "GiovanH",
  modVersion: '0.1',
  minAppVersion: '2.0.0',

  trees: {
    "./": "assets://notitty/",
  },

  edit(archive) {
    // There's another image on this page that gets the message across.
    // Just remove the second image.
    archive.mspa.story['003228'].media[1] = ''

    archive.mspa.story['006844'].media[0] = 'assets://notitty/04941_sfw.swf'
    archive.audioData['assets://notitty/04941_sfw.swf'] = [
      {
        href: "assets://storyfiles/hs2/04941/04941.mp3",
        loop: false
      }
    ]
  }
}
