<template>
  <nav class="navBanner" :class="{customNavBanner: useCustomStyles}">
    <div class="navList">
      <ul class="nav1">
        <li><a href="https://www.homestuck.com">{{this.navText[0]}}</a></li>
        <!-- <li><a href="https://www.homestuck.com">{{$localData.settings.newReader.current}} - {{$localData.settings.newReader.limit}}</a></li> -->
      </ul>
      <div class="candyCorn" />
      <ul class="nav2">
        <li><a href="/">{{navText[1]}}</a></li>
        <li><a @click.prevent="toggleJumpBox()">{{navText[2]}}</a></li>
      </ul>
      <div class="candyCorn" />
      <ul class="nav3">
        <li><a href="/map">{{navText[3]}}</a></li>
        <li><a href="/log">{{navText[4]}}</a></li>
        <li><a href="/search">{{navText[5]}}</a></li>
      </ul>
      <div class="candyCorn" />
      <ul class="nav4">
        <li><a @click.prevent="toggleBookmarks()">{{navText[6]}}</a></li>
      </ul>
      <div class="candyCorn" />
      <ul class="nav5">
        <li><a href="/settings">{{navText[7]}}</a></li>
        <li><a href="/credits">{{navText[8]}}</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'navBanner',
  components: {
  },
  props: [
		'useCustomStyles'
	],
  data: function() {
    return {
      defaultText: [
        "HOMESTUCK.COM",
        "HOME",
        "JUMP",
        "MAP",
        "LOG",
        "SEARCH",
        "SAVE/LOAD",
        "SETTINGS",
        "CREDITS"
      ],
      a6a6Text: [
        "WORTHLESS GARBAGE.",
        "STUPID.",
        "WHO CARES?",
        "WOW.",
        "NO.",
        "BORING.",
        "DUMB NOISE.",
        "BULLSHIT.",
        "WHATEVER."
      ]
    }
  },
  computed: {
    navText() {
      return this.$root.theme === 'A6A6' ? this.a6a6Text : this.defaultText
    },
    tabComponent() {
      return this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0]
    }
  },
  methods:{
    toggleBookmarks(){
      this.tabComponent.$refs.bookmarks.toggle()
    },
    toggleJumpBox(){
      this.tabComponent.$refs.jumpbox.toggle()
    }
  },
}
</script>

<style lang="scss" scoped>  

  .customNavBanner {
    background: var(--nav-bg);

    .navList {
      .candyCorn {
        content: var(--nav-candyCornContent);
      }
      ul li:not(:last-child):after {
        color: var(--nav-divider);
      }
    }
    
    .nav1 a{
      color: var(--nav-link, #ffffff);
    }
    .nav2 a{
      color: var(--nav-link, #29ff4a);
    }
    .nav3 a{
      color: var(--nav-link, #39d5f6);
    }
    .nav4 a{
      color: var(--nav-link, #f7f72a);
    }
    .nav5 a{
      color: var(--nav-link, #ffb529);
    }
  }

  a {
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }

  .nav1 a{
    color: #ffffff;
  }
  .nav2 a{
    color: #29ff4a;
  }
  .nav3 a{
    color: #39d5f6;
  }
  .nav4 a{
    color: #f7f72a;
  }
  .nav5 a{
    color: #ffb529;
  }
  nav {
    background: #5a5a5a;
    width: 950px;
    height: 17px;
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;

    .navList {
      display: flex;
      align-items: center;
      justify-content: center;
      .candyCorn {
        margin: 0 9px;
        content: url(css://images/candycorn.gif);
        image-rendering: pixelated;
      }
      ul {
        height: 17px;
        max-height: 17px;
        display: inline-flex;
        align-content: center;

        list-style: none;
        font-size: 10px;
        line-height: 10px;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        li {
          display: inline-flex;
          align-content: center;
          align-items: center;
          justify-content: center;
          &:not(:last-child):after {
            content: " |";
            color: #FFFFFF;
            display: inline-block;
            margin: 0 0.3em
          }
        }
      }

    }
  }
</style>

