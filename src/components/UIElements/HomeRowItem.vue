<template>
  <div class="rowItem" v-if="!afterpage || !$pageIsSpoiler(afterpage)">
    <a class="thumbnail" :href="href"><Media :url="thumbsrc"/></a>
    <div class="description">
      <h2><a :href="href">
        <slot name="title"></slot>
      </a></h2>
      <p class="date" v-text="date" />
      <slot></slot>
    </div>
  </div>
  <div class="rowItem" v-else>
    <Media url="/archive/collection/spoiler_small.png"/>
    <div class="description">
      <h2>??????</h2>
      <p class="date" v-text="date" />
      <p>Reach page {{$mspaOrVizNumber(afterpage)}} of Homestuck to unlock!</p>
    </div>
  </div>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'HomeRowItem',
  // functional: true,
  props: [
    'afterpage',
    'href',
    'thumbsrc',
    'date'
  ],
  components: {
    Media
  }
}
</script>

<style scoped lang="scss">

</style>