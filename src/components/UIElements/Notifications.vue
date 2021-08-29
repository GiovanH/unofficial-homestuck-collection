<template>
  <transition-group name="notif-list" tag="ul" class="notifWrapper">
    <li v-for="notif in activeNotifs" class="notif" :key="notif.key">

      <button class="close" @click="clearNotif(notif.key)">
        <div class="innerClose">✕</div>
      </button>

      <a class="frame" :href="notifData[notif.notifId].url" target="_blank" @click="clearNotif(notif.key)">
        <div class="innerFrame">
          <Media class="thumb" :url="notifData[notif.notifId].thumb" draggable="false" />
          <div class="arrow">></div>
          <div class="info">
            <span class="title" v-text="notifData[notif.notifId].title"></span>
            <span class="desc" v-text="notifData[notif.notifId].desc"></span>
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
      allowEOH: false
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
    }    
  },
  methods: {
    // This switch gets flipped when new reader mode is disabled. While it is active, notifications from page '010030' are allowed to appear.
    // We use this let the credits page itself trigger the notifications once it is destroyed, but only after the reader leaves new-reader mode
    allowEndOfHomestuck() {
      this.allowEOH = true
    },
    queueFromPageId(pageId) {
      if (pageId == '010030') {
        if (this.allowEOH) {
          this.allowEOH = false
          this.notifPages['010030'].forEach(notifId => this.queueNotif(notifId))
        } 
      } else if (pageId in this.notifPages) {
        this.notifPages[pageId].forEach(notifId => this.queueNotif(notifId))
      }

      // Timestamp-based notifications

      const latestTimestamp = this.$archive.mspa.story[pageId].timestamp
      const prevTimestamp = this.$archive.mspa.story[this.$archive.mspa.story[pageId].previous].timestamp
      
      if (this.$settings.subNotifications) {
        try {
          // TODO: Optimize this so we're not iterating this much
          this.$logger.info(prevTimestamp, latestTimestamp, latestTimestamp - prevTimestamp)
          for (const newst in this.newspostsByTimestamp) {
            if (newst > prevTimestamp && newst <= latestTimestamp) {
              this.$logger.info(prevTimestamp, newst, latestTimestamp)
              this.queueNotif('notif_news')
            }
          }
        } catch (e) {
          this.$logger.warn("Couldn't compute timestamp", e)
        }
      }
    },
    queueNotif(notifId) {
      if (notifId in this.notifData) {
        let key = Math.random().toString(36).substring(2, 5) + Date.now()

        if (this.activeNotifs.length < 3) this.fireNotif({key, notifId})
        else this.queue.push({key, notifId})
      }
    },
    fireNotif(queuedNotif) {
      let timer = setTimeout(()=>{
        this.clearNotif(queuedNotif.key)
      }, this.notifDuration)
      this.activeNotifs.push({...queuedNotif, timer})
    },
    clearNotif(key) {
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
