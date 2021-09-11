<template>
  <div class="pageBody">
    <NavBanner />
    <div class="pageFrame archive" v-if="!routeParams.cid">
      <div class="pageContent">
        <div class="logo">
          <a href="/tso"><Media url="/archive/collection/tso_logo.png" /></a>
        </div>
        <div class="comicContainer">
          <div v-for="comicKey in $archive.comics.tso.list">
            <div v-if="typeof(comicKey) === 'string'" class="comicEntry">
              <div class="comicButtonContainer">
                <div class="comicButton" @click="openComic(comicKey)">
                  <p class="comicName" v-text="$archive.comics.tso.comics[comicKey].name" />
                  <p class="comicDesc" v-if="$archive.comics.tso.comics[comicKey].desc" v-text="$archive.comics.tso.comics[comicKey].desc" />
                </div>
                <a class="comicLink" @click="openComic(undefined)" :href="`/tso/${comicKey}`"><span>==<fa-icon icon="chevron-right"></fa-icon></span></a>
              </div>
              <div class="thumbnailWrapper">
                <transition name="thumbnails">
                  <div class="thumbs" v-if="comicKey == selectedComic" ref="thumbs">
                    <a v-for="(url, i) in $archive.comics.tso.comics[comicKey].pages" @click="openComic(undefined)" :href="`/tso/${comicKey}/${i+1}`">
                      <Media :url="url" />
                    </a>
                  </div>
                </transition>
              </div>
            </div>
            <div v-else class="groupEntry">
              <div class="groupInfo">
                <p class="groupName" v-text="comicKey.groupName" />
                <p class="groupDesc" v-text="comicKey.groupDesc" />
              </div>
              <div v-for="groupComic in comicKey.list"> 
                <div class="comicButtonContainer">
                  <div class="comicButton" @click="openComic(groupComic)">
                    <p class="comicName" v-text="$archive.comics.tso.comics[groupComic].name" />
                    <p class="comicDesc" v-if="$archive.comics.tso.comics[groupComic].desc" v-text="$archive.comics.tso.comics[groupComic].desc" />
                  </div>
                  <a class="comicLink" @click="openComic(undefined)" :href="`/tso/${groupComic}`">==<fa-icon icon="chevron-right"></fa-icon></a>
                </div>
                <div class="thumbnailWrapper">
                  <transition name="thumbnails">
                    <div class="thumbs" v-if="groupComic == selectedComic" ref="thumbs">
                      <a v-for="(url, i) in $archive.comics.tso.comics[groupComic].pages" @click="openComic(undefined)" :href="`/tso/${groupComic}/${i+1}`">
                        <Media :url="url" />
                      </a>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pageFrame comic" v-else>
      <div class="pageContent" :class="[`p${routeParams.pid}`, `${routeParams.cid}`]" >
        <div class="logo">
          <a href="/tso"><Media url="/archive/comics/tso/logo_small.png" /></a>
        </div>
        <div class="innerComic">
          <div class="nav topNav">
            <div class="back">
              <a :href="prevPage || false" :class="{disabled: !prevPage}">
                &lt;
              </a>
            </div>
            <a class="title" :href="`/tso/${routeParams.cid}`" v-text="comic.name" />
            <div class="forward">
              <a :href="nextPage || false" :class="{disabled: !nextPage}">
                &gt;
              </a>
            </div>
          </div>
          <div class="mediaContent" >
            <a :href="nextPage || false">
              <Media :url="comic.pages[routeParams.pid - 1]" key="comic.pages[routeParams.pid-1]" />
            </a>
          </div>
          <div class="nav bottomNav">
            <div class="back">
              <a :href="prevPage || false" :class="{disabled: !prevPage}">
                &lt;
              </a>
            </div>
            <a class="archive" v-text="`${this.routeParams.pid}/${comic.pages.length}`">STORIES</a>
            <div class="forward">
              <a :href="nextPage || false" :class="{disabled: !nextPage}">
                &gt;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'TeamSpecialOlympics',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  title(ctx) {
    if (ctx.routeParams.cid)
      return `${ctx.$archive.comics.tso.comics[ctx.routeParams.cid].name} - Team Special Olympics`
    else 
      return "Team Special Olympics"
  },
  data: function() {
    return {
      selectedComic: undefined
    }
  },
  computed: {
    comic () {
      if (!this.routeParams.cid) return false

      return this.$archive.comics.tso.comics[this.routeParams.cid]
    },
    aidsPage() {
      return 'p' + this.routeParams.pid
    },
    nextPage() {
      if (!this.routeParams.cid) return false

      // Pages are zero index, but pid is 1-indexed. So, pid can be used as the next page without adding 1. make sense? 
      // god i hope you aren't thinking 'yes' right now
      let p = parseInt(this.routeParams.pid)
      if (!this.comic.pages[p])  {
        return false
      }
      else return `/tso/${this.routeParams.cid}/${p + 1}`
    },
    prevPage() {
      if (!this.routeParams.cid) return false

      let p = parseInt(this.routeParams.pid) - 1
      if (!this.comic.pages[p-1])  {
        return false
      }
      else return `/tso/${this.routeParams.cid}/${p}`
    }
  },
  methods: {
    openComic(key) {
      if (this.selectedComic == key) this.selectedComic = undefined
      else this.selectedComic = key
    },
    keyNavEvent(dir) {
      if (dir == 'left' && this.prevPage && this.$parent.$el.scrollLeft == 0 && this.prevPage) this.$pushURL(this.prevPage)
      else if (dir == 'right' && this.nextPage && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth && this.nextPage) this.$pushURL(this.nextPage)
    }
  },
}
</script>

