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
          <div class="projectWonderful">Ads by Project Wonderful! Your ad here, right now: $9999999999999</div>
        </div>
        <MediaEmbed url="/sweetbroandhellajeff/makemesomemoney.gif" />
        <MediaEmbed url="/sweetbroandhellajeff/madlewwtz.gif" />
      </div>
      <div class="linkhole">
        <div>ARFTER #46: a bunch of other comomics to!</div>
        <br />
        <a href="/sbahj/46">COMIC #46: the game........... is afoof</a>
        <br />
        <a href="/sbahj/45">COMIC #45: cloink</a>
        <br />
        <a href="/sbahj/44">COMIC #44: this is complete bulb shit</a>
        <br />
        <a href="/sbahj/43">COMIC #433: BWEEEEEEEEEEEEEEEEEEEEE EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE EEEEEE EEEEEEEEEE EEEEEE EEEEEEEEEEEEEEEEEEEEEEEEEEE EEEEEEEEEEE EEE EEEEE</a>
        <br />
        <a href="/sbahj/42">COMIC #42: shearching 4 bobby shitfuck</a>
        <br />
        <a href="/sbahj/41">COMIC #41: IS THERE ANYTHING THAT DOISHE BLASTS THATS NOT QUADS.</a>
        <br />
        <a href="/sbahj/40">COMIC #40: bube just no</a>
        <br />
        <a href="/sbahj/38">COMIC #38: pthhbhthbhpthhhthtbbbthb</a>
        <br />
        <a href="/sbahj/37">COMIC #37: brough to u by the BIBTCHEZ &amp; THA GANJOG B)</a>
        <br />
        <a href="/sbahj/36">COMIC #36: um, last I checked, the zoo didn't allow IDIDOT GAYS inside</a>
        <br />
        <a href="/sbahj/35">COMIC #35: sububaway is for ONLY when your high, ONLY ... </a>
        <br />
        <a href="/sbahj/34">COMIC #34: if this guy any more stoned then that, he's belong in the holy fucking buble</a>
        <a href="/sbahj/33">COMIC #33: BAOOOOOOOOOOOOOOOOOOOOOOOOOOAM!!!!!!!!!!!!!!!!</a>
        <br />
        <a href="/sbahj/32">COMIC #32: (wall)</a>
        <br />
        <a href="/sbahj/31">COMIC #31: tititled, "THE GRODIRON"!</a>
        <br />
        <a href="/sbahj/30">COMIC #30: &lt;bold.....&gt;this redard can sit his soggy ass in a car on your shirt like an asshole FORE EVERiiiiiii</a>
        <br />
        <a href="/sbahj/29">COMIC <b>#29</b>: NITE MANGIC!</a>
        <br />
        <a href="/sbahj/28">COM<b>IC #28: spor</b>ts</a>
        <br />
        <a href="/sbahj/27">COMIC #27: DONG</a>
        <br />
        <a href="/sbahj/26">COMIC #26: this fapass dunkstick does this EVEREY fucking time</a>
        <br />
        <a href="/sbahj/25">COMIC #25: more like legrend of the unreal shithead</a>
        <br />
        <a href="/sbahj/24">COMIC #24: them man, the dickhead, the LERGEND.</a>
        <br />
        <a href="/sbahj/23">COMIC #23: oOoOoOoOoOoOoOoOooOoOoOOOoOOHHhhh hah just fucking with uou...</a>
        <br />
        <a href="/sbahj/22">COMIC #22: borack bobdama STILL haven't got the hang of this ecolomy thing yet;</a>
        <br />
        <a href="/sbahj/21">COMIC #21: this fine apparell secretly holds a mystery.... SHHHHHHHHHH</a>
        <br />
        <a href="/sbahj/20">CO<b>MIC #20: CHECK OUT THUS HOT NEW MORC</b>H..........</a>
        <br />
        <a href="/sbahj/19">COMIC #19: okay shup up everybody this shit is a SERIOUS, issue</a>
        <br />
        <a href="/sbahj/18">COMIC #18: spoot problems? so want else is new........</a>
        <br />
        <a href="/sbahj/17">COMIC #17: wowoof woof, aha hah what a fuckin IDIOT!</a>
        <br />
        <a href="/sweetbroandhellajeff/movies/SBAHJthemovie1.swf">MOVIE #1: hooly SHIT, wear a MOVIE???????????</a>
        <br />
        <a href="/sbahj/16">COMIC #16: he LAUGHED when he shok, like a bowl full of WEED!!! omfg</a>
        <br />
        <a href="/sbahj/15">COMIC #15: you don't boguard chips in the shitter dude, you just DONT</a>
        <br />
        <a href="/sbahj/14">COMIC #14: HAHAHAHAHAHA they juts don't ever hit the ground, what is WRONG with this picture. "3" of ten</a>
        <br />
        <a href="/sbahj/13">COMIC #13:um, EATH TO ASSHOLE. hello can you here me..... (part 2 of thenacho party thing)</a>
        <br />
        <a href="/sbahj/12">COMIC #12: evrybody was high when this went down, EVERYBODY (part 1 of 10</a>
        <br />
        <a href="/sbahj/11">COMIC #11: ok put the can down dude.... haha, unbealievible</a>
        <br />
        <a href="/sbahj/10">COMIC #10: ok, AGAIN with the ANGEL problems. seariously dude??????????</a>
        <br />
        <a href="/sbahj/9">COMIC #9: no way i mean no fucking way, NO WON is that good..</a>
        <br />
        <a href="/sbahj/8">COMIC #8: just do me a FAVOR, put it bock in the fridge bro....</a>
        <br />
        <a href="/sbahj/7">COMIC #7: a GAIN with the socks, you have GOT to be SHITTONG me</a>
        <br />
        <a href="/sbahj/6">COMIC #6: this guy.... he OWNS the glass, he OWNS it</a>
        <br />
        <a href="/sbahj/5">COMIC #5: sweet bro comes thru.......... AGAIN</a>
        <br />
        <a href="/sbahj/4">COMIC #4: not even BARACK obana can bail him out of THIS jam.....</a>
        <br />
        <a href="/sbahj/3">COMIC #3: so messed up.... jelly??? omfg thats SO MESSED UP!!!</a>
        <br />
        <a href="/sbahj/2">COMIC #2: HE HE HE</a>
        <br />
        <a href="/sbahj/1">COMIC #1: man listen, stairs. i am TELLING you</a>

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
  title: () => "sweet bro and hella jeff",
  theme: () => 'sbahj',
  data: function() {
    return {
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
  methods: {
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

