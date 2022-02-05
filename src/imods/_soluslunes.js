module.exports = {
    hidden: true,

    // routes: {
    //     "assets://storyfiles/hs2/01720/01720_soluslunes.swf": "./01720_soluslunes.swf"
    // },
    
    edit(archive) {
        archive.mspa.story["003620"].media[0] = `/storyfiles/hs2/01720/01720_soluslunes.swf`
        archive.music.flashes["003620"].tracks = [
            "unsheathd", 
            "welcome-to-the-new-extreme", 
            "octoroon-rangoon", 
            "shatterface", 
            "phantasmagoric-waltz"
        ]
        // Even if bolin is selected, we force this track list.
        archive.music.flashes["003620"].bolin = [
            "unsheathd", 
            "welcome-to-the-new-extreme", 
            "octoroon-rangoon", 
            "shatterface", 
            "phantasmagoric-waltz"
        ]
    }
}
