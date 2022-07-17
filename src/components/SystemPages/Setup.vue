<template>
<div class="setup">
  <div class="header">
    <TitleBar />
  </div>
  <div class="tabFrame">
    <div class="pageBody">
      <div class="card" v-if="isNewUser">
        <!-- First-run app setup, no error -->
        <div class="cardContent newUserSetup wizard">
          <div class="wizardSidebar">
            <img class="logo" src="@/assets/collection_logo.png"> <br />
            <ol class="wizardProgress">
              <li v-for="name, i in newReaderCardNames" 
                v-text="name" 
                :class="{current: i==newReaderCardIndex, previous: i < newReaderCardIndex, future: i > newReaderCardIndex}"
                :key="`wizardProgress${i}`"
                :data-key="name" />
            </ol>
          </div>
          <div class="wizardBody">

          <div class="intro" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Intro'}">
            <h2>Hello!</h2>
            <p>Let me tell you a story about a webcomic called <em>Homestuck</em>. The fourth in a series of “MS Paint Adventures” authored by Andrew Hussie from 2006 to 2016, it became wildly successful, in part because of its eclectic use of web technology like Adobe Flash and GIF animations.</p>

            <p>However, with Flash finally being phased out at the end of 2020, <em>Homestuck</em> is in a precarious state. While there have been official attempts to preserve aspects of the original experience by VIZ Media (who have published <em>Homestuck</em> since 2018), the results have been mixed. With extra content scattered around the web in various states of decay, a solution was needed to preserve <em>Homestuck's</em> one-of-a-kind presentation and flair, for both returning readers and those new to the story.</p>

            <p>This self-contained collection contains <em>Homestuck</em> (with Flash elements fully intact), the other MS Paint Adventures, official <em>Homestuck</em> side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience. Hopefully, this collection should be the best way to read <em>Homestuck</em>, and preserve what made it so special.</p>

            <div class="hint wizardFooter">
              <!-- <p>WARNING: This program is protected by copyright law and international treaties.</p> -->
              <!-- I want to. I really want to. -->
              <p>This application is open source (<a href="https://github.com/Bambosh/unofficial-homestuck-collection/blob/main/LICENSE">GPL-3.0</a>). Check out the <a href="https://github.com/Bambosh/unofficial-homestuck-collection/">GitHub page</a> for resources like information on how you can contribute and the issue tracker so you can send us any bug reports. 
            </p>
            </div>
          </div>

          <div class="contentWarnings" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Content Warnings'}">
            <h2>Content Warnings</h2>
            <p>
              Homestuck was written for teenagers but contains adult topics as well as a laundry list of potential triggers. Here are some of the topics that come up:
            </p>
            <SpoilerBox>
              <div class="scrollbox" style="max-height: 18em; margin: 1em 0;">
                <ul>
                  <li v-for="cw in contentWarnings" v-text="cw" :key="cw" />
                </ul>
              </div>
            </SpoilerBox>
            <p>
              Most of the particularly harsh examples are either briefly touched on or buried away in corners (older comics, beyond canon, etc).
            </p>
          </div>

          <div class="newReader" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'New Readers'}">
            <!-- <p>Were you sent here by a friend? If so, welcome! I promise it's all as good as they’ve been telling you. If it wasn’t, I wouldn’t have wasted months of my life building this thing.</p> -->
            <h2>New Readers</h2>
            <p><em>The Unofficial Homestuck Collection</em> has a <strong>New Reader Mode</strong> that will automatically track your progress in the story, and automatically hide spoiler content until you get to the point in the story where each new bit unlocks. Don't worry, you don't have to get to the end to unlock the goodies! We try to make each bonus available as soon as we can.</p>
            <p>Whether you’re a totally new reader, or if you’ve already made some progress on the official website, it is <strong>heavily recommended you leave this setting enabled.</strong> And, if you're already partway in, you can adjust your current page here.</p>
            <!-- <span class="tiny">(You can always switch it off later or tweak some of the anti-spoiler features in Settings.)</span> -->

            <!-- Note: this is on by default via localData, not fancy interface hacks. -->
            <!-- We can't do that with fastforward because we need v1.1 users to be able to migrate settings. -->
            <NewReaderControls features="pagenumber" ref="newReaderControls" @change="_computedWatchers.wizardForwardButtonDisabled.run(); $forceUpdate()" />

            <hr />

            <p>Regardless of what you choose here, you should probably also pop into Settings once the collection loads so you can configure your reading style. If New Reader Mode is on the Settings page will be spoiler-free too.</p>
          </div>

          <div class="fastForward" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Reading Experience'}">
            <h2>Reading Experience</h2>

            <p>Okay, one last choice we're going to force you to make before you jump in:</p>

            <!-- this never displays, haha -->
            <SpoilerBox v-if="!$isNewReader" :always-open="true" style="font-size: 14px;">
              <p>Since you did not enable new reader mode on the previous page, here's an explanation of how this works:</p>
              <p>As you progress through the story in New Reader Mode, the archive of course keeps track of your current page. If you choose the <b>Replay</b> experience, image retcons will appear as they did at the time of publication. But once you get to the point where the images changed, you can go back and see the changes in the text.</p>
              <p>The <b>Archival</b> experience simply disables this behavior, and always shows the most recent version of every image in all cases, so you see post-retcon images even on your first readthrough.</p>
              <p>So, all that to say, you probably don't care about this. But you're in on the secret! Also, if you want to adjust what you see, you have more granular timeline controls in Settings.</p>
            </SpoilerBox>

            <!-- forceGateChoice="true"  -->
            <NewReaderControls features="fastforward" 
            ref="ffcontrol" @ffchange="_computedWatchers.wizardForwardButtonDisabled.run(); $forceUpdate()"/>
          </div>

          <div class="getStarted" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Getting Started'}">
            <h2>Getting Started</h2>
            <p><em>The Unofficial Homestuck Collection</em> comes in two parts:</p>
            <ol>
              <li>The application itself. (You’re running it now!)</li>
              <li>The asset pack, a 4gb folder you should have downloaded separately. This version of the application is tuned for <strong>v{{$data.$expectedAssetVersion}}</strong> of the asset pack.</li>
            </ol>
            <p>To finish setting up the collection, you’ll have to tell it where to find the assets on your computer. Make sure you’ve unzipped the folder, then click the button below to bring it into the application. If everything checks out, the application will open up into collection proper!</p>
            
            <div class="center">
              <button @click="locateAssets()">Locate Assets</button>
              <span class="hint">Directory: {{assetDir || 'None selected'}}</span>
              <!-- TODO: Unify this warning with the popup you get for entering an incorrect path -->
              <span v-if="isExpectedAssetVersion === false" class="error hint">That looks like asset pack v{{selectedAssetVersion}}, which is not the correct version. Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}.</strong></span>
            </div>
            
            <div class="center">
              <button class="letsroll" :disabled="!validatePage || !isExpectedAssetVersion" @click="validateAndRestart()">All done. Let's roll!</button>
            </div>
          </div>

          </div>
          <div class="wizardNavigation">
            <button v-if="newReaderCardIndex > 0" @click="wizardNextPage(-1)" style="right: 94px;">&lt; Previous</button>
            <button v-if="newReaderCardIndex < lastNewReaderCard" 
              @click="wizardNextPage(1)" style="right: 20px;"
              :disabled="wizardForwardButtonDisabled">Next &gt;</button>
            <!--<button v-if="newReaderCardIndex == lastNewReaderCard" @click="">Finish</button>-->
          </div>
          
        </div>
      </div>

      <div v-else-if="isLoading && !(loadingTooLongTimeout || $root.loadState === 'ERROR')">
        <div class="loadcard" >
