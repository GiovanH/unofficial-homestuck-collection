module.exports = {
  title: "twoToThree", 
  author: "GiovanH",
  modVersion: 0.1,
  trees: {
    "./pxs/": "assets://archive/comics/pxs/"
  },
  routes: {
    'assets://storyfiles/hs2/03085/03085_hq.swf': './swf/03085_hq.swf',
    'assets://storyfiles/hs2/04082/04082_hq.swf': './swf/04082_hq.swf',
    'assets://newspost_images/scarecrowking1.gif': 'assets://archive/social/news/scarecrowking1.gif',
    'assets://newspost_images/scarecrowking2.gif': 'assets://archive/social/news/scarecrowking2.gif',
  },
  edit(archive) {
    archive.music.albums['hiveswap-act-2-ost'].art = [] // Fix tobyfox crash
    archive.music.tracks['flying-car'].bandcampId = 415056291 // Bowman - Fly to ES - Flying Car
  }
}
