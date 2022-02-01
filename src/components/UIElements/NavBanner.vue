<template>
  <nav class="navBanner" :class="{customNavBanner: useCustomStyles, pixelated: $localData.settings.pixelScaling}">
    <div class="navList">
      <template v-for="(group, gi) in urls">
        <ul :class="'nav' + (gi+1)" :key="'nav' + (gi+1)">
          <li v-for="href in group">
            <a v-if="href == 'toggleJumpBox'" @click.prevent="toggleJumpBox()">{{getLabel(href)}}</a>
            <a v-else-if="href == 'toggleBookmarks'" @click.prevent="toggleBookmarks()">{{getLabel(href)}}</a>
            <a v-else :href="href">{{getLabel(href)}}</a>
          </li>
        </ul>
        <div v-if="gi + 1 < urls.length" class="candyCorn" />
      </template>
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
      // MS PAINT ADVENTURES
      // ARCHIVE | NEW READER?
      // MAP | LOG | SEARCH
      // SHOP | MUSIC
      // FORUMS | SECRETS | CREDITS
      urls: [
        [
          "/"
        ],
        [
          "/news",
          "/help"
        ],
        [
          "/map",
          "/log",
          "/search"
        ],
        [
          "/music"
        ],
        [
          "/evenmore",
          "/settings",
          "/credits"
        ]
      ],
      labels: {
        // list<theme => list<href => label>>
        // default theme in settings is the empty string
        mspa: {
          // "https://www.homestuck.com": "HOMESTUCK.COM",
          "/": "MS PAINT ADVENTURES",

          // "toggleJumpBox": "JUMP",
          "/news": "NEWS",
          "/help": "HELP",

          "/map": "MAP",
          "/log": "LOG",
          "/search": "SEARCH",

          "/music": "MUSIC",
          // "toggleBookmarks": "SAVE/LOAD",

          "/evenmore": "MORE",
          "/settings": "SETTINGS",
          "/credits": "CREDITS"
        },
        A6A6: {
          "/": "WORTHLESS GARBAGE.",

          "/help": "STUPID.",
          "toggleJumpBox": "WHO CARES?",

          "/map": "WOW.",
          "/log": "NO.",
          "/search": "BORING.",

          "/news": "BULLSHIT.",
          "/music": "DUMB NOISE.",
          "toggleBookmarks": "TRASH.",
          
          "/evenmore": "SHIT.",
          "/credits": "MORONS.",
          "/settings": "WHATEVER."
        }
      }
    }
  },
  methods: {
    toggleBookmarks(){
      this.tabComponent.$refs.bookmarks.toggle()
    },
    toggleJumpBox(){
      this.$root.$children[0].openJumpbox()
    },
    getLabel(href){
      // Tries to get a themed label, otherwise just prints the URL
      return this.labelDict[href] || href
    }
  },
  computed: {
    tabComponent() {
      return this.$root.$children[0].$refs[this.$localData.tabData.activeTabKey][0]
    },
    labelDict() {
      return this.labels[this.$root.tabTheme] || this.labels['mspa']
    }
  }
}
</script>

<style lang="scss" scoped>
  .pixelated .candyCorn {
    image-rendering: pixelated;
  }

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
        content: url(assets://images/candycorn.gif);
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

