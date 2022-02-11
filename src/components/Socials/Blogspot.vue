<template>
<div class="body">
  <div class="outer-wrapper">
    <NavBanner />
    <div class="header-wrapper">
      <div class="header section">
        <div class="widget Header">
          <div class="header-inner">
            <div class="titlewrapper">
              <h1 class="title">
                Andrew's Blog
              </h1>
            </div>
            <div class="descriptionwrapper">
              <p class="description"><span>
              </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-wrapper">
      <div class="main section">
        <div class="blog-posts">
          <div v-for="post in posts" v-html="post.html" :class="['date-outer', post.id]" :key="post.id" />
        </div>
      </div>
    </div>

    <div class="sidebar-wrapper">
      <div class="sidebar section">

        <div class="widget BlogArchive">
          <button @click="reversePosts()">Reverse post order</button>
          <h2>Blog Archive</h2>
          <div class="widget-content">
            <div class="ArchiveList">
              <div class="BlogArchive1_ArchiveList">
                <ul class="hierarchy">
                  <li class="archivedate expanded">
                      2010
                      <span class="post-count" dir="ltr">(1)</span>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              July
                              <span class="post-count" dir="ltr">(1)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/soul-money">Soul
                                          Money</a></li>
                              </ul>
                          </li>
                      </ul>
                  </li>
              </ul>
              <ul class="hierarchy">
                  <li class="archivedate expanded">
                      2009
                      <span class="post-count" dir="ltr">(16)</span>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              November
                              <span class="post-count" dir="ltr">(1)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/interrogative-remarks-followed-by">Interrogative
                                          remarks followed by statements that ...</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              August
                              <span class="post-count" dir="ltr">(1)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/shirtsprints">Homestuck
                                          shirts/prints</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              July
                              <span class="post-count" dir="ltr">(2)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/fan-art-penny-arcade">Fan
                                          Art: The Penny Arcade</a></li>
                                  <li>
                                      <a href="/blogspot/old-blog-redux-internet-adventures">Old
                                          blog redux: Internet Adventures</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              April
                              <span class="post-count" dir="ltr">(2)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/flash-is-hard">FLASH
                                          IS HARD</a></li>
                                  <li>
                                      <a href="/blogspot/getting-ready-for-next-adventure">Getting
                                          ready for the next adventure!</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              March
                              <span class="post-count" dir="ltr">(5)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/corporate-pranksterism">Corporate
                                          Pranksterism!</a></li>
                                  <li>
                                      <a href="/blogspot/wcwe-addendum">WCWE
                                          Addendum</a></li>
                                  <li>
                                      <a href="/blogspot/webcomics-weekend-09">Webcomics
                                          Weekend 09</a></li>
                                  <li>
                                      <a href="/blogspot/pot-of-gold-at-end-of-cultural-rainbow">The
                                          pot of gold at the end of the cultural rainbow...</a>
                                  </li>
                                  <li>
                                      <a href="/blogspot/end-of-problem-sleuth">THE
                                          END OF PROBLEM SLEUTH.</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              February
                              <span class="post-count" dir="ltr">(4)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/if-you-drew-comic-called-super-frog-at">If
                                          you drew a comic called Super Frog at age 11</a></li>
                                  <li>
                                      <a href="/blogspot/blog-redux-bon-voyage-tim-and-george">BLOG
                                          REDUX: Bon Voyage, Tim and George</a></li>
                                  <li>
                                      <a href="/blogspot/how-do-i-prank-thee-let-me-qwantz-ways">How
                                          do I prank thee? Let me qwantz the ways.</a></li>
                                  <li>
                                      <a href="/blogspot/star-trek-edits">Star
                                          Trek Edits</a></li>
                              </ul>
                          </li>
                      </ul>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              January
                              <span class="post-count" dir="ltr">(1)</span>
                              <ul class="posts">
                                  <li>
                                      <a href="/blogspot/need-for-steed">Need
                                          for the Steed</a></li>
                              </ul>
                          </li>
                      </ul>
                  </li>
              </ul>
              <ul class="hierarchy">
                  <li class="archivedate expanded">
                      2008
                      <span class="post-count" dir="ltr">(2)</span>
                      <ul class="hierarchy">
                          <li class="archivedate expanded">
                              December
                              <span class="post-count" dir="ltr">(2)</span>
                              <ul class="posts">
                                <li><a href="/blogspot/fancy-santas-are-stupid-imposters">Fancy-Santas are Stupid Imposters</a></li>
                                <li><a href="/blogspot/ms-paint-adventures-suggestion-box">The MS Paint Adventures Suggestion Box</a></li>
                              </ul>
                          </li>
                      </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <div class="clear">&nbsp;</div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'

