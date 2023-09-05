<template>
  <div class="ad">
    <a :href="href" target="_blank">
      <div class="overlay" />
      <MediaEmbed :url="src" width="600" height="74" />
      <div class="projectWonderful" v-html="projectWonderfulText" />
    </a>
  </div>
</template>

<script>
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'ad',
  props: {
    href: {
      type: String,
      default: "/tbiy"
    },
    src: {
      type: String,
      default: "/sweetbroandhellajeff/becomebaby.jpg"
    },
  },
  components: {
    MediaEmbed
  },
  data() {
    return {
      projectWonderfulBid: "$9999999999999"
    }
  },
  computed: {
    projectWonderfulText() {
      return `Ads by Project Wonderful! Your ad here, right now: ${this.projectWonderfulBid}`
    }
  },
}
</script>

<style lang="scss" scoped>
  .ad {
    display: flex;
    flex-direction: column;
    align-items: center;
    a {
      line-height: 0;
      position: relative;
      text-decoration: none !important;

      .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      img {
        // should be 600px x 74px
        display: block;
      }
    }
    .projectWonderful {
      max-width: 600px;

      color: #0000ff;
      background: white;

      font-size: 10px;
      text-align: center;
      text-decoration: none;
      line-height: 1.2;
      font-weight: bold;
      font-family: Tahoma, verdana,arial,helvetica,sans-serif !important; // fight off sbahj corruption
      text-transform: none;
      letter-spacing: normal;
      text-shadow: none;
      white-space: normal;
      word-spacing: normal;
    }
  }
</style>
