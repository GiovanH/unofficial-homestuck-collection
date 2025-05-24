<template>
  <div class="artistPage">
    <h2 class="trackTitle" v-text="artistName"/>
    <p class="links" v-if="linkAndJoinExternalMusic">Visit on <span v-html="linkAndJoinExternalMusic" /></p>
    <div class="trackography" >
      <div class="album" v-for="album in trackographyFiltered" :key="album.directory">
        <div class="thumbnail">
          <a v-if="album.directory && !$albumIsSpoiler(album.directory)" :href="`/music/album/${album.directory}`" class="coverArt">
            <Media :url="`/archive/music/${album.directory}/cover.jpg`" />
          </a>
          <div v-else class="coverArt">
            <Media url="/archive/music/spoiler.png" />
          </div>
          <p v-if="album.directory && $archive.music.albums[album.directory].date" class="date" v-text="getUTCDate($archive.music.albums[album.directory].date)" />
        </div>
        <div>
          <a :href="`/music/album/${album.directory}`" v-if="album.directory && !$albumIsSpoiler(album.directory)"><h2 class="trackTitle">{{$archive.music.albums[album.directory].name}}</h2></a>
          <h2 class="trackTitle" v-else>??????</h2>

          <div class="credits">
            <div class="musicList" v-if="album.music && album.music.length > 0">
              <p>Music worked on by <em>{{artist.name}}</em>:</p>
              <ul>
                <li v-for="track in album.music" v-html="linkTrackCredit(track)"/>
              </ul>
            </div>
            <div class="artList" v-if="album.art && (album.art.length > 0 || album.coverArt)">
              <p>Track art worked on by <em>{{artist.name}}</em>:</p>
              <ul>
                <li v-if="album.coverArt" v-html="`Cover art${album.coverArt.what ? ` (${album.coverArt.what})` : ''}`" />
                <li v-for="art in album.art" v-html="linkTrackCredit(art)"/>
              </ul>
            </div>
            <div class="spoiler" v-if="!album.directory">
              <p>Keep reading to unlock!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'MusicArtist',
  props: [
    'artist'
  ],
  components: {
    Media
  },
  data: function() {
    return {
    }
  },
  computed: {
    artistName(){
      return this.artist.alias ? `${this.artist.name} (a.k.a ${this.artist.alias})` : this.artist.name
    },
    trackographyFiltered() {
      const filteredCredits = this.artist.credits.filter(albumCredit => {
        if (this.$albumIsSpoiler(albumCredit.directory)) {
          let isValidAlbum = false
          albumCredit.music.forEach(track => {
            if (!this.$trackIsSpoiler(track.track)) isValidAlbum = true
          })
          albumCredit.art.forEach(track => {
            if (!this.$trackIsSpoiler(track.track)) isValidAlbum = true
          })
          return isValidAlbum
        } else return true
      })
      if (filteredCredits.length < this.artist.credits.length) filteredCredits.push({})
      return filteredCredits
    },
    linkAndJoinExternalMusic() {
      let sources = this.artist.urls.map(url =>`<a href="${url}">${
        url.includes('bandcamp.com') ? 'Bandcamp' :
        url.includes('youtu') ?  'YouTube' :
        url.includes('soundcloud') ? 'SoundCloud' :
        url.includes('tumblr.com') ? 'Tumblr' :
        url.includes('twitter.com') ? 'Twitter' :
        url.includes('deviantart.com') ? 'DeviantArt' :
        url.includes('wikipedia.org') ? 'Wikipedia' : url}</a>`)
      return (new Intl.ListFormat('en', { style: 'long', type: 'disjunction' }).format(sources))
    }
  },
  methods: {
    linkAlbum(album) {
      return this.$albumIsSpoiler(album) ? '??????' : `<a href="/music/album/${album}">${this.$archive.music.albums[album].name}</a>`   
    },
    linkTrackCredit(trackCredit){
      return this.$trackIsSpoiler(trackCredit.track) ? '??????' : `<a href="/music/track/${trackCredit.track}">${this.$archive.music.tracks[trackCredit.track].name}</a>${trackCredit.what ? ` (${trackCredit.what})` : ''}` 
    },
    linkReference(reference) {
      if (this.$trackIsSpoiler(reference)) {
        return '??????'
      } else if (reference in this.$archive.music.tracks) {
        return `<a href="/music/track/${this.$archive.music.tracks[reference].directory}">${this.$archive.music.tracks[reference].name}</a>`
      } else return reference
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
.artistPage {
  font: 13px/1.231 'Helvetica Neue', Helvetica, Arial, sans-serif;

  h2.trackTitle {
    font: normal 28px/1em 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: -4px 30px 8px 0; /* right margin equal to space between columns */
    word-wrap: break-word;
    max-width: 726px;
  }
  
  a {
    color: var(--page-links);
  }

  .trackography {
    margin-top: 20px;
    .album {
      &:not(:last-child) {
        margin-bottom: 30px;
      }
      display: flex;
      flex-flow: row;

      &:first-child {
        margin-top: 0;
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
      .credits {
        >:not(:last-child) {
          margin-bottom: 10px;
        }
        ul {
          list-style-position: inside;
          ::v-deep {
            li {
              padding: 3px 0;
              .spoiler {
                color: var(--font-default);
              }
            }
          }
        }
      }
    }
  }
}
</style>
