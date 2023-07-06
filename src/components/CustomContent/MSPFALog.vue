<template>
  <GenericPage v-if="log">
    <h2 class="pageTitle">Adventure Log</h2>
    <hr />
    <h2 class="storyname" v-text="story.n" />
    <hr />
    <a v-if="log.length > 0" @click="sortOrder = sortOrderNext" class="link switchOrder">{{ reverseText }}</a>
    <div class="logItems" v-if="log.length > 0">
      <template v-for="page in log">
        {{page.date}} - <a :href="page.href">{{page.title || 'Next.'}}</a><br/>
      </template>
    </div>
  </GenericPage>
  <MediaEmbed v-else url="/advimgs/jb/mspaintadventure08.gif" />
</template>

<script>

import GenericPage from '@/components/UIElements/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

const { DateTime } = require('luxon');

const sort_methods = {
    asc: (a, b) => (a.page_num > b.page_num) ? 1 : -1,
    desc: (a, b) => (a.page_num < b.page_num) ? 1 : -1,
    alpha: (a, b) => (a.title > b.title) ? 1 : -1,
    random: (a, b) => 0.5 - Math.random()
}

export default {
  name: 'MSPFALog',
  props: [
    'tab', 'storyId'
  ],
  components: {
    GenericPage, MediaEmbed
  },
  data: function() {
    return {
      sort: 'log',
      sortOrder: 'asc',
      sortNames: {
        asc: 'oldest to newest',
        desc: 'newest to oldest'
      }
    }
  },
  computed: {
    story(){
      if (this.storyId)
        return this.$archive.mspfa[this.storyId]
      return undefined
    },
    log() {
      // depends on
      // this.$localData.settings.newReader;

      // A sorted list of log objects
      if (!this.storyId) 
        return undefined

      return this.story.p.map(page_i => 
        this.getLogEntry(this.storyId, page_i)
      ).sort(this.sorter)
    },
    reverseText(){
      // Todo
      return "View " + (this.sortNames[this.sortOrderNext] || "log")
    },
    sortOrderNext(){
      let next = (this.sortOrder == 'desc' ? 'asc' : 'desc')
      return next
    },
    sorter(){
      // The sorter function that .sort() keys
      let default_="asc"
      return sort_methods[this.sortOrder] || sort_methods[default_]
    }
  },
  methods: {
    getLogEntry(story_id, page) {
      // Returns the actual entry object for a given page
      // needs the story_id because ryanquest

      let time_zone = "America/New_York"
      return {
        title: page.c,
        page_num: page.i,
        href: `/mspfa/${this.storyId}/${page.i}`,
        date: (page.d ? DateTime.fromMillis(Number(page.d)).setZone(time_zone).toFormat("MM/dd/yy") : "??/??/??")
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .pageContent {
    width: 650px;
  }
  a, .link {
    text-decoration: underline;
    cursor: pointer;
  }
  h2 {
    font-weight: bold;
    font-family: "Press Start 2P";
    margin: 8px 0;
    color: #cccccc;
    text-shadow: 0 2px #888888;
    text-transform: uppercase;
    letter-spacing: 2px;
    &.storyname {
      color: #5caedf;
      text-shadow: 0 2px #2a6b7d;
      margin: 1em;
    }
  }
  hr {
    width: 100%;
    background: var(--page-pageFrame);
    margin: 0;
    height: 1em;
    border: none;
  }
  .switchOrder {
    padding-left: 30px;
  }
  .logItems {
    padding: 30px;

    // font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 12px;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    // font-size: 10px;
  }

</style>

