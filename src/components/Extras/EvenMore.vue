<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Media url="/archive/collection/collection_logo.png" /></a>
      <div class="cardContent">
        <section>
          <h2>Looking for more?</h2> 
          <p>
            We've tried to pack as much as we possibly can into this archive, but there are so many more fan resources and communities you can explore. Here are a few.
          </p>
          <p>
            (As with all external links, <em>we recommend staying away from these sits</em> until you've finished the comic, as spoilers abound!)
          </p>
        </section>

        <section>
          <HomeRowItem v-for="site in extSites"
            :key="site.id"
            class="rowItem"
            :href="site.url"
            :thumbsrc="`/archive/collection/external/${site.id}.png`">
            <template v-slot:title>{{site.name}}</template>
            <p v-html="site.desc" />
          </HomeRowItem>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import HomeRowItem from '@/components/UIElements/HomeRowItem.vue'

export default {
  name: 'newReader',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, HomeRowItem
  },
  title: () => "New reader tips",
  data: function() {
    return {
      // hsmusic, reddit, archive, mspa wiki
      extSites: [
        {
          id: 'hsmusic',
          url: 'https://hsmusic.wiki',
          name: 'HSMusic',
          desc: "HSMusic Wiki is an extensive catalog of Homestuck music and musicians. It includes the full Homestuck discography and most assocoited music and has tons of information and supplementary material. It's where the collection sources most of its music info!"
        },
        {
          id: 'readmspa',
          url: 'http://readmspa.org',
          name: 'readmspa',
          desc: "Readmspa has an enormous amount of data about Homestuck including stats, visualizations, transcripts, and storyboards."
        },
        {
          id: 'MSPFA',
          url: '',
          name: 'MS Paint Fan Adventures',
          desc: `Fans began running their own adventures on the MSPA Forums, but with the forum format panels and suggestions were mixed together, and navigation was an issue. In early 2010, lolzorine and nyxshadow set up <a href="https://mspfa.com/">MS Paint Fan Adventures</a> as an open adventure reader. You can read a brief history <a href="https://mspfa.com/history/">on the site</a>`
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
          name: 'Hiveswap Extended Zodiac',
          desc: "An official personality quiz that assigns you a zodiac symbol based on your quiz answers. Promotional material for the Hiveswap games."
        },
        {
          id: 'rafe',
          url: 'http://rafe.name/homestuck/',
          name: 'The Acts and Pages of Homestuck',
          desc: "A map of Homestuck, with information and summaries of each act and section of the comic."
        },
        {
          id: 'voxus',
          url: 'https://www.youtube.com/playlist?list=PLHO1rc05qiGtAidSBy_8jsEOlHXR6x4cd',
          name: "Voxus: Let's Read Homestuck",
          desc: "An extensive voice-acting readthrough of Homestuck. "
        }
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
  }
}
</script>

<style scoped lang="scss">
  .navBanner {
    margin-bottom: 25px;
  }
  ::v-deep .rowItem {
    .thumbnail img {
      width: 65px;
      height: 65px;
      image-rendering: pixelated;
    }
    a.thumbnail::after {
      display: none !important;
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
