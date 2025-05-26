<template>
  <div class="pageBody customStyles" :class="{pixelated: $localData.settings.pixelScaling}">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <MediaEmbed v-if="logo" :url="logo" class="logo"/>
      <slot v-if="noPageContent"></slot>
      <div v-else class="pageContent">
        <slot>
          <h2 class="pageTitle"> </h2>
          <div class="media" ref="media">
            <div class="panel"
              style="width: 650px; height: 450px; border: none;" />
          </div>
        </slot>
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
  name: 'GenericPage',
  props: ['logo', 'noPageContent'],
  components: {
    NavBanner, PageFooter, MediaEmbed
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
    ::v-deep {
      a { color: var(--page-links); }
      a:link:active { color: var(--page-links-active); }
    }

    //Small screen check
    @media (max-width: 950px) {
      &{
        overflow-x: hidden;
        height: max-content;
        .navBanner {
          max-width: 100%;
        }
        .pageFrame {
          max-width: 100%;
        }
        ::v-deep div.footer {
          max-width: 100%;
        }
      }
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      // Elements position top-to-bottom, centered.
      flex: 0 1 auto;
      display: flex;
      align-items: center;
      flex-direction: column;

      .pageContent {
        background: var(--page-pageContent);
        max-width: 950px;
        min-width: 650px;

        // Elements position top-to-bottom, centered.
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        h2.pageTitle {
          max-width: 100%;
          text-align: center;
          line-height: 1.1;
          font-size: 32px;
          padding: 15px 0;
        }

        .logo {
          margin-bottom: 25px;
        }

        .mediaContent {
          display: flex;
          align-items: center;
          flex-flow: column;
          .panel {
            &:not(:last-child) {
              margin-bottom: 20px;
            }
          }
        }

        .textContent {
          margin-top: 15px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          p {
            margin-top: 15px;
          }
        }

      }	
    }
  }
  // MSPA logo hack (see /unlock/x)
  // .retro {
  //   .pageContent {
  //     background: #EEEEEE !important;
  //   }
  //   .mediaContent, .textContent {
  //     background: white;
  //   }
  // }
</style>
