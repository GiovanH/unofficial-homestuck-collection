<template>
  <div class="banner app" v-if="appHasUpdate && !dismissed">
    <p><a :href="appLatestRelease.html_url">There is a new version of the app available!<br />Click here to see the release notes and update from {{appVersionCurrent}} to {{appLatestReleaseSemver}}</a></p>
    <span class="dismiss" @click="dismissed = true">
      later
    </span>
  </div>
</template>

<script>
const semverGreater = (a, b) => a.localeCompare(b, undefined, { numeric: true }) === 1

export default {
  name: 'updater',
  props: [],
  data: function() {
    return {
      ghOwner: 'bambosh',
      ghRepo: 'unofficial-homestuck-collection',
      ghReleases: undefined,
      dismissed: false
    }
  },
  computed: {
    appVersionCurrent(){
      return this.$data.$appVersion
    },
    appLatestRelease(){
      if (!this.ghReleases) return undefined
      return this.ghReleases[0]
    },
    appLatestReleaseSemver(){
      if (!this.ghReleases) return undefined
      const tag_name = this.appLatestRelease.tag_name
      return tag_name.replace(/^[Vv]/, '')
    },
    appHasUpdate(){
      if (!this.ghReleases) return undefined
      return semverGreater(this.appLatestReleaseSemver, this.appVersionCurrent)
    },
    assetVersionCurrent(){
      return this.$archive.version
      // Note: this is not this.$expectedAssetVersion
    }
  },
  methods: {
    doUpdateCheck(){
      fetch(`https://api.github.com/repos/${this.ghOwner}/${this.ghRepo}/releases`)
        .then(response => response.json())
        .then(data => { this.ghReleases = data })
    }
  },
  watch: {
  },
  mounted(){
    if (this.$localData.settings.allowSysUpdateNotifs)
      this.doUpdateCheck()
  }
}
</script>

<style lang="scss" scoped>
 .banner {
    position: relative;
    // height: 32px;
    // min-height: 32px;
    border: 4px solid yellow;
    padding: 2px;

    background: black;
    color: white;

    text-align: center;
    vertical-align: middle;
    .dismiss {
      position: absolute;
      top: 4px;
      right: 4px;

      color: #696969;
    }
    p {
      font-size: 22px;
    }
    a {
      color: white; 
      text-decoration: none; 
    }
    a, .dismiss {
      &:hover {text-decoration: underline;}
    }
 }
</style>

