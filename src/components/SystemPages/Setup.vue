<template>
<div class="setup">
  <div class="header">
    <TitleBar />
  </div>
  <div class="tabFrame">
    <div class="pageBody">
      <div class="card" v-if="isNewUser">
        <!-- First-run app setup, no error -->
        <div class="cardContent card_intro">

          <div class="wizardSidebar">
            <img class="logo" src="@/assets/collection_logo.png"> <br />
            <ol class="wizardProgress">
              <li v-for="name, i in newReaderCardNames" 
                v-text="name" 
                :class="{current: i==newReaderCard, previous: i < newReaderCard, future: i > newReaderCard}"
                :key="`wizardProgress${i}`" />
            </ol>
          </div>
          <div class="wizardBody">

          <div class="intro" v-if="newReaderCard == 0">
            <h2>Introduction</h2><br>
            <p>Let me tell you a story about a webcomic called <em>Homestuck</em>. The fourth in a series of “MS Paint Adventures” authored by Andrew Hussie from 2006 to 2016, it became wildly successful, in part because of its eclectic use of web technology like Adobe Flash and GIF animations.</p><br>

            <p>However, with Flash finally being phased out at the end of 2020, <em>Homestuck</em> is in a precarious state. While there have been official attempts to preserve aspects of the original experience by VIZ Media (who have published <em>Homestuck</em> since 2018), the results have been mixed. With extra content scattered around the web in various states of decay, a solution was needed to preserve <em>Homestuck's</em> one-of-a-kind presentation and flair, for both returning readers and those new to the story.</p><br>

            <p>This self-contained collection contains <em>Homestuck</em> (with Flash elements fully intact), the other MS Paint Adventures, official <em>Homestuck</em> side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience. Hopefully, this collection should be the best way to read <em>Homestuck</em>, and preserve what made it so special.</p>
          </div>
          <div class="newReader" v-if="newReaderCard == 1">
            <h2>New Readers</h2><br>
            <!-- <p>Were you sent here by a friend? If so, welcome! I promise it's all as good as they’ve been telling you. If it wasn’t, I wouldn’t have wasted months of my life building this thing.</p><br> -->
            <p><em>The Unofficial Homestuck Collection</em> contains truckloads of bonus content, a significant amount of which recklessly brandishes major spoilers for the main story.</p><br>
            <p>For this reason, <em>The Unofficial Homestuck Collection</em> has a <strong>New Reader Mode.</strong> It will automatically track your progress in the story, and strategically lock off such content until your dear, sweet, precious eyes are ready to handle it. Furthermore, <strong>New Reader Mode</strong> will also adjust <em>Homestuck</em> itself in minor ways that keep it somewhat in line with the state of the comic as it was written.</p><br>
            <p>Whether you’re a totally new reader, or if you’ve already made some progress on the official website, it is <strong>heavily recommended you leave this setting enabled.</strong> <span class="tiny">(You can always switch it off later if it ends up being too much.)</span></p><br>
            <br>
            <div class="center">
              <label><input type="checkbox" v-model="newReaderToggle" />Enable New Reader Mode, starting from page </label><input type="text" :class="{invalid: !newReaderValidation}" v-model="newReaderPage" size="1" maxlength="4" :disabled="!newReaderToggle" /><br>
              <p class="hint" v-show="newReaderToggle">Enter a <em>Homestuck</em> page number between 1 and 8129.<br>e.g. www.homestuck.com/story/<strong>413</strong></p>
            </div>
            <p>If you enable New Reader Mode, you should probably also pop into Settings once the collection loads so you can configure your reading style and how the collection handles certain spoilers.</p>
          </div>
          <div class="getStarted" v-if="newReaderCard == 2">
            <h2>Getting Started</h2><br>
            <p><em>The Unofficial Homestuck Collection</em> comes in two parts:</p><br>
            <ol>
              <li>The application itself. (You’re running it now!)</li><br>
              <li>The asset pack, a 4gb folder you should have downloaded separately. This version of the application is tuned for <strong>v{{$data.$expectedAssetVersion}}</strong> of the asset pack.</li>
            </ol><br>
            <p>To finish setting up the collection, you’ll have to tell it where to find the assets on your computer. Make sure you’ve unzipped the folder, then click the button below to bring it into the application. If everything checks out, the application will open up into collection proper!</p>
            <br>
            <div class="center">
              <button @click="locateAssets()">Locate Assets</button><br>
              <span class="hint">Directory: {{assetDir || 'None selected'}}</span>
            </div>
            <br>
            <div class="center">
              <button :disabled="!validatePage" @click="validateAndRestart()">All done. Let's roll!</button>
            </div>
          </div>

          </div>
          <div class="wizardNavigation">
            <button v-if="newReaderCard > 0" @click="newReaderCard -= 1">Previous</button>
            <button v-if="newReaderCard < lastNewReaderCard" @click="newReaderCard += 1">Next</button>
            <!--<button v-if="newReaderCard == lastNewReaderCard" @click="">Finish</button>-->
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
        <div class="cardContent card_intro">
          <div class="getStarted" v-if="modsEnabled.length">
            <img class="logo" src="@/assets/collection_logo.png"><br>
            <p>Sorry! Something went critically wrong loading the program.</p><br>
            <p>You currently have mods enabled:</p><br>
            <ol>
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
            <br>
            <span class="hint">If this issue persists when you re-enable a mod, please contact the mod author!</span>
          </div>
          <div class="getStarted" v-else>
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
// import { parse } from 'querystring'
const { ipcRenderer } = require('electron')