<svg class="spiro" xmlns:xlink="http://www.w3.org/1999/xlink" height="520px" width="520px" xmlns="http://www.w3.org/2000/svg" viewBox="-260 -260 520 520">
  <g>
    <!-- <circle cx="0" cy="0" r="3" fill="orange"/> -->
    <g id="halfSpiro" class="left">
      <!-- <circle cx="0" cy="0" r="2" fill="blue"/> -->
      <!-- <path v-if="copiedPath" :d="copiedPath" style="stroke: blue; stroke-width: 22px;" /> -->
      <path id="thePath" :d="spiroPos[spiroTestindex]">
        <animate v-if="spiroTestAnimate"
          attributeName="d"
          :values="spiroPosDoubled.join('; \n')"
          :keyTimes="Array.from(spiroPosDoubled, (_, i) => (i/(spiroPosDoubled.length - 1)).toFixed(2)).join(';')"
          dur="5.5s" begin="0s" repeatCount="indefinite" />
      </path>
      <use href="#thePath"
        v-for="n in 9"  :key="`p${n}`"
        :style="{transform: `rotate(${(n) * (360/10)}deg)`}"/>
    </g>
    <use href="#halfSpiro" class="right" />
  </g>
    <!-- <circle cx="0" cy="0" r="4" fill="red"/> -->
