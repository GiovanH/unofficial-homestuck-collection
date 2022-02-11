<template>
<div class="pageBody customStyles">
  <NavBanner useCustomStyles="true" />
  <div class="pageFrame">
    <div class="pageContent">

      <a href="/news"><Media class="logo" :url="newsLogo" /></a>
      
      <div class="newsYear" v-for="newsYear in filteredSortedPosts" :key="newsYear.yearNo">
        <h2 class="yearTitle" :class="[newsYear.yearNo]" v-text="'20'+newsYear.yearNo" @click="toggleYear(newsYear.yearNo)" />
        <ul v-if="activeYear == newsYear.yearNo || showAllYears">
          <li v-for="post in newsYear.posts" class="post" v-html="post.html" :key="post.id" />

          <li v-if="newsYear.posts.length < newsposts[newsYear.yearNo].length" class="post notice">
            {{newsposts[newsYear.yearNo].length - newsYear.posts.length}} posts remain in 20{{newsYear.yearNo}}.
          </li>
        </ul>
      </div>

      <div class="newsYear" v-if="!showAllYears">
        <h2 class="yearTitle" @click="activeYear = 'ALL'">Show All</h2>
      </div>
      
      <p v-if="isCutoff" class="cutoff">Keep reading Homestuck to unlock more posts!</p>

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
  title: () => "MSPA Newsposts",
  data() {
    return {
      activeYear: undefined
    }
  },
  computed: {
    showAllYears() {
      return this.activeYear == "ALL";
    },
    newsLogo() {
      return this.$root.tabTheme.rendered == 'A6A6' ? '/images/a6a6_news.png' : '/images/news.png'
    },
    newsposts(){
      return this.$archive.news
    },
    filteredPosts(){
      // Returns {yearNo: postList} for all years with unlocked news.
      if (!this.$isNewReader)
        return this.newsposts
      
      return Object.keys(this.newsposts).reduce((result, yearNo) => {
        const newPosts = this.newsposts[yearNo].filter((post) => !this.$timestampIsSpoiler(post.timestamp))
        if (newPosts.length > 0) {
          result[yearNo] = (result[yearNo] || []).concat(newPosts)
        }
        return result
      }, {})
    },
    filteredSortedPosts(){
      // Vue won't let us sort by keys in the filter, so we have to make this intermediate.
      // Returns [{yearNo: yearNo, posts: postList}] with the years sorted in order.
      // Also, this sorts the postslist by timestamp, just in case.

      const timestampSort = (a, b) => (a.timestamp > b.timestamp) ? 1 : -1
      return Object.keys(this.filteredPosts).sort().map(yearNo => (
        {yearNo, posts: this.filteredPosts[yearNo].sort(timestampSort)}
      ))
    },
    isCutoff(){
      return this.$isNewReader
    }
  },
  methods: {
    toggleYear(year) {
      this.activeYear = this.activeYear != year ? year : undefined
      if (this.activeYear && !this.routeParams.id) this.$nextTick(() => {this.jumpToClass(year)})
    },
    filterIa(){
      this.$el.querySelectorAll("div.newsYear").forEach(div => {
        const year = div.querySelector(".yearTitle").textContent
        this.filterLinksAndImagesInternetArchive(div, year)
      })
    },
    jumpToClass(id){
      const className = id || ""
      const el = this.$el.getElementsByClassName(className)[0]
      this.$logger.info(`Now jumping ${id}`, el)
      if (el) {
        el.scrollIntoView(true)
      } else {
        document.getElementById(this.$localData.tabData.activeTabKey).scrollTop = 0
      }
    },
    jumpFromUrl(){
      if (this.routeParams.id) {
        const year = /\d+$/.exec(this.routeParams.id)[0]
        if (year in this.newsposts) {
          this.activeYear = year
          this.$nextTick(()=>{
            this.jumpToClass(this.routeParams.id)
          })
        }
      }
    }
  },
  watch: {
    'tab.history': function (to, from) {
      this.jumpFromUrl()
    },
    'activeYear'(to, from) {
      this.$nextTick(() => {
        this.filterLinksAndImages()
        this.filterIa()
      })
    }
  },
  mounted(){
    this.jumpFromUrl()
    this.$nextTick(() => {
      this.filterLinksAndImages()
      this.filterIa()
    })
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