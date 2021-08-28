<template>
<div class="frame">
  <NavBanner />
  <div class="content">
    <div class="main">

      <div class="ask">
        <h1><span>Ask me about MS Paint Adventures.</span></h1>
        <div class="profile_ask_container">
          <textarea cols="" disabled="" maxlength="255" placeholder="Ask Andrew Hussie a question" rows=""></textarea>
          <div class="textarea_btm_nav">
          </div>
        </div>
      </div>

      <ul class="questions">
        <li v-for="post in posts" class="question profile-stream" :class="[post.id]" :key="post.id">
          <Media class="avatar" alt="Andrew Hussie" :url="`/archive/social/formspring/${/^question/.test(post.id) ? 'mspadventures' : 'andrewhussie'}.png`" />
          <div class='postHtml' v-html="post.html" />
        </li>
      </ul>

    </div>
    <div class="sidebar">

      <div class="module profile">
        <div class="avatars">
          <Media class="photo" :class="{active: profile == 'andrewhussie'}" @click.native="changeProfile(0)" title="andrewhussie" alt="Andrew Hussie" url="/archive/social/formspring/andrewhussie.png" width="70" />
          <Media v-if="!$pageIsSpoiler('005198')"  class="photo":class="{active: profile == 'mspadventures'}" @click.native="changeProfile(1)" title="mspadventures" alt="Andrew Hussie" url="/archive/social/formspring/mspadventures.png" width="70" />
          <Media v-else class="photo active" title="??????" alt="??????" url="/archive/music/spoiler.png" width="70" />
        </div>
        <div class="basics">
          <h2>Andrew Hussie</h2>
          <p class="url">
            <a href="/" target="_blank">www.mspaintadventures.com/</a>
          </p>
          <button @click="reversePosts()">Reverse post order</button>
        </div>
      </div>

      <div class="module connections">
        <h2>Who made Andrew Hussie smile</h2>
        <ul class="user_mademesmile">
          <li>
            <Media alt="Andrew Hussie" title="Andrew Hussie" url="/archive/social/formspring/andrewhussie.png" width="24" />
          </li>
        </ul>
      </div>
      
      <div class="module filteredPostCount" v-if="filteredPostCount > 0">
        <p><strong>{{filteredPostCount}}</strong> posts have been hidden. Keep reading Homestuck to unlock more!</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'

export default {
  name: 'formspring',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, NavBanner
  },
  data() {
    return {
      profile: 'andrewhussie',
      reverse: true
    }
  },
  computed: {
    posts() {
      const filteredPosts = this.$isNewReader ? this.$archive.social.formspring[this.profile].filter(post => post.timestamp <= this.$archive.mspa.story[this.$localData.settings.newReader.current].timestamp) : [...this.$archive.social.formspring[this.profile]]
      return this.reverse ? filteredPosts.reverse() : filteredPosts
    },
    filteredPostCount() {
      return this.$archive.social.formspring[this.profile].length - this.posts.length
    }
  },
  methods: {
    reversePosts() {
      this.reverse = !this.reverse
    },
    changeProfile(profile){
      this.profile = ['andrewhussie', 'mspadventures'][profile] ? ['andrewhussie', 'mspadventures'][profile] : this.profile
    },
    jumpToClass(id){
      let className = id || ""
      let el = document.getElementById(this.tab.key).getElementsByClassName(className.toLowerCase())[0]
      if (el) {
        el.scrollIntoView(true)
      }
      else {
        document.getElementById(this.$localData.tabData.activeTabKey).scrollTop = 0
      }
    }
  },
  watch: {
    'tab.history': function (to, from) {
      if (/^question/.test(this.routeParams.id) || this.$isNewReader) this.profile = 'mspadventures'
      else this.profile = 'andrewhussie'

      this.jumpToClass(this.routeParams.id)
    }
  },
  mounted(){
    this.jumpToClass(this.routeParams.id)
  },
  created(){
    if (/^question/.test(this.routeParams.id) || this.$isNewReader) this.profile = 'mspadventures'
    else this.profile = 'andrewhussie'
  }
}
</script>

<style lang="scss" scoped>
h1, h2, h3, h4, h5 {
  margin: 0 0 1em;
}

