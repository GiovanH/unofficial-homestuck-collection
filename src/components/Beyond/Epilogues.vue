<template>
  <div class="pageBody epilogue">
    <NavBanner />
    <div class="pageFrame" v-html="epiloguesPage" />
    <PageFooter />
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default {
  name: 'epilogues',
  components: { NavBanner, PageFooter },
  data: function() {
    return {
    }
  },
  props: [
    'tab', 'routeParams'
  ],
  theme: function(ctx) {
    return 'default'
  },
  title: function(ctx) {
    if (ctx.routeParams.volume && ctx.routeParams.page)
      return `${capitalize(ctx.routeParams.volume)} ${ctx.routeParams.page}`
    return 'Epilogues'
  },
  methods: {
    keyNavEvent(dir) {
      const el_prev = this.$el.querySelector(".o_game-nav-item a:not([id])")
      const el_next = this.$el.querySelector(".o_story-nav a")
      if (dir == 'left' && el_prev != undefined) el_prev.click()

      else if (dir == 'right' && el_next != undefined) el_next.click()
    },
  },
  computed: {
    epiloguesPage() {
      if (this.$archive != undefined) {
        return this.$archive.epilogues[this.routeParams.volume || 'prologue'][this.routeParams.page || '0']
      } else {
        return "NotImplemented"
      }
    }
  }
}
</script>

<style lang="scss" scoped>

