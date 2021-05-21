<template>
  <div class="blog">
    <div class="outer-wrapper">
      
      <NavBanner />

      <div class="header-outer-wrapper">
        <div class="header-inner">
          <h1 class="title">the blog of dave strider</h1>
        </div>
      </div>

      <div class="main-wrapper">
        <div class="main section">
          <div class="blog-posts">
            <div v-for="post in posts" v-html="post.html" :class="['date-outer', post.id]" :key="post.id"/>
          </div>
        </div>
      </div>

      <div class="sidebar-wrapper">
        <div class="sidebar section">

          <div class="widget LinkList">
            <h2>comics</h2>
            <div class="widget-content">
              <ul>
                <li><a href="/sbahj">sweet bro and hella jeff</a></li>
                <li><a href="/">ms paint adventures</a></li>
              </ul>
            </div>
          </div>

          <div class="widget BlogArchive">
            <button @click="reversePosts()">Reverse post order</button>
            <h2>Blog Archive</h2>
            <div class="widget-content">
              <div class="ArchiveList">
                <div class="BlogArchive1_ArchiveList">
                  <ul class="hierarchy">
                    <li class="archivedate expanded">
                      <span class="toggle">▼&nbsp;</span>
                      <span class="post-count-link">2010</span>
                      <span class="post-count" dir="ltr"> (9)</span>
                      <ul class="hierarchy">
                        <li class="archivedate expanded">
                          <span class="toggle" >▼&nbsp;</span>
                          <span class="post-count-link">March</span>
                          <span class="post-count" dir="ltr"> (1)</span>
                          <ul class="posts">
                            <li>
                              <a class="anchor" href="/dstrider/nancho2">2</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul class="hierarchy">
                        <li class="archivedate expanded">
                          <span class="toggle">▼&nbsp;</span>
                          <span class="post-count-link">February</span>
                          <span class="post-count" dir="ltr"> (5)</span>
                          <ul class="posts">
                            <li><a class="anchor" href="/dstrider/seaworld2">this is why you dont go to sea world</a></li>
                            <li><a class="anchor" href="/dstrider/nancho">this is a 10 part series</a></li>
                            <li><a class="anchor" href="/dstrider/danecook">dane cook is ugly</a></li>
                            <li><a class="anchor" href="/dstrider/tony2">more ton'</a></li>
                            <li><a class="anchor" href="/dstrider/candy">some candy company ripped me off</a></li>
                          </ul>
                        </li>
                      </ul>
                      <ul class="hierarchy">
                        <li class="archivedate expanded">
                          <span class="toggle">▼&nbsp;</span>
                          <span class="post-count-link">January</span>
                          <span class="post-count" dir="ltr"> (3)</span>
                          <ul class="posts">
                            <li><a class="anchor" href="/dstrider/togyhawg">review of tony hawk</a></li>
                            <li><a class="anchor" href="/dstrider/seaworld">why would anyone go to sea world</a></li>
                            <li><a class="anchor" href="/dstrider/bruce">i watched bruce almighty recently</a></li>
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

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import NavBanner from '@/components/UIElements/NavBanner.vue'

import Resources from '@/resources.js'

