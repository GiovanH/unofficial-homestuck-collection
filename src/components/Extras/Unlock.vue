<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <MediaEmbed url="images/v2_biglogo.gif" class="logo"/>
          <h1>UNLOCKABLE CONTENT</h1>
          <MediaEmbed url="images/unlock_gamecode.gif" />
          <div class="text">
            <p>CONGRATULATIONS!!!<br><br>You have entered a valid GAME CODE and unlocked some exciting <strong>FAN-REQUESTED GAME COMMANDS!</strong> These were drawn and posted for fans who made <strong>DONATIONS!</strong></p>
            <br />
            <a href="/unlock/ps000001">FAD+ZAD+AD: Throw down your hats in disgust.</a><br>
            <a href="/unlock/ps000002">PI: Fall in a shockingly inappropriate manner.</a><br>
            <a href="/unlock/ps000003">PI: Fall in a badass noir-antihero manner.</a><br>
            <a href="/unlock/ps000004">PS: GAMBIT SCHEMA -&gt; CANDY CORN TIGER WITH A :3 FACE!</a><br>
            <a href="/unlock/ps000005">MK: Strike villainous pose with surly thugs.</a><br>
            <a href="/unlock/ps000006">PI: Invite your unexpected guests in for a rousing game of DUNGEONS AND DRAGONS.</a><br>
            <a href="/unlock/ps000007">PI: Ogle Amanda disconcertingly.</a><br>
            <a href="/unlock/ps000008">PS: Ride Death's Scythe like a mechanical bull whilst Death plays a stirring rendition of 'Devil Went Down To Georgia' on his fiddle.</a><br>
            <a href="/unlock/ps000009">FAD: GAMBIT SCHEMA -&gt; HOT TAMALE CHUPACABRA! </a><br>
            <a href="/unlock/ps000010">FPI: Teleport to the theater with future copy of Die Hard for FAD and MK to chill out and "See the Movie!".</a><br>
            <a href="/unlock/ps000011">FPI - Turn the BROTHEL into a LOVELY CASINO before you go.</a><br>
            <a href="/unlock/ps000012">GPI: Fondly regard donation.</a><br>
            <a href="/unlock/ps000013">PS: Summon (and incidentally hire) the Midnight Crew to show this rag-a-muffin piker who really holds the cards.</a><br>
            <a href="/unlock/ps000014">MC: Insulted, violently join the battle working for DMK instead.</a><br>
            <a href="/unlock/ps000015">MC &amp; SMK: Wage merciless, donation-funded warfare against the protagonists in a non-canonical but nonetheless grand plotline.</a><br>
            <a href="/unlock/ps000016">Sunglass-Free Stiller Bust: Emerge from the tear in space-time, floating slowly and eerily towards the viewer.</a><br>
            <a href="/unlock/ps000017">PS + AD + PI + ZAD + FAD + 4 adventurers + HD + NB + candymecha + GPI + PPI + FPI VERSUS MK + LoathsomeBeast + MM + DMK + MonsterPI + Fluthulu + SurlyThugs + FrighteningBeast + MortholDryax + BowenStilsonDogg: FACE OFF!</a><br>
            <a href="/unlock/ps000018">MC: Allow LABORER WASPS to collect SHADOW NECTAR from protagonists. Then, HIVE RAGTIME: FILL'EM WITH MIDNIGHT.</a><br>
            <a href="/unlock/ps000019">Everyone: Pause for a 12 month calendar photoshoot cause SHIT JUST GOT UNNERVINGLY REAL. </a><br>
            <a href="/unlock/ps000020">Strike back at the midnight crew using awesome dice based technology.</a><br>
            <a href="/unlock/ps000021">Begin Dating-Sim minigame. </a><br>
            <a href="/unlock/ps000022">MC: SHADOW COMB RAVE -&gt; MIDNIGHT GOSPEL ACT  </a><br>
            <a href="/unlock/ps000023">Crank PROBABILITY THEORY WASP PROFESSOR's Meddling Level up from Medium to High.</a><br>
            <a href="/unlock/ps000024">Death: Accidentally tear a plot hole in your TOME OF WAYFARING SOULS.</a><br>
            <a href="/unlock/ps000025">PS: Combat Operandi: Summon WARHAMMER OF ZILLYHOO!</a><br>
            <a href="/unlock/ps000026">Play a(n) (a)rousing game of Hunk Rump: The Gathering.</a><br>
            <a href="/unlock/ps000027">HONEYBEE PROFESSOR: put an end to PROBABILITY THEORY WASP PROFESSOR's troublesome meddling once and for all.</a><br>
            <a href="/unlock/ps000028">MIDNIGHT CREW: Continue your battle, oblivious to the various odd changes that resulted from Professor Wasp's meddling through time. </a><br>
            <a href="/unlock/ps000029">MC: Attempt to put an end to Probability Theory Wasp's meddling with superior shadow-based magic. </a><br>
            <a href="/unlock/ps000030">Show MAP of all locations seen by the player so far. </a><br>
            <a href="/unlock/ps000031">PI: Summon squad of zombie astronauts to assist! </a><br>
            <a href="/unlock/ps000032">PS: Pose with a little white cat because SHIT JUST GOT CUTE.</a><br>
            <a href="/unlock/ps000033">Candy Mecha Pilot PI: Become PRESIDENT, use Candy Mecha to SAVE AMERICA.</a><br>
            <a href="/unlock/ps000034">Wink suggestively at PLAYER whilst starting small MOUSTACHE FIRE.</a><br>
            <a href="/unlock/ps000035">PS: Summon MICROWAVE TENTACLE MONSTER. LVL 150 CODDLETECH: SLIPPERY SLAPPING SUCKER STEMS</a><br>
            <a href="/unlock/ps000036">FMB: Fondly regard Sarah</a><br>
            <a href="/unlock/ps000037">Death: Using your TOME OF WAYFARING SOULS, gather the former skeletal remains of PS, PI, and AD, as well as ZAD. Shit just got so real that you form a BAND and go on TOUR, performing 'THRILLER' and other undead related MUSICAL NUMBERS.</a><br>
            <a href="/unlock/ps000038">Dapper Swain: Ride mechanical bull like a real bull.</a><br>

            <span class="lock" v-if="$pageIsSpoiler('003655')">[Reach page <strong>{{$mspaOrVizNumber('003655')}}</strong> of Homestuck to unlock!]</span>
            <a v-else href="/unlock/ps000039">Cooper: 'Borrow' Dave's sweet gear and go batshit crazy on some mice and other woodland creatures, while uttering witty one liners.</a><br>

            <span class="lock" v-if="$pageIsSpoiler('003930')">[Reach page <strong>{{$mspaOrVizNumber('003930')}}</strong> of Homestuck to unlock!]</span>
            <a v-else href="/unlock/ps000040">Richard: Challenge Tavros to wheelchair jousting match.</a><br>
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
    }
  },
  computed: {
  },
  methods:{
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
      }	
    }
  }

</style>

