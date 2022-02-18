<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
          <div class="mediaContent">
              <h2 class="pageTitle" v-text="thisPage.title" />
              <div class="media">
                  <Media v-for="url in thisPage.media" :key="url" :url="url" class="panel"/>
              </div>
          </div>    
          <div class="passwordField">
            <p>3NT3R P4SSWORD:</p>
            <div class="passwordForm">
              <input class="jumpBoxInput" type="text" spellcheck="false" v-model="inputText" v-on:keydown.enter="submitPassword"/>
              <button @click="submitPassword()">Submit</button>
            </div>
            <br>
            <p id="passwordFailure">&lt;- OR GO B4CK!!!</p>
          </div>  
          <div class="textContent">              
              <TextContent :key="thisPage.pageId" :content="passwordHint"/>
              <PageNav :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav" />
          </div>
      </div>
    </div>    
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import TextContent from '@/components/Page/PageText.vue'
import PageNav from '@/components/Page/PageNav.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

import PAGE from '@/components/Page/Page.vue'

export default {
  name: 'tzPassword',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, TextContent, PageNav, PageFooter
  },
  theme: PAGE.theme,
  title: PAGE.title,
  data: function() {
    return {
      inputText: '',
      passwordHint: `|P4SSWORD H1NT| <br /><span style="color: #008282">1F YOU DON'T KNOW TH3 P4SSWORD Y3T, 1T M34NS YOU'R3 NOT SUPPOS3D TO, DUMMY! GO B4CK!!!</span>`,
      failText: "&lt;- <b>WRONG!</b> GO B4CK!!!",
      passwords: {
        // "TESTPASS": '6',
        "HOME": '009059',
        "R3UN1ON": '009110',
        "FR4M3D": '009136',
        "MOM3NT": '009151',
        "MURD3R": '009189',
        "JUST1C3": '009205',
        "HONK": '009223',
        "FL1P": '009264'
      }
    }
  },
  computed: {
    pageNum: PAGE.computed.pageNum,
    thisPage: PAGE.computed.thisPage,
    pageCollection: PAGE.computed.pageCollection,
    storyId: PAGE.computed.storyId,
    isRyanquest: PAGE.computed.isRyanquest,
    nextPagesArray() {
      return []
    }
  },
  methods: {
    submitPassword(){
      const page_num = this.passwords[this.inputText.toUpperCase()]

      if (page_num){
        const prev_real_page = (page_num - 2).pad(6, '0') // haha. javascript
        if (!this.$pageIsSpoiler(prev_real_page)) {
          this.$logger.info(`Password ${this.inputText} leads to ${page_num}, and reader is up to ${prev_real_page}. Advancing plot`)
          this.$updateNewReader(page_num)
        } else {
          this.$logger.info(`Password ${this.inputText} leads to ${page_num}, but reader is not up to ${prev_real_page} yet. Still a spoiler.`)
        }
        this.$pushURL(`/mspa/${page_num}`)
      } else {
        document.getElementById('passwordFailure').innerHTML = this.failText
      }
    },
    keyNavEvent: PAGE.methods.keyNavEvent
  }
}
</script>

<style scoped lang="scss">
  .pixelated::v-deep img{
    image-rendering: pixelated;
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

          .media{
            display: flex;
            align-items: center;
            flex-flow: column;

            .panel {
              &:not(:last-child) {
                margin-bottom: 17px;
              }
            }            
          }
        }

        .passwordField {
          font-family: Verdana, Arial, Helvetica, sans-serif;
          font-weight: normal;
          display: flex;
          flex-flow: column;
          align-items: center;
        }
        .textContent{
          margin-top: 30px;
          width: 600px;

          ::v-deep .pageNavigation {
            .nextArrow {
              display: none;
            }
            .meta {
              visibility: hidden;
            }
          }
        }
      }	
    }

  }
  

</style>

