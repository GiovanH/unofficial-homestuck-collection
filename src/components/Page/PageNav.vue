<template>
  <nav class="pageNavigation">
    <div class="nextArrow" v-if="nextPages.length > 0">
      <div v-for="page in nextPages" :key="page.pageId">
        <p v-if="('pageId' in page && 'title' in page)">
          &gt; <a :href="$resolvePath(`${mspaBase}/${page.pageId}`)" class="nextArrowLink" v-html="commandText(page)" />
        </p>
      </div>
    </div>
    <div class="footerNav" >
      <ul class="navOptions">
        <li v-if="pageNumber.p !== '1'">
          <a :href="startOverUrl" class="startOver">Start Over</a>
        </li>
        <li v-if="'previous' in thisPage">
          <a :href="backUrl" class="goBack">Go Back</a>
        </li>
      </ul>
      <ul class="meta">
        <li v-if="'timestamp' in thisPage && !!getTimestamp()">
          <div class="timestamp" v-html="this.getTimestamp()" />
        </li>
        <li>
          <a class="vizLink" :href="vizLink" v-html="pageIdText" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'pageNav',
  props: [
    'thisPage', 'nextPages'
  ],
  components: {
  },
  data() {
    return {
      DateTime: require('luxon').DateTime
    }
  },
  computed: {
    mspaBase(){
      return this.thisPage.isRyanquest ? 'ryanquest' : 'mspa'
    },
    backUrl() {
      return this.$resolvePath(`${this.mspaBase}/${this.thisPage.previous}`)
    },
    startOverUrl() {
      return this.$resolvePath(`${this.mspaBase}/${this.$getStory(this.thisPage.pageId)}`)
    },
    pageNumber() {
      if (this.mspaBase == 'ryanquest') return {s: 'ryanquest', p: parseInt(this.thisPage.pageId)}
      else return this.$mspaToViz(this.thisPage.pageId)
    },
    pageIdText() {
      let id = this.thisPage.pageId
      let story = this.mspaBase // this.thisPage.storyId
      return this.$resolvePath(`${story}/${id}`)    
    },
    vizLink() {
      let story 
      if (this.pageNumber.s == 'homestuck') story = 'story/'
      else story = this.pageNumber.s + '/'
      return `https://homestuck.com/${story + this.pageNumber.p}` 
    }
  },
  methods: {
    nextUrl(page) {
      // Used by keyboard navigation from TabFrame
      return this.$resolvePath(`${this.mspaBase}/${page.pageId}`)
    },
    commandText(page) {
      // Controls what actually shows up as the command link
      function escapeHTML(str){return new Option(str).innerHTML}
      return escapeHTML(page.title)
    },
    getTimestamp() {
      // Returns a formatted timestamp OR undefined
      // let date = new Date(parseInt(this.thisPage.timestamp) * 1000)
      // let options = {timeZone: "America/New_York", timeZoneName:"short", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit",}
      // let result = date.toLocaleDateString(undefined, options)
      if (!this.thisPage.timestamp) {
        return undefined
      } else {
        try {
          return this.DateTime.fromSeconds(Number(this.thisPage.timestamp))
            .setZone("America/New_York")
            .toFormat("MM/dd/yyyy, t ZZZZ")
        } catch {
          return "Invalid Date"
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .nextArrow{
    margin: 0 0 30px 0;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: x-large;
    font-weight: normal;
    color: var(--page-nav-divider);

    a {
      color: var(--page-links);
    }
  }
  .footerNav{
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    line-height: 10px;
    ul {
      list-style: none;
      font-size: 10px;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      li {
        float: left;
        padding-bottom: 15px;
        * {display: inline-block;}
        &:not(:last-child):after {
          content: "|";
          margin: 0 0.3em
        }
      }
    }
    .navOptions {
      color: var(--page-nav-divider);

      a {
        color: var(--page-links);
      }
    }
    .meta {
      font-weight: 300;
      color: var(--page-nav-meta);
      a {
        color: var(--page-nav-meta);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>

