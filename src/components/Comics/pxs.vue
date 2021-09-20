<template>
  <div class="pageBody">
    <NavBanner />
    <PXSHome v-if="!routeParams.cid" />
    <div class="pageFrame comic" v-else>
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
          <span class="archive" v-text="`${this.page_num}/${comic.pages.length}`" />
          <div class="forward">
            <a :href="nextPage || false" :class="{disabled: !nextPage}">
              <Media url="/archive/comics/pxs/comnavNext.png" />
            </a>
            <a :href="nextComic || false" :class="{disabled: !nextComic}">
              <Media url="/archive/comics/pxs/comnavLast.png" />
            </a>
          </div>
        </div>
        <div id="content-tags" v-if="pageTags.length">
          <div class="tags">
            <a v-for="tag in pageTags" class="tag" v-text="'#' + tag" :key="tag"/>
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
import PXSHome from '@/components/Comics/pxshome.vue'

export default {
  name: 'ParadoxSpace',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, PXSHome
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
    }
  },
  computed: {
    comic() {
      if (!this.routeParams.cid) return false

      return this.$archive.comics.pxs.comics[this.routeParams.cid]
    },
    page_num(){
      return this.routeParams.pid
    },
    comicPage() {
      return this.comic.pages[this.page_num-1]
    },
    titleText() {
      return this.comic.titleText[this.page_num]
    },
    pageTags() {
      if (this.comic.tags) return (this.comic.tags[this.page_num] || [])
      return []
    },
    nextPage() {
      if (!this.routeParams.cid) return ''

      const nextPage = parseInt(this.page_num) + 1
      if (this.comic.pages[nextPage - 1]) return `/pxs/${this.routeParams.cid}/${nextPage}`
      else return this.nextComic
    },
    nextComic() {
      if (!this.routeParams.cid) return ''

      const nextComic = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) + 1
      if (this.$archive.comics.pxs.list[nextComic]) return `/pxs/${this.$archive.comics.pxs.list[nextComic]}/1`
      else return ''
    },
    prevPage() {
      if (!this.routeParams.cid) return ''

      const prevPage = parseInt(this.page_num) - 1
      if (prevPage < 1)  {
        // We're going to serve up the last page of the previous comic
        const prevIndex = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) - 1
        const prevComic = this.$archive.comics.pxs.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/pxs/${prevComic}/${this.$archive.comics.pxs.comics[prevComic].pages.length}`
      } else return `/pxs/${this.routeParams.cid}/${prevPage}`
    },
    prevComic() {
      if (!this.routeParams.cid) return ''

      if (this.page_num != '1') return `/pxs/${this.routeParams.cid}/1`
      else {
        const prevIndex = this.$archive.comics.pxs.list.indexOf(this.routeParams.cid) - 1
        const prevComic = this.$archive.comics.pxs.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/pxs/${prevComic}/1`
      }
    }
  },
  methods: {
    keyNavEvent(dir) {
      if (dir == 'left' && this.$parent.$el.scrollLeft == 0 && this.prevPage) this.$pushURL(this.prevPage)
      else if (dir == 'right' && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth && this.nextPage) this.$pushURL(this.nextPage)
    }
  }
}
</script>

<style scoped lang="scss">
.pageBody {
  background: #002d4d;
  background-image: url(assets://archive/comics/pxs/pixels_top.png), url(assets://archive/comics/pxs/pixels_bottom.png) !important;
  background-position: center top, center bottom !important;
  background-repeat: no-repeat !important;

  ::v-deep a {
    color: #2a6496;
  }

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

      .title, .archive, {
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

      #content-tags {
        padding: 15px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: normal;
        .tags {
          padding: 10px;
          border: 2px solid #232323;
        }
        .tag {
          display: inline-block;
          padding: 0px 3px;
          margin: 3px;
          color: #ffffff;
          background: #626262;
          border: 1px solid #7c7c7c;
        }
        a.tag {
          &:hover {
            text-decoration: none;
          }
        }
        .description-tag {
          background-image: -webkit-linear-gradient(top, #00364e 0%, #001823 100%);
          background-image: linear-gradient(to bottom, #00364e 0%, #001823 100%);
          background-repeat: repeat-x;
          border: 1px solid #424242;
        }
        .tag-writer {
          background: #b0913f;
          border: 1px solid #c5a85d;
        }
        .tag-art {
          background: #4492a9;
          border: 1px solid #61aabf;
        }
        .tag-layout {
          border: 1px solid #93a1c6;
          background: #7284b4;
        }
        .tag-lettering {
          border: 1px solid #5ec2b1;
          background: #41ac9a;
        }
        .tag-char {
          border: 1px solid #cc8c79;
          background: #be6c54;
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

