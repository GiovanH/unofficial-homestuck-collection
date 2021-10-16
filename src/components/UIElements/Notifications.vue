<template>
  <transition-group name="notif-list" tag="ul" class="notifWrapper">
    <li v-for="notif in activeNotifs" class="notif" :key="notif.key">

      <button class="close" @click="clearNotif(notif.key)">
        <div class="innerClose">✕</div>
      </button>

      <a class="frame" :href="notif.url" target="_blank" @click="clearNotif(notif.key)">
        <div class="innerFrame">
          <Media class="thumb" :url="notif.thumb" draggable="false" />
          <div class="arrow">></div>
          <div class="info">
            <span class="title" v-text="notif.title"></span>
            <span class="desc" v-text="notif.desc"></span>
          </div>
        </div>
      </a>

    </li>
  </transition-group>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'
import {notifData, notifPages} from '@/js/notifications.js'

export default {
  name: 'Notifications',
  components: {
    Media
  },
  data: function() {
    return {
      notifData,
      notifPages,
      notifDuration: 10000,
      activeNotifs: [],
      queue: [],
      maxActiveNotifs: 3,
      allowEOH: false,
      DateTime: require('luxon').DateTime
    }
  },
  computed: {
    newspostsByTimestamp() {
      return Object.values(this.$archive.news).reduce(function(acc, y){
        return acc.concat(y)
      }, []).reduce(function(acc, n){
        acc[n.timestamp] = n
        return acc
      })
    },
    sortedNewspostTimestamps() {
      return Object.keys(this.newspostsByTimestamp).map(Number).sort()
    }    
  },
  methods: {
    formatTimestamp(timestamp){
      return this.DateTime.fromSeconds(Number(timestamp))
        .setZone("America/New_York")
        .toFormat("MM/dd/yyyy, ttt")
    },
    // This switch gets flipped when new reader mode is disabled. While it is active, notifications from page '010030' are allowed to appear.
    // We use this let the credits page itself trigger the notifications once it is destroyed, but only after the reader leaves new-reader mode
    allowEndOfHomestuck() {
      this.allowEOH = true
    },
    timestampsBetween(time1, time2, corpus) {
      // Returns all values in `corpus` that are between `time1` and `time2`.
      // Corpus is expected to be sorted already.

      // Time1 is the "current" timestamp
      // Time2 is the "next" timestamp
      // Corpus is a sorted list of all the timestamps

      if (time2 <= time1) return []

      // this.$logger.info("Searching between", this.formatTimestamp(time1), "&", this.formatTimestamp(time2))

      let ret = []
      let newst = -1
      for (let i = 0; newst <= time2; newst = corpus[i++]) {
        if (newst > time1) {
          ret.push(newst)
          // this.$logger.info("Found", this.formatTimestamp(newst))
        }
      }

      return ret
    },
    makeNewsNotif(newspost){
      let d = document.createElement("div")
      const desc_length = 140
      d.innerHTML = newspost.html
      const desc = d.innerText.slice(0, desc_length).replace('\n', '') + (d.innerText[desc_length + 1] ? "..." : "")

      return {
        title: 'New news post',
        desc: desc,
        url: `/news/${newspost.id}`,
        thumb: '/archive/collection/archive_news.png'
      }
    },
    makeModUnlockNotif(modChoice){
      return {
        title: 'NEW MOD UNLOCKED',
        desc: modChoice.label,
        url: `/settings/mod`,
        thumb: '/archive/collection/archive_desktops.png'
      }
    },
    queueFromPageId(pageId) {
      if (pageId == '010030') {
        if (this.allowEOH) {
          this.allowEOH = false
          this.notifPages['010030'].forEach(notifId => this.queueNotif(notifData[notifId]))
        } 
      } else if (pageId in this.notifPages) {
        this.notifPages[pageId].forEach(notifId => this.queueNotif(notifData[notifId]))
      }

      for (const modKey in this.$modChoices) {
        const modChoice = this.$modChoices[modKey]
        if (modChoice.locked == pageId) {
            this.queueNotif(this.makeModUnlockNotif(modChoice))
        }
      }

      // Timestamp-based notifications
      
      if (this.$localData.settings.subNotifications) {
        try {
          // See also $timestampIsSpoiler
          // but we can't reuse that logic because we're passing an explicit time point here
          const latestTimestamp = this.$archive.mspa.story[pageId].timestamp
          const nextTimestamp = Math.min(...this.$archive.mspa.story[pageId].next.map(
            npageid => this.$archive.mspa.story[npageid].timestamp
          ))

          // Newsposts
          const news_between = this.timestampsBetween(
            latestTimestamp, nextTimestamp, 
            this.sortedNewspostTimestamps
          )
          // Group newsposts if too many
          if (news_between.length <= this.maxActiveNotifs) { 
            news_between.forEach(newst => {
              this.queueNotif(this.makeNewsNotif(this.newspostsByTimestamp[newst]))
            })
          } else {
            const newspost_0 = this.newspostsByTimestamp[news_between[0]]
            this.$logger.info(newspost_0)
            this.queueNotif({
              title: 'New news posts',
              desc: `${news_between.length} new news posts`,
              url: `/news/${newspost_0.id}`,
              thumb: '/archive/collection/archive_news.png'
            })
          }
        } catch (e) {
          this.$logger.warn("Couldn't compute timestamp", e)
        }
      }
    },
    queueNotif(notif) {
      // Add notification to the queue and fire it if there's room to display it.
      let key = Math.random().toString(36).substring(2, 5) + Date.now()
      const notifEntry = {...notif, key} // Add key to notif object

      if (this.activeNotifs.length < this.maxActiveNotifs) this.fireNotif(notifEntry)
      else this.queue.push(notifEntry)
    },
    fireNotif(queuedNotif) {
      // Add notification to activeNotifs and also queue its removal
      let timer = setTimeout(()=>{
        this.clearNotif(queuedNotif.key)
      }, this.notifDuration)
      this.activeNotifs.push({...queuedNotif, timer}) // Add timer to notif object
    },
    clearNotif(key) {
      // Remove notification with key `key` from activeNotifs
      // If there are more notifications in the queue, process the queue.
      let notif = this.activeNotifs.findIndex(notif => notif.key == key)
      if (notif > -1) {
        clearTimeout(this.activeNotifs[notif].timer)
        this.activeNotifs.splice(notif, 1)

        if (this.queue.length > 0) this.fireNotif(this.queue.shift())
      }
    }
  }
}
</script>

