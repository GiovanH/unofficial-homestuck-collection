<template>
  <div class="pageBody echidna" :data-pageid="`${storyId}/${thisPage.pageId}`">
    <div class="pageFrame">
      <div class="pageContent">
        <Footnotes :pageId="thisPage.pageId" preface />
          <Media url="/storyfiles/hs2/echidna/echidna.swf" />
          <div class="mediaContent">
            <Media :url="thisPage.media[0]" class="hscroll" />
          </div>      
          <div class="textContent">
            <FlashCredit  :pageId="thisPage.pageId" />
            <PageNav baseURL="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav"/>
          </div>
        <Footnotes :pageId="thisPage.pageId" />
      </div>
    </div>
  </div>
</template>

<script>
import PAGE from '@/components/Page/Page.vue'

export default {
  extends: PAGE,
  name: 'echidna'
}
</script>

<style scoped lang="scss">
  .pageBody {
    background: #000;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .pageFrame {
    width: 1200px;
    padding-top: 60px;
    margin: 0 auto;

    flex: 0 1 auto;
    display: flex;
    justify-content: center;

      .pageContent {
        max-width: 1100px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .mediaContent {
          width: 1100px; 
          display: flex;
          overflow-x: scroll;

          align-items: flex-start;
          flex-flow: column;
        }

        .textContent{
          margin-top: 30px;
          width: 600px;

          .creditWrapper {
            max-width: 280px;
          }
        }
      }
    }
  }
</style>

