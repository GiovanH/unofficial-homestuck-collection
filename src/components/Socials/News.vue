<template>
<div class="pageBody customStyles">
  <NavBanner useCustomStyles="true" />
  <div class="pageFrame">
    <div class="pageContent">

      <a href="/news"><Media class="logo" :url="newsLogo" /></a>
      
      <div class="newsYear" v-for="year in filteredYears" :key="year.year">
        <h2 class="yearTitle" :class="[year.year]" v-text="'20'+year.year" @click="toggleYear(year.year)" />
        <ul v-if="activeYear == year.year">
          <li v-for="post in year.posts" class="post" v-html="post.html" :key="post.id" />
          <li v-if="year.posts.length < $archive.social.news[year.year].length" class="post notice">
            {{$archive.social.news[year.year].length - year.posts.length}} posts remain in 20{{year.year}}.
          </li>
        </ul>
      </div>
      
      <p v-if="cutoff" class="cutoff">Keep reading Homestuck to unlock more posts!</p>

    </div>
  </div>
  <PageFooter />
</div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

import Resources from '@/resources.js'

export default {
  name: 'news',
  mixins: [ Resources.UrlFilterMixin ],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, NavBanner, PageFooter
  },
  data() {
    return {
      activeYear: undefined,
      cutoff: false
    }
  },
  computed: {
    newsLogo() {
      return this.$root.theme === 'A6A6' ? '/images/a6a6_news.png' : '/images/news.png'
    },
    filteredYears(){
      let newsposts = Object.keys(this.$archive.social.news).sort().map(year => ({year, posts: this.$archive.social.news[year]}))
      if (!this.$isNewReader) return newsposts
      else {
        this.cutoff = true
        return newsposts.filter(year => {
          year.posts = year.posts.filter(post => post.timestamp <= this.$archive.mspa.story[this.$localData.settings.newReader.current].timestamp)
          return year.posts.length > 1 
        })
      }
    }
  },
  methods:{
    toggleYear(year) {
      this.activeYear = this.activeYear != year ? year : undefined
      if (this.activeYear) this.$nextTick(() => {this.jumpToClass(year)})
    },
    jumpToClass(id){
      let className = id || ""
      let el = document.getElementById(this.tab.key).getElementsByClassName(className.toLowerCase())[0]
      if (el) {
        el.scrollIntoView(true)
      }
      else {
        document.getElementById(this.$localData.tabData.activeTabKey).scrollTop = 0
      }
    }
  },
  watch: {
    'tab.history': function (to, from) {
      if (this.routeParams.id) {
        let year = this.routeParams.id.slice(5, 7)
        if (year in this.$archive.social.news) this.activeYear = year
      }
      //$nextTick doesn't work for some reason, so we're hacking the shit out of it
      //the timeout basically just hangs until the dom is ready
      setTimeout(() => {this.jumpToClass(this.routeParams.id)}, 0)
    }
  },
  updated(){
    this.filterLinksAndImages()
  },
  mounted(){
    if (this.routeParams.id) {
      let year = this.routeParams.id.slice(5, 7)
      if (year in this.$archive.social.news) this.activeYear = year
    }
    setTimeout(() => {this.jumpToClass(this.routeParams.id)}, 0)
    this.filterLinksAndImages()
  }
}
</script>

<style lang="scss" scoped>
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
      justify-content: center;
      
      .pageContent {
        background: var(--page-pageContent);

        width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          margin: 25px 0;
        }
        .newsYear {
          width: 100%;
          padding: 5px 0;
          text-align: center;
          border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));

          .yearTitle {
            line-height: 1.1;
            font-size: 32px;
            &:hover {
              cursor: pointer;
              text-decoration: underline;
              user-select: none;
            }
          }
        }
        .post {
          list-style: none;
          padding: 20px;
          padding-top: 0;

          text-align: center;
          font-weight: normal;
          font-size: 16px;

          &:not(:last-child) {
            border-bottom: solid 2px var(--page-pageBorder, var(--page-pageFrame));
          }

          &.notice {
            padding-top: 25px;
          }
          
          ::v-deep {
            .link {
              font-size: 24px;
              font-weight: bold;
            }
            .date {
              border: none;
              padding: 20px;
            }
            a {
              color: var(--page-links);
            }
            p {
              margin: 16px 0; 
            }
            table {
              border: medium solid #0000FF;
              padding: 3px;
            }
            td {
              border: thin solid #0000FF;
              padding: 3px;

            }
          }
        }
        .cutoff {
          border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));
          text-align: center;
          padding: 15px;
          width: 100%;
        }
      }	
    }
  }
</style>