<!-- In the pyloader, parse CSS files and grab their linked resources too -->

<template>
  <Error404 v-if="!page" />
  <div v-else class="pageBody" role="styleWrap"
    :class="[cssClass]" >
    <component :is="'style'" v-if="story.y" v-html="storyCss"></component>
    <div :class="[`p${pageNum}`].concat(pageRangeClasses)">
      <body>
        <div id="main">
          <NavBanner useCustomStyles="false" />
          <div id="container">
            <div id="slide" ref="slide">
              <div id="command" v-html="page.c"></div>
              <div id="content">
                <BBCode :code="page.b" />
              </div>
              <div class="hidden">
                <!-- Preload images -->
                <BBCode v-for="n in page.n.filter(n => story.p[n])" :key="n" :code="story.p[n].b" />
              </div>
              <div id="foot">
                <div id="links">
                  <div v-for="n in page.n.filter(n => story.p[n])" :key="n">
                    <a :href="`/mspfa/${storyId}/${n}`">
                      <span v-html="getPageCommand(n)" />
                    </a>
                  </div>
                </div>
                <br><br>
                <span id="prevlinks">
                  <span class="footlinks">
                    <a id="startover" :href="`/mspfa/${storyId}/1`">Start Over</a>
                    <span v-if="pageNum - 1" > | <a id="goback"
                     :href="`/mspfa/${storyId}/${pageNum - 1}`"
                     >Go Back</a> </span>
                   </span>
                   <br />
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 </span>
                  <div class="footerNav" >
                    <ul class="meta">
                      <li v-if="page.d">
                        <div class="timestamp" :data-timestamp="page.d" v-text="formatTimestamp(page.d)" />
                      </li>
                      <li>
                        <a :href="`https://mspfa.com/?s=${story.i}&p=${pageNum}`" v-text="`&p=${pageNum}`"></a>
                      </li>
                    </ul>
                  </div>
                 <br>
               </div>
             </div>
             <div id="info">
              <span id="infobox">
                <div class="spoiler" :class="pageNum == 1 ? 'open' : 'closed'">
                  <div style="text-align: center;">
                    <input type="button" :value="(pageNum == 1 ? 'Hide' : 'Show') +  ' Adventure Info'" data-open="Show Adventure Info" data-close="Hide Adventure Info">
                  </div>
                  <div>
                    <table><tbody>
                      <tr>
                        <td style="width: 158px;">
                          <img id="storyicon" height="150" width="150" :src="story.o" style="margin-right: 6px;">
                        </td>
                        <td style="max-width: 413px; width: 413px;">
                          <span class="major" style="font-size: 20px;" v-text="story.n" /> 
                          <br>
                          <span v-text="['Inactive', 'Ongoing', 'Complete'][story.h-1] || 'Useless'" /> 
                          <img src="assets://archive/beyond/mspfa_pages.png" class="smol"><span v-text="story.p.length" />
                          <br>Author: <a v-text="story.a" />
                          <br>Mirrored by: 
                          <span v-for="u, i in story.editors">
                            <a :href="`https://mspfa.com/user/?u=${u.i}`" v-text="u.n" />
                            <template v-if="i+1 < story.editors.length">, </template>
                          </span>
                          <br>
                          <span v-if="story.t" v-text="'Tags: ' + story.t.join(', ')" /> 
                        </td>
                        <td id="latestpages" rowspan="2" style="max-width: 253px; width: 253px; font-size: 10px; font-weight: bold;">
                          <span>
                            <div class="spoiler closed">
                              <div style="text-align: center;">
                                <input type="button" value="Show Latest Pages" data-open="Show Latest Pages" data-close="Hide Latest Pages">
                              </div>
                              <div>Latest Pages:
                                <template v-for="page in story.p.slice(-30).reverse()">
                                  <br>
                                  <span :data-timestamp="page.d">{{formatTimestamp(page.d)}} - 
                                    <a :href="`/mspfa/${storyId}/${page.i}`" v-text="page.c || 'Next.'" />
                                  </span>
                                </template>
                              </div>
                            </div>
                          </span>
                          <br><br>
                          <div style="text-align: center;">
                            <a :href="`/mspfa/${storyId}/log`" style="font-size: 14px;">VIEW ALL PAGES
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" >
                          <BBCode :code="story.r" />
                        </td>
                      </tr>
                    </tbody></table>
                  </div>
                </div>
              </span>
            </div>
            <footer>
              <div class="umcontainer">
                <div class="mspfalogo"></div>
                <!-- <iframe class="um" src="/um/bottom.njs" if1225q65=""></iframe> -->
                <Ad v-if="show_ad" />
              </div>
              <div id="details" style="padding-top: 6px;">
                <!-- © MS Paint Fan Adventures 2010-2023
                <span class="vbar">|</span>
                <a href="/privacy/">Privacy Policy</a>
                <span class="vbar">|</span>
                <a href="/terms/">Terms of Service</a>
                <span class="vbar"><a href="https://www.youtube.com/watch?v=PjxV0jMpS34" style="text-decoration: none;">|</a></span> -->
              </div>
            </footer>
          </div>
        </div>
      </body>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import BBCode from '@/components/CustomContent/bbcode.vue'