import Resources from '@/resources.js'

// magicaljourney https://wheals.github.io/blogspot/magicaljourney.htm
// offeryoucantrefuse https://wheals.github.io/blogspot/offeryoucantrefuse.htm

export default {
  name: 'blogspot',
  mixins: [ Resources.UrlFilterMixin ],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, NavBanner
  },
  title: () => "Andrew's Blog",
  data: function() {
    return {
      reverse: false
    }
  },
  computed: {
    posts() {
      return this.reverse ? [...this.$archive.social.blogspot].reverse() : this.$archive.social.blogspot
    }
  },
  methods: {
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
  updated() {
    this.filterLinksAndImages(this.$el.querySelector('.main-wrapper'))
    this.filterLinksAndImagesInternetArchive(this.$el.querySelector('.main-wrapper'), '2010')
  },
  mounted(){
    this.jumpToClass(this.routeParams.id)
    this.filterLinksAndImages(this.$el.querySelector('.main-wrapper'))
    this.filterLinksAndImagesInternetArchive(this.$el.querySelector('.main-wrapper'), '2010')
  }
}
</script>

<style scoped lang="scss">
    .navBanner{
      width: 100%;
      margin-bottom: 10px;
    }
    .body {
        background-color: #ccc;
        margin: 0;
        font: x-small Verdana, Sans-serif;
        text-align: center;
        color: #000;
        font-size: small;
        padding-bottom: 5px;
    }

    /* Page Structure
    ----------------------------------------------- */
    .outer-wrapper {
        font: normal normal 100% Verdana, Sans-serif;
        text-align: left;

        box-shadow: 4px 4px #999;
        border: 1px solid #fff;
        background: #fff;

        margin: 10px auto;
        padding: 10px;
        width: 722px;
    }

    .content-wrapper {
        width: 100%;
    }

    .main-wrapper {
        background: #214552 url(assets://archive/social/blogspot/css/corner_main_left.gif) no-repeat right top;
        width: 460px;
        float: left;
        color: #ffffff;
        font-size: 85%;
        word-wrap: break-word; /* fix for long text breaking sidebar float in IE */
        overflow: hidden; /* fix for long non-text content breaking IE sidebar float */
    }

    .main {
        margin: 0;
        padding: 15px 20px;
    }

    .sidebar-wrapper {
        background: #cedfbd url(assets://archive/social/blogspot/css/corner_sidebar_left.gif) no-repeat left top;
        width: 254px;
        float: right;
        padding: 0;
        color: #335566;
        font-size: 83%;
        word-wrap: break-word; /* fix for long text breaking sidebar float in IE */
        overflow: hidden; /* fix for long non-text content breaking IE sidebar float */
    }

    .sidebar {
        margin: 0;
        padding: 2px 20px 10px;
    }

    /* Links
    ----------------------------------------------- */

    a:link {
        color: #66B5FF;
        text-decoration: none;
    }

    a:visited {
        color: #C3D9FF;
        text-decoration: none;
    }

    a:hover {
        color: #C3D9FF;
        text-decoration: underline;
    }

    a img {
        border-width: 0;
    }
    .sidebar a {
        color: #336699;
    }

    .sidebar a:visited {
        color: #333333;
    }

    .sidebar a:hover {
        color: #333333;
    }

    /* Header
    ----------------------------------------------- */
    .header-wrapper {
        background: #fff;
        padding-bottom: 4px;
        min-height: 190px;
    }

    .header .titlewrapper {
        background: #269 url(assets://archive/social/blogspot/css/topleft_left.gif) no-repeat left bottom;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 0;
        padding-left: 160px;
        margin: 0 0 10px 0;
        color: #fff;
        width: auto;
        min-height: 70px;
    }

    .header h1 {
        background: url(assets://archive/social/blogspot/css/bg_header.gif) no-repeat left top;
        margin: 0;
        padding: 70px 0 30px;
        line-height: 97px;
        font: normal bold 275% Helvetica, Arial, Verdana, Sans-serif;
        text-transform: lowercase;
        _height: 0;
    }

    .header h1 a {
        color: #fff;
        text-decoration: none;
    }

    .postpage #header h1 {
        padding-top: 0;
        background-position: 0 -40px;
    }

    .clear {
        clear: both;
    }

    /* Description
    ----------------------------------------------- */
    .header .descriptionwrapper {
        background: #88ddff url(assets://archive/social/blogspot/css/bg_desc_top_left.gif) no-repeat left top;
        margin: 0 0 6px;
        padding: 12px 0 0;
        color: #ffffff;
        font-size: 75%;
        border-bottom: 1px solid #ffffff;
        width: 100%;
    }

    .header .description {
        background: url(assets://archive/social/blogspot/css/bg_desc_bot_left.gif) no-repeat left bottom;
        margin: 0;
        padding: 0 0 12px;
        display: block;
        line-height: 1.6em;
        text-transform: uppercase;
        letter-spacing: .1em;
        min-height: 12px;
        border-bottom: 1px solid #ffffff;
    }

    .header .description span {
        /* To remove the word next to the description, delete the following background property */
        background: url(assets://archive/social/blogspot/css/temp_no.gif) no-repeat left center;
        /* Keep everything below */
        display: block;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 0;
        padding-left: 160px;
        text-transform: uppercase;
        letter-spacing: .1em;
        min-height: 12px;
    }

    .postpage #description em {
        font-size: 1px;
        line-height: 1px;
        color: #ffffff;
        visibility: hidden;
    }

    /* Posts
    ----------------------------------------------- */
    ::v-deep {
    h2.date-header {
        margin: 0 0 .5em;
        line-height: 1.4em;
        font: normal bold 112% Arial, Verdana, Sans-serif;
        text-transform: lowercase;
        color: #446677;
    }

    .post {
        margin: 0 0 2em;
        
        a:link {
            color: #66B5FF;
            text-decoration: none;
        }

        a:visited {
            color: #C3D9FF;
            text-decoration: none;
        }

        a:hover {
            color: #C3D9FF;
            text-decoration: underline;
        }

        a img {
            border-width: 0;
        }
    }

    .post h3 {
        margin: 0 0 .25em;
        line-height: 1.4em;
        font-weight: bold;
        font-size: 150%;
        color: #8cdfff;
    }

    .post h3 a {
        text-decoration: none;
        color: #8cdfff;
    }

    .post h3 a:link {
        color: #8cdfff;
    }

    .post h3 a:hover {
        color: #C3D9FF;
    }

    .post-body {
        margin: 0 0 .75em;
        line-height: 1.6em;
    }

    .post-body blockquote {
        line-height: 1.3em;
    }

    .post-footer {
        color: #8cdfff;
        text-transform: lowercase;
    }

    .post-footer .post-author,
    .post-footer .post-timestamp {
        font-style: normal;
    }

    .post blockquote {
        margin: 1em 20px;
        padding: 5px 0;
        border: 2px solid #356;
        border-width: 2px 0;
    }

    .post blockquote p {
        margin: .5em 0;
    }

    .post img {
        display: block;
        margin: 0px auto 10px;
        border: 5px solid #fff;
        max-width: 410px;
    }
    }

    /* Sidebar
    ----------------------------------------------- */
    .sidebar h2 {
        margin: 1em 0 .25em;
        line-height: 1.4em;
        font: normal bold 125% Helvetica, Arial, Verdana, Sans-serif;
        color: #ffffff;
        text-transform: lowercase;
    }

    .sidebar .widget {
        margin: 0 0 1.5em;
        padding: 0;

        button {
          border-radius: 5px;
          border: none;
          font-size: 16px;
          font-weight: bold;
          width: 100%;
          height: 30px;
          margin: 1em 0 0;
          background-color: #226699;
          transition: background-color 0.15s;
          color: white;

          &:hover {
            background-color: #398cca;
            cursor: pointer;
          }
        }
    }

    .sidebar ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .sidebar li {
        margin: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: .25em;
        padding-left: 20px;
        text-indent: -20px;
        line-height: 1.4em;
    }



</style>

