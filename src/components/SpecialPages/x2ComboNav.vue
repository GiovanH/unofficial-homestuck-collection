<template>
  <nav class="pageNavigation">
    <div class="nextArrow" v-if="nextPages.length > 0">
      <div v-for="(page, index) in nextPages" :key="index">
        <p v-if="('pageId' in page && 'title' in page)">
          &gt; <a v-if="isLeftPage" :href="nextUrl(page)" @click.prevent="resetScroll" class="tiltedArrow" >
            <div class="notTiltedArrowLink">==&gt; </div>
            <div class="tiltedArrowLink">==&gt;</div>
          </a>
          <a v-else :href="nextUrl(page)" class="nextArrowLink" v-text="page.title" />
        </p>
      </div>
    </div>
    <div class="footerNav" >
      <ul class="navOptions">
        <li v-if="pageNumber.p !== '1'">
          <a :href="startOverUrl" class="startOver">Start Over</a>
        </li>
        <li v-if="'previous' in thisPage">
          <a :href="backUrl" :class="{goBack: isLeftPage}">Go Back</a>
        </li>
      </ul>
      <ul class="meta">
        <li v-if="'timestamp' in thisPage && !!getTimestamp()">
          <div class="timestamp" v-html="this.getTimestamp()" />
        </li>
        <li>
          <a class="vizLink" :href="vizLink" v-html="pageIdText" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import PAGENAV from '@/components/Page/PageNav.vue'

export default {
  extends: PAGENAV,
  name: "x2ComboNav",
  computed: {
    isLeftPage(){
      return (parseInt(this.thisPage.pageId) % 2 == 0)
    },
    backUrl() {
      const thisLeftPage = this.isLeftPage ? this.thisPage : this.$archive.mspa.story[this.thisPage.previous]

      const prevRightPage = this.$archive.mspa.story[thisLeftPage.previous]

      return this.$resolvePath(`${this.mspaBase}/${prevRightPage.previous}`)
    }
  },
  methods: {
    resetScroll() {
      let key = this.$localData.tabData.activeTabKey
      document.getElementById(key).scrollTop = 0
      document.getElementById(key).scrollLeft = document.getElementById(key).scrollWidth
    }
  }
}
</script>

<style scoped lang="scss">
  .nextArrow{
    margin: 0 0 30px 0;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: x-large;
    font-weight: normal;
    color: var(--page-nav-divider);

    a {
      color: var(--page-links);
    }
    .tiltedArrow{
      display: inline-block;
      .notTiltedArrowLink {
        display: inline-block;
        text-decoration: underline;
      }
      .tiltedArrowLink {
        display: inline-block;
        text-decoration: underline;
        transform-origin: 0 100%;
        transform: rotate(-30deg);
        z-index: -1;
      }            
    }
  }
  .footerNav{
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    line-height: 10px;
    ul {
      list-style: none;
      font-size: 10px;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      li {
        float: left;
        padding-bottom: 15px;
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
</style>

