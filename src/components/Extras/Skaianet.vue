<template>
  <section class="pageBody">
    <center>
      <NavBanner />
      <table summary="" cellpadding="0px" border="2" bgcolor="#b9b8b9">
        <tbody>
          <tr>
            <td colspan="3" bgcolor="#b9b8b9">
              <center>
                <div style="width:; white-space:nowrap; height:px; overflow:hidden; font-size: 50px;word-wrap:none; color:#000000;"><a href="http://skaianetsystems.com/">Skaianet Systems Incorporated</a></div>
              </center>
            </td>
          </tr>
          <tr>
            <td width="5px" bgcolor="#b9b8b9"></td>
            <td bgcolor="#1c3019">
              <table summary="" width="" height="400px" cellpadding="40px" border="0" bgcolor="">
                <tbody>
                  <tr>
                    <td>
                      <center v-if="routeParams.cursed_history == 'cursed_history'">
                        <table summary="" border="2" width="685px" cellpadding="0px" bgcolor="" style="margin-bottom:25px;">
                          <tr>
                            <td bgcolor="#b9b8b9" >
                              <center style="padding:25px;">
                                At the beginning of 2019, the <a href="http://skaianetsystems.com">Skaianet Systems</a> website launched, containing multiple hidden files within its source HTML. 
                                Among <a href="assets://archive/skaianet/CRITICAL_ASSETS/index.html">other files</a>, there were 36 text documents outlining certain events that took place during Her Imperious Condescension's rise to power in universe B2.
                                <br><br>
                                <strong>The following has been quoted directly from <a href="https://mspaintadventures.fandom.com/wiki/Skaianet_Systems_Incorporated#Criticism_and_apology">The MSPA Wiki</a>:</strong>
                                <br><br>
                                Following the initial release of the hidden "history" content found within the site's files, some portions of its readership expressed severe concerns about segments of its content. In particular, the interactions between Adolf Hitler and Albert Einstein, and some of the more sexual interludes, were found to be carelessly offensive or inflammatory. The treatment of the Holocaust in particular was criticised for being offhandedly antisemitic.
                                <br><br>
                                The hidden content was removed shortly after the release of the Skaianet Systems website, however this did not stem its spread or the spread of the criticism. Between January 2–5, an apology message written presumably by Andrew Hussie was present on the Skaianet Systems homepage, reflecting on the insensitivity of aspects of the writing, and apologizing for releasing work that was carelessly drafted and inflammatory.
                                <br><br>
                                The apology message reads: 
                                <br><br><em>
                                Originally there was some backstory content hidden in some cursed tags in this site code. I came up with the concepts years ago for internal purposes, not originally intended for public consumption. I thought some might find it interesting if the material were leaked in the site code in an obscure way. I think it has proven to be neither obscure as imagined, nor all that rewarding to read. The subject matter was inflammatory in careless ways, and the negative reactions to it are legitimate and should have been expected. A drafting process can be messy and can result in some ill-advised nonsense which often should not see the light of day. Letting a bunch of rough draft text files be deployed in this way was not a well considered move. Obviously this material has hurt a lot of people. Which isn't what I was going for, and didn't anticipate, but certainly should have. As far as the intentions behind it, I'm sure I believed it would be read as condemnation through satire, but instead it came off as excessively irreverent and disrespectful of a sensitive topic (to be clear, the main topic relates to antisemitism, which of course is not an issue that should be handled frivolously). After receiving criticism it's obvious to me where I'd been mistaken, and why no one could have possibly read it the way it was intended. I know this content was bad, I regret putting it in a place where people would discover it, and I regret that it was drafted in the first place.
                                <br><br>
                                I acknowledge that there are certain subjects which demand an exceptional level of care, and that I have been inexcusably thoughtless in handling this. I understand that there should be a certain standard of consideration and review for the content that is presented to an audience, and in forgoing that consideration there have been serious consequences for those people whom this issue directly affects. This could have been easily avoided had I sought a more careful review before it was posted to ensure that what I actually wanted to convey was being properly conveyed.
                                <br><br>
                                I am sorry that this lapse of judgment has been hurtful to so many people. I cannot undo the damage that this has caused, but I can promise that I am aware of the gravity of this mistake and that, going forward, I will be more mindful of the serious impact careless decisions have on those they hurt.
                                </em>
                              </center>
                            </td>
                          </tr>
                        </table>
                        <table summary="" border="2" width="685px" cellpadding="0px" bgcolor="">
                          <tr v-for="id in cursedId" :key="id" >
                            <td bgcolor="#b9b8b9" >
                              <center>
                                <div class="cursedHistoryText" v-html="getFile(`/archive/skaianet/FORBIDDEN_ENTRIES/${id}`)" />
                              </center>
                            </td>
                          </tr>
                        </table>
                      </center>
                      <center v-else>
                        <table summary="" width="680px" cellpadding="0px" border="2" bgcolor="">
                          <tbody>
                          <tr>
                            <td width="220px" bgcolor="#000">
                              <center><MediaEmbed url="archive/skaianet/logob.png" class="log" size="30%" alt="" height="163" /></center>
                            </td>
                            <td width="2"></td>
                              <td bgcolor="#000">
                                <center>
                                  <center>
                                    <div style="width:; white-space:nowrap; height:px; overflow:hidden; font-size: 24px;word-wrap:none; color:#FFFFFF;">UNESTABLISHED IN:</div>
                                  </center>
                                  <br>
                                  <table summary="" width="400px" cellpadding="0px" border="2" bgcolor="">
                                    <tbody>
                                      <tr>
                                        <td bgcolor="#b9b8b9">
                                          <center>
                                            <br>
                                            <p class="Apophis" v-text="apophis" />
                                              <br>
                                          </center>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" cellpadding="0px" border="2" bgcolor="">
                          <tbody>
                          <tr>
                            <td bgcolor="#000">
                              <center><MediaEmbed url="archive/skaianet/map.jpg" /></center>
                            </td>
                            </tr>
                            <tr>
                              <td bgcolor="#000">
                                <div style="background-color:#000; width:680px; height:15px;margin-left:5px;" class="microsoft marquee">
                                  <span>
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  Latitude: -9.20952, Longitude: -66.87065, 
                                  Latitude: 33.43228, Longitude: 97.88285, 
                                  Latitude: -26.08581, Longitude: 24.69693, 
                                  Latitude: 11.24559, Longitude: 12.08721, 
                                  Latitude: -16.36835, Longitude: -50.59490, 
                                  Latitude: 68.74373, Longitude: -144.17275, 
                                  Latitude: 17.04005, Longitude: 97.68261, 
                                  Latitude: 38.24650, Longitude: 106.49642, 
                                  Latitude: 21.85192, Longitude: -3.09684, 
                                  Latitude: 62.88434, Longitude: -124.20298, 
                                  Latitude: 38.60233, Longitude: 80.15358, 
                                  Latitude: 54.19481, Longitude: 72.48143, 
                                  Latitude: -27.50667, Longitude: 133.93761, 
                                  Latitude: -9.04663, Longitude: -36.10689, 
                                  Latitude: -27.26953, Longitude: -57.91870, 
                                  Latitude: 58.40644, Longitude: -68.97977, 
                                  Latitude: -2.48229, Longitude: -51.64199, 
                                  Latitude: -12.05939, Longitude: 25.55648,
                                  Latitude: 30.67068, Longitude: 118.61092,
                                  Latitude: 26.90603, Longitude: 85.96731,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  Latitude: -9.20952, Longitude: -66.87065, 
                                  Latitude: 33.43228, Longitude: 97.88285, 
                                  Latitude: -26.08581, Longitude: 24.69693, 
                                  Latitude: 11.24559, Longitude: 12.08721, 
                                  Latitude: -16.36835, Longitude: -50.59490, 
                                  Latitude: 68.74373, Longitude: -144.17275, 
                                  Latitude: 17.04005, Longitude: 97.68261, 
                                  Latitude: 38.24650, Longitude: 106.49642, 
                                  Latitude: 21.85192, Longitude: -3.09684, 
                                  Latitude: 62.88434, Longitude: -124.20298, 
                                  Latitude: 38.60233, Longitude: 80.15358, 
                                  Latitude: 54.19481, Longitude: 72.48143, 
                                  Latitude: -27.50667, Longitude: 133.93761, 
                                  Latitude: -9.04663, Longitude: -36.10689, 
                                  Latitude: -27.26953, Longitude: -57.91870, 
                                  Latitude: 58.40644, Longitude: -68.97977, 
                                  Latitude: -2.48229, Longitude: -51.64199, 
                                  Latitude: -12.05939, Longitude: 25.55648,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  Latitude: -9.20952, Longitude: -66.87065, 
                                  Latitude: 33.43228, Longitude: 97.88285, 
                                  Latitude: -26.08581, Longitude: 24.69693, 
                                  Latitude: 11.24559, Longitude: 12.08721, 
                                  Latitude: -16.36835, Longitude: -50.59490, 
                                  Latitude: 68.74373, Longitude: -144.17275, 
                                  Latitude: 17.04005, Longitude: 97.68261, 
                                  Latitude: 38.24650, Longitude: 106.49642, 
                                  Latitude: 21.85192, Longitude: -3.09684, 
                                  Latitude: 62.88434, Longitude: -124.20298, 
                                  Latitude: 38.60233, Longitude: 80.15358, 
                                  Latitude: 54.19481, Longitude: 72.48143, 
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  Latitude: -9.20952, Longitude: -66.87065, 
                                  Latitude: 33.43228, Longitude: 97.88285, 
                                  Latitude: -26.08581, Longitude: 24.69693, 
                                  Latitude: 11.24559, Longitude: 12.08721, 
                                  Latitude: -16.36835, Longitude: -50.59490, 
                                  Latitude: 68.74373, Longitude: -144.17275, 
                                  Latitude: 17.04005, Longitude: 97.68261, 
                                  Latitude: 38.24650, Longitude: 106.49642, 
                                  Latitude: 21.85192, Longitude: -3.09684, 
                                  Latitude: 62.88434, Longitude: -124.20298, 
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  Latitude: -9.20952, Longitude: -66.87065, 
                                  Latitude: 33.43228, Longitude: 97.88285, 
                                  Latitude: -26.08581, Longitude: 24.69693, 
                                  Latitude: 11.24559, Longitude: 12.08721, 
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  Latitude: 60.74755, Longitude: 142.01706,
                                  Latitude: -5.37813, Longitude: 31.42891,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  Latitude: 74.88070, Longitude: 90.63174,
                                  Latitude: 65.21932, Longitude: -173.74283,
                                  Latitude: 21.10738, Longitude: 74.57002,
                                  Latitude: 73.10748, Longitude: -48.45428,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  Latitude: 44.78893, Longitude: 81.14044,
                                  Latitude: 55.82463, Longitude: 127.22151,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  Latitude: 52.41077, Longitude: 87.31729,
                                  Latitude: -28.33136, Longitude: 138.58945,
                                  Latitude: 1.40001, Longitude: -61.52241,
                                  Latitude: 34.54162, Longitude: -119.63153,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  Latitude: -23.56785, Longitude: 114.93736, 
                                  Latitude: 31.29668, Longitude: 12.54051, 
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  Latitude: 53.33706, Longitude: 111.77075,
                                  Latitude: 61.40545, Longitude: 80.60927, 
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  Latitude: 32.69014, Longitude: 75.69641,
                                  •
                                  Latitude: 7.54044, Longitude: 19.34320, 
                                  Latitude: 59.59924, Longitude: 142.56831, 
                                  •
                                  </span>
                                  <p></p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <span v-if="$localData.settings.cursedHistory">
                          <br><br>
                          <table summary="" border="2" width="685px" cellpadding="0px" bgcolor="">
                            <tr>
                              <td bgcolor="#b9b8b9" >
                                <center><br><br><a href="/skaianet/cursed_history">The following assets have been acquired by Skaianet Systems Incorporated.</a><br><br><br></center>
                              </td>
                            </tr>
                          </table>
                          <br>
                        </span>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                          <tbody>
                          <tr>
                            <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/hs.gif" /></center>
                            </td>
                            <td width="2" bgcolor="#b9b8b9"></td>
                              <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://store.steampowered.com/app/623940/HIVESWAP_Act_1/" target="_blank">HIVESWAP.EXE</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/exe.gif" align="middle" />
                                          </td>
                                          <td>
                                            <font size="6"><a href="http://www.hiveswap.com" target="_blank">WWW</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/www.gif" align="middle" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                          <tr>
                            <td colspan="3" bgcolor="#b9b8b9">
                              <center style="padding:15px;">
                                <p>Monsters in the yard. Monsters in the house. Monsters in the hall, beating on your door. Your brother's trapped in his treehouse, so he’s not gonna be much help. You're going to have to get yourself out of this. But where did they come from? How are you supposed to deal with this? Well, certainly not by cowering in your room. That's for, uh, cowards.</p><br>

                                <p>First things first. You need to open the door.</p><br>

                                <p>HIVESWAP is a four-part series set in Andrew Hussie’s Homestuck universe, with a companion series, <em>Hauntswitch</em>, to follow. Continue your save from chapter to chapter, then from game to game, to carry your story, choices, friendships and frenemies across them all--then do it again! Once released, HIVESWAP and <em>Hauntswitch</em> will be playable in either order. Haven’t read Homestuck? That’s fine! This game is set in 1994! Homestuck hasn’t even been invented yet!</p><br>

                                <p>Also see the <a href='http://hs.hiveswap.com/ezodiac/index.php'>Extended Zodiac</a>, an official personality quiz that assigns you a zodiac symbol based on your quiz answers and the Act 2 character preview <a href='http://hs.hiveswap.com/trollcall/'>Troll Call</a>, released as promotional material for the Hiveswap games.</p><br />

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
                                <p><em>14 September 2017 - Ongoing</em></p>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                          <tbody>
                            <tr>
                              <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/viz.gif" /></center>
                              </td>
                              <td width="2" bgcolor="#b9b8b9"></td>
                              <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://www.homestuck.com/" target="_blank">HOMESTUCK.COM</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="assets://archive/skaianet/www.gif" align="middle" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" bgcolor="#b9b8b9">
                                <center style="padding:15px;">
                                 <p>The current version of the MSPA website. More mobile-friendly, but with a number of issues. Hence this archive. Also has links to get official Homestuck merch.</p>
                                 <br />
                                 <p><a href='/news/4-03-18'>Site Announcement</a></p>
                                 <p><em>2 April 2018 - Present</em></p>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                        <tbody>
                          <tr>
                            <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/fs.gif" /></center>
                            </td>
                            <td width="2" bgcolor="#b9b8b9"></td>
                            <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://store.steampowered.com/app/833040/Hiveswap_Friendsim/" target="_blank">FRIENDSIM.EXE</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/exe.gif" align="middle" />
                                          </td>
                                          <td>
                                            <font size="6"><a href="http://hs.hiveswap.com/friendsim/" target="_blank">WWW</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/www.gif" align="middle" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                          <tr>
                            <td colspan="3" bgcolor="#b9b8b9">
                              <center style="padding:15px;">
                                <p>You just crash-landed on Alternia, and you’re <strong>DESPERATE</strong> for friendship! Anyone will do...wait, who are those two trolls approaching you?.</p><br>
                                <p>The Hiveswap Friendsim is a quick, loosely-canonical visual novel adventure following the efforts of the unnamed protagonist (that’s you!) to survive and maybe even thrive on the harsh surface of ALTERNIA. Set in the time of Hiveswap: Act 1, this episodic visual novel’s opening volume, written by Homestuck creator Andrew Hussie, is sure to satisfy Homestuck and Hiveswap fans who are eager for a darker stroll across the Alternian landscape.</p><br>

                                <p><em><a href="https://store.steampowered.com/app/833040/Hiveswap_Friendsim/">Description from Steam store page.</a></em></p>
                                <p><em>13 April 2018 - 14 December 2018</em></p>
                              </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                        <tbody>
                          <tr>
                            <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/epi.gif" /></center>
                            </td>
                            <td width="2" bgcolor="#b9b8b9"></td>
                            <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://www.homestuck.com/epilogues" target="_blank">EPILOGUES.TXT</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/txt.gif" align="middle" />
                                          </td>
                                          <td>
                                            <font size="6"><a href="https://www.viz.com/read/graphic-novel/homestuck-epilogues/product/6154" target="_blank">VIZ</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/book.gif" align="middle" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" bgcolor="#b9b8b9">
                                <center style="padding:15px;">
                                  <p>Tales of dubious authenticity.</p>
                                  <br>
                                  <p>Ten years ago, a young man stood in his bedroom. The events set in motion that day would change his and his friends' lives forever, for the better and the worse (and the ridiculous). Now, in the aftermath, he has to make a choice: Meat or Candy?</p>
                                  </br>
                                  <p><em><a href="https://www.viz.com/read/graphic-novel/homestuck-epilogues/product/6154">Description from VIZ Media.</a></em></p>
                                  <p><em>Online release: 13 - 20 April 2019</em></p>
                                  <p><em>VIZ Media print release: 14 January 2020</em></p>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                        <tbody>
                          <tr>
                            <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/pq.gif" /></center>
                            </td>
                              <td width="2" bgcolor="#b9b8b9"></td>
                              <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://store.steampowered.com/app/1144030/Pesterquest/" target="_blank">PESTERQUEST.EXE</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/exe.gif" align="middle" />
                                          </td>
                                          <td>
                                            <font size="6"><a href="http://whatpumpkin.com/" target="_blank">WWW</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/www.gif" align="middle" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" bgcolor="#b9b8b9">
                                <center style="padding:15px;">
                                  <p>Who are you again? And what the hell are you doing here? Wait… is this Earth, and who exactly is that kid over there? He looks nice! </p>
                                  <br>
                                  <p>Embark on a quest of epic importance in Pesterquest, a grimsical episodic visual novel set in the darkly funny Homestuck/Hiveswap universe created by American author and artist <strong>Andrew Hussie.</strong></p>
                                  <br>
                                  <p>Find all the answers you're looking for across 14 volumes of idiosyncratic adventure packed with visual mastery and shrewdly written narrative. As you zap between Earth and Alternia, you’ll discover and reconnect with up to 20 friends both extra and terrestrial.</p>
                                  <br>
                                  <p><em><a href="https://store.steampowered.com/app/1144030/Pesterquest/">Description from Steam store page.</a></em></p>
                                  <p><em>4 September 2019 - 1 April 2020</em></p>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br>
                        <table summary="" width="685px" cellpadding="0px" border="2" bgcolor="">
                        <tbody>
                          <tr>
                            <td width="74px" bgcolor="#b9b8b9">
                              <center><MediaEmbed url="archive/skaianet/hs2.gif" /></center>
                            </td>
                            <td width="2" bgcolor="#b9b8b9"></td>
                            <td height="64" bgcolor="#b9b8b9">
                                <center>
                                  <div style="width:550px; white-space:nowrap; height:px; overflow:hidden; font-size: 34px;word-wrap:none; background-color:;">
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <font size="6"><a href="https://www.homestuck2.com" target="_blank">HOMESTUCK^2.TXT</a></font>
                                          </td>
                                          <td>
                                            <MediaEmbed url="archive/skaianet/txt.gif" align="middle" />
                                          </td>
                                          <!-- <td>
                                            <font size="6"><a href="https://www.patreon.com/homestuck" target="_blank">$$$</a></font>
                                            </td>
                                            <td>
                                            <MediaEmbed url="archive/skaianet/www.gif" align="middle" />
                                            </td> -->
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </center>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" bgcolor="#b9b8b9">
                                <center style="padding:15px;">
                                  <p>This is not Homestuck. But it is not <em>not</em> Homestuck. This is...</p>
                                  <br>
                                  <h2>HOMESTUCK^2: BEYOND CANON</h2>
                                  <br>
                                  <p>Homestuck^2: Beyond Canon is an official continuation of the cult-classic webcomic Homestuck and a follow-up to The Homestuck Epilogues, dropped as a major event in April of 2019.</p>
                                  <p>Homestuck 2: Beyond Canon takes a combination of Andrew Hussie's original writing and plot outlines and concepts and joins him with a team of new, diverse voices to expand the compelling narratives of Homestuck's most (and least) beloved characters.</p>
                                  </br>
                                  <p>On an indefinite hiatus as of Feb 2021. You can see the announcement post <a href='https://homestuck.net/official/patreon/posts/future-approach-47431875/'>here</a></p>
                                  </br>
                                  <p><em><a href="https://www.patreon.com/homestuck">Description from the Homestuck Patreon.</a></em></p>
                                  <p><em>25 October 2019 - (HIATUS)</em></p>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </center>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td width="5px" bgcolor="#b9b8b9"></td>
          </tr>
          <tr>
            <td colspan="3" bgcolor="#b9b8b9">
              <center> © 1889-2029 Skaianet Systems Incorporated. All rights reserved. </center>
            </td>
          </tr>
        </tbody>
      </table>
  </center>
