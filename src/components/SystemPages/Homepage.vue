<template>
  <div class="pageBody customStyles homepage">
    <NavBanner useCustomStyles="true" />
    <div class="card logoCard">
      <a href="/" class="cardContent">
        <Logo />
      </a>
      <div class="cardContent collection">
        <!-- <div class="links">
          <a href="/help" >New readers</a> | <a href="/userguide" >How to navigate the collection</a> | <a href="/settings" >Settings</a>
        </div> -->
        <p class="versionNotice" v-if="$archive.version != $data.$expectedAssetVersion">
          This release of The Unofficial Homestuck Collection is tuned around <strong>v{{$data.$expectedAssetVersion}}</strong> of the asset pack, but it looks like you're currently on <strong>v{{$archive.version}}</strong>.<br><br>
          Things <em>may</em> still work, but you should probably update<br />
          to asset pack <strong>v{{$data.$expectedAssetVersion}}</strong> as soon as possible.
        </p>
      </div>
    </div>
    <div class="card tight hsCard">
      <!-- <Media url="/archive/collection/hs_logo.png" class="logo hsLogo cardContent" /> -->
      <div class="cardContent cardEntry">
        <div class="icon">
          <a href="/mspa/6" ><Media url="/images/archive_hs.gif" /></a>
          <img src="assets://archive/collection/a6a6_latestpages.png" class="a6a6graffiti" style="left: 34px; top: 74px;" v-if="$root.tabTheme.rendered === 'A6A6'" >
          <p class="date">Apr 2009 - Apr 2016</p>
          <p class="date">8,130 pages</p>
        </div>
        <div class="description">
          <p><em>A story about some kids who are friends over the internet. They decide to play a game together. There are major consequences.</em></p><br>
          <p>The fourth, final, and most famous of the MS Paint Adventures. While it began as a "mock-game" following reader commands like the previous adventures, they were phased out as the story unfolded into a mixed-media barrage of mid-2000's internet culture satire, interpersonal drama, and Weird Plot Shit [sic].</p></br>
          <p>One-upping Problem Sleuth's action-packed GIFs, Homestuck spiced up pivotal moments with Flash animations scored by a lively team of composers. Over time, the music team produced dozens of albums across a variety of genres.</p>
          <div class="links">
            <div class="left bigLink">
              &gt; <a href="/mspa/6" >Begin Homestuck</a>
            </div>
            <div class="center">
              &gt; <a href="/log/6" >Adventure Log</a><br>
              &gt; <a href="/map/6" >Adventure Map</a>
            </div>
            <div class="right">
              &gt; <a href='/decode'>Decoding Tools</a><br>
              &gt; <a href="/credits" >Credits</a>
            </div>
          </div>
        </div>
      </div>
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/mspa/5" 
          thumbsrc="/archive/collection/archive_beta.png"
          date="Apr 2009">
          <template v-slot:title>Homestuck BETA</template>
          <p>Homestuck was initially intended to be made exclusively in Flash. It lasted about three days.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/music"
          thumbsrc="/archive/collection/archive_music.png"
          date="Aug 2009 - Apr 2020">
          <template v-slot:title>Music</template>
          <p>Explore the entire discography of official Homestuck music.</p>
        </HomeRowItem>
        <img src="assets://archive/collection/a6a6_sponsors.png" class="a6a6graffiti" style="left: 563px; top: 280px;" v-if="$root.tabTheme.rendered === 'A6A6'" >
        <HomeRowItem
          class="rowItem"
          href="/sbahj"
          thumbsrc="/archive/collection/archive_sbahj.png"
          date="Mar 2009 - Nov 2017">
          <template v-slot:title>Sweet Bro & Hella Jeff</template>
          <p class="comicsans">it keeps happening</p>
          <p>&gt; <a href="assets://archive/forum/SBaHJ Origins.html">The origin story.</a></p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/dstrider"
          thumbsrc="/archive/collection/archive_dstrider.png"
          afterpage="003053"
          date="Jan 2010 - Mar 2010">
          <template v-slot:title>The Blog of Dave Strider</template>
          <p>There's this really cool dude, ok? He ran a blog for a while. That's really all there is to say on the matter.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/squiddles"
          thumbsrc="/archive/collection/archive_squiddles.png"
          afterpage="004432"
          date="Aug 2010">
          <template v-slot:title>Squiddles! Sing-Along</template>
          <p>The Squiddles! Sing-Along album came with a flash animation produced by the art and music teams. <a href="/news/8-26-10">Incredibly silly.</a></p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/namcohigh"
          thumbsrc="/archive/collection/archive_namcohigh.png"
          afterpage="008135"
          date="Dec 2013 -  Jul 2014">
          <template v-slot:title>Namco High</template>
          <p>Date famous Namco characters in this baffling crossover directed by Andrew Hussie. Features Homestuck cameos?</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/pxs"
          thumbsrc="/archive/collection/archive_pxs.png"
          afterpage="008753"
          date="Apr 2014 - Mar 2016">
          <template v-slot:title>Paradox Space</template>
          <p>Tales from the depths of canon.</p>
          <p>Short-form stories written by community figures.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/snaps"
          thumbsrc="/archive/collection/archive_snaps.png"
          afterpage="010030"
          date="Oct 2016 - Aug 2017">
          <template v-slot:title>Snapchat</template>
          <p>Snapshots of life on Earth C. No longer canon as of The Epilogues.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/skaianet"
          thumbsrc="/archive/collection/archive_skaianet.png"
          afterpage="010030"
          date="Jan 2019">
          <template v-slot:title>Skaianet Systems</template>
          <p>Tomorrow's canon, today! Homestuck still has plenty in store for you.</p>
        </HomeRowItem>
        <HomeRowItem
          v-if="$archive.extras.epilogues"
          class="rowItem"
          href="/epilogues"
          thumbsrc="assets://archive/epilogues/resources/archive_ep.gif"
          afterpage="010030"
          date="Apr 2019">
          <template v-slot:title>The Homestuck Epilogues</template>
          <p>Ten years after their adventure began, the heroes are enjoying a well-earned retirement on Earth C. But John still has one last choice to make.</p>
        </HomeRowItem>
      </div>
    </div>
    
    <div class="card mspaCard">
      <Media url="/archive/collection/mspa_logo_dark.png" class="logo mspaLogo cardContent" />
      <div class="cardContent mainSection">
        <div class="cardContent cardEntry jbCard">
          <div class="icon">
            <a href="/mspa/1" ><Media url="/images/archive_jb.gif" /></a>
            <p class="date">Sep 2006 - Feb 2007</p>
            <p class="date">134 pages</p>
          </div>
          <div class="description">
            <h2><a href="/mspa/1" >Jailbreak</a></h2>
            <p><em href="/mspa/1">A guy tries to escape from prison.</em></p><br>
            <p>The very first MS Paint Adventure. Andrew Hussie ran it as a game on his personal forum, with a rule that forced him to follow the first command suggested after each post. This resulted in barely controlled chaos.</p><br>
            <p>Jailbreak was the origin point of several long running jokes that would later return in Homestuck.</p>
            <div class="links">
              > <a href="/log/1" >Adventure Log</a>
            </div>
          </div>
        </div>
        <div class="cardContent cardEntry bqCard">
          <div class="icon">
            <a href="/mspa/2" ><Media url="/images/archive_bq.gif" /></a>
            <p class="date">Jun - Jul 2007</p>
            <p class="date">47 pages</p>
          </div>
          <div class="description">
            <h2><a href="/mspa/2" >Bard Quest</a></h2>
            <p><em>A young bard's endeavor to slay some dragons. Branching "choose your own adventure" style.</em></p><br>
            <p>The second MS Paint Adventure. The branching paths were an experiement that ultimately proved too complex to manage, dooming it to an early cancellation.</p>
            <div class="links">
              > <a href="/log/2" >Adventure Log</a>
            </div>
          </div>
        </div>
        <div class="cardContent cardEntry psCard">
          <div class="icon">
            <a href="/mspa/4" ><Media url="/images/archive_ps.gif" /></a>
            <p class="date">Mar 2008 - Apr 2009</p>
            <p class="date">1,674 pages</p>
          </div>
          <div class="description">
            <h2><a href="/mspa/4" >Problem Sleuth</a></h2>
            <p><em>An adventure about a hard boiled detective in his office.</em></p><br>
            <p>The third MS Paint Adventure. An absurd pastiche of adventure games and JRPG mechanics, all involving absolutely no detective work whatsoever.</p><br>
            <p> With its rampant escalation of chaos and the gradual inclusion of strikingly animated GIFs, Problem Sleuth proved to be MSPA's first major hit.</p>
            <div class="links">
              <div class="left">
                &gt; <a href="/unlock/PS_titlescreen" >Title screen</a>
              </div>
              <div class="center">
                &gt; <a href="/log/4" >Adventure Log</a><br>
              </div>
              <div class="right">
                &gt; <a href="/map/4" v-if="!$pageIsSpoiler('001840')">Adventure Map</a><a disabled v-else>??????</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/unlock" 
          thumbsrc="/archive/collection/archive_unlocks.png"
          :aftertimestamp="1226966400">
          <template v-slot:title>Unlockable Content</template>
          <p>Fan-requested commands drawn for fans who made donations. But Andrew is no longer doing them. Sorry!</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/faqs/science" 
          thumbsrc="/archive/collection/archive_science.png"
          :aftertimestamp="1236384000">
          <template v-slot:title>Science FAQ</template>
          <p>An explanation of some of the science works in Problem Sleuth. Is physics real? Sorta!</p>
        </HomeRowItem>
      </div>
    </div>

    <div class="card tsoCard">
      <Media url="/archive/collection/tso_logo.png" class="logo tsoLogo cardContent" />
      <div class="cardContent cardEntry tsoCard">
        <div class="icon">
          <a href="/tso" ><Media url="/archive/collection/archive_tso.png" /></a>
          <p class="date">??? - Aug 2008</p>
        </div>
        <div class="description">
          <h2><a href="/tso" >Old comics</a></h2>
          <p>Before MSPA, Hussie used to maintain a webcomic site, the most important comics of which can be found here. Some weren't <em>technically</em> part of Team Special Olympics, but that doesn't really matter.</p><br>
          <p>Below, you can find a handful of old blog posts and forum threads from around the same time period. Several long-running jokes (such as references to Olive Garden and the Saw franchise) originated here.</p>
        </div>
      </div>
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/offeryoucantrefuse"
          thumbsrc="/archive/collection/archive_offeryoucantrefuse.png"
          date="Jun 2006">
          <template v-slot:title>An Offer You Can't Refuse</template>
          <p>Answer one simple question for a FREE* Dinner for Two at Olive Garden®!</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/magicaljourney"
          thumbsrc="/archive/collection/archive_magicaljourney.png"
          date="Nov 2007">
          <template v-slot:title>Come With Me on a Magical Journey Through the Internet!</template>
          <p>Diving deep into Olive Garden®'s hole.</p>
        </HomeRowItem>

        <HomeRowItem
          class="rowItem cheerfulbear"
          href="assets://archive/forum/Cheerfulbear - PLAY ME.html"
          thumbsrc="/archive/collection/archive_cheerfulbear.png"
          date="Jan 2008">
          <template v-slot:title>Cheerfulbear - PLAY ME</template>
          <p>HELLO CHEERFULBEAR I WOULD LIKE TO PLAY A GAME HELLO CHEERFULBEAR I WOULD</p>
        </HomeRowItem>

        <HomeRowItem
          class="rowItem"
          href="assets://archive/forum/Dear Andrew.html"
          thumbsrc="/archive/collection/archive_suckoff.png"
          date="Jun 2008 - May 2009">
          <template v-slot:title>The Man-On-Man Suckoff Challenge</template>
          <p>Gaze deep into the uncanny valley.</p>
        </HomeRowItem>

        <!-- <HomeRowItem
          class="rowItem"
          href="assets://archive/wizardyherbert/"
          thumbsrc="/archive/collection/archive_wh.png"
          date="Jul 2008">
          <template v-slot:title>Wizardy Herbert</template>
          <p>An unfinished book draft. Last revised July 2008, leaked Dec 2012 when Andrew stored it unsecured on an open directory.</p>
        </HomeRowItem> -->
        <HomeRowItem
          class="rowItem"
          href="/wizardyherbert/"
          thumbsrc="/archive/collection/archive_wh.png"
          date="Jul 2008">
          <template v-slot:title>Wizardy Herbert</template>
          <p>An unfinished book draft. Last revised July 2008, leaked Dec 2012 when Andrew stored it unsecured on an open directory.</p>
        </HomeRowItem>

      </div>
    </div>

    <div class="card newsCard">
      <div class="logo newsLogo cardContent">
        <Media url="assets://archive/collection/news_logo.png" />
        <img src="assets://archive/collection/a6a6_news.png" class="a6a6graffiti"  v-if="$root.tabTheme.rendered === 'A6A6'" >
      </div>
      <div class="cardContent">
        <div class="description">
          <p>Throughout the run of MSPA, Andrew Hussie used various means of communicating with fans. The "news blurb" lasted the full run of the site, while others ran at different times.</p>
        </div>
      </div>
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/news"
          thumbsrc="/archive/collection/archive_news.png"
          date="Jun 2007 - Apr 2018">
          <template v-slot:title>MSPA Newsposts</template>
          <p>An archive of official newsposts, ranging the entire lifespan of the MSPA website.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/blogspot"
          thumbsrc="/archive/collection/archive_blogspot.png"
          afterpage="002821"
          date="Dec 2008 - Jul 2010">
          <template v-slot:title>Blogspot</template>
          <p>Used by Andrew Hussie for behind the scenes commentary during the early days of Homestuck.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/formspring"
          thumbsrc="/archive/collection/archive_formspring.png"
          afterpage="003478"
          date="Feb 2010 - Aug 2011">
          <template v-slot:title>Formspring</template>
          <p>Q&As with Andrew Hussie, providing context and commentary on Homestuck until it was dropped in mid-2011.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/tumblr"
          thumbsrc="/archive/collection/archive_tumblr.png"
          afterpage="006010"
          date="Oct 2011 -  Mar 2013">
          <template v-slot:title>Tumblr</template>
          <p>Picked up in place of Formspring. Used mainly for announcements and Q&As, then abandoned in 2013.</p>
        </HomeRowItem>
      </div>
    </div>

    <div class="card unsortedCard noHeaderCard">
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/desktops"
          thumbsrc="/archive/collection/archive_desktops.png"
          afterpage="003257"
          date="Apr 2009 - Oct 2009">
          <template v-slot:title>Desktop Wallpapers</template>
          <p>A collection of wallpapers that was maintained during the first few months of Homestuck.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/tbiy"
          thumbsrc="/archive/collection/archive_tbiy.png"
          afterpage="004527"
          date="Oct 2010">
          <template v-slot:title>The Baby is You</template>
          <p>After the MSPA Forums banned a certain "genre" of fanart, this was created by Toby Fox as an act of rebellion.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/vigilprince"
          thumbsrc="/archive/collection/archive_vigilprince.png"
          date="Jun 2009">
          <template v-slot:title>The Vigil Prince</template>
          <p>Laugh, and the world laughs with you;<p>
          <p>Weep, and you weep alone.</p>
          <p><em>-Wilford Brimley</em></p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/ryanquest"
          thumbsrc="/archive/collection/archive_ryanquest.png"
          date="Oct 2010">
          <template v-slot:title>Ryanquest</template>
          <p><a href="https://www.qwantz.com">Ryan North</a> has had enough of Andrew Hussie's lies. Join him on his quest to do... something.</p>
        </HomeRowItem>
      </div>
    </div>

    <div v-if="modHomeRowItems.length" class="card unsortedCard noHeaderCard">
      <div class="cardContent cardRows">
        <HomeRowItem
          v-for="item, i in modHomeRowItems"
          class="rowItem"
          :key="`${i}-${item.href}`"
          :href="item.href"
          :thumbsrc="item.thumbsrc"
          :class="item.class"
          :afterpage="item.afterpage"
          :date="item.date">
          <template v-slot:title>{{ item.title }}</template>
          <div v-html="item.description"></div>
        </HomeRowItem>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import Logo from '@/components/UIElements/Logo.vue'
