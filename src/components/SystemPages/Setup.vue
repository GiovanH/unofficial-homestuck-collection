<template>
<div class="setup">
  <div class="header">
    <TitleBar :style="{display: $isWebApp ? 'none' : 'inherit'}"/>
  </div>
  <div class="tabFrame">
    <div class="pageBody">

      <div class="card" v-if="isNewUser">
        <SetupWizard />
      </div>

      <div class="card" v-else-if="hasLoadFailed">
        <h2>Loading has failed.</h2>
        <SetupErrorRecovery />
      </div>

      <div v-else-if="isLoading || loadingTooLongTimeout">
        <SetupComponentLoader />
        <div class="card" v-if="loadingTooLongTimeout">
          <div class="cardContent">
            <p>Loading is taking longer than normal. If you think it's stuck, you can try to recover.</p>
            <SetupErrorRecovery />
          </div>
        </div>
      </div>

      <div v-else>
        <SetupComponentLoader />
        <div class="card" v-if="loadingTooLongTimeout">
          <div class="cardContent">
            <h2>Strange situation</h2>
            <pre v-text="{hasLoadFailed, isLoading, isNewUser, loadingTooLongTimeout, loadstate: $root.loadState}" />
          </div>
          <SetupErrorRecovery />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import TitleBar from '@/components/AppMenu/TitleBar.vue'
import SetupErrorRecovery from '@/components/SystemPages/SetupErrorRecovery.vue'
import SetupComponentLoader from '@/components/SystemPages/SetupComponentLoader.vue'
import SetupWizard from '@/components/SystemPages/SetupWizard.vue'


export default {
  name: 'setup',
  components: {
    TitleBar,  SetupErrorRecovery, SetupComponentLoader, SetupWizard
  },
  data: function() {
    return {
      debounce: undefined,
      copiedPath: undefined,
      newReaderToggle: true,
      loadingTooLongTimeout: false
    }
  },
  computed: {
    hasLoadFailed() {
      return (this.$root.loadError || this.$root.loadState == "ERROR")
    },
    isLoading() {
      // If not in a finished load state, it's still loading
      return (this.$root.loadState != "ERROR") && (this.$root.loadState != "DONE")
    },
    isNewUser() {
      // If setup is being shown, but guest mode is true, it's just loading
      if (this.$root.guestMode) return false

      return !this.$localData.assetDir
    }
  },
  mounted() {
    this.$watch('$root.loadStage', stage => {
      if (this.debounce) {
        clearTimeout(this.debounce)
      }
      if (stage != "DONE") {
        this.loadingTooLongTimeout = false
        this.debounce = setTimeout(function() {
          this.$logger.error("Timed out")
          this.loadingTooLongTimeout = true
        }.bind(this), 15000)
      }
    })
  },
  methods: {
  },
  watch: {
  },
  destroyed() {
    if (this.debounce) {
      clearTimeout(this.debounce)
    }
  }
}
</script>

<style lang="scss">
.setup {
  display: flex;
  flex-flow: column;
  height: 100%;

  .header {
    display: grid;
    background: var(--header-bg);
    border-bottom: solid 1px #a0a0a0;
  }
  .tabFrame {
    overflow: hidden;
    height: 100%;
    .pageBody {
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-weight: initial;
      font-size: 16px;
      margin: 0;
      padding: 0;
      display: flex;
      flex-flow: column;
      flex: 1 0 auto;
      align-items: center;
      overflow: auto;
      height: 100%;

      background: url(../../assets/homebg_right.png) repeat-y,
        url(../../assets/homebg_left.png) repeat-y;
      background-position: left top, right top;
      background-color: #35bfff;
      background-attachment: fixed;
    }
  }
  div.scrollbox {
    background: #fff;
    box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
    display: block;
    margin: 0;
    padding: 12px 8px;
    overflow-y: scroll;
  }
  .center {
    text-align: center;
  }

    .letsroll {
      font-size: 200% !important;
      padding: 0.2em;
      margin: 1rem;
    }

    h1, h2 {
      text-align: center;
    }
    > div {
      text-align: justify;

      .tiny {
        font-size: 11px;
      }
      .hint {
        display: block;
        font-size: 13px;
        color: #888888;
      }
      .error, .hint.error {
        color: crimson !important;
        font-weight: bold;
      }
    }
    hr {
      border-top: 3px solid #c6c6c6;
    }
    ol { 
      margin-left: 1.5em;
    }
    button {
      font-size: 110%;
    }
    input {
      &[type="text"] {
        border: 1px solid #777;
        min-width: 35px;
        border-radius: 2px;
        padding: 2px 3px;

        &.invalid:not(:disabled) {
          background: pink;
          border-color: rgb(187, 0, 37);
          box-shadow: 0 0 3px 1px red;
        }
      }
    }
  .card {
    @media (max-width: 650px) {
      width: 100%;
    }
    position: relative;
    margin: auto;
    padding: 25px 25px;
    border: solid 5px #c6c6c6;
    box-sizing: border-box;
    width: 950px;
    max-width: 100vw;
    background: #eeeeee;

    flex: 0 1 auto;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    align-content: center;

    .logo {
      max-width: 100%;
      padding-bottom: 25px;
      pointer-events: none;
    }
    .cardContent {
      width: 100%;
      padding-bottom: 25px;
    }
  }
}


</style>
