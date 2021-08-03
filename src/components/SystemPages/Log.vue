<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame" v-if="log">
      <div class="pageContent">
        <h2 class="pageTitle">Adventure Logs</h2>
        <a :href="reverseLink" class="switchOrder">{{ reverseText }}</a>
        <div class="logItems">
          <template v-for="page in log">
            {{page.date}} - <a :href="page.href">{{page.title}}</a><br/>
          </template>
        </div>
      </div>
    </div>
    <div class="pageFrame noLog" v-else >
      <div class="pageContent">
        <h2 class="pageTitle">Adventure Logs</h2>
        <div class="adventureLinks">
          <div class="adventure" v-for="advlink in adventureLinks" :key="advlink.href">
            <a :href="advlink.href"><Media :url="advlink.img" /><br /><span v-text="advlink.label" /></a>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>

import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

const { DateTime } = require('luxon');

const sort_methods = {
    asc: (a, b) => (a.page_num > b.page_num) ? 1 : -1,
    desc: (a, b) => (a.page_num < b.page_num) ? 1 : -1,
    alpha: (a, b) => (a.title > b.title) ? 1 : -1,
    random: (a, b) => 0.5 - Math.random()
}

export default {
  name: 'log',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, PageFooter
  },
  data: function() {
    return {
      sort: 'log',
      sortNames: {
        asc: 'oldest to newest',
        desc: 'newest to oldest'
      },
      adventureLinks: [
          {href: "/log/1", img: "/images/archive_jb.gif", label: "Jailbreak"},
          {href: "/log/2", img: "/images/archive_bq.gif", label: "Bard Quest"},
          {href: "/log/4", img: "/images/archive_ps.gif", label: "Problem Sleuth"},
          // {href: "/log/5", img: "/images/archive_beta.gif", label: "Homestuck Beta"},
          {href: "/log/6", img: "/images/archive_hs.gif", label: "Homestuck"},
          // {href: "/log/ryanquest", img: "/images/archive_rq.png", label: "Ryanquest"}
      ]
    }
  },
  computed: {
    storyId(){
      if (!this.routeParams.mode) {
        // We are on the root page
        return undefined
      }

      // TODO: Replace character splicing with something actually resembling parsing
      let story = this.routeParams.mode.charAt(0)
      if (story == "r")
        story = "ryanquest"

      return story
    },
    log() {
      // depends on
      // this.$localData.settings.newReader;

      // A sorted list of log objects
      if (!this.storyId) 
        return undefined

      return this.storyLogRaw(this.storyId).filter(page => 
        !this.$pageIsSpoiler(page.page_num)
      ).sort(this.sorter)
    },
    reverseLink(){
      return /^\d_asc$/.test(this.routeParams.mode) ? `/log/${this.routeParams.mode.charAt(0)}` : `/log/${this.routeParams.mode}_asc`
    },
    reverseText(){
      // Todo
      return "View " + (this.sortNames[this.sortOrderNext] || "log")
    },
    sortOrderNext(){
      let next = (this.sortOrder == 'desc' ? 'asc' : 'desc')
      return next
    },
    sortOrder(){
      // The text key that defines the sort order
      if (!this.routeParams.mode)
        // Sort order w/o selected log???
        return undefined

      let sort_order = /^\d_asc$/.test(this.routeParams.mode) ? 'asc' : 'desc'
      return sort_order
    },
    sorter(){
      // The sorter function that .sort() keys
      let default_="asc"
      return sort_methods[this.sortOrder] || sort_methods[default_]
    },
    storyLogRaw() {
      // The unsorted story log
      this.$archive;

      // console.log("Recalculating raw story log memo")
      // Vue should really be able to keep track of this, but it just can't. 
      // TODO: story_id is user-input, needs to be error checked
      
      return this.memoized(story_id => {
        // console.log("Recalculating raw story log (BAD)")

        return this.$getAllPagesInStory(story_id).map(page_num => 
          this.getLogEntry(story_id, page_num)
        )
      }, "storyLogRaw", 10)
    }
  },
  methods: {
    getLogEntry(story_id, page_num) {
      // Returns the actual entry object for a given page
      // needs the story_id because ryanquest

      // TODO: Memoize this?
      let story = (story_id == "ryanquest" ? this.$archive.mspa.ryanquest : this.$archive.mspa.story)
      let page = story[page_num];
      let page_type = (story_id == "ryanquest" ? "ryanquest" : "mspa")
      let time_zone = "America/New_York"
      return {
        title: page.title,
        page_num: page.pageId,
        href: `/${page_type}/${page.pageId}`,
        date: (page.timestamp ? DateTime.fromSeconds(Number(page.timestamp)).setZone(time_zone).toFormat("MM/dd/yy") : "??/??/??")
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep a{
    color: var(--page-links);
  }
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      .pageContent{
        background: var(--page-pageContent);
        
        width: 650px;     
        h2.pageTitle {
          max-width: 590px;
          text-align: center;
          line-height: 1.1;
          font-size: 32px;
          padding: 15px 0;
          margin: 0 auto;
        }
        .adventureLinks {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          margin: 0 auto;
          width: 600px;

          .adventure {
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.1;
            font-size: 18px;
          }
        }
        .switchOrder {
          padding-left: 30px;
        }
        .logItems {
          padding: 30px;

          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 12px;
        }
      }
    }

  }
  

</style>

