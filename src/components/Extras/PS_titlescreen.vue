<template>
  <GenericPage>
    <div class="pageContent">
      <MediaEmbed url="extras/PS_titlescreen/PS_titlescreen.swf"/>
      <FlashCredit pageId="ps_titlescreen"/>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/Template/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import FlashCredit from '@/components/UIElements/FlashCredit.vue'

export default {
  name: 'ps_titlescreen',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, GenericPage, FlashCredit
  },
  title: () => "Problem Sleuth",
  theme: () => 'retro'
}
</script>

<style scoped lang="scss">
  .creditWrapper {
    margin-top: 30px;
  }
</style>
