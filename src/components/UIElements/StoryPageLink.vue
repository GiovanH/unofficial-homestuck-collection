<template>
  <span>
    <span v-if="isSpoiler">{{this.displayNum}}</span>
    <template v-else>
      <span v-if="preText" v-html="preText"></span>
      <a v-if="innerText" :href='href' :title='title'>{{innerText}}</a>
      <span v-if="postText" v-html="postText"></span>
    </template>
  </span>
</template>

<script>

export default {
  name: 'StoryPageLink',
  props: [
    'mspaId',
    'long',
    'titleOnly',
    'credit'
  ],
  computed: {
    page(){return this.$archive.mspa.story[this.mspaId]},
    isLong(){return (this.long !== undefined)},
    isTitleOnly(){return (this.titleOnly !== undefined)},
    isCredit(){return (this.credit !== undefined)},
    isSpoiler(){return this.$pageIsSpoiler(this.mspaId)},
    href(){return `/mspa/${this.mspaId}`},
    displayNum(){return this.$mspaOrVizNumber(this.mspaId)},

    postText(){
      if (this.isCredit && !this.isSpoiler)
        return ` - <b>${this.page.title}</b>`
      return false
    },
    preText(){
      if (this.isCredit)
        return `Page `
      return false
    },
    innerText(){
      const num = this.displayNum
      if (this.isSpoiler)
        return num
      else if (this.isTitleOnly)
        return this.page.title
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
    }
  }
}
</script>
