<template>
  <div class="trackPage">
    <div class="nameSection">
      <h2 class="trackTitle">{{track.name}}</h2>
      <h3 class="byArtist" >from <span v-html="linkAndJoinAlbums" /></h3>
      <h3 class="byArtist">by <span v-html="linkAndJoinComposers" /></h3>
      <h3 class="byArtist" v-if="track.coverArtists && track.coverArtists[0].who != 'homestuck'">cover art by <span v-html="linkAndJoinCoverArtists" /></h3>
    </div>

    <div class="middleColumn">
      <a :href="trackArtPath">
        <Media :url="trackArtPath" width="350" />
      </a>
    </div>

    <div class="info">
      <iframe v-if="$localData.settings.bandcampEmbed && track.bandcampId" class="bandcamp" :key="track.directory" :src="`https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=333333/linkcol=0f91ff/artwork=none/track=${track.bandcampId}/transparent=true/`" seamless></iframe>

      <p class="links" v-if="linkAndJoinExternalMusic">Listen on <span v-html="linkAndJoinExternalMusic" /></p>
      
      <p>
        <span class="duration" v-if="track.duration">Duration: {{secondsToMinutes(track.duration)}}<br></span>
        <span class="release" v-if="track.date">Released {{getUTCDate(track.date)}}</span>
      </p>

      <div class="featuredIn" v-if="track.contributors && track.contributors.length > 0">Contributors:
        <ul>
          <li v-for="contributor in linkContributors" v-html="contributor"/>
        </ul>
      </div>

      <div class="featuredIn" v-if="linkPages">Pages that feature <i>{{track.name}}</i>:
        <ul>
          <li v-for="page in linkPages" v-html="page"/>
        </ul>
      </div>

      <div class="references" v-if="track.references && track.references.length > 0">Tracks that <i>{{track.name}}</i> references:
        <ul>
          <li v-for="reference in track.references" v-html="linkReference(reference)"/>
        </ul>
      </div>

      <div class="referencedBy" v-if="track.referencedBy && track.referencedBy.length > 0">Tracks that reference <i>{{track.name}}</i>:
        <ul>
          <li v-for="reference in track.referencedBy" v-html="linkReference(reference)"/>
        </ul>
      </div>
    </div>

    <div v-if="track.commentary" class="commentaryContainer">
      <p class="commentaryHeader">Track Commentary:</p>
      <p class="commentary" ref="commentary" v-if="!$isNewReader" v-html="track.commentary.replace(/\n/g, '<br><br>')" />
      <p class="commentary lock" ref="commentary" v-else>
        <span class="lock">Finish Homestuck to unlock inline commentary!</span>
      </p>
    </div>
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'
import Resources from '@/resources.js'

