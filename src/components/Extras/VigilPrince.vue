<template>
  <div class="pageBody">
    <NavBanner />
    <div class="vigilPrince">
      <MediaEmbed url="scraps2/vigilprince.gif"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'vigilprince',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed
  },
  title: () => "The Vigil Prince",
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  },
  updated() {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.pageBody {
  background: black;

  .navBanner {
    margin: 0 auto;
    background: black;
  }

  .vigilPrince {
    border: solid 1px #cccccc;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 7px;
    width: 310px;
    height: 294px;
    display: block;
    margin: 100px auto 0;
  }
}

</style>

