<template>
  <div class="pageBody customStyles">
    <div class="pageFrame">
      <NavBanner useCustomStyles="true" />
      <a href="/music" class="banner"><Media url="/archive/music/bannerCrop.png" /></a>
      <div class="pageContent">
        <div class="leftColumn">
          <Album v-if="thisAlbum" :album="thisAlbum"/>

          <Track v-else-if="thisTrack" :track="thisTrack" />
          
          <Artist v-else-if="thisArtist" :artist="thisArtist" />

          <Discography v-else :mode="routeParams.mode" />
        </div>
        <div class="rightColumn">
          <div class="sidebarItem">
            <a class="discogButton" href="/music">all albums</a><br>
            <a class="discogButton" href="/music/tracks">all tracks</a><br>
            <a class="discogButton" href="/music/artists">all artists</a><br>
            <a class="discogButton" href="/music/features">all features</a>
          </div>
          <div class="sidebarItem" v-if="$isNewReader">
            <p><strong>SPOILER WARNING:</strong> Expect all external links within this database to contain direct spoilers for the end of Homestuck. Click with care!</p>
          </div>
          <div class="sidebarItem">
            <p>This information is current as of the <br><strong>25th October, 2020</strong>.<br> For more recent info, deeper categorization, and unofficial albums, visit the <a href="https://hsmusic.github.io/">Homestuck Music Wiki.</a></p>
            <br>
            <p>If you're enjoying the tunes, how about dropping some money on the albums at the <a href="https://homestuck.bandcamp.com/">Official Homestuck Bandcamp?</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'

import Album from '@/components/Music/Album.vue'
import Artist from '@/components/Music/Artist.vue'
import Discography from '@/components/Music/Discography.vue'
import Track from '@/components/Music/Track.vue'

export default {
  name: 'Music',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, 
    Media,
    Album,
    Artist, 
    Discography, 
    Track
  },
  title: function(ctx) {
    var title = 'Homestuck Music'
    if (ctx.routeParams.mode == 'tracks') title = `All tracks - Homestuck Music`
    else if (ctx.routeParams.mode == 'artists') title = `All artists - Homestuck Music`
    else if (ctx.routeParams.mode == 'features') title = `All features - Homestuck Music`
    else if (ctx.routeParams.mode == 'album') title = `${ctx.$archive.music.albums[ctx.routeParams.id].name} - Homestuck Music`
    else if (ctx.routeParams.mode == 'track') title = `${ctx.$archive.music.tracks[ctx.routeParams.id].name} - Homestuck Music`
    else if (ctx.routeParams.mode == 'artist') title = `${ctx.$archive.music.artists[ctx.routeParams.id].name} - Homestuck Music`
    return title
  },
  data: function() {
    return {
    }
  },
  computed: {
    thisAlbum() {
      // let mode // unused?
      let key = this.routeParams.id || undefined
      return (this.routeParams.mode == 'album' && key in this.$archive.music.albums) ? this.$archive.music.albums[key] : undefined
    },
    thisTrack() {
      let key = this.routeParams.id || undefined
      return (this.routeParams.mode == 'track' && key in this.$archive.music.tracks) ? this.$archive.music.tracks[key] : undefined
    },
    thisArtist() {
      let key = this.routeParams.id || undefined
      return (this.routeParams.mode == 'artist' && key in this.$archive.music.artists) ? this.$archive.music.artists[key] : undefined
    }
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;
    background: var(--page-pageBody);
    font: 13px/1.231 'Helvetica Neue', Helvetica, Arial, sans-serif;

    ::v-deep {
      color: var(--font-default);
      a {
        color: var(--page-links);
      }
    }

    .navBanner {
      width: 975px;
      border-bottom: none !important;
    }
    .banner img {
      display: block;
      background: var(--page-pageContent);
      border-bottom: solid 7px var(--page-pageBorder, var(--page-pageFrame));
    }
    .pageFrame {
      margin: 0 auto;
      border: solid 7px var(--page-pageBorder, var(--page-pageFrame));
      margin-bottom: 30px;
      border-top: none;
      box-sizing: content-box;

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      .pageContent{
        background: var(--page-pageContent);
        padding: 30px;

        .leftColumn {
          width: 756px;
          float: left;
        }
        .rightColumn {
          max-width: 129px;
          margin-left: 30px;
          float: right;

          .sidebarItem {
            margin-bottom: 20px;

            .title {
              font-size: 16px;
              font-weight: normal;
              margin-bottom: 10px;
              a {
                color: #000000;
              }
            }

            .discogButton {
              display: inline-block;
              margin-bottom: 5px;
              background: #619aa9;
              border: none;
              border-radius: 3px;
              text-align: center;
              font-weight: bold;
              padding: 5px 0;
              color: #fff;
              width: 100%;

              &:hover {
                text-decoration: underline;
                cursor: pointer;
              }
            }

          }
        }
    
        ::v-deep {
          a {
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        } 
      }
    }

  }
  

</style>

