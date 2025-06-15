<template>
  <GenericPage>
    <div class="mediaContent">
      <h2 class="pageTitle">What are you doing here?</h2>
      <MediaEmbed url="/advimgs/bq/bq008b.gif" />
    </div>
    <div class="textContent">
      <p>You have not read far enough to see this! Come back later.</p>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/Template/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'Spoiler',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, GenericPage
  },
  title: () => "Spoilers!"
}
</script>
