<template>
  <div class="pageFrame archive">
    <div class="pageContent">
      <div class="logo">
        <a href="/pxs"><Media url="/archive/comics/pxs/logo.png" /></a>
      </div>
      <!-- Thought: tabs? -->
      <div class="tabContainer">
        <a class="tabButton" :class="{selected: homeTab=='archive'}" href="/pxs/archive">Stories</a>
        <a class="tabButton" :class="{selected: homeTab=='credits'}" href="/pxs/credits">Contributors</a>
        <a class="tabButton" :class="{selected: homeTab=='news'}" href="/pxs/news">News</a>
      </div>
      <div class="storyContainer" v-if="homeTab === undefined || homeTab=='archive'">
        <div v-for="story in $archive.comics.pxs.list" :key="story">
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
      </div> <!-- End Stories -->
      <div class="contributorsContainer" v-if="homeTab=='credits'">
        <div class="panel-heading" />
        <div v-for="c, name in $archive.comics.pxs.contributors" :key="name" class="contributor">
          <span class="name" v-text="name" />
          <Media class="avatar" :url="`assets://archive/comics/pxs/avatar/${c.avatar.replace(/ /g, '%20') || 'undefined.png'}`" />
          <div>
            <p class="bio" v-html="c.bio" />
            <ul v-if="c.social" class="social">
              <li v-if="link" v-for="link in c.social">
                <a :href="linkToUrl(link)" v-text="link" />
              </li>
            </ul>
          </div>
        </div>
        <div class="panel-footer" />
      </div> <!-- End contributors -->
      <div class="newsContainer" v-if="homeTab=='news'">
        <div class="panel-heading" />
        <template v-for="newspost in $archive.comics.pxs.newsfeed">
          <div :key="newspost.timestamp" class="newspost">
            <Media class="avatar" :url="`assets://archive/comics/pxs/avatar/${newspost.author || 'undefined'}.png`" />
            <div>
              <h4 class="media-heading" v-text="newspost.title" :id="newspost.timestamp"/>
              <h5 class="media-subheading">
                <span class="date" v-text="newspost.date" />
                <span>by</span>
                <span class="author" v-text="newspost.author" />
              </h5>
              <div v-html="newspost.body" />

              <img src='assets://archive/comics/pxs/divider.png' class='divider'/>
            </div>
          </div>
        </template>
        <div class="panel-footer" />
      </div>
    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'ParadoxSpace',
  props: [
    'homeTab'
  ],
  components: {
    Media
  },
  data: function() {
    return {
      selectedStory: undefined
    }
  },
  methods: {
    openStory(key) {
      if (this.selectedStory == key) this.selectedStory = undefined
      else this.selectedStory = key
    },
    linkToUrl(linkstr) {
      try {
        let href = new URL('http://' + linkstr).href
        if (href.includes("http//"))
          href = linkstr
        return href
      } catch {
        return linkstr
      }
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

      .tabContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        margin-bottom: 2em;

        .tabButton {
          font-family: "Century Gothic",arial, sans-serif;
          font-size: 20px;
          font-weight: bold;
          color: white;
          text-decoration: none;
          text-transform: uppercase;

          cursor: pointer;
          &.selected, &:focus, &:hover {
            text-shadow: 0 0 5px #0ca6ff, 0 0 5px #0ca6ff;
          }
        }
      }

      .title, .archive, {
        font-family: "Century Gothic",arial, sans-serif;
        font-size: 20px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 5px #0ca6ff, 0 0 5px #0ca6ff;
        text-decoration: none;
      }

      .panel-heading {
        height: 20px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        background-image: linear-gradient(to bottom, #012b3e 0%, #011925 100%);
        background-repeat: repeat-x;
      }
      .panel-footer {
        height: 20px;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          border-top: 2px solid #002d4d;
        background-image: url(assets://archive/comics/pxs/news-pixelburst-right.png);
          background-position: right;
          background-repeat: no-repeat;
          background-color: #051729;
      }

      .contributorsContainer, .newsContainer {
        margin: 2em;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: normal;
        // background: #424242;

        .title {
          margin: auto;
          width: fit-content;
        }
        .contributor, .newspost {
          color: white;
          background: black;
          padding: 4px 8px;
          padding-bottom: 1em;
          border-bottom: 4px solid #204b69;
          display: flex;
          flex-wrap: wrap;
          .avatar {
            border-radius: 10px;
            width: 180px;
            height: 180px;
            flex-basis: 180px;
          }
          > div {
            flex: 1;
            padding: 0 1em;
          }
          .name {
            flex-basis: 100%;

            color: #fff;
            margin-top: 2px;
            margin-bottom: 2px;
            text-transform: uppercase;
            text-shadow: 3px 3px #0a3e54;
            font-size: 24px;
          }
          .bio::v-deep {
            line-height: 1.5;
            img {
              display: block;
            }
          }
          ul.social {
            list-style: inside;
          }
        }
      }

      .newsContainer {
        width: 1024px;
        position: relative;
        left: -154px;

        .newspost {
          color: #aaaaaa;
          border-bottom: none;
          border-left: 8px solid #262626;
          border-right: 8px solid #262626;

          h4 {font-size: 18px;}
          h5 {font-size: 14px;}
          h4, h5, h6, .avatar {
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .media-subheading {
            font-style: italic;
            span {
              padding-right: .3em;
            }
            .author {
              color: #5f5f5f;
              font-weight: bold;
            }
            .date {
              color: #346a8e;
              font-weight: bold;
            }
          }
          ::v-deep .media-body {
            p {margin: 0 0 10px;}
            img {
              display: block;
              margin: 1em 0;
            }
          }
          .divider {
            margin: auto;
            display: block;
          }
          .avatar {
            width: 100px;
            height: 100px;
            flex-basis: 100px;
            border-radius: 50%;
          }
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
          filter: opacity(0.8);
          transition: all 0.15s;
          
          &:hover {
            filter: opacity(1);
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

