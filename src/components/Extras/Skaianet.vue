<template>
  <section class="pageBody">
    <center>
      <NavBanner />
      <table summary="" border="2" class="grey">
        <tr>
          <td colspan="3" class="grey">
            <center>
              <div class="title"><a href="https://web.archive.org/web/0/http://www.skaianetsystems.com/">Skaianet Systems Incorporated</a></div>
            </center>
          </td>
        </tr>
        <tr>
          <!-- Main body row -->
          <td width="5px" class="grey"></td>
          <td bgcolor="#1c3019">
            <!-- Main body cell -->
            <table summary="" width="" height="400px" border="0" bgcolor="" style="padding: 40px;">
              <tr>
                <td>
                  <div v-if="routeParams.cursed_history == 'cursed_history'" class="cursedWrapper">
                    <div class="cursedPreface centercolumn">
                      <p>
                        At the beginning of 2019, the <a href="http://skaianetsystems.com">Skaianet Systems</a> website launched, containing multiple hidden files within its source HTML.
                        Among <a href="assets://archive/skaianet/CRITICAL_ASSETS/index.html">other files</a>, there were 36 text documents outlining certain events that took place during Her Imperious Condescension's rise to power in universe B2.
                      </p><p>
                        <strong>The following has been quoted directly from <a href="https://mspaintadventures.fandom.com/wiki/Skaianet_Systems_Incorporated#Criticism_and_apology">The MSPA Wiki</a>:</strong>
                      </p>
                      <p>
                        Following the initial release of the hidden "history" content found within the site's files, some portions of its readership expressed severe concerns about segments of its content. In particular, the interactions between Adolf Hitler and Albert Einstein, and some of the more sexual interludes, were found to be carelessly offensive or inflammatory. The treatment of the Holocaust in particular was criticised for being offhandedly antisemitic.
                      </p>
                      <p>
                        The hidden content was removed shortly after the release of the Skaianet Systems website, however this did not stem its spread or the spread of the criticism. Between January 2–5, an apology message written presumably by Andrew Hussie was present on the Skaianet Systems homepage, reflecting on the insensitivity of aspects of the writing, and apologizing for releasing work that was carelessly drafted and inflammatory.
                      </p>
                      <p>
                        The apology message reads:
                      </p>
                      <SpoilerBox kind="Apology">
                        <p>
                          Originally there was some backstory content hidden in some cursed tags in this site code. I came up with the concepts years ago for internal purposes, not originally intended for public consumption. I thought some might find it interesting if the material were leaked in the site code in an obscure way. I think it has proven to be neither obscure as imagined, nor all that rewarding to read. The subject matter was inflammatory in careless ways, and the negative reactions to it are legitimate and should have been expected. A drafting process can be messy and can result in some ill-advised nonsense which often should not see the light of day. Letting a bunch of rough draft text files be deployed in this way was not a well considered move. Obviously this material has hurt a lot of people. Which isn't what I was going for, and didn't anticipate, but certainly should have. As far as the intentions behind it, I'm sure I believed it would be read as condemnation through satire, but instead it came off as excessively irreverent and disrespectful of a sensitive topic (to be clear, the main topic relates to antisemitism, which of course is not an issue that should be handled frivolously). After receiving criticism it's obvious to me where I'd been mistaken, and why no one could have possibly read it the way it was intended. I know this content was bad, I regret putting it in a place where people would discover it, and I regret that it was drafted in the first place.
                        </p>
                        <p>
                          I acknowledge that there are certain subjects which demand an exceptional level of care, and that I have been inexcusably thoughtless in handling this. I understand that there should be a certain standard of consideration and review for the content that is presented to an audience, and in forgoing that consideration there have been serious consequences for those people whom this issue directly affects. This could have been easily avoided had I sought a more careful review before it was posted to ensure that what I actually wanted to convey was being properly conveyed.
                        </p>
                        <p>
                          I am sorry that this lapse of judgment has been hurtful to so many people. I cannot undo the damage that this has caused, but I can promise that I am aware of the gravity of this mistake and that, going forward, I will be more mindful of the serious impact careless decisions have on those they hurt.
                      </p>
                    </SpoilerBox>
                    </div>
                    <div class="centercolumn">
                      <SpoilerBox v-for="id in cursedId" :key="id" class="grey" :kind="id">
                        <center>
                          <div class="cursedHistoryText" v-html="getFile(`/archive/skaianet/FORBIDDEN_ENTRIES/${id}`)" />
                        </center>
                      </SpoilerBox>
                    </div>
                  </div>
                  <center v-else>
                    <table summary="" width="680px" border="2" bgcolor="">
                      <tr>
                        <td width="220px" bgcolor="#000">
                          <center><MediaEmbed url="archive/skaianet/logob.png" class="log" size="30%" alt="" style="height: 163px;" /></center>
                        </td>
                        <td width="2"></td>
                        <td bgcolor="#000">
                          <center>
                            <center>
                              <div style="width:; white-space:nowrap; height:px; overflow:hidden; font-size: 24px;word-wrap:none; color:#FFFFFF;">UNESTABLISHED IN:</div>
                            </center>
                            <br>
                            <table summary="" width="400px" border="2" bgcolor="">
                              <tr>
                                <td class="grey">
                                  <center>
                                    <br>
                                    <p class="Apophis" v-text="apophis" />
                                    <br>
                                  </center>
                                </td>
                              </tr>
                            </table>
                          </center>
                        </td>
                      </tr>
                    </table>
                    <br>
                    <table summary="" border="2" bgcolor="">
                      <tr>
                        <td bgcolor="#000">
                          <center><MediaEmbed url="archive/skaianet/map.jpg" /></center>
                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#000">
                          <div class="microsoft marquee">
                            <p v-text="impactMarquee" />
                          </div>
                        </td>
                      </tr>
                    </table>
                    <span>
                      <br><br>
                      <table summary="" border="2" class="centercolumn">
                        <tr>
                          <td class="grey" >
                            <center><br><br>
                              <a
                              :href="$localData.settings.cursedHistory ? '/skaianet/cursed_history' : '/settings/controversial'"
                              :class="{controversialHijack: !$localData.settings.cursedHistory}">
                            The following assets have been acquired by Skaianet Systems Incorporated.</a>
                            <br><br><br></center>
                          </td>
                        </tr>
                      </table>
                      <br>
                    </span>
                    <br>
                    <table class="centercolumn promotion" summary="" border="2"
                      v-for="promotion, i in promotions"
                      :key="i"
                    >
                      <tr v-if="promotion.pretitle">
                        <td width="74px" height="64">
                          <MediaEmbed :url="promotion.preicon || promotion.icon" style="display: block;"/>
                        </td>
                        <td width="2"></td>
                        <td height="64">
                          <center>
                            <div class="title" v-html="promotion.pretitle" />
                          </center>
                        </td>
                      </tr>
                      <tr>
                        <td width="74px" height="64">
                          <MediaEmbed :url="promotion.icon" style="display: block;"/>
                        </td>
                        <td width="2"></td>
                        <td height="64">
                          <center>
                            <div class="title" v-html="promotion.title" />
                          </center>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <center style="padding: 0 15px;" v-html="promotion.content" />
                        </td>
                      </tr>
                    </table>
                  </center>
                </td>
              </tr>
            </table>
          </td>
          <td width="5px" class="grey"></td>
        </tr>
        <tr>
          <td colspan="3" class="grey">
            <center>☺1889-2029 Skaianet Systems Incorporated. All rights reserved. </center>
          </td>
        </tr>
      </table>
    </center>
  </section>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'

