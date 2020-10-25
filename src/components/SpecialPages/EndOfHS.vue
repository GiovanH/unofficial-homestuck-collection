<template>
  <div class="pageBody" :class="bgClass">
    <div class="tall">
      <div class="main">
        <div class="header">
          <Banner :id="tab.key" :page="thisPage"/>
        </div>
        <div class="vid">
          <Media :url="thisPage.media[0]" />
        </div>      
        <div class="links">
          <FlashCredit  :pageId="thisPage.pageId" />
          <PageNav base="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageNav from '@/components/Page/PageNav.vue'
import Banner from '@/components/Page/PageBanner.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'

export default {
  name: 'EndOfHS',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, PageNav, Banner, FlashCredit
  },
  data: function() {
    return {
    }
  },
  computed: {
    bgClass() {
      return {
        collide: this.pageNum === "009987",
        act7: this.pageNum === "010027",
        credits: this.pageNum === "010030"
      }
    },
    pageNum() {
      return this.$isVizBase(this.routeParams.base) ? this.$vizToMspa(this.routeParams.base, this.routeParams.p).p : this.routeParams.p
    },
    storyNum() {
      return this.$getStory(this.pageNum)
    },
    thisPage() {
      return this.$archive.mspa.story[this.pageNum]
    },
    nextPagesArray() {
      console.log(`${this.tab.url} - ${this.thisPage.title}`)
      let nextPages = []
      this.thisPage.next.forEach(nextID => {
        nextPages.push(this.$archive.mspa.story[nextID])
      })
      return nextPages
    }
  },
  methods:{
    keyNavEvent(dir) {
      if (dir == 'left' && 'previous' in this.thisPage && this.$parent.$el.scrollLeft == 0) this.$pushURL(this.$refs.pageNav.backUrl)
      else if (dir == 'right' && this.nextPagesArray.length == 1 && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth) this.$pushURL(this.$refs.pageNav.nextUrl(this.nextPagesArray[0]))
    }
  },
  beforeDestroy() {
    //Trigger EOH notifications if leaving new-reader mode
    if (this.pageNum === "010030") this.$popNotifFromPageId('010030')
  }
}
</script>

<style scoped lang="scss">
    //Classes copied from original pages to preserve original theme through style changes

  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    &.collide {
      background: #000;
      .tall {          
        background-color: #323232;          
        border-left: 3px solid #535353;
        border-right: 3px solid #535353;

        .main {
            background-color: #323232;
            border-left: 4px solid #454545;
            border-right: 4px solid #454545;
        }
        .header {
            background-color: #1a1a1a;
        }
        .vid {
            height: 650px;
        }
        .links {
                background-color: #262626;

                ::v-deep nav {
                    .nextArrow {
                        font-size: 32px;
                    }
                    .nextArrow a, .navOptions, .navOptions a{
                        color: red;
                    }
                }
          }
      }
    }
    &.act7 {
      background: #fff;
    .tall {                 
        border-left: 3px solid #f3f3f3;
        border-right: 3px solid #f3f3f3;

        .main {
            background-color: #dbdbdb;
            border-left: 4px solid #e2e2e2;
            border-right: 4px solid #e2e2e2;
        }
        .vid {
            height: 720px;
        }
        .links {
            background-color: #cecece;

            ::v-deep nav {
                .nextArrow {
                    font-size: 48px;
                }
                .nextArrow a, .navOptions, .navOptions a{
                    color: white;
                }
            }
        }
      }
    }
    &.credits {
        background: black;

        ::v-deep nav {
            .navOptions a{                    
            font-size: 0 !important;
            visibility: hidden;
                &::after {
                    content: "==>";
                    visibility: visible;
                    font-size: 32px;
                    line-height: initial;
                }
            }
            .meta {
                display: none;
            }

        } 
    }

    .tall {
    flex: 0 1 auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

      .main {
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        
        padding: 0 10px;

        .header {
            min-height: 129px;
        }
        .vid {
          display: flex;
          align-items: center;
          flex-flow: column;
        }

        .links{
            width: 100%;
            padding: 40px 0;
            margin: 10px 0;

            
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-grow: 0;
            ::v-deep nav {
                width: 600px;
                .navOptions {                    
                    font-size: 14px;
                }
            }
        }
      }	
    }

  }
  

</style>

