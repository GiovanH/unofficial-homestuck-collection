<template>
  <div class="pageFrame" align="center">
    <div class="pageHead">
      <!-- <MediaEmbed url="assets://archive/squiddles/wpbanner.gif" /> -->
      <a href="/music/album/squiddles">
        <MediaEmbed url="assets://archive/squiddles/squiddles_banner.jpg" />
      </a>
      <!--
        <ul class="wpnav">
          <li><a href="/music/album/squiddles">the album</a></li>
        </ul>
      -->
      <NavBanner />
    </div>
    <div class="pageBody">
      <MediaEmbed url="assets://archive/music/squiddles/squiddlevid.swf" class="video" />

      <div class="credits">
        <a href='assets://archive/music/squiddles/Squiddles_booklet.pdf'>
          <MediaEmbed url="assets://archive/squiddles/squiddles_logo.jpg" />
        </a>
        <p class="preface">
          The Squiddles! album/animation combo pack was a big team effort.<br />
          All these awesome dudes and ladies had a hand in its creation:
        </p>
        <div class="columns">
          <div>
            <b><a href="/music/album/squiddles">Album Credits:</a></b>
            <ul>
              <li>Alex Rosetti</li>
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
              <li v-for="credit in AnimationCredits" :key="credit.name">
                <a :href="credit.link" v-text="credit.name" /> 
                <span v-if="credit.note" v-text="credit.note" />
                <span class="social" v-if="credit.socials">
                  <a v-for="link in credit.socials" :href="link" :key="link"/>
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
    return {
      AnimationCredits: [
        {
          name: "Paige Turner",
          link: "https://www.deviantart.com/paigetart",
          note: " (lead animator)",
          socials: [
            "https://twitter.com/Xer0_Paige",
            "https://www.deviantart.com/paigetart"
          ]
        },
        {
          name: "Rebecca Harding",
          link: "https://web.archive.org/web/20100914204435/http://www.iwantyoutofeelthepressure.com/"
        },
        {
          name: "Brett Muller",
          link: "https://web.archive.org/web/20100906104314/http://thebrainseed.com/",

          socials: [
            "https://twitter.com/brettmuller",
            "https://www.deviantart.com/randomartist"
          ]
        },
        {
          name: "Jessica Allison",
          link: "https://jessicaallison.carbonmade.com",

          socials: [
            "https://twitter.com/PurgatoryRose"
          ]
        },
        {
          name: "Michael Firman",
          link: "http://www.firmanproductions.com/",

          socials: [
            "https://twitter.com/michaelfirman",
            "https://michaelfirman.tumblr.com/"
          ]
        },
        {
          name: "Cindy Dominguez",
          link: "https://mspaintadventures.fandom.com/wiki/Cindy_Dominguez",

          socials: [
            "https://www.linkedin.com/in/cindy-dominguez-519a7a105/"
          ]
        },
        {
          name: "Hanni Brosh (SaffronScarf)",
          link: "https://hannibrosh.com/",

          socials: [
            "https://www.deviantart.com/saffronscarf"
          ]
        },
        {
          name: "Richard Gung",
          link: "http://www.notenoughink.com/",

          socials: [
            "https://twitter.com/ink_REDULOUS",
            "https://ink-redulous.tumblr.com/"
          ]
        },
        {
          name: "Nic Carey",
          link: "http://niccarey.com/",

          socials: [
            "https://twitter.com/tynic",
            "https://niccarey.tumblr.com/"
          ]
        },
        {
          name: "Killian Ng (Vivus)",
          link: "https://cargocollective.com/viivus-draws",

          socials: [
            "https://twitter.com/KLLiiNNG",
            "https://viivus.tumblr.com/"
          ]
        },
        {
          name: "Eyes5 (metroidhat)",
          link: "http://www.metroidhat.com/",

          socials: [
            "https://twitter.com/metroidhat",
            "https://www.deviantart.com/eyes5"
          ]
        }
      ]
    }
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
  .navBanner {
    height: 48px;
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
      padding: 4px 0;
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
