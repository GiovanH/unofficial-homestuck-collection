<template>
  <div class="pageBody" :class="bgClass" :data-pageid="`${storyId}/${thisPage.pageId}`">
    <div class="tall">
      <div class="main">
        <div class="header">
          <Banner :id="tab.key" :page="thisPage"/>
        </div>
        <div 
          :class="note.class ? 'preface ' + note.class : 'preface'"
          v-for="note in prefaces">
          <p v-html="note.content"/>
          <span v-if="note.author" class="author" v-text="note.author" />
        </div>
        <div class="vid">
          <Media :url="thisPage.media[0]" />
        </div>      
        <div class="links">
          <FlashCredit  :pageId="thisPage.pageId" />
          <PageNav base="mspa" :thisPage="thisPage" :nextPages="nextPagesArray" ref="pageNav" />
        </div>
        <div 
          :class="note.class ? 'footnote ' + note.class : 'footnote'"
          v-for="note in footnotes">
          <p v-html="note.content"/>
          <span v-if="note.author" class="author" v-text="note.author" />
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

import PAGE from '@/components/Page/Page.vue'

export default {
  name: 'EndOfHS',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, PageNav, Banner, FlashCredit
  },
  theme: function(ctx) {
    let p = ctx.$isVizBase(ctx.routeParams.base) ? ctx.$vizToMspa(ctx.routeParams.base, ctx.routeParams.p).p : ctx.routeParams.p
    if (ctx.$archive.mspa.story[p].theme) return ctx.$archive.mspa.story[p].theme
  },
  title: PAGE.title,
  data: function() {
    return {
    }
  },
  computed: {
    pageNum: PAGE.computed.pageNum,
    storyId: PAGE.computed.storyId,
    thisPage: PAGE.computed.thisPage,
    nextPagesArray: PAGE.computed.nextPagesArray,
    bgClass() {
      return {
        collide: this.pageNum === "009987",
        act7: this.pageNum === "010027",
        credits: this.pageNum === "010030"
      }
    }
  },
  methods: {
    keyNavEvent: PAGE.methods.keyNavEvent
  },
  beforeDestroy() {
    // Trigger EOH notifications if leaving new-reader mode
    if (this.pageNum === "010030") this.$popNotifFromPageId('010030')
  }
}
</script>

<style scoped lang="scss">
    // Classes copied from original pages to preserve original theme through style changes

  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .footnote {
      width: 600px;
      // border-top: solid 23px var(--page-pageBorder, var(--page-pageFrame));
      padding: 30px 25px;
      p {
        text-align: center;
        margin: 0 auto;
        width: 600px;
      }
    }
    .preface {
      width: 600px;
      margin: 1em 0;

      border-style: dashed;
      border-width: 1px;

      border-color: var(--page-log-border);
      background-color: var(--page-pageFrame);
      color: var(--page-nav-divider);
      p {
        text-align: center;
        margin: 0 auto;
        width: 600px;
      }
    }

    .footnote, .preface {
      .author {
        font-weight: 300;
        font-size: 10px;
        font-family: Verdana, Arial, Helvetica, sans-serif;

        display: flex;
        justify-content: flex-end;

        position: relative;
        top: 12px;
        margin-top: -12px;

        color: var(--page-nav-meta);
      }
    }

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