export default {
  name: 'dstrider',
  mixins: [ Resources.UrlFilterMixin ],
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed,
    NavBanner
  },
  data: function() {
    return {
      reverse: false
    }
  },
  computed: {
    posts() {
      return this.reverse ? [...this.$archive.social.dstrider].reverse() : this.$archive.social.dstrider
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
  updated() {
    this.filterLinksAndImages(this.$el.querySelector('.main-wrapper'))
  },
  mounted(){
    this.jumpToClass(this.routeParams.id)
    this.filterLinksAndImages(this.$el.querySelector('.main-wrapper'))
  }
}
</script>

<style scoped lang="scss">
.navBanner {
  width: 100%;
  background: #000000;
  margin-top: -10px;
  margin-bottom: 10px;
}

.blog {
  background:#000000;
  margin:0;
  color:#cccccc;
  font: x-small "Trebuchet MS", Trebuchet, Verdana, Sans-serif;
  font-size: small;
  text-align: center;
}
.anchor, a {
  cursor: pointer;
  color:#ff0000;
  text-decoration:none;
  &:hover {
    color:#cccccc;
    text-decoration:underline;
  }
  img {
    border-width:0;
  }
}

/* Header
-----------------------------------------------
*/
.header-outer-wrapper {
  width:660px;
  margin:0 auto 10px;
  border:1px solid #ff0000;

  .header-inner {
    background-position: center;
    margin-left: auto;
    margin-right: auto;
    margin: 5px;
    border: 1px solid #ff0000;
    text-align: center;
    color:#ff0000;
    padding-bottom: 15px;

    h1 {
      margin:5px 5px 0;
      padding:15px 20px .25em;
      line-height:1.2em;
      text-transform: uppercase;
      letter-spacing:.2em;
      font: normal bold 200% 'Trebuchet MS',Trebuchet,Verdana,Sans-serif;
    }
  }
}
/* Outer-Wrapper
----------------------------------------------- */
.outer-wrapper {
  width: 660px;
  margin:0 auto;
  padding:10px;
  text-align:left;
  font: normal normal 100% 'Trebuchet MS',Trebuchet,Verdana,Sans-serif;
}
.main-wrapper {
  width: 410px;
  float: left;
  word-wrap: break-word; /* fix for long text breaking sidebar float in IE */
  overflow: hidden;     /* fix for long non-text content breaking IE sidebar float */
}
.sidebar-wrapper {
  width: 220px;
  float: right;
  word-wrap: break-word; /* fix for long text breaking sidebar float in IE */
  overflow: hidden;     /* fix for long non-text content breaking IE sidebar float */
}
::v-deep{
/* Headings
----------------------------------------------- */
h2 {
  margin:1.5em 0 .75em;
  font:normal bold 78% 'Trebuchet MS',Trebuchet,Arial,Verdana,Sans-serif;
  line-height: 1.4em;
  text-transform:uppercase;
  letter-spacing:.2em;
  color:#777777;
}
/* Posts
-----------------------------------------------
*/
h2.date-header {
margin:1.5em 0 .5em;
}
.post {
margin:.5em 0 1.5em;
border-bottom:1px dotted #ff0000;
padding-bottom:1.5em;
.anchor, a {
  cursor: pointer;
  color:#ff0000;
  text-decoration:none;
  &:hover {
    color:#cccccc;
    text-decoration:underline;
  }
  img {
    border-width:0;
  }
}
}
.post h3 {
margin:.25em 0 0;
padding:0 0 4px;
font-size:140%;
font-weight:normal;
line-height:1.4em;
color:#cccccc;
}
.post h3 a, .post h3 a:visited, .post h3 strong {
display:block;
text-decoration:none;
color:#cccccc;
font-weight:bold;
}
.post h3 strong, .post h3 a:hover {
color:#cccccc;
}
.post-body {
margin:0 0 .75em;
line-height:1.6em;
}
.post-body blockquote {
line-height:1.3em;
}
.post-footer {
margin: .75em 0;
color:#777777;
text-transform:uppercase;
letter-spacing:.1em;
font: normal normal 78% 'Trebuchet MS', Trebuchet, Arial, Verdana, Sans-serif;
line-height: 1.4em;
}
.comment-link {
margin-left:.6em;
}
.post img, .post a img, table.tr-caption-container {
padding:4px;
border:1px solid #ff0000;
}
.tr-caption-container img {
border: none;
padding: 0;
}
.post blockquote {
margin:1em 20px;
}
.post blockquote p {
margin:.75em 0;
}
}
/* Sidebar Content
----------------------------------------------- */
.sidebar {
  color: #999999;
  line-height: 1.5em;
  ul {
    list-style:none;
    margin:0 0 0;
    padding:0 0 0;
  }
  li {
    margin:0;
    padding-top:0;
    padding-right:0;
    padding-bottom:.25em;
    padding-left:15px;
    text-indent:-15px;
    line-height:1.5em;
  }
  & .widget {
    border-bottom:1px dotted #ff0000;
    margin:0 0 1.5em;
    padding:0 0 1.5em;
    
    button {
          font-weight: bold;
          color: #ff0000;
          font-size: 16px;
          background-color: #000;
          border: 1px solid #ff0000;
          width: 100%;
          height: 30px;
          transition: all 0.15s;

          &:hover {
            color: #cccccc;
            border-color: #cccccc;
            cursor: pointer;
          }
        }
  }
}

</style>

