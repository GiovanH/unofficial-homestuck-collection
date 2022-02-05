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
              Mainly your general slew of 2010s edgy stuff.
            </p>
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

            <SpoilerBox v-if="!$isNewReader" :always-open="true" style="font-size: 14px;">
              <p>Since you did not enable new reader mode on the previous page, here's an explanation of how this works:</p>
              <p>As you progress through the story in New Reader Mode, the archive of course keeps track of your current page. If you choose the <b>Replay</b> experience, image retcons will appear as they did at the time of publication. But once you get to the point where the images changed, you can go back and see the changes in the text.</p>
              <p>The <b>Archival</b> experience simply disables this behavior, and always shows the most recent version of every image in all cases, so you see post-retcon images even on your first readthrough.</p>
              <p>So, all that to say, you probably don't care about this. But you're in on the secret! Also, if you want to adjust what you see, you have more granular timeline controls in Settings.</p>
            </SpoilerBox>

            <NewReaderControls features="fastforward" forceGateChoice="true" ref="ffcontrol" @ffchange="_computedWatchers.wizardForwardButtonDisabled.run(); $forceUpdate()"/>
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
            </div>
            
            <div class="center">
              <button class="letsroll" :disabled="!validatePage" @click="validateAndRestart()">All done. Let's roll!</button>
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

      <div class="loadcard" v-else-if="isLoading && !(timeout || $root.loadState === 'ERROR')">
        <div class="lds-spinner">
          <div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div>
        </div>
        <p v-text="loadText"></p>
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
            <p>It looks like something went wrong with your asset pack since the last time you were here. I'm looking for it in:</p><br>
            <p class="center"><strong>{{$localData.assetDir}}</strong></p><br>
            <p>If you moved the asset pack somewhere else, just update the directory below and you'll be able to hop right back into things.</p><br>
            <p>If you were editing any of the assets and something broke, try reverting your changes to see if it fixes anything. This program only really checks to make sure the JSON data is legible and that the Flash plugin exists, so that's probably where your problems are.</p><br>
            <p>Also try to make sure that you're using the latest version of the asset pack. This version of the application is tuned around <strong>v{{$data.$expectedAssetVersion}}</strong>. That's not guaranteed to solve any problems, but it might prevent any unexpected weirdness.</p><br>
            <div class="center">
              <button @click="locateAssets()">Locate Assets</button><br>
              <span class="hint">Directory: {{assetDir || $localData.assetDir || 'None selected'}}</span>
            </div>
            <br>
            <div class="center">
              <button @click="errorModeRestart()">All done. Let's roll!</button>
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

// import { parse } from 'querystring'
const { ipcRenderer } = require('electron')

export default {
  name: 'setup',
  components: {
    TitleBar, NewReaderControls, SpoilerBox
  },
  data: function() {
    return {
      newReaderCardIndex: 0,
      lastNewReaderCard: 4,
      newReaderCardNames: [
        "Intro",
        "Content Warnings",
        "New Readers",
        "Reading Experience",
        "Getting Started"
      ],
      newReaderToggle: true,
      timeout: false,
      assetDir: undefined,
      contentWarnings: [
        'Alcohol use',
        'Animal death',
        'Body horror',
        'Graphic depictions of gruesome deaths',
        'Graphic depictions of violence',
        'Imperialist empires',
        'Incest (mentioned)',
        'Major character death',
        'Male pregnancy',
        'Mind control',
        'Misogyny, sexism',
        'Nonconsensual sexual relationships (implied)',
        'Possession',
        'Slurs',
        'Unhealthy relationships',
        'War crimes'
      ],
      loadStages: {
        "": "Awaiting reactivity",
        "MOUNTED": "Entangling connections",
        "ARCHIVE": "Raking filesystem",
        "MODS": "Turbulating canon",
        "PATCHES": "Applying spackle"
      }
    }
  },
  computed: {
    wizardForwardButtonDisabled(){
      const pagename = this.newReaderCardNames[this.newReaderCardIndex]
      if (pagename == 'New Readers') {
        // missing controls, invalid, or unsaved
        if (!this.$refs.newReaderControls || !this.$refs.newReaderControls.isValidPageSet || this.$refs.newReaderControls.newReaderPageChanged)
          return true
        else return false
      }
      if (pagename == 'Reading Experience') {
        if (!this.$refs.ffcontrol || this.$refs.ffcontrol.myFastForward == undefined)
          return true
        else return false
      }
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
        this.$modChoices[key])
    }
  },
  mounted() {
    setTimeout(function() {
      this.timeout = true
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
      ipcRenderer.invoke('locate-assets', {restart: false}).then( result => {
        this.assetDir = result || this.assetDir
      })
    },
    clearEnabledMods(){
      this.$localData.settings["modListEnabled"] = []
      this.$localData.VM.saveLocalStorage()

      this.timeout = false

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
      min-height: 620px; // Measured value

      .wizardFooter {
        position: absolute;
        margin-bottom: -1em;
        bottom: 0;
      }
      ::v-deep .spoilerbox .logContent {
        padding: 0 1em;
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
        .center {
          text-align: center;
        }
      }
      hr {
        border-top: 3px solid #c6c6c6;
      }
      ol { 
        margin-left: 1.5em;
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
      button {
        font-size: 110%;
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
  // .pageFrame {
  //   width: 950px;
  //   padding-top: 7px;
  //   padding-bottom: 23px;
  //   margin: 0 auto;

  //   flex: 0 1 auto;
  //   display: flex;
  //   flex-flow: column nowrap;
  //   justify-content: center;
  //   align-items: center;
  //   align-content: center;
  // }
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
    font-weight: initial;
    font-size: 16px;
    color: white;
  }

  // adapted from https://loading.io/css/
  .lds-spinner {
    $size: 120px;
    $halfsize: calc(#{$size} / 2);

    color: official;
    display: block;
    position: relative;
    width: $size;
    height: $size;
    margin: auto;

    div {
      transform-origin: $halfsize $halfsize;
      animation: lds-spinner 1.2s linear infinite;

      &:nth-child(1) {
        transform: rotate(0deg);
        animation-delay: -1.1s;
      }
      &:nth-child(2) {
        transform: rotate(30deg);
        animation-delay: -1s;
      }
      &:nth-child(3) {
        transform: rotate(60deg);
        animation-delay: -0.9s;
      }
      &:nth-child(4) {
        transform: rotate(90deg);
        animation-delay: -0.8s;
      }
      &:nth-child(5) {
        transform: rotate(120deg);
        animation-delay: -0.7s;
      }
      &:nth-child(6) {
        transform: rotate(150deg);
        animation-delay: -0.6s;
      }
      &:nth-child(7) {
        transform: rotate(180deg);
        animation-delay: -0.5s;
      }
      &:nth-child(8) {
        transform: rotate(210deg);
        animation-delay: -0.4s;
      }
      &:nth-child(9) {
        transform: rotate(240deg);
        animation-delay: -0.3s;
      }
      &:nth-child(10) {
        transform: rotate(270deg);
        animation-delay: -0.2s;
      }
      &:nth-child(11) {
        transform: rotate(300deg);
        animation-delay: -0.1s;
      }
      &:nth-child(12) {
        transform: rotate(330deg);
        animation-delay: 0s;
      }
    }
    div:after {
      content: " ";
      display: block;
      position: absolute;
      top: 3px;
      left: calc(#{$size} / 2 - 3px);
      width: 6px;
      height: calc(#{$size} / 4 - 2px);
      border-radius: 20%;
      background: #fff;
    }
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}

</style>