var fs
if (!window.isWebApp) {
  fs = require('fs')
} else {
  fs = undefined
}

export default {
  name: 'skaianet',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, SpoilerBox
  },
  title: () => "Skaianet Systems",
  data: function() {
    return {
      marqueeInterval: undefined,
      apophis: undefined,
      countDownDate: undefined,
      impactTable: Object.freeze([
        [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891], [-9.20952, -66.87065], [33.43228, 97.88285], [-26.08581, 24.69693], [11.24559, 12.08721], [-16.36835, -50.59490], [68.74373, -144.17275], [17.04005, 97.68261], [38.24650, 106.49642], [21.85192, -3.09684], [62.88434, -124.20298], [38.60233, 80.15358], [54.19481, 72.48143], [-27.50667, 133.93761], [-9.04663, -36.10689], [-27.26953, -57.91870], [58.40644, -68.97977], [-2.48229, -51.64199], [-12.05939, 25.55648], [30.67068, 118.61092], [26.90603, 85.96731]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891], [-9.20952, -66.87065], [33.43228, 97.88285], [-26.08581, 24.69693], [11.24559, 12.08721], [-16.36835, -50.59490], [68.74373, -144.17275], [17.04005, 97.68261], [38.24650, 106.49642], [21.85192, -3.09684], [62.88434, -124.20298], [38.60233, 80.15358], [54.19481, 72.48143], [-27.50667, 133.93761], [-9.04663, -36.10689], [-27.26953, -57.91870], [58.40644, -68.97977], [-2.48229, -51.64199], [-12.05939, 25.55648]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891], [-9.20952, -66.87065], [33.43228, 97.88285], [-26.08581, 24.69693], [11.24559, 12.08721], [-16.36835, -50.59490], [68.74373, -144.17275], [17.04005, 97.68261], [38.24650, 106.49642], [21.85192, -3.09684], [62.88434, -124.20298], [38.60233, 80.15358], [54.19481, 72.48143]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891], [-9.20952, -66.87065], [33.43228, 97.88285], [-26.08581, 24.69693], [11.24559, 12.08721], [-16.36835, -50.59490], [68.74373, -144.17275], [17.04005, 97.68261], [38.24650, 106.49642], [21.85192, -3.09684], [62.88434, -124.20298]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891], [-9.20952, -66.87065], [33.43228, 97.88285], [-26.08581, 24.69693], [11.24559, 12.08721]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428], [60.74755, 142.01706], [-5.37813, 31.42891]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151], [74.88070, 90.63174], [65.21932, -173.74283], [21.10738, 74.57002], [73.10748, -48.45428]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153], [44.78893, 81.14044], [55.82463, 127.22151]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051], [52.41077, 87.31729], [-28.33136, 138.58945], [1.40001, -61.52241], [34.54162, -119.63153]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927], [-23.56785, 114.93736], [31.29668, 12.54051]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641], [53.33706, 111.77075], [61.40545, 80.60927]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831], [32.69014, 75.69641]
        ], [
          [7.54044, 19.34320], [59.59924, 142.56831]
        ]
      ]),
      cursedId: [
        "01-1863-Calamity.txt",
        "02-1864-Centralia.txt",
        "03-1873-TrainRobbery.txt",
        "04-1876-RIPJamesBros.txt",
        "05-1881-Crocker.txt",
        "06-1889-Skaianet.txt",
        "07-1895-Einstein.txt",
        "08-1896-FredKarnosArmy.txt",
        "09-1903-PatentOffice.txt",
        "10-1910-JaneAndJake.txt",
        "11-1923-JakeLeaves.txt",
        "12-1926-RIPHoudini.txt",
        "13-1927-PuttingPantsOnPhilip.txt",
        "14-1931-JakeReturns.txt",
        "15-1933-HitlersPromotion.txt",
        "16-1942-AnnDunham.txt",
        "17-1945-WWII.txt",
        "18-1955-RIPEinstein.txt",
        "19-1957-RIPHardy.txt",
        "20-1961-NextPhase.txt",
        "21-1964-TheFieriClones.txt",
        "22-1965-LaurelsLastStand.txt",
        "23-1965-2009-SkipToTheEnd.txt",
        "24-1863-1965-PostScratchTimeline.txt",
        "25-1965-HarryAdoptsFieriAgain.txt",
        "26-1977-ChaplinsLastStand.txt",
        "27-1989-ICP.txt",
        "28-1996-JaneAndJake.txt",
        "29-2008-Obama.txt",
        "30-2011-Rebranding.txt",
        "31-2016-Trump.txt",
        "32-2024-TheDoubleJuggaloPresidency.txt",
        "33-2029-Apophis.txt",
        "34-2050-Flooding.txt",
        "35-2040-2424-PreparingAlterniaC.txt",
        "36-RIPHIC.txt"
      ],
      promotions: [
        {
          icon: "archive/skaianet/hs.gif",
          title: `
            <a href="https://store.steampowered.com/app/623940/HIVESWAP_Act_1/" target="_blank">HIVESWAP.EXE</a>
            <img src="${this.$getResourceURL('archive/skaianet/exe.gif')}" align="middle" />
            <a href="http://www.hiveswap.com" target="_blank">WWW</a>
            <img src="${this.$getResourceURL('archive/skaianet/www.gif')}" align="middle" />`,
          content: `
            <p>Monsters in the yard. Monsters in the house. Monsters in the hall, beating on your door. Your brother's trapped in his treehouse, so he’s not gonna be much help. You're going to have to get yourself out of this. But where did they come from? How are you supposed to deal with this? Well, certainly not by cowering in your room. That's for, uh, cowards.</p>

            <p>First things first. You need to open the door.</p>

            <p>HIVESWAP is a four-part series set in Andrew Hussie’s Homestuck universe, with a companion series, <em>Hauntswitch</em>, to follow. Continue your save from chapter to chapter, then from game to game, to carry your story, choices, friendships and frenemies across them all--then do it again! Once released, HIVESWAP and <em>Hauntswitch</em> will be playable in either order. Haven’t read Homestuck? That’s fine! This game is set in 1994! Homestuck hasn’t even been invented yet!</p>

            <p>Also see the <a href='http://hs.hiveswap.com/ezodiac/index.php'>Extended Zodiac</a>, an official personality quiz that assigns you a zodiac symbol based on your quiz answers and the Act 2 character preview <a href='http://hs.hiveswap.com/trollcall/'>Troll Call</a>, released as promotional material for the Hiveswap games.</p>

            <p>Hiveswap - <em>
              <a href="https://store.steampowered.com/app/623940/HIVESWAP_Act_1/">Act 1</a> |
              <a href="https://store.steampowered.com/app/1181840/HIVESWAP_Act_2/">Act 2</a> |
              <a>Act 3</a> |
              <a>Act 4</a>
            </em> </p>
            <p>Hauntswitch - <em>
              <a>Act 1</a> |
              <a>Act 2</a> |
              <a>Act 3</a> |
              <a>Act 4</a>
            </em></p>
            <p><em><a href="https://store.steampowered.com/curator/35533744-Homestuck-Universe/list/49536/">Steam store page</a></em></p>
            <p>
              <em>14 September 2017 - Present</em></p>
            <p>
              <em>Kickstarter: 4 September 2012</em><br />
              <em>Act 1: 14 September 2017</em><br />
              <em>Act 2: 25 November 2020</em>
            </p>`
        },
        {
          icon: "archive/skaianet/viz.gif",
          title: `
            <a href="https://www.homestuck.com/" target="_blank">HOMESTUCK.COM</a>
            <img src="${this.$getResourceURL('archive/skaianet/www.gif')}" align="middle" />`,
          content: `
             <p>The current version of the MSPA website. More mobile-friendly, but with a number of issues. Hence this archive. Also has links to get official Homestuck merch.</p>
             <p><a href='/news/4-03-18'>Site Announcement</a></p>
             <p><em>2 April 2018 - Present</em></p>`
        },
        {
          icon: "archive/skaianet/spoon.gif",
          title: `
            <a href="https://archive.org/details/sbahj-and-the-quest-for-the-missing-spoon" target="_blank">SPOON.PDF</a>
            <img src="${this.$getResourceURL('archive/skaianet/book.gif')}" align="middle" />`,
          content: `
             <p>Journey with Sweet Bro as he joroneys to recover his spoon over a long jounrey. </p>
             <p><a href='https://www.kickstarter.com/projects/1724736026/sweet-bro-and-hella-jeff-by-hussie-dril-and-kc-gre/'>Kickstarter</a></p>
             <p><a href='https://web.archive.org/web/20230203203700/https://topatoco.com/products/mspa-sb-spoon'>Topatoco (Archive, discontinued)</a></p>
             <p><em>8 November 2018</em></p>`
        },
        {
          icon: "archive/skaianet/fs.gif",
          title: `<a href="https://store.steampowered.com/app/833040/Hiveswap_Friendsim/" target="_blank">FRIENDSIM.EXE</a>
          <img src="${this.$getResourceURL('archive/skaianet/exe.gif')}" align="middle" />
          <a href="http://hs.hiveswap.com/friendsim/" target="_blank">WWW</a>
          <img src="${this.$getResourceURL('archive/skaianet/www.gif')}" align="middle" />`,
          content: `
            <p>You just crash-landed on Alternia, and you’re <strong>DESPERATE</strong> for friendship! Anyone will do...wait, who are those two trolls approaching you?.</p>
            <p>The Hiveswap Friendsim is a quick, loosely-canonical visual novel adventure following the efforts of the unnamed protagonist (that’s you!) to survive and maybe even thrive on the harsh surface of ALTERNIA. Set in the time of Hiveswap: Act 1, this episodic visual novel’s opening volume, written by Homestuck creator Andrew Hussie, is sure to satisfy Homestuck and Hiveswap fans who are eager for a darker stroll across the Alternian landscape.</p>

            <p><em><a href="https://store.steampowered.com/app/833040/Hiveswap_Friendsim/">Description from Steam store page.</a></em></p>
            <p><em>13 April 2018 - 14 December 2018</em></p>`
        },
        {
          icon: "archive/skaianet/epi.gif",
          title: `
            <a href="/epilogues">EPILOGUES.TXT</a>
            <img src="${this.$getResourceURL('archive/skaianet/txt.gif')}" align="middle" />
            <a href="https://www.homestuck.com/epilogues" target="_blank">WWW</a>
            <img src="${this.$getResourceURL('archive/skaianet/www.gif')}" align="middle" />`,
          content: `<p>Tales of dubious authenticity.</p>

            <p>Ten years ago, a young man stood in his bedroom. The events set in motion that day would change his and his friends' lives forever, for the better and the worse (and the ridiculous). Now, in the aftermath, he has to make a choice: Meat or Candy?</p>
            <p><a href="https://web.archive.org/web/20200307172211/https://www.viz.com/read/graphic-novel/homestuck-epilogues/product/6154">VIZ Media print release (Archive, discontinued)</a></p>
            <p><em>Prologue release: 13 April 2019</em><br />
               <em>Online release: 20 April 2019</em></p>
            <p><em>VIZ Media print release: 14 January 2020</em></p>`
        },
        {
          icon: "archive/skaianet/pq.gif",
          title: `
            <a href="https://store.steampowered.com/app/1144030/Pesterquest/" target="_blank">PESTERQUEST.EXE</a>
            <img src="${this.$getResourceURL('archive/skaianet/exe.gif')}" align="middle" />
            <a href="http://whatpumpkin.com/" target="_blank">WWW</a>
            <img src="${this.$getResourceURL('archive/skaianet/www.gif')}" align="middle" />`,
          content: `
            <p>Who are you again? And what the hell are you doing here? Wait… is this Earth, and who exactly is that kid over there? He looks nice! </p>

            <p>Embark on a quest of epic importance in Pesterquest, a grimsical episodic visual novel set in the darkly funny Homestuck/Hiveswap universe created by American author and artist <strong>Andrew Hussie.</strong></p>

            <p>Find all the answers you're looking for across 14 volumes of idiosyncratic adventure packed with visual mastery and shrewdly written narrative. As you zap between Earth and Alternia, you’ll discover and reconnect with up to 20 friends both extra and terrestrial.</p>

            <p><em><a href="https://store.steampowered.com/app/1144030/Pesterquest/">Description from Steam store page.</a></em></p>
            <p><em>4 September 2019 - 1 April 2020</em></p>`
        },
        {
          preicon: "assets://archive/skaianet/snake.png",
          pretitle: `<del>
            <a href="https://web.archive.org/web/20210122001639/https://www.homestuck2.com/" target="_blank">HOMESTUCK^2.TXT</a></del>
            <img src="${this.$getResourceURL('archive/skaianet/txt.gif')}" align="middle" />`,
          icon: "archive/skaianet/hs2.gif",
          title: `
            <a href="https://www.beyondcanon.com" target="_blank">BEYONDCANON.TXT</a>
            <img src="${this.$getResourceURL('archive/skaianet/txt.gif')}" align="middle" />`,
          content: `
            <p>Homestuck: Beyond Canon (HS:BC) is a further continuation of the Homestuck story, after the events of The Homestuck Epilogues and Pesterquest.</p>

            <p>It is a story about the consequences of the pursuit of relevancy and growing up. As this work is a direct followup to The Homestuck Epilogues it is highly recommended you be familiar with what happens in that story.</p>

            <p><em><a href="https://beyondcanon.com/about">Description from the website's About page.</a></em></p>

            <hr />

            <p><b>Homestuck^2: Beyond Canon</b> was a <a href='https://web.archive.org/web/20200107061917/https://www.homestuck2.com/faq'>What Pumpkin/Snake Solutions collaboration</a> from 25 October 2019 until 29 December 2020, when it was put on an <a href='https://www.patreon.com/posts/hiatus-and-45570563'>indefinite hiatus.</a> <br />Snake Solutions Studio LLP was disbanded January 2021.</p>

            <p>On 8 October 2023, the project was rebranded as <b>Homestuck: Beyond Canon (HS:BC)</b> and was continued <a href='https://beyondcanon.com/news/under-new-management'>by a new team</a> known as the <a href='https://web.archive.org/web/20240305093005/https://beyondcanon.com/about'>Homestuck independent creative union.</a> The story picked up from where it had left off.</p>
            <p><em>Homestuck^2: Beyond Canon: 25 October 2019 - 29 December 2020</em></p>
            <p><em>Homestuck: Beyond Canon: 8 October 2023 - Present</em></p>`
        },
        {
          icon: "archive/skaianet/psycholonials.gif",
          title: `
            <a href="https://www.psycholonials.com" target="_blank">PSYCHOLONIALS.EXE</a>
            <img src="${this.$getResourceURL('archive/skaianet/exe.gif')}" align="middle" />`,
          content: `
             <p>While in communication with supernatural forces, two influencers launch a daring new social media brand.</p>

             <p>A visual novel by Andrew Hussie.<br />
             <a href='https://psycholonials.bandcamp.com/album/psycholonials'>Soundtrack by Clark Powell.</a></p>

             <p><em>3 Feburary 2021</em></p>`
        }
      ],
      cursedText: { }
    }
  },
  computed: {
    impactMarquee() {
      return this.impactTable
        .map(chunk => {
          return chunk
            .map(pair => `Latitude: ${pair[0]}, Longitude: ${pair[1]}`)
            .join(", \n")
        })
        .join('\n•\n')
    }
  },
  methods: {
    setApophis() {
      // Get todays date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = this.countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365))
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)) - (years * 365)
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Output the result in an element with class="Apophis"
      this.apophis = years + "y " + days + "d " + hours + "h " + minutes + "m " + seconds + "s "

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(this.marqueeInterval)
        this.apophis = "EXPIRED"
      }
    },
    getFile(url) {
      this.$logger.info("Retrieving file", url)
      if (this.$isWebApp) {
        if (this.cursedText[url]) return this.cursedText[url]

        const request = new XMLHttpRequest()
        request.open("GET", url, false) // `false` makes the request synchronous
        request.send(null)
        if (request.status === 200) {
          this.cursedText[url] = request.responseText
          return this.cursedText[url]
        } else {
          console.error(request)
        }
      } else {
        return fs.readFileSync(this.$mspaFileStream(url), 'utf8')
      }
    }
  },
  updated() {
  },
  mounted() {
    // Set the date we're counting down to
    this.countDownDate = new Date("Apr 13, 2029 00:04:13").getTime()
    // Update the count down every 1 second
    this.marqueeInterval = setInterval(this.setApophis, 1000)
    this.setApophis()
  },
  beforeDestroy() {
    clearInterval(this.marqueeInterval)
  }
}
</script>

