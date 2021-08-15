<template>
  <div class="pageBody">
    <NavBanner />
    <div class="pageFrame">
        <h2 class="pageTitle" v-text="subpath"></h2>
      <div class="pageContent">
        <ol class="directoryListing">
          <li v-if="subpath">
            <a :href="hrefToAscend">..</a>
          </li>
          <li v-for="(item, key, index) in ls" :key="key">
            <a v-text="key" :href="hrefToDir(key)" v-if="item === undefined" />
            <a v-text="key" :href="hrefToFile(key)" v-if="item === true"  />
          </li>
        </ol>
        <!-- <iframe :src="$localhost" >Frame</iframe>
        <input type="button" value="Back" onclick="iframe_name.history.back()">
        <input type="button" value="Forward" onclick="iframe_name.history.forward()"> -->
      </div>
    <PageFooter />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

const { ipcRenderer } = require('electron')
// ipcRenderer.sendSync('file-ls')

export default {
  name: 'fileman',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageFooter
  },
  data: function() {
    return {
    }
  },
  computed: {
    subpath() {
      return this.tab.url.replace(/^\/file\//, '')
    },
    ls() {
      return ipcRenderer.sendSync('file-asset-ls', this.subpath)
    },
    hrefToAscend(){
      return "/file/" + this.subpath.split("/").slice(0, -2).join("/") + "/"
    }
  },
  methods: {
    hrefToDir(key) {
      return this.tab.url + key + "/"
    },
    hrefToFile(key) {
      return "assets://" + this.subpath + key
    }
  },
  updated() {
  },
  mounted() {
  },
  watch: {
    'tab.url'(to, from){
      if (!to.endsWith("/")) {
        this.tab.url += "/"
        return
      }
      if (!/^\/([^/]+\/)*$/i.test(to)) {
        this.tab.url = "/file/"
        return
      }
    }
  }
}
</script>


<style scoped lang="scss">
  ::v-deep a{
    color: var(--page-links);
  }
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      .pageContent{
        background: var(--page-pageContent);
        
        width: 650px;     
        padding: 30px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 12px;

        h2.pageTitle {
          max-width: 590px;
          text-align: center;
          line-height: 1.1;
          font-size: 32px;
          padding: 15px 0;
          margin: 0 auto;
        }
        li {
          // padding: 0 30px;
          list-style: none;

          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 12px;
        }
      }
    }

  }
  

</style>

