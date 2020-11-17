<template>
  <span>
    <span v-if="isSpoiler">{{this.displayNum}}</span>
    <template v-else>
      <a v-if="innertext" :href='href' :title='title'>{{innertext}}</a>
      <span v-if="outertext" v-html="outertext"></span>
    </template>
  </span>
</template>

<script>

export default {
  name: 'StoryPageLink',
  props: [
    'mspaId',
    'long',
    'credit'
  ],
  computed: {
    page(){return this.$archive.mspa.story[this.mspaId]},
    isLong(){return (this.long !== undefined)},
    isCredit(){return (this.credit !== undefined)},
    isSpoiler(){return this.$pageIsSpoiler(this.mspaId)},
    href(){return `/mspa/${this.mspaId}`},
    displayNum(){return this.$mspaOrVizNumber(this.mspaId)},

    outertext(){
      if (this.isCredit && !this.isSpoiler)
        return ` - <b>${this.page.title}</b>`
      return false
    },
    innertext(){
      let num = this.displayNum
      if (this.isSpoiler)
        return num
      else if (this.isLong)
        return `${num} - ${this.page.title}`
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