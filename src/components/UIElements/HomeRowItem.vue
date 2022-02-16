<template>
  <div class="rowItem" v-if="!isSpoiler">
    <a class="thumbnail" :href="href"><Media :url="thumbsrc"/></a>
    <div class="description">
      <h2><a :href="href">
        <slot name="title"></slot>
      </a></h2>
      <p class="date" v-text="date_" />
      <slot></slot>
    </div>
  </div>
  <div class="rowItem" v-else>
    <Media url="/archive/collection/spoiler_small.png"/>
    <div class="description">
      <h2>??????</h2>
      <p class="date" v-text="date_" />
      <p v-if="afterpage">Reach page {{$mspaOrVizNumber(afterpage)}} of Homestuck to unlock!</p>
      <p v-else>Keep reading to unlock!</p>
    </div>
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'
const DateTime = require('luxon').DateTime

export default {
  name: 'HomeRowItem',
  // functional: true,
  props: [
    'afterpage',
    'aftertimestamp',
    'href',
    'thumbsrc',
    'date'
  ],
  components: {
    Media
  },
  computed: {
    isSpoiler(){
      if (this.afterpage) {
        return this.$pageIsSpoiler(this.afterpage)
      }
      if (this.aftertimestamp) {
        return this.$timestampIsSpoiler(this.aftertimestamp)
      }
      return false
    },
    date_(){
      if (this.aftertimestamp) 
        return DateTime.fromSeconds(Number(this.aftertimestamp))
            .setZone("America/New_York")
            .toFormat("LLL yyyy")
      return this.date
    }
  }
}
</script>

<style scoped lang="scss">
.rowItem {
  border-top: solid 2px var(--page-pageBorder, var(--page-pageFrame));
  // width: 50%;
  padding: 10px 5px;
  flex: 1 0 400px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  
  .thumbnail {
    img {
      display: block;
      max-width: 65px;
      max-height: 65px;
      object-fit: contain;
    }
    &:after {
      display: none;
    }
  }

  .description {
    padding: 0 10px;
    width: 100%;
    // height: 80px;
    h2 {
      font-size: 18px;
    }
    .date {
      font-family: Verdana, Arial, Helvetica, sans-serif;
      font-size: 10px;
      font-weight: normal;
      color: var(--page-nav-meta);
    }
  }
}
</style>