@font-face {
  font-family: 'Homestuck-Regular';
  src: url(assets://archive/epilogues/resources/Homestuck-Regular.woff2);
  font-weight: normal;
  font-style: normal
}

@font-face {
font-family:"adobe-garamond-pro";
src:url("https://use.typekit.net/af/af619f/00000000000000003b9b00c5/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),url("https://use.typekit.net/af/af619f/00000000000000003b9b00c5/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),url("https://use.typekit.net/af/af619f/00000000000000003b9b00c5/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
font-display:auto;font-style:normal;font-weight:700;font-stretch:normal;
}

@font-face {
font-family:"adobe-garamond-pro";
src:url("https://use.typekit.net/af/6c275f/00000000000000003b9b00c6/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3") format("woff2"),url("https://use.typekit.net/af/6c275f/00000000000000003b9b00c6/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3") format("woff"),url("https://use.typekit.net/af/6c275f/00000000000000003b9b00c6/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3") format("opentype");
font-display:auto;font-style:italic;font-weight:700;font-stretch:normal;
}

@font-face {
font-family:"adobe-garamond-pro";
src:url("https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3") format("woff2"),url("https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3") format("woff"),url("https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3") format("opentype");
font-display:auto;font-style:italic;font-weight:400;font-stretch:normal;
}

@font-face {
font-family:"adobe-garamond-pro";
src:url("https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
font-display:auto;font-style:normal;font-weight:400;font-stretch:normal;
}

.pageBody {
  color: var(--font-default);
  background: var(--page-pageBody);

  margin: 0;
  padding: 0;
  display: flex;
  flex: 1 0 auto;
  flex-flow: column;
  align-items: center;

  > img { align-self: center; }

  .pageFrame {
    background: var(--page-pageFrame);

    width: 950px;
    padding-top: 7px;
    padding-bottom: 23px;
    margin: 0 auto;
    position: relative; // Allow things to align to the page

  }
}

.epilogue ::v-deep {
  // Epilogues uses "rows"
  .row {
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
    background: var(--page-pageContent);
  }
  // Headers, openers
  h1, h2, h3, h4 {
    &.type-hsep-header {
      font-family: 'Homestuck-Regular', monospace;
      font-weight: normal;
    }
    &.type-ao3-hsep-header {
      font-family: adobe-garamond-pro, serif;
      font-weight: bold;
    }
  }

  .hsep_bullet {
      position: relative;
      top: 10px;
      left: -6px;
      margin-right: 3px;
      vertical-align: text-bottom
  }
  span.opener {
      float: left;
      font-family: 'Homestuck-Regular', monospace;
      line-height: 0.825;
  }

  .o_story-nav {
    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;
  }

  .o_story-page-footer {
    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: bold;
  }

  .o_game-nav { list-style-type: none; }
  .o_game-nav li { float: left; }
  .o_game-nav li:not(:last-child):after {
    content: " |";
    display: inline-block;
    margin: 0 0.3em;
  }

  #story_footer_container > a { display: none; }
  .pad-x-lg--md {
    padding-right: 30px;
    padding-left: 30px;
  }

  // Body text

  font-family: adobe-garamond-pro, serif;
  font-weight: normal;

  div.o_epilogue p {
    text-indent: 25px;
    &.no-indent { text-indent: 0px; }
    &.Command {
      text-indent: 0px;
      margin: 15px 0px 15px 25px;
      font-family: Verdana, sans-serif;
    }
  }
  div.chat {
    margin: 15px 0px 15px 25px;
    font-family: "courier-std", courier, monospace;
    // background: var(--page-log-bg);
    & p {
      text-indent: 0px;
    font-weight: bold;
    }
  }

  .aranea { color: #005682 }
  .aradia { color: #a10000 }
  .caliborn { color: #2ed73a }
  .calliope { color: #a1a3a6 }

  .calliope-dead { color: #ff0000 }
  .calliope-dead-story {
      font-family: adobe-garamond-pro, serif;
      font-weight: normal;
      color: #000000
  }

  .dave { color: #e00707 }
  .davepetasprite { color: #416600 }
  .davepetasprite-dialogue { color: #f2a400 }
  .dirk { color: #f2a400 }
  .eridan { color: #7e0048 }
  .feferi { color: #77003c }
  .gamzee { color: #2b0057 }
  .harry { color: #0671cd }
  .jade { color: #4ac925 }
  .jade-brainwashed { color: #000000 }
  .jake { color: #1f9400 }
  .jane { color: #0097d7 }
  .john { color: #0715cd }
  .kanaya { color: #008141 }
  .karkat { color: #7c7e81 }
  .obama { color: #000000 }
  .rose { color: #b536da }
  .roxy { color: #ff6ff2 }
  .sollux { color: #a1a100 }
  .swifer { color: #008141 }
  .tavros { color: #a15000 }
  .tavros-kid { color: #2b0057 }
  .terezi { color: #008282 }
  .vriska { color: #005682 }

  // AO3
  .ao3-header {
      position: relative;
      height: 30px;
      background: #900 url("assets://archive/beyond/ao3_redtile.png");
      padding: 0 0;
      width: 100%;
      box-shadow: inset 0 -6px 10px rgba(0,0,0,0.35),1px 1px 3px -1px rgba(0,0,0,0.25),inset 0 -1px 0 rgba(0,0,0,0.85)
  }
  .ao3-wrapper { box-shadow: 1px 1px 5px #aaa }

  .ao3-label {
      font-family: Verdana, sans-serif;
      font-weight: bold
  }

  .ao3-field {
      font-family: Verdana, sans-serif;
      font-weight: normal
  }

  // "I'm afraid of CSS" brainrot bullshit

  .pad-x-0 { padding-right: 0px; padding-left: 0px; }

  .brdr-undrln-black { border-bottom: 2px solid #000000; }
  .disp-ib { display: inline-block; }

  .g-3--md,
  .ao3-wrapper .g-3--md { float: left; margin-right: 2%; width: 130px; }
  .g-6 { float: left; margin-right: 4%; width: 100%; }
  .g-6--md { float: left; margin-right: 2%; width: 44%; }
  .g-6--md:last-child { margin-right: 0; }
  .g-9--md { float: left; margin-right: 2%; width: 415px; }
  .g-12--md { float: left; margin-right: 2%; width: 100%; }
  .g-omega { margin-right: 0; }
  .g-omega--md { margin-right: 0; }

  .line-caption { line-height: 1.35; }
  .line-tight { line-height: 1.15; }

  .mar-b-md { margin-bottom: 15px; }
  .mar-b-md--md { margin-bottom: 15px; }
  .mar-l-md { margin-left: 15px; }
  .mar-l-0--md { margin-left: 0px; }
  .mar-t-lg { margin-top: 30px; }
  .mar-t-md { margin-top: 15px; }
  .mar-t-md--md { margin-top: 15px; }
  .mar-x-auto { margin-left: auto; margin-right: auto; }
  .mar-x-md--md { margin-right: 15px; margin-left: 15px; }
  .mar-y-md--md { margin-top: 15px; margin-bottom: 15px; }

  .pad-b-lg { padding-bottom: 30px; }
  .pad-l-lg--md { padding-left: 30px; }
  .pad-l-md { padding-left: 15px; }
  .pad-l-md--md { padding-left: 15px; }
  .pad-r-lg--md { padding-right: 30px; }
  .pad-t-0 { padding-top: 0px; }
  .pad-t-lg { padding-top: 30px; }
  .pad-t-md { padding-top: 15px; }
  .pad-x-0--md { padding-right: 0px; padding-left: 0px; }
  .pad-x-lg--md { padding-left: 30px; padding-right: 30px; }
  .pad-y-md { padding-top: 15px; padding-bottom: 15px; }

  .type-bs { font-size: 12px; }
  .type-center { text-align: center; }
  .type-hs-copy { font-size: 24px; }
  .type-hs-opener-sm--md { font-size: 51px; }
  .type-hs-small { font-size: 14px; }
  .type-hs-small--md { font-size: 14px; }
  .type-left { text-align: left; }
  .type-left--md { text-align: left; }
  .type-lg { font-size: 39px; }
  .type-right { text-align: right; }
  .type-sm--md { font-size: 16px; }
  .type-xl { font-size: 56px; }

  .type-hs-bottom--md { font-size: 10px; }

  .weight-bold { font-weight: 700; }

  .flex-wrap { flex-wrap: wrap; }
  .flex { display: flex; }
  .flex-justify {
    -webkit-box-pack: justify;
    -moz-box-pack: justify;
    box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-box-pack: justify;
    -moz-box-pack: justify;
    box-pack: justify;
    -webkit-justify-content: space-between;
    -moz-justify-content: space-between;
    -ms-justify-content: space-between;
    -o-justify-content: space-between;
    justify-content: space-between;
    -ms-flex-pack: justify;
  }

  // .type-hs-opener-rg {
  //     font-size: 65px;
  // }

  .bg-white { background-color: #FFFFFF; }

  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }



}
</style>