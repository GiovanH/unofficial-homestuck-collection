<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame" v-if="log">
      <div class="pageContent">
        <h2 class="pageTitle">Adventure Logs</h2>
        <a :href="reverseLink" class="switchOrder">Reverse order</a>
        <div class="logItems" v-html="log">
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
          <div class="adventure"><a href="/log/1"><Media url="/images/archive_jb.gif" /><br>Jailbreak</a></div>
          <div class="adventure"><a href="/log/2"><Media url="/images/archive_bq.gif" /><br>Bard Quest</a></div>
          <div class="adventure"><a href="/log/4"><Media url="/images/archive_ps.gif" /><br>Problem Sleuth</a></div>
          <div class="adventure"><a href="/log/5"><Media url="/images/archive_beta.gif" /><br>Homestuck Beta</a></div>
          <div class="adventure"><a href="/log/6"><Media url="/images/archive_hs.gif" /><br>Homestuck</a></div>
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
      reverseText: ['oldest', 'newest']
    }
  },
  computed: {
    log() {
      // OuterHTML of log (yikes!)
      if (this.routeParams.mode) {
        this.sort = /^\d_rev$/.test(this.routeParams.mode) ? 'rev' : 'log'
        let story = this.routeParams.mode.charAt(0)

        return this.storyLog(story)
        
        // if (story in this.$archive.log[this.sort]){
        //   let logData = this.$archive.log[this.sort][story]
        //   if (this.$isNewReader) {
        //     let regex = this.sort == 'log' ? new RegExp(`^(.*${this.$localData.settings.newReader.current}">".*?"<\/a><br>).*$`) : new RegExp(`^.*?(.{12}<a href="\/mspa\/${this.$localData.settings.newReader.current}.*)$`)
        //     return logData.replace(regex, '$1')
        //   }
        //   else {
        //     return logData
        //   }
        // }
      }
      else return undefined
    },
    reverseLink(){
      return /^\d_rev$/.test(this.routeParams.mode) ? `/log/${this.routeParams.mode.charAt(0)}` : `/log/${this.routeParams.mode}_rev`
    },
  },
  methods:{
    getSorter(default_="asc"){
      let sort_order = this.sort = /^\d_rev$/.test(this.routeParams.mode) ? 'asc' : 'desc'
      let sort_fn = sort_methods[sort_order]
      if (!sort_fn)
          sort_fn = sort_methods[default_]
      return sort_fn
    },
    storyLog(story_id) {
      return this.$getAllPagesInStory(story_id).map((page_num) => 
        this.getLogEntry(page_num)
      ).sort(this.getSorter())
    },
    getLogEntry(page_num) {
      let page = this.$archive.mspa.story[page_num]
      return {
        title: page.title,
        page_num: page.pageId,
        href: `/mspa/${page.pageId}`,
        date: new Date(page.timestamp * 1000)
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

