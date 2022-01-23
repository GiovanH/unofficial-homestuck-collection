<template>
  <div class="spoilerbox" :class="{logHidden: (logHidden && !alwaysOpen)}">
    <button v-if="!alwaysOpen" class="logButton" @click="loggle">
      {{ logButtonText }}
    </button>
    <div class="logContent">
      <slot></slot>
    </div>
  </div>
</template>

<!-- Note that this is a generic spoiler, and *not* the element used by PageText -->
<script>
export default {
  name: 'SpoilerBox',
  props: [
    'kind', // Thing to 'show' or 'hide', i.e. 'Spoiler'
    'start-open', // Start open, but include a button to close/toggle.
    'always-open' // Do not include a button at all, only the frame.
  ],
  components: {
  },
  data: function() {
    return {
      logHidden: true
    }
  },
  mounted(){
    if (this.startOpen) {
      this.logHidden = false
    }
  },
  methods: {
    loggle() {
      this.logHidden = !this.logHidden
    }
  },
  computed: {
    logButtonText(){
      const action = this.logHidden ? "Show" : "Hide"
      if (this.kind)
        return `${action} ${this.kind}`
      else if (this.kind == "")
        return action
      else
        return `${action} Spoiler`
    }
  }
}
</script>

<style scoped lang="scss">
  .spoilerbox {
    margin: 1em;
    border: 1px dashed var(--page-log-border);
    background: var(--page-log-bg);
    padding: 1px;
    align-self: center;
    
    &.highContrast {
      background: #ffffff;
    }
    button {
      // text-transform: capitalize;
      min-width: 60px;
      margin: auto;
      display: block;
    }
    
    .logContent{
      color: var(--font-log);
      padding: 1em;
      padding-bottom: 2em;
      text-align: left;
    }

    &.logHidden {
        .logContent {
            display: none; 
        }
    }
  }
</style>

