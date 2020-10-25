<template>
  <div class="pageBody" :class="[comic ? 'c'+comic.name : 'c2016-10-24']">
    <NavBanner />
    <div class="pageFrame">
      <div class="pageContent comic" v-if="routeParams.cid" >
        <a class="edgeNav left" :href="prevPage || false"  :class="{disabled: !prevPage}"/>
        <a class="edgeNav right" :href="nextPage || false"  :class="{disabled: !nextPage}"/>
        <Media :url="comic.pages[routeParams.pid-1]" :key="comic.pages[routeParams.pid-1]" />
      </div>
      <div class="pageContent archive" v-else>
        <div class="title">
          <Media url="/archive/comics/snaps/title.png" />
        </div>
        <div v-for="story in $archive.comics.snaps.list" class="storyContainer">
          <div class="storyButtonContainer">
            <div class="storyButton" @click="openStory(story)">
              <p class="storyName" v-text="$archive.comics.snaps.comics[story].name" />
            </div>
            <a @click="openStory(undefined)" :href="`/snaps/${story}`"><fa-icon icon="chevron-right"></fa-icon></a>
          </div>
          <div class="thumbnailWrapper">
            <transition name="thumbnails">
              <div class="thumbs" v-if="story == selectedStory" ref="thumbs">
                <a v-for="j in $archive.comics.snaps.comics[story].pages.length" @click="openStory(undefined)" :href="`/snaps/${story}/${j}`">
                  <Media :url="$archive.comics.snaps.comics[story].pages[j-1].replace('.mp4', '.jpg')" />
                </a>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <a href="/snaps" class="homeButton" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'Snaps',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  data: function() {
    return {
      selectedStory: undefined
    }
  },
  computed: {
    comic () {
      if (!this.routeParams.cid) return false

      return this.$archive.comics.snaps.comics[this.routeParams.cid]
    },
    nextPage() {
      if (!this.routeParams.cid) return ''

      let nextPage = parseInt(this.routeParams.pid) + 1
      if (this.comic.pages[nextPage - 1]) return `/snaps/${this.routeParams.cid}/${nextPage}`
      else return this.nextComic
    },
    nextComic() {
      if (!this.routeParams.cid) return ''

      let nextComic = this.$archive.comics.snaps.list.indexOf(this.routeParams.cid) + 1
      if (this.$archive.comics.snaps.list[nextComic]) return `/snaps/${this.$archive.comics.snaps.list[nextComic]}/1`
      else return ''
    },
    prevPage() {
      if (!this.routeParams.cid) return ''

      let prevPage = parseInt(this.routeParams.pid) - 1
      if (prevPage < 1)  {
        //We're going to serve up the last page of the previous comic
        let prevIndex = this.$archive.comics.snaps.list.indexOf(this.routeParams.cid) - 1
        let prevComic = this.$archive.comics.snaps.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/snaps/${prevComic}/${this.$archive.comics.snaps.comics[prevComic].pages.length}`
      }
      else return `/snaps/${this.routeParams.cid}/${prevPage}`
    },
    prevComic() {
      if (!this.routeParams.cid) return ''

      if (this.routeParams.pid != '1') return `/snaps/${this.routeParams.cid}/1`
      else {
        let prevIndex = this.$archive.comics.snaps.list.indexOf(this.routeParams.cid) - 1
        let prevComic = this.$archive.comics.snaps.list[prevIndex]

        if (prevIndex < 0) return ''
        else return `/snaps/${prevComic}/1`
      }
    }
  },
  methods:{
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
  background: #000;
	background-size: cover;
	background-attachment: fixed;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  align-items: center;

  &.c2016-10-24, &.c2016-12-25 {
    background-image: url(css://archive/comics/snaps/bg1.png);
  }
  &.c2016-10-31 {
    background-image: url(css://archive/comics/snaps/bg2.jpg);
  }
  &.c2016-11-11 {
    background-image: url(css://archive/comics/snaps/bg3.jpg);
  }
  &.c2016-11-18, &.c2016-11-24 {
    background-image: url(css://archive/comics/snaps/bg4.jpg);
  }
  &.c2016-12-02 {
    background-image: url(css://archive/comics/snaps/bg5.jpg);
  }
  &.c2016-12-23 {
    background-image: url(css://archive/comics/snaps/bg6.png);
  }

  .navBanner {
    margin: 0 auto;
    background: black;
  }
  
  .pageFrame {
    flex: 1;

    margin: 0 auto;
    background: url(css://archive/comics/snaps/frameSmall.png);
    background-repeat: no-repeat;
    width: 466px;
    min-height: 961px;

    margin: 5px 0;
    
    .homeButton {
      position: relative;
      display: block;
      height: 73px;
      width: 73px;
      left: 197px;
      top: 7px;
      border-radius: 50%;
      background: grey;
      opacity: 0;
      transition: opacity 0.15s;

      &:hover {
        opacity: 20%;
      }
    }

    .pageContent {
      width: 420px;
      height: 747px;
      overflow: auto;
      margin-left: 23px;
      margin-top: 111px;
      

      &.comic {
        position: relative;
        .edgeNav {
          height: 100%;
          width: 100px;
          position: absolute;
          transition: opacity 0.15s;
          opacity: 0;
          
          &:hover {
            opacity: 1;
          }
          &.left {
            background-image: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(255, 255, 255, .4));
          }
          &.right {
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, .4));
            right: 0;
          }
          &.disabled {
            display: none;
          }
        }

        img, video {
          width: 100%;
          height: 100%;
          display: block;
        }
      } 

      &.archive {
        background-color: #fff;
        text-align: center;
        flex-direction: column;
        font-weight: normal;

        .title {
          background-color: #fffc00;
          padding: 25px 0;
          width: 100%;

          img {
            margin: 0 auto;
            display: block;
          }
        }

        .storyContainer {
          border-bottom: solid 1px #DDDDDD;
          
          .storyButtonContainer {
            display: flex;

            .storyButton {
              font-family: Verdana, Arial, Helvetica, sans-serif;
              font-size: 20px;
              line-height: 2.4;
              color: black;

              width: calc(100% - 50px);
              padding-left: 45px;
              cursor: pointer;
              transition: .15s ease-in-out;

              &:hover {
                background: #f0f0f0;
                transition: .15s ease-in-out;
              }
            }

            a {
              font-family: Verdana, Arial, Helvetica, sans-serif;
              font-size: 16px;
              line-height: 3;
              text-decoration: none;
              width: 50px;
              color: black;

              text-transform:uppercase;
              cursor: pointer;
              transition: .15s ease-in-out;

              &:hover {
                background:#f0f0f0;
                transition: .15s ease-in-out;
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
            width: 100%;
            margin-bottom: 3px;

            a {
              display: block;
              width: 120px; 
              height: 200px;
              margin: 2px;
              filter: opacity(0.8);
              transition: all 0.15s;
              
              &:hover {
                filter: opacity(1);
              }

              img {
                border-radius: 5px;
                width: 100%;
                height: 100%;
              }
            }
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

