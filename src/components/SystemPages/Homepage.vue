<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card Logo">
      <a href="/" class="topLogo"><Media url="/archive/collection/collection_logo.png" /></a>
      <div class="cardContent collection">
        <div class="links">
          <a href="/newreader" >New readers</a> | <a href="/userguide" >How to navigate the collection</a> | <a href="/settings" >Settings</a>
        </div>
        <p class="versionNotice" v-if="$archive.version != $data.$expectedAssetVersion">
          This release of The Unofficial Homestuck Collection is tuned around <strong>v{{$data.$expectedAssetVersion}}</strong> of the asset pack, but it looks like you're currently on <strong>v{{$archive.version}}</strong>.<br><br>
          Nothing's <em>guaranteed</em> to break, but things might get a little weird.
        </p>
      </div>
    </div>
    <div class="card">
      <Media url="/archive/collection/hs_logo.png" class="logo hsLogo" />
      <div class="cardContent cardEntry hsCard">
        <div class="icon">
          <a href="/mspa/6" ><Media url="/images/archive_hs.gif" /></a>
          <p class="date">Apr 2009 - Apr 2016</p>
          <p class="date">8,130 pages</p>
        </div>
        <div class="description">
          <p><em>A story about some kids who are friends over the internet. They decide to play a game together. There are major consequences.</em></p><br>
          <p>The fourth, final, and most famous of the MS Paint Adventures. While it begun as a "mock-game" following reader commands like the previous adventures, they were phased out as the story unfolded into a mixed-media barrage of mid-2000's internet culture satire, interpersonal drama, and Weird Plot Shit [sic].</p></br>
          <p>One-upping Problem Sleuth's action-packed GIFs, Homestuck spiced up pivotal moments with Flash animations scored by a lively team of composers. Over time, the music team produced dozens of albums across a variety of genres.</p>
          <div class="links">
            <div class="left bigLink">
              > <a href="/mspa/6" >Begin Adventure</a>
            </div>
            <div class="center">
              > <a href="/log/6" >Adventure Log</a><br>
              > <a href="/map/6" >Adventure Map</a>
            </div>
            <div class="right">
              > <a href='/decode'>Decoding Tools</a><br>
              > <a href="/credits" >Credits</a>
            </div>
          </div>
        </div>
      </div>
      <div class="cardContent cardRows">
        <div class="row">
          <div class="rowItem beta">
            <a class="thumbnail" href="/mspa/5"><Media url="/archive/collection/archive_beta.png"/></a>
            <div class="description">
              <h2><a href="/mspa/5">Homestuck BETA</a></h2>
              <p class="date">Apr 2009</p>
              <p>Homestuck was initially intended to be made exclusively in Flash. It lasted about three days.</p>
            </div>
          </div>
          <div class="rowItem music">
            <a class="thumbnail" href="/music"><Media url="/archive/collection/archive_music.png"/></a>
            <div class="description">
              <h2><a href="/music">Music</a></h2>
              <p class="date">Aug 2009 - Apr 2020</p>
              <p>Explore the entire discography of official Homestuck music.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="rowItem sbahj">
            <a class="thumbnail" href="/sbahj"><Media url="/archive/collection/archive_sbahj.png"/></a>
            <div class="description">
              <h2><a href="/sbahj">Sweet Bro & Hella Jeff</a></h2>
              <p class="date">Mar 2009 - Nov 2017</p>
              <p class="comicsans">it keeps happening</p>
              <p>> <a href="assets://archive/forum/SBaHJ Origins.html">The origin story.</a></p>
            </div>
          </div>

          <div class="rowItem dstrider" v-if="!$pageIsSpoiler('003053')">
            <a class="thumbnail" href="/dstrider"><Media url="/archive/collection/archive_dstrider.png"/></a>
            <div class="description">
              <h2><a href="/dstrider">The Blog of Dave Strider</a></h2>
              <p class="date">Jan 2010 - Mar 2010</p>
              <p>There's this really cool dude, ok? He ran a blog for a while. That's really all there is to say on the matter.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Jan 2010 - Mar 2010</p>
              <p>Reach page {{$mspaOrVizNumber('003053')}} of Homestuck to unlock!</p>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="rowItem namcohigh" v-if="!$pageIsSpoiler('008135')">
            <a class="thumbnail" href="/namcohigh"><Media url="/archive/collection/archive_namcohigh.png"/></a>
            <div class="description">
              <h2><a href="/namcohigh">Namco High</a></h2>
              <p class="date">Dec 2013 -  Jul 2014</p>
              <p>Date famous Namco characters in this baffling crossover directed by Andrew Hussie. Features Homestuck cameos?</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Dec 2013 -  Jul 2014</p>
              <p>Reach page {{$mspaOrVizNumber('008135')}} of Homestuck to unlock!</p>
            </div>
          </div>

          <div class="rowItem pxs" v-if="!$pageIsSpoiler('008753')">
            <a class="thumbnail" href="/pxs"><Media url="/archive/collection/archive_pxs.png"/></a>
            <div class="description">
              <h2><a href="/pxs">Paradox Space</a></h2>
              <p class="date">Apr 2014 - Mar 2016</p>
              <p>Tales from the depths of canon.</p><p>Short-form stories written by community figures.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Apr 2014 - Mar 2016</p>
              <p>Reach page {{$mspaOrVizNumber('008753')}} of Homestuck to unlock!</p>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="rowItem snaps" v-if="!$isNewReader">
            <a class="thumbnail" href="/snaps"><Media url="/archive/collection/archive_snaps.png"/></a>
            <div class="description">
              <h2><a href="/snaps">Snapchat</a></h2>
              <p class="date">Oct 2016 - Aug 2017</p>
              <p>Snapshots of life on Earth C. No longer canon as of The Epilogues.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Oct 2016 - Aug 2017</p>
              <p>Finish Homestuck to unlock!</p>
            </div>
          </div>

          <div class="rowItem skaianet" v-if="!$isNewReader">
            <a class="thumbnail" href="/skaianet"><Media url="/archive/collection/archive_skaianet.png"/></a>
            <div class="description">
              <h2><a href="/skaianet">Skaianet Systems</a></h2>
              <p class="date">Jan 2019</p>
              <p>Tomorrow's canon, today! Homestuck still has plenty in store for you.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Jan 2019</p>
              <p>Finish Homestuck to unlock!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <div class="card">
      <Media url="/archive/collection/mspa_logo_dark.png" class="logo mspaLogo" />
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
            <div class="left bigLink">
              > <a href="/unlock/ps_titlescreen" >Title screen</a>
            </div>
            <div class="center">
              > <a href="/log/4" >Adventure Log</a><br>
              > <a href="/map/4" v-if="!$pageIsSpoiler('001840')">Adventure Map</a>
            </div>
            <div class="right">
              > <a href="/unlock" >Unlockable Content</a><br>
              > <a href="/faqs/science" v-if="!$timestampIsSpoiler(1236384000)">Science FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <Media url="/archive/collection/tso_logo.png" class="logo tsoLogo" />
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
        <div class="row">
          <div class="rowItem offeryoucantrefuse">
            <a class="thumbnail" href="/offeryoucantrefuse"><Media url="/archive/collection/archive_offeryoucantrefuse.png"/></a>
            <div class="description">
              <h2><a href="/offeryoucantrefuse">An Offer You Can't Refuse</a></h2>
              <p class="date">Jun 2006</p>
              <p>Answer one simple question for a FREE* Dinner for Two at Olive Garden®!</p>
            </div>
          </div>
          <div class="rowItem magicaljourney">
            <a class="thumbnail" href="/magicaljourney"><Media url="/archive/collection/archive_magicaljourney.png"/></a>
            <div class="description">
              <h2><a href="/magicaljourney">Come With Me on a Magical Journey Through the Internet!</a></h2>
              <p class="date">Nov 2007</p>
              <p>Diving deep into Olive Garden®'s hole.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="rowItem cheefulbear">
            <a class="thumbnail kermit" href="assets://archive/forum/Cheerfulbear - PLAY ME.html"><Media url="/archive/collection/archive_cheerfulbear.png"/></a>
            <div class="description">
              <h2><a href="assets://archive/forum/Cheerfulbear - PLAY ME.html">Cheerfulbear - PLAY ME</a></h2>
              <p class="date">Jan 2008</p>
              <p> HELLO CHEERFULBEAR I WOULD LIKE TO PLAY A GAME HELLO CHEERFULBEAR I WOULD</p>
            </div>
          </div>
          <div class="rowItem suckoff">
            <a class="thumbnail" href="assets://archive/forum/Dear Andrew.html"><Media url="/archive/collection/archive_suckoff.png"/></a>
            <div class="description">
              <h2><a href="assets://archive/forum/Dear Andrew.html">The Man-On-Man Suckoff Challenge</a></h2>
              <p class="date">Jun 2008 - May 2009</p>
              <p>Gaze deep into the uncanny valley.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="cardContent cardRows">
        <div class="row noBorder">
          <div class="rowItem news">
            <a class="thumbnail" href="/news"><Media url="/archive/collection/archive_news.png"/></a>
            <div class="description">
              <h2><a href="/news">MSPA Newsposts</a></h2>
              <p class="date">Jun 2007 - Apr 2018</p>
              <p>An archive of official newsposts, ranging the entire lifespan of the MSPA website.</p>
            </div>
          </div>
          <div class="rowItem blogspot" v-if="!$pageIsSpoiler('002821')">
            <a class="thumbnail" href="/blogspot"><Media url="/archive/collection/archive_blogspot.png"/></a>
            <div class="description">
              <h2><a href="/blogspot">Blogspot</a></h2>
              <p class="date">Dec 2008 - Jul 2010</p>
              <p>Used by Andrew Hussie for behind the scenes commentary during the early days of Homestuck.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Dec 2008 - Jul 2010</p>
              <p>Reach page {{$mspaOrVizNumber('002821')}} of Homestuck to unlock!</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="rowItem formspring" v-if="!$pageIsSpoiler('003478')">
            <a class="thumbnail" href="/formspring"><Media url="/archive/collection/archive_formspring.png"/></a>
            <div class="description">
              <h2><a href="/formspring">Formspring</a></h2>
              <p class="date">Feb 2010 - Aug 2011</p>
              <p>Q&As with Andrew Hussie, providing context and commentary on Homestuck until it was dropped in mid-2011.</p>
              <p></p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Feb 2010 - Aug 2011</p>
              <p>Reach page {{$mspaOrVizNumber('003478')}} of Homestuck to unlock!</p>
            </div>
          </div>

          <div class="rowItem tumblr" v-if="!$pageIsSpoiler('006010')">
            <a class="thumbnail" href="/tumblr"><Media url="/archive/collection/archive_tumblr.png"/></a>
            <div class="description">
              <h2><a href="/tumblr">Tumblr</a></h2>
              <p class="date">Oct 2011 -  Mar 2013</p>
              <p>Picked up in place of Formspring. Used mainly for announcements and Q&As, then abandoned in 2013.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Oct 2011 -  Mar 2013</p>
              <p>Reach page {{$mspaOrVizNumber('006010')}} of Homestuck to unlock!</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="rowItem desktops" v-if="!$pageIsSpoiler('003257')">
            <a class="thumbnail" href="/desktops"><Media url="/archive/collection/archive_desktops.png"/></a>
            <div class="description">
              <h2><a href="/desktops">Desktop Wallpapers</a></h2>
              <p class="date">Apr 2009 - Oct 2009</p>
              <p>A collection of wallpapers that was maintained during the first few months of Homestuck.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Apr 2009 - Oct 2009</p>
              <p>Reach page {{$mspaOrVizNumber('003257')}} of Homestuck to unlock!</p>
            </div>
          </div>
          <div class="rowItem tbiy" v-if="!$pageIsSpoiler('004527')">
            <a class="thumbnail" href="/tbiy"><Media url="/archive/collection/archive_tbiy.png"/></a>
            <div class="description">
              <h2><a href="/tbiy">The Baby is You</a></h2>
              <p class="date">Oct 2010</p>
              <p>After the MSPA Forums banned a certain "genre" of fanart, this was created by Toby Fox as an act of rebellion.</p>
            </div>
          </div>
          <div class="rowItem" v-else>
            <Media url="/archive/collection/spoiler_small.png"/>
            <div class="description">
              <h2>??????</h2>
              <p class="date">Oct 2010</p>
              <p>Reach page {{$mspaOrVizNumber('004527')}} of Homestuck to unlock!</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="rowItem vigilprince">
            <a class="thumbnail" href="/vigilprince"><Media url="/archive/collection/archive_vigilprince.png"/></a>
            <div class="description">
              <h2><a href="/vigilprince">The Vigil Prince</a></h2>
              <p class="date">Jun 2009</p>
              <p>Laugh, and the world laughs with you;<p>
              <p>Weep, and you weep alone.</p>
              <p><em>-Wilford Brimley</em></p>
            </div>
          </div>
          <div class="rowItem ryanquest">
            <a class="thumbnail" href="/ryanquest"><Media url="/archive/collection/archive_ryanquest.png"/></a>
            <div class="description">
              <h2><a href="/ryanquest">Ryanquest</a></h2>
              <p class="date">Oct 2010</p>
              <p><a href="https://www.qwantz.com">Ryan North</a> has had enough of Andrew Hussie's lies. Join him on his quest to do... something.</p>
            </div>
          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
