<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <MediaEmbed url="extras/PS_titlescreen/PS_titlescreen.swf"/>
        <FlashCredit pageId="ps_titlescreen"/>
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
import FlashCredit from '@/components/UIElements/FlashCredit.vue'

export default {
  name: 'ps_titlescreen',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter, FlashCredit
  },
  title: () => "Problem Sleuth",
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
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

        max-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          margin-bottom: 25px;
        }
        .creditWrapper {
          margin-top: 30px;
        }

      }	
    }
  }
</style>

