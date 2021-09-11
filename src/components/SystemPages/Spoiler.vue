<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
          <div class="mediaContent">
              <h2 class="pageTitle">What are you doing here?</h2>
              <MediaEmbed url="/advimgs/bq/bq008b.gif" />
          </div>
          <div class="textContent">
            <p>You are not far enough into Homestuck to see this! Come back later.</p>
          </div>
      </div>
    </div>    
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

export default {
  name: 'Spoiler',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
  title: () => "Spoilers!",
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }

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
        
        max-width: 950px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .mediaContent {
          display: flex;
          align-items: center;
          flex-flow: column;

          h2.pageTitle {
            max-width: 590px;
            text-align: center;
            line-height: 1.1;
            font-size: 32px;
            padding: 15px 0;
          }
        }

        .textContent{
          margin: 30px 0;
          width: 600px;
          text-align: center;
        }
      }	
    }

  }
  

</style>

