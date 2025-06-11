<template>
  <div class="banner app">
    <p><button class="pointer" @click="$root.guestMode = false">Setup</button> or <button class="pointer" @click="dismiss">Show Spoilers</button>?</p>
  </div>
</template>

<script>

export default {
  name: 'guestbanner',
  props: [],
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods: {
    dismiss() {
      this.$localData.root.NEW_READER_CLEAR()
      this.$localData.root.SET_ASSET_DIR('web')
      this.$root.guestMode = false
    }
  },
  watch: {
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
  .pointer {
    cursor: pointer;
  }
  button {
    font-size: 22px;
  }
  .banner {
    position: absolute;
    // width: 480px;
    width: max-content;
    bottom: 20px;
    left: 0;
    right: 16px;
    margin: 0 auto;
    padding: 4px;
    // padding-right: 2em;

    z-index: 5;

    border: 2px solid yellow;
    box-shadow: 0 0 0 4px #ff9000;

    background: black;
    color: white;

    text-align: center;
    vertical-align: middle;

    .dismiss {
      position: absolute;
      cursor: pointer;
      top: 3px;
      right: 8px;
      font-size: 16px;

      // color: #696969;
    }
    p {
      font-size: 22px;
    }
    a {
      color: white; 
      text-decoration: none; 
    }
    a, .dismiss {
      &:hover {text-decoration: underline;}
    }
 }
</style>