<style scoped lang="scss">
.navBanner {
  margin: 0 auto;
  margin-bottom: 10px;
  background-color: black;
}

.pageBody {
  background: black;
  padding: 10px;
  padding-top:  0;
  font-family: 'Times New Roman', Times, serif;
  font-weight: normal;
  font-size: initial;

  .title {
    white-space: nowrap;
    overflow: hidden;
    font-size: 50px;
    color: rgb(0, 0, 0);
  }

  .marquee.microsoft {
    background-color: #000;
    width: 680px;
    height: 15px;
    margin-left: 5px;
  }

  table {
    td {
      padding: 0;
    }
  }
  .grey {
    background-color: #b9b8b9;
  }

  .centercolumn {
    background-color: #b9b8b9;
    width: 685px;
  }
}

table.promotion::v-deep {
  margin-bottom: 1em;
  p {
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  div.title {
    width: 550px;
    white-space: nowrap;
    overflow: hidden;
    font-size: xx-large;
    word-wrap: none;

    display: flex;
    justify-content: center;
  }
}

a.controversialHijack {
  // pointer-events: none;
  color: gray;
}

.cursedWrapper {
  p {
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  div.centercolumn {
    padding: 20px;
    + .centercolumn {
      margin-top: 1em;
    }
  }
  div.cursedPreface {
    text-align: center;
  }

  div.cursedHistoryText {
    white-space: pre-wrap;
    padding: 0 2em;
  }
}

.marquee {
  color:#fff;
  font-size:12px;
  font-family:verdana;
  width: 680px;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}

.marquee span, .marquee p {
  color: #fff;
  background-color:black;
  display: inline-block;
  padding-left: 100%;  /* show the marquee just outside the paragraph */
  animation: marquee 413s linear infinite;
  &:hover {
    animation-play-state: paused
  }
}

/* Make it move */
@keyframes marquee {
    0%   { transform: translate(0, 0); }
    100% { transform: translate(-100%, 0); }
}

</style>
