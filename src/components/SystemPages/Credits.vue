<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <Media url="images/logo.gif" class="logo"/>
        <div v-if="routeParams.mode == 'artcredits'" class="credits artCredits" >
          <div class="center">
            <h2>ART CREDITS</h2>

            After the first year of <a href="/mspa/6">Homestuck</a>, starting with <a href="/mspa/003701">this page</a>, I began including contributions from other artists into the animations. The artists are credited here. 


            <br><br>
            -------------------------------------------------------
            <br><br>
            
            <span v-if="!$pageIsSpoiler('003701')">
              <a href="/mspa/003701">Page {{$mspaOrVizNumber('003701')}}</a> - <b>[S] WV?: Rise up.</b> <br>
              Art contributions from <a href="http://www.firmanproductions.com/" target="_blank">Michael Firman</a>, <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('003840')">
              <a href="/mspa/003840">Page {{$mspaOrVizNumber('003840')}}</a> - <b>[S] Descend.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com/brightleaf" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>, 
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br>
              <a href="/scraps2/LONGWAYSBUNP.jpg" target="_blank">BUN</a><a href="/scraps2/LONGWAYSBUNPizza.jpg" target="_blank">P</a><a href="/scraps2/LONGWAYSBUNP.jpg" target="_blank"> IT DOWN THE LINE</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('004478')">
              <a href="/mspa/004478">Page {{$mspaOrVizNumber('004478')}}</a> - <b>[S] Make her pay.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://clorin-spats.deviantart.com/" target="_blank">clorinspats</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://irrisorie.webs.com/" target="_blank">FauxMonstur</a>, 
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.bridgetbougan.com" target="_blank">myluckyseven</a>,
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://taviamorra.com" target="_blank">Tavia Morra</a>, 
              <a href="http://skepsisfox.deviantart.com/" target="_blank">SkepticArcher</a>, 
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>, 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('004692')">
              <a href="/mspa/004692">Page {{$mspaOrVizNumber('004692')}}</a> - <b>[S] Past Karkat: Wake up.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>
            
            <span v-if="!$pageIsSpoiler('004748')">
              <a href="/mspa/004748">Page {{$mspaOrVizNumber('004748')}}</a> - <b>[S] Jade: Wake up. </b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>,
              <a href="http://skepsisfox.deviantart.com/" target="_blank">SkepticArcher</a>,  
              <a href="http://taviamorra.com" target="_blank">Tavia Morra</a>, 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('004827')">
              <a href="/mspa/004827">Page {{$mspaOrVizNumber('004827')}}</a> - <b>[S] Jade: Enter. </b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>,
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>
            
              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('004979')">
              <a href="/mspa/004979">Page {{$mspaOrVizNumber('004979')}}</a> - <b>[S] John: Enter village.</b> <br>
              Art contributions from 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>, 
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://taviamorra.com" target="_blank">Tavia Morra</a>
              
              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('004987')">
              <a href="/mspa/004987">Page {{$mspaOrVizNumber('004987')}}</a> - <b>[S] JOHN. RISE UP.</b> <br>
              Art contributions from <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005221')">
              <a href="/mspa/005221">Page {{$mspaOrVizNumber('005221')}}</a> - <b>[S] Kanaya: Return to the core.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005338')">
              <a href="/mspa/005338">Page {{$mspaOrVizNumber('005338')}}</a> - <b>[S] Equius: Seek the highb100d.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://rutares.deviantart.com/" target="_blank">Jessica Allison</a>, 
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005420')">
              <a href="/mspa/005420">Page {{$mspaOrVizNumber('005420')}}</a> - <b>[S] 3x SHOWDOWN COMBO.</b> <br>
              Art contributions from 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>,
              <a href="http://skepsisfox.deviantart.com/" target="_blank">SkepticArcher</a>,  
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005595')">
              <a href="/mspa/005595">Page {{$mspaOrVizNumber('005595')}}</a> - <b>[S] Seer: Descend.</b> <br>
              Art contributions from 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>, 
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005596')">
            <a href="/mspa/005596">Page {{$mspaOrVizNumber('005596')}}</a> - <b>[S] ==&gt;</b> <br>
            Art contributions from 
            <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>

            <br><br><br>
            </span>


            <span v-if="!$pageIsSpoiler('005644')">
              <a href="/mspa/005644">Page {{$mspaOrVizNumber('005644')}}</a> - <b>[S] Seer: Ascend.</b> <br>
              Art contributions from 
              <a href="http://clorin-spats.deviantart.com/" target="_blank">clorinspats</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.bridgetbougan.com" target="_blank">myluckyseven</a>,
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://skepsisfox.deviantart.com/" target="_blank">SkepticArcher</a>,  
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>

              <br><br><br>
            </span>


            <span v-if="!$pageIsSpoiler('005682')">
              Some assets from gif images starting from <a href="/mspa/005682" target="_blank">{{$mspaOrVizNumber('005682')}}</a>, by <a href="http://www.metroidhat.com" target="_blank">Eyes5</a> (<a href="/scraps2/jack_by_eyes.gif" target="_blank">Jack</a>), <a href="http://www.bridgetbougan.com" target="_blank">myluckyseven</a> (<a href="/scraps2/rose_by_myluckyseven.gif" target="_blank">Rose</a>), <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a> (<a href="/scraps2/jade_by_vivus.gif" target="_blank">Jade</a>)

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('005985')">
              <a href="/mspa/005985">Page {{$mspaOrVizNumber('005985')}}</a> - <b>[S] Attempt rare and highly dangerous 5x SHOWDOWN COMBO.</b> <br>
              Art contributions from 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>, <a href="http://lazylaz.tumblr.com/" target="_blank">Laz</a>, 

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('006009')">
              <a href="/mspa/006009">Page {{$mspaOrVizNumber('006009')}}</a> - <b>[S] Cascade.</b> <br>
              Art contributions from 
              <a href="http://thebrainseed.com" target="_blank">Brett Muller</a>, 
              <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,
              <a href="http://lazylaz.tumblr.com/" target="_blank">Laz</a>,  
              <a href="http://leppu.tumblr.com/" target="_blank">Leppu</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">M Thomas Harding</a>, 
              <a href="http://www.bridgetbougan.com" target="_blank">myluckyseven</a>,
              <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>, 
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>, 
              <a href="http://whaoanon.tumblr.com/" target="_blank">Shad</a>,
              <a href="http://skepsisfox.deviantart.com/" target="_blank">SkepticArcher</a>, 
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>,
              <a href="http://taviamorra.com" target="_blank">Tavia Morra</a>,
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>,
              <a href="http://xamag-homestuck.tumblr.com/" target="_blank">Xamag</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('007163')">
              <a href="/mspa/007163">Page {{$mspaOrVizNumber('007163')}}</a> - <b>[S] ACT 6 INTERMISSION 3</b>, <br>
              <span v-show="!$pageIsSpoiler('007208')"><a href="/mspa/007208">Page {{$mspaOrVizNumber('007208')}}</a> - <b>[S][A6I3] ==&gt;</b> <br></span>
              <span v-show="!$pageIsSpoiler('007298')"><a href="/mspa/007298">Page {{$mspaOrVizNumber('007298')}}</a> - <b>[S][A6I3] ==&gt;</b> <br></span>
              Art contributions from 
              <a href="http://merrigo.tumblr.com/" target="_blank">Amanda H</a>,
              <a href="http://chazzerpan.tumblr.com/" target="_blank">Chaz Canterbury</a>,
              <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,
              <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>, 
              <a href="http://www.angryturtlegems.com/" target="_blank">Redshrike/Scarodactyl (Stephen Challener)</a>,
              <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>,
              <a href="http://luzerna.livejournal.com/" target="_blank">Sockpuppy</a>, 
              <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>,
              <a href="http://xamag-homestuck.tumblr.com/" target="_blank">Xamag</a>,
              <a href="http://mspaforums.com/member.php?1001240-Zerovirus" target="_blank">Zerovirus (Tanney Liu)</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('007327')">
              <a href="/mspa/007327">Page {{$mspaOrVizNumber('007327')}}</a> - <b>[S][A6I3] MINISTRIFE!!!</b> <br>
              Art contributions from 
              <a href="http://feastings.tumblr.com/" target="_blank">Feastings</a> (character sprites),
              <a href="http://www.angryturtlegems.com/" target="_blank">Stephen Challener (background sprites)</a>,
              <a href="http://duedlyfirearms.tumblr.com/" target="_blank">Shelby Cragg (last panel)</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('008801')">
              <a href="/mspa/008801">Page {{$mspaOrVizNumber('008801')}}</a> - <b>[S] GAME OVER.</b> <br>
              Art contributions from 
              <a href="http://saffronscarf.tumblr.com/" target="_blank">Hanni Brosh</a>,
              <a href="http://www.eiffelart.ca/" target="_blank">Matt Cummings</a>,
              <a href="http://www.beyondthecanopy.com/" target="_blank">Jon Griffiths</a>,
              <a href="http://weavecomic.tumblr.com/" target="_blank">Rennie Kingsley</a>,
              <a href="http://www.paranatural.net/" target="_blank">Zack Morrison</a>,
              <a href="http://jnwiedle.tumblr.com/" target="_blank">J.N. Wiedle</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('008961')">
              <a href="/mspa/008961">Page {{$mspaOrVizNumber('008961')}}+</a> - <b>Calliope's art</b> <br>
              By
              <a href="http://shelbycragg.tumblr.com/" target="_blank">Shelby Cragg</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('009349')">
              <a href="/mspa/009349">Page {{$mspaOrVizNumber('009349')}}</a> - <b>[S] ACT 6 ACT 6 INTERMISSION 5</b> <br>
              Art contributions from 

              <a href="http://xamag-homestuck.tumblr.com/" target="_blank">Xamag</a>,
              <a href="http://paperseverywhere.tumblr.com/" target="_blank">Adrienne Garcia</a>,
              <a href="http://ikimaru.tumblr.com/" target="_blank">Ikimaru</a>,
              <a href="http://weavecomic.tumblr.com/" target="_blank">Rennie Kingsley</a>,
              <a href="http://jnwiedle.tumblr.com/" target="_blank">J.N. Wiedle</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('009535')">
              <a href="/mspa/009535">Page {{$mspaOrVizNumber('009535')}}</a> - <b>Echidna</b> <br>
              By
              <a href="http://rah-bop.com" target="_blank">Rah-Bop</a>

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('009828')">
              <a href="/mspa/009828">Page {{$mspaOrVizNumber('009828')}}</a> - <b>Hug Bump</b> <br>
              By ipgd

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('009859')">
              <a href="/mspa/009859">Page {{$mspaOrVizNumber('009859')}}</a> - <b>[S] Terezi: Remem8er. </b> <br>
              By
              <a href="http://paperseverywhere.tumblr.com/" target="_blank">Adrienne Garcia</a>,
              <a href="http://ikimaru.tumblr.com/" target="_blank">Ikimaru</a>,
              <a href="http://guzusuru.tumblr.com/" target="_blank">Guzusuru</a>,
              <a href="http://shelbycragg.tumblr.com/" target="_blank">Shelby Cragg</a>,
              <a href="http://rah-bop.com" target="_blank">Rah-Bop</a>

              <br><br><br>
            </span>


            <span v-if="!$pageIsSpoiler('009861')">
              Page <a href="/mspa/009861">{{$mspaOrVizNumber('009861')}}</a> to <a href="/mspa/009986">{{$mspaOrVizNumber('009986')}}</a> <br>
              By Adrienne Garcia, Gina Chacon, Mallory Dyer

              <br><br><br>
            </span>

            <span v-if="!$pageIsSpoiler('009987')">
              <a href="/mspa/009987">Page {{$mspaOrVizNumber('009987')}}</a> - <b>[S] Collide. </b> <br>
              By
              <a href="http://paperseverywhere.tumblr.com/" target="_blank">Adrienne Garcia</a>,
              <a href="http://tricksterair.tumblr.com/" target="_blank">Airin</a>,
              <a href="http://www.neo-kosmos.com/" target="_blank">Danny Cragg</a>,
              <a href="http://frozenmeatpopsicle.tumblr.com" target="_blank">Callan Bencich</a>,
              <a href="http://chazzerpan.tumblr.com/" target="_blank">Chaz</a>,
              <a href="http://guzusuru.tumblr.com/" target="_blank">Guzusuru</a>,
              <a href="http://honesk1.tumblr.com/" target="_blank">HONE</a>,
              <a href="http://www.beyondthecanopy.com/" target="_blank">Jonathan Griffiths</a>,
              <a href="http://www.josventi.com/" target="_blank">Jos Venti</a>,
              <a href="http://eiffelart.ca/" target="_blank">Matt Cummings</a>,
              <a href="http://poinko.tumblr.com/" target="_blank">Phil Gibson</a>,
              <a href="http://rah-bop.com" target="_blank">Rah-Bop</a>,
              <a href="http://clock-heart.tumblr.com/" target="_blank">Ri</a>,
              <a href="http://shelbycragg.tumblr.com/" target="_blank">Shelby Cragg</a>,
              <a href="http://tauhidbondia.com/" target="_blank">Tauhid Bondia</a>,
              <a href="https://temmie.carbonmade.com/" target="_blank">Temmie Chang</a>,
              <a href="http://toastyhat.tumblr.com/" target="_blank">Toastyhat</a>,
              <a href="http://cargocollective.com/viivus-draws" target="_blank">Vivian Ng</a>,
              <a href="http://xamag-homestuck.tumblr.com/" target="_blank">Xamag</a> 

              <br><br><br>
            </span>


            <span v-if="!$pageIsSpoiler('009989')">
              Page <a href="/mspa/009989">{{$mspaOrVizNumber('009989')}}</a> to <a href="/mspa/010026">{{$mspaOrVizNumber('010026')}}</a> <br>
              By Adrienne Garcia, Angela Sham, Gina Chacon, Rah-Bop

              <br><br><br>
            </span>


            <span v-if="!$pageIsSpoiler('010027')">
              <a href="/mspa/010027">Page {{$mspaOrVizNumber('010027')}}</a> - <b>[S] ACT 7 </b> <br>
              By <a href="http://guzusuru.tumblr.com/" target="_blank">Angela Sham</a>,
              <a href="http://ani-r.tumblr.com/" target="_blank">Ani Roschier</a>,
              Jeffrey Lai

              <br><br><br>
            </span>

            <span v-if="$pageIsSpoiler('010027')">
              Keep reading to unlock!

              <br><br><br>
            </span>
          </div>
        </div>
        <div v-else class="credits noCredits">
          <div class="creditLinks">
            <div class="credit"><a href="/music/features"><Media url="/archive/collection/credits_sound.png" /><br>SOUND CREDITS</a></div>
            <div class="credit"><a href="/credits/artcredits"><Media url="/archive/collection/credits_art.png" /><br>ART CREDITS</a></div>
          </div>

          <div class="archiveCredits">
            <h2>Archive credits:</h2>
            <dl>
              <dt>Bambosh:</dt><dd>Howdy! This archive is a project I've been itching to make since 2016, but was forced to gestate while I figured out exactly how I was going to go about it. I started work proper at the beginning of 2020, and you're finally looking at the end result! If you're an experienced developer who feels like having chuckle, check out the <a href="https://github.com/Bambosh/unofficial-homestuck-collection">source code.</a> It's all open source, so feel free to fork it off or suggest improvements! God knows it probably needs some.</dd>
              <dt>Niklink:</dt><dd>Helped write a bunch of text, and put together a bunch of the thumbnails that ended up being used for notifications and flash pages.</dd>
              <dt><a href="https://hsmusic.github.io/">Florrie</a>:</dt><dd>For putting together the Homestuck Music Wiki, an absolutely phenomenal resource that I ripped the entire music database from. Check out the <a href="https://hsmusic.github.io/about/index.html">wiki's credit page</a> to see just how many people it took to bring it to life! Their contributions have all had an effect on this collection.</dd>
              <dt><a href="https://www.bgreco.net/hsflash.html">bgreco</a>:</dt><dd>For providing the original inspiration for the high quality flash audio in this archive. I didn't end up using their edits for the most-part, but the implementation here was very much adapted from their own.</dd>
              <dt><a href="https://twitter.com/splitsuns">SplitSuns</a>:</dt><dd>For using their godlike audio magic powers to absolutely save my life during the process of editing the high quality flash audio.</dd>
              <dt><a href="https://wheals.github.io">Wheals</a>:</dt><dd>For archiving all the old social media accounts, that I proceeded to cram into this thing.</dd>
              <dt><a href="https://mrcheeze.github.io/andrewhussie/">MrCheeze</a>:</dt><dd>For archiving all the old Team Special Olympics comics, which again, I crammed right in here.</dd>
              <dt><a href="https://homestuck.net/">Makin</a>:</dt><dd>Whose CSS I blatantly stole for <a href="/tso/aids">And It Don't Stop</a>. Some of the backgrounds from their Snapchat archive made their way in too.</dd>
              <dt><a href="http://readmspa.org">Anthony Bailey</a>:</dt><dd>For making the original offline Homestuck archive that sent me off down this rabbit hole to begin with!</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

export default {
  name: 'credits',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, PageFooter
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  },
  updated() {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }
    a {
      color: var(--page-links);
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      justify-content: center;

      .pageContent {
        background: var(--page-pageContent);
        
        max-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          margin-bottom: 25px;
        }
        .artCredits {
          width: 650px;

          h2 {
            font-weight: bold; 
            font-family: courier, monospace;
            font-size: 32px;
          }
          .center {
            width: 480px;
            text-align: center;
            margin: 0 auto;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-weight: normal;
            font-size: 12px;
          }
        }
        .noCredits {
          width: 650px;
          .creditLinks {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-around;
            margin: 0 auto;
            width: 600px;

            .credit {
              margin-bottom: 20px;
              text-align: center;
              line-height: 1.1;
              font-size: 18px;

              img{
                display: block;
              }         
            }
          }
          .archiveCredits {
            width: 600px;
            margin: 0 auto;
            h2 {
             text-align: center;
            }
            dl {
              dt {
                margin-top: 15px;
              }
            }
          }
        }

      }	
    }
  }
  .retro {
    .pageContent {
      background: #EEEEEE !important;
    }
    .credits {
      background: white;
    }
  } 

</style>