import Error404 from '@/components/SystemPages/Error404.vue'
import Ad from '@/components/UIElements/Ad.vue'

const sass = require('sass');

// TODO: Compute "Major"

export default {
  name: 'MSPFAPage',
  props: [
    'storyId', 'pageNum'
  ],
  components: {
    NavBanner, BBCode, Error404, Ad
  },
  data: function() {
    return {
      DateTime: require('luxon').DateTime,
      time_zone: "America/New_York",
      show_ad: true,
    }
  },
  computed: {
    // storyId(){
    //   return this.routeParams.story
    // },
    cssClass(){
      return this.storyId.replace(/ /g, '_').replace(/^(\d)/, (match, num) => `css${num}`)
    },
    story(){
      return this.$archive.mspfa[this.storyId]
    },
    // pageNum(){
    //   return Number(this.routeParams.p)
    // },
    page(){
      return this.story.p[this.pageNum - 1]
    },
    storyCss(){
      try {
       return sass.renderSync({
          data: `div.${this.cssClass}[role="styleWrap"] {\n${this.story.y}\n}\n`,
          sourceComments: true
        }).css.toString()
      } catch (e) {
        try {
         const rendered = sass.renderSync({
            data: `div.${this.cssClass}[role="styleWrap"] {\n${this.story.y}\n}\n}\n`,
            sourceComments: true
          }).css.toString()
         this.$logger.warn("Had to inject closing css bracket", e)
         return rendered
        } catch (e2) {
          this.$logger.error(`Couldn't render css for adventure '${this.storyId}'`, e)
          return null
        }
      }
    },
    pageRanges(){
      // see mspaf.js `registerPageRanges`
      // yields an object that looks like
      // {"p188-198":[188,198]}

      var findPageRanges = /\.p(\d+-(?:\d+)?)/g
      var pageRanges = {}
      var pageRangeMatch
      // eslint-disable-next-line no-cond-assign
      while (pageRangeMatch = findPageRanges.exec(this.story.y)) {
        if (!pageRanges["p" + pageRangeMatch[1]]) {
          var pageRange = pageRangeMatch[1].split("-")
          pageRange[0] = parseInt(pageRange[0])
          pageRange[1] = parseInt(pageRange[1]) || this.page.length
          pageRanges["p" + pageRangeMatch[1]] = pageRange
        }
      }
      return pageRanges
    },
    pageRangeClasses(){
      // see mspaf.js `for(var i in pageRanges)`
      let classes = []
      for (var i in this.pageRanges) {
        if (this.pageNum >= this.pageRanges[i][0] && this.pageNum <= this.pageRanges[i][1]) {
          classes.push(i)
        }
      }
      return classes
    }
  },
  updated() {
    this.bindButtons()
    this.bindMajor()
  },  
  mounted() {
    this.bindButtons()
    this.bindMajor()
  },  
  methods: {
    formatTimestamp(t){
      return this.DateTime.fromMillis(Number(t)).setZone(this.time_zone).toFormat("MM/dd/yy")
    },
    keyNavEvent(dir) {
      const frame = this.$parent.$parent
      const next = this.page.n[0]
      if (dir == 'left' && (this.pageNum - 1) &&  frame.$el.scrollLeft == 0) 
        this.$pushURL(`/mspfa/${this.storyId}/${this.pageNum - 1}`)
      else if (dir == 'right' && next && frame.$el.scrollLeft + frame.$el.clientWidth == frame.$el.scrollWidth)
        this.$pushURL(`/mspfa/${this.storyId}/${next}`)
    },
    getPageCommand(n, default_="Next."){
      try {
        return this.story.p[n - 1].c || default_
      } catch {
        return default_
      }
    },
    bindMajor(){
      if (!this.$refs['slide']) {
        this.$logger.warn("slide ref not set!", this.$refs)
        return
      }
      var pad = getComputedStyle(this.$refs['slide'])
      if (pad) {
          pad = parseFloat(pad.paddingLeft) + parseFloat(pad.paddingRight)
      } else {
          pad = 50
      }
      var loadImg = () => {
          if (this.$refs['slide'] && (this.offsetWidth + pad < this.$refs['slide'].offsetWidth)) {
              this.classList.remove("major")
          }
      }
      var imgs = this.$el.querySelectorAll("img, video, iframe, canvas, object")
      for (var i = 0; i < imgs.length; i++) {
          imgs[i].classList.add("major")
          imgs[i].addEventListener("load", loadImg)
          imgs[i].addEventListener("error", loadImg)
      }
    },
    bindButtons(){
      this.$nextTick(() => {
        if (!this.$el.querySelectorAll) {
          this.$logger.warn("Don't have element?")
          return
        }

        this.$el.querySelectorAll(".spoiler input[type=button]:not([bound])").forEach(sin => {
          sin.addEventListener("click", this.toggleSpoiler)
          sin.setAttribute('bound', true)
        })
      })
    },
    toggleSpoiler: function(event) {
      const el = event.currentTarget
      const parent_div = el.parentNode.parentNode
      if (parent_div.classList.contains("closed")) {
        el.value = el.getAttribute("data-close")
        parent_div.classList.remove("closed")
        parent_div.classList.add("open")
      } else if (parent_div.classList.contains("open")) {
        el.value = el.getAttribute("data-open")
        parent_div.classList.remove("open")
        parent_div.classList.add("closed")
      }
    }    
  }
}
</script>

