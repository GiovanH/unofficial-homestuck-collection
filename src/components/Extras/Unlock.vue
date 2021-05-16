<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <MediaEmbed url="images/v2_biglogo.gif" class="logo"/>
          <h1>UNLOCKABLE CONTENT</h1>
          <MediaEmbed url="images/unlock_gamecode.gif" />
          <div class="unlocklist text">
            <p>CONGRATULATIONS!!!<br><br>You have entered a valid GAME CODE and unlocked some exciting <strong>FAN-REQUESTED GAME COMMANDS!</strong> These were drawn and posted for fans who made <strong>DONATIONS!</strong></p>
            <br />

            <ol>
              <li v-for="page in filteredCommands" :key="page.url">
                <a :href="page.url">{{page.command}}</a>
              </li>
              <li v-if="keepReading">Keep reading to unlock more extras!</li>
            </ol>
          </div>
          <MediaEmbed url="images/unlock_codemachine.gif" />
          <div class="text">
            <p> The CODE MACHINE awaits additional GAME CODES to unlock more mysterious secrets! </p>
          </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

export default {
  name: 'unlock',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
  data: function() {
    return {
      // TODO: Import from archive
      // * designates approximated timestamps
      fan_commands: [
        {url: "/unlock/ps000001", unlock_timestamp: 12269664*100, command: "FAD+ZAD+AD: Throw down your hats in disgust."},
        {url: "/unlock/ps000002", unlock_timestamp: 1226966400, command: "PI: Fall in a shockingly inappropriate manner."},
        {url: "/unlock/ps000003", unlock_timestamp: 1226966400, command: "PI: Fall in a badass noir-antihero manner."},
        {url: "/unlock/ps000004", unlock_timestamp: 12279168*100, command: "PS: GAMBIT SCHEMA -&gt; CANDY CORN TIGER WITH A :3 FACE!"},
        {url: "/unlock/ps000005", unlock_timestamp: 12279168*100, command: "MK: Strike villainous pose with surly thugs."},
        {url: "/unlock/ps000006", unlock_timestamp: 1227916800, command: "PI: Invite your unexpected guests in for a rousing game of DUNGEONS AND DRAGONS."},
        {url: "/unlock/ps000007", unlock_timestamp: 12283488*100, command: "PI: Ogle Amanda disconcertingly."},
        {url: "/unlock/ps000008", unlock_timestamp: 12283488*100, command: "PS: Ride Death's Scythe like a mechanical bull whilst Death plays a stirring rendition of 'Devil Went Down To Georgia' on his fiddle."},
        {url: "/unlock/ps000009", unlock_timestamp: 1228348800, command: "FAD: GAMBIT SCHEMA -&gt; HOT TAMALE CHUPACABRA! "},
        {url: "/unlock/ps000010", unlock_timestamp: 1228348800, command: "FPI: Teleport to the theater with future copy of Die Hard for FAD and MK to chill out and \"See the Movie!\"."},
        {url: "/unlock/ps000011", unlock_timestamp: 12290400*100, command: "FPI - Turn the BROTHEL into a LOVELY CASINO before you go."},
        {url: "/unlock/ps000012", unlock_timestamp: 1229040000, command: "GPI: Fondly regard donation."},
        {url: "/unlock/ps000013", unlock_timestamp: 1229212800, command: "PS: Summon (and incidentally hire) the Midnight Crew to show this rag-a-muffin piker who really holds the cards."},
        {url: "/unlock/ps000014", unlock_timestamp: 1229385600, command: "MC: Insulted, violently join the battle working for DMK instead."},
        {url: "/unlock/ps000015", unlock_timestamp: 1229558400, command: "MC &amp; SMK: Wage merciless, donation-funded warfare against the protagonists in a non-canonical but nonetheless grand plotline."},
        {url: "/unlock/ps000016", unlock_timestamp: 1229558400, command: "Sunglass-Free Stiller Bust: Emerge from the tear in space-time, floating slowly and eerily towards the viewer."},
        {url: "/unlock/ps000017", unlock_timestamp: 1229731200, command: "PS + AD + PI + ZAD + FAD + 4 adventurers + HD + NB + candymecha + GPI + PPI + FPI VERSUS MK + LoathsomeBeast + MM + DMK + MonsterPI + Fluthulu + SurlyThugs + FrighteningBeast + MortholDryax + BowenStilsonDogg: FACE OFF!"},
        {url: "/unlock/ps000018", unlock_timestamp: 1229904000, command: "MC: Allow LABORER WASPS to collect SHADOW NECTAR from protagonists. Then, HIVE RAGTIME: FILL'EM WITH MIDNIGHT."},
        {url: "/unlock/ps000019", unlock_timestamp: 1230076800, command: "Everyone: Pause for a 12 month calendar photoshoot cause SHIT JUST GOT UNNERVINGLY REAL. "},
        {url: "/unlock/ps000020", unlock_timestamp: 1230336000, command: "Strike back at the midnight crew using awesome dice based technology."},
        {url: "/unlock/ps000021", unlock_timestamp: 1230595200, command: "Begin Dating-Sim minigame. "},
        {url: "/unlock/ps000022", unlock_timestamp: 1231113600, command: "MC: SHADOW COMB RAVE -&gt; MIDNIGHT GOSPEL ACT  "},
        {url: "/unlock/ps000023", unlock_timestamp: 1232323200, command: "Crank PROBABILITY THEORY WASP PROFESSOR's Meddling Level up from Medium to High."},
        {url: "/unlock/ps000024", unlock_timestamp: 1232496000, command: "Death: Accidentally tear a plot hole in your TOME OF WAYFARING SOULS."},
        {url: "/unlock/ps000025", unlock_timestamp: 1232668800, command: "PS: Combat Operandi: Summon WARHAMMER OF ZILLYHOO!"},
        {url: "/unlock/ps000026", unlock_timestamp: 12337056*100, command: "Play a(n) (a)rousing game of Hunk Rump: The Gathering."},
        {url: "/unlock/ps000027", unlock_timestamp: 12337056*100, command: "HONEYBEE PROFESSOR: put an end to PROBABILITY THEORY WASP PROFESSOR's troublesome meddling once and for all."},
        {url: "/unlock/ps000028", unlock_timestamp: 1233705600, command: "MIDNIGHT CREW: Continue your battle, oblivious to the various odd changes that resulted from Professor Wasp's meddling through time. "},
        {url: "/unlock/ps000029", unlock_timestamp: 1234137600, command: "MC: Attempt to put an end to Probability Theory Wasp's meddling with superior shadow-based magic. "},
        {url: "/unlock/ps000030", unlock_timestamp: 1234310400, command: "Show MAP of all locations seen by the player so far. "},
        {url: "/unlock/ps000031", unlock_timestamp: 1238630400, command: "PI: Summon squad of zombie astronauts to assist! "},
        {url: "/unlock/ps000032", unlock_timestamp: 1238630400, command: "PS: Pose with a little white cat because SHIT JUST GOT CUTE."},
        {url: "/unlock/ps000033", unlock_timestamp: 1238630400, command: "Candy Mecha Pilot PI: Become PRESIDENT, use Candy Mecha to SAVE AMERICA."},
        {url: "/unlock/ps000034", unlock_timestamp: 1238630400, command: "Wink suggestively at PLAYER whilst starting small MOUSTACHE FIRE."},
        {url: "/unlock/ps000035", unlock_timestamp: 1238630400, command: "PS: Summon MICROWAVE TENTACLE MONSTER. LVL 150 CODDLETECH: SLIPPERY SLAPPING SUCKER STEMS"},
        {url: "/unlock/ps000036", unlock_timestamp: 1239494400, command: "FMB: Fondly regard Sarah"},
        {url: "/unlock/ps000037", unlock_timestamp: 1244332800, command: "Death: Using your TOME OF WAYFARING SOULS, gather the former skeletal remains of PS, PI, and AD, as well as ZAD. Shit just got so real that you form a BAND and go on TOUR, performing 'THRILLER' and other undead related MUSICAL NUMBERS."},
        {url: "/unlock/ps000038", unlock_timestamp: 1272499200, command: "Dapper Swain: Ride mechanical bull like a real bull."},
        {url: "/unlock/ps000039", command: "Cooper: 'Borrow' Dave's sweet gear and go batshit crazy on some mice and other woodland creatures, while uttering witty one liners.", unlock_page: '003655'},
        {url: "/unlock/ps000040", command: "Richard: Challenge Tavros to wheelchair jousting match.", unlock_page: '003930'}
      ]
    }
  },
  computed: {
    filteredCommands(){
      return this.fan_commands.filter(page => {
        if (page.unlock_page && this.$pageIsSpoiler(page.unlock_page)) return false
        if (page.unlock_timestamp && this.$timestampIsSpoiler(page.unlock_timestamp)) return false
        return true
      })
    },
    keepReading(){
      return !(this.fan_commands == this.filteredCommands)
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      justify-content: center;
      .pageContent {
        background: var(--page-pageContent);
        
        padding-bottom: 25px;
        max-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          padding-bottom: 10px;
          background-color: #EEEEEE;
        }
        h1 {
          font-size: 32px;
        }
        .text {
          width: 600px;
          background-color: white;
          font-family: Verdana, Arial, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: normal;
          padding-bottom: 10px;
          text-align: center;

          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
        }

        .unlocklist ol {
          list-style: none;
          li {
            margin-bottom: 1em
          }
        }
      }
    }
  }

</style>
