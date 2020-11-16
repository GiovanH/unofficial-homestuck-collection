<template>
  <a :href='href'>{{text}}</a>
</template>

<script>

export default {
  name: 'StoryPageLink',
  props: [
    'mspaId'
  ],
  computed: {
    text(){
      return this.$mspaOrVizNumber(this.mspaId)
    },
    href(){
      return `/mspa/${this.mspaId}`
    }
  }
}
</script>