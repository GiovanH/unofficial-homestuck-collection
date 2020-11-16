<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <div class="settings newReader">
        <h2>New Reader Mode</h2>
        <div class="newReaderInput" v-if="$isNewReader">
          <p>New reader mode enabled.<br>Currently up to page <strong>{{$mspaOrVizNumber(this.$localData.settings.newReader.current)}}</strong>.</p><br>
          <button @click="clearNewReader()">Switch off new reader mode</button>
        </div>
        <div class="newReaderInput" v-else>
          <input size="1" maxlength="6" :class="{invalid: !newReaderValidation, empty: !newReaderPage.length}" v-model="newReaderPage" @keydown.enter="setNewReader()"><br>
          <button :disabled="!newReaderValidation || newReaderPage.length < 1" @click="setNewReader()">Activate</button>
          <p class="hint" v-if="$localData.settings.mspaMode">Enter an <strong>MS Paint Adventures</strong> page number between 1901 and 10029.<br>e.g. www.mspaintadventures.com/?s=6&p=<strong>004130</strong></p>
          <p class="hint" v-else>Enter a <strong>Homestuck.com</strong> page number between 1 and 8129.<br>e.g. www.homestuck.com/story/<strong>413</strong></p>
        </div>
        <dl>
          <dt><label><input type="checkbox" name="notifications" v-model="$localData.settings['notifications']" @click="toggleSetting('notifications')">Show unlock notifications</label></dt>
          <dd class="settingDesc">Enables a notification that lets you know when you unlock new content elsewhere in the collection.</dd>
        </dl>
      </div>
      <div class="settings application">
        <h2>Application Settings</h2>
        <dl>
          <dt><label><input type="checkbox" name="showAddressBar" v-model="$localData.settings['showAddressBar']" @click="toggleSetting('showAddressBar')">Always show jump box</label></dt>
          <dd class="settingDesc">Embeds the jump box at the top of the window, just like a regular address bar. When this is disabled, you can access the jump box by clicking the JUMP button in the navigation banner, and with ctrl+L (or ⌘+L).</dd>

          <dt><label><input type="checkbox" name="switchToNewTabs" v-model="$localData.settings['switchToNewTabs']" @click="toggleSetting('switchToNewTabs')">Auto-switch to new tabs</label></dt>
          <dd class="settingDesc">Opening any link in a new tab will automatically switch you to that tab.</dd>

          <dt><label><input type="checkbox" name="forceScrollBar" v-model="$localData.settings['forceScrollBar']" @click="toggleSetting('forceScrollBar')">Always display scroll bar</label></dt>
          <dd class="settingDesc">Opening logs on Homestuck pages can cause the scrollbar to suddenly appear, resulting in the whole page shifting to the left. This setting keeps the scrollbar visible at all times to prevent this.</dd>
          
          <dt><label><input type="checkbox" name="smoothScrolling" v-model="$localData.settings['smoothScrolling']" @click="toggleSetting('smoothScrolling')">Enable smooth scrolling</label></dt>
          <dd class="settingDesc">Prevents the browser from smoothing out the movement when scrolling down a page. <strong>Requires application restart to take effect. Might not do anything on some platforms!</strong></dd>
          
          <dt><label><input type="checkbox" name="pixelScaling" v-model="$localData.settings['pixelScaling']" @click="toggleSetting('pixelScaling')">Pixelated image scaling</label></dt>
          <dd class="settingDesc">By default, images are scaled in a way that may make them appear blurry at higher resolutions. This setting enables nearest neighbour scaling on Homestuck and MSPA pages, allowing those images to keep their sharp edges. This effect may not look too hot on certain high DPI monitors.</dd>
          
          <dt><label><input type="checkbox" name="mspaMode" v-model="$localData.settings['mspaMode']" @click="toggleSetting('mspaMode')">Use MSPA page numbers</label></dt>
          <dd class="settingDesc">Instead of having individual sets of page numbers for each story, the original MS Paint Adventures website had one continuous page count that covered the beginning of Jailbreak all the way to the end of Homestuck.</dd>
          
          <dt><label><input type="checkbox" name="bandcampEmbed" v-model="$localData.settings['bandcampEmbed']" @click="toggleSetting('bandcampEmbed')">Enable online bandcamp player</label></dt>
          <dd class="settingDesc">Although the vast majority of this collection works offline, the music database allows you to use Bandcamp's online player to legally play tracks from the source. You can disable this if you don't want the collection connecting to the internet.</dd>

          <dt><label><input type="checkbox" name="devMode" v-model="$localData.settings['devMode']" @click="toggleSetting('devMode')">Enable Developer Mode</label></dt>
          <dd class="settingDesc">It's not all that exciting. It just adds an "Inspect Element" shortcut to the bottom of the context menu.</dd>
        </dl>
      </div>
      <div class="settings enhancements">
        <h2>Enhancements</h2>
        <dl>
          <dt>Theme Override</dt>
          <dd v-if="!$isNewReader">
            <select class="themeSelector" v-model="$localData.settings.themeOverride" @change="$localData.root.saveLocalStorage()">
              <option v-for="theme in themes" :value="theme.value">
                {{ theme.text }}
              </option>
            </select>
            <br><br>
            <label v-if="$localData.settings.themeOverride"><input type="checkbox" name="forceThemeOverride" v-model="$localData.settings['forceThemeOverride']" @click="toggleSetting('forceThemeOverride')"> Override page-specific theme changes</label>
          </dd>
          <dd v-else class="settingDesc">Finish Homestuck to unlock!</dd>

          <dt>Text Override</dt>
          <dd>
            <span class="settingDesc">Adjusts how the text looks on Homestuck pages, as well as the other MS Paint Adventures. A few pages will assume you're using the default look (14px Courier New Bold), so they might end up looking a little strange.
              <br>If you want to zoom the entire application, try ctrl -/+ (or ⌘ -/+)!</span><br>
            <div class="textOverrideSettings">
              <div class="knobs">
                <label>Font family:<br>
                  <select class="fontSelector" v-model="$localData.settings.textOverride.fontFamily" @change="$localData.root.saveLocalStorage()">
                    <option v-for="font in fonts" :value="font.value">
                      {{ font.text }}
                    </option>
                  </select>
                </label>
                <span v-if="$localData.settings.textOverride.fontFamily">
                  <br><br>
                  <label ><input type="checkbox" name="bold" v-model="$localData.settings.textOverride['bold']" @click="toggleSetting('bold', 'textOverride')"> Bold Font</label>
                </span>
                <br><br>
                <label>Font size:<input type="range" v-model="$localData.settings.textOverride.fontSize" min="0" max="6" step="1" list="fontSize"></label>
                <br><br>
                <label>Line height:<input type="range" v-model="$localData.settings.textOverride.lineHeight" min="0" max="6" step="1" list="lineHeight"></label>
              </div>
              <div class="textpreviews">
                <PageText class="examplePrattle" 
                content="A young man stands in his bedroom. It just so happens that today, the 13th of April, 2009, is this young man's birthday. Though it was thirteen years ago he was given life, it is only today he will be given a name!<br><br>What will the name of this young man be?"/>
                <PageText class="examplePrattle" 
                v-if="!this.$pageIsSpoiler('001926')"
                content="|PESTERLOG|<br />-- turntechGodhead <span style=&quot;color: #e00707&quot;>[TG]</span> began pestering ectoBiologist <span style=&quot;color: #0715cd&quot;>[EB]</span> at 16:13 --<br /><br /><span style=&quot;color: #e00707&quot;>TG: hey so what sort of insane loot did you rake in today</span><br /><span style=&quot;color: #0715cd&quot;>EB: i got a little monsters poster, it's so awesome. i'm going to watch it again today, the applejuice scene was so funny.</span>"/>
                <PageText class="examplePrattle" 
                v-if="$localData.settings['devMode'] && !this.$pageIsSpoiler('007378')"
                content="|AUTHORLOG|<br /><span style=&quot;color: #323232&quot;>HEY.</span><br /><span style=&quot;color: #323232&quot;>VOICE IN MY HEAD.</span><br /><span style=&quot;color: #000000&quot;>Yes?</span><br /><span style=&quot;color: #323232&quot;>SHUT UP.</span>"/>
              </div>
            </div>
          </dd>

          <dt><label><input type="checkbox" name="arrowNav" v-model="$localData.settings['arrowNav']" @click="toggleSetting('arrowNav')">Enable arrow key navigation</label></dt>
          <dd class="settingDesc">Allows you to navigate forward and backward between pages using the left and right arrow keys.</dd>

          <dt><label><input type="checkbox" name="openLogs" v-model="$localData.settings['openLogs']" @click="toggleSetting('openLogs')">Automatically open logs</label></dt>
          <dd class="settingDesc">Text logs begin open on each page, instead of requiring you to click them.</dd>
          
          <dt><label><input type="checkbox" name="hqAudio" v-model="$localData.settings['hqAudio']" @click="toggleSetting('hqAudio')">Enable high quality Flash audio</label></dt>
          <dd class="settingDesc">This setting replaces the original compressed audio in Homestuck's Flash animations with the high quality Bandcamp releases. This has a small chance of introducing performance issues, so try disabling it if you end up experiencing problems.</dd>
          
          <dt><label><input type="checkbox" name="jsFlashes" v-model="$localData.settings['jsFlashes']" @click="toggleSetting('jsFlashes')">Enable enhanced Flash effects</label></dt>
          <dd class="settingDesc">Some Flash animations have had certain effects enhanced using JavaScript. This has a small chance of introducing performance issues, so try disabling it if you end up experiencing problems.</dd>

          <dt><label><input type="checkbox" name="credits" v-model="$localData.settings['credits']" @click="toggleSetting('credits')">Show inline audio credits</label></dt>
          <dd class="settingDesc">Inserts audio credits below pages that use music. It shows you the name of the song, the artists involved, and has a link to the track's page in the music database.</dd>
          
          <dt v-if="this.$archive.mspa.footnotes"><label><input type="checkbox" name="footnotes" v-model="$localData.settings['openLogs']" @click="toggleSetting('footnotes')">Display footnotes</label></dt>
          <dd v-if="this.$archive.mspa.footnotes" class="settingDesc">Display footnotes beneath MSPA pages.</dd>
        </dl>
      </div>
      <div class="settings retcons" v-if="!$isNewReader">
        <h2>Retcons</h2>
        <dl>
          <dt><label><input type="checkbox" name="retcon1" v-model="$localData.settings['retcon1']" @click="toggleSetting('retcon1')">#1 - John's arms</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('007999')}}.</dd>

          <dt><label><input type="checkbox" name="retcon2" v-model="$localData.settings['retcon2']" @click="toggleSetting('retcon2')">#2 - John's first Zap-quest</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('008053')}}.</dd>
          
          <dt><label><input type="checkbox" name="retcon3" v-model="$localData.settings['retcon3']" @click="toggleSetting('retcon3')">#3 - John interrupting Dave and Jade</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('008317')}}.</dd>
          
          <dt><label><input type="checkbox" name="retcon4" v-model="$localData.settings['retcon4']" @click="toggleSetting('retcon4')">#4 - The oil patches</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('008991')}}. <a href="/oilretcon">/oilretcon</a></dd>
          
          <dt><label><input type="checkbox" name="retcon5" v-model="$localData.settings['retcon5']" @click="toggleSetting('retcon5')">#5 - John's second Zap-quest</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('009026')}}.</dd>
          
          <dt><label><input type="checkbox" name="retcon6" v-model="$localData.settings['retcon6']" @click="toggleSetting('retcon6')">#6 - Terezi's password pages</label></dt>
          <dd class="settingDesc">Originally enabled on page {{$mspaOrVizNumber('009057')}}.</dd>
        </dl>
      </div>
      <div class="settings controversial" v-if="!$isNewReader">
        <h2>Controversial Content</h2>

        <dt><label><input type="checkbox" name="enableControversial" v-model="$localData.settings['enableControversial']" @click="toggleSetting('enableControversial')">Enable controversial content</label></dt>
        <dd class="settingDesc">The Unofficial Homestuck Collection allows you to restore content that was removed for various reasons. The inclusion of this content is in no way an endorsement of its quality, and it absolutely should not be used to judge the original authors of the work.</dd>

        <dl v-if="$localData.settings.enableControversial">
          <dt><label><input type="checkbox" name="bolin" v-model="$localData.settings['bolin']" @click="toggleSetting('bolin')">Homestuck - Bill Bolin music</label></dt>
          <dd class="settingDesc">A decent number of Flash animations in the first year of Homestuck had music provided by <a href="/music/artist/bill-bolin" target="_blank">Bill Bolin</a>. After he left the team on less-than-favourable circumstances, the flashes he worked on were rescored.</dd>

          <dt><label><input type="checkbox" name="unpeachy" v-model="$localData.settings['unpeachy']" @click="toggleSetting('unpeachy')">Homestuck - CAUCASIAN!</label></dt>
          <dd class="settingDesc">During the trickster segment of Act 6 Act 5, <a href="/mspa/007623" target="_blank">there was originally a joke regarding the skin-colour of the Trickster kids</a>. This was received poorly by the fanbase, <a href="/tumblr/more-so-i-just-dialed-down-the-joke-on-page" target="_blank">and toned down shortly after.</a></dd>
          
          <dt><label><input type="checkbox" name="pxsTavros" v-model="$localData.settings['pxsTavros']" @click="toggleSetting('pxsTavros')">Paradox Space - Tavros Banana</label></dt>
          <dd class="settingDesc">During the original run of Paradox Space's Summerteen Romance story, <a href="/pxs/summerteen-romance/31" target="_blank">one page had a somewhat heavy focus on body horror</a>. The original version was completely unobscured, but it was hastily censored.</a></dd>
          
          <dt><label><input type="checkbox" name="cursedHistory" v-model="$localData.settings['cursedHistory']" @click="toggleSetting('cursedHistory')">Skaianet Systems - CURSED_HISTORY</label></dt>
          <dd class="settingDesc">At the beginning of 2019, <a href="/skaianet" target="_blank">the Skaianet Systems website launched</a>, with some of Hussie's old worldbuilding notes peppered through the source code. Many people found the the notes to be in extremely poor taste, and they were swiftly removed.</dd>
        </dl>
      </div>
      <div class="settings system">
        <h2>System Settings</h2>
        <div class="system">
          <span class="hint">Application version:</span> <strong>v{{$data.$appVersion}}</strong>
          <br><br>
          <span v-if="$archive.version != $data.$expectedAssetVersion">
            <span class="hint">Expected asset pack version:</span> <strong>v{{$data.$expectedAssetVersion}}</strong>
            <br><br>
          </span>
          <span class="hint">Asset pack version:</span> <strong>v{{$archive.version}}</strong>
          <br><br>
          <span class="hint">Asset pack directory:</span>
          <br>
          <strong>{{$localData.assetDir || 'None selected'}}</strong>
          <br><br>
          <button @click="locateAssets()">Relocate assets</button>
          <br><br>
          <button @click="factoryReset()">Factory reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageText from '@/components/Page/PageText.vue'
