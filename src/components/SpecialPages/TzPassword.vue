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

export default {
  name: 'tzPassword',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, TextContent, PageNav,PageFooter
  },
  data: function() {
    return {
      inputText: '',
      passwordHint: `|P4SSWORD H1NT| <br /><span style="color: #008282">1F YOU DON'T KNOW TH3 P4SSWORD Y3T, 1T M34NS YOU'R3 NOT SUPPOS3D TO, DUMMY! GO B4CK!!!</span>`,
      failText: "&lt;- <b>WRONG!</b> GO B4CK!!!",
      passwords: {
        "TESTPASS": '/mspa/6',
        "HOME": '/mspa/009059',
        "R3UN1ON": '/mspa/009110',
        "FR4M3D": '/mspa/009136',
        "MOM3NT": '/mspa/009151',
        "MURD3R": '/mspa/009189',
        "JUST1C3": '/mspa/009205',
        "HONK": '/mspa/009223',
        "FL1P": '/mspa/009264'
      }
    }
  },
  computed: {
    pageNum() {
      return this.$isVizBase(this.routeParams.base) ? this.$vizToMspa(this.routeParams.base, this.routeParams.p).p : this.routeParams.p
    },
    thisPage() {
      return this.$archive.mspa.story[this.pageNum]
    },
    nextPagesArray() {
      return []
    }
  },
  methods: {
    // TODO: Passwords should be stored as data
    submitPassword(){
      let url = this.passwords[this.inputText.toUpperCase()]

      if (url){
        this.$pushURL(url)
      } else {
        document.getElementById('passwordFailure').innerHTML = this.failText
      }
    },
    keyNavEvent(dir) {
      if (dir == 'left' && 'previous' in this.thisPage && this.$parent.$el.scrollLeft == 0) this.$pushURL(this.$refs.pageNav.backUrl)
    }
  },
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

