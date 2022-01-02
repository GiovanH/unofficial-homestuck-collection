<template>
  <div class="pageBody">
    <div class="pageFrame">
      <NavBanner />
      <MediaEmbed url="/sweetbroandhellajeff/logo.jpg" />
      <div class="comicNav">
        <a href="/sbahj/1"><MediaEmbed url="/sweetbroandhellajeff/first.jpg" /></a>
        <a :href="prevPage" class="goBack"><MediaEmbed url="/sweetbroandhellajeff/back.jpg" /></a>
        <a :href="nextPage" class="nextArrowLink"><MediaEmbed url="/sweetbroandhellajeff/next.jpg" /></a>
        <a href="/sbahj/54"><MediaEmbed url="/sweetbroandhellajeff/new.jpg" /></a>     
      </div>
      <MediaEmbed class="comic" :url="comicUrl" :key="comicUrl" />
      <div class="comicNav">
        <a href="/sbahj/1"><MediaEmbed url="/sweetbroandhellajeff/first.jpg" /></a>
        <a :href="prevPage"><MediaEmbed url="/sweetbroandhellajeff/back.jpg" /></a>
        <a :href="nextPage"><MediaEmbed url="/sweetbroandhellajeff/next.jpg" /></a>
        <a href="/sbahj/54"><MediaEmbed url="/sweetbroandhellajeff/new.jpg" /></a>     
      </div>
      <div class="awyeahbitches">
        <MediaEmbed url="/sweetbroandhellajeff/awyeahbitches.gif" />
        <div class="ad">
          <a href="/tbiy" target="_blank"><MediaEmbed url="/sweetbroandhellajeff/becomebaby.jpg" /></a>
          <div class="projectWonderful">Ads by Project Wonderful! Your ad here, right now: {{projectWonderfulBid}}</div>
        </div>
        <MediaEmbed url="/sweetbroandhellajeff/makemesomemoney.gif" />
        <MediaEmbed url="/sweetbroandhellajeff/madlewwtz.gif" />
      </div>
      <div class="linkhole">
        <div>ARFTER #46: a bunch of other comomics to!</div>
        <template v-for="comic, i in listedPages">
          <br :key="`comic${i}br`"/>
          <a :href="comic.url" v-text="comic.title" :key="`comic${i}`"/>
        </template>
        <MediaEmbed class="skateboarder" url="/sweetbroandhellajeff/skaterboarder.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'SweetBroAndHellaJeff',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed
  },
  data: function() {
    return {
      projectWonderfulBid: "$9999999999999",
      listedPages: [
        {url: "/sbahj/46", title: "COMIC #46: the game........... is afoof"},
        {url: "/sbahj/45", title: "COMIC #45: cloink"},
        {url: "/sbahj/44", title: "COMIC #44: this is complete bulb shit"},
        {url: "/sbahj/43", title: "COMIC #433: BWEEEEEEEEEEEEEEEEEEEEE EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE EEEEEE EEEEEEEEEE EEEEEE EEEEEEEEEEEEEEEEEEEEEEEEEEE EEEEEEEEEEE EEE EEEEE"},
        {url: "/sbahj/42", title: "COMIC #42: shearching 4 bobby shitfuck"},
        {url: "/sbahj/41", title: "COMIC #41: IS THERE ANYTHING THAT DOISHE BLASTS THATS NOT QUADS."},
        {url: "/sbahj/40", title: "COMIC #40: bube just no"},
        {url: "/sbahj/38", title: "COMIC #38: pthhbhthbhpthhhthtbbbthb"},
        {url: "/sbahj/37", title: "COMIC #37: brough to u by the BIBTCHEZ &amp; THA GANJOG B)"},
        {url: "/sbahj/36", title: "COMIC #36: um, last I checked, the zoo didn't allow IDIDOT GAYS inside"},
        {url: "/sbahj/35", title: "COMIC #35: sububaway is for ONLY when your high, ONLY ... "},
        {url: "/sbahj/34", title: "COMIC #34: if this guy any more stoned then that, he's belong in the holy fucking buble"},
        {url: "/sbahj/33", title: "COMIC #33: BAOOOOOOOOOOOOOOOOOOOOOOOOOOAM!!!!!!!!!!!!!!!!"},
        {url: "/sbahj/32", title: "COMIC #32: (wall)"},
        {url: "/sbahj/31", title: "COMIC #31: tititled, \"THE GRODIRON\"!"},
        {url: "/sbahj/30", title: "COMIC #30: &lt;bold.....&gt;this redard can sit his soggy ass in a car on your shirt like an asshole FORE EVERiiiiiii"},
        {url: "/sbahj/29", title: "COMIC <b>#29</b>: NITE MANGIC!"},
        {url: "/sbahj/28", title: "COM<b>IC #28: spor</b>ts"},
        {url: "/sbahj/27", title: "COMIC #27: DONG"},
        {url: "/sbahj/26", title: "COMIC #26: this fapass dunkstick does this EVEREY fucking time"},
        {url: "/sbahj/25", title: "COMIC #25: more like legrend of the unreal shithead"},
        {url: "/sbahj/24", title: "COMIC #24: them man, the dickhead, the LERGEND."},
        {url: "/sbahj/23", title: "COMIC #23: oOoOoOoOoOoOoOoOooOoOoOOOoOOHHhhh hah just fucking with uou..."},
        {url: "/sbahj/22", title: "COMIC #22: borack bobdama STILL haven't got the hang of this ecolomy thing yet;"},
        {url: "/sbahj/21", title: "COMIC #21: this fine apparell secretly holds a mystery.... SHHHHHHHHHH"},
        {url: "/sbahj/20", title: "CO<b>MIC #20: CHECK OUT THUS HOT NEW MORC</b>H.........."},
        {url: "/sbahj/19", title: "COMIC #19: okay shup up everybody this shit is a SERIOUS, issue"},
        {url: "/sbahj/18", title: "COMIC #18: spoot problems? so want else is new........"},
        {url: "/sbahj/17", title: "COMIC #17: wowoof woof, aha hah what a fuckin IDIOT!"},
        {url: "/sweetbroandhellajeff/movies/SBAHJthemovie1.swf", title: "MOVIE #1: hooly SHIT, wear a MOVIE???????????"},
        {url: "/sbahj/16", title: "COMIC #16: he LAUGHED when he shok, like a bowl full of WEED!!! omfg"},
        {url: "/sbahj/15", title: "COMIC #15: you don't boguard chips in the shitter dude, you just DONT"},
        {url: "/sbahj/14", title: "COMIC #14: HAHAHAHAHAHA they juts don't ever hit the ground, what is WRONG with this picture. \"3\" of ten"},
        {url: "/sbahj/13", title: "COMIC #13:um, EATH TO ASSHOLE. hello can you here me..... (part 2 of thenacho party thing)"},
        {url: "/sbahj/12", title: "COMIC #12: evrybody was high when this went down, EVERYBODY (part 1 of 10"},
        {url: "/sbahj/11", title: "COMIC #11: ok put the can down dude.... haha, unbealievible"},
        {url: "/sbahj/10", title: "COMIC #10: ok, AGAIN with the ANGEL problems. seariously dude??????????"},
        {url: "/sbahj/9", title: "COMIC #9: no way i mean no fucking way, NO WON is that good.."},
        {url: "/sbahj/8", title: "COMIC #8: just do me a FAVOR, put it bock in the fridge bro...."},
        {url: "/sbahj/7", title: "COMIC #7: a GAIN with the socks, you have GOT to be SHITTONG me"},
        {url: "/sbahj/6", title: "COMIC #6: this guy.... he OWNS the glass, he OWNS it"},
        {url: "/sbahj/5", title: "COMIC #5: sweet bro comes thru.......... AGAIN"},
        {url: "/sbahj/4", title: "COMIC #4: not even BARACK obana can bail him out of THIS jam....."},
        {url: "/sbahj/3", title: "COMIC #3: so messed up.... jelly??? omfg thats SO MESSED UP!!!"},
        {url: "/sbahj/2", title: "COMIC #2: HE HE HE"},
        {url: "/sbahj/1", title: "COMIC #1: man listen, stairs. i am TELLING you"}
      ]
    }
  },
  computed: {   
    comicUrl() {
      let ext = ['21', '29', '34', '49'].includes(this.routeParams.cid) ? "gif" : "jpg"
      let page = this.routeParams.cid.toString().padStart(3, "0")
      return `/sweetbroandhellajeff/archive/${page}.${ext}`
    },
    prevPage() {
      let cid = parseInt(this.routeParams.cid)
      cid = (cid == 40) ? 38 : 
        (cid <= 1) ? 1 : cid - 1
      return `/sbahj/${cid}`
    },
    nextPage() {
      let cid = parseInt(this.routeParams.cid)
      cid = (cid == 38) ? 40 : 
        (cid >= 54) ? 54 : cid + 1
      return `/sbahj/${cid}`
    },
  },
  methods:{
    keyNavEvent(dir) {
      if (dir == 'left' && this.$parent.$el.scrollLeft == 0) this.$pushURL(this.prevPage)
      else if (dir == 'right' && this.$parent.$el.scrollLeft + this.$parent.$el.clientWidth == this.$parent.$el.scrollWidth) this.$pushURL(this.nextPage)
    }
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;
    
		font-family: "Comic Sans MS", "Comic Sans", cursive;
		background: #0707ec;
    .navBanner {
      background-color: #000;
      width: 100%;
    }

    .pageFrame {
      min-width: 800px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;

			background: #f400ec;
      
      ::v-deep .comic {
        margin: 16px 0;
      }

      .awyeahbitches {
        margin: 16px 0;
        width: 100%;
        background-image: url(assets://sweetbroandhellajeff/moneytile.gif) ;
        text-align: center;
        .ad {
          display: flex;
          flex-direction: column;
          align-items: center;
          img{
            display: block;
          }
          .projectWonderful {
            width: 600px;
            background: white;
            font-size:10px;
            color:#0000ff;
            text-decoration:none;
            line-height:1.2;
            font-weight:bold;
            font-family:Tahoma, verdana,arial,helvetica,sans-serif;
            text-transform: none;
            letter-spacing:normal;
            text-shadow:none;
            white-space:normal;
            word-spacing:normal;
          }
        }
      }

      .linkhole {
        width: 600px;
        background-color: white;
        font-weight: normal;
        font-size: 12px;
        padding-top: 32px;
        text-align: center;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;

        .skateboarder {
          margin-top: 32px;
        }
      }
    }

  }
  

</style>

