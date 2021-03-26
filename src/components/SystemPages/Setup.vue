<!-- TODO: This file could also be used as a preloader? Or the preloader could be somewhere else -->

<template>
<div class="setup">
  <div class="header">
    <TitleBar />
  </div>
  <div class="tabFrame">
    <div class="pageBody">
      <div class="card" v-if="!errorMode">
        <div class="cardContent card_intro">
          <div class="intro">
            <img class="logo" src="@/assets/collection_logo.png"><br>
            <p>Let me tell you a story about a webcomic called <em>Homestuck</em>. The fourth in a series of “MS Paint Adventures” authored by Andrew Hussie from 2006 to 2016, it became wildly successful, in part because of its eclectic use of web technology like Adobe Flash and GIF animations.</p><br>

            <p>However, with Flash finally being phased out at the end of 2020, <em>Homestuck</em> is in a precarious state. While there have been official attempts to preserve aspects of the original experience by VIZ Media (who have published <em>Homestuck</em> since 2018), the results have been mixed. With extra content scattered around the web in various states of decay, a solution was needed to preserve <em>Homestuck's</em> one-of-a-kind presentation and flair, for both returning readers and those new to the story.</p><br>

            <p>This self-contained collection contains <em>Homestuck</em> (with Flash elements fully intact), the other MS Paint Adventures, official <em>Homestuck</em> side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience. Hopefully, this collection should be the best way to read <em>Homestuck</em>, and preserve what made it so special.</p>
          </div>
          <hr />
          <div class="newReader">
            <h2>New Readers</h2><br>
            <p>Were you sent here by a friend? If so, welcome! I promise it's all as good as they’ve been telling you. If it wasn’t, I wouldn’t have wasted months of my life building this thing.</p><br>
            <p><em>The Unofficial Homestuck Collection</em> contains truckloads of bonus content, a significant amount of which recklessly brandishes major spoilers for the main story.</p><br>
            <p>For this reason, <em>The Unofficial Homestuck Collection</em> has a <strong>New Reader Mode.</strong> It will automatically track your progress in the story, and strategically lock off such content until your dear, sweet, precious eyes are ready to handle it. Furthermore, <strong>New Reader Mode</strong> will also adjust <em>Homestuck</em> itself in minor ways that keep it somewhat in line with the state of the comic as it was written.</p><br>
            <p>Whether you’re a totally new reader, or if you’ve already made some progress on the official website, it is <strong>heavily recommended you leave this setting enabled.</strong> <span class="tiny">(You can always switch it off later if it ends up being too much.)</span></p><br>
            <br>
            <div class="center">
              <label><input type="checkbox" v-model="newReaderToggle" />Enable New Reader Mode, starting from page </label><input type="text" :class="{invalid: !newReaderValidation}" v-model="newReaderPage" size="1" maxlength="4" :disabled="!newReaderToggle" /><br>
              <p class="hint" v-show="newReaderToggle">Enter a <em>Homestuck</em> page number between 1 and 8129.<br>e.g. www.homestuck.com/story/<strong>413</strong></p>
            </div>
          </div>
          <hr />
          <div class="getStarted">
            <h2>Getting Started</h2><br>
            <p><em>The Unofficial Homestuck Collection</em> comes in two parts:</p><br>
            <ol>
              <li>The application itself. (You’re running it now!)</li><br>
              <li>The asset pack, a 4gb folder you should have downloaded separately. This version of the application is tuned for <strong>v{{$data.$expectedAssetVersion}}</strong> of the asset pack.</li>
            </ol><br>
            <p>To gain access to the meat of this collection, you’ll have to tell it where to find the assets on your computer. Make sure you’ve unzipped the folder, then click the button below to bring it into the application. If everything checks out, the application will open up into collection proper!</p>
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
      </div>
      <div class="card" v-else>
        <div class="cardContent card_intro">
          <div class="getStarted">
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
import { parse } from 'querystring'
const { ipcRenderer } = require('electron')

export default {
  name: 'setup',
  components: {
    TitleBar
  },
  data: function() {
    return {
      errorMode: false,
      newReaderToggle: true,
      newReaderPage: "1",
      newReaderValidation: true,
      assetDir: undefined,
      invalidPages: ['2399', '3038', '3088', '6370', '7902', '7903', '7904']
    }
  },
  computed: {
    validatePage() {
      return this.newReaderValidation && this.assetDir
    },
  },
  methods:{
    locateAssets(){
      ipcRenderer.invoke('locate-assets', {restart: false}).then( result => {
        this.assetDir = result || this.assetDir
      })
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
      ipcRenderer.invoke('restart')
    }
  },
  mounted() {
    this.errorMode = !!this.$localData && !!this.$localData.assetDir
  },
  watch: {
    newReaderPage(to, from) {
      let parsedTo = parseInt(to)
      console.log(to, parsedTo)
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
          
          &.card_intro {
            h1, h2 {
              text-align: center;
            }
            > div {
              margin: 25px;
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

</style>

