<template>
  <div class="banner app" v-if="appHasUpdate && !dismissed">
    <p><a :href="appLatestRelease.html_url">Version {{appLatestReleaseSemver}} is now available!<br />Click here to check it out.</a></p>
    <span class="dismiss" @click="dismissed = true">
      ✕
    </span>
  </div>
</template>

<script>
const semverGreater = (a, b) => a.localeCompare(b, undefined, { numeric: true }) === 1

const tagToSemver = (tag_name) => tag_name.replace(/^[Vv]/, '').replace(/-\w*$/, '')

export default {
  name: 'updater',
  props: [],
  data: function() {
    return {
      ghOwner: 'bambosh',
      ghRepo: 'unofficial-homestuck-collection',
      ghReleasesRaw: undefined,
      dismissed: false
    }
  },
  computed: {
    ghReleases(){
      // Visible gh releases.
      // Excludes prereleases unless app is in dev mode.
      if (!this.ghReleasesRaw) return undefined

      let releases = this.ghReleasesRaw
      if (!this.$localData.settings.devMode) 
        releases = releases.filter(r => !r.prerelease)

      return releases
    },
    appVersionCurrent(){
      return this.$data.$appVersion
    },
    appLatestRelease(){
      if (!this.ghReleases) return undefined
      return this.ghReleases[0]
    },
    appLatestReleaseSemver(){
      if (!this.ghReleases) return undefined
      return tagToSemver(this.appLatestRelease.tag_name)
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
        .then(data => { this.ghReleasesRaw = data })
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
    position: absolute;
    width: 480px;
    bottom: 20px;
    left: 0;
    right: 16px;
    margin: 0 auto;
    padding: 4px;

    border: 2px solid yellow;
    box-shadow: 0 0 0 4px #ff9000;

    background: black;
    color: white;

    text-align: center;
    vertical-align: middle;

    .dismiss {
      position: absolute;
      cursor: pointer;
      top: 3px;
      right: 8px;
      font-size: 16px;

      // color: #696969;
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

