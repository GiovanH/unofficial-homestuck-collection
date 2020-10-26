<template>
  <div class="albumPage">

    <div class="nameSection">
      <h2 class="trackTitle">{{album.name}}</h2>
      <h3 class="byArtist">by <span v-html="linkAndJoinComposers" /></h3>
      <h3 class="byArtist" v-if="album.albumCoverArtists && album.albumCoverArtists[0].who != 'homestuck'">cover art by <span v-html="linkAndJoinCoverArtists" /></h3>
    </div>

    <div class="middleColumn">
      <a :href="`/archive/music/${album.directory}/cover.jpg`">
        <Media :url="`/archive/music/${album.directory}/cover.jpg`" />
      </a>
    </div>

    <div class="info">    
      <p class="links" v-if="linkAndJoinExternalMusic">Listen on <span v-html="linkAndJoinExternalMusic" /></p>

      <p class="date" v-if="album.date">Released {{getUTCDate(album.date)}}</p>

      <div class="albumGroup" v-if="albumGroups">
        <div class="albumGroup"  v-for="group in Object.keys(albumGroups)">
          <p><em>{{groupIsSpoiler(albumGroups[group]) ? '??????' : group}}:</em></p>
          <ol class="groupList">
            <li v-for="track in albumGroups[group]" v-html="track" />
          </ol>
          <br>
        </div>
      </div>

      <ol v-else>
        <li v-for="track in album.tracks" v-html="linkTrack(track)" />
      </ol>

      <div class="bonusItems" v-if="album.bonus && album.bonus.length > 0">Bonus items included with <i>{{album.name}}</i>:
        <ul>
          <li v-for="bonus in album.bonus" >
            <a :href="`/archive/music/${album.directory}/${bonus}`" v-text="bonus" />
          </li>
        </ul>
      </div>
    </div>

    <div v-if="album.commentary" class="commentaryContainer">
      <p class="commentaryHeader">Album Commentary:</p>
      <p class="commentary" ref="commentary" v-if="!$isNewReader" v-html="album.commentary.replace(/\n/g, '<br><br>')" />
      <p class="commentary lock" ref="commentary" v-else>
        <span class="lock">Finish Homestuck to unlock inline commentary!</span>
      </p>
    </div>

  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'MusicAlbum',
  props: [
    'album'
  ],
  components: {
    Media
  },
  data: function() {
    return {
    }
  },
  computed: {
    albumGroups() {
      if (this.album.usesGroups) {
        let groups = {}
        this.album.tracks.forEach(track => {
          let group = this.$archive.music.tracks[track].group || "Tracks without a group"
          if (!groups[group]) groups[group] = []
          groups[group].push(this.linkTrack(track)) 
        })
        return groups
      }
      else return false
    },
    linkAndJoinComposers() {
      return this.linkAndJoinArtists(this.album.artists || ['homestuck'])
    },
    linkAndJoinCoverArtists() {
      return this.linkAndJoinArtists(this.album.albumCoverArtists || [])
    },
    linkAndJoinExternalMusic() {
      if (this.album.urls) {
        let sources = this.album.urls.map(url =>`<a href="${url}">${
          url.includes('bandcamp.com') ? 'Bandcamp' :
          url.includes('youtu') ? (url.includes('list=') ? 'YouTube (Playlist)' : 'YouTube (Full Album)') :
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
  methods:{
    //thnks florrie 👍
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
    groupIsSpoiler(group) {
      return this.$isNewReader && !group.find(track => !(track).includes('>??????<'))
    },
    linkTrack(dir) {
      if (this.$trackIsSpoiler(dir)) return '<span style="color:#000000">??????</span>'
      if (dir in this.$archive.music.tracks) {
        let track = this.$archive.music.tracks[dir]
        let href = `/music/track/${track.directory}`
        let duration = track.duration ? `<span class="duration">${this.secondsToMinutes(track.duration)}</span>`: ''
        let html = `<a href="${href}">${track.name}</a>${duration}`
        return html
      }
      else return dir 
    },
    linkAndJoinArtists(array) {
      let artists = array.map(artist => {
        if (typeof artist == 'string') return `<a href="/music/artist/${artist}">${this.$archive.music.artists[artist].name}</a>`
        else return `<a href="/music/artist/${artist.who}">${this.$archive.music.artists[artist.who].name}</a>${!!artist.what ? ` (${artist.what})` : ''}`
      })
      return this.joinNoOxford(artists)
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
    }
  },
  mounted(){
    if (this.album.commentary && this.$refs.commentary) this.$filterLinksAndImages(this.$refs.commentary)
  }
}
</script>

<style scoped lang="scss">
.albumPage {
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

    > ol, > ul, > div, > p, > iframe {
      margin-top: 16px;
    }
    

    ol, ul {
      list-style-position: inside;
      color: var(--page-links-visited);;
      &.groupList {
        margin-left: 20px;
      }
    }
    li {
      padding: 3px 0;
      ::v-deep {
        a {
          padding-right: 6px;
        }
      }
    }

    .references, .referencedBy {
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

