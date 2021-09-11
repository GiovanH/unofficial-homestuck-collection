<template>
<div class="frame">
  <NavBanner />
  <div class="wrapper">
    <a class="title" href="/tumblr">:o</a>

    <ul class="content">
      <li v-for="post in posts" class="post" :class="[post.id]" :key="post.id">
        <div class="postContent" v-html="post.html" />
        <div class="bottom" />
      </li>
    </ul>

    <div class="sidebar">
      <div class="top">
        <div class="avatar">
          <Media alt="Andrew Hussie" url="/archive/social/tumblr/avatar.png" />
        </div>
        <div class="description">
          <p>Andrew Hussie's tumblr account.</p>
          <br>
          <p>(AUTHOR OF INTERNET WEBCOMIC SENSATION, MSPAINTADVENTURES.COM)</p>
          <p class="filteredPostCount" v-if="filteredPostCount > 0">
            <br>
            <strong>{{filteredPostCount}}</strong> posts have been hidden. Keep reading Homestuck to unlock more!
            <br><br>
          </p>

          <button @click="reversePosts()">Reverse post order</button>
          
        </div>
      </div>

      <div class="bottom" />

      <div class="copyright">
        © 2011–2013
        <a href="http://www.tumblr.com/">Powered by Tumblr</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'

import Resources from '@/resources.js'

export default {
  name: 'tumblr',
  mixins: [ Resources.UrlFilterMixin ],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, NavBanner
  },
  title: () => ":o",
  data() {
    return {
      reverse: true
    }
  },
  computed: {
    posts() {
      let filteredPosts = this.$isNewReader ? this.$archive.social.tumblr.filter(post => post.timestamp <= this.$archive.mspa.story[this.$newReaderCurrent].timestamp) : [...this.$archive.social.tumblr]
      return this.reverse ? filteredPosts.reverse() : filteredPosts
    },
    filteredPostCount() {
      return this.$archive.social.tumblr.length - this.posts.length
    }
  },
  methods:{
    reversePosts() {
      this.reverse = !this.reverse
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
      this.jumpToClass(this.routeParams.id)
    }
  },
  updated(){
    this.filterLinksAndImages(this.$el.querySelector('.content'))
  },
  mounted(){
    this.jumpToClass(this.routeParams.id)
    this.filterLinksAndImages(this.$el.querySelector('.content'))
  }
}
</script>

<style lang="scss" scoped>
.frame {
	background: #3b627e;
	font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: initial;

  .navBanner {
    margin: 0 auto;
  }
}

.wrapper {
  width: 845px;
  margin: 0 auto;

  > .title {
    display: block;
    margin: 30px 0;
    color: #fff;
    font-size: 50px;
    font-weight: bold;
    text-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
    letter-spacing: -1px;
    text-decoration: none;
  }
  .content {
    list-style: none;
    width: 520px;
    float: left;

    .post {
      .postContent {
        background: #fff;
        position: relative;
        padding: 10px;

        ::v-deep {
          a {
            text-decoration: none;
            color: #6e7173;
            &.noIcon:after {
              display: none;
            }
          }
          img {
            max-width: 500px;
          }
          .title {
            color: #494949;
            font-size: 16px;
            font-weight: bold;
            padding: 10px 10px 0 10px;
          }
          .link {
            margin: 4px 0 2px 10px;
            font-size: 16px;
            line-height: 25px;
            
            a {
              background-color: #3b627e;
              color: #fff;
              padding: 5px 7px;
              border-radius: 4px;

              &:hover {
                opacity: 0.9;
              }
            }
          }
          .media {
            text-align: center;
            margin-bottom: 10px;
          }
          .copy {
            color: #6e7173;
            padding: 10px;
            font-size: 13px;
            line-height: 15px;

            > p:first-child{
              margin-top: 0;
            }
            p {
              margin: 10px 0 0 0;
              padding: 0;
            }
            a {
              text-decoration: underline;
            }
            img {
              max-width: 100%;
            }
            ul {
              display: block;
              list-style-type: disc;
              margin-block-start: 1em;
              margin-block-end: 1em;
              margin-inline-start: 0px;
              margin-inline-end: 0px;
              padding-inline-start: 40px;
            }
            blockquote {
              margin: 10px 0px 10px 10px;
              padding-left: 15px;
              border-left: solid 4px #dcdcdc;
            }
          }
          .footer {
            background: #eaeaea;
            border-radius: 4px;
            font-family: 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif;
            font-size: 11px;
            color: #666;
            padding: 5px 10px;
            margin-top: 10px;

            &.for_permalink:hover {
              opacity: 0.9;
            }

            &.date {
              width: 67%;
              float: left;
              color: #666;
            }

            &.notes {
              width: 33%;
              float: right;
              text-align: right;
              color: #666;
              a {
                color: #666;
              }
            }
            &.tags {
              color: #4a4a51;
              text-decoration: underline;
            }
          }
        }
      }
      .bottom {
        background: url('assets://archive/social/tumblr/shadow-post.png') top center no-repeat transparent;
        width: 513px;
        height: 40px;
        margin: 0 auto;
      }
    }
  }
  .sidebar {
    font-family: 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif;
    float: right;
    width: 250px;

    .top {
      color: #3b627e;
      background: #fff;
      padding: 0 20px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      .avatar {
        margin-bottom: 10px;
        padding: 8px 0 0 9px;
        position: relative;
        top: -24px;
        left: -5px;

        img {
          border: 4px solid #fff;
          box-shadow: 0 0 10px -3px #000;
        }
      }
      .description {
        font-size: 11px;
        position: relative;
        top: -18px;

        .filteredPostCount {
          margin-top: 14px;
          border-top: solid 1px #3b627e;
          border-bottom: solid 1px #3b627e;
        }

        button {
          font-family: helvetica, arial, sans-serif;
          background-color: #3b627e;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
          font-weight: bold;
          font-size: 17px;
          cursor: pointer;
          padding: 10px;
          color: #fff;
          border: none;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }

    .bottom {
      background: url('assets://archive/social/tumblr/sidebar-bottom.png') top center no-repeat transparent;
      width: 250px;
      height: 25px; 
    }

    .copyright {
      color: #fff;
      font-size: 12px;
      text-align: center;
      
      a {
        color: #fff;
        margin-left: 15px;
      }
    }
  }
  .clear {
    clear: both;
    height: 0px;
    overflow: hidden;
  }
}
</style>