export default {
  name: 'MusicTrack',
  mixins: [ Resources.UrlFilterMixin ],
  props: [
    'track'
  ],
  components: {
    Media
  },
  data: function() {
    return {
    }
  },
  computed: {
    trackArtPath() {
      let dirName = this.track.album.find(album => this.$archive.music.albums[album].hasTrackArt && !this.$albumIsSpoiler(album)) || this.track.album[0]
      let fileName = this.track.coverArtists && this.$archive.music.albums[dirName].hasTrackArt ? this.track.directory : 'cover'
      return (this.$albumIsSpoiler(dirName) ) ? `/archive/music/spoiler.png` : `/archive/music/${dirName}/${fileName}.jpg`
    },
    linkAndJoinAlbums() {
      let albums = this.track.album.map(album => this.$albumIsSpoiler(album) ? '??????' : `<a href="/music/album/${album}">${this.$archive.music.albums[album].name}</a>`)
      return this.joinNoOxford(albums)
    },
    linkAndJoinComposers() {
      return this.joinNoOxford(this.linkArtists(this.track.artists || ['homestuck']))
    },
    linkContributors() {
      return this.linkArtists(this.track.contributors || ['homestuck'])
    },
    linkAndJoinCoverArtists() {
      return this.joinNoOxford(this.linkArtists(this.track.coverArtists || []))
    },
    linkPages() {
      // TODO: No. None of this is okay.
      if (this.track.pages && this.track.pages.length > 0) {
        let result = []
        this.track.pages.forEach(page => {
          if (page in this.$archive.mspa.story) {
            let flash = this.$archive.music.flashes[page]
            let bolin = 'bolin' in flash && !this.$archive.music.flashes[page].tracks.includes(this.track.directory)
            
            if (this.$pageIsSpoiler(page)) result.push('??????')
            else {
              let pageNum = this.$mspaOrVizNumber(page)
              let pageTitle = this.$archive.mspa.story[page].title
              result.push(`<em>Page ${pageNum}</em> - <a href="/mspa/${page}" target="_blank" >${pageTitle}</a> ${bolin ? ' (Removed 11/Jun/2010)' : ''}`)
            }
          }
          else if (page == 'ps_titlescreen') result.push(`<a href="/unlock/PS_titlescreen" target="_blank" >Problem Sleuth Titlescreen</a>`)
          else if (page == 'assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf') result.push(`<a href="assets://sweetbroandhellajeff/movies/SBAHJthemovie1.swf" target="_blank" >SBAHJthemovie1.swf</a>`)
          else result.push(page)
        })
        return result
      }
      else return false
    },
    linkAndJoinExternalMusic() {
      if (this.track.urls) {
        // Todo: rewrite this with host sanitization (let host = urlLib.parse(url).host == bandcamp.com)
        let sources = this.track.urls.map(url =>`<a href="${url}">${
          url.includes('bandcamp.com') ? 'Bandcamp' :
          url.includes('youtu') ? 'YouTube' :
          url.includes('soundcloud') ? 'SoundCloud' :
          url.includes('tumblr.com') ? 'Tumblr' :
          url.includes('twitter.com') ? 'Twitter' :
          url.includes('deviantart.com') ? 'DeviantArt' :
          url.includes('wikipedia.org') ? 'Wikipedia' : url}</a>`)
        return this.joinNoOxford(sources, 'or')
      }
      else return false
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
        else return `<a href="/music/artist/${artist.who}">${this.$archive.music.artists[artist.who].name}</a>${!!artist.what ? ` (${artist.what})` : ''}`
      })
    },
    linkReference(reference) {
      if (this.$trackIsSpoiler(reference)) {
        return '??????'
      }
      else if (reference in this.$archive.music.tracks) {
        return `<a href="/music/track/${this.$archive.music.tracks[reference].directory}">${this.$archive.music.tracks[reference].name}</a> <i>by ${this.joinNoOxford(this.linkArtists(this.$archive.music.tracks[reference].artists))}</i>`
      }
      else return reference
    },
    secondsToMinutes(time) {
      if (Number.isInteger(time)){
        let m = Math.floor(time % 3600 / 60)
        let s = Math.floor(time % 3600 % 60)

        var mDisplay = m.toString().padStart(2, '0')
        var sDisplay = s.toString().padStart(2, '0')
        return mDisplay + ':' + sDisplay
      }
      else return ''
    },
    getUTCDate(date){
      let d = new Date(date)
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getUTCMonth()]
      return `${month} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
    },
    filterCommentaryLinksAndImages(){
      return this.filterLinksAndImages(this.$refs.commentary);
    }
  },
  mounted(){
    if (this.track.commentary && this.$refs.commentary) this.filterCommentaryLinksAndImages()
  }
}
</script>

<style scoped lang="scss">
.trackPage {
  font: 13px/1.231 'Helvetica Neue', Helvetica, Arial, sans-serif;

  h2.trackTitle {
    font: normal 28px/1em 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: -4px 30px 8px 0; /* right margin equal to space between columns */
    word-wrap: break-word;
    max-width: 726px;
  }

  .nameSection {
    float: left;
    .byArtist {
      width: 385px;
      font: normal 14px/1.25 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
  }

  .middleColumn {
    float: right;
    padding-bottom: 20px;
    width: 350px;
    img {
      outline: 1px solid rgba(0,0,0,0.25);
      width: 350px;
    }
    a::after {
      content: none;
    }
  }

  .info {
    float: left;
    width: 376px;

    .bandcamp {
      width: 100%; 
      height: 42px;
      background: #303030;
    }

    > ol, > ul, > div, > p, > iframe {
      margin-top: 16px;
    }
    

    ol {
      list-style-position: inside;
      color: var(--page-links-visited);;
    }
    li {
      padding: 3px 0;
      a {
        padding-right: 6px;
      }
    }

    .references, .referencedBy, .featuredIn {
      ul {
        margin-left: 24px;
      }
    }
  }
  
  .commentaryContainer {
    padding-top: 24px;
    clear: both;

    .commentary {
      white-space: pre-wrap;
      background-color: white;
      color: black;
      padding: 10px;
      border: solid 3px grey;
      ::v-deep {
        a {
          color: #0000EE
        }
        img {
          max-width: 100%;
        }
        li, ul {
          list-style-position: inside;
        }
      }

      &.lock {
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>

