let api = {}

module.exports = {
  title: "twoToThree", 
  author: "GiovanH",
  modVersion: 0.1,
  trees: {
    "./pxs/": "assets://archive/comics/pxs/",
  },
  routes: {
    //replace flashes that don't mute when HQ audio is enabled
    'assets://storyfiles/hs2/03085/03085_hq.swf': './swf/03085_hq.swf',
    'assets://storyfiles/hs2/04082/04082_hq.swf': './swf/04082_hq.swf',

    //reroute improperly formatted links in 25-Nov-09 newspost
    'assets://newspost_images/scarecrowking1.gif': 'assets://archive/social/news/scarecrowking1.gif',
    'assets://newspost_images/scarecrowking2.gif': 'assets://archive/social/news/scarecrowking2.gif',
  },
  edit(archive) {
    function editFormspring(group, id, pattern, substitution) {
      const match = archive.social.formspring[group].find((p, i) => p.id === id)
      archive.social.formspring[group].find((p, i) => p.id === id).html =
        match.html.replace(pattern, substitution)
    }

    archive.music.albums['hiveswap-act-2-ost'].art = [] // Fix tobyfox crash
    archive.music.tracks['flying-car'].bandcampId = 415056291 // Bowman - Fly to ES - Flying Car

    //Correct Red Sucker misattribution - RJ Lake -> Kalibration
    archive.music.tracks['red-sucker'].artists[1].who = "kalibration"
    archive.music.tracks['red-sucker'].contributors[1].who = "kalibration"
    archive.music.artists['robert-j-lake'].credits[12].music.pop()
    archive.music.artists['kalibration'].credits.splice(5, 0, {
      "directory": "cherubim",
      "coverArt": null,
      "music": [
        {
          "track": "red-sucker",
          "what": "arrangement, production"
        }
      ],
      "art": []
    })

    archive.social.blogspot[8].html = archive.social.blogspot[8].html.replace('archive/tso/blurbs', 'archive/comics/tso/blurbs')

    editFormspring('andrewhussie', 'andrewhussie550488999', '"/archive/formspring/00958_1.gif"', '"assets://archive/social/formspring/00958_1.gif"')

    archive.extras['epilogues'] = api.readYaml('epilogues.yaml')
  },
  computed(api_) {
    api = api_
    return {}
  }
}