</section>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'skaianet',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed
  },
  title: () => "Skaianet Systems",
  data: function() {
    return {
      marqueeInterval: undefined,
      apophis: undefined,
      countDownDate: undefined,
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
      ]
    }
  },
  computed: {
  },
  methods: {
    setApophis() {
      // Get todays date and time
      let now = new Date().getTime()
      
      // Find the distance between now and the count down date
      let distance = this.countDownDate - now
      
      // Time calculations for days, hours, minutes and seconds
      let years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365))
      let days = Math.floor(distance / (1000 * 60 * 60 * 24)) - (years * 365)
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((distance % (1000 * 60)) / 1000)
      
      // Output the result in an element with class="Apophis"
      this.apophis = years + "y " + days + "d " + hours + "h " + minutes + "m " + seconds + "s "
      
      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(this.marqueeInterval)
        this.apophis = "EXPIRED"
      }
    },
    getFile(url) {
			return require('fs').readFileSync(this.$mspaFileStream(url), 'utf8')
		},
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
.pageBody {
  background: black;
  padding: 10px;
  padding-top:  0;
  font-family: 'Times New Roman', Times, serif;
  font-weight: normal;
  font-size: initial;
}

.navBanner {
  margin: 0 auto;
  margin-bottom: 10px;
  background-color: black;
}
img {
  display: block;
}

img.logo {
  width:70%;
}

.cursedHistoryText {
  white-space: pre-wrap;
  padding: 25px;
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

.marquee span {
  color:#fff;
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