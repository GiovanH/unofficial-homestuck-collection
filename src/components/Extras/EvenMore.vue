<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Media url="/archive/collection/collection_logo.png" /></a>
      <div class="cardContent">
        <section>
          <h2>Looking for more?</h2> 
          <p>
            We've tried to pack as much as we possibly can into this archive, but there are so many more fan resources and communities you can explore. Here are a few, in no particular order.
          </p>
          <p>
            (As with all external links, <em>we recommend staying away from these sites</em> until you've finished the comic, as spoilers abound!)
          </p>
        </section>

        <section class="list">
          <div v-for="site in extSites" class="siteItem" :key="site.id">
            <a class="icon" :href="site.url">
              <Media :url="`/archive/collection/external/${site.id}.png`" />
            </a>
            <div class="text">
              <h2><a :href="site.url" v-text="site.name" /></h2>
              <p class="desc" v-html="site.desc" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'newReader',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  title: () => "Even more content",
  data: function() {
    return {
      // hsmusic, reddit, archive, mspa wiki
      extSites: [
        {
          id: 'hsmusic',
          url: 'https://hsmusic.wiki',
          name: 'HSMusic',
          desc: "HSMusic Wiki is an extensive catalog of Homestuck music and musicians. It includes the full Homestuck discography and most assocoited music and has tons of information and supplementary material."
        },
        {
          id: 'readmspa',
          url: 'http://readmspa.org',
          name: 'readmspa',
          desc: "Readmspa has an enormous amount of data about Homestuck including stats, visualizations, transcripts, and storyboards."
        },
        {
          id: 'MSPFA',
          url: 'https://mspfa.com',
          name: 'MS Paint Fan Adventures',
          desc: `A hub for fans to write and share their own MSPA-styled adventures.`
        },
        {
          id: 'reddit',
          url: 'https://www.reddit.com/r/homestuck/',
          name: 'r/Homestuck',
          desc: "The Homestuck fan subreddit. Art, discussion, chat."
        },
        {
          id: 'homestuck_net',
          url: 'https://homestuck.net',
          name: 'HOMESTUCK.net',
          desc: "A massive \"fandom archive\", with an extensive listing of fan projects, crafts, cosplay resources, games, software, sheet music, liveblogs, and more."
        },
        {
          id: 'wiki',
          url: 'https://mspa.wikia.com/',
          name: 'MSPA WIKI',
          desc: "The MSPA Wiki. A great database of character information and summaries. (Caution: hosted by fandom.com)"
        },
        {
          id: 'hs2',
          url: 'https://homestuck2.com',
          name: 'Homestuck^2',
          desc: "A semi-official continuation of the Homestuck comic, picking up after the epilogues. Abandoned, as of time of writing."
        },
        {
          id: 'ezodiac',
          url: 'http://hs.hiveswap.com/ezodiac/index.php',
          name: 'Extended Zodiac',
          desc: "An official personality quiz that assigns you a zodiac symbol based on your quiz answers. Promotional material for the Hiveswap games."
        },
        {
          id: 'rafe',
          url: 'http://rafe.name/homestuck/',
          name: 'The Acts and Pages of Homestuck',
          desc: "A map of Homestuck, with information and summaries of each act and section of the comic."
        },
        {
          id: 'mrcheeze',
          url: 'https://mrcheeze.github.io/andrewhussie/',
          name: 'The Works of Andrew Hussie',
          desc: "A collection including some of Andrew Hussie's early works that didn't make it into the collection, including Barty's Brew-Ha-Ha, art tutorials, and more."
        },
        {
          id: 'wheals',
          url: 'http://wheals.github.io/',
          name: 'wheals.github.io',
          desc: "wheals' Homestuck archive of social media, including various news interviews with Andrew."
        },
        {
          id: 'voxus',
          url: 'https://www.youtube.com/playlist?list=PLHO1rc05qiGtAidSBy_8jsEOlHXR6x4cd',
          name: "Voxus: Let's Read Homestuck",
          desc: "An extensive voice-acting readthrough of Homestuck. "
        },
        {
          id: 'omega',
          url: 'https://omegaupdate.freeforums.net',
          name: "Omegaupdate Forums",
          desc: "One of several MSPA Forums replacements. This sprung up around the <a href='https://mspfa.com/?s=16414&p=1'>Act Omega</a> and continues to act as a suggestion box for several fan adventures."
        },
        {
          id: 'xyz',
          url: 'https://forum.homestuck.xyz',
          name: "homestuck.xyz MSPA Forums",
          desc: "One of several MSPA Forums replacements. This is intended as a direct replacement of the classic MSPA Forums rather than as a forum for any particular adventure."
        },
        {
          id: 'mozai',
          url: 'https://nepeta.mozai.com',
          name: "nepeta.mozai.com",
          desc: "<a href='https://mozai.com'>Mozai's</a> Homestuck fansite, with an archive of old fandom resources."
        },
      ],
      othercats: [
        // {
        //   name: "Liveblogs",
        //   desc: "",
        //   items: [
        //     {
        //       label: "Minda",
        //       href: ""
        //     }
        //   ]
        // },
        {
          name: "Acting",
          desc: "",
          items: [
            {
              label: "Voxus: Let's Read Homestuck",
              href: "https://www.youtube.com/c/Voxus/playlists?view=50&sort=dd&shelf_id=2"
            }
          ]
        }
      ]
    }
  },
  methods: {
    shuffle(){
      this.extSites = this.extSites
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    }
  },
  mounted() {
    this.shuffle()
  },
  // updated() {
  //   this.shuffle()
  // }
}
</script>

<style scoped lang="scss">
  .navBanner {
    margin-bottom: 25px;
  }
  section.list {
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    .siteItem {
      flex: 1 0 50%;
    }
    img {
      margin: 0 0;
    }
  }
  .siteItem {
    display: flex;
    padding: 1em 0;
    border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));
    .icon {
      img {
        object-fit: contain;
        height: 150px;
        width: 150px;
        display: block;
      }
      &::after {
        content: '' !important;
      }
    }
    div.text {
      padding: 0 1em;
      h2 {

      }
      p.desc {

      }
    }
  }
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

    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;

    color: var(--font-default);
    a {
      color: var(--page-links);
    }
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
      margin: 25px;

      img {
        width: 700px;
      }
    }
  }
  .cardContent {
    width: 100%;
    padding-bottom: 25px;
    text-align: center;
    
    h2 {
      margin-bottom: 16px;
    }
    img {
      display: block;
      margin: 0 auto;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    section {
      margin-bottom: 3em;
    }
    p {
      font-size: 16px;
      font-weight: normal;
      font-family: Verdana,Arial,Helvetica,sans-serif;
      margin-bottom: 1em;
    }
    .tiny {
      font-size: x-small;
    }
  }
</style>