<style scoped lang="scss">

.notifWrapper {
  position: fixed;
  width: 400px;
  height: 100%;
  pointer-events: none;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
  bottom: 5px;

  right: 30px;
}
.notif {
  pointer-events: auto;
  display: inline-block;
  position: relative;
  list-style: none;
  width: 100%;
  opacity: 1;
  z-index: 1;
  margin-bottom: 10px;

  transition: all .2s;

  .close {
    position: absolute;
    left: -35px;
    padding: 0;
    width: 30px;
    height: 30px;
    border: solid 3px #ff9000;
    background: black;

    &:hover {
      cursor: pointer;
    }

    .innerClose {
      width: 100%;
      height: 100%;
      border: 2px solid #ffff00;
      box-sizing: border-box;
      color: white;
    }
  }

  .frame {
    border: 4px solid #ff9000;
    display: flex;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      .title {
        text-decoration: underline;
      }
    }
    .innerFrame {
      font-size: 14px;
      line-height: 1.6;

      width: 100%;
      padding: 10px;

      color: white;
      background: black;
      border: 3px solid #ffff00;

      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      user-select: none;

      .thumb {
        align-self: center;
        width: 64px;
        height: 64px;
      }
      .arrow {
        margin-left: 10px;
        line-height: 1;
      }
      .info {
        margin-left: 5px;
        .title {
          line-height: 1;
          display: block;
          font-size: 16px;
        }
        .desc {
          padding-top: 3px;
          display: block;
          font-family: Verdana, Arial, Helvetica, sans-serif;
          font-weight: normal;
          font-size: 12px;
          color: #969696;
        }
      }
    }
  }
}

.notif-list-enter, .notif-list-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.notif-list-leave-to {
  z-index: 0;
}
.notif-list-leave-active {
  position: absolute;
}

</style>
