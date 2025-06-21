<template>
  <div class="metadata">
    <div :title="$getChapter(thisPage.pageId)">
      <p v-text="`${thisPage.storyId}/${thisPage.pageId}`"/>
      <p v-if="vizLink" v-html="vizLink"/>
    </div>
    <time v-if="datetime"
      :datetime="datetime.toFormat('yyyy-MM-dd ttt')"
      :data-timestamp="thisPage.timestamp">
      <span v-text="datetime.toFormat('LLL dd yyyy')"/>
      <span v-text="datetime.toFormat('t ZZZZ')"/>
    </time>
  </div>
</template>

<script>
export default {
  name: 'Metadata',
  props: [
    'thisPage'
  ],
  components: {
  },
  data: function() {
    return {
      DateTime: require('luxon').DateTime
    }
  },
  computed: {
    datetime() {
      if (!this.thisPage.timestamp) {
        return undefined
      } else {
        try {
          return this.DateTime.fromSeconds(Number(this.thisPage.timestamp)).setZone("America/New_York")
        } catch {
          return NaN
        }
      }
    },
    vizLink() {
      const viz = this.$mspaToViz(this.thisPage.pageId)
      if (viz) return `${viz.s}/&ZeroWidthSpace;${viz.p}`
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.pageBody {
  .metadata {
    position: absolute;
    left: 7px;
    font-size: 117%;
    max-width: 135px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    border-top-color: white;
    border-left-color: white;
  }
  // WIP: Nudge box out of supercartridge panels
  // &.supercartridge .metadata {
  //   left: calc(-135px - 7px);
  // }
}
.x2 .pageBody.two .metadata { 
  left: 630px; width: 135px; 
}

.pageBody .metadata { 
  color: black; 
  text-align: center; 
  font-weight: normal; 
  text-shadow: 1px 1px white; 
}
.pageBody .metadata span, 
.pageBody .metadata p { 
  display: block; margin: 0.5em 0.35em; 
}

@media (max-width: 950px) {
  .metadata {
    display: none
  }
}

</style>