import HomeRowItem from '@/components/UIElements/HomeRowItem.vue'

export default {
  name: 'homepage',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, HomeRowItem, Logo
  },
  data: function() {
    return {}
  },
  title: function(ctx) {
    return "The Unofficial Homestuck Collection"
  },
  computed: {
    modHomeRowItems() {return this.$archive.tweaks.modHomeRowItems || []}
  },
  methods: {
  }
}
</script>


<style scoped lang="scss">
  @mixin tablet-size {
    @media (max-width: 950px) {
      @content;
    }
  }

  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;
    background: var(--system-background);
    background-color: var(--system-skycolor);
      
    color: var(--font-default);
    padding-bottom: 50px;
  }

  .navBanner {
    margin-bottom: 25px;
  }
  .card {
    position: relative;
    margin-top: 75px;
    &.logoCard { margin-top: 0;}
    &.tight, &.unsortedCard { margin-top: 20px; }
    &.mspaCard { margin-top: 50px; }
    &.newsCard { margin-top: 50px; }
    &.tsoCard { margin-top: 75px; }

    padding: 25px 50px;
    border: solid 5px var(--page-pageBorder, var(--page-pageFrame));
    box-sizing: border-box;
    width: 950px;
    max-width: 100vw;
    background: var(--page-pageContent);

    flex: 0 1 auto;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    align-content: center;

    ::v-deep a:not([disabled]) {
      color: var(--page-links);
    }

    .a6a6graffiti {
      position: absolute;
      pointer-events: none;
      left: 0;
      top: 0;
    }
    .logo {
      position: relative;
      max-width: min(920px, 100vw);
      // position: absolute;
      &.hsLogo {
        // padding: 10px 0;
        margin-top: -85px;
      }
      &.mspaLogo {
        margin-top: -65px;
      }
      &.newsLogo {
        margin-top: -64px;
        .a6a6graffiti {margin: -30px -86px;}
      }
      &.tsoLogo {
        margin-top: -105px;
      }
    }
    .cardContent {
      // img cardContent have special widths
      &div {
        width: 100%;
      }
      // Space between items
      // We use the .cardContent class for this
      // because vue makes > * { & + & } rules annoying.
      & + .cardContent  {
        padding-top: 25px;
      }

      &.collection {
        text-align: center;
        
        a {
          font-size: 24px;
        }

        .versionNotice {
          margin: 0 auto;
          width: 650px;
          margin-top: 20px;
        }
      }
      &.cardEntry {
        // Styles for big adventure cards
        // padding-top: 25px;
        // border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));

        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;

        z-index: 1;

        .icon {
          text-align: center;

          .date {
            padding-top: 5px;
            font-family: Verdana, Arial, Helvetica, sans-serif;
            font-weight: normal;
            color: var(--page-nav-meta);
            font-size: 12px;
          }
          img {
            display: block;

            @include tablet-size {
              max-width: 65px;
              max-height: 65px;
            }
          }
        }
        .description  {
          padding-left: 20px;

          h2 {
            font-size: 28px;
            margin-bottom: 5px;
          }

          .links {
            margin-top: 10px;
            display: flex;
            @include tablet-size {
              display: block;
            }
            align-items: center;
            font-family: Verdana,Arial,Helvetica,sans-serif;

            .left, .center, .right {
              font-size: 16px;
              margin-right: 20px;
              &.bigLink {
                font-size: 24px;
              }
            }
          }
        }
      }
      &.cardRows {
        margin-bottom: -10px;
        margin-top: -10px;
        display: flex;
        flex-flow: row wrap;
        width: 100%;

        // Keep margin behind adventure links
        z-index: 0;

        ::v-deep .comicsans {
          font-family: "Comic Sans MS", "Comic Sans", cursive;
          font-size: 15px;
        }
        ::v-deep .cheerfulbear .thumbnail {
          background: url(assets://archive/collection/kermit.png);
          width: 65px;
          height: 65px;
          img {
            transition: opacity 0.3s;
          }
          &:hover {
            img {
              opacity: 0;
            }
          }
        }
      }
    }
  }
  .card.noHeaderCard .cardContent.cardRows .rowItem  {
    &:nth-child(1), &:nth-child(2) {
      border-top: none;
    }
  }

</style>

