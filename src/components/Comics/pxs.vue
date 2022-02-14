<template>
  <div class="pageBody">
    <NavBanner />
    <div class="pageFrame comic" v-if="routeParams.cid">
      <div class="pageContent">
        <div class="logo">
          <a href="/pxs"><Media url="/archive/comics/pxs/logo.png" /></a>
        </div>
        <div class="nav topNav">
          <div class="back">
            <a :href="prevComic" :class="{disabled: !prevComic}">
              <Media url="/archive/comics/pxs/comnavFirst.png" />
            </a>
            <a :href="prevPage" :class="{disabled: !prevPage}">
              <Media url="/archive/comics/pxs/comnavPrev.png" />
            </a>
          </div>
          <a class="title" :href="`/pxs/${routeParams.cid}`" v-text="comic.name" />
          <div class="forward">
            <a :href="nextPage || false" :class="{disabled: !nextPage}">
              <Media url="/archive/comics/pxs/comnavNext.png" />
            </a>
            <a :href="nextComic || false" :class="{disabled: !nextComic}">
              <Media url="/archive/comics/pxs/comnavLast.png" />
            </a>
          </div>
        </div>
        <div class="mediaContent" >
          <a :href="nextPage || false">
            <Media :url="comicPage" :title="comic.titleText[routeParams.pid]" :key="comicPage" />
          </a>
        </div>
        <div class="nav bottomNav">
          <div class="back">
            <a :href="prevComic || false" :class="{disabled: !prevComic}">
              <Media url="/archive/comics/pxs/comnavFirst.png" />
            </a>
            <a :href="prevPage || false" :class="{disabled: !prevPage}">
              <Media url="/archive/comics/pxs/comnavPrev.png" />
            </a>
          </div>
          <span class="archive" v-text="`${this.routeParams.pid}/${comic.pages.length}`" />
          <div class="forward">
            <a :href="nextPage || false" :class="{disabled: !nextPage}">
              <Media url="/archive/comics/pxs/comnavNext.png" />
            </a>
            <a :href="nextComic || false" :class="{disabled: !nextComic}">
              <Media url="/archive/comics/pxs/comnavLast.png" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="pageFrame archive" v-else>
      <div class="pageContent">
        <div class="logo">
          <a href="/pxs"><Media url="/archive/comics/pxs/logo.png" /></a>
        </div>
        <div class="storyContainer">
          <div class="title">STORIES</div><br>
          <div v-for="story in $archive.comics.pxs.list">
            <div class="storyButtonContainer">
              <div class="storyButton" @click="openStory(story)">
                <p class="storyName" v-text="$archive.comics.pxs.comics[story].name" />
                <p class="storyCredit" v-text="$archive.comics.pxs.comics[story].credit" />
                <p class="storyDesc" v-text="$archive.comics.pxs.comics[story].desc" />
              </div>
              <a @click="openStory(undefined)" :href="`/pxs/${story}`">==<fa-icon icon="chevron-right"></fa-icon></a>
            </div>
            <div class="thumbnailWrapper">
              <transition name="thumbnails">
                <div class="thumbs" :class="{summerteen: story == 'summerteen-romance'}" v-if="story == selectedStory" ref="thumbs">
                  <a v-for="j in $archive.comics.pxs.comics[story].pages.length" @click="openStory(undefined)" :href="`/pxs/${story}/${j}`">
                    <Media :url="$archive.comics.pxs.comics[story].pages[j-1]" />
                  </a>
                </div>
              </transition>
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
  name: 'ParadoxSpace',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  title(ctx) {
    if (!ctx.routeParams.cid)
      return 'Paradox Space' 
    else {
      let comic = ctx.$archive.comics.pxs.comics[ctx.routeParams.cid].name
      return `${comic} - Paradox Space`
    }
  },
  theme: () => 'pxs',
  data: function() {
    return {
      selectedStory: undefined
    }
  },
  computed: {
    comic() {
      if (!this.routeParams.cid) return false

      return this.$archive.comics.pxs.comics[this.routeParams.cid]
    },
    comicPage() {
      return this.comic.pages[this.routeParams.pid-1]
    },
    titleText() {
      return this.comic.titleText[this.routeParams.pid]
    },
    nextPage() {
      if (!this.routeParams.cid) return ''

      let nextPage = parseInt(this.routeParams.pid) + 1
      if (this.comic.pages[nextPage - 1]) return `/pxs/${this.routeParams.cid}/${nextPage}`
      else return this.nextComic
    },
    nextComic() {
      if (!this.routeParams.cid) return ''

      let nextComic = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) + 1
      if (this.$archive.comics.pxs.list[nextComic]) return `/pxs/${this.$archive.comics.pxs.list[nextComic]}/1`
      else return ''
    },
    prevPage() {
      if (!this.routeParams.cid) return ''

      let prevPage = parseInt(this.routeParams.pid) - 1
      if (prevPage < 1)  {
        // We're going to serve up the last page of the previous comic
        let prevIndex = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) - 1
        let prevComic = this.$archive.comics.pxs.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/pxs/${prevComic}/${this.$archive.comics.pxs.comics[prevComic].pages.length}`
      }
      else return `/pxs/${this.routeParams.cid}/${prevPage}`
    },
    prevComic() {
      if (!this.routeParams.cid) return ''

      if (this.routeParams.pid != '1') return `/pxs/${this.routeParams.cid}/1`
      else {
        let prevIndex = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) - 1
        let prevComic = this.$archive.comics.pxs.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/pxs/${prevComic}/1`
      }
    }
  },
  methods: {
    openStory(key) {
      if (this.selectedStory == key) this.selectedStory = undefined
      else this.selectedStory = key
    },
    keyNavEvent(dir) {
      if (dir == 'left' && this.$parent.$el.scrollLeft == 0 && this.prevPage) this.$pushURL(this.prevPage)
      else if (dir == 'right' && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth && this.nextPage) this.$pushURL(this.nextPage)
    }
  },
}
</script>