</svg>
          <p v-text="loadText"></p>
        </div>
        <!-- <input type="checkbox" v-model="spiroTestAnimate" />
        <button @click="copiedPath = spiroPos[spiroTestindex]">Copy</button>
        <select v-model="spiroTestindex"><option v-for="v, i in spiroPos" :key="i" :value="i" v-text="i" /></select>
        <textarea v-model="spiroPos[spiroTestindex]" style="width: 100%; height: 80px" /> -->
      </div>

      <div class="card" v-else>
        <!-- Something went wrong. -->
        <div class="cardContent">
          <div class="errorWithMods" v-if="modsEnabled.length">
            <br>
            <img class="logo" src="@/assets/collection_logo.png"><br>
            <p>Sorry! Something went critically wrong loading the program.</p><br>
            <p>You currently have mods enabled:</p><br>
            <ol class="modlist">
              <li
                v-for="option in modsEnabled"
                :key="option.key"
                :data-value="option.key"
              >
                <b v-text='option.label' />
                <span class='summary' v-if='option.summary' v-text='option.summary' />
              </li>
            </ol>
            <br>
            <p>It's likely one of these is causing the problem, or else some interaction between them. </p><br>
            <p>Please disable all mods and then restart.</p><br>
            <div class="center">
              <button @click="clearEnabledMods()">Disable all and reload</button><br>
            </div>
            <span class="hint">If this issue persists when you re-enable a specific mod, please contact the mod's author!</span>
          </div>

          <div class="errorWithoutMods" v-else>
            <img class="logo" src="@/assets/collection_logo.png"><br>
            <p>It looks like something went wrong with your asset pack since the last time you were here.<br />I'm looking for <strong>v{{$data.$expectedAssetVersion}}</strong> in:</p><br>
            <p class="center"><strong>{{$localData.assetDir}}</strong></p><br>
            <p>If you just updated the app, you might have asset pack <strong>v1</strong> installed already. This version requires <strong>v{{$data.$expectedAssetVersion}}</strong>; if you don't have it already, go to our <a href='https://bambosh.github.io/unofficial-homestuck-collection/'>website</a> for information on downloading it.</p><br>
            <p>If you moved the asset pack somewhere else, just update the directory below and you'll be able to hop right back into things.</p><br>
            <p>If you were using v2 already but made a change and something broke, try reverting your changes to see if it fixes anything. This program only really checks to make sure the JSON data is legible and that the Flash plugin exists, so that's probably where your problems are.</p><br>
            <div class="center">
              <button @click="locateAssets()">Locate Asset Pack v{{$data.$expectedAssetVersion}}</button>
              <span class="hint">Directory: {{assetDir || 'None selected'}}</span>
              <span v-if="isExpectedAssetVersion === false" class="error hint">That looks asset pack v{{selectedAssetVersion}}, which is not the correct version. Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}</strong></span>
            </div>
            
            <div class="center">
              <button class="letsroll" :disabled="!validatePage || !isExpectedAssetVersion" @click="errorModeRestart()">All done. Let's roll!</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>

