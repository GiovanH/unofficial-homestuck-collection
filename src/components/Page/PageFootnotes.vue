<template>
  <div v-if="myNotes.length">
    <div 
      v-for="(note, index) in myNotes"
      :class="cssClass(note)"
      :key="index">
      <p v-html="note.content"/>
      <span v-if="note.author" class="author" v-text="note.author" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footnotes',
  props: [
    'pageId', 'preface'
  ],
  components: {
  },
  data: function() {
    return {
    }
  },
  computed: {
    isPreface() {
      return this.preface !== undefined
    },
    allNotes(){
      return (this.$archive.footnotes['story'][this.pageId] || [])
    },
    myNotes(){
      return this.isPreface ? this.prefaces : this.footnotes
    },
    footnotes() {
      return this.allNotes.filter(n => !n.preface)
    },
    prefaces() {
      return this.allNotes.filter(n => n.preface)
    }
  },
  methods: {
    cssClass(note){
      if (this.isPreface) {
        return note.class ? 'preface ' + note.class : 'preface'
      } else {
        return note.class ? 'footnote ' + note.class : 'footnote'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .footnote {
    width: calc(100% - 50px);
    border-top: solid 23px var(--page-pageBorder, var(--page-pageFrame));
    padding: 30px 25px;
    p {
      text-align: center;
      margin: 0 auto;
      width: 600px;
      white-space: break-spaces;
    }
  }
  .preface {
    width: calc(100% - 50px);
    margin: 1em auto;

    border-style: dashed;
    border-width: 1px;

    border-color: var(--page-log-border);
    background-color: var(--page-pageFrame);
    color: var(--page-nav-divider);
    p {
      text-align: center;
      margin: 0 auto;
      width: calc(100% - 50px);
      white-space: break-spaces;
    }
  }

  .footnote, .preface {
    .author {
      font-weight: 300;
      font-size: 10px;
      font-family: Verdana, Arial, Helvetica, sans-serif;

      display: flex;
      justify-content: flex-end;

      position: relative;
      top: 12px;
      margin-top: -12px;

      color: var(--page-nav-meta);
    }
  }
</style>