export default {
  name: 'setup',
  components: {
    TitleBar
  },
  data: function() {
    return {
      newReaderCard: 0,
      lastNewReaderCard: 2,
      newReaderCardNames: [
        "Intro",
        "New Readers",
        "Getting Started"
      ],
      newReaderToggle: true,
      timeout: false,
      newReaderPage: "1",
      newReaderValidation: true,
      assetDir: undefined,
      invalidPages: ['2399', '3038', '3088', '6370', '7902', '7903', '7904'],
      loadStages: {
        "": "Awaiting reactivity",
        "MOUNTED": "Entangling connections",
        "ARCHIVE": "Raking filesystem",
        "MODS": "Turbulating canon",
        "PATCHES": "Applying spackle",
      }
    }
  },
  computed: {
    validatePage() {
      return this.newReaderValidation && this.assetDir
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
      if (this.newReaderToggle && this.newReaderValidation) {
        let mspaId = (parseInt(this.newReaderPage) + 1900).toString().padStart(6, '0') 
        this.$updateNewReader(mspaId)
      }
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
    newReaderPage(to, from) {
      let parsedTo = parseInt(to)
      this.$logger.info(to, parsedTo)
      this.newReaderValidation = (!/\D/.test(to) && 1 <= parsedTo && parsedTo <= 8129 && !this.invalidPages.includes(to) )
    }
  }
}
</script>

<style scoped lang="scss">
.setup {
  display: flex;
  flex-flow: column;
  height: 100%;

  .header{
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

      background: url(../../assets/homebg_right.png) repeat-y, url(../../assets/homebg_left.png) repeat-y;
      background-position: left top, right top;
      background-color: #35bfff;
      background-attachment: fixed;

      .pageFrame {
        width: 950px;
        padding-top: 7px;
        padding-bottom: 23px;
        margin: 0 auto;

        flex: 0 1 auto;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
      }
      .card {
        position: relative;
        margin: 50px 0;
        padding: 0 50px;
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

          .wizardSidebar {
            width: 200px;
            float: left;
            height: 100%;
            margin: 25px 25px 25px 0;
            .wizardProgress {
              li {
                &.previous {
                  list-style: disc;
                  font-weight: bold;
                }
                &.current {
                  list-style: circle;
                  font-weight: bold;
                  color: orangered;
                }
                &.future {
                  list-style: circle;
                }
              }
            }
          }
          .wizardBody {
            display: grid;
            margin: 25px;
          }
          .wizardNavigation {
            text-align: right;
            button {
              margin: 0 2px;
            }
          }
          
          &.card_intro .wizardBody {
            h1, h2 {
              text-align: center;
            }
            > div {
              // margin: 25px;
              text-align: justify;

              .sans {
                font-family: "Comic Sans MS", "Comic Sans", cursive;
                font-weight: bold;
              }
              .tiny {
                font-size: 11px;
              }
              .hint {
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
              list-style-position: inside;
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
          }
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

