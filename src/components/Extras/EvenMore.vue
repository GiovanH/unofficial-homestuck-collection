<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Logo /></a>
      <div class="cardContent" v-if="this.$isNewReader">
        <h2>Looking for more?</h2> 
        <section>
          <p>
            We've tried to pack as much as we possibly can into this archive, but there are so many more fan resources and communities you can explore.
          </p>
          <p>
            They're <em>chock full</em> of spoilers, though, to the point where it's hard to even describe some of them without spoiling new readers. And thumbnails are right out.
          </p>
          <p>
            Come back once you finish Homestuck!
          </p>
          <Media url="assets://images/swampwizard.gif" />
        </section>
      </div>
      <div class="cardContent" v-else>
        <section>
          <h2>Looking for more?</h2> 
          <p>
            We've tried to pack as much as we possibly can into this archive, but there are so many more fan resources and communities you can explore. Here are a few, sorted by 
            <select class="sortBy" 
              v-model="sortBy">
              <option v-for="fn, label in sortByChoices" :value="label" :key="label" v-text="label" />
            </select>
          </p>
        </section>

        <section class="list">
          <div v-for="site in extSitesSorted" class="siteItem" :key="site.id">
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
import Logo from '@/components/UIElements/Logo.vue'

function shuffle(obj){
  return obj
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function sortByField(fieldName, modifier=1) {
  return function(obj) {
    obj.sort(function (p1, p2) {
      if (p1[fieldName] < p2[fieldName]) return -1 * modifier
      if (p1[fieldName] > p2[fieldName]) return 1 * modifier
      return 0
    })
    return obj
  }
}

const collator = new Intl.Collator('en', {
  ignorePunctuation: true
})

function sortByFieldIntl(fieldName, modifier=1) {
  function noArticles(str) {
    const articles = ['a', 'an', 'the']
    const re = new RegExp('^(?:(' + articles.join('|') + ') )(.*)$', 'i')
    return str.replace(re, ($0, $1, $2) => $2 + ', ' + $1)
  }
  return function(list) {
    list.sort(function (p1, p2) {
      return collator.compare(
        noArticles(p1[fieldName]), 
        noArticles(p2[fieldName])
      ) * modifier
    })
    return list
  }
}

export default {
  name: 'newReader',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, Logo
  },
  title: () => "Even more content",
  data: function() {
    return {
      sortBy: "Random",
      sortByChoices: {
        "Random": shuffle,
        "Type": sortByField('type'),
        "Alphabetical (desc)": sortByFieldIntl('name'),
        "Alphabetical (asc)": sortByFieldIntl('name', -1),
      },
      extSites: [
        {
          id: 'hsmusic',
          type: 'info',
          url: 'https://hsmusic.wiki',
          name: 'HSMusic',
          desc: "HSMusic Wiki is an extensive catalog of Homestuck music and musicians. It includes the full Homestuck discography and most associated music and has tons of information and supplementary material."
        },
        {
          id: 'readmspa',
          type: 'info',
          url: 'http://readmspa.org',
          name: 'readmspa',
          desc: "Readmspa has an enormous amount of data about Homestuck including stats, visualizations, transcripts, and storyboards."
        },
        {
          id: 'MSPFA',
          type: 'work',
          url: 'https://mspfa.com',
          name: 'MS Paint Fan Adventures',
          desc: `A hub for fans to write and share their own MSPA-styled adventures.`
        },
        // {
        //   id: 'reddit',
        //   type: 'social',
        //   url: 'https://www.reddit.com/r/homestuck/',
        //   name: 'r/Homestuck',
        //   desc: "The Homestuck fan subreddit. Art, discussion, chat."
        // },
        {
          id: 'homestuck_net',
          type: 'info',
          url: 'https://homestuck.net',
          name: 'HOMESTUCK.net',
          desc: "A massive \"fandom archive\", with an extensive listing of fan projects, crafts, cosplay resources, games, software, sheet music, liveblogs, and more."
        },
        {
          id: 'wiki',
          type: 'info',
          url: 'https://mspa.wikia.com/',
          name: 'MSPA WIKI',
          desc: "The MSPA Wiki. A great database of character information and summaries. (Caution: hosted by fandom.com)"
        },
        {
          id: 'skaianet',
          type: 'info',
          url: 'http://skaia.net',
          name: 'Skaia.net',
          desc: "An internet radio station for Homestuck music, and an archive that hosts fanmade MSPA resources including music, artwork, and group projects."
        },
        {
          id: 'rafe',
          type: 'info',
          url: 'http://rafe.name/homestuck/',
          name: 'The Acts and Pages of Homestuck',
          desc: "A map of Homestuck, with information and summaries of each act and section of the comic."
        },
        {
          id: 'mrcheeze',
          type: 'info',
          url: 'https://mrcheeze.github.io/andrewhussie/',
          name: 'The Works of Andrew Hussie',
          desc: "A collection including some of Andrew Hussie's early works that didn't make it into the collection, including Barty's Brew-Ha-Ha, art tutorials, and more."
        },
        {
          id: 'wheals',
          type: 'info',
          url: 'http://wheals.github.io/',
          name: 'wheals.github.io',
          desc: "wheals' Homestuck archive of social media, including various news interviews with Andrew."
        },
        {
          id: 'voxus',
          type: 'work',
          url: 'https://www.youtube.com/playlist?list=PLHO1rc05qiGtAidSBy_8jsEOlHXR6x4cd',
          name: "Voxus: Let's Read Homestuck",
          desc: "An extensive voice-acting readthrough of Homestuck. "
        },
        // {
        //   id: 'omega',
        //   type: 'social',
        //   url: 'https://omegaupdate.freeforums.net',
        //   name: "Omegaupdate Forums",
        //   desc: "One of several MSPA Forums replacements. This sprung up after the forums went down and the comic was on the hiatus known as the \"Omegapause\""
        // },
        // {
        //   id: 'xyz',
        //   type: 'social',
        //   url: 'https://forum.homestuck.xyz',
        //   name: "homestuck.xyz MSPA Forums",
        //   desc: "One of several MSPA Forums replacements. This is intended as a direct replacement of the classic MSPA Forums rather than as a forum for any particular adventure."
        // },
        {
          id: 'mozai',
          type: 'info',
          url: 'https://nepeta.mozai.com',
          name: "nepeta.mozai.com",
          desc: "<a href='https://mozai.com'>Mozai's</a> Homestuck fansite, with an archive of old fandom resources."
        }
      ]
    }
  },
  computed: {
    extSitesSorted(){
      return this.sortByChoices[this.sortBy](this.extSites)
    }
  }
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
    background: var(--system-background);
    background-color: var(--system-skycolor);

    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;

    color: var(--font-default);
    ::v-deep a {
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
