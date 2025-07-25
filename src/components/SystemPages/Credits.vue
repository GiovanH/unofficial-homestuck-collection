<template>
  <GenericPage v-if="routeParams.mode == 'artcredits'">
    <Media url="images/logo.gif" class="logo"/>
    <div class="artCredits" >
      <div class="centeredProse prose">
        <h2>ART CREDITS</h2>

        After the first year of <a href="/mspa/6">Homestuck</a>, starting with <a href="/mspa/003701">this page</a>, MSPA began including contributions from other artists into the animations. The artists are credited here.

        <br><br>
        -------------------------------------------------------
        <br><br>

        <template v-for="(credit, ci) in artCredits">
          <div class="artCredit" :key="ci" v-if="!credit.pages.some(p => $pageIsSpoiler(p))">
            <template v-for="(page, pi) in credit.pages" >
              <span v-if="page === '-'" :key="`${pi}a`"> through </span>
              <template v-else>
                <StoryPageLink
                  :mspaId='page' credit
                  class="artCreditLink"
                  :key="`${pi}b`">
                </StoryPageLink>
              </template>

            </template>
            <span v-html="credit.desc"></span>
          </div>
        </template>

        <div class="artCredit" v-if="$pageIsSpoiler('010027')">
          Keep reading to unlock!
        </div>
      </div>
    </div>
  </GenericPage>
  <GenericCardPage v-else>
    <div class="card">
      <div class="creditDisambig">
        <div class="creditLinks">
          <div class="credit"><a href="/music/features"><Media url="/archive/collection/credits_sound.png" /><br>SOUND CREDITS</a></div>
          <div class="credit"><a href="/credits/artcredits"><Media url="/archive/collection/credits_art.png" /><br>ART CREDITS</a></div>
        </div>
      </div>
    </div>
        
    <div class="card">
      <div class="cardContent">
        <div class="archiveCredits cardBody">
          <div class="title center">
            <h1>The Unofficial Homestuck Collection</h1>
            <p>
              by Bambosh and GiovanH
            </p>
          </div>
          <h2>Archive credits:</h2>
          <dl>
            <template v-for="(credit, ci) in archiveCredits">
              <dt :key="`${ci}a`">
                <a v-if="credit.link" :href="credit.link">{{credit.name}}</a>
                <span v-else>{{credit.name}}</span>
              :</dt>
              <dd v-html="credit.desc" :key="`${ci}b`"></dd>
            </template>
          </dl>
          <h3>Additional thanks</h3>
          <ul class="thanks">
            <li>
              <a href="https://fontstruct.com/fontstructors/1639437/ducdat0507">ducdat0507</a> for 
              <a href="https://fontstruct.com/fontstructions/show/1880599/courierstuck">Courierstuck</a>
            </li>
            <li>
              <a href="https://github.com/benwiley4000">Ben Wiley</a> for 
              <a href="https://github.com/benwiley4000/gif-frames">gif-frames</a>
            </li>
          </ul>
          <hr />
          <h3>Legal</h3>
          <div class="legal prose">
  <pre>The Unofficial Homestuck Collection
  Copyright (C) 2025 GiovanH

  This program is free software: you can redistribute it and/or modify
  it under the terms of the <a href="https://www.gnu.org/licenses">GNU General Public License</a> as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  As per section 7, an additional requirement of this license is that all 
  attribution and crediting must be preserved. Modifications that remove 
  attribution or otherwise misrepresent the authorship or origin of material 
  are not permitted and violate the license conditions.
  </pre>
            <hr />
            <!-- <p> -->
              In (non legally-binding) summary, you may freely use and distribute the software, as well as modify it and distribute your changes and modified versions, so long as you do not restrict the rights of others to do the same. You must clearly notate any changes and provide links to the unmodified original, and not remove credits.
            <!-- </p> -->
          </div>
        </div>
      </div>
    </div>
  </GenericCardPage>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import GenericPage from '@/components/Template/GenericPage.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
import GenericCardPage from '@/components/Template/GenericCardPage.vue'

