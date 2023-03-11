<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame noLog" >
      <div class="pageContent">
        <h2 class="pageTitle">MS Paint Fan Adventures</h2>
        <div class="adventureLinks">
          <div class="adventure" v-for="advlink in adventureLinks" :key="advlink.href">
            <a :href="advlink.href"><MediaEmbed :url="advlink.img" /><br /><span v-text="advlink.label" /></a>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'MSPFALog',
  props: [
  ],
  components: {
    NavBanner, PageFooter, MediaEmbed
  },
  data: function() {
    return {
      
    }
  },
  computed: {
    adventureLinks(){
      return Object.keys(this.$archive.mspfa).map(k => {
        return {
          href: `/mspfa/${k}/`,
          img: this.$archive.mspfa[k].o || "assets://images/mspalogo_mspa.png",
          label: this.$archive.mspfa[k].n
        }
      })
    }
  },
  methods: {
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

        .pageContent img {
            max-width: 100%;
        }
        
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
            width: 200px;
            img {
              object-fit: contain;
              width: 164px;
              height: 164px;
            }
          }
        }
      }
    }

  }
  
</style>