export default {
  name: 'homepage',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;
    background: url(assets://archive/collection/homebg_right.png) repeat-y, url(assets://archive/collection/homebg_left.png) repeat-y;
    background-position: left top, right top;
    background-color: #35bfff;
    background-attachment: fixed;

    color: var(--font-default);
    a {
      color: var(--page-links);
    }

    .topLogo {
      margin: 25px;

      img {
        width: 700px;
      }
    }
    .navBanner {
      margin-bottom: 25px;
    }
    .card {
      position: relative;
      margin-bottom: 75px;
      padding: 0 50px;
      border: solid 5px var(--page-pageBorder, var(--page-pageFrame));
      box-sizing: border-box;
      width: 950px;
      background: var(--page-pageContent);

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      align-content: center;

      .logo {
        max-width: 920px;
        position: absolute;
        &.hsLogo {
          // padding: 10px 0;
          top: -60px;
        }
        &.mspaLogo {
          top: -40px;
          // padding: 10px 0;
        }
        &.tsoLogo {
          top: -80px;
        }
      }
      .logo {
        // Correctly position cards under logos
        &.hsLogo + .cardEntry {
          padding-top: 120px;
        }
        &.mspaLogo + .cardEntry {
          padding-top: 50px;
        }
        &.tsoLogo + .cardEntry {
          padding-top: 80px;
        }
      }
      .cardContent {
        width: 100%;
        padding-bottom: 25px;

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
          padding-top: 25px;
          border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));

          display: flex;
          flex-flow: row nowrap;
          align-items: flex-start;

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
          .row {
            display: flex;
            flex-flow: row nowrap;
            border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));

            &.noBorder {
              margin-top: 15px;
              border-top: none;
            }

            .rowItem {
              width: 50%;
              padding: 10px 5px;
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              

              .thumbnail {
                img {
                  display: block;
                }
                &:after {
                  display: none;
                }
              }

              .description {
                padding: 0 10px;
                h2 {
                  font-size: 18px;
                }
                .date {
                  font-family: Verdana, Arial, Helvetica, sans-serif;
                  font-size: 10px;
                  font-weight: normal;
                  color: var(--page-nav-meta);
                }
              }
            }
          }
          .comicsans {
            font-family: "Comic Sans MS", "Comic Sans", cursive;
            font-size: 15px;
          }
          .kermit {
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

  }
  

</style>

