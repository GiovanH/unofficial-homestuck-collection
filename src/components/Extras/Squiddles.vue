<template>
  <div class="pageFrame" align="center">
    <div class="pageHead">
      <!-- <MediaEmbed url="assets://archive/squiddles/wpbanner.gif" /> -->
      <a href="/music/album/squiddles">
        <MediaEmbed url="assets://archive/squiddles/squiddles_banner.jpg" />
      </a>
      <ul class="wpnav">
        <li><a href="/music/album/squiddles">the album</a></li>
      </ul>
      <NavBanner />
    </div>
    <div class="pageBody">
      <MediaEmbed url="assets://archive/music/squiddles/squiddlevid.swf" class="video" />

      <div class="credits">
        <MediaEmbed url="assets://archive/squiddles/squiddles_logo.jpg" />
        <p class="preface">
          The Squiddles! album/animation combo pack was a big team effort.<br />
          All these awesome dudes and ladies had a hand in its creation:
        </p>
        <div class="columns">
          <div>
            <b>Album Credits:</b>
            <ul>
              <li>Alexander Rosetti</li>
              <li>David Ko</li>
              <li>Ian Taylor</li>
              <li>Clark "Plazmataz" Powell</li>
              <li>Erik "Jit" Scheele</li>
              <li>Michael Guy Bowman</li>
              <li>Seth "Beatfox" Peelle</li>
              <li>Steve Everson</li>
              <li>Robert J! Lake</li>
              <li>Nick Smalley</li>
              <li>Jeremy "Solatrus" Iamurri</li>
              <li>Malcolm Brown</li>
              <li>Toby "Radiation" Fox</li>
              <li>Mark Hadley</li>
              <li>Album art by Cindy Dominguez</li>
            </ul>
          </div>
          <div>
            <b>Animation Credits:</b>
            <ul>
              <li><a href="https://www.deviantart.com/paigetart">Paige Turner</a> (lead animator)
                <span class="social">
                  <a href="https://twitter.com/Xer0_Paige"></a>
                  <a href="https://www.deviantart.com/paigetart"></a>
                </span>
              </li>
              <li><a href="https://web.archive.org/web/20100914204435/http://www.iwantyoutofeelthepressure.com/">M Thomas Harding</a>
              </li>
              <li><a href="https://web.archive.org/web/20100906104314/http://thebrainseed.com/">Brett Muller</a>
                <span class="social">
                  <a href="https://twitter.com/brettmuller"></a>
                  <a href="https://www.deviantart.com/randomartist"></a>
                </span>
              </li>
              <li><a href="https://jessicaallison.carbonmade.com">Jessica Allison</a>
                <span class="social">
                  <a href="https://twitter.com/PurgatoryRose"></a>
                </span>
              </li>
              <li><a href="http://www.firmanproductions.com/">Michael Firman</a>
                <span class="social">
                  <a href="https://twitter.com/michaelfirman"></a>
                  <a href="https://michaelfirman.tumblr.com/"></a>
                </span>
              </li>
              <li><a href="https://mspaintadventures.fandom.com/wiki/Cindy_Dominguez">Cindy Dominguez</a>
                <span class="social">
                  <a href="https://www.linkedin.com/in/cindy-dominguez-519a7a105/"></a>
                </span>
              </li>
              <li><a href="https://hannibrosh.com/">Hanni Brosh (SaffronScarf)</a>
                <span class="social">
                  <a href="https://www.deviantart.com/saffronscarf"></a>
                </span>
              </li>
              <li><a href="http://www.notenoughink.com/">Richard Gung</a>
                <span class="social">
                  <a href="https://twitter.com/ink_REDULOUS"></a>
                  <a href="https://ink-redulous.tumblr.com/"></a>
                </span>
              </li>
              <li><a href="http://niccarey.com/">Nic Carey</a>
                <span class="social">
                  <a href="https://twitter.com/tynic"></a>
                  <a href="https://niccarey.tumblr.com/"></a>
                </span>
              </li>
              <li><a href="https://cargocollective.com/viivus-draws">Killian Ng (Vivus)</a>
                <span class="social">
                  <a href="https://twitter.com/KLLiiNNG"></a>
                  <a href="https://viivus.tumblr.com/"></a>
                </span>
              </li>
              <li><a href="http://www.metroidhat.com/">Eyes5 (metroidhat)</a>
                <span class="social">
                  <a href="https://twitter.com/metroidhat"></a>
                  <a href="https://www.deviantart.com/eyes5"></a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'Squiddles',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner,
    MediaEmbed
  },
  title: () => "Squiddles!",
  data: function() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  .pageFrame {
    background: #E4E4E1;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-weight: normal;
  }
  .pageBody, .pageHead {
    width: 800px;
    background: #FAFEFF;
    margin: 16px 0;
  }
  .pageBody {
    padding-bottom: 75px;
  }
  .navBanner, .wpnav {
    background: #666666;
    max-width: 100%;
  }
  .wpnav {
    font-size: 16px;
    padding: 10px;
    li {
      list-style: none;
    }
    a {
      color: white; 
      text-decoration: none; 
      font-weight: bold; 
      &:hover {text-decoration: underline;}
    }
  }
  .video {
    margin: 75px;
  }
  .credits {
    li {
      list-style: none;
    }
    .social {
      display: block;
      font-size: 12px;
      a {
        color: slategray;
        text-decoration: none;
        &:hover {text-decoration: underline;}
        &[href*="//twitter.com"] {
          &::before { content: "twitter"; }
          &::after { content: "" !important; }
        }
        &[href*="deviantart.com/"] {
          &::before { content: "deviantart"; }
          &::after { content: "" !important; }
        }
        &[href*=".tumblr.com"] {
          &::before { content: "tumblr"; }
          &::after { content: "" !important; }
        }
        &[href*="//www.linkedin.com"] {
          &::before { content: "linkedin"; }
          &::after { content: "" !important; }
        }
      }
    }
    .preface {
      font-size: 13px;
      margin-bottom: 2em;
    }
    .columns {
      display: flex;
      text-align: left;
      justify-content: space-evenly;
    }
  }
</style>