<style scoped lang="scss">
.pageBody {
  background: #002d4d;
  background-image: url(assets://archive/comics/pxs/pixels_top.png), url(assets://archive/comics/pxs/pixels_bottom.png) !important;
  background-position: center top, center bottom !important;
  background-repeat: no-repeat !important;

  ::v-deep .navBanner {
    width: 100%;
    border-bottom: 4px solid #095486;
    height: 23px;
    background:  #003b64;
    a { 
      font-family: "Century Gothic", arial, sans-serif;
      font-size: 13px;
      font-weight: bold;
      color: #72abd2;
    }
    .navList {
      .candyCorn {
        content: url(assets://archive/comics/pxs/candycorn_pxs.png);
      }
      ul li:not(:last-child):after {
        color:  #72abd2;
      }
    }
  }
  
  .pageFrame {
    margin: 0 auto;
    width: 774px;
    background: url(assets://archive/comics/pxs/bgContainer.png) !important;

    .pageContent {
      background: url(assets://archive/comics/pxs/bgPxs_logo.png) !important;
      background-repeat: no-repeat !important;
      background-position: 10px -20px !important;

      .logo {
        text-align: center;
        padding: 12px 0;
      }

      .title, .archive {
          font-family: "Century Gothic",arial, sans-serif;
          font-size: 20px;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 5px #0ca6ff, 0 0 5px #0ca6ff;
          text-decoration: none;
        }

      .nav {
        margin: 0 10px;
        display: flex;
        justify-content: space-between;
        
        .title {
          line-height: 1.2;
        }
        .archive {
          line-height: 1.4;
        }

        .disabled {
          visibility: hidden;
        }
      }

      .mediaContent {
        margin: 5px auto;
        max-width: 750px;
        display: table;
        border: solid 2px #095486;
        box-shadow: 0px 0px 10px #095486;
        img {
          display: block;
        }
      }

      .storyContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 25px;

        .storyButtonContainer {
          display: flex;
          margin: 2px 0 5px;
          justify-content: center;

          .storyButton {
            font-family: "Century Gothic",arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: #70c3f1;

            width: 420px;
            padding: 4px 4px 6px 15px;
            margin-right: 5px;
            border: 0px solid #095486;
            border-radius:5px;
            background-color:#0d4162;
            text-transform:uppercase;
            cursor: pointer;
            transition: .15s ease-in-out;

            &:hover {
              color: #fff;
              background-color:#1f618a;
              transition:  .25s ease-in-out;
              text-shadow: 0 0 8px #41b9fe;
            }

            .storyCredit, .storyDesc {
              font-family: "Century Gothic",arial, sans-seriff;
              font-size: 11px;
              text-transform:none;
            }

            .storyDesc {
              margin-bottom:5px;
              font-style: italic;
              font-weight:normal;
            }
          }

          a {
            font-family: "Century Gothic",arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: #70c3f1;
            line-height: 3;
            text-decoration: none;

            padding: 5px 10px;
            border: 0px solid #095486;
            border-radius:5px;
            background-color:#0d4162;
            text-transform:uppercase;
            cursor: pointer;
            transition: .15s ease-in-out;

            &:hover {
              color: #fff;
              background-color:#1f618a;
              transition:  .25s ease-in-out;
              text-shadow: 0 0 8px #41b9fe;
            }
          }
        }
      }
      .thumbnailWrapper {
        overflow: hidden;
      }
      .thumbs {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        width: 650px;
        margin-bottom: 3px;

        a {
          display: block;
          width: 120px; 
          height: 189px;
          margin: 2px;
          border: solid 3px #fff;
          background: rgba(255, 255, 192, 0.15);
          opacity: 0.8;
          transition: all 0.15s;
          
          &:hover {
            opacity: 1.0;
          }

          img {
            width: 100%;
            height: 100%;
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
  &.summerteen {
    max-height: 2200;
  }
}
.thumbnails-enter, .thumbnails-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>