<style scoped lang="scss">

// Hacks start here
#prevlinks {
  display: inline-block;
  margin-bottom: 15px;
}
.footerNav{
  overflow: hidden;
  // display: flex;
  display: inline-block;
  float: right;
  justify-content: space-between;
  line-height: 10px;
  padding-top: 8px;
  ul {
    list-style: none;
    font-size: 10px;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    li {
      float: left;
      // padding-bottom: 15px;
      * {display: inline-block;}
      &:not(:last-child):after {
        content: "|";
        margin: 0 0.3em
      }
    }
  }
  .navOptions {
    color: var(--page-nav-divider);

    a {
      color: var(--page-links);
    }
  }
  .meta {
    font-weight: 300;
    color: var(--page-nav-meta);
    a {
      color: var(--page-nav-meta);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
}

nav.navBanner::v-deep{
  width: calc(100% - 10px);
  margin: 0 5px;
}

// Hacks end here

div[role="styleWrap"]::v-deep {
  body {
    font-family: "courier", "monospace";
    font-size: 12px;
    overflow-y: auto;
    // background-color: var(--page-pageBody);
    color: var(--font-default);
    min-height: 100vh;
  }

  #main {
    width: 950px;
    // width: 950px;
    margin: 0 auto;
    // padding: 0 5px 5px 5px;
    // padding: 0;
    background-color: var(--page-pageFrame);
  }

  iframe {
    border: none;
  }

  .umcontainer {
    height: 102px;
  }

  .um {
    float: right;
    width: 728px;
    height: 100%;
  }

  #um3container {
    position: fixed;
    width: 160px;
    height: 612px;
    opacity: 0.5;
    transform: translateX(980px);
    transition: opacity 0.08s ease-out;

    &:hover {
      opacity: 1;
    }
  }

  #um3 {
    width: inherit;
    height: inherit;
  }

  #um4container {
    padding-top: 8px;
  }

  #um4 {
    width: 650px;
    height: 402px;
  }

  table, #dialog {
    word-break: break-word;
    word-wrap: break-word;
  }

  table.container {
    border-collapse: collapse;
    margin: 0 -5px;
    text-align: center;
    width: 950px;
    border: 5px solid var(--page-pageBorder);
    background-color: var(--page-pageContent);

    > tbody > tr {
      height: 0;

      > {
        td, th {
          padding: 4px;
          vertical-align: top;
          height: 0;
          border: 5px solid var(--page-pageBorder);
        }
      }
    }

    &.alt {
      width: 870px;
      margin: 0 35px;
      font-size: 16px;

      > tbody > tr > td {
        border-width: 20px;
      }

      a[href] {
        font-weight: bold;
        text-decoration: none;
        color: #5caedf;
      }
    }
  }

  #dialog a[href], .username, .usertag {
    font-weight: bold;
    text-decoration: none;
    color: #5caedf;
  }

  table.container {
    &.alt2 {
      width: 834px;
      margin: 18px 53px;
      font-size: 16px;

      > tbody > tr > {
        td {
          border-width: 2px;
        }

        th {
          border-width: 2px;
          font-weight: bold;
        }

        td {
          padding: 10px;
        }
      }

      img {
        max-width: 100%;
      }
    }

    &.alt3 table {
      text-align: left;
      width: 90%;
      margin: 0 auto;

      > tbody > tr > td {
        padding: 10px;
      }
    }
  }

  .major {
    &:not(h1, h2, h3, h4, h5, h6) {
      font-size: 16px;
    }

    font-weight: bold;
    font-family: "Press Start 2P";
    color: #aaaaaa;
    text-shadow: 0 2px #777777;
  }

  tr {
    &.unlit {
      opacity: 0.5;
    }

    &.lit .major {
      color: #00d747;
      text-shadow: 0 2px #009500;
    }
  }

  h1.major, h2.major, h3.major, h4.major, h5.major, h6.major {
    margin: 8px 0;
    color: #cccccc;
    text-shadow: 0 2px #888888;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h1.major.alt, h2.major.alt, h3.major.alt, h4.major.alt, h5.major.alt, h6.major.alt {
    letter-spacing: 10px;
  }

  .major.alt {
    color: #cdcdcd;
    text-shadow: 0 2px #a1a1a1;
  }

  a.major {
    text-decoration: none;

    &[href] {
      color: #5caedf;
      text-shadow: 0 2px #2a6b7d;
    }

    &.alt[href] {
      color: #8297f8 !important;
    }
  }

  button {
    line-height: 1.5;
    padding: 8px 12px;
    outline: none;
    border-width: 2px;
    border-style: solid;
    border-radius: 0;
    border-color: #dddddd #898989 #898989 #dddddd;
    background-color: #eeeeee;
  }

  input.major {
    &[type="button"], &[type="submit"], &[type="reset"] {
      padding: 8px 12px;
      outline: none;
      border-width: 2px;
      border-style: solid;
      border-radius: 0;
      border-color: #dddddd #898989 #898989 #dddddd;
      background-color: #eeeeee;
    }
  }

  button:focus {
    outline: 1px solid #a5a5ff;
  }

  input.major {
    &[type="button"]:focus, &[type="submit"]:focus, &[type="reset"]:focus {
      outline: 1px solid #a5a5ff;
    }
  }

  button:enabled:active {
    border-color: #898989 #dddddd #dddddd #898989;
  }

  input.major {
    &[type="button"]:enabled:active, &[type="submit"]:enabled:active, &[type="reset"]:enabled:active {
      border-color: #898989 #dddddd #dddddd #898989;
    }
  }

  button {
    background-color: #eeeeee;
  }

  .story {
    display: inline-block;
    float: left;
    width: 170px;
    margin: 4.2px;
    padding: 4px;

    &:link, &:active, &:visited {
      text-decoration: none;
      color: inherit;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.0625);
    }
  }

  .spoiler {
    border: 1px dashed gray;
    padding: 1px;

    > div:last-child {
      margin: 12px 5%;
      padding: 3px;
      text-align: left;
    }

    &.closed > div:last-child {
      display: none;
    }
  }

  #container {
    font-weight: bold;
    font-size: 14px;
  }

  #slide {
    display: table;
    width: 600px;
    max-width: 950px;
    margin: 7px auto 23px auto;
    padding: 0 25px;
    word-wrap: break-word;
    word-break: break-word;
    background-color: var(--page-pageContent);
  }

  #command {
    text-align: center;
    font-size: xx-large;
    padding: 14px 0;
  }

  #content{
    text-align: center;
    margin-bottom: 14px;

    > span > br:first-child {
      display: none;
    }

    img {
      max-width: 950px;
      // TODO: Set major elements
      margin: 0 -25px;

      &.major {
        margin: 0 -25px;
      }
    }

    video.major, iframe.major, canvas.major, object.major, ruffle-object.major,
    video, iframe, canvas, object {
      margin: 0 -25px;
    }
  }

  #slide .spoiler img, #commentbox > .spoiler .spoiler img {
    max-width: 100%;
  }

  #foot, #latestpages {
    font-family: "Verdana", "Arial", "Helvetica", "sans-serif";
  }

  #links {
    margin-top: 31px;
    font-weight: normal;
    font-size: x-large;

    > div::before {
      content: "> ";
    }
  }

  .footlinks {
    font-size: 10px;
    font-weight: normal;

    a {
      font-weight: bold;
    }
  }

  #info {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: normal;
    text-align: center;

    > span > .spoiler {
      border: none;
    }
  }

  #latestpages > span > .spoiler {
    border: none;
  }

  #info > span > .spoiler {
    &.open {
      background-color: var(--page-log-bg);
    }

    > div:first-child > input {
      font-size: 10px;
      padding: 0;
    }
  }

  #latestpages > span > .spoiler > div:first-child > input {
    font-size: 10px;
    padding: 0;
  }

  #info > span > .spoiler > div:last-child > table > tbody > tr > td {
    vertical-align: top;
  }

  #infobox > .spoiler > div:last-child > table {
    width: 100%;
  }

  #latestpages > span > .spoiler > div:last-child {
    margin: 12px 0 0 0;
    padding: 0;
  }

  // .timestamp {
  //   font-size: 12px;
  //   color: #8c8c8c;
  // }

  .page {
    font-size: 12px;
    color: #666666;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  .mspfalogo {
    width: 208px;
    height: 102px;
    float: left;
    background-repeat: no-repeat;
    background-position: center;
    border-right: 4px solid #b8b8b8;
    background-color: #eeeeee;
  }
  footer .mspfalogo {
    background-image: url(https://mspfa.com/images/VorkedLarfleeze.gif);
  }
}
</style>
