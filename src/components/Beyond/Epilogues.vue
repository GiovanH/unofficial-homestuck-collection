<template>
  <div class="pageBody epilogue">
    <NavBanner />
    <div class="pageFrame" :class="{fakechat}" v-html="epiloguesPage" />
    <!-- <label><input type="checkbox" v-model="fakechat">fakechat</label> -->
    <PageFooter />
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

const Resources = require('@/resources.js')

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export default {
  name: 'epilogues',
  components: { NavBanner, PageFooter },
  mixins: [Resources.UrlFilterMixin],
  data: function() {
    return {
      fakechat: false,
      filter_content_warnings: true,
      cw_super_serious: [
        "Rape", "Non-Con", "Dubious Consent",
        "Chronic Illness",
        "Graphic Depictions of Violence", "Major Character Death", "Suicide",
        "Child Abuse", "Sexual Abuse", "Domestic Abuse",
        "Age Difference", "Pedophilia",
        "White Supremacy", "Prison Camps", "Genocide",
        "Transphobia", "Misgendering",
        "Mind Control", "Mind Break",
        "Bad Ending"
      ],
      cws: [
        "Unhealthy Relationships", "Sexual Harassment",
        "Breastfeeding", "Breastmilk", "Milking",
        "Misogyny", "Sexism", "Toxic Masculinity",
        "Alternate Universe", "Canon Compliant", "Canon Divergent",
        "Redemption",
        "World War", "Political Intrigue",
        "Rough Sex", "Light BDSM", "Black Romance",
        "Child Neglect",  "Daddy Issues", "Bad Parenting",
        "Addiction", "Alcohol Use", "Drug Use",
        "Death", "Murder",
        "Incestuous Undertones",
        "Polyamory", "Cuckolding", "Infidelity",
        "Gender Transition", "Nonbinary Character(s)", "Identity Questioning",
        "Detransitioning",
        "Mental Illness", "Depression", "Existential Crisis",
        "Speciesism", "Xenophobia",
        "Pregnancy", "Babies",
        "Bimboification", "Slut Shaming",
        "Gore", "Blood", "Body Horror",
        "Fascism", "Political Rebellion", "Assassination",
        "Furry",  "Anthropomorphic Characters",
        "Alien Biology", "Ovipositioning",
        "Capitalism", "Propaganda",  "Super PACs",
        "Revolutionary Rhetoric",  "Self-Sacrifice",
        "Friends to Lovers",
        "Power Imbalances", "Manipulation",
        "Abuse",
        "Diapers",
        "Possession",
        "Starvation",
        "Interspecies Relationships", "Xenophilia",
        "Vore",
        "Vomit",
        "Drugging",
        "Cannibalism",
        "Pica"
      ],
      cw_additional: [
        "The Economy", "Robots", "Meta", "Fridging", "Honk", "Marriage", "Feet", "Clown Dynamics",
        "Children", "Funerals", "Religion", "Eating", "Food", "Aliens",
        "Theft", "Trickster Mode", "Reality Television", "Gerrymandering", "Rapping", "Guns",
        "Eggs", "Kidnapping", "Faygo", "Poisoning", "Teenagers", "Ghosts",
        "Early 20th Century Dance Movements", "Clown"
      ]
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
      return `${capitalize(ctx.routeParams.volume)} | ${ctx.routeParams.page}`
    return 'Epilogues'
  },
  methods: {
    keyNavEvent(dir) {
      const el_prev = this.$el.querySelector(".o_game-nav-item a:not([id])")
      const el_next = this.$el.querySelector(".o_story-nav a")
      if (dir == 'left' && el_prev != undefined) el_prev.click()

      else if (dir == 'right' && el_next != undefined) el_next.click()
    },
    generateContentWarnings(label, cws) {
      return `<div class="g-6 g-3--md type-bs pos-r clearfix mar-b-md--md ao3-label">${label}</div>
        <div class="g-6 g-9--md g-omega--md type-bs pos-r clearfix mar-b-md mar-l-md mar-l-0--md ao3-field">
        ${cws.join(', ')}
        </div>`
    },
    filterPageHtml(html) {
      // Replace paraphernalia with link to liveweb page
      const ext_link = `<div class="pad-r-lg--md mar-b-md type-hs-small type-hs-bottom--md type-center type-left--md"><ul class="o_game-nav"><li class="o_game-nav-item"><a href="https://www.homestuck.com${this.tab.url}">${this.tab.url}</a></li></ul></div>`
      html = html.replace(
        '<a class="nav-btn nav-btn--center type-hs-small mar-b-md" data-gamenav-open="" href="javascript:void(0)" style="text-decoration:none; text-transform: none; font-size:14px; line-height:14px;"><span>Options</span> <i class="icon-menu" style="margin:0;"></i></a>',
        ext_link)

      if (this.filter_content_warnings && /^\/epilogues\/?$/.exec(this.tab.url)) {
        // Index page
        const content_warnings =
          this.generateContentWarnings("Content Warning:", [...this.cw_super_serious.map(s => `<b>${s}</b>`), ...this.cws]) +
            this.generateContentWarnings("Additional Tags:", this.cw_additional)

        html = html.replace(/<div class="[^"]+?">Content Warning:<\/div>.+?Clown<\/div>/gs, content_warnings)
      }
      return html
    }
  },
  computed: {
    epiloguesPage() {
      if (this.$archive.extras.epilogues != undefined) {
        const html = this.$archive.extras.epilogues[this.routeParams.volume || 'prologue'][this.routeParams.page || '0']
        return this.filterPageHtml(html)
      } else {
        return "NotImplemented"
      }
    }
  },
  updated() {
    this.filterLinksAndImages(this.$el)
  }
}
</script>

<style lang="scss" scoped>

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
    color: var(--font-default);

    width: 950px;
    padding-top: 7px;
    padding-bottom: 23px;
    margin: 0 auto;
    position: relative; // Allow things to align to the page

  }
  //Small screen check
  @media (max-width: 950px) {
    &{
      overflow-x: hidden;
      height: max-content;
      .navBanner {
        max-width: 100%;
      }
      .pageFrame {
        max-width: 100%;
      }
      ::v-deep div.footer {
        max-width: 100%;
      }
    }
  }
}

.mspa.epilogue ::v-deep {
  .bg-white { background-color: #FFFFFF; }
}

.epilogue .fakechat ::v-deep .chat {
  background: var(--page-log-bg);
  border: 1px dashed var(--page-log-border);
  padding: 1.5em;
  margin: 1em 0 !important;
}

.epilogue ::v-deep {
  // Epilogues uses "rows"
  .row {
  }
}

.epilogue ::v-deep {
  .pageFrame a[href] {
    color: var(--page-links);
  }
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
      font-family: EB-garamond, serif;
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

  font-family: EB-garamond, serif;
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
      font-family: EB-garamond, serif;
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
    justify-content: space-between;
  }
  .flex-justify-center {
    justify-content: center;
  }

  // .type-hs-opener-rg {
  //     font-size: 65px;
  // }

  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
}

</style>
