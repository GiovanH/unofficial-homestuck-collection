<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame" v-if="log">
      <div class="pageContent">
        <h2 class="pageTitle">Adventure Logs</h2>
        <a :href="reverseLink" class="switchOrder">Reverse order</a>
        <div class="logItems" v-html="log" />
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
      if (this.routeParams.mode) {
        this.sort = /^\d_rev$/.test(this.routeParams.mode) ? 'rev' : 'log'
        let story = this.routeParams.mode.charAt(0)
        
        if (story in this.$archive.log[this.sort]){
          let logData = this.$archive.log[this.sort][story]
          if (this.$isNewReader) {
            let regex = this.sort == 'log' ? new RegExp(`^(.*${this.$localData.settings.newReader.current}">".*?"<\/a><br>).*$`) : new RegExp(`^.*?(.{12}<a href="\/mspa\/${this.$localData.settings.newReader.current}.*)$`)
            return logData.replace(regex, '$1')
          }
          else {
            return logData
          }
        }
      }
      else return undefined
    },
    reverseLink(){
      return /^\d_rev$/.test(this.routeParams.mode) ? `/log/${this.routeParams.mode.charAt(0)}` : `/log/${this.routeParams.mode}_rev`
    },
  },
  methods:{
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