export default {
  name: 'credits',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, GenericPage, GenericCardPage, StoryPageLink
  },
  title(ctx) {
    return ctx.routeParams.mode == 'artcredits' ? "Art Credits" : "Credits"
  },
  data: function() {
    return {
      archiveCredits: [
        {
          name: "Bambosh",
          link: "https://twitter.com/Bamboshu",
          desc: `Howdy! I'm the original developer of this collection, which initially took form as a personal lockdown project during the depths of 2020. If you're curious about how everything fits together, check out its <a href="https://github.com/GiovanH/unofficial-homestuck-collection">GitHub page.</a> It's open source, so feel free to fork it off or suggest improvements!`
        },
        {
          name: "GiovanH",
          link: "https://im.giovanh.com/?ref=uhc",
          desc: `After the release of v1.0, Gio stepped forward with an offer to help design some new features - and ended up becoming the single most important contributor to this project. It isn't hyperbolic to say the collection would not exist as it does today without the unfathomable quantity of passion he has poured into it since. He currently maintains this project.`
        },
        {
          name: "Niklink",
          link: "https://github.com/Niklink",
          desc: `Helped write a bunch of text, and put together a bunch of the thumbnails that ended up being used for notifications and flash pages. Also helped source some obscure material and test changes during development.`
        },
        {
          name: "Quasar Nebula",
          link: "https://hsmusic.wiki/",
          desc: `For putting together the Homestuck Music Wiki, an absolutely phenomenal resource that I ripped the entire music database from. Check out the <a href="https://hsmusic.wiki/about/">wiki's credit page</a> to see just how many people it took to bring it to life! Their contributions have all had an effect on this collection.`
        },
        {
          name: "bgreco",
          link: "https://www.bgreco.net/hsflash.html",
          desc: `For providing the original inspiration for the high quality flash audio in this archive. I didn't end up using their edits for the most-part, but the implementation here was very much adapted from their own.`
        },
        {
          name: "Hadron",
          link: "https://hadronus.com",
          desc: "For creating the fantastic new animated logo."
        },
        {
          name: "sunsprite",
          link: "https://sunsprite.art/",
          desc: "For ironing out some difficult issues related to macOS."
        },
        {
          name: "SplitSuns",
          link: "https://twitter.com/splitsuns",
          desc: `For using their godlike audio magic powers to absolutely save my life during the process of editing the high quality flash audio.`
        },
        {
          name: "Grace Medley",
          link: "https://power464646.tumblr.com/",
          desc: `For stepping in to completely rework one of the less satisfactory HQ flash edits.`
        },
        {
          name: "wheals",
          link: "https://wheals.github.io",
          desc: `For archiving all the old social media accounts, that I proceeded to cram into this thing.`
        },
        {
          name: "MrCheeze",
          link: "https://mrcheeze.github.io/andrewhussie/",
          desc: `For archiving all the old Team Special Olympics comics, which again, I crammed right in here.`
        },
        {
          name: "Makin",
          link: "https://homestuck.net/",
          desc: `CSS for <a href="/tso/aids">And It Don't Stop</a>, as well as some backgrounds for <a href="/snaps">the Snapchat updates</a> and additional archival materials. Has also directly contributed some code for fullscreen mode!`
        },
        {
          name: "Anthony Bailey",
          link: "http://readmspa.org",
          desc: `For making the original offline Homestuck archive that sent me off down this rabbit hole to begin with!`
        },
        {
          name: "Leo60228",
          link: "https://vriska.dev",
          desc: "For correcting some technical issues and keeping data up-to-date. Thanks also for your work on the hsmusic wiki!"
        },
        {
          name: "Grafcube",
          link: "https://sakurajima.social/@grafcube",
          desc: "For leading the initial effort to produce a Flatpak build for linux users"
        },
        {
          name: "Our other GitHub contributors",
          link: "https://github.com/GiovanH/unofficial-homestuck-collection/graphs/contributors",
          desc: "Every single change you guys make leaves a lasting impact on this project. We wouldn't be here without you!"
        }
      ],
      artCredits: [
        {
          "pages": ["003701"],
          "desc": "Art contributions from <a href=\"http://www.firmanproductions.com/\" target=\"_blank\">Michael Firman</a>, <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>"
        },
        {
          "pages": ["003840"],
          "desc": `Art contributions from <a href="http://thebrainseed.com/brightleaf" target="_blank">Brett Muller</a>,  <a href="http://www.metroidhat.com" target="_blank">Eyes5</a>,  <a href="https://kararoasart.carrd.co/" target="_blank">Kara Roas</a>,  <a href="http://www.alexandra-douglass.com/" target="_blank">Lexxy</a>,  <a href="http://www.iwantyoutofeelthepressure.com/" target="_blank">Rebecca Harding</a>,  <a href="http://www.smokinghippo.com/" target="_blank">Nic Carey</a>,  <a href="http://abortedslunk.deviantart.com/" target="_blank">Paige Turner</a>,  <a href="http://www.notenoughink.com" target="_blank">Richard Gung</a>,  <a href="http://saffronscarf.deviantart.com/" target="_blank">SaffronScarf</a>,  <a href="http://viivus.tumblr.com/" target="_blank">Vivus</a>\n<br/><br/>\n<a href="/scraps2/LONGWAYSBUNP.jpg" target="_blank">BUN</a><a href="/scraps2/LONGWAYSBUNPizza.jpg" target="_blank">P</a><a href="/scraps2/LONGWAYSBUNP.jpg" target="_blank"> IT DOWN THE LINE</a>`
        },
        {
          "pages": ["004478"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://clorin-spats.deviantart.com/\" target=\"_blank\">clorinspats</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://irrisorie.webs.com/\" target=\"_blank\">FauxMonstur</a>,  <a href=\"https://kararoasart.carrd.co/\" target=\"_blank\">Kara Roas</a>,  <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>,  <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://www.bridgetbougan.com\" target=\"_blank\">myluckyseven</a>, <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>,  <a href=\"http://taviamorra.com\" target=\"_blank\">Tavia Morra</a>,  <a href=\"http://skepsisfox.deviantart.com/\" target=\"_blank\">SkepticArcher</a>,  <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>,  <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["004692"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"https://kararoasart.carrd.co/\" target=\"_blank\">Kara Roas</a>,  <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>,  <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["004748"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"https://kararoasart.carrd.co/\" target=\"_blank\">Kara Roas</a>,  <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>, <a href=\"http://skepsisfox.deviantart.com/\" target=\"_blank\">SkepticArcher</a>,   <a href=\"http://taviamorra.com\" target=\"_blank\">Tavia Morra</a>,  <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["004827"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>,  <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>, <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["004979"],
          "desc": "Art contributions from <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>,  <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://taviamorra.com\" target=\"_blank\">Tavia Morra</a>"
        },
        {
          "pages": ["004987"],
          "desc": "Art contributions from <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>"
        },
        {
          "pages": ["005221"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"https://kararoasart.carrd.co/\" target=\"_blank\">Kara Roas</a>,  <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>,  <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["005338"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"https://kararoasart.carrd.co/\" target=\"_blank\">Kara Roas</a>,  <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>,  <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["005420"],
          "desc": "Art contributions from <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>, <a href=\"http://skepsisfox.deviantart.com/\" target=\"_blank\">SkepticArcher</a>,   <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["005595"],
          "desc": "Art contributions from <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>,  <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["005596"],
          "desc": "Art contributions from <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>"
        },
        {
          "pages": ["005644"],
          "desc": "Art contributions from <a href=\"http://clorin-spats.deviantart.com/\" target=\"_blank\">clorinspats</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://www.bridgetbougan.com\" target=\"_blank\">myluckyseven</a>, <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://skepsisfox.deviantart.com/\" target=\"_blank\">SkepticArcher</a>,   <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>"
        },
        {
          "pages": ["005682"],
          "desc": "Some assets from gif images starting from this point by <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a> (<a href=\"/scraps2/jack_by_eyes.gif\" target=\"_blank\">Jack</a>), <a href=\"http://www.bridgetbougan.com\" target=\"_blank\">myluckyseven</a> (<a href=\"/scraps2/rose_by_myluckyseven.gif\" target=\"_blank\">Rose</a>), <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a> (<a href=\"/scraps2/jade_by_vivus.gif\" target=\"_blank\">Jade</a>)"
        },
        {
          "pages": ["005985"],
          "desc": "Art contributions from <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>, <a href=\"http://lazylaz.tumblr.com/\" target=\"_blank\">Laz</a>, "
        },
        {
          "pages": ["006009"],
          "desc": "Art contributions from <a href=\"http://thebrainseed.com\" target=\"_blank\">Brett Muller</a>,  <a href=\"http://www.metroidhat.com\" target=\"_blank\">Eyes5</a>, <a href=\"http://lazylaz.tumblr.com/\" target=\"_blank\">Laz</a>,   <a href=\"http://leppu.tumblr.com/\" target=\"_blank\">Leppu</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://www.iwantyoutofeelthepressure.com/\" target=\"_blank\">Rebecca Harding</a>,  <a href=\"http://www.bridgetbougan.com\" target=\"_blank\">myluckyseven</a>, <a href=\"http://www.smokinghippo.com/\" target=\"_blank\">Nic Carey</a>,  <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.notenoughink.com\" target=\"_blank\">Richard Gung</a>,  <a href=\"http://whaoanon.tumblr.com/\" target=\"_blank\">Shad</a>, <a href=\"http://skepsisfox.deviantart.com/\" target=\"_blank\">SkepticArcher</a>,  <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>, <a href=\"http://taviamorra.com\" target=\"_blank\">Tavia Morra</a>, <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>, <a href=\"http://xamag-homestuck.tumblr.com/\" target=\"_blank\">Xamag</a>"
        },
        {
          "pages": ["007163", "007208", "007298"],
          "desc": "Art contributions from <a href=\"http://merrigo.tumblr.com/\" target=\"_blank\">Amanda H</a>, <a href=\"http://chazzerpan.tumblr.com/\" target=\"_blank\">Chaz Canterbury</a>, <a href=\"http://www.alexandra-douglass.com/\" target=\"_blank\">Lexxy</a>, <a href=\"http://abortedslunk.deviantart.com/\" target=\"_blank\">Paige Turner</a>,  <a href=\"http://www.angryturtlegems.com/\" target=\"_blank\">Redshrike/Scarodactyl (Stephen Challener)</a>, <a href=\"http://saffronscarf.deviantart.com/\" target=\"_blank\">SaffronScarf</a>, <a href=\"http://luzerna.livejournal.com/\" target=\"_blank\">Sockpuppy</a>,  <a href=\"http://viivus.tumblr.com/\" target=\"_blank\">Vivus</a>, <a href=\"http://xamag-homestuck.tumblr.com/\" target=\"_blank\">Xamag</a>, <a href=\"http://mspaforums.com/member.php?1001240-Zerovirus\" target=\"_blank\">Zerovirus (Tanney Liu)</a>"
        },
        {
          "pages": ["007327"],
          "desc": "Art contributions from <a href=\"http://feastings.tumblr.com/\" target=\"_blank\">Feastings</a> (character sprites), <a href=\"http://www.angryturtlegems.com/\" target=\"_blank\">Stephen Challener (background sprites)</a>, <a href=\"http://duedlyfirearms.tumblr.com/\" target=\"_blank\">Shelby Cragg (last panel)</a>"
        },
        {
          "pages": ["008801"],
          "desc": "Art contributions from <a href=\"http://saffronscarf.tumblr.com/\" target=\"_blank\">Hanni Brosh</a>, <a href=\"http://www.eiffelart.ca/\" target=\"_blank\">Matt Cummings</a>, <a href=\"http://www.beyondthecanopy.com/\" target=\"_blank\">Jon Griffiths</a>, <a href=\"http://weavecomic.tumblr.com/\" target=\"_blank\">Rennie Kingsley</a>, <a href=\"http://www.paranatural.net/\" target=\"_blank\">Zack Morrison</a>, <a href=\"http://jnwiedle.tumblr.com/\" target=\"_blank\">J.N. Wiedle</a>"
        },
        {
          "pages": ["008961"],
          "desc": "By <a href=\"http://shelbycragg.tumblr.com/\" target=\"_blank\">Shelby Cragg</a>"
        },
        {
          "pages": ["009349"],
          "desc": "Art contributions from \n <a href=\"http://xamag-homestuck.tumblr.com/\" target=\"_blank\">Xamag</a>, <a href=\"http://paperseverywhere.tumblr.com/\" target=\"_blank\">Adrienne Garcia</a>, <a href=\"http://ikimaru.tumblr.com/\" target=\"_blank\">Ikimaru</a>, <a href=\"http://weavecomic.tumblr.com/\" target=\"_blank\">Rennie Kingsley</a>, <a href=\"http://jnwiedle.tumblr.com/\" target=\"_blank\">J.N. Wiedle</a>"
        },
        {
          "pages": ["009535"],
          "desc": "By <a href=\"http://rah-bop.com\" target=\"_blank\">Rah-Bop</a>"
        },
        {
          "pages": ["009828"],
          "desc": "By ipgd"
        },
        {
          "pages": ["009859"],
          "desc": "By <a href=\"http://paperseverywhere.tumblr.com/\" target=\"_blank\">Adrienne Garcia</a>, <a href=\"http://ikimaru.tumblr.com/\" target=\"_blank\">Ikimaru</a>, <a href=\"http://guzusuru.tumblr.com/\" target=\"_blank\">Guzusuru</a>, <a href=\"http://shelbycragg.tumblr.com/\" target=\"_blank\">Shelby Cragg</a>, <a href=\"http://rah-bop.com\" target=\"_blank\">Rah-Bop</a>"
        },
        {
          "pages": ["009861", '-', "009986"],
          "desc": "by Adrienne Garcia, Gina Chacon, Mallory Dyer"
        },
        {
          "pages": ["009987"],
          "desc": "By <a href=\"http://paperseverywhere.tumblr.com/\" target=\"_blank\">Adrienne Garcia</a>, <a href=\"http://tricksterair.tumblr.com/\" target=\"_blank\">Airin</a>, <a href=\"http://www.neo-kosmos.com/\" target=\"_blank\">Danny Cragg</a>, <a href=\"http://frozenmeatpopsicle.tumblr.com\" target=\"_blank\">Callan Bencich</a>, <a href=\"http://chazzerpan.tumblr.com/\" target=\"_blank\">Chaz</a>, <a href=\"http://guzusuru.tumblr.com/\" target=\"_blank\">Guzusuru</a>, <a href=\"http://honesk1.tumblr.com/\" target=\"_blank\">HONE</a>, <a href=\"http://www.beyondthecanopy.com/\" target=\"_blank\">Jonathan Griffiths</a>, <a href=\"http://www.josventi.com/\" target=\"_blank\">Jos Venti</a>, <a href=\"http://eiffelart.ca/\" target=\"_blank\">Matt Cummings</a>, <a href=\"http://poinko.tumblr.com/\" target=\"_blank\">Phil Gibson</a>, <a href=\"http://rah-bop.com\" target=\"_blank\">Rah-Bop</a>, <a href=\"http://clock-heart.tumblr.com/\" target=\"_blank\">Ri</a>, <a href=\"http://shelbycragg.tumblr.com/\" target=\"_blank\">Shelby Cragg</a>, <a href=\"http://tauhidbondia.com/\" target=\"_blank\">Tauhid Bondia</a>, <a href=\"https://temmie.carbonmade.com/\" target=\"_blank\">Temmie Chang</a>, <a href=\"http://toastyhat.tumblr.com/\" target=\"_blank\">Toastyhat</a>, <a href=\"http://cargocollective.com/viivus-draws\" target=\"_blank\">Vivian Ng</a>, <a href=\"http://xamag-homestuck.tumblr.com/\" target=\"_blank\">Xamag</a>"
        },
        {
          "pages": ["009989", "-", "010026"],
          "desc": "By Adrienne Garcia, Angela Sham, Gina Chacon, Rah-Bop"
        },
        {
          "pages": ["010027"],
          "desc": "By <a href=\"http://guzusuru.tumblr.com/\" target=\"_blank\">Angela Sham</a>, <a href=\"http://ani-r.tumblr.com/\" target=\"_blank\">Ani Roschier</a>, Jeffrey Lai"
        }
      ]
    }
  },
  computed: {
  },
  methods: {
  },
  updated() {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">

.legal {
  margin: 1em 0;
  pre {
    white-space: pre-wrap;
    opacity: 0.6; // Not obfuscation, just coloring >.>
  }
}

ul.thanks {
  margin-bottom: 1em;
  padding-left: 3em;
}

.prose {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: normal;
  font-size: 12px;
}
.centeredProse {
  width: 480px;
  text-align: center;
  margin: 0 auto;
  // font-family: Verdana, Geneva, Tahoma, sans-serif;
  // font-weight: normal;
  // font-size: 12px;
}
.creditDisambig {
  padding: 25px 0;
  .creditLinks {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    margin: 0 auto;
    width: 600px;
    
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 20px;

    .credit {
      margin-bottom: 20px;
      text-align: center;
      line-height: 1.1;

      img{
        display: block;
      }
    }
  }
}
.artCredits {
  width: 650px;

  h2 {
    font-weight: bold;
    font-family: courier, monospace;
    font-size: 32px;
  }
  .artCreditLink {
    display: block;
  }
  .artCredit {
    margin-bottom: 2em;
  }
}
.archiveCredits {
  dt {
    font-weight: normal;
  }
    
  .title {
    width: 600px;
    margin: 0 auto;
    padding-bottom: 1em;
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
</style>
