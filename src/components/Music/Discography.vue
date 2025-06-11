<template>
  <div class="discographyPage">
    <div class="trackography" v-if="mode == 'tracks'">
      <div class="album" v-for="album in trackographySorted" :key="album.directory">
        <div class="thumbnail">
          <a v-if="!album.isSpoiler" :href="`/music/album/${album.directory}`" class="coverArt">
            <Media :url="`/archive/music/${album.directory}/cover.jpg`" />
          </a>
          <div v-else class="coverArt">
            <Media url="/archive/music/spoiler.png" />
          </div>
          <p v-if="$archive.music.albums[album.directory].date" class="date" v-text="getUTCDate($archive.music.albums[album.directory].date)" />
        </div>
        <div>
          <a :href="`/music/album/${album.directory}`" v-if="!album.isSpoiler"><h2 class="trackTitle">{{$archive.music.albums[album.directory].name}}</h2></a>
          <h2 class="trackTitle" v-else>??????</h2>
          <ol>
            <li v-for="track in album.tracks" v-html="track"/>
          </ol>
        </div>
      </div>
    </div>
    <div class="artistography" v-else-if="mode == 'artists'">
      <h2 class="trackTitle">Artists:</h2>
      <ul class="artists">
        <li v-for="artist in artistographySorted" v-html="artist"/>
      </ul>
    </div>
    <div class="flashography" v-else-if="mode == 'features'">
      <div class="album" v-for="flash in flashographySorted" :key="flash.url">
        <div class="thumbnail">
          <a :href="flash.url"  target="_blank" class="coverArt">
            <Media :url="`/archive/music/flash/${flash.thumbnail}.png`" v-if="flash.thumbnail"/>
            <Media url="/archive/music/spoiler.png" v-else/>
          </a>
          <p v-if="flash.pageNum" class="date" v-text="flash.pageNum" />
        </div>
        <div>
          <a :href="flash.url" v-if="flash.url" target="_blank"><h2 class="trackTitle flashTitle" v-text="flash.title"/></a>
          <h2 class="trackTitle flashTitle" v-text="flash.title" v-else />
          <ul>
            <li v-for="track in flash.tracks" v-html="track"/>
          </ul>
        </div>
      </div>
    </div>
    <div class="discography" v-else>
      <button class="reverseButton" @click="reverseDiscography = !reverseDiscography">Reverse Order</button><br>
      <div class="albums">
        <div class="album" v-if="discographySorted.length < Object.keys($archive.music.albums).length && !reverseDiscography">
          <div>
            <Media class="art" url="/archive/music/spoiler.png" width="350" />
            <p class="title">Keep reading to unlock!</p>
          </div>
        </div>
        <div class="album" v-for="album in discographySorted" :key="$archive.music.albums[album].directory">
          <a :href="`/music/album/${$archive.music.albums[album].directory}`">
            <Media class="art" :url="`/archive/music/${$archive.music.albums[album].directory}/cover.jpg`" width="350" />
            <p class="title" v-text="$archive.music.albums[album].name" />
            <span class="artistOverride" v-if="$archive.music.albums[album].artists && $archive.music.albums[album].artists[0] != 'homestuck'">
              {{joinNoOxford($archive.music.albums[album].artists.map(artist=>$archive.music.artists[artist.who].name))}}
            </span>
          </a>
        </div>
        <div class="album" v-if="discographySorted.length < Object.keys($archive.music.albums).length && reverseDiscography">
          <div>
            <Media class="art" url="/archive/music/spoiler.png" width="350" />
            <p class="title">Keep reading to unlock!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'MusicDiscography',
  props: [
    'mode'
  ],
  components: {
    Media
  },
  data: function() {
    return {
      reverseDiscography: false
    }
  },
  computed: {
    trackographySorted() {
      // Always send unreleased-tracks to the bottom of the list. Otherwise, sort in chronological order of release
      const keys = Object.keys(this.$archive.music.albums).sort((key1, key2) => {
        if (key1 == 'unreleased-tracks') return 1
        else if (key2 == 'unreleased-tracks') return -1
        else return new Date(this.$archive.music.albums[key1].date) - new Date(this.$archive.music.albums[key2].date)
      })
      
      const result = []
      keys.forEach(key => {
        const directory = key
        const isSpoiler = this.$albumIsSpoiler(key)
        const tracks = []
        let isValidAlbum = false
        this.$archive.music.albums[key].tracks.forEach(track => {
          const linkedTrack = this.linkTrack(track)
          if (!isValidAlbum && !linkedTrack.includes('>??????<')) isValidAlbum = true
          tracks.push(linkedTrack)
        })
        if (isValidAlbum) result.push({directory, isSpoiler, tracks})
      })
      return result
    },
    artistographySorted() {
      // Sort artists in alphabetical order, and split into a maximum of three equal-ish columns. Try to hit around a minimum of 50 per column.
      const keys = Object.keys(this.$archive.music.artists).sort((key1, key2) => {
        if (key1 < key2) return -1
        if (key1 > key2) return 1
        return 0
      })
      return keys.map(artist => `<a href="/music/artist/${artist}">${this.$archive.music.artists[artist].name}</a>`)
    },
    flashographySorted() {
      // Sort in chronological order of release
      const keys = Object.keys(this.$archive.music.flashes).sort((key1, key2) => {
        const timestamp1 = key1 in this.$archive.mspa.story && this.$archive.mspa.story[key1].timestamp ? this.$archive.mspa.story[key1].timestamp : new Date(this.$archive.music.flashes[key1].date).getTime() / 1000
        const timestamp2 = key2 in this.$archive.mspa.story && this.$archive.mspa.story[key2].timestamp ? this.$archive.mspa.story[key2].timestamp : new Date(this.$archive.music.flashes[key2].date).getTime() / 1000
        
        return timestamp1 - timestamp2
      })
      const result =  keys.filter(page => !this.$pageIsSpoiler(page) && page != '007326').map(page => {
        const flash = this.$archive.music.flashes[page]
        const tracks = []

        flash.tracks.forEach(track => tracks.push(this.linkReference(track)))
        
        if ('bolin' in flash) {
          flash.bolin.forEach(track => {
            if (!flash.tracks.includes(track)) tracks.push(this.linkReference(track) + ' (Removed 11/Jun/2010)')
          })
        }

        const pageData = this.getPage(page)
        return {
          title: pageData.title, 
          pageNum: pageData.pageNum,
          thumbnail: pageData.thumbnail,
          url: pageData.url,
          tracks
        }
      })
      if (this.$isNewReader) {
        result.push({
          title: '??????',
          tracks: ['Keep reading to unlock!']
        })
      }
      return result
    },
    discographySorted() {
      // Sort in reverse-chronological order of release.
      const keys = Object.keys(this.$archive.music.albums).filter(album => !this.$albumIsSpoiler(album))
      const sorted = keys.sort((key1, key2) => new Date(this.$archive.music.albums[key2].date) - new Date(this.$archive.music.albums[key1].date))
      return this.reverseDiscography ? sorted.reverse() : sorted
    }
  },
  methods: {
    // thnks florrie 👍
    joinNoOxford(array, plural = 'and') {
      if (array.length === 0) {
          return ''
      }

      if (array.length === 1) {
          return array[0]
      }

      if (array.length === 2) {
          return `${array[0]} ${plural} ${array[1]}`
      }

      return `${array.slice(0, -1).join(', ')} ${plural} ${array[array.length - 1]}`
    },
    linkArtists(array) {
      return array.map(artist => {
        if (typeof artist == 'string') return `<a href="/music/artist/${artist}">${this.$archive.music.artists[artist].name}</a>`
        else return `<a href="/music/artist/${artist.who}">${this.$archive.music.artists[artist.who].name}</a>${artist.what ? ` (${artist.what})` : ''}`
      })
    },
    linkReference(reference) {
      if (this.$trackIsSpoiler(reference)) {
        return '??????'
      } else if (reference in this.$archive.music.tracks) {
        return `<a href="/music/track/${this.$archive.music.tracks[reference].directory}">${this.$archive.music.tracks[reference].name}</a> <i>by ${this.joinNoOxford(this.linkArtists(this.$archive.music.tracks[reference].artists))}</i>`
      } else return reference
    },
    linkTrack(dir) {
      if (this.$trackIsSpoiler(dir)) return '<span class="spoiler">??????</span>'
      if (dir in this.$archive.music.tracks) {
        const track = this.$archive.music.tracks[dir]
        const href = `/music/track/${track.directory}`
        const duration = track.duration ? `<span class="duration">${this.secondsToMinutes(track.duration)}</span>` : ''
        const html = `<a href="${href}">${track.name}</a>${duration}`
        return html
      } else return dir 
    },
    getPage(page){
      if (page in this.$archive.mspa.story) {
        const title = this.$archive.mspa.story[page].title
        const thumbnail = this.$mspaToViz(page).p
        const pageNum = (!/\D/.test(page) ? 'Page ' : '') + (this.$localData.settings.mspaMode ? page : thumbnail)
        const url = `/mspa/${page}`
        return {
          title, 
          pageNum,
          thumbnail,
          url
        }
      } else if (page == 'ps_titlescreen') return ({
        title: 'Problem Sleuth Titlescreen',
        pageNum: 'ps_titlescreen',
        thumbnail: 'ps_titlescreen',
        url: '/unlock/PS_titlescreen'
      })
      else if (page == 'assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf') return ({
        title: 'SBAHJthemovie1',
        pageNum: 'SBAHJthemovie1',
        thumbnail: 'SBAHJthemovie1',
        url: 'assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf'
      })
      else return ({
        title: page,
        pageNum: page,
        url: undefined,
        thumbnail: undefined
      })
    },
    secondsToMinutes(time) {
      if (Number.isInteger(time)){
        const m = Math.floor(time % 3600 / 60)
        const s = Math.floor(time % 3600 % 60)

        var mDisplay = m.toString().padStart(2, '0')
        var sDisplay = s.toString().padStart(2, '0')
        return mDisplay + ':' + sDisplay
      } else return ''
    },
    getUTCDate(date){
      const d = new Date(date)
      const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getUTCMonth()]
      return `${month} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
    }
  }
}
</script>

<style scoped lang="scss">
.discographyPage {
  h2.trackTitle {
    font: normal 28px/1em 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: -4px 30px 8px 0; /* right margin equal to space between columns */
    word-wrap: break-word;
    max-width: 726px;
  }
  .discography {
    .reverseButton {
      display: inline-block;
      background: #619aa9;
      border: none;
      border-radius: 3px;
      text-align: center;
      font-weight: bold;
      padding: 5px;
      margin-bottom: 15px;
      color: #fff;
      width: 150px;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .albums {
      display: flex;
      flex-flow: row wrap;
    }
    .album {
      margin-bottom: 30px;
      margin-right: 30px;
      width: 232px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .art {
        width: 232px;
        display: block;
      }
      .title {
        width: 100%;
        font-weight: bold;
        font-size: 108%;
        margin: 0.7em 0 0.3em 0;
        .artistOverride {
          font-weight: normal;
          font-size: 95%;
        }
      }
    }
  }

  .trackography {
    .album {
      margin-bottom: 30px;
      display: flex;
      flex-flow: row;

      &:last-child {
        margin-bottom: 0;
      }
      
      .thumbnail {
        margin-right: 15px;

        .coverArt {
          display: block;
          width: 150px;
          height: 150px;
          margin: 0 auto;

          img {
            width: 100%;
            height: 100%;
            outline: 1px solid rgba(0,0,0,0.25);
          }

          &:after {
            display: none;
          }
        }
        .date {
          padding-top: 5px;
          text-align: center;
          font-style: italic;
        }
      }

      h2 {
        font-size: 20px;
        margin-top: 0;
      }

      ul, ol {
        list-style-position: inside;
        ::v-deep {
          li {
            padding: 3px 0;
            color: var(--page-links-visited);
            .spoiler {
              color: var(--font-default);
            }
            a {
              padding-right: 6px;
            }
          }
        }
      }
    }
  }

  .flashography {
    .album {
      margin-bottom: 30px;
      display: flex;
      flex-flow: row;

      &:last-child {
        margin-bottom: 0;
      }
      
      .thumbnail {
        margin-right: 15px;

        .coverArt {
          display: block;
          width: 90px;
          height: 90px;

          img {
            width: 100%;
            height: 100%;
            outline: 1px solid rgba(0,0,0,0.25);
          }

          &:after {
            display: none;
          }
        }
        .date {
          padding-top: 5px;
          text-align: center;
          font-style: italic;
        }
      }
      h2 {
        font-size: 20px;
        margin-top: 0;
      }
      ul, ol {
        list-style-position: inside;
        ::v-deep {
          li {
            padding: 3px 0;
            // color: var(--page-links-visited);
          }
        }
      }
    }
  }

  .artistography {
    .artists {
      column-count: 3;
      font-size: 15px;
      list-style-position: inside;
    }
  }
}
</style>