<script>
import TitleBar from '@/components/AppMenu/TitleBar.vue'
import NewReaderControls from '@/components/SystemPages/NewReaderControls.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'
// import Logo from '@/components/UIElements/Logo.vue'

// import { parse } from 'querystring'
const { ipcRenderer } = require('electron')

export default {
  name: 'setup',
  components: {
    TitleBar, NewReaderControls, SpoilerBox //, Logo
  },
  data: function() {
    return {
      newReaderCardIndex: 0,
      lastNewReaderCard: 4,
      spiroTestindex: 0,
      copiedPath: undefined,
      spiroTestAnimate: true,
      newReaderCardNames: [
        "Intro",
        "Content Warnings",
        "New Readers",
        "Reading Experience",
        "Getting Started",
      ],
      newReaderToggle: true,
      loadingTooLongTimeout: false,
      assetDir: undefined,
      isExpectedAssetVersion: undefined,
      selectedAssetVersion: undefined,
      contentWarnings: [
        'Slurs',
        'Misogyny, sexism',
        'Fatphobia',

        'Alcohol abuse',
        'Drug abuse',

        'Major character death',
        'Minor character death',
        'Parental death',
        'Animal death',
        'Child death',

        'Body horror & injury',
        'Torture',
        'Eye mutilation',
        'Graphic depictions of gruesome deaths',
        'Graphic depictions of violence',
        'Self-harm',
        'Suicide & suicide threats',

        'Incest',
        'Insects & Spiders',
        'Snakes',
        'Clowns',

        'Nonconsensual sexual relationships',
        'Unhealthy relationships',
        'Verbal abuse',
        'Domestic violence',
        'Possession',
        'Mind control',
        'Male pregnancy',
        'Bestiality',

        'War crimes',
        'Genocide',
        'Imperialist empires',
      ],
      loadStages: {
        "": "Awaiting reactivity",
        "MOUNTED": "Entangling connections",
        "ARCHIVE": "Raking filesystem",
        "MODS": "Turbulating canon",
        "PATCHES": "Applying spackle"
      },
      spiroPos: [
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-6.5  -81.8  Q-20.9  -10.45  -84.5  -1.35  -148.1  7.8    -186.1  -45.15 -224.1  -98.05  -206.4  -156.1  -188.7  -214.1  -203.4  -275",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-25.5 -140.3 Q-63.3  -95.15  -103.9 -78.9  -144.45 -62.65 -181.9  -84.3  -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3",
        "M-14.0 -102.8 Q-64.65 -101.15 -107.4 -66.9  -150.1  -32.65 -184.75 -69.3  -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M8.0   -40.3  Q-4.85  -7.45   -74.5  -1.35  -138.15 7.8    -181.15 -49.15 -224.1  -98.05  -218.0  -150.1  -217.9  -214.1  -144.95 -228.3",
        "M4     -57    Q-9.8   -6.3    -67.5  1.3    -125.2  8.95   -120.8  -53.7  -116.4  -116.35 -166.0  -165.25 -215.6  -214.15 -180.45 -260",
        "M-8.0  -88.3  Q-9.8   -6.3    -72.15 2.85   -134.45 12.0   -172.5  -21.9  -210.5  -55.75  -210.9  -123.3  -211.25 -190.8  -160.45 -239.8",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-47.0 -215.3 Q-40    -70     -95.5  -36.35 -138.15 -17    -185.15 -52.15 -229.1  -100.05 -221.0  -156.1  -217.9  -214.1  -164.95 -245.3",
        "M-24.0 -135.3 Q-20    -60     -80.5  -36.35 -138.15 -17    -185.15 -52.15 -229.1  -100.05 -207.0  -146.1  -187.9  -196.1  -114.95 -205.3",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3"
      ]
// cat * | grep "<path d" | sed -E "s/.+?d=\"([^\"]+?)\".+/\"\1\",/g" | sed -E 's/([A-Z ])-([0-9])/\1_\2/g' | sed -E 's/([A-Z ])([0-9])/\1-\2/g' | sed -E 's/([A-Z ])_([0-9])/\1\2/g'
    }
  },
  computed: {
    spiroPosDoubled(){
      return this.spiroPos.reduce((acc, i) => [...acc, i, i], [])
    },
    wizardForwardButtonDisabled(){
      const pagename = this.newReaderCardNames[this.newReaderCardIndex]
      if (pagename == 'New Readers') {
        // missing controls, invalid, or unsaved
        if (!this.$refs.newReaderControls || !this.$refs.newReaderControls.isValidPageSet || this.$refs.newReaderControls.newReaderPageChanged)
          return true
        else return false
      }
      // if (pagename == 'Reading Experience') {
      //   if (!this.$refs.ffcontrol || this.$refs.ffcontrol.myFastForward == undefined)
      //     return true
      //   else return false
      // }
      return false
    },
    validatePage() {
      return this.assetDir
    },
    isLoading() {
      return this.$root.loadState === undefined || this.$root.loadState == "LOADING"
    },
    loadText() {
      if (this.$root.loadStage === undefined) {
        return this.loadStages[""] || toString(this.$root.loadStage)
      }
      return this.loadStages[this.$root.loadStage] || toString(this.$root.loadStage)
    },
    isNewUser() {
      return !this.$localData.assetDir
    },
    modsEnabled() {
      return this.$localData.settings.modListEnabled.map((key) => 
        this.$modChoices[key]).filter(val => !!val)
    }
  },
  mounted() {
    setTimeout(function() {
      this.loadingTooLongTimeout = true
    }.bind(this), 8000)
  },
  methods: {
    wizardNextPage(direction){
      let stablepos = false
      let next_index = this.newReaderCardIndex + direction
      while (!stablepos) {
        stablepos = true
        const pagename = this.newReaderCardNames[next_index]
        if (pagename == "Reading Experience" && !this.$isNewReader) {
          next_index += direction
          stablepos = false
        }
      }
      this.newReaderCardIndex = next_index
    },
    locateAssets(){
      ipcRenderer.invoke('locate-assets', {restart: false}).then(result => {
        this.assetDir = result || this.assetDir
        this.checkAssetVersion(this.assetDir)
      })
    },
    checkAssetVersion(assetDir){
      ipcRenderer.invoke('check-archive-version', {assetDir}).then(result => {
        this.selectedAssetVersion = result
        this.isExpectedAssetVersion = (result == this.$data.$expectedAssetVersion)
        this.$logger.info("Version check: got", result, "eq?", this.$data.$expectedAssetVersion, this.isExpectedAssetVersion)
      })
    },
    clearEnabledMods(){
      this.$localData.settings["modListEnabled"] = []
      this.$localData.VM.saveLocalStorage()

      this.loadingTooLongTimeout = false

      this.modSoftRestart()
    },
    validateAndRestart(){
      this.$localData.root.SET_ASSET_DIR(this.assetDir)

      ipcRenderer.invoke('restart')
    },
    errorModeRestart() {
      if (!!this.assetDir && this.assetDir != this.$localData.assetDir) this.$localData.root.SET_ASSET_DIR(this.assetDir)

      // ipcRenderer.send("RELOAD_ARCHIVE_DATA")
      ipcRenderer.invoke('restart')
    },
    modSoftRestart() {
      ipcRenderer.send("RELOAD_ARCHIVE_DATA")
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
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
  .wizard {
    .wizardSidebar {
      width: 210px;
      float: left;
      height: 100%;
      margin: 25px 15px 0 0;
      .wizardProgress {
        li {
          position: relative;
          margin-left: 1em;
          list-style: none;

          &:before {
            content: "";
            position: absolute;
            top: 3px;
            left: -19px;
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 6px;
            background: linear-gradient(135deg,#dcdcd7,#fff);
            border-radius: 50%;
            border: 1px solid #1d5281;
          }
          &.previous {
            font-weight: bold;
            &:after {
              content: "";
              display: block;
              width: 5px;
              height: 5px;
              top: 8px;
              left: -14px;
              position: absolute;
              background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 5 5' shape-rendering='crispEdges'%3E%3Cpath stroke='%23a9dca6' d='M1 0h1M0 1h1'/%3E%3Cpath stroke='%234dbf4a' d='M2 0h1M0 2h1'/%3E%3Cpath stroke='%23a0d29e' d='M3 0h1M0 3h1'/%3E%3Cpath stroke='%2355d551' d='M1 1h1'/%3E%3Cpath stroke='%2343c33f' d='M2 1h1'/%3E%3Cpath stroke='%2329a826' d='M3 1h1'/%3E%3Cpath stroke='%239acc98' d='M4 1h1M1 4h1'/%3E%3Cpath stroke='%2342c33f' d='M1 2h1'/%3E%3Cpath stroke='%2338b935' d='M2 2h1'/%3E%3Cpath stroke='%2321a121' d='M3 2h1'/%3E%3Cpath stroke='%23269623' d='M4 2h1'/%3E%3Cpath stroke='%232aa827' d='M1 3h1'/%3E%3Cpath stroke='%2322a220' d='M2 3h1'/%3E%3Cpath stroke='%23139210' d='M3 3h1'/%3E%3Cpath stroke='%2398c897' d='M4 3h1'/%3E%3Cpath stroke='%23249624' d='M2 4h1'/%3E%3Cpath stroke='%2398c997' d='M3 4h1'/%3E%3C/svg%3E")
            }
          }
          &.current {
            font-weight: bold;
            color: orangered;
            &:before {
              box-shadow: inset -2px -2px #f8b636, inset 2px 2px #fedf9c;
            }
          }
        }
        li[data-key="Reading Experience"] {
            margin-left: 2em !important;
        }
      }
    }
    .wizardBody {
      position: relative;
      display: grid;
      margin: 25px;
      min-height: 580px; // Measured value

      .wizardFooter {
        position: absolute;
        margin-bottom: -1em;
        bottom: 0;
      }
      ::v-deep .spoilerbox .logContent {
        padding: 0 1em;
      }
      // CSS reset is a lie that hurts people.
      p {
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
      }
      h2 {
        margin-block-end: 0.83em;
      }
    }
    .wizardNavigation {
      position: relative;
      min-height: 1em;
      text-align: right;
      button {
        font-size: 16px;
        position: absolute;
        margin: 0 2px;
      }
    }
  }
  .card {
    position: relative;
    margin: auto;
    padding: 0 25px;
    border: solid 5px #c6c6c6;
    box-sizing: border-box;
    width: 950px;
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

      .modlist li {
        /*list-style-position: inside;*/
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.125);
        margin-bottom: -1px;
        padding: 0.2em;
        .summary:before {
          content: " - ";
        }
      }
    }
  }
}

.loadcard {
  margin: auto;
  p {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 16px;
    color: white;

    text-align: center;
    font-weight: bold;
    text-shadow: 1px 1px 0px black;
  }

  svg.spiro {
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    animation-name: spin;
    animation-duration: 8000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    > g, use {
    // container
      transform: translate(0, 145px);
      > g, use { // Spirograph half
        height: 520px;
        width: 520px;
        stroke: rgb(56, 244, 61);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 8;
        fill: transparent;
        &.left { // Left
          transform: translate(24px, 0);
          // stroke: orange;
        }
        &.right { // Right
          // transform: translate(-24px, 0) scale(-1, 1);
          transform: scale(-1, 1);
        }
        path, use {
          transform-origin: -24px -145px;
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),

          &:nth-child(8),
          &:nth-child(9),
          &:nth-child(10) {
            display: none;
            display: inherit;
          }
        }
      } // end half
    }
  } // end svg
}

</style>