.frame {
  background: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: initial;
  font-size: 14px;
  .navBanner {
    margin: 0 auto;
  }
}
.content {
  border:1px solid #a0c5d1;
  border-bottom:2px solid #8db1bf;
  border-radius:10px;
  margin:5px auto;
  min-height: 500px;
  padding:45px 40px 30px;
  position:relative;
  width:880px;
  overflow: hidden;

  .main {
    width: 600px;
    float: left;

    .ask {
      min-height: 155px;
      h1 {
        font-size: 18px;
      }
      .profile_ask_container {
        border:1px solid #c4c4c4;
        border-radius:5px;
        textarea {
          font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
          background: #fff;
          border: 0;
          min-height: 50px;
          width: 568px;
          border-radius: 5px;
          font-size: 14px;
          padding: 8px 15px;
          resize: none;

          &::placeholder {
            color: silver;
          }
        }
        .textarea_btm_nav {
          background-color: #EFEFEF;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          display: block;
          height: 30px;
          padding: 0 5px;
        }
      }
    }

    .questions {
      margin-top: 30px;
      list-style: none;

      .question {
        transition: background-color .4s ease-in-out;
        border-bottom: 1px solid #ededed;
        padding: 20px 10px;

        .avatar {
          float: left;
          width: 55px;
          border-radius: 3px;
        }
        .postHtml ::v-deep{
          h1, h2, h3, h4, h5 {
            margin: 0 0 1em;
          }

          .question-container {
            border-bottom: 1px solid #ededed;
            margin: 0 35px 12px 65px;
            h2 {
              color: #323232;
              font-size: 12px;
              margin-right: 35px;
              word-wrap: break-word;

              a {
                color: #323232;
                outline: none;
                text-decoration: none;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
            h3 {
              font-size: 10px;
              padding-bottom: 12px;
              margin: 0;
              color: #005ccc;
              
              span {
                position: relative;
                left: 3px;
                top: -3px;
              }

              &.qotd:before {
                content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABvUlEQVQ4y23TTYhNcRgG8N+ZOWl8zKhxQ0kmC2coEckCSQmFUfeKYiOSUkQkH0UjXwv2UpiFhcJKWczUuFc2g0kJGzHydWM0kvE1xbV5b50mb/0X59//ec7zvM/7JlmW+U+tw1pMxjjU8AWv8AT9GEAtHQWciXNYgbH4i+9B0IQxaMRjHEElySloxmG04hm+YTAIPsf3eJRwDFVszhOkWIOlceaiJafuPcq4jik4i3KdoDkk7Qjf5fBaxS9MwmwsRwFX8AAz0vB2ATtRwW4swFTcDjv1asMJbMdHdKYoBvgOTqIPi7EVW+K+D7/Rjqe4j424lMbD17iFy7iGQ3iI/ZFIMRR8xVEMYxrSFLPwMqROwPGI6jRuYBGmx10Vy7AaXXjTgB/h90WoeYdT6MGuAA6Egj3oxKOwO5KiF/vQEawr41Ex/lavGkZwEefDRlOSZdkc3MUfbEN3ANqxJLwmIb8niA6GjQONhUJhMJpYwqYYkmE8j0ZW4vTHflwNcC9u5idxFc5gIYZi8j7hbSTUjXuYh72R1s9k1Da2Ri82YD4mxgI1RP5ZkKzPz3++hqKRXbEHLTHapWhqig95wD/21nOihdEoawAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII=);
              }
              &.wiki:before {
                content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAB5ElEQVQ4y62TQWsaURSFP1OQEigmIdBsmtVYhCJ2EYoL0RlGEglCRpJ2MzsxixTchy7G/AT/R1Fm1Sw6Q7NwU0Ix01BIy4PRRWioTnVcSBcGuwh51CZd2Qtv8S7vnPvOufdGJteTKXPEwjzg/0Pgui6maVLcLuK6LgCNtw2K20Usy0IIAYBlWZimiRACIQTVahXTNFnQdZ3ksySdbkey7r7cBaDZaAIQ9AIWHy6iqRqKorAcWwZAU7UbCXuv9giHIbZtE/QCAIySQTgM8doevu9z+f2Syn5l5vuV/coNgaIoZNUsdtPG930AVE0llUpRO6rhOA5qVpXAs89n8i5NLJfLADiOwy2pUTIQ3wTnX86lrKAXcPrxlKWVpVkCXddJpVK0Wi1pnKqppNNpwkEoqw/CAeNfY3Rdv9vGTCaD897Ba3szWjvdjuzQyYcT1p+s3z8Hh28OUZ4qNO0mQS/Aa3sknydZXVnFtm0A+r0+JaMkMQ+smnX0J8koHNH+1ObqxxVrj9fYMXYYjoYcvzsmGo0yHo/ZLGz+exLj8Tj9n305A4qikMvlAKjX6+Tz+VnA5Hoy/fsUtgrTwlZhevH1QuYOXh9ME4nEnbeR+7bRdV1ij2JsvNiQOSEE3W5Xun8bkXnX+Td8se4qLR0loAAAAABJRU5ErkJggg==);
              }
            }
          }

          .response-container {
            margin-bottom: 1em;
            margin-left: 65px;
            line-height: 18px;
          }

          .meta {
            margin-left: 65px;
            color: #b8b8b8;
            font-size: 11px;
            line-height: 14px;

            .user {
              color: #005ccc;
            }
          }
        }

        &:hover {
          background-color: #effaff;
        }
      }

    }
  }

  .sidebar {
    margin: 13px 0 0 640px;
    
    .module {
      border-bottom: 1px solid #e5e5e5;
      border-top: 1px solid #fff;
      overflow:hidden;
      padding:15px 0;

      h2 {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
    .avatars {
      img {
        border:5px solid #f1efe0;
        border-radius:5px;
        margin-right: 10px;
        cursor: pointer;

        opacity: 0.5;
        transition: all 0.1s;
        &:hover {
          opacity: 0.8;
        }
        &.active {
          opacity: 1;
          border-color: #e4dfc1;
        }
      }
    }
    .basics {
      h2 {
        margin-top: 8px;
      }
      a {
        color:#a8a7a7;
        font-size:12px;
        line-height:12px;
      }
      button {
        margin-top: 8px;
        height: 30px;
        width: 150px;

        font-weight: bold;
        font-size: 14px;

        border: solid 2px #a8a7a7;
        border-radius: 5px;
        
        background-color: #ffffff;
        transition: background-color 0.15s;

        &:hover {
          cursor: pointer;
          background-color: #cfeffd;
        }
      }
    }
  }
}
</style>