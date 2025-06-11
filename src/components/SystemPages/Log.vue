<template>
  <GenericPage>
    <div class="pageContent" v-if="log">
      <h2 class="pageTitle">Adventure Logs</h2>
      <a  v-if="log.length > 0" :href="reverseLink" class="switchOrder">{{ reverseText }}</a>
      <div class="logItems" v-if="log.length > 0">
        <span class="line" v-for="page in log">
          {{page.date}} - <a :href="page.href">{{page.title}}</a>
          <!-- <br/> -->
        </span>
      </div>
      <MediaEmbed v-else url="/advimgs/jb/mspaintadventure08.gif" />
    </div>
    <div class="pageContent" v-else>
      <h2 class="pageTitle">Adventure Logs</h2>
      <div class="adventureLinks">
        <div class="adventure" v-for="advlink in adventureLinks" :key="advlink.href">
          <a :href="advlink.href"><Media :url="advlink.img" /><br /><span v-text="advlink.label" /></a>
        </div>
      </div>
    </div>
  </GenericPage>
</template>

<script>

import Media from '@/components/UIElements/MediaEmbed.vue'
import GenericPage from '@/components/UIElements/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

const { DateTime } = require('luxon')

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
    Media, GenericPage, MediaEmbed
  },
  title(ctx){
    const adventure = ctx.routeParams.mode ? ctx.routeParams.mode[0] - 1 : undefined
    const suffix = [
      " - Jailbreak", " - Bard Quest", "", " - Problem Sleuth", " - Homestuck Beta", " - Homestuck"
    ][adventure]
    return "Adventure Log" + (suffix || '')
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
          {href: "/log/6", img: "/images/archive_hs.gif", label: "Homestuck"}
          // {href: "/log/ryanquest", img: "/images/archive_rq.png", label: "Ryanquest"}
      ],
      storyLogRaw: this.memoized(story_id => {
        // console.log("Recalculating raw story log (BAD)")

        return this.$getAllPagesInStory(story_id).map(page_num =>
          this.getLogEntry(story_id, page_num)
        )
      }, "storyLogRaw", 10)
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
      const next = (this.sortOrder == 'desc' ? 'asc' : 'desc')
      return next
    },
    sortOrder(){
      // The text key that defines the sort order
      if (!this.routeParams.mode)
        // Sort order w/o selected log???
        return undefined

      const sort_order = /^\d_asc$/.test(this.routeParams.mode) ? 'asc' : 'desc'
      return sort_order
    },
    sorter(){
      // The sorter function that .sort() keys
      const default_ = "asc"
      return sort_methods[this.sortOrder] || sort_methods[default_]
    }
  },
  methods: {
    getLogEntry(story_id, page_num) {
      // Returns the actual entry object for a given page
      // needs the story_id because ryanquest

      // TODO: Memoize this?
      const story = (story_id == "ryanquest" ? this.$archive.mspa.ryanquest : this.$archive.mspa.story)
      const page = story[page_num]
      const page_type = (story_id == "ryanquest" ? "ryanquest" : "mspa")
      const time_zone = "America/New_York"
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

.pageContent {
  align-items: unset !important;
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
  // width: calc(100% - 60px);
  padding: 30px;

  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 12px;
  span.line {
    display: block;
  }
}

</style>