<style scoped lang="scss">
.pageBody {
  background-color: black;

  * {
    color: #A1EE26;
    font-family: Verdana, Geneva, sans-serif;
  }

  .navBanner {
    width: 100%;
    background-color: #000;
  }
  
  .pageFrame {
    background-color: black;

    .pageContent {
      background-color: black;
      text-align: center;
      position: relative;
      z-index: 0;

      .logo {
        text-align: center;
      }

      .innerComic {
        border: solid 3px #2f2f2f;
        margin: 0 auto 15px;
        display: inline-flex;
        flex-flow: column;
      }

      .title, .archive {
        font-size: 20px;
        font-weight: bold;
        text-decoration: none;
      }

      .nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #111111;

        .back a, .forward a {
          margin: 0 10px;
          font-size: 32px;
          color: white;
          text-decoration: none;
          &.disabled {
            color: #444444;
          }
        }
 
        .archive {
          line-height: 1.4;
        }
      }

      .mediaContent img {
        display: block;
      }
      
      .comicContainer {
        max-width: 1000px;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 25px;

        .comicEntry {
          margin: 0 0 25px;
        }
        .groupEntry {
          margin: 0 0 25px;

          .groupInfo {
            padding-right: 54px;
            margin-bottom: 10px;
            
            .groupName {
              margin-bottom: 5px;
            }
          }

          div:not(:last-child) {
            .comicButtonContainer {
              margin: 0;
              div, a {
                margin-bottom: -6px;
              }
            }
          }
          
          .comicName, .comicLink {
            font-size: 12px;
          }

          .thumbs {
            margin-top: 11px;
          }
        }

        .groupName, .comicName, .comicLink {
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
        }
        .groupDesc, .comicDesc {
          font-weight: normal;
          font-size: 11px;
          color: #7e7e7e;
        }
        .comicLink {
          display: flex;
          align-items: center;
        }

        .comicButtonContainer {
          display: flex;
          justify-content: center;

          .comicButton, a {
            background: #111111;
            border: 6px solid #2f2f2f;
            padding: 10px;
            overflow: auto;
            cursor: pointer;
            transition: .15s ease-in-out;
            

            &:hover {
              background-color: #1a1a1a;
              transition: .25s ease-in-out;
            }
          }

          .comicButton{
            width: 420px;
            border-right: none;

            .comicDesc {
              margin-top: 5px;
            }
          }
        }
      }
      .thumbnailWrapper {
        overflow: hidden;
        .thumbs {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          align-items: flex-start;
          margin-top: 6px;
          margin-bottom: 3px;

          a {
            display: block;
            width: 120px;
            margin: 2px;
            border: solid 3px #fff;
            filter: opacity(0.8);
            transition: all 0.15s;
            
            &:hover {
              filter: opacity(1);
            }

            img {
              display: block;
              width: 100%;
            }
          }
        }
      }

      &.aids {
        &::after {
          z-index: -1;
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          margin: 0 auto;
          width: 950px;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0) 38px,
            #151515 38px,
            #151515 76px
          );
        }
        &.p2::after, &.p3::after, &.p4::after, &.p40::after  {
          background: repeating-linear-gradient(
            90deg,
            #949494,
            #949494 38px,
            rgba(255, 0, 0, 0) 38px,
            rgba(255, 0, 0, 0) 76px
          );
        }

        &::before {
          z-index: -2;
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          margin: 0 auto;
          width: 950px;
          height: 100%;
        }
        &.p2, &.p3, &.p4, &.p40 {
          &::before {
            background: linear-gradient(#CBCBCB, #A8A8A8);
          }
          .title{
            color: #CBCBCB;
          }
          .archive {
            color: #A8A8A8;            
          }
        }
        &.p5, &.p6, &.p7, &.p8, &.p9, &.p10, &.p11, &.p12, &.p13 {
          &::before {
            background: linear-gradient(#E46336, #DC2732);
          }
          .title{
            color: #E46336;
          }
          .archive {
            color: #DC2732;            
          }
        }
        &.p14, &.p15, &.p16, &.p17, &.p18, &.p19, &.p20 {
          &::before {
	          background: linear-gradient(#4F8DBE, #43D367);
          }
          .title{
            color: #4F8DBE;
          }
          .archive {
            color: #43D367;            
          }
        }
        &.p21, &.p22 {
          &::before {
            background: linear-gradient(#CF8940, #D95253) no-repeat, linear-gradient(#3D7AB3, #489695) no-repeat;
            background-size: 50% 100%, 50% 100%;
            background-position: 0 0, 100% 0; 
          }
          .title{
            color: #CF8940;
          }
          .archive {
            color: #489695;            
          }
        }
        &.p23 {
          &::before {
            background: linear-gradient(#3997BB, #50C1AB) no-repeat, linear-gradient(#BC664D, #C54D7E) no-repeat;
            background-size: 50% 100%, 50% 100%;
            background-position: 0 0, 100% 0; 
          }
          .title{
            color: #3997BB;
          }
          .archive {
            color: #C54D7E;            
          }
        }
        &.p24 {
          &::before {
            background: linear-gradient(#5D5DC2, #5085BF) no-repeat, linear-gradient(#B9AB0A, #CE7A36) no-repeat;
            background-size: 50% 100%, 50% 100%;
            background-position: 0 0, 100% 0; 
          }
          .title{
            color: #5D5DC2;
          }
          .archive {
            color: #CE7A36;            
          }
        }
        &.p25 {
          &::before {
            background: linear-gradient(#F7C62E, #D6D02E) no-repeat, linear-gradient(#369BF8, #4149B4) no-repeat;
            background-size: 50% 100%, 50% 100%;
            background-position: 0 0, 100% 0; 
          }
          .title{
            color: #F7C62E;
          }
          .archive {
            color: #4149B4;            
          }
        }
        &.p26, &.p27 {
          &::before {
	          background: linear-gradient(#C2C2C2, #797979);
          }
          .title{
            color: #C2C2C2;
          }
          .archive {
            color: #797979;            
          }
        }
        &.p28, &.p29, &.p30, &.p31, &.p32, &.p33, &.p34, &.p35, &.p36, &.p37, &.p38, &.p39 {
          &::before {
            background: linear-gradient(#C22CCE, #A33AF1) no-repeat, linear-gradient(#DA24BF, #D24CED) no-repeat;
            background-size: 50% 100%, 50% 100%;
            background-position: 0 0, 100% 0; 
          }
          .title{
            color: #C22CCE;
          }
          .archive {
            color: #D24CED;            
          }
        }
      }
    }
  }
}

.thumbnails-enter-active, .thumbnails-leave-active {
  transition: all 0.2s;
}
.thumbnails-enter-to, .thumbnails-leave {
  max-height: 1000px;
}
.thumbnails-enter, .thumbnails-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>

