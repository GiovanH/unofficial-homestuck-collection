<template>
  <GenericPage>
    <div class="mediaContent">
      <h2 class="pageTitle">That page doesn't exist!</h2>
      <MediaEmbed url="assets://advimgs/jb/mspaintadventure08.gif" />
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/Template/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'Error404',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, GenericPage
  },
  title: () => "Page not found"
}
</script>
