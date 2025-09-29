module.exports = {
  title: "twoToThree", 
  author: "GiovanH",
  modVersion: 0.1,
  trees: {
    "./pxs/": "assets://archive/comics/pxs/",
    "./images/": "assets://images/",
    "./js/": "assets://js/",
    "./archive/": "assets://archive/"
  },
  routes: {
    // replace flashes that don't mute when HQ audio is enabled
    'assets://storyfiles/hs2/03085/03085_hq.swf': './swf/03085_hq.swf',
    'assets://storyfiles/hs2/04082/04082_hq.swf': './swf/04082_hq.swf',

    // replace hq flash mp3 for At The Price Of Oblivion
    'assets://storyfiles/hs2/03693/03693.mp3': './mp3/03693.mp3',

    // reroute improperly formatted links in 25-Nov-09 newspost
    'assets://newspost_images/scarecrowking1.gif': 'assets://archive/social/news/scarecrowking1.gif',
    'assets://newspost_images/scarecrowking2.gif': 'assets://archive/social/news/scarecrowking2.gif'
  },
  edit: true,
  async asyncComputed(api) {
    const epiloguesYaml = await api.readYamlAsync('./epilogues.yaml')
    return {
      edit(archive) {
        // Precompute password pages
        archive.tweaks.tzPasswordPages = Object.values(archive.mspa.story)
          .filter(v => v.flag.includes('TZPASSWORD'))
          .map(v => v.pageId)

        function editFormspring(group, id, pattern, substitution) {
          const match = archive.social.formspring[group].find((p, i) => p.id === id)
          archive.social.formspring[group].find((p, i) => p.id === id).html =
            match.html.replace(pattern, substitution)
        }

        archive.music.albums['hiveswap-act-2-ost'].art = [] // Fix tobyfox crash
        archive.music.tracks['flying-car'].bandcampId = 415056291 // Bowman - Fly to ES - Flying Car

        // Correct Red Sucker misattribution - RJ Lake -> Kalibration
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

        // Hotfix some formatting headaches

        archive.mspa.story['004153'].content = archive.mspa.story['004153'].content.replace(
          `<span style="color: #2ed73a">L</span><img src="http://www.mspaintadventures.com/storyfiles/hs2/scraps/o.gif" border="0" /><span style="color: #2ed73a">rd English</span>`,
          `<span style="color: #2ed73a; white-space: nowrap">L<img src="assets://storyfiles/hs2/scraps/o.gif" border="0">rd English</span>`)

        archive.mspa.story['005530'].content = archive.mspa.story['005530'].content.replace(
          `<span style="color: #2ed73a">L</span><img src="http://www.mspaintadventures.com/storyfiles/hs2/scraps/o.gif" border="0" /><span style="color: #2ed73a">rd English</span>`,
          `<span style="color: #2ed73a; white-space: nowrap">L<img src="assets://storyfiles/hs2/scraps/o.gif" border="0">rd English</span>`)

        archive.comics.pxs.comics['you-have-a-feeling-its-going-to-be-a-long-day'].credit = "Zach Morrison and Andrew Hussie"

        archive.social.blogspot[8].html = archive.social.blogspot[8].html.replace('archive/tso/blurbs', 'archive/comics/tso/blurbs')

        editFormspring('andrewhussie', 'andrewhussie550488999', '"/archive/formspring/00958_1.gif"', '"assets://archive/social/formspring/00958_1.gif"')

        archive.extras['epilogues'] = epiloguesYaml

        // This whole mess is to account for the Homestuck Bandcamp page being fixed
        // Which means that basically every Bandcamp URL and embed has to be updated

        // ALBUM PAGES
        archive.music.albums['homestuck-vol-1'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-1-4"
        archive.music.albums['homestuck-vol-2'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-1-4"
        archive.music.albums['homestuck-vol-3'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-1-4"
        archive.music.albums['midnight-crew-drawing-dead'].urls[0] = "https://homestuck.bandcamp.com/album/midnight-crew-drawing-dead-2"
        archive.music.albums['homestuck-vol-4'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-1-4"
        archive.music.albums['homestuck-vol-5'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-5"
        archive.music.albums['alternia'].urls[0] = "https://homestuck.bandcamp.com/album/alternia"
        archive.music.albums['squiddles'].urls.unshift("https://homestuck.bandcamp.com/album/squiddles")
        archive.music.albums['the-felt'].urls[0] = "https://homestuck.bandcamp.com/album/the-felt"
        archive.music.albums['homestuck-vol-6'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-6-heir-transparent"
        archive.music.albums['strife'].urls.unshift("https://homestuck.bandcamp.com/album/strife")
        archive.music.albums['alterniabound'].urls[0] = "https://homestuck.bandcamp.com/album/alterniabound"
        archive.music.albums['medium'].urls[0] = "https://homestuck.bandcamp.com/album/medium"
        archive.music.albums['mobius-trip-and-hadron-kaleido'].urls.unshift("https://homestuck.bandcamp.com/album/mobius-trip-and-hadron-kaleido")
        archive.music.albums['homestuck-vol-7'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-7-at-the-price-of-oblivion"
        archive.music.albums['sburb'].urls.unshift("https://homestuck.bandcamp.com/album/sburb")
        archive.music.albums['the-wanderers'].urls.unshift("https://homestuck.bandcamp.com/album/the-wanderers")
        archive.music.albums['prospit-and-derse'].urls.shift()
        archive.music.albums['prospit-and-derse'].urls.unshift("https://homestuck.bandcamp.com/album/prospit-derse", "https://solatrus.bandcamp.com/album/prospit-derse")
        archive.music.albums['homestuck-vol-1-4'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-1-4"
        archive.music.albums['homestuck-vol-8'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-8"
        archive.music.albums['song-of-skaia'].urls.unshift("https://homestuck.bandcamp.com/album/song-of-skaia")
        archive.music.albums['homestuck-vol-9'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-9"
        archive.music.albums['symphony-impossible-to-play'].urls[0] = "https://homestuck.bandcamp.com/album/symphony-impossible-to-play"
        archive.music.albums['one-year-older'].urls.unshift("https://homestuck.bandcamp.com/album/one-year-older")
        archive.music.albums['genesis-frog'].urls.unshift("https://homestuck.bandcamp.com/album/genesis-frog")
        archive.music.albums['cherubim'].urls[0] = "https://homestuck.bandcamp.com/album/cherubim"
        archive.music.albums['s-collide'].urls[0] = "https://homestuck.bandcamp.com/album/s-collide"
        archive.music.albums['act-7'].urls[0] = "https://homestuck.bandcamp.com/album/act-7"
        archive.music.albums['homestuck-vol-10'].urls[0] = "https://homestuck.bandcamp.com/album/homestuck-vol-10"
        archive.music.albums['the-grubbles'].urls[0] = "https://homestuck.bandcamp.com/album/the-grubbles"
        archive.music.albums['hiveswap-act-1-ost'].urls[0] = "https://homestuck.bandcamp.com/album/hiveswap-act-1-ost"
        // VOLUME 1
        archive.music.tracks['showtime-piano-refrain'].urls[0] = archive.music.tracks['showtime-piano-refrain'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['harlequin'].urls[0] = archive.music.tracks['harlequin'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['showtime-original-mix'].urls[0] = archive.music.tracks['showtime-original-mix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['aggrieve-violin-refrain'].urls[0] = archive.music.tracks['aggrieve-violin-refrain'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['sburban-countdown'].urls[0] = archive.music.tracks['sburban-countdown'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['aggrieve'].urls[0] = archive.music.tracks['aggrieve'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['showtime-imp-strife-mix'].urls[0] = archive.music.tracks['showtime-imp-strife-mix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['nannaquin'].urls[0] = archive.music.tracks['nannaquin'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['skies-of-skaia'].urls[0] = archive.music.tracks['skies-of-skaia'].urls[0].slice(0, -1) + "2"
        // VOLUME 2
        archive.music.tracks['harlequin-rock-version'].urls[0] = archive.music.tracks['harlequin-rock-version'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['upward-movement-dave-owns'].urls[0] = archive.music.tracks['upward-movement-dave-owns'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['vagabounce'].urls[0] = archive.music.tracks['vagabounce'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['explore'].urls[0] = archive.music.tracks['explore'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['showtime-remix'].urls[0] = archive.music.tracks['showtime-remix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['aggrieve-remix'].urls[0] = archive.music.tracks['aggrieve-remix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['verdancy-bassline'].urls[0] = archive.music.tracks['verdancy-bassline'].urls[0].slice(0, -1) + "2"
        // VOLUME 3
        archive.music.tracks['beatdown-strider-style'].urls[0] = archive.music.tracks['beatdown-strider-style'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['harleboss'].urls[0] = archive.music.tracks['harleboss'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['beatdown-round-2'].urls[0] = archive.music.tracks['beatdown-round-2'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['dissension-original'].urls[0] = archive.music.tracks['dissension-original'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['dissension-remix'].urls[0] = archive.music.tracks['dissension-remix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['ohgodwhat'].urls[0] = archive.music.tracks['ohgodwhat'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['ohgodwhat-remix'].urls[0] = archive.music.tracks['ohgodwhat-remix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['rediscover-fusion'].urls[0] = archive.music.tracks['rediscover-fusion'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['explore-remix'].urls[0] = archive.music.tracks['explore-remix'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['chorale-for-jaspers'].urls[0] = archive.music.tracks['chorale-for-jaspers'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['pony-chorale'].urls[0] = archive.music.tracks['pony-chorale'].urls[0].slice(0, -1) + "2"
        // MIDNIGHT CREW
        archive.music.tracks['three-in-the-morning'].urls[0] = archive.music.tracks['three-in-the-morning'].urls[0].slice(0, -2)
        archive.music.tracks['blue-noir'].urls[0] = archive.music.tracks['blue-noir'].urls[0].slice(0, -2)
        archive.music.tracks['dead-shuffle'].urls[0] = archive.music.tracks['dead-shuffle'].urls[0].slice(0, -2)
        archive.music.tracks['hearts-flush'].urls[0] = archive.music.tracks['hearts-flush'].urls[0].slice(0, -2)
        archive.music.tracks['knives-and-ivory'].urls[0] = archive.music.tracks['knives-and-ivory'].urls[0].slice(0, -2)
        archive.music.tracks['liquid-negrocity'].urls[0] = archive.music.tracks['liquid-negrocity'].urls[0].slice(0, -2)
        archive.music.tracks['hollow-suit'].urls[0] = archive.music.tracks['hollow-suit'].urls[0].slice(0, -2)
        archive.music.tracks['ante-matter'].urls[0] = archive.music.tracks['ante-matter'].urls[0].slice(0, -2)
        archive.music.tracks['the-ballad-of-jack-noir'].urls[0] = archive.music.tracks['the-ballad-of-jack-noir'].urls[0].slice(0, -2)
        archive.music.tracks['lunar-eclipse'].urls[0] = archive.music.tracks['lunar-eclipse'].urls[0].slice(0, -2)
        archive.music.tracks['hauntjam'].urls[0] = archive.music.tracks['hauntjam'].urls[0].slice(0, -2)
        archive.music.tracks['carbon-nadsat-cuestick-genius'].urls[0] = archive.music.tracks['carbon-nadsat-cuestick-genius'].urls[0].slice(0, -2)
        archive.music.tracks['ace-of-trump'].urls[0] = archive.music.tracks['ace-of-trump'].urls[0].slice(0, -2)
        archive.music.tracks['moonshine'].urls[0] = archive.music.tracks['moonshine'].urls[0].slice(0, -2)
        archive.music.tracks['tall-dark-and-loathsome'].urls[0] = archive.music.tracks['tall-dark-and-loathsome'].urls[0].slice(0, -2)
        archive.music.tracks['jokers-wild'].urls[0] = archive.music.tracks['jokers-wild'].urls[0].slice(0, -2)
        archive.music.tracks['livin-it-up'].urls[0] = archive.music.tracks['livin-it-up'].urls[0].slice(0, -2)
        archive.music.tracks['hauntjelly'].urls[0] = archive.music.tracks['hauntjelly'].urls[0].slice(0, -2)
        // VOLUME 4
        archive.music.tracks['revelawesome'].urls[0] = archive.music.tracks['revelawesome'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['hardlyquin'].urls[0] = archive.music.tracks['hardlyquin'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['carefree-victory'].urls[0] = archive.music.tracks['carefree-victory'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['ballad-of-awakening'].urls[0] = archive.music.tracks['ballad-of-awakening'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['sburban-jungle'].urls[0] = archive.music.tracks['sburban-jungle'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['three-in-the-morning-rj'].urls[0] = archive.music.tracks['three-in-the-morning-rj'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['doctor'].urls[0] = archive.music.tracks['doctor'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['endless-climb'].urls[0] = archive.music.tracks['endless-climb'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['atomyk-ebonpyre'].urls[0] = archive.music.tracks['atomyk-ebonpyre'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['black'].urls[0] = archive.music.tracks['black'].urls[0].slice(0, -1) + "2"
        // VOLUME 5
        archive.music.tracks['homestuck-anthem'].urls[0] = archive.music.tracks['homestuck-anthem'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-skirmish'].urls[0] = archive.music.tracks['skaian-skirmish'].urls[0].slice(0, -2)
        archive.music.tracks['savior-of-the-waking-world'].urls[0] = archive.music.tracks['savior-of-the-waking-world'].urls[0].slice(0, -2)
        archive.music.tracks['clockwork-melody'].urls[0] = archive.music.tracks['clockwork-melody'].urls[0].slice(0, -2)
        archive.music.tracks['heirfare'].urls[0] = archive.music.tracks['heirfare'].urls[0].slice(0, -2)
        archive.music.tracks['jades-lullaby'].urls[0] = archive.music.tracks['jades-lullaby'].urls[0].slice(0, -2)
        archive.music.tracks['aggrievance'].urls[0] = archive.music.tracks['aggrievance'].urls[0].slice(0, -2)
        archive.music.tracks['happy-cat-song'].urls[0] = archive.music.tracks['happy-cat-song'].urls[0].slice(0, -2)
        archive.music.tracks['hardchorale'].urls[0] = archive.music.tracks['hardchorale'].urls[0].slice(0, -2)
        archive.music.tracks['an-unbreakable-union'].urls[0] = archive.music.tracks['an-unbreakable-union'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-ride'].urls[0] = archive.music.tracks['skaian-ride'].urls[0].slice(0, -2)
        archive.music.tracks['white'].urls[0] = archive.music.tracks['white'].urls[0].slice(0, -2)
        archive.music.tracks['octoroon-rangoon'].urls[0] = archive.music.tracks['octoroon-rangoon'].urls[0].slice(0, -2)
        archive.music.tracks['pumpkin-cravings'].urls[0] = archive.music.tracks['pumpkin-cravings'].urls[0].slice(0, -2)
        archive.music.tracks['welcome-to-the-new-extreme'].urls[0] = archive.music.tracks['welcome-to-the-new-extreme'].urls[0].slice(0, -2)
        archive.music.tracks['crystalanthemums'].urls[0] = archive.music.tracks['crystalanthemums'].urls[0].slice(0, -2)
        archive.music.tracks['skaia-incipisphere-mix'].urls[0] = archive.music.tracks['skaia-incipisphere-mix'].urls[0].slice(0, -2)
        archive.music.tracks['sarabande-vol5'].urls[0] = archive.music.tracks['sarabande-vol5'].urls[0].slice(0, -2)
        archive.music.tracks['clockwork-sorrow'].urls[0] = archive.music.tracks['clockwork-sorrow'].urls[0].slice(0, -2)
        archive.music.tracks['phantasmagoric-waltz'].urls[0] = archive.music.tracks['phantasmagoric-waltz'].urls[0].slice(0, -2)
        archive.music.tracks['sunslammer'].urls[0] = archive.music.tracks['sunslammer'].urls[0].slice(0, -2)
        archive.music.tracks['lotus-land-story'].urls[0] = archive.music.tracks['lotus-land-story'].urls[0].slice(0, -2)
        archive.music.tracks['chorale-for-war'].urls[0] = archive.music.tracks['chorale-for-war'].urls[0].slice(0, -2)
        archive.music.tracks['unsheathd'].urls[0] = archive.music.tracks['unsheathd'].urls[0].slice(0, -2)
        archive.music.tracks['versus'].urls[0] = archive.music.tracks['versus'].urls[0].slice(0, -2)
        archive.music.tracks['planet-healer'].urls[0] = archive.music.tracks['planet-healer'].urls[0].slice(0, -2)
        archive.music.tracks['bed-of-roses-dreams-of-derse'].urls[0] = archive.music.tracks['bed-of-roses-dreams-of-derse'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-flight'].urls[0] = archive.music.tracks['skaian-flight'].urls[0].slice(0, -2)
        archive.music.tracks['how-do-i-live-bunny-back-in-the-box-version'].urls[0] = archive.music.tracks['how-do-i-live-bunny-back-in-the-box-version'].urls[0].slice(0, -2)
        archive.music.tracks['dupliblaze-comagma'].urls[0] = archive.music.tracks['dupliblaze-comagma'].urls[0].slice(0, -2)
        archive.music.tracks['moonshatter'].urls[0] = archive.music.tracks['moonshatter'].urls[0].slice(0, -2)
        archive.music.tracks['sunsetter'].urls[0] = archive.music.tracks['sunsetter'].urls[0].slice(0, -2)
        archive.music.tracks['lotus'].urls[0] = archive.music.tracks['lotus'].urls[0].slice(0, -2)
        archive.music.tracks['ruins-with-strings'].urls[0] = archive.music.tracks['ruins-with-strings'].urls[0].slice(0, -2)
        archive.music.tracks['ectobiology'].urls[0] = archive.music.tracks['ectobiology'].urls[0].slice(0, -2)
        archive.music.tracks['upholding-the-law'].urls[0] = archive.music.tracks['upholding-the-law'].urls[0].slice(0, -2)
        archive.music.tracks['underworld'].urls[0] = archive.music.tracks['underworld'].urls[0].slice(0, -2)
        archive.music.tracks['crystamanthequins'].urls[0] = archive.music.tracks['crystamanthequins'].urls[0].slice(0, -2)
        archive.music.tracks['endless-climbing'].urls[0] = archive.music.tracks['endless-climbing'].urls[0].slice(0, -2)
        archive.music.tracks['land-of-the-salamanders'].urls[0] = archive.music.tracks['land-of-the-salamanders'].urls[0].slice(0, -2)
        archive.music.tracks['medical-emergency'].urls[0] = archive.music.tracks['medical-emergency'].urls[0].slice(0, -2)
        archive.music.tracks['clockwork-contrivance'].urls[0] = archive.music.tracks['clockwork-contrivance'].urls[0].slice(0, -2)
        archive.music.tracks['get-up'].urls[0] = archive.music.tracks['get-up'].urls[0].slice(0, -2)
        archive.music.tracks['vertical-motion'].urls[0] = archive.music.tracks['vertical-motion'].urls[0].slice(0, -2)
        archive.music.tracks['the-beginning-of-something-really-excellent'].urls[0] = archive.music.tracks['the-beginning-of-something-really-excellent'].urls[0].slice(0, -2)
        archive.music.tracks['pyrocumulus-kickstart'].urls[0] = archive.music.tracks['pyrocumulus-kickstart'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-skuffle'].urls[0] = archive.music.tracks['skaian-skuffle'].urls[0].slice(0, -2)
        archive.music.tracks['throwdown'].urls[0] = archive.music.tracks['throwdown'].urls[0].slice(0, -2)
        archive.music.tracks['valhalla'].urls[0] = archive.music.tracks['valhalla'].urls[0].slice(0, -2)
        archive.music.tracks['amphibious-subterrain'].urls[0] = archive.music.tracks['amphibious-subterrain'].urls[0].slice(0, -2)
        archive.music.tracks['light-vol5'].urls[0] = archive.music.tracks['light-vol5'].urls[0].slice(0, -2)
        archive.music.tracks['softly'].urls[0] = archive.music.tracks['softly'].urls[0].slice(0, -2)
        archive.music.tracks['greenhouse'].urls[0] = archive.music.tracks['greenhouse'].urls[0].slice(0, -2)
        archive.music.tracks['space-prankster'].urls[0] = archive.music.tracks['space-prankster'].urls[0].slice(0, -2)
        archive.music.tracks['ecstacy'].urls[0] = archive.music.tracks['ecstacy'].urls[0].slice(0, -2)
        archive.music.tracks['snow-pollen'].urls[0] = archive.music.tracks['snow-pollen'].urls[0].slice(0, -2)
        archive.music.tracks['candles-and-clockwork'].urls[0] = archive.music.tracks['candles-and-clockwork'].urls[0].slice(0, -2)
        archive.music.tracks['can-town'].urls[0] = archive.music.tracks['can-town'].urls[0].slice(0, -2)
        archive.music.tracks['plague-doctor'].urls[0] = archive.music.tracks['plague-doctor'].urls[0].slice(0, -2)
        archive.music.tracks['enlightenment'].urls[0] = archive.music.tracks['enlightenment'].urls[0].slice(0, -2)
        archive.music.tracks['doctor-remix'].urls[0] = archive.music.tracks['doctor-remix'].urls[0].slice(0, -2)
        archive.music.tracks['biophosphoradelecrystalluminescence'].urls[0] = archive.music.tracks['biophosphoradelecrystalluminescence'].urls[0].slice(0, -2)
        archive.music.tracks['song-of-life'].urls[0] = archive.music.tracks['song-of-life'].urls[0].slice(0, -2)
        archive.music.tracks['descend'].urls[0] = archive.music.tracks['descend'].urls[0].slice(0, -2)
        archive.music.tracks['homestuck'].urls[0] = archive.music.tracks['homestuck'].urls[0].slice(0, -2)
        // ALTERNIA
        archive.music.tracks['crustacean'].urls[0] = archive.music.tracks['crustacean'].urls[0].slice(0, -2)
        archive.music.tracks['showdown'].urls[0] = archive.music.tracks['showdown'].urls[0].slice(0, -2)
        archive.music.tracks['miracles'].urls[0] = archive.music.tracks['miracles'].urls[0].slice(0, -2)
        archive.music.tracks['the-lemonsnout-turnabout'].urls[0] = archive.music.tracks['the-lemonsnout-turnabout'].urls[0].slice(0, -2)
        archive.music.tracks['phaze-and-blood'].urls[0] = archive.music.tracks['phaze-and-blood'].urls[0].slice(0, -2)
        archive.music.tracks['psych0ruins'].urls[0] = archive.music.tracks['psych0ruins'].urls[0].slice(0, -2)
        archive.music.tracks['walls-covered-in-blood'].urls[0] = archive.music.tracks['walls-covered-in-blood'].urls[0].slice(0, -2)
        archive.music.tracks['desperado-rocket-chairs'].urls[0] = archive.music.tracks['desperado-rocket-chairs'].urls[0].slice(0, -2)
        archive.music.tracks['death-of-the-lusii'].urls[0] = archive.music.tracks['death-of-the-lusii'].urls[0].slice(0, -2)
        archive.music.tracks['virgin-orb'].urls[0] = archive.music.tracks['virgin-orb'].urls[0].slice(0, -2)
        archive.music.tracks['the-la2t-frontiier'].urls[0] = archive.music.tracks['the-la2t-frontiier'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-summoning'].urls[0] = archive.music.tracks['skaian-summoning'].urls[0].slice(0, -2)
        archive.music.tracks['the-thirteenth-hour'].urls.shift()
        archive.music.tracks['spiders-claw'].urls[0] += "-bonus"
        archive.music.tracks['staring'].urls[0] += "-bonus"
        archive.music.tracks['keepers'].urls[0] += "-bonus"
        archive.music.tracks['theme'].urls.shift()
        archive.music.tracks['walls-covered-in-blood-dx'].urls.shift()
        // SQUIDDLES
        archive.music.tracks['squiddles'].urls.unshift("https://homestuck.bandcamp.com/track/squiddles")
        archive.music.tracks['rainbow-valley'].urls.unshift("https://homestuck.bandcamp.com/track/rainbow-valley")
        archive.music.tracks['squiddle-parade'].urls.unshift("https://homestuck.bandcamp.com/track/squiddle-parade")
        archive.music.tracks['squiddle-march'].urls.unshift("https://homestuck.bandcamp.com/track/squiddle-march")
        archive.music.tracks['tangled-waltz'].urls.unshift("https://homestuck.bandcamp.com/track/tangled-waltz")
        archive.music.tracks['sun-speckled-squiddly-afternoon'].urls.unshift("https://homestuck.bandcamp.com/track/sun-speckled-squiddly-afternoon")
        archive.music.tracks['squiddles-campfire'].urls.unshift("https://homestuck.bandcamp.com/track/squiddles-campfire")
        archive.music.tracks['friendship-is-paramount'].urls.unshift("https://homestuck.bandcamp.com/track/friendship-is-paramount")
        archive.music.tracks['lazybones'].urls.unshift("https://homestuck.bandcamp.com/track/lazybones")
        archive.music.tracks['tentacles'].urls.unshift("https://homestuck.bandcamp.com/track/tentacles")
        archive.music.tracks['squiddles-happytime-fun-go'].urls.unshift("https://homestuck.bandcamp.com/track/squiddles-happytime-fun-go")
        archive.music.tracks['the-sound-of-pure-squid-giggles'].urls.unshift("https://homestuck.bandcamp.com/track/the-sound-of-pure-squid-giggles")
        archive.music.tracks['squiddle-samba'].urls.unshift("https://homestuck.bandcamp.com/track/squiddle-samba")
        archive.music.tracks['squiddles-in-paradise'].urls.unshift("https://homestuck.bandcamp.com/track/squiddles-in-paradise")
        archive.music.tracks['squiddidle'].urls.unshift("https://homestuck.bandcamp.com/track/squiddidle")
        archive.music.tracks['catchyegrabber-skipper-plumbthroats-song'].urls.unshift("https://homestuck.bandcamp.com/track/catchyegrabber-skipper-plumbthroats-song")
        archive.music.tracks['plumbthroat-gives-chase'].urls.unshift("https://homestuck.bandcamp.com/track/plumbthroat-gives-chase")
        archive.music.tracks['squiddles-the-movie-trailer-the-day-the-unicorns-couldnt-play'].urls.unshift("https://homestuck.bandcamp.com/track/squiddles-the-movie-trailer-the-day-the-unicorns-couldnt-play")
        archive.music.tracks['carefree-princess-berryboo'].urls.unshift("https://homestuck.bandcamp.com/track/carefree-princess-berryboo")
        archive.music.tracks['mister-bowman-tells-you-about-the-squiddles'].urls.unshift("https://homestuck.bandcamp.com/track/mister-bowman-tells-you-about-the-squiddles")
        archive.music.tracks['ocean-stars'].urls.unshift("https://homestuck.bandcamp.com/track/ocean-stars")
        archive.music.tracks['let-the-squiddles-sleep-end-theme'].urls.unshift("https://homestuck.bandcamp.com/track/let-the-squiddles-sleep-end-theme")
        // FELT
        archive.music.tracks['jade-dragon'].urls[0] = archive.music.tracks['jade-dragon'].urls[0].slice(0, -2)
        archive.music.tracks['swing-of-the-clock'].urls[0] = archive.music.tracks['swing-of-the-clock'].urls[0].slice(0, -2)
        archive.music.tracks['rhapsody-in-green'].urls[0] = archive.music.tracks['rhapsody-in-green'].urls[0].slice(0, -2)
        archive.music.tracks['humphreys-lullaby'].urls[0] = archive.music.tracks['humphreys-lullaby'].urls[0].slice(0, -2)
        archive.music.tracks['clockwork-reversal'].urls[0] = archive.music.tracks['clockwork-reversal'].urls[0].slice(0, -2)
        archive.music.tracks['chartreuse-rewind'].urls[0] = archive.music.tracks['chartreuse-rewind'].urls[0].slice(0, -2)
        archive.music.tracks['the-broken-clock'].urls[0] = archive.music.tracks['the-broken-clock'].urls[0].slice(0, -2)
        archive.music.tracks['apocryphal-antithesis'].urls[0] = archive.music.tracks['apocryphal-antithesis'].urls[0].slice(0, -2)
        archive.music.tracks['trails'].urls[0] = archive.music.tracks['trails'].urls[0].slice(0, -2)
        archive.music.tracks['baroqueback-bowtier-scratchs-lament'].urls[0] = archive.music.tracks['baroqueback-bowtier-scratchs-lament'].urls[0].slice(0, -2)
        archive.music.tracks['scratch'].urls[0] = archive.music.tracks['scratch'].urls[0].slice(0, -2)
        archive.music.tracks['omelette-sandwich'].urls[0] = archive.music.tracks['omelette-sandwich'].urls[0].slice(0, -2)
        archive.music.tracks['temporal-piano'].urls[0] = archive.music.tracks['temporal-piano'].urls[0].slice(0, -2)
        archive.music.tracks['time-paradox'].urls[0] = archive.music.tracks['time-paradox'].urls[0].slice(0, -2)
        archive.music.tracks['eldritch'].urls[0] = archive.music.tracks['eldritch'].urls[0].slice(0, -2)
        archive.music.tracks['english'].urls[0] = archive.music.tracks['english'].urls[0].slice(0, -2)
        archive.music.tracks['variations'].urls[0] = archive.music.tracks['variations'].urls[0].slice(0, -2)
        // VOL 6
        archive.music.tracks['frost-vol6'].urls[0] = archive.music.tracks['frost-vol6'].urls[0].slice(0, -2)
        archive.music.tracks['courser'].urls[0] = archive.music.tracks['courser'].urls[0].slice(0, -2)
        archive.music.tracks['umbral-ultimatum'].urls[0] = archive.music.tracks['umbral-ultimatum'].urls[0].slice(0, -2)
        archive.music.tracks['gamebro-original-1990-mix'].urls[0] = archive.music.tracks['gamebro-original-1990-mix'].urls[0].slice(0, -2)
        archive.music.tracks['tribal-ebonpyre'].urls[0] = archive.music.tracks['tribal-ebonpyre'].urls[0].slice(0, -2)
        archive.music.tracks['i-dont-want-to-miss-a-thing'].urls[0] = archive.music.tracks['i-dont-want-to-miss-a-thing'].urls[0].slice(0, -2)
        archive.music.tracks['megalovania'].urls[0] = archive.music.tracks['megalovania'].urls[0].slice(0, -2)
        archive.music.tracks['walk-stab-walk-rande'].urls[0] = archive.music.tracks['walk-stab-walk-rande'].urls[0].slice(0, -2)
        archive.music.tracks['gaia-queen'].urls[0] = archive.music.tracks['gaia-queen'].urls[0].slice(0, -2)
        archive.music.tracks['elevatorstuck'].urls[0] = archive.music.tracks['elevatorstuck'].urls[0].slice(0, -2)
        archive.music.tracks['wacky-antics'].urls[0] = archive.music.tracks['wacky-antics'].urls[0].slice(0, -2)
        archive.music.tracks['horschestra'].urls[0] = archive.music.tracks['horschestra'].urls[0].slice(0, -2)
        archive.music.tracks['heir-transparent'].urls[0] = archive.music.tracks['heir-transparent'].urls[0].slice(0, -2)
        archive.music.tracks['boy-skylark-brief'].urls[0] = archive.music.tracks['boy-skylark-brief'].urls[0].slice(0, -2)
        archive.music.tracks['squidissension'].urls[0] = archive.music.tracks['squidissension'].urls[0].slice(0, -2)
        archive.music.tracks['blackest-heart'].urls[0] = archive.music.tracks['blackest-heart'].urls[0].slice(0, -2)
        archive.music.tracks['nic-cage-song'].urls[0] = archive.music.tracks['nic-cage-song'].urls[0].slice(0, -2)
        archive.music.tracks['phrenic-phever'].urls[0] = archive.music.tracks['phrenic-phever'].urls[0].slice(0, -2)
        archive.music.tracks['3-in-the-morning-pianokind'].urls[0] = archive.music.tracks['3-in-the-morning-pianokind'].urls[0].slice(0, -2)
        archive.music.tracks['a-tender-moment'].urls[0] = archive.music.tracks['a-tender-moment'].urls[0].slice(0, -2)
        archive.music.tracks['crystalanthology'].urls[0] = archive.music.tracks['crystalanthology'].urls[0].slice(0, -2)
        // STRIFE
        archive.music.tracks['stormspirit'].urls.unshift("https://homestuck.bandcamp.com/track/stormspirit")
        archive.music.tracks['heir-conditioning'].urls.unshift("https://homestuck.bandcamp.com/track/heir-conditioning")
        archive.music.tracks['dance-of-thorns'].urls.unshift("https://homestuck.bandcamp.com/track/dance-of-thorns")
        archive.music.tracks['time-on-my-side'].urls.unshift("https://homestuck.bandcamp.com/track/time-on-my-side")
        archive.music.tracks['atomic-bonsai'].urls.unshift("https://homestuck.bandcamp.com/track/atomic-bonsai")
        archive.music.tracks['knifes-edge'].urls.unshift("https://homestuck.bandcamp.com/track/knifes-edge")
        // ALTERNIABOUND
        archive.music.tracks['arisen-anew'].urls[0] = archive.music.tracks['arisen-anew'].urls[0].slice(0, -2)
        archive.music.tracks['karkats-theme'].urls[0] = archive.music.tracks['karkats-theme'].urls[0].slice(0, -2)
        archive.music.tracks['trollcops'].urls[0] = archive.music.tracks['trollcops'].urls[0].slice(0, -2)
        archive.music.tracks['bl1nd-just1c3-1nv3st1g4t1on'].urls[0] = archive.music.tracks['bl1nd-just1c3-1nv3st1g4t1on'].urls[0].slice(0, -2)
        archive.music.tracks['terezis-theme'].urls[0] = archive.music.tracks['terezis-theme'].urls[0].slice(0, -2)
        archive.music.tracks['dreamers-and-the-dead'].urls[0] = archive.music.tracks['dreamers-and-the-dead'].urls[0].slice(0, -2)
        archive.music.tracks['vriskas-theme'].urls[0] = archive.music.tracks['vriskas-theme'].urls[0].slice(0, -2)
        archive.music.tracks['shes-a-sp8der'].urls[0] = archive.music.tracks['shes-a-sp8der'].urls[0].slice(0, -2)
        archive.music.tracks['fiduspawn-go'].urls[0] = archive.music.tracks['fiduspawn-go'].urls[0].slice(0, -2)
        archive.music.tracks['darling-kanaya'].urls[0] = archive.music.tracks['darling-kanaya'].urls[0].slice(0, -2)
        archive.music.tracks['requiem-of-sunshine-and-rainbows'].urls[0] = archive.music.tracks['requiem-of-sunshine-and-rainbows'].urls[0].slice(0, -2)
        archive.music.tracks['eridans-theme'].urls[0] = archive.music.tracks['eridans-theme'].urls[0].slice(0, -2)
        archive.music.tracks['nautical-nightmare'].urls[0] = archive.music.tracks['nautical-nightmare'].urls[0].slice(0, -2)
        archive.music.tracks['nepetas-theme'].urls[0] = archive.music.tracks['nepetas-theme'].urls[0].slice(0, -2)
        archive.music.tracks['horschestra-strong-version'].urls[0] = archive.music.tracks['horschestra-strong-version'].urls[0].slice(0, -2)
        archive.music.tracks['blackest-heart-with-honks'].urls[0] = archive.music.tracks['blackest-heart-with-honks'].urls[0].slice(0, -2)
        archive.music.tracks['midnight-calliope'].urls[0] = archive.music.tracks['midnight-calliope'].urls[0].slice(0, -2)
        archive.music.tracks['chaotic-strength'].urls[0] = archive.music.tracks['chaotic-strength'].urls[0].slice(0, -2)
        archive.music.tracks['trollian-standoff'].urls[0] = archive.music.tracks['trollian-standoff'].urls[0].slice(0, -2)
        archive.music.tracks['rex-duodecim-angelus'].urls[0] = archive.music.tracks['rex-duodecim-angelus'].urls[0].slice(0, -2)
        archive.music.tracks['killed-by-br8k-spider'].urls[0] = archive.music.tracks['killed-by-br8k-spider'].urls[0].slice(0, -2)
        archive.music.tracks['alternia'].urls[0] = archive.music.tracks['alternia'].urls[0].slice(0, -2)
        archive.music.tracks['trollcops-radio-play'].urls.shift()
        archive.music.tracks['catapult-capuchin'].urls.shift()
        archive.music.tracks['science-seahorse'].urls.shift()
        archive.music.tracks['a-fairy-battle'].urls.shift()
        archive.music.tracks['the-blind-prophet'].urls.shift()
        archive.music.tracks['alterniabound'].urls.shift()
        archive.music.tracks['you-won-a-combat'].urls.shift()
        archive.music.tracks['rest-a-while'].urls.shift()
        // MEDIUM
        archive.music.tracks['light-medium'].urls[0] = archive.music.tracks['light-medium'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['shade'].urls[0] = archive.music.tracks['shade'].urls[0].slice(0, -2)
        archive.music.tracks['rain'].urls[0] = archive.music.tracks['rain'].urls[0].slice(0, -2)
        archive.music.tracks['frogs'].urls[0] = archive.music.tracks['frogs'].urls[0].slice(0, -2)
        archive.music.tracks['frost-medium'].urls[0] = archive.music.tracks['frost-medium'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['clockwork'].urls[0] = archive.music.tracks['clockwork'].urls[0].slice(0, -2)
        archive.music.tracks['heat'].urls[0] = archive.music.tracks['heat'].urls[0].slice(0, -2)
        archive.music.tracks['wind'].urls[0] = archive.music.tracks['wind'].urls[0].slice(0, -2)
        // MTAHK
        archive.music.tracks['forever'].urls.unshift("https://homestuck.bandcamp.com/track/forever")
        archive.music.tracks['dawn-of-man'].urls.unshift("https://homestuck.bandcamp.com/track/dawn-of-man")
        archive.music.tracks['beta-version'].urls.unshift("https://homestuck.bandcamp.com/track/beta-version")
        archive.music.tracks['no-release'].urls.unshift("https://homestuck.bandcamp.com/track/no-release")
        archive.music.tracks['fly'].urls.unshift("https://homestuck.bandcamp.com/track/fly")
        archive.music.tracks['lies-with-the-sea'].urls.unshift("https://homestuck.bandcamp.com/track/lies-with-the-sea")
        archive.music.tracks['chain-of-prospit'].urls.unshift("https://homestuck.bandcamp.com/track/chain-of-prospit")
        archive.music.tracks['pumpkin-tide'].urls.unshift("https://homestuck.bandcamp.com/track/pumpkin-tide")
        archive.music.tracks['the-deeper-you-go'].urls.unshift("https://homestuck.bandcamp.com/track/the-deeper-you-go")
        // VOL 7
        archive.music.tracks['black-rose-green-sun'].urls[0] = archive.music.tracks['black-rose-green-sun'].urls[0].slice(0, -2)
        archive.music.tracks['at-the-price-of-oblivion'].urls[0] = archive.music.tracks['at-the-price-of-oblivion'].urls[0].slice(0, -2)
        archive.music.tracks['even-in-death'].urls[0] = archive.music.tracks['even-in-death'].urls[0].slice(0, -2)
        archive.music.tracks['terezi-owns'].urls[0] = archive.music.tracks['terezi-owns'].urls[0].slice(0, -2)
        archive.music.tracks['trial-and-execution'].urls[0] = archive.music.tracks['trial-and-execution'].urls[0].slice(0, -2)
        archive.music.tracks['the-carnival'].urls[0] = archive.music.tracks['the-carnival'].urls[0].slice(0, -2)
        archive.music.tracks['spider8reath'].urls[0] = archive.music.tracks['spider8reath'].urls[0].slice(0, -2)
        archive.music.tracks['lifdoff'].urls[0] = archive.music.tracks['lifdoff'].urls[0].slice(0, -2)
        archive.music.tracks['awakening'].urls[0] = archive.music.tracks['awakening'].urls[0].slice(0, -2)
        archive.music.tracks['havoc-to-be-wrought'].urls[0] = archive.music.tracks['havoc-to-be-wrought'].urls[0].slice(0, -2)
        archive.music.tracks['play-the-wind'].urls[0] = archive.music.tracks['play-the-wind'].urls[0].slice(0, -2)
        archive.music.tracks['rumble-at-the-rink'].urls[0] = archive.music.tracks['rumble-at-the-rink'].urls[0].slice(0, -2)
        archive.music.tracks['lets-all-rock-the-heist'].urls[0] = archive.music.tracks['lets-all-rock-the-heist'].urls[0].slice(0, -2)
        archive.music.tracks['wsw-beatdown'].urls[0] = archive.music.tracks['wsw-beatdown'].urls[0].slice(0, -2)
        archive.music.tracks['earthsea-borealis'].urls[0] = archive.music.tracks['earthsea-borealis'].urls[0].slice(0, -2)
        archive.music.tracks['warhammer-of-zillyhoo'].urls[0] = archive.music.tracks['warhammer-of-zillyhoo'].urls[0].slice(0, -2)
        archive.music.tracks['savior-of-the-dreaming-dead'].urls[0] = archive.music.tracks['savior-of-the-dreaming-dead'].urls[0].slice(0, -2)
        archive.music.tracks['maplehoofs-adventure'].urls.shift()
        archive.music.tracks['sburban-reversal'].urls.shift()
        archive.music.tracks['white-host-green-room'].urls.shift()
        // SBURB
        archive.music.tracks['the-prelude'].urls.unshift("https://homestuck.bandcamp.com/track/the-prelude")
        archive.music.tracks['genesis'].urls.unshift("https://homestuck.bandcamp.com/track/genesis")
        archive.music.tracks['eden'].urls.unshift("https://homestuck.bandcamp.com/track/eden")
        archive.music.tracks['exodus'].urls.unshift("https://homestuck.bandcamp.com/track/exodus")
        archive.music.tracks['requiem'].urls.unshift("https://homestuck.bandcamp.com/track/requiem")
        archive.music.tracks['the-meek'].urls.unshift("https://homestuck.bandcamp.com/track/the-meek")
        archive.music.tracks['chronicles'].urls.unshift("https://homestuck.bandcamp.com/track/chronicles")
        archive.music.tracks['rapture'].urls.unshift("https://homestuck.bandcamp.com/track/rapture")
        archive.music.tracks['creation'].urls.unshift("https://homestuck.bandcamp.com/track/creation")
        archive.music.tracks['revelations-i'].urls.unshift("https://homestuck.bandcamp.com/track/revelations-i")
        archive.music.tracks['revelations-ii'].urls.unshift("https://homestuck.bandcamp.com/track/revelations-ii")
        archive.music.tracks['revelations-iii'].urls.unshift("https://homestuck.bandcamp.com/track/revelations-iii")
        // WANDERERS
        archive.music.tracks['carapacian-dominion'].urls.unshift("https://homestuck.bandcamp.com/track/carapacian-dominion")
        archive.music.tracks['aimless-morning-gold'].urls.unshift("https://homestuck.bandcamp.com/track/aimless-morning-gold")
        archive.music.tracks['endless-expanse'].urls.unshift("https://homestuck.bandcamp.com/track/endless-expanse")
        archive.music.tracks['gilded-sands'].urls.unshift("https://homestuck.bandcamp.com/track/gilded-sands")
        archive.music.tracks['years-in-the-future'].urls.unshift("https://homestuck.bandcamp.com/track/years-in-the-future")
        archive.music.tracks['mayor-maynot'].urls.unshift("https://homestuck.bandcamp.com/track/mayor-maynot")
        archive.music.tracks['we-walk'].urls.unshift("https://homestuck.bandcamp.com/track/we-walk")
        archive.music.tracks['requiem-for-an-exile'].urls.unshift("https://homestuck.bandcamp.com/track/requiem-for-an-exile")
        archive.music.tracks['raggy-looking-dance'].urls.unshift("https://homestuck.bandcamp.com/track/raggy-looking-dance")
        archive.music.tracks['riches-to-ruins-movements-i-and-ii'].urls.unshift("https://homestuck.bandcamp.com/track/riches-to-ruins-movements-i-ii")
        archive.music.tracks['litrichean-rioghail'].urls.unshift("https://homestuck.bandcamp.com/track/litrichean-rioghail")
        archive.music.tracks['ruins-rising'].urls.unshift("https://homestuck.bandcamp.com/track/ruins-rising")
        archive.music.tracks['what-a-daring-dream'].urls.unshift("https://homestuck.bandcamp.com/track/what-a-daring-dream")
        archive.music.tracks['nightmare'].urls.unshift("https://homestuck.bandcamp.com/track/nightmare")
        archive.music.tracks['hallowed-halls'].urls.unshift("https://homestuck.bandcamp.com/track/hallowed-halls")
        // PROSPIT & DERSE
        archive.music.tracks['the-golden-towers'].urls.shift()
        archive.music.tracks['prospit-dreamers'].urls.shift()
        archive.music.tracks['center-of-brilliance'].urls.shift()
        archive.music.tracks['darkened-streets'].urls.shift()
        archive.music.tracks['the-obsidian-towers'].urls.shift()
        archive.music.tracks['derse-dreamers'].urls.shift()
        archive.music.tracks['core-of-darkness'].urls.unshift("https://homestuck.bandcamp.com/track/core-of-darkness", "https://solatrus.bandcamp.com/track/hallowed-halls")
        archive.music.tracks['the-golden-towers'].urls.unshift("https://homestuck.bandcamp.com/track/the-golden-towers", "https://solatrus.bandcamp.com/track/the-golden-towers")
        archive.music.tracks['prospit-dreamers'].urls.unshift("https://homestuck.bandcamp.com/track/prospit-dreamers", "https://solatrus.bandcamp.com/track/prospit-dreamers")
        archive.music.tracks['center-of-brilliance'].urls.unshift("https://homestuck.bandcamp.com/track/center-of-brilliance", "https://solatrus.bandcamp.com/track/center-of-brilliance")
        archive.music.tracks['darkened-streets'].urls.unshift("https://homestuck.bandcamp.com/track/darkened-streets", "https://solatrus.bandcamp.com/track/darkened-streets")
        archive.music.tracks['the-obsidian-towers'].urls.unshift("https://homestuck.bandcamp.com/track/the-obsidian-towers", "https://solatrus.bandcamp.com/track/the-obsidian-towers")
        archive.music.tracks['derse-dreamers'].urls.unshift("https://homestuck.bandcamp.com/track/derse-dreamers", "https://solatrus.bandcamp.com/track/derse-dreamers")
        archive.music.tracks['core-of-darkness'].urls.unshift("https://homestuck.bandcamp.com/track/core-of-darkness", "https://solatrus.bandcamp.com/track/core-of-darkness")
        // VOL 1-4
        archive.music.tracks['john-sleeps-skaian-magicant'].urls[0] = archive.music.tracks['john-sleeps-skaian-magicant'].urls[0].slice(0, -2)
        archive.music.tracks['gardener'].urls[0] = archive.music.tracks['gardener'].urls[0].slice(0, -2)
        archive.music.tracks['potential-verdancy'].urls[0] = archive.music.tracks['potential-verdancy'].urls[0].slice(0, -2)
        archive.music.tracks['doctor-original-loop'].urls.shift()
        // VOL 8
        archive.music.tracks['calamity'].urls[0] = archive.music.tracks['calamity'].urls[0].slice(0, -2)
        archive.music.tracks['do-you-remem8er-me'].urls[0] = archive.music.tracks['do-you-remem8er-me'].urls[0].slice(0, -2)
        archive.music.tracks['flare'].urls[0] = archive.music.tracks['flare'].urls[0].slice(0, -2)
        archive.music.tracks['galactic-cancer'].urls[0] = archive.music.tracks['galactic-cancer'].urls[0].slice(0, -2)
        archive.music.tracks['serenade-vol8'].urls[0] = archive.music.tracks['serenade-vol8'].urls[0].slice(0, -2)
        archive.music.tracks['frog-forager'].urls[0] = archive.music.tracks['frog-forager'].urls[0].slice(0, -2)
        archive.music.tracks['love-you-feferis-theme'].urls[0] = archive.music.tracks['love-you-feferis-theme'].urls[0].slice(0, -2)
        archive.music.tracks['ocean-stars-falling'].urls[0] = archive.music.tracks['ocean-stars-falling'].urls[0].slice(0, -2)
        archive.music.tracks['escape-pod'].urls[0] = archive.music.tracks['escape-pod'].urls[0].slice(0, -2)
        archive.music.tracks['davesprite'].urls[0] = archive.music.tracks['davesprite'].urls[0].slice(0, -2)
        archive.music.tracks['airtime'].urls[0] = archive.music.tracks['airtime'].urls[0].slice(0, -2)
        archive.music.tracks['frog-hunt'].urls[0] = archive.music.tracks['frog-hunt'].urls[0].slice(0, -2)
        archive.music.tracks['terraform'].urls[0] = archive.music.tracks['terraform'].urls[0].slice(0, -2)
        archive.music.tracks['unite-synchronization'].urls[0] = archive.music.tracks['unite-synchronization'].urls[0].slice(0, -2)
        archive.music.tracks['homefree'].urls[0] = archive.music.tracks['homefree'].urls[0].slice(0, -2)
        archive.music.tracks['galaxy-hearts'].urls[0] = archive.music.tracks['galaxy-hearts'].urls[0].slice(0, -2)
        archive.music.tracks['scourge-sisters'].urls[0] = archive.music.tracks['scourge-sisters'].urls[0].slice(0, -2)
        archive.music.tracks['arcade-thunder'].urls[0] = archive.music.tracks['arcade-thunder'].urls[0].slice(0, -2)
        archive.music.tracks['pyrocumulus-sicknasty'].urls[0] = archive.music.tracks['pyrocumulus-sicknasty'].urls[0].slice(0, -2)
        archive.music.tracks['kingside-castle'].urls[0] = archive.music.tracks['kingside-castle'].urls[0].slice(0, -2)
        archive.music.tracks['temporary'].urls[0] = archive.music.tracks['temporary'].urls[0].slice(0, -2)
        archive.music.tracks['gust-of-heir'].urls[0] = archive.music.tracks['gust-of-heir'].urls[0].slice(0, -2)
        archive.music.tracks['afraid-of-the-darko'].urls[0] = archive.music.tracks['afraid-of-the-darko'].urls[0].slice(0, -2)
        archive.music.tracks['even-in-death-tmorras-belly-mix'].urls[0] = archive.music.tracks['even-in-death-tmorras-belly-mix'].urls[0].slice(0, -2)
        archive.music.tracks['bargaining-with-the-beast'].urls[0] = archive.music.tracks['bargaining-with-the-beast'].urls[0].slice(0, -2)
        archive.music.tracks['frostbite'].urls[0] = archive.music.tracks['frostbite'].urls[0].slice(0, -2)
        archive.music.tracks['the-lost-child'].urls[0] = archive.music.tracks['the-lost-child'].urls[0].slice(0, -2)
        archive.music.tracks['questants-lament'].urls[0] = archive.music.tracks['questants-lament'].urls[0].slice(0, -2)
        archive.music.tracks['hussie-hunt'].urls[0] = archive.music.tracks['hussie-hunt'].urls[0].slice(0, -2)
        archive.music.tracks['havoc'].urls[0] = archive.music.tracks['havoc'].urls[0].slice(0, -2)
        archive.music.tracks['drift-into-the-sun'].urls[0] = archive.music.tracks['drift-into-the-sun'].urls[0].slice(0, -2)
        archive.music.tracks['infinity-mechanism'].urls[0] = archive.music.tracks['infinity-mechanism'].urls[0].slice(0, -2)
        archive.music.tracks['revered-return'].urls[0] = archive.music.tracks['revered-return'].urls[0].slice(0, -2)
        archive.music.tracks['judgment-day'].urls[0] = archive.music.tracks['judgment-day'].urls[0].slice(0, -2)
        archive.music.tracks['lotus-bloom'].urls[0] = archive.music.tracks['lotus-bloom'].urls[0].slice(0, -2)
        archive.music.tracks['cascade'].urls[0] = archive.music.tracks['cascade'].urls[0].slice(0, -2)
        archive.music.tracks['im-a-member-of-the-midnight-crew-acapella'].urls[0] = archive.music.tracks['im-a-member-of-the-midnight-crew-acapella'].urls[0].slice(0, -2)
        archive.music.tracks['how-do-i-live-d8-night-version'].urls.shift()
        archive.music.tracks['cascade-beta'].urls.shift()
        archive.music.tracks['black-hole-green-sun'].urls.shift()
        archive.music.tracks['carefree-action'].urls.shift()
        // SONG OF SKAIA
        archive.music.tracks['null-mark-hadley'].urls.unshift("https://homestuck.bandcamp.com/track/null")
        archive.music.tracks['skaian-birth'].urls.unshift("https://homestuck.bandcamp.com/track/skaian-birth")
        archive.music.tracks['song-of-skaia'].urls.unshift("https://homestuck.bandcamp.com/track/song-of-skaia")
        // VOL 9
        archive.music.tracks['crystalmethequins'].urls[0] = archive.music.tracks['crystalmethequins'].urls[0].slice(0, -2)
        archive.music.tracks['anbroids-v2'].urls[0] = archive.music.tracks['anbroids-v2'].urls[0].slice(0, -2)
        archive.music.tracks['trepidation'].urls[0] = archive.music.tracks['trepidation'].urls[0].slice(0, -2)
        archive.music.tracks['firefly'].urls[0] = archive.music.tracks['firefly'].urls[0].slice(0, -2)
        archive.music.tracks['whistling-jackhammer'].urls[0] = archive.music.tracks['whistling-jackhammer'].urls[0].slice(0, -2)
        archive.music.tracks['ugly-betty'].urls[0] = archive.music.tracks['ugly-betty'].urls[0].slice(0, -2)
        archive.music.tracks['hate-you'].urls[0] = archive.music.tracks['hate-you'].urls[0].slice(0, -2)
        archive.music.tracks['pumpkin-party-in-sea-hitlers-water-apocalypse'].urls[0] = archive.music.tracks['pumpkin-party-in-sea-hitlers-water-apocalypse'].urls[0].slice(0, -2)
        archive.music.tracks['skaianet'].urls[0] = archive.music.tracks['skaianet'].urls[0].slice(0, -2)
        archive.music.tracks['another-jungle'].urls[0] = archive.music.tracks['another-jungle'].urls[0].slice(0, -2)
        archive.music.tracks['gamegrl-original-1993-mix'].urls[0] = archive.music.tracks['gamegrl-original-1993-mix'].urls[0].slice(0, -2)
        archive.music.tracks['assault'].urls[0] = archive.music.tracks['assault'].urls[0].slice(0, -2)
        archive.music.tracks['a-little-fight-mewsic'].urls[0] = archive.music.tracks['a-little-fight-mewsic'].urls[0].slice(0, -2)
        archive.music.tracks['austin-atlantis'].urls[0] = archive.music.tracks['austin-atlantis'].urls[0].slice(0, -2)
        archive.music.tracks['despot'].urls[0] = archive.music.tracks['despot'].urls[0].slice(0, -2)
        archive.music.tracks['stress'].urls[0] = archive.music.tracks['stress'].urls[0].slice(0, -2)
        archive.music.tracks['minihoofs-adventure'].urls[0] = archive.music.tracks['minihoofs-adventure'].urls[0].slice(0, -2)
        archive.music.tracks['encore'].urls[0] = archive.music.tracks['encore'].urls[0].slice(0, -2)
        archive.music.tracks['expedition'].urls[0] = archive.music.tracks['expedition'].urls[0].slice(0, -2)
        archive.music.tracks['elephant-gun'].urls[0] = archive.music.tracks['elephant-gun'].urls[0].slice(0, -2)
        archive.music.tracks['miasmajesty'].urls[0] = archive.music.tracks['miasmajesty'].urls[0].slice(0, -2)
        archive.music.tracks['jane-dargason'].urls[0] = archive.music.tracks['jane-dargason'].urls[0].slice(0, -2)
        archive.music.tracks['before-the-beginning-and-after-the-end'].urls[0] = archive.music.tracks['before-the-beginning-and-after-the-end'].urls[0].slice(0, -2)
        archive.music.tracks['bridge-of-stars'].urls[0] = archive.music.tracks['bridge-of-stars'].urls[0].slice(0, -2)
        archive.music.tracks['cumulating-dreams'].urls[0] = archive.music.tracks['cumulating-dreams'].urls[0].slice(0, -2)
        archive.music.tracks['busting-makes-me-feel-good'].urls[0] = archive.music.tracks['busting-makes-me-feel-good'].urls[0].slice(0, -2)
        archive.music.tracks['everything-is-something-to-somebody'].urls[0] = archive.music.tracks['everything-is-something-to-somebody'].urls[0].slice(0, -2)
        archive.music.tracks['irrrrrrrreconcila8le'].urls[0] = archive.music.tracks['irrrrrrrreconcila8le'].urls[0].slice(0, -2)
        archive.music.tracks['im-a-member-of-the-midnight-crew-post-punk-version'].urls[0] = archive.music.tracks['im-a-member-of-the-midnight-crew-post-punk-version'].urls[0].slice(0, -2)
        archive.music.tracks['three-in-the-morning-aftermath'].urls[0] = archive.music.tracks['three-in-the-morning-aftermath'].urls[0].slice(0, -2)
        archive.music.tracks['lancer'].urls[0] = archive.music.tracks['lancer'].urls[0].slice(0, -2)
        archive.music.tracks['threes-a-crowd'].urls[0] = archive.music.tracks['threes-a-crowd'].urls[0].slice(0, -2)
        archive.music.tracks['break-shot'].urls[0] = archive.music.tracks['break-shot'].urls[0].slice(0, -2)
        archive.music.tracks['portrait'].urls[0] = archive.music.tracks['portrait'].urls[0].slice(0, -2)
        archive.music.tracks['negative-aperture'].urls[0] = archive.music.tracks['negative-aperture'].urls[0].slice(0, -2)
        archive.music.tracks['sweet-dreams-timaeus'].urls[0] = archive.music.tracks['sweet-dreams-timaeus'].urls[0].slice(0, -2)
        archive.music.tracks['red-miles'].urls[0] = archive.music.tracks['red-miles'].urls[0].slice(0, -2)
        archive.music.tracks['the-changing-game'].urls[0] = archive.music.tracks['the-changing-game'].urls[0].slice(0, -2)
        archive.music.tracks['requited'].urls[0] = archive.music.tracks['requited'].urls[0].slice(0, -2)
        archive.music.tracks['princess-of-helium'].urls[0] = archive.music.tracks['princess-of-helium'].urls[0].slice(0, -2)
        archive.music.tracks['moonsetter'].urls[0] = archive.music.tracks['moonsetter'].urls[0].slice(0, -2)
        archive.music.tracks['candles-and-clockwork-alpha-version'].urls[0] = archive.music.tracks['candles-and-clockwork-alpha-version'].urls[0].slice(0, -2)
        archive.music.tracks['coursing'].urls[0] = archive.music.tracks['coursing'].urls[0].slice(0, -2)
        archive.music.tracks['cairo-overcoat'].urls[0] = archive.music.tracks['cairo-overcoat'].urls[0].slice(0, -2)
        archive.music.tracks['battle-against-an-unfathomable-enemy'].urls[0] = archive.music.tracks['battle-against-an-unfathomable-enemy'].urls[0].slice(0, -2)
        archive.music.tracks['noirscape'].urls[0] = archive.music.tracks['noirscape'].urls[0].slice(0, -2)
        archive.music.tracks['dogfight'].urls[0] = archive.music.tracks['dogfight'].urls[0].slice(0, -2)
        archive.music.tracks['a-taste-for-adventure'].urls[0] = archive.music.tracks['a-taste-for-adventure'].urls[0].slice(0, -2)
        archive.music.tracks['stargaze'].urls[0] = archive.music.tracks['stargaze'].urls[0].slice(0, -2)
        archive.music.tracks['another-countdown'].urls.shift()
        // SITP
        archive.music.tracks['i-overture'].urls[0] = archive.music.tracks['i-overture'].urls[0].slice(0, -2)
        archive.music.tracks['ii-sarabande'].urls[0] = archive.music.tracks['ii-sarabande'].urls[0].slice(0, -2)
        archive.music.tracks['iii-serenade'].urls[0] = archive.music.tracks['iii-serenade'].urls[0].slice(0, -2)
        archive.music.tracks['iv-anthem'].urls[0] = archive.music.tracks['iv-anthem'].urls[0].slice(0, -2)
        // OYO
        archive.music.tracks['sunrise'].urls.unshift("https://homestuck.bandcamp.com/track/sunrise")
        archive.music.tracks['october'].urls.unshift("https://homestuck.bandcamp.com/track/october")
        archive.music.tracks['firefly-cloud'].urls.unshift("https://homestuck.bandcamp.com/track/firefly-cloud")
        archive.music.tracks['fantasyp'].urls.unshift("https://homestuck.bandcamp.com/track/fantasyp")
        archive.music.tracks['underfoot'].urls.unshift("https://homestuck.bandcamp.com/track/underfoot")
        archive.music.tracks['flying-car'].urls.unshift("https://homestuck.bandcamp.com/track/flying-car")
        archive.music.tracks['cancerous-core'].urls.unshift("https://homestuck.bandcamp.com/track/cancerous-core")
        archive.music.tracks['game-over'].urls.unshift("https://homestuck.bandcamp.com/track/game-over")
        archive.music.tracks['unlabeled'].urls.unshift("https://homestuck.bandcamp.com/track/unlabeled")
        archive.music.tracks['skaian-shrapnel'].urls.unshift("https://homestuck.bandcamp.com/track/skaian-shrapnel")
        archive.music.tracks['the-scratch'].urls.unshift("https://homestuck.bandcamp.com/track/the-scratch")
        archive.music.tracks['respit'].urls.unshift("https://homestuck.bandcamp.com/track/respit")
        archive.music.tracks['negastrife'].urls.unshift("https://homestuck.bandcamp.com/track/negastrife")
        archive.music.tracks['mother'].urls.unshift("https://homestuck.bandcamp.com/track/mother")
        archive.music.tracks['another-chance'].urls.unshift("https://homestuck.bandcamp.com/track/another-chance-bonus")
        archive.music.tracks['under-the-hat'].urls.unshift("https://homestuck.bandcamp.com/track/under-the-hat-bonus")
        archive.music.tracks['mother-piano'].urls.unshift("https://homestuck.bandcamp.com/track/mother-piano-bonus")
        archive.music.tracks['prelude'].urls.unshift("https://homestuck.bandcamp.com/track/prelude")
        // GENESIS FROG
        archive.music.tracks['pondsquatter'].urls.unshift("https://homestuck.bandcamp.com/track/pondsquatter")
        archive.music.tracks['our-glorious-speaker'].urls.unshift("https://homestuck.bandcamp.com/track/our-glorious-speaker")
        archive.music.tracks['prospitian-folklore'].urls.unshift("https://homestuck.bandcamp.com/track/prospitian-folklore")
        archive.music.tracks['consorts-intermezzo'].urls.unshift("https://homestuck.bandcamp.com/track/consorts-intermezzo")
        archive.music.tracks['buy-nak-sell-doof'].urls.unshift("https://homestuck.bandcamp.com/track/buy-nak-sell-doof")
        archive.music.tracks['pink-shells'].urls.unshift("https://homestuck.bandcamp.com/track/pink-shells")
        archive.music.tracks['entrance-of-the-salamanders'].urls.unshift("https://homestuck.bandcamp.com/track/entrance-of-the-salamanders")
        archive.music.tracks['thip-of-the-tongue'].urls.unshift("https://homestuck.bandcamp.com/track/thip-of-the-tongue")
        archive.music.tracks['frogs-intermezzo'].urls.unshift("https://homestuck.bandcamp.com/track/frogs-intermezzo")
        archive.music.tracks['breeding-duties'].urls.unshift("https://homestuck.bandcamp.com/track/breeding-duties")
        archive.music.tracks['stoke-the-forge'].urls.unshift("https://homestuck.bandcamp.com/track/stoke-the-forge")
        archive.music.tracks['great-lofaf-expedition-of-2009'].urls.unshift("https://homestuck.bandcamp.com/track/great-lofaf-expedition-of-2009")
        archive.music.tracks['the-temples-withered-bloom'].urls.unshift("https://homestuck.bandcamp.com/track/the-temples-withered-bloom")
        archive.music.tracks['bilious'].urls.unshift("https://homestuck.bandcamp.com/track/bilious")
        archive.music.tracks['speaker-skaias-reflection'].urls.unshift("https://homestuck.bandcamp.com/track/speaker-skaias-reflection")
        archive.music.tracks['the-vast-croak'].urls.unshift("https://homestuck.bandcamp.com/track/the-vast-croak")
        archive.music.tracks['pondsquatter-live-chamber-version'].urls.unshift("https://homestuck.bandcamp.com/track/bonus-pondsquatter-live-chamber-version")
        archive.music.tracks['frogsong'].urls.unshift("https://homestuck.bandcamp.com/track/bonus-frogsong")
        // CHERUBIM
        archive.music.tracks['reverie'].urls[0] = archive.music.tracks['reverie'].urls[0].slice(0, -2)
        archive.music.tracks['power-fantasy'].urls[0] = archive.music.tracks['power-fantasy'].urls[0].slice(0, -2)
        archive.music.tracks['stellarum-salve'].urls[0] = archive.music.tracks['stellarum-salve'].urls[0].slice(0, -2)
        archive.music.tracks['carne-vale'].urls[0] = archive.music.tracks['carne-vale'].urls[0].slice(0, -2)
        archive.music.tracks['green-lolly'].urls[0] = archive.music.tracks['green-lolly'].urls[0].slice(0, -2)
        archive.music.tracks['red-sucker'].urls[0] = archive.music.tracks['red-sucker'].urls[0].slice(0, -2)
        archive.music.tracks['constant-confinement'].urls[0] = archive.music.tracks['constant-confinement'].urls[0].slice(0, -2)
        archive.music.tracks['constant-conquest'].urls[0] = archive.music.tracks['constant-conquest'].urls[0].slice(0, -2)
        archive.music.tracks['the-lyrist'].urls[0] = archive.music.tracks['the-lyrist'].urls[0].slice(0, -2)
        archive.music.tracks['the-lordling'].urls[0] = archive.music.tracks['the-lordling'].urls[0].slice(0, -2)
        archive.music.tracks['eternity-served-cold'].urls[0] = archive.music.tracks['eternity-served-cold'].urls[0].slice(0, -2)
        // COLLIDE
        archive.music.tracks['creata-canon-edit'].urls[0] = archive.music.tracks['creata-canon-edit'].urls[0].slice(0, -2)
        archive.music.tracks['oppa-toby-style'].urls[0] = archive.music.tracks['oppa-toby-style'].urls[0].slice(0, -2)
        archive.music.tracks['eternity-served-cold-canon-edit'].urls[0] = archive.music.tracks['eternity-served-cold-canon-edit'].urls[0].slice(0, -2)
        archive.music.tracks['heir-of-grief'].urls[0] = archive.music.tracks['heir-of-grief'].urls[0].slice(0, -2)
        // ACT 7
        archive.music.tracks['overture-canon-edit'].urls[0] = archive.music.tracks['overture-canon-edit'].urls[0].slice(0, -2)
        // VOL 10
        archive.music.tracks['creata'].urls[0] = archive.music.tracks['creata'].urls[0].slice(0, -1) + "2"
        archive.music.tracks['train'].urls[0] = archive.music.tracks['train'].urls[0].slice(0, -2)
        archive.music.tracks['of-gods-and-witches'].urls[0] = archive.music.tracks['of-gods-and-witches'].urls[0].slice(0, -2)
        archive.music.tracks['beatup'].urls[0] = archive.music.tracks['beatup'].urls[0].slice(0, -2)
        archive.music.tracks['you-killed-my-father-prepare-to-die'].urls[0] = archive.music.tracks['you-killed-my-father-prepare-to-die'].urls[0].slice(0, -2)
        archive.music.tracks['sound-judgement'].urls[0] = archive.music.tracks['sound-judgement'].urls[0].slice(0, -2)
        archive.music.tracks['aggrievocation'].urls[0] = archive.music.tracks['aggrievocation'].urls[0].slice(0, -2)
        archive.music.tracks['stride'].urls[0] = archive.music.tracks['stride'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-overdrive'].urls[0] = archive.music.tracks['skaian-overdrive'].urls[0].slice(0, -2)
        archive.music.tracks['freefall'].urls[0] = archive.music.tracks['freefall'].urls[0].slice(0, -2)
        archive.music.tracks['moonsweater'].urls[0] = archive.music.tracks['moonsweater'].urls[0].slice(0, -2)
        archive.music.tracks['castle'].urls[0] = archive.music.tracks['castle'].urls[0].slice(0, -2)
        archive.music.tracks['skaian-happy-flight'].urls[0] = archive.music.tracks['skaian-happy-flight'].urls[0].slice(0, -2)
        archive.music.tracks['voidlight'].urls[0] = archive.music.tracks['voidlight'].urls[0].slice(0, -2)
        archive.music.tracks['beatdown-dx'].urls[0] = archive.music.tracks['beatdown-dx'].urls[0].slice(0, -2)
        archive.music.tracks['solar-voyage'].urls[0] = archive.music.tracks['solar-voyage'].urls[0].slice(0, -2)
        archive.music.tracks['feel-alive'].urls[0] = archive.music.tracks['feel-alive'].urls[0].slice(0, -2)
        archive.music.tracks['breeze'].urls[0] = archive.music.tracks['breeze'].urls[0].slice(0, -2)
        archive.music.tracks['starfall'].urls[0] = archive.music.tracks['starfall'].urls[0].slice(0, -2)
        archive.music.tracks['ascend'].urls[0] = archive.music.tracks['ascend'].urls[0].slice(0, -2)
        archive.music.tracks['lilith-in-starlight'].urls[0] = archive.music.tracks['lilith-in-starlight'].urls[0].slice(0, -2)
        archive.music.tracks['thanks-for-playing'].urls[0] = archive.music.tracks['thanks-for-playing'].urls[0].slice(0, -2)
        archive.music.tracks['renewed-return'].urls[0] = archive.music.tracks['renewed-return'].urls[0].slice(0, -2)
        archive.music.tracks['this-pumpkin'].urls[0] = archive.music.tracks['this-pumpkin'].urls[0].slice(0, -2)
        archive.music.tracks['conclude'].urls[0] = archive.music.tracks['conclude'].urls[0].slice(0, -2)
        // GRUBBLES
        archive.music.tracks['broom-temperature'].urls[0] += "-2"
        archive.music.tracks['frondly-warning'].urls[0] += "-2"
        archive.music.tracks['ghost-mound'].urls[0] += "-2"
        archive.music.tracks['every-single-grievance'].urls[0] += "-2"
        archive.music.tracks['get-the-horns'].urls[0] += "-2"
        // HIVESWAP ACT 1
        archive.music.tracks['definitely-safe-forever'].urls[0] = archive.music.tracks['definitely-safe-forever'].urls[0].slice(0, -2)
        archive.music.tracks['snake-escape'].urls[0] = archive.music.tracks['snake-escape'].urls[0].slice(0, -2)
        archive.music.tracks['joey-claire-extraordinaire'].urls[0] = archive.music.tracks['joey-claire-extraordinaire'].urls[0].slice(0, -2)
        archive.music.tracks['half-harley-manor'].urls[0] = archive.music.tracks['half-harley-manor'].urls[0].slice(0, -2)
        archive.music.tracks['relatively-visible-darkness'].urls[0] = archive.music.tracks['relatively-visible-darkness'].urls[0].slice(0, -2)
        archive.music.tracks['bedroom-for-an-annoying-dog'].urls[0] = archive.music.tracks['bedroom-for-an-annoying-dog'].urls[0].slice(0, -2)
        archive.music.tracks['thats-how-i-beat-snake'].urls[0] = archive.music.tracks['thats-how-i-beat-snake'].urls[0].slice(0, -2)
        archive.music.tracks['jude-harley-bizarrely'].urls[0] = archive.music.tracks['jude-harley-bizarrely'].urls[0].slice(0, -2)
        archive.music.tracks['table-for-tooth'].urls[0] = archive.music.tracks['table-for-tooth'].urls[0].slice(0, -2)
        archive.music.tracks['final-spice'].urls[0] = archive.music.tracks['final-spice'].urls[0].slice(0, -2)
        archive.music.tracks['living-legend'].urls[0] = archive.music.tracks['living-legend'].urls[0].slice(0, -2)
        archive.music.tracks['singular-peril'].urls[0] = archive.music.tracks['singular-peril'].urls[0].slice(0, -2)
        archive.music.tracks['a-more-defensible-position'].urls[0] = archive.music.tracks['a-more-defensible-position'].urls[0].slice(0, -2)
        archive.music.tracks['open-the-door'].urls[0] = archive.music.tracks['open-the-door'].urls[0].slice(0, -2)
        archive.music.tracks['keep-your-head-down'].urls[0] = archive.music.tracks['keep-your-head-down'].urls[0].slice(0, -2)
        archive.music.tracks['oh-whoa-whats-this'].urls[0] = archive.music.tracks['oh-whoa-whats-this'].urls[0].slice(0, -2)
        archive.music.tracks['some-kind-of-alien'].urls[0] = archive.music.tracks['some-kind-of-alien'].urls[0].slice(0, -2)
        archive.music.tracks['rustblood'].urls[0] = archive.music.tracks['rustblood'].urls[0].slice(0, -2)
        archive.music.tracks['filthy-nuclear-bunker'].urls[0] = archive.music.tracks['filthy-nuclear-bunker'].urls[0].slice(0, -2)
        archive.music.tracks['sports-personally-i-love-them'].urls[0] = archive.music.tracks['sports-personally-i-love-them'].urls[0].slice(0, -2)
        archive.music.tracks['lofted-gunpile'].urls[0] = archive.music.tracks['lofted-gunpile'].urls[0].slice(0, -2)
        archive.music.tracks['serpent-genesis'].urls[0] = archive.music.tracks['serpent-genesis'].urls[0].slice(0, -2)
        archive.music.tracks['we-shall-go-together'].urls[0] = archive.music.tracks['we-shall-go-together'].urls[0].slice(0, -2)
        archive.music.tracks['wish-you-were-here'].urls[0] = archive.music.tracks['wish-you-were-here'].urls[0].slice(0, -2)
        archive.music.tracks['intermission-1'].urls[0] = archive.music.tracks['intermission-1'].urls[0].slice(0, -2)
        archive.music.tracks['old-steps'].urls[0] = archive.music.tracks['old-steps'].urls[0].slice(0, -2)
        archive.music.tracks['how-it-could-have-gone'].urls[0] = archive.music.tracks['how-it-could-have-gone'].urls[0].slice(0, -2)
        archive.music.tracks['alternate-recipe'].urls[0] = archive.music.tracks['alternate-recipe'].urls[0].slice(0, -2)
        archive.music.tracks['heavy-snaking'].urls[0] = archive.music.tracks['heavy-snaking'].urls[0].slice(0, -2)
        archive.music.tracks['spooktune'].urls[0] = archive.music.tracks['spooktune'].urls[0].slice(0, -2)
        // TRACK_IDS
        archive.music.tracks['showtime-piano-refrain'].bandcampId = 1992468076
        archive.music.tracks['harlequin'].bandcampId = 1155430801
        archive.music.tracks['showtime-original-mix'].bandcampId = 4033690070
        archive.music.tracks['aggrieve-violin-refrain'].bandcampId = 2178615859
        archive.music.tracks['sburban-countdown'].bandcampId = 873461742
        archive.music.tracks['aggrieve'].bandcampId = 2742781028
        archive.music.tracks['showtime-imp-strife-mix'].bandcampId = 2950668984
        archive.music.tracks['nannaquin'].bandcampId = 3397218428
        archive.music.tracks['skies-of-skaia'].bandcampId = 3032092804
        archive.music.tracks['harlequin-rock-version'].bandcampId = 3980155949
        archive.music.tracks['john-sleeps-skaian-magicant'].bandcampId = 1015018621
        archive.music.tracks['upward-movement-dave-owns'].bandcampId = 95879993
        archive.music.tracks['vagabounce'].bandcampId = 2673228039
        archive.music.tracks['explore'].bandcampId = 2552384646
        archive.music.tracks['gardener'].bandcampId = 3434736832
        archive.music.tracks['showtime-remix'].bandcampId = 1261010693
        archive.music.tracks['aggrieve-remix'].bandcampId = 3644527536
        archive.music.tracks['verdancy-bassline'].bandcampId = 1122423336
        archive.music.tracks['potential-verdancy'].bandcampId = 3606181501
        archive.music.tracks['beatdown-strider-style'].bandcampId = 1589295998
        archive.music.tracks['harleboss'].bandcampId = 66348808
        archive.music.tracks['beatdown-round-2'].bandcampId = 721165816
        archive.music.tracks['dissension-original'].bandcampId = 1987532998
        archive.music.tracks['dissension-remix'].bandcampId = 2020258237
        archive.music.tracks['ohgodwhat'].bandcampId = 729980337
        archive.music.tracks['ohgodwhat-remix'].bandcampId = 818844301
        archive.music.tracks['rediscover-fusion'].bandcampId = 313803899
        archive.music.tracks['explore-remix'].bandcampId = 2044502460
        archive.music.tracks['chorale-for-jaspers'].bandcampId = 1290455959
        archive.music.tracks['pony-chorale'].bandcampId = 768577160
        archive.music.tracks['revelawesome'].bandcampId = 898994208
        archive.music.tracks['hardlyquin'].bandcampId = 641402011
        archive.music.tracks['carefree-victory'].bandcampId = 1810337648
        archive.music.tracks['ballad-of-awakening'].bandcampId = 830490874
        archive.music.tracks['sburban-jungle'].bandcampId = 545328405
        archive.music.tracks['three-in-the-morning-rj'].bandcampId = 3942914468
        archive.music.tracks['doctor'].bandcampId = 1648102703
        archive.music.tracks['endless-climb'].bandcampId = 1453048016
        archive.music.tracks['atomyk-ebonpyre'].bandcampId = 2460543449
        archive.music.tracks['black'].bandcampId = 503779807
        archive.music.tracks['three-in-the-morning'].bandcampId = 2528937116
        archive.music.tracks['blue-noir'].bandcampId = 412566938
        archive.music.tracks['dead-shuffle'].bandcampId = 590812181
        archive.music.tracks['hearts-flush'].bandcampId = 1027567683
        archive.music.tracks['knives-and-ivory'].bandcampId = 3884919054
        archive.music.tracks['liquid-negrocity'].bandcampId = 2753551435
        archive.music.tracks['hollow-suit'].bandcampId = 2591665337
        archive.music.tracks['ante-matter'].bandcampId = 213131884
        archive.music.tracks['the-ballad-of-jack-noir'].bandcampId = 3988759760
        archive.music.tracks['lunar-eclipse'].bandcampId = 3399965431
        archive.music.tracks['hauntjam'].bandcampId = 917856575
        archive.music.tracks['carbon-nadsat-cuestick-genius'].bandcampId = 2518731184
        archive.music.tracks['ace-of-trump'].bandcampId = 2710092971
        archive.music.tracks['moonshine'].bandcampId = 3937772473
        archive.music.tracks['tall-dark-and-loathsome'].bandcampId = 1142789144
        archive.music.tracks['jokers-wild'].bandcampId = 3004027347
        archive.music.tracks['livin-it-up'].bandcampId = 4263217902
        archive.music.tracks['hauntjelly'].bandcampId = 4137244506
        archive.music.tracks['homestuck-anthem'].bandcampId = 1732047192
        archive.music.tracks['skaian-skirmish'].bandcampId = 3980933081
        archive.music.tracks['savior-of-the-waking-world'].bandcampId = 2712686844
        archive.music.tracks['clockwork-melody'].bandcampId = 1532450409
        archive.music.tracks['heirfare'].bandcampId = 2908733259
        archive.music.tracks['jades-lullaby'].bandcampId = 70947333
        archive.music.tracks['aggrievance'].bandcampId = 3626562578
        archive.music.tracks['happy-cat-song'].bandcampId = 3005678831
        archive.music.tracks['hardchorale'].bandcampId = 3839727858
        archive.music.tracks['an-unbreakable-union'].bandcampId = 3453724805
        archive.music.tracks['skaian-ride'].bandcampId = 661468384
        archive.music.tracks['white'].bandcampId = 262926642
        archive.music.tracks['octoroon-rangoon'].bandcampId = 3758198705
        archive.music.tracks['pumpkin-cravings'].bandcampId = 193072764
        archive.music.tracks['welcome-to-the-new-extreme'].bandcampId = 3577088348
        archive.music.tracks['crystalanthemums'].bandcampId = 4189791423
        archive.music.tracks['skaia-incipisphere-mix'].bandcampId = 2168415684
        archive.music.tracks['sarabande-vol5'].bandcampId = 749606535
        archive.music.tracks['clockwork-sorrow'].bandcampId = 1627927924
        archive.music.tracks['phantasmagoric-waltz'].bandcampId = 3925437960
        archive.music.tracks['sunslammer'].bandcampId = 4168968475
        archive.music.tracks['lotus-land-story'].bandcampId = 1768500412
        archive.music.tracks['chorale-for-war'].bandcampId = 1525404078
        archive.music.tracks['unsheathd'].bandcampId = 2981258394
        archive.music.tracks['versus'].bandcampId = 1063964807
        archive.music.tracks['planet-healer'].bandcampId = 329484551
        archive.music.tracks['bed-of-roses-dreams-of-derse'].bandcampId = 220614746
        archive.music.tracks['skaian-flight'].bandcampId = 4015927874
        archive.music.tracks['how-do-i-live-bunny-back-in-the-box-version'].bandcampId = 2319160481
        archive.music.tracks['dupliblaze-comagma'].bandcampId = 3546706161
        archive.music.tracks['moonshatter'].bandcampId = 2633947525
        archive.music.tracks['sunsetter'].bandcampId = 3743166213
        archive.music.tracks['lotus'].bandcampId = 3716827478
        archive.music.tracks['ruins-with-strings'].bandcampId = 3946721808
        archive.music.tracks['ectobiology'].bandcampId = 1511316220
        archive.music.tracks['upholding-the-law'].bandcampId = 2732548672
        archive.music.tracks['underworld'].bandcampId = 1867755286
        archive.music.tracks['crystamanthequins'].bandcampId = 2869192223
        archive.music.tracks['endless-climbing'].bandcampId = 2312212204
        archive.music.tracks['land-of-the-salamanders'].bandcampId = 1481304876
        archive.music.tracks['medical-emergency'].bandcampId = 3848116035
        archive.music.tracks['clockwork-contrivance'].bandcampId = 1866920795
        archive.music.tracks['get-up'].bandcampId = 3757458679
        archive.music.tracks['vertical-motion'].bandcampId = 649242654
        archive.music.tracks['the-beginning-of-something-really-excellent'].bandcampId = 591968179
        archive.music.tracks['pyrocumulus-kickstart'].bandcampId = 2119531470
        archive.music.tracks['skaian-skuffle'].bandcampId = 53545400
        archive.music.tracks['throwdown'].bandcampId = 2678653679
        archive.music.tracks['valhalla'].bandcampId = 274578786
        archive.music.tracks['amphibious-subterrain'].bandcampId = 1835362041
        archive.music.tracks['light-vol5'].bandcampId = 3501123712
        archive.music.tracks['softly'].bandcampId = 3611028676
        archive.music.tracks['greenhouse'].bandcampId = 884354998
        archive.music.tracks['space-prankster'].bandcampId = 2051383598
        archive.music.tracks['ecstacy'].bandcampId = 4255774077
        archive.music.tracks['snow-pollen'].bandcampId = 3739413721
        archive.music.tracks['candles-and-clockwork'].bandcampId = 1910507786
        archive.music.tracks['can-town'].bandcampId = 4162839491
        archive.music.tracks['plague-doctor'].bandcampId = 579557048
        archive.music.tracks['enlightenment'].bandcampId = 4189948573
        archive.music.tracks['doctor-remix'].bandcampId = 1161919449
        archive.music.tracks['biophosphoradelecrystalluminescence'].bandcampId = 2570326249
        archive.music.tracks['song-of-life'].bandcampId = 894058125
        archive.music.tracks['descend'].bandcampId = 3205013100
        archive.music.tracks['homestuck'].bandcampId = 2788259337
        archive.music.tracks['crustacean'].bandcampId = 1640340697
        archive.music.tracks['showdown'].bandcampId = 3183630735
        archive.music.tracks['miracles'].bandcampId = 4144913298
        archive.music.tracks['the-lemonsnout-turnabout'].bandcampId = 1070838220
        archive.music.tracks['phaze-and-blood'].bandcampId = 1627019648
        archive.music.tracks['psych0ruins'].bandcampId = 1505467358
        archive.music.tracks['walls-covered-in-blood'].bandcampId = 4205190075
        archive.music.tracks['desperado-rocket-chairs'].bandcampId = 3733048115
        archive.music.tracks['death-of-the-lusii'].bandcampId = 1644632721
        archive.music.tracks['virgin-orb'].bandcampId = 126471516
        archive.music.tracks['the-la2t-frontiier'].bandcampId = 3889962221
        archive.music.tracks['skaian-summoning'].bandcampId = 1724829786
        archive.music.tracks['spiders-claw'].bandcampId = 423084504
        archive.music.tracks['staring'].bandcampId = 272189309
        archive.music.tracks['keepers'].bandcampId = 824475154
        archive.music.tracks['squiddles'].bandcampId = 2422881664
        archive.music.tracks['rainbow-valley'].bandcampId = 1963790683
        archive.music.tracks['squiddle-parade'].bandcampId = 2450407719
        archive.music.tracks['squiddle-march'].bandcampId = 1305479929
        archive.music.tracks['tangled-waltz'].bandcampId = 715712775
        archive.music.tracks['sun-speckled-squiddly-afternoon'].bandcampId = 3968597670
        archive.music.tracks['squiddles-campfire'].bandcampId = 1503664528
        archive.music.tracks['friendship-is-paramount'].bandcampId = 2207378280
        archive.music.tracks['lazybones'].bandcampId = 3095944827
        archive.music.tracks['tentacles'].bandcampId = 3228423398
        archive.music.tracks['squiddles-happytime-fun-go'].bandcampId = 105240911
        archive.music.tracks['the-sound-of-pure-squid-giggles'].bandcampId = 1706662557
        archive.music.tracks['squiddle-samba'].bandcampId = 2635686401
        archive.music.tracks['squiddles-in-paradise'].bandcampId = 2541902369
        archive.music.tracks['squiddidle'].bandcampId = 1253544291
        archive.music.tracks['catchyegrabber-skipper-plumbthroats-song'].bandcampId = 4278823669
        archive.music.tracks['plumbthroat-gives-chase'].bandcampId = 2407545311
        archive.music.tracks['squiddles-the-movie-trailer-the-day-the-unicorns-couldnt-play'].bandcampId = 3771124648
        archive.music.tracks['carefree-princess-berryboo'].bandcampId = 2560645954
        archive.music.tracks['mister-bowman-tells-you-about-the-squiddles'].bandcampId = 3970260066
        archive.music.tracks['ocean-stars'].bandcampId = 2492297323
        archive.music.tracks['let-the-squiddles-sleep-end-theme'].bandcampId = 810783688
        archive.music.tracks['jade-dragon'].bandcampId = 1341570644
        archive.music.tracks['swing-of-the-clock'].bandcampId = 4046552225
        archive.music.tracks['rhapsody-in-green'].bandcampId = 3230059426
        archive.music.tracks['humphreys-lullaby'].bandcampId = 440367158
        archive.music.tracks['clockwork-reversal'].bandcampId = 1329409387
        archive.music.tracks['chartreuse-rewind'].bandcampId = 966724935
        archive.music.tracks['the-broken-clock'].bandcampId = 327112161
        archive.music.tracks['apocryphal-antithesis'].bandcampId = 3818867888
        archive.music.tracks['trails'].bandcampId = 2938936004
        archive.music.tracks['baroqueback-bowtier-scratchs-lament'].bandcampId = 2256189398
        archive.music.tracks['scratch'].bandcampId = 3686434807
        archive.music.tracks['omelette-sandwich'].bandcampId = 1511262218
        archive.music.tracks['temporal-piano'].bandcampId = 2545115104
        archive.music.tracks['time-paradox'].bandcampId = 1587594177
        archive.music.tracks['eldritch'].bandcampId = 2466581452
        archive.music.tracks['english'].bandcampId = 1717701868
        archive.music.tracks['variations'].bandcampId = 2475454415
        archive.music.tracks['frost-vol6'].bandcampId = 3488342337
        archive.music.tracks['courser'].bandcampId = 1749362717
        archive.music.tracks['umbral-ultimatum'].bandcampId = 3196262315
        archive.music.tracks['gamebro-original-1990-mix'].bandcampId = 2573723636
        archive.music.tracks['tribal-ebonpyre'].bandcampId = 3449433000
        archive.music.tracks['i-dont-want-to-miss-a-thing'].bandcampId = 15200920
        archive.music.tracks['megalovania'].bandcampId = 258015397
        archive.music.tracks['walk-stab-walk-rande'].bandcampId = 2754808346
        archive.music.tracks['gaia-queen'].bandcampId = 3461193948
        archive.music.tracks['elevatorstuck'].bandcampId = 2577799677
        archive.music.tracks['wacky-antics'].bandcampId = 1434074823
        archive.music.tracks['horschestra'].bandcampId = 1313993995
        archive.music.tracks['heir-transparent'].bandcampId = 3204704260
        archive.music.tracks['boy-skylark-brief'].bandcampId = 3395581170
        archive.music.tracks['squidissension'].bandcampId = 3681463573
        archive.music.tracks['blackest-heart'].bandcampId = 3060194630
        archive.music.tracks['nic-cage-song'].bandcampId = 1638752077
        archive.music.tracks['phrenic-phever'].bandcampId = 4032593264
        archive.music.tracks['3-in-the-morning-pianokind'].bandcampId = 1881003135
        archive.music.tracks['a-tender-moment'].bandcampId = 851452310
        archive.music.tracks['crystalanthology'].bandcampId = 803507852
        archive.music.tracks['stormspirit'].bandcampId = 3733499139
        archive.music.tracks['heir-conditioning'].bandcampId = 239780909
        archive.music.tracks['dance-of-thorns'].bandcampId = 3454904611
        archive.music.tracks['time-on-my-side'].bandcampId = 23786076
        archive.music.tracks['atomic-bonsai'].bandcampId = 3351208668
        archive.music.tracks['knifes-edge'].bandcampId = 800021296
        archive.music.tracks['arisen-anew'].bandcampId = 1558208709
        archive.music.tracks['karkats-theme'].bandcampId = 3387515207
        archive.music.tracks['trollcops'].bandcampId = 125623129
        archive.music.tracks['bl1nd-just1c3-1nv3st1g4t1on'].bandcampId = 668146427
        archive.music.tracks['terezis-theme'].bandcampId = 3270542892
        archive.music.tracks['dreamers-and-the-dead'].bandcampId = 2303818725
        archive.music.tracks['vriskas-theme'].bandcampId = 485014956
        archive.music.tracks['shes-a-sp8der'].bandcampId = 1829890838
        archive.music.tracks['fiduspawn-go'].bandcampId = 4135456035
        archive.music.tracks['darling-kanaya'].bandcampId = 1887795020
        archive.music.tracks['requiem-of-sunshine-and-rainbows'].bandcampId = 688917621
        archive.music.tracks['eridans-theme'].bandcampId = 3225699714
        archive.music.tracks['nautical-nightmare'].bandcampId = 2834177094
        archive.music.tracks['nepetas-theme'].bandcampId = 2062240384
        archive.music.tracks['horschestra-strong-version'].bandcampId = 2157143683
        archive.music.tracks['blackest-heart-with-honks'].bandcampId = 4026724989
        archive.music.tracks['midnight-calliope'].bandcampId = 1860606538
        archive.music.tracks['chaotic-strength'].bandcampId = 2410956110
        archive.music.tracks['trollian-standoff'].bandcampId = 1199445432
        archive.music.tracks['rex-duodecim-angelus'].bandcampId = 2872863982
        archive.music.tracks['killed-by-br8k-spider'].bandcampId = 74534505
        archive.music.tracks['alternia'].bandcampId = 627462460
        archive.music.tracks['light-medium'].bandcampId = 1019444967
        archive.music.tracks['shade'].bandcampId = 2278172413
        archive.music.tracks['rain'].bandcampId = 452062840
        archive.music.tracks['frogs'].bandcampId = 18113663
        archive.music.tracks['frost-medium'].bandcampId = 3761371278
        archive.music.tracks['clockwork'].bandcampId = 3168809571
        archive.music.tracks['heat'].bandcampId = 2335984564
        archive.music.tracks['wind'].bandcampId = 2444293014
        archive.music.tracks['forever'].bandcampId = 1044477191
        archive.music.tracks['dawn-of-man'].bandcampId = 614749900
        archive.music.tracks['beta-version'].bandcampId = 2369869220
        archive.music.tracks['no-release'].bandcampId = 1106133200
        archive.music.tracks['fly'].bandcampId = 3739601781
        archive.music.tracks['lies-with-the-sea'].bandcampId = 975686534
        archive.music.tracks['chain-of-prospit'].bandcampId = 2574365778
        archive.music.tracks['pumpkin-tide'].bandcampId = 3219757398
        archive.music.tracks['the-deeper-you-go'].bandcampId = 2923045138
        archive.music.tracks['black-rose-green-sun'].bandcampId = 1938950277
        archive.music.tracks['at-the-price-of-oblivion'].bandcampId = 2970976023
        archive.music.tracks['even-in-death'].bandcampId = 1916314849
        archive.music.tracks['terezi-owns'].bandcampId = 1523281364
        archive.music.tracks['trial-and-execution'].bandcampId = 835281974
        archive.music.tracks['the-carnival'].bandcampId = 2378649078
        archive.music.tracks['spider8reath'].bandcampId = 618454730
        archive.music.tracks['lifdoff'].bandcampId = 1384214402
        archive.music.tracks['awakening'].bandcampId = 2881105495
        archive.music.tracks['havoc-to-be-wrought'].bandcampId = 3051059489
        archive.music.tracks['play-the-wind'].bandcampId = 618462930
        archive.music.tracks['rumble-at-the-rink'].bandcampId = 2954889594
        archive.music.tracks['lets-all-rock-the-heist'].bandcampId = 1859369848
        archive.music.tracks['wsw-beatdown'].bandcampId = 2502135838
        archive.music.tracks['earthsea-borealis'].bandcampId = 496815460
        archive.music.tracks['warhammer-of-zillyhoo'].bandcampId = 1001419226
        archive.music.tracks['savior-of-the-dreaming-dead'].bandcampId = 3809749263
        archive.music.tracks['the-prelude'].bandcampId = 2606495256
        archive.music.tracks['genesis'].bandcampId = 454655507
        archive.music.tracks['eden'].bandcampId = 413698991
        archive.music.tracks['exodus'].bandcampId = 4179660030
        archive.music.tracks['requiem'].bandcampId = 1973026968
        archive.music.tracks['the-meek'].bandcampId = 256569348
        archive.music.tracks['chronicles'].bandcampId = 188831634
        archive.music.tracks['rapture'].bandcampId = 13175269
        archive.music.tracks['creation'].bandcampId = 4040681712
        archive.music.tracks['revelations-i'].bandcampId = 2569845990
        archive.music.tracks['revelations-ii'].bandcampId = 2611885118
        archive.music.tracks['revelations-iii'].bandcampId = 425218987
        archive.music.tracks['carapacian-dominion'].bandcampId = 238196787
        archive.music.tracks['aimless-morning-gold'].bandcampId = 4151642362
        archive.music.tracks['endless-expanse'].bandcampId = 2539003815
        archive.music.tracks['gilded-sands'].bandcampId = 3027509957
        archive.music.tracks['years-in-the-future'].bandcampId = 3349919400
        archive.music.tracks['mayor-maynot'].bandcampId = 1724099929
        archive.music.tracks['we-walk'].bandcampId = 3997337344
        archive.music.tracks['requiem-for-an-exile'].bandcampId = 3072663468
        archive.music.tracks['raggy-looking-dance'].bandcampId = 1685490462
        archive.music.tracks['riches-to-ruins-movements-i-and-ii'].bandcampId = 2866038749
        archive.music.tracks['litrichean-rioghail'].bandcampId = 4157761118
        archive.music.tracks['ruins-rising'].bandcampId = 3685684114
        archive.music.tracks['what-a-daring-dream'].bandcampId = 1180449679
        archive.music.tracks['nightmare'].bandcampId = 4146437725
        archive.music.tracks['hallowed-halls'].bandcampId = 1365371602
        archive.music.tracks['the-golden-towers'].bandcampId = 1761353973
        archive.music.tracks['prospit-dreamers'].bandcampId = 3926161589
        archive.music.tracks['center-of-brilliance'].bandcampId = 2290347275
        archive.music.tracks['darkened-streets'].bandcampId = 2816187444
        archive.music.tracks['the-obsidian-towers'].bandcampId = 3046654360
        archive.music.tracks['derse-dreamers'].bandcampId = 1403631955
        archive.music.tracks['core-of-darkness'].bandcampId = 3261151226
        archive.music.tracks['calamity'].bandcampId = 1102161122
        archive.music.tracks['do-you-remem8er-me'].bandcampId = 2364575643
        archive.music.tracks['flare'].bandcampId = 1155328290
        archive.music.tracks['galactic-cancer'].bandcampId = 1946787865
        archive.music.tracks['serenade-vol8'].bandcampId = 1050012406
        archive.music.tracks['frog-forager'].bandcampId = 979119982
        archive.music.tracks['love-you-feferis-theme'].bandcampId = 2344330992
        archive.music.tracks['ocean-stars-falling'].bandcampId = 3637127762
        archive.music.tracks['escape-pod'].bandcampId = 1073429308
        archive.music.tracks['davesprite'].bandcampId = 2523858625
        archive.music.tracks['airtime'].bandcampId = 1150029415
        archive.music.tracks['frog-hunt'].bandcampId = 3070721112
        archive.music.tracks['terraform'].bandcampId = 2700768150
        archive.music.tracks['unite-synchronization'].bandcampId = 2116634311
        archive.music.tracks['homefree'].bandcampId = 2324223008
        archive.music.tracks['galaxy-hearts'].bandcampId = 1176784512
        archive.music.tracks['scourge-sisters'].bandcampId = 3193914551
        archive.music.tracks['arcade-thunder'].bandcampId = 2186685306
        archive.music.tracks['pyrocumulus-sicknasty'].bandcampId = 1110336938
        archive.music.tracks['kingside-castle'].bandcampId = 3811928705
        archive.music.tracks['temporary'].bandcampId = 2301303834
        archive.music.tracks['gust-of-heir'].bandcampId = 2453185368
        archive.music.tracks['afraid-of-the-darko'].bandcampId = 3999134439
        archive.music.tracks['even-in-death-tmorras-belly-mix'].bandcampId = 3238226693
        archive.music.tracks['bargaining-with-the-beast'].bandcampId = 3438104075
        archive.music.tracks['frostbite'].bandcampId = 1034879798
        archive.music.tracks['the-lost-child'].bandcampId = 2520439323
        archive.music.tracks['questants-lament'].bandcampId = 3651792315
        archive.music.tracks['hussie-hunt'].bandcampId = 1928891208
        archive.music.tracks['havoc'].bandcampId = 677135439
        archive.music.tracks['drift-into-the-sun'].bandcampId = 2251560766
        archive.music.tracks['infinity-mechanism'].bandcampId = 231181101
        archive.music.tracks['revered-return'].bandcampId = 2463719120
        archive.music.tracks['judgment-day'].bandcampId = 873408634
        archive.music.tracks['lotus-bloom'].bandcampId = 4097808726
        archive.music.tracks['cascade'].bandcampId = 4047349812
        archive.music.tracks['im-a-member-of-the-midnight-crew-acapella'].bandcampId = 3332375214
        archive.music.tracks['null-mark-hadley'].bandcampId = 2284401755
        archive.music.tracks['skaian-birth'].bandcampId = 3719618734
        archive.music.tracks['song-of-skaia'].bandcampId = 2997592380
        archive.music.tracks['crystalmethequins'].bandcampId = 651661234
        archive.music.tracks['anbroids-v2'].bandcampId = 519743757
        archive.music.tracks['trepidation'].bandcampId = 2120114645
        archive.music.tracks['firefly'].bandcampId = 1932685783
        archive.music.tracks['whistling-jackhammer'].bandcampId = 347799923
        archive.music.tracks['ugly-betty'].bandcampId = 1491968801
        archive.music.tracks['hate-you'].bandcampId = 3844337153
        archive.music.tracks['pumpkin-party-in-sea-hitlers-water-apocalypse'].bandcampId = 1276136077
        archive.music.tracks['skaianet'].bandcampId = 4172875369
        archive.music.tracks['another-jungle'].bandcampId = 1246094969
        archive.music.tracks['gamegrl-original-1993-mix'].bandcampId = 539260074
        archive.music.tracks['assault'].bandcampId = 1705480934
        archive.music.tracks['a-little-fight-mewsic'].bandcampId = 2417285973
        archive.music.tracks['austin-atlantis'].bandcampId = 3265563755
        archive.music.tracks['despot'].bandcampId = 2424170642
        archive.music.tracks['stress'].bandcampId = 1237216364
        archive.music.tracks['minihoofs-adventure'].bandcampId = 2770991492
        archive.music.tracks['encore'].bandcampId = 2768483561
        archive.music.tracks['expedition'].bandcampId = 91589919
        archive.music.tracks['elephant-gun'].bandcampId = 4139026211
        archive.music.tracks['miasmajesty'].bandcampId = 633677134
        archive.music.tracks['jane-dargason'].bandcampId = 2026872460
        archive.music.tracks['before-the-beginning-and-after-the-end'].bandcampId = 2614716863
        archive.music.tracks['bridge-of-stars'].bandcampId = 2476388807
        archive.music.tracks['cumulating-dreams'].bandcampId = 1012959620
        archive.music.tracks['busting-makes-me-feel-good'].bandcampId = 3290152926
        archive.music.tracks['everything-is-something-to-somebody'].bandcampId = 3698966015
        archive.music.tracks['irrrrrrrreconcila8le'].bandcampId = 641117770
        archive.music.tracks['im-a-member-of-the-midnight-crew-post-punk-version'].bandcampId = 2160915007
        archive.music.tracks['three-in-the-morning-aftermath'].bandcampId = 4289272912
        archive.music.tracks['lancer'].bandcampId = 1483594516
        archive.music.tracks['threes-a-crowd'].bandcampId = 3595571735
        archive.music.tracks['break-shot'].bandcampId = 144483630
        archive.music.tracks['portrait'].bandcampId = 1356190884
        archive.music.tracks['negative-aperture'].bandcampId = 166587356
        archive.music.tracks['sweet-dreams-timaeus'].bandcampId = 3083468736
        archive.music.tracks['red-miles'].bandcampId = 198056262
        archive.music.tracks['the-changing-game'].bandcampId = 876758283
        archive.music.tracks['requited'].bandcampId = 2430713097
        archive.music.tracks['princess-of-helium'].bandcampId = 2628593324
        archive.music.tracks['moonsetter'].bandcampId = 4036702431
        archive.music.tracks['candles-and-clockwork-alpha-version'].bandcampId = 3455876340
        archive.music.tracks['coursing'].bandcampId = 3550454197
        archive.music.tracks['cairo-overcoat'].bandcampId = 2810721109
        archive.music.tracks['battle-against-an-unfathomable-enemy'].bandcampId = 1889338457
        archive.music.tracks['noirscape'].bandcampId = 2911251102
        archive.music.tracks['dogfight'].bandcampId = 2309609445
        archive.music.tracks['a-taste-for-adventure'].bandcampId = 2824560834
        archive.music.tracks['stargaze'].bandcampId = 352244514
        archive.music.tracks['i-overture'].bandcampId = 570732280
        archive.music.tracks['ii-sarabande'].bandcampId = 2342265878
        archive.music.tracks['iii-serenade'].bandcampId = 1941907445
        archive.music.tracks['iv-anthem'].bandcampId = 303457628
        archive.music.tracks['sunrise'].bandcampId = 1097206058
        archive.music.tracks['october'].bandcampId = 47744083
        archive.music.tracks['firefly-cloud'].bandcampId = 2603743656
        archive.music.tracks['fantasyp'].bandcampId = 4037477227
        archive.music.tracks['underfoot'].bandcampId = 2535713714
        archive.music.tracks['flying-car'].bandcampId = 3926569135
        archive.music.tracks['cancerous-core'].bandcampId = 3429615344
        archive.music.tracks['game-over'].bandcampId = 1702484168
        archive.music.tracks['unlabeled'].bandcampId = 2848655453
        archive.music.tracks['skaian-shrapnel'].bandcampId = 3729401866
        archive.music.tracks['the-scratch'].bandcampId = 2234036064
        archive.music.tracks['respit'].bandcampId = 1263380777
        archive.music.tracks['negastrife'].bandcampId = 63878088
        archive.music.tracks['mother'].bandcampId = 2615409007
        archive.music.tracks['another-chance'].bandcampId = 2695580421
        archive.music.tracks['under-the-hat'].bandcampId = 1368842801
        archive.music.tracks['mother-piano'].bandcampId = 3384564491
        archive.music.tracks['prelude'].bandcampId = 2470687843
        archive.music.tracks['pondsquatter'].bandcampId = 4095359795
        archive.music.tracks['our-glorious-speaker'].bandcampId = 3591665453
        archive.music.tracks['prospitian-folklore'].bandcampId = 1256413077
        archive.music.tracks['consorts-intermezzo'].bandcampId = 1966748482
        archive.music.tracks['buy-nak-sell-doof'].bandcampId = 1458370203
        archive.music.tracks['pink-shells'].bandcampId = 1471376822
        archive.music.tracks['entrance-of-the-salamanders'].bandcampId = 1147729974
        archive.music.tracks['thip-of-the-tongue'].bandcampId = 1996238988
        archive.music.tracks['frogs-intermezzo'].bandcampId = 2025527205
        archive.music.tracks['breeding-duties'].bandcampId = 2556258956
        archive.music.tracks['stoke-the-forge'].bandcampId = 3810534392
        archive.music.tracks['great-lofaf-expedition-of-2009'].bandcampId = 867165402
        archive.music.tracks['the-temples-withered-bloom'].bandcampId = 290101051
        archive.music.tracks['bilious'].bandcampId = 521268119
        archive.music.tracks['speaker-skaias-reflection'].bandcampId = 2338577487
        archive.music.tracks['the-vast-croak'].bandcampId = 323716029
        archive.music.tracks['pondsquatter-live-chamber-version'].bandcampId = 3858493943
        archive.music.tracks['frogsong'].bandcampId = 1471104628
        archive.music.tracks['reverie'].bandcampId = 814388450
        archive.music.tracks['power-fantasy'].bandcampId = 3180903922
        archive.music.tracks['stellarum-salve'].bandcampId = 4234344105
        archive.music.tracks['carne-vale'].bandcampId = 2589811369
        archive.music.tracks['green-lolly'].bandcampId = 3548361448
        archive.music.tracks['red-sucker'].bandcampId = 1910969478
        archive.music.tracks['constant-confinement'].bandcampId = 3257114265
        archive.music.tracks['constant-conquest'].bandcampId = 1633894041
        archive.music.tracks['the-lyrist'].bandcampId = 4219225357
        archive.music.tracks['the-lordling'].bandcampId = 3728124802
        archive.music.tracks['eternity-served-cold'].bandcampId = 2962615665
        archive.music.tracks['creata-canon-edit'].bandcampId = 3855560039
        archive.music.tracks['oppa-toby-style'].bandcampId = 2829634486
        archive.music.tracks['eternity-served-cold-canon-edit'].bandcampId = 577267383
        archive.music.tracks['heir-of-grief'].bandcampId = 3689701348
        archive.music.tracks['overture-canon-edit'].bandcampId = 2723025223
        archive.music.tracks['creata'].bandcampId = 514236702
        archive.music.tracks['train'].bandcampId = 3724973112
        archive.music.tracks['of-gods-and-witches'].bandcampId = 2287367115
        archive.music.tracks['beatup'].bandcampId = 2083210639
        archive.music.tracks['you-killed-my-father-prepare-to-die'].bandcampId = 2726017606
        archive.music.tracks['sound-judgement'].bandcampId = 926364892
        archive.music.tracks['aggrievocation'].bandcampId = 2972868325
        archive.music.tracks['stride'].bandcampId = 1558580811
        archive.music.tracks['skaian-overdrive'].bandcampId = 1873810669
        archive.music.tracks['freefall'].bandcampId = 287011093
        archive.music.tracks['moonsweater'].bandcampId = 785615607
        archive.music.tracks['castle'].bandcampId = 2725844969
        archive.music.tracks['skaian-happy-flight'].bandcampId = 3718185271
        archive.music.tracks['voidlight'].bandcampId = 2898819696
        archive.music.tracks['beatdown-dx'].bandcampId = 772758032
        archive.music.tracks['solar-voyage'].bandcampId = 602559110
        archive.music.tracks['feel-alive'].bandcampId = 1712308702
        archive.music.tracks['breeze'].bandcampId = 373584213
        archive.music.tracks['starfall'].bandcampId = 2275927920
        archive.music.tracks['ascend'].bandcampId = 144560522
        archive.music.tracks['lilith-in-starlight'].bandcampId = 364348226
        archive.music.tracks['thanks-for-playing'].bandcampId = 2378456031
        archive.music.tracks['renewed-return'].bandcampId = 4091767254
        archive.music.tracks['this-pumpkin'].bandcampId = 3076641808
        archive.music.tracks['conclude'].bandcampId = 3155595416
        archive.music.tracks['broom-temperature'].bandcampId = 583807931
        archive.music.tracks['frondly-warning'].bandcampId = 2193058944
        archive.music.tracks['ghost-mound'].bandcampId = 953968606
        archive.music.tracks['every-single-grievance'].bandcampId = 1003456770
        archive.music.tracks['get-the-horns'].bandcampId = 4239327151
        archive.music.tracks['definitely-safe-forever'].bandcampId = 1111349919
        archive.music.tracks['snake-escape'].bandcampId = 657823698
        archive.music.tracks['joey-claire-extraordinaire'].bandcampId = 3492054017
        archive.music.tracks['half-harley-manor'].bandcampId = 2897585484
        archive.music.tracks['relatively-visible-darkness'].bandcampId = 1529278548
        archive.music.tracks['bedroom-for-an-annoying-dog'].bandcampId = 3036889854
        archive.music.tracks['thats-how-i-beat-snake'].bandcampId = 1320044738
        archive.music.tracks['jude-harley-bizarrely'].bandcampId = 3668401988
        archive.music.tracks['table-for-tooth'].bandcampId = 2639639658
        archive.music.tracks['final-spice'].bandcampId = 4167566486
        archive.music.tracks['living-legend'].bandcampId = 946898957
        archive.music.tracks['singular-peril'].bandcampId = 3495978583
        archive.music.tracks['a-more-defensible-position'].bandcampId = 1949758202
        archive.music.tracks['open-the-door'].bandcampId = 1406716954
        archive.music.tracks['keep-your-head-down'].bandcampId = 2398258108
        archive.music.tracks['oh-whoa-whats-this'].bandcampId = 1535497369
        archive.music.tracks['some-kind-of-alien'].bandcampId = 994030431
        archive.music.tracks['rustblood'].bandcampId = 4188477796
        archive.music.tracks['filthy-nuclear-bunker'].bandcampId = 4177888436
        archive.music.tracks['sports-personally-i-love-them'].bandcampId = 303411997
        archive.music.tracks['lofted-gunpile'].bandcampId = 1396550729
        archive.music.tracks['serpent-genesis'].bandcampId = 639685418
        archive.music.tracks['we-shall-go-together'].bandcampId = 3534869227
        archive.music.tracks['wish-you-were-here'].bandcampId = 1584485917
        archive.music.tracks['intermission-1'].bandcampId = 441046199
        archive.music.tracks['old-steps'].bandcampId = 2864501946
        archive.music.tracks['how-it-could-have-gone'].bandcampId = 37650359
        archive.music.tracks['alternate-recipe'].bandcampId = 4269183655
        archive.music.tracks['heavy-snaking'].bandcampId = 188708369
        archive.music.tracks['spooktune'].bandcampId = 3371372271

      }
    }
  }
}