const { ipcRenderer } = require('electron')

export default {
  name: 'settings',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageText
  },
  data: function() {
    return {
      themes: [
        {text: "Auto", value: ""},
        {text: "MSPA", value: "default"},
        {text: "Retro", value: "retro"},
        {text: "Scratch", value: "scratch"},
        {text: "SBaHJ", value: "sbahj"},
        {text: "Cascade", value: "cascade"},
        {text: "Trickster Mode", value: "trickster"},
        {text: "Homosuck", value: "A6A6"},
        {text: "Collide", value: "collide"},
        {text: "Team Special Olympics", value: "tso"},
        {text: "Paradox Space", value: "pxs"},
      ],
      fonts: [
        {text: "Default", value: ""},
        {text: "Courier Prime", value: "courierPrime"},
        {text: "Verdana / Arial", value: "verdana"},
        {text: "Times New Roman", value: "times"},
        {text: "Comic Sans", value: "comicSans"},
        {text: "OpenDyslexic", value: "openDyslexic"},
      ],
      newReaderPage: '',
      newReaderValidation: true
    }
  },
  computed: {
  },
  methods:{
    validateNewReader() {
      if (this.$localData.settings.mspaMode) {
        let pageId = (this.newReaderPage.padStart(6, '0') in this.$archive.mspa.story) ? this.newReaderPage.padStart(6, '0') : this.newReaderPage
        this.newReaderValidation = pageId in this.$archive.mspa.story && pageId >= '001901' && pageId <= '010029' && !/\D/.test(pageId)
      }
      else {
        this.newReaderValidation = !!this.$vizToMspa('homestuck', this.newReaderPage).p && !/\D/.test(this.newReaderPage) && parseInt(this.newReaderPage) >= 1 && parseInt(this.newReaderPage) <= 8129
      }
    },
    setNewReader() {
      this.validateNewReader() 
      let pageId = this.$localData.settings.mspaMode ? (this.newReaderPage.padStart(6, '0') in this.$archive.mspa.story) ? this.newReaderPage.padStart(6, '0') : this.newReaderPage : this.$vizToMspa('homestuck', this.newReaderPage).p
      if (this.newReaderValidation) {

        this.$localData.settings.themeOverride = ""
        this.$localData.settings['enableControversial'] = false
        this.$localData.settings['bolin'] = false
        this.$localData.settings['unpeachy'] = false
        this.$localData.settings['pxsTavros'] = false
        this.$localData.settings['cursedHistory'] = false

        this.$updateNewReader(pageId, true)
      }
    },
    clearNewReader() {
      ipcRenderer.invoke('disable-new-reader').then( answer => {
        if (answer == 0) {
          this.newReaderPage = this.$mspaOrVizNumber(this.$localData.settings.newReader.current)
          this.$localData.root.NEW_READER_CLEAR()
        }
      })
    },
    toggleSetting(setting, parentObject){
      if (!(setting in this.$localData.settings) || (parentObject in this.$localData.settings && !(setting in this.$localData.settings[parentObject]))) this.$set(this.$localData.settings, setting, true)
      else if (parentObject && setting in this.$localData.settings[parentObject]) this.$localData.settings[parentObject][setting] = !this.$localData.settings[parentObject][setting]
      else this.$localData.settings[setting] = !this.$localData.settings[setting]

      if (setting == 'enableControversial' && !this.$localData.settings[setting]) {
        this.$localData.settings['bolin'] = false
        this.$localData.settings['unpeachy'] = false
        this.$localData.settings['pxsTavros'] = false
        this.$localData.settings['cursedHistory'] = false
      }

      if (setting == 'notifications' && this.$localData.settings[setting]) {
        this.$popNotif('notif_enabled')
      }

      this.$localData.root.saveLocalStorage()
    },
    locateAssets(){
      ipcRenderer.invoke('locate-assets', {restart: true})
    },
    factoryReset(){
      ipcRenderer.invoke('factory-reset')
    }
  },
  watch: {
    newReaderPage() {
      this.validateNewReader()
    },
    '$localData.settings.mspaMode'() {
      this.validateNewReader()
    }
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    background: url(assets://archive/collection/homebg_right.png) repeat-y, url(assets://archive/collection/homebg_left.png) repeat-y;
    background-position: left top, right top;
    background-color: #35bfff;
    background-attachment: fixed;
    
    a {
      color: var(--page-links);
    }

    .navBanner {
      margin-bottom: 25px;
    }
    .card {
      position: relative;
      margin-bottom: 75px;
      padding: 0 50px;
      border: solid 5px var(--page-pageBorder, var(--page-pageFrame));
      box-sizing: border-box;
      width: 950px;
      background: var(--page-pageContent);

      flex: 0 1 auto;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      align-content: center;

      font-family: Verdana,Arial,Helvetica,sans-serif;
      
      .settings {
        width: 100%;
        padding: 25px 0;

        &:not(:last-child) {
          border-bottom: solid 2px var(--page-pageBorder, var(--page-pageFrame));
        }
        h2 {
          text-align: center;
        }
        p {
          font-weight: normal;
          margin: 10px 0 5px 10px;
          label {
            font-weight: bolder;
          }
        }
        dt {
          margin: 20px 0 5px 10px;
        }
        .settingDesc {
          color: var(--page-nav-meta);
          font-weight: normal;
        }
        
        .system {
          margin-top: 20px;
          text-align: center;
          font-weight: normal;
        }

        .newReaderInput {
          margin-top: 20px;
          text-align: center;

          input {
            border: 1px solid #777;
            min-width: 70px;
            font-size: 110%;
            border-radius: 2px;
            padding: 2px 3px;
            margin: 5px;

            &.invalid:not(:disabled):not(.empty) {
              background: pink;
              border-color: rgb(187, 0, 37);
              box-shadow: 0 0 3px 1px red;
            }
          }
        }
        button {
          font-size: 110%;
        }
        .hint {
          font-size: 13px;
          color: var(--page-nav-meta);
        }
        .themeSelector, .fontSelector {
          font-size: 16px;
        }
        .textOverrideSettings {
          margin-top: 16px;
          text-align: center;

          .textpreviews {
            border: 6px solid var(--page-pageFrame);
            padding: 6px;
            position: relative;
            left: 0;
          }

          .knobs {
            width: 75%;
            margin: 0 auto 16px;
            text-align: left;
            select {
              margin: 5px 0;
            }
            input[type="range"] {
              width: 100%;
            }
          }
          div.examplePrattle, p.examplePrattle {
            margin-bottom: 16px;
          }
          .examplePrattle {
            margin: 0 auto;

            ::v-deep .text{
              // text-align: center;
            }
            &.bold {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>

