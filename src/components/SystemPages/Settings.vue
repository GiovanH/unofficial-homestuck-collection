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
          <dt><label><input type="checkbox" name="switchToNewTabs" v-model="$localData.settings['switchToNewTabs']" @click="toggleSetting('switchToNewTabs')">Auto-switch to new tabs</label></dt>
          <dd class="settingDesc">Opening any link in a new tab will automatically switch you to that tab.</dd>

          <dt><label><input type="checkbox" name="forceScrollBar" v-model="$localData.settings['forceScrollBar']" @click="toggleSetting('forceScrollBar')">Always display scroll bar</label></dt>
          <dd class="settingDesc">Opening logs on Homestuck pages can cause the scrollbar to suddenly appear, resulting in the whole page shifting to the left. This setting keeps the scrollbar visible at all times to prevent this.</dd>

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
          <dd class="settingDesc" v-if="!$isNewReader">
            <select class="themeSelector" v-model="$localData.settings.themeOverride" @change="$localData.root.saveLocalStorage()">
              <option v-for="theme in themes" :value="theme.value">
                {{ theme.text }}
              </option>
            </select>
          </dd>
          <dd v-else class="settingDesc">Finish Homestuck to unlock!</dd>

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

          <dt><label><input type="checkbox" name="newsposts" v-model="$localData.settings['newsposts']" @click="toggleSetting('newsposts')">Show news posts below each page</label></dt>
          <dd class="settingDesc">Shows the news posts that were present below each page when the page was originally posted on mspaintadventures.com. Also displays links to the contemporary latest posts on Andrew Hussie's public fan-focused social media.</dd>

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
          <dd class="settingDesc">During the original run of Paradox Space's Summerteen Romance story, <a href="/pxs/summerteen-romance/31" target="_blank">one page had a somewhat heavy focus on body horror</a>. The original version was completely unobscured, but it was hastily censored.</dd>
          
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
import PageFooter from '@/components/Page/PageFooter.vue'
const { ipcRenderer } = require('electron')

export default {
  name: 'settings',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, PageFooter
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
    toggleSetting(setting){
      if (!(setting in this.$localData.settings)) this.$set(this.$localData.settings, setting, true)
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

    background: url(css://archive/collection/homebg_right.png) repeat-y, url(css://archive/collection/homebg_left.png) repeat-y;
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
        dd {
          &.settingDesc {
            color: var(--page-nav-meta);
            font-weight: normal;
          }
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
        .themeSelector {
          font-size: 16px;
        }
      }
    }
  }
</style>

