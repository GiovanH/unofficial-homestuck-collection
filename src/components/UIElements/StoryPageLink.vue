<template>
  <a :href='href' :title='title'>{{text}}</a>
</template>

<script>

export default {
  name: 'StoryPageLink',
  props: [
    'mspaId',
    'long'
  ],
  computed: {
    page(){return this.$archive.mspa.story[this.mspaId]},
    isLong(){return (this.long !== undefined)},
    isSpoiler(){return this.$pageIsSpoiler(this.mspaId)},
    href(){return `/mspa/${this.mspaId}`},

    text(){
      let num = this.$mspaOrVizNumber(this.mspaId)
      if (this.isSpoiler)
        return num
      else if (this.isLong)
        return `${num}: ${this.page.title}`
      else
        return num
    },
    title(){
      if (this.isSpoiler)
        return "???????????"
      else
        return this.page.title
    },
  }
}
</script>