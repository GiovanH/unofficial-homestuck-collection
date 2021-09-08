<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <div class="settings newReader">
        <h2>New Reader Mode</h2>
        <div class="newReaderInput" v-if="$isNewReader">
          <p>New reader mode enabled.<br>Currently up to page 
            <!-- <strong>{{$mspaOrVizNumber(this.$localData.settings.newReader.current)}}</strong>. -->
          <input type="number" size="1" maxlength="6" :class="{invalid: !newReaderValidation, empty: !newReaderPage.length, changed: newReaderPage != $localData.settings.newReader.current}" v-model="newReaderPage">
          </p><br>
          <button v-if="newReaderValidation && (newReaderPage != $localData.settings.newReader.current)" @click="changeNewReader()">Set adjusted page</button>
          <br />
          <button @click="clearNewReader()">Switch off new reader mode</button>
        </div>
        <div class="newReaderInput" v-else>
          <input type="number" size="1" maxlength="6" :class="{invalid: !newReaderValidation, empty: !newReaderPage.length}" v-model="newReaderPage" @keydown.enter="setNewReader()"><br>
          <button :disabled="!newReaderValidation || newReaderPage.length < 1" @click="setNewReader()">Activate</button>
          <p class="hint" v-if="$localData.settings.mspaMode">Enter an <strong>MS Paint Adventures</strong> page number<br>e.g. www.mspaintadventures.com/?s=6&p=<strong>004130</strong><br>Homestuck starts at 001901 and ends at 100029. Problem Sleuth starts at 000219.</p>
          <p class="hint" v-else>Enter a <strong>Homestuck.com</strong> page number between 1 and 8129.<br>e.g. www.homestuck.com/story/<strong>413</strong></p>
        </div>

        <h3>Reading Experience</h3>
        <dl class="fastForwardSelection">
          <dt>
            <input type="radio" id="fast_forward=false" :value="false" v-model="$localData.settings['fastForward']" @click="toggleSetting('fastForward')"/>
            <label for="fast_forward=false">Replay</label>
          </dt>
          <dd>Read as if you were reading it live.<br>Stories will be presented approximately as they were at the time of publication (your most recent page).</dd>

          <dt>
            <input type="radio" id="fast_forward=true" :value="true" v-model="$localData.settings['fastForward']" @click="toggleSetting('fastForward')"/>
            <label for="fast_forward=true">Archival</label>
          </dt>
          <dd>Read as an archival reader.<br>Stories will be presented approximately as they were at the time they were finished (or abandoned).</dd>
        </dl>

        <dl>
          <dt><label><input type="checkbox" name="notifications" v-model="$localData.settings['notifications']" @click="toggleSetting('notifications')">Show unlock notifications</label></dt>
          <dd class="settingDesc">Enables a notification that lets you know when you unlock new content elsewhere in the collection.</dd>
        </dl>
      </div>
      <div class="settings application">
        <h2>Application Settings</h2>
        <dl>
          <template v-for="boolSetting in settingListBoolean">
            <dt :key="boolSetting.model"><label>
              <input type="checkbox" 
                :name="boolSetting.model" 
                v-model="$localData.settings[boolSetting.model]" 
                @click="toggleSetting(boolSetting.model)"
              >{{boolSetting.label}}</label></dt> 
              <!-- the spacing here is made of glass -->
            <dd class="settingDesc" v-html="boolSetting.desc"></dd>
          </template>
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
            <template v-if="$localData.settings.themeOverride != 'default'">
              <dt><label><input type="checkbox" name="forceThemeOverride" v-model="$localData.settings['forceThemeOverride']" @click="toggleSetting('forceThemeOverride')"> Override page-specific theme changes</label></dt>
            </template>
          </dd>
          <dd v-else class="settingDesc">Finish Homestuck to unlock!</dd>

          <template v-if="!$isNewReader">
            <dt>UI Theme Override</dt>
            <dd >
              <select class="themeSelector" v-model="$localData.settings.themeOverrideUI" @change="$localData.root.saveLocalStorage()">
                <option v-for="theme in themes" :value="theme.value">
                  {{ theme.text }}
                </option>
              </select>
              <template v-if="$localData.settings.themeOverrideUI != 'default'">
                <dt><label><input type="checkbox" name="forceThemeOverrideUI" v-model="$localData.settings.forceThemeOverrideUI" @click="$localData.root.saveLocalStorage()"> Override page-specific theme changes</label></dt>
              </template>
            </dd>
          </template>
          <dt v-else>
            <label>
              <input type="checkbox" name="forceThemeOverrideUIMSPA"
              :checked.prop="forceThemeOverrideUIMSPAChecked === true"
              :indeterminate.prop="forceThemeOverrideUIMSPAChecked === undefined"
              @click="forceThemeOverrideUIMSPA()"> Never style UI
            </label>
          </dt>


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
                content="|PESTERLOG|<br />-- turntechGodhead <span style=&quot;color: #e00707&quot;>[TG]</span> began pestering ectoBiologist <span style=&quot;color: #0715cd&quot;>[EB]</span> at 16:13 --<br /><br /><span style=&quot;color: #e00707&quot;>TG: hey so what sort of insane loot did you rake in today</span><br /><span style=&quot;color: #0715cd&quot;>EB: i got a little monsters poster, it's so awesome. i'm going to watch it again today, the applejuice scene was so funny.</span>"/>
                <!-- v-if="!this.$pageIsSpoiler('001926')" -->
                <PageText class="examplePrattle" 
                v-if="$localData.settings['devMode'] && !this.$pageIsSpoiler('007378')"
                content="|AUTHORLOG|<br /><span style=&quot;color: #323232&quot;>HEY.</span><br /><span style=&quot;color: #323232&quot;>VOICE IN MY HEAD.</span><br /><span style=&quot;color: #000000&quot;>Yes?</span><br /><span style=&quot;color: #323232&quot;>SHUT UP.</span>"/>
              </div>
            </div>
          </dd>
          
          <template v-for="boolSetting in enhancementListBoolean">
            <dt :key="boolSetting.model"><label>
              <input type="checkbox" 
                :name="boolSetting.model" 
                v-model="$localData.settings[boolSetting.model]" 
                @click="toggleSetting(boolSetting.model)"
              >{{boolSetting.label}}</label></dt> 
              <!-- the spacing here is made of glass still -->
            <dd class="settingDesc" v-html="boolSetting.desc"></dd>
          </template>

        </dl>
      </div>
      <div class="settings retcons" v-if="!$isNewReader">
        <h2>Retcons</h2>
        <dd class="settingDesc">Normally, retcons unlock as you read through the comic naturally. You can use these settings to manually enable or disable them individually.</dd>
        <dl>
          <template v-for="retcon in retconList">
            <dt :key="retcon.model"><label>
              <input type="checkbox" 
                :name="retcon.model" 
                v-model="$localData.settings[retcon.model]" 
                @click="toggleSetting(retcon.model)"
              >{{retcon.label}}</label></dt>
            <dd class="settingDesc">
              Originally enabled on page <StoryPageLink :mspaId='retcon.origPage'></StoryPageLink>.
            </dd>
          </template>

        </dl>
      </div>
      <div class="settings controversial" > <!-- TODO v-if="$isNewReader"> -->
        <h2>Controversial Content</h2>
        <p class="settingDesc">The Unofficial Homestuck Collection allows you to restore some material that was included in the original publication, but was since officially replaced by MSPA for various reasons. These options allow you to view those pages before they were edited. The inclusion of this content is in no way an endorsement of its quality.</p>

        <div v-if="$isNewReader">
          
          <!-- All this with the indeterminate properties is so the button renders unambigiously if the setting is changed with a mod, or by accident. -->
          <dt><label><input type="checkbox" name="enableControversial"
              @click="toggleAllControversial()"
              :checked.prop="controversialAll && !!controversialAny"
              :indeterminate.prop="controversialAny && !controversialAll"
            >Enable controversial content</label></dt>
          <p class="settingDesc">
          New Reader mode is currently enabled, so if checked, this option restores <em>all</em> this material without including spoilers or content warnings. More granular settings are available when New Reader mode is disabled, so you may wish to finish Homestuck before you come back and view this content selectively.</p>

        </div>

        <p class="settingDesc">
        These changes only affected a few pages and some side content. The page numbers are listed here, without spoilers, and the side content is only shown if it is unlocked.</p>
          
        <SpoilerBox kind="Affected Page Numbers" class="ccPageNos">
          <div class="left col">
            <h3>Homestuck</h3>
            <!-- bolin -->
            <ol>
            <li><StoryPageLink long mspaId='002238'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002544'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002551'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002722'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002730'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002733'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002880'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002926'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='002970'></StoryPageLink></li>
            <li><StoryPageLink long mspaId='003620'></StoryPageLink></li>
            <!-- peachy -->
            <li><StoryPageLink long mspaId='007623'></StoryPageLink></li>
            </ol>
          </div>
          <div class="right col">
            <h3>Side content</h3>
            <ol>
            <li v-if="!$pageIsSpoiler('008753')"><a href="/pxs/summerteen-romance/31">Paradox Space - Summerteen Romance page 31</a></li>
            <li v-else>Not yet unlocked (Jan 2019)</li>
            <li v-if="!$isNewReader"><a href="/skaianet">Skaianet Systems</a></li>
            <li v-else>Not yet unlocked (Apr 2014)</li>
            </ol>
          </div>
          <!-- TODO -->
        </SpoilerBox>

        <div v-if="!$isNewReader">
          <dd class="settingDesc">
          Under this box, you can see the specific changes that were made and enable and disable them to taste.</dd>

          <SpoilerBox kind="Controversial Content">

            <template v-for="cc in controversialList">
              <dt><label>
                <input type="checkbox" 
                  :name="cc.model" 
                  v-model="$localData.settings[cc.model]" 
                  @click="toggleSetting(cc.model)"
                  
                >{{cc.label}}</label>
                <span class="cw minor" v-for="cw in cc.cws.minor" :key="cw" v-text="cw"></span>
                <span class="cw severe" v-for="cw in cc.cws.severe" :key="cw" v-text="cw"></span>
              </dt>
              <dd class="settingDesc" v-html="cc.desc"></dd>
            </template>

          </SpoilerBox>
        </div>
      </div>

      <div class="settings mod">
        <h2>Mod Settings</h2>

        <p class="settingDesc">Mods, patches, and localization. See more [here]. Drag mods from the pool on the left to the list on the right to enable them. In the case of conflicts, higher mods take priority.</p>

        <button v-if="$localData.settings.devMode" @click="reloadModList">Dev: Reload Choices</button> 
        <section class="group sortable row">
          <div class='col' title="Drag and drop!"><h2>Inactive</h2>
            <draggable tag="ul" group="sortable-mods">
              <li
                v-for="option in modsDisabled"
                :key="option.key"
                :data-value="option.key"
              >
                <b>{{option.label}}</b> - {{option.summary}}
                <label class="modButton"
                  v-if="option.hasmeta"
                  @click="openSubModel(option, 'INFO_ONLY')"
                  v-text="'ℹ'"
                />
              </li>
            </draggable>
          </div>

          <div class='col' title="Drag and drop!"><h2>Active</h2>
            <draggable tag="ol" group="sortable-mods" @sort="onUpdateSortable" data-setting="modListEnabled">
              <li
                v-for="option in modsEnabled"
                :key="option.key"
                :data-value="option.key"
              >
                <b>{{option.label}}</b> - {{option.summary}}
                <!-- n.b. hasmeta should always be true if settings exists -->
                <label class="modButton"
                  v-if="option.hasmeta || option.settingsmodel"
                  @click="openSubModel(option)"
                  v-text="option.settingsmodel ? '⚙' : 'ℹ'"
                />
              </li>
            </draggable>
          </div>
        </section>

        <!-- TODO: We need a visual indicator of the debounce here. I'm thinking a spinner that then becomes a checkmark? -->

        <div class="system">
          <p v-if="needReload">Some of your changes require a quick reload before they can take effect. When you're ready, click here:</p>
          <!-- v-if="$localData.settings.devMode || needReload"  -->
          <button @click="forceReload">Reload</button>
        </div>
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
    <SubSettingsModal ref="modal" />
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import PageText from '@/components/Page/PageText.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'
import StoryPageLink from '@/components/UIElements/StoryPageLink.vue'
import SubSettingsModal from '@/components/UIElements/SubSettingsModal.vue'
import draggable from "vuedraggable"

const { ipcRenderer } = require('electron')

export default {
  name: 'settings',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, SubSettingsModal, 
    PageText, SpoilerBox, StoryPageLink, 
    draggable
  },
  data: function() {
    return {
      settingListBoolean: [
        {
          model: "showAddressBar",
          label: "Always show jump box",
          desc: "Embeds the jump box at the top of the window, just like a regular address bar. When this is disabled, you can access the jump box by clicking the JUMP button in the navigation banner, and with ctrl+L (or ⌘+L)."
        }, {
          model: "mspaMode",
          label: "Use MSPA page numbers",
          desc: "Instead of having individual sets of page numbers for each story, the original MS Paint Adventures website had one continuous page count that covered the beginning of Jailbreak all the way to the end of Homestuck."
        }, {
          model: "switchToNewTabs",
          label: "Auto-switch to new tabs",
          desc: "Opening any link in a new tab will automatically switch you to that tab."
        }, {
          model: "forceScrollBar",
          label: "Always display scroll bar",
          desc: "Opening logs on Homestuck pages can cause the scrollbar to suddenly appear, resulting in the whole page shifting to the left. This setting keeps the scrollbar visible at all times to prevent this."
        }, {
          model: "smoothScrolling",
          label: "Enable smooth scrolling",
          desc: "Prevents the browser from smoothing out the movement when scrolling down a page. <strong>Requires application restart to take effect. Might not do anything on some platforms!</strong>"
        }, {
          model: "pixelScaling",
          label: "Pixelated image scaling",
          desc: "By default, images are scaled in a way that may make them appear blurry at higher resolutions. This setting enables nearest neighbour scaling on Homestuck and MSPA pages, allowing those images to keep their sharp edges. This effect may not look too hot on certain high DPI monitors."
        }, {
          model: "urlTooltip",
          label: "Show URL Tooltip",
          desc: "Adds a tooltip in the bottom-left corner of the window that shows you the destination of links when you hover over them, like browsers do. Test it: <a href='/newreader'>New reader</a>"
        }, {
          model: "devMode",
          label: "Enable Developer Mode",
          desc: "It's not all that exciting. It just adds an \"Inspect Element\" shortcut to the bottom of the context menu, and shows a little more log data for mod/style developers, or troubleshooting issues. This may slightly degrade performance."
        }
      ],
      enhancementListBoolean: [
        {
          model: "arrowNav",
          label: "Enable arrow key navigation",
          desc: "Allows you to navigate forward and backward between pages using the left and right arrow keys."
        }, {
          model: "openLogs",
          label: "Automatically open logs",
          desc: "Text logs begin open on each page, instead of requiring you to click them."
        }, {
          model: "hqAudio",
          label: "Enable high quality Flash audio",
          desc: "This setting replaces the original compressed audio in Homestuck's Flash animations with the high quality Bandcamp releases. This has a small chance of introducing performance issues, so try disabling it if you end up experiencing problems."
        }, {
          model: "jsFlashes",
          label: "Enable enhanced Flash effects",
          desc: "Some Flash animations have had certain effects enhanced using JavaScript. This has a small chance of introducing performance issues, so try disabling it if you end up experiencing problems. <strong>Highly recommended.</strong>"
        }, {
          model: "credits",
          label: "Show inline audio credits",
          desc: "Inserts audio credits below pages that use music. It shows you the name of the song, the artists involved, and has a link to the track's page in the music database."
        }, {
          model: "bandcampEmbed",
          label: "Enable online bandcamp player",
          desc: "Although the vast majority of this collection works offline, the music database allows you to use Bandcamp's online player to legally play tracks from the source. You can disable this if you don't want the collection connecting to the internet."
        }
      ],
      retconList: [
        {
          model: "retcon1",
          label: "John's arms",
          origPage: "007999"
        }, {
          model: "retcon2",
          label: "John's first Zap-quest",
          origPage: "008053"
        }, {
          model: "retcon3",
          label: "John interrupting Dave and Jade",
          origPage: "008317"
        }, {
          model: "retcon4",
          label: "The oil patches",
          origPage: "008991"
        }, {
          model: "retcon5",
          label: "John's second Zap-quest",
          origPage: "009026"
        }, {
          model: "retcon6",
          label: "Terezi's password pages",
          origPage: "009057"
        }
      ],
      controversialList: [
        {
          model: "bolin",
          cws: {
            minor: ["ip"], severe: []
          },
          label: "Homestuck - Bill Bolin music",
          desc: "A decent number of Flash animations in the first year of Homestuck had music provided by <a href=\"/music/artist/bill-bolin\" target=\"_blank\">Bill Bolin</a>. When he left the team on less-than-favourable circumstances, he requested his music be removed from the comic, and the flashes he worked on were rescored."
        }, {
          model: "unpeachy",
          cws: {
            minor: [], severe: ["race"]
          },
          label: "Homestuck - CAUCASIAN!",
          desc: `During the trickster segment of Act 6 Act 5, <a href="/mspa/007623" target="_blank">there was originally a joke regarding the skin colour of the Trickster kids</a>. This was received poorly by the fanbase, <a href="/tumblr/more-so-i-just-dialed-down-the-joke-on-page" target="_blank">and toned down shortly after.</a>`
        }, {
          model: "pxsTavros",
          cws: {
            minor: [], severe: ["body horror"]
          },
          label: "Paradox Space - Tavros Banana",
          desc: `During the original run of Paradox Space's Summerteen Romance story, <a href="/pxs/summerteen-romance/31" target="_blank">one page included a scene with graphic body horror</a>. The original version was completely unobscured, but it was later censored with additional dialogue.`
        }, {
          model: "cursedHistory",
          cws: {
            minor: [], severe: ["holocaust"]
          },
          label: "Skaianet Systems - CURSED_HISTORY",
          desc: `At the beginning of 2019, <a href="/skaianet" target="_blank">the Skaianet Systems website launched</a>, with some of Hussie's old worldbuilding notes peppered through the source code. Many people found the the notes to be in extremely poor taste, and they were swiftly removed.`
        }
      ],
      themes: [
        {text: "Auto", value: "default"},
        {text: "MSPA", value: "mspa"},
        {text: "Retro", value: "retro"},
        {text: "Scratch", value: "scratch"},
        {text: "SBaHJ", value: "sbahj"},
        {text: "Cascade", value: "cascade"},
        {text: "Trickster Mode", value: "trickster"},
        {text: "Homosuck", value: "A6A6"},
        {text: "Collide", value: "collide"},
        {text: "Team Special Olympics", value: "tso"},
        {text: "Paradox Space", value: "pxs"}
      ],
      fonts: [
        {text: "Default", value: ""},
        {text: "Courier Prime", value: "courierPrime"},
        {text: "Verdana / Arial", value: "verdana"},
        {text: "Times New Roman", value: "times"},
        {text: "Comic Sans", value: "comicSans"},
        {text: "OpenDyslexic", value: "openDyslexic"}
      ],
      newReaderPage: this.$localData.settings.newReader.current || 
        (this.$localData.settings.mspaMode ? '001901' : '1'),
      newReaderValidation: true,
      allControversial: [
        'bolin',
        'unpeachy',
        'pxsTavros',
        'cursedHistory'
      ],
      debounce: false,
      needReload: false
    }
  },
  computed: {
    controversialAll(){
      const values = this.allControversial.map(key => this.$localData.settings[key])
      return values.every(Boolean)
    },
    controversialAny(){
      const values = this.allControversial.map(key => this.$localData.settings[key])
      return values.some(Boolean)
    },
    modsEnabled() {
      return this.$localData.settings.modListEnabled.map((key) => 
        this.$modChoices[key])
    },
    modsDisabled() {
      return Object.values(this.$modChoices).filter((choice) => 
        !this.modsEnabled.includes(choice))
    },
    forceThemeOverrideUIMSPAChecked(){
      if (this.$localData.settings.themeOverrideUI == "default" && this.$localData.settings.forceThemeOverrideUI == true) {
        return true
      } else if (this.$localData.settings.themeOverrideUI == "" && this.$localData.settings.forceThemeOverrideUI == false) {
        return false
      } else {
        return undefined
      }
    }
  },
  methods: {
    validateNewReader() {
      const pageId = this.$parseMspaOrViz(this.newReaderPage)
      this.newReaderValidation = pageId in this.$archive.mspa.story && pageId >= '000219' && pageId <= '010029' && !/\D/.test(pageId)
    },
    changeNewReader(){
      this.validateNewReader() 
      const pageId = this.$parseMspaOrViz(this.newReaderPage)
      if (this.newReaderValidation) {
        const args = {
          title: "Are you sure?",
          message: 'Be careful! If you change your current page manually, you might encounter spoilers. Are you sure you want to change this setting?'
        }
        ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
          if (answer === true)
            this.$updateNewReader(pageId, true)
          else
            this.newReaderPage = this.$localData.settings.newReader.current
        })
      }
    },
    setNewReader() {
      this.validateNewReader() 
      const pageId = this.$localData.settings.mspaMode ? (this.newReaderPage.padStart(6, '0') in this.$archive.mspa.story) ? this.newReaderPage.padStart(6, '0') : this.newReaderPage : this.$vizToMspa('homestuck', this.newReaderPage).p
      if (this.newReaderValidation) {
        this.$localData.settings.themeOverride = ""
        // eslint-disable-next-line no-return-assign
        this.allControversial.forEach(key => this.$localData.settings[key] = false)

        this.$updateNewReader(pageId, true)
      }
    },
    clearNewReader() {
      const args = {
        title: "Are you sure?",
        message: 'Watch out! Once you disable new reader mode, major Homestuck spoilers will immediately become visible on many pages of the collection. Are you sure you want to go ahead?'
      }
      ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
        if (answer === true) {
          this.newReaderPage = this.$mspaOrVizNumber(this.$localData.settings.newReader.current)
          this.$localData.root.NEW_READER_CLEAR()
        }
      })
    },
    forceThemeOverrideUIMSPA(){
      if (this.forceThemeOverrideUIMSPAChecked) {
        this.$localData.settings.themeOverrideUI = ""
        this.$localData.settings.forceThemeOverrideUI = false
      } else {
        this.$localData.settings.themeOverrideUI = "default"
        this.$localData.settings.forceThemeOverrideUI = true
      }
      this.$localData.root.saveLocalStorage()
    },
    toggleAllControversial() {
      if (this.controversialAny) {
        // Normally checking an indeterminate checkbox enables it,
        // but we want to clear it instead.
        
        // eslint-disable-next-line no-return-assign
        this.allControversial.forEach(key => this.$localData.settings[key] = false)
        this.$el.querySelectorAll("input[name=enableControversial]").forEach(i => {i.checked = false})
      } else {
        const args = {
          title: "Are you sure?",
          message: "This option restores all the controversial material without including spoilers or detailed content warnings. The material includes racism and body horror.\n\nMore granular settings are available when New Reader mode is disabled, so you may wish to finish Homestuck before you come back and view this content selectively.\n\n Are you sure you want to enable this option now?"
        }
        ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
          if (answer === true) {
            // eslint-disable-next-line no-return-assign
            this.allControversial.forEach(key => this.$localData.settings[key] = true)
          } else {
            this.$el.querySelectorAll("input[name=enableControversial]").forEach(i => {i.checked = false})
          }
        })
      }
    },
    toggleSetting(setting, parentObject){
      // Call this when a setting changes, so we can update it on the parent object.
      // Doesn't actually toggle settings.
      if (!(setting in this.$localData.settings) || (parentObject in this.$localData.settings && !(setting in this.$localData.settings[parentObject]))) this.$set(this.$localData.settings, setting, true)
      else if (parentObject && setting in this.$localData.settings[parentObject]) this.$localData.settings[parentObject][setting] = !this.$localData.settings[parentObject][setting]
      else this.$localData.settings[setting] = !this.$localData.settings[setting]

      if (setting == 'notifications' && this.$localData.settings[setting]) {
        this.$popNotif('notif_enabled')
      }
      if (['unpeachy', 'pxsTavros'].includes(setting)) {
        ipcRenderer.send('RELOAD_ARCHIVE_DATA')
      }

      this.$localData.root.saveLocalStorage()
    },
    locateAssets(){
      ipcRenderer.invoke('locate-assets', {restart: true})
    },
    factoryReset(){      
      const args = {
        title: "FACTORY RESET",
        message: 'Are you absolutely sure? This will reset everything: Your reading progress, tab history, save files, and settings will all be completely gone!',
        okay: "Yes, delete everything"
      }
      ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
        if (answer === true) {
          ipcRenderer.invoke('factory-reset', answer)
        }
      })
    },
    onUpdateSortable: function(event){
      const el_active = event.target
      const setting_key = el_active.attributes['data-setting'].value

      // Get lists of values
      const old_list = this.$localData.settings[setting_key]
      const list_active = Array(...el_active.children).map((child) =>
        child.attributes['data-value'].value
      )
      this.$localData.settings[setting_key] = list_active

      // Calculte needReload
      let diff = list_active.filter(x => !old_list.includes(x))
      diff = diff.concat(old_list.filter(x => !list_active.includes(x)))
      if (diff.some(key => this.$modChoices[key].needsreload)) {
        this.$logger.info("List change requires reload", diff)
        this.needReload = true
      }
      this.queueArchiveReload()
    },
    queueArchiveReload(){
      if (this.debounce) clearTimeout(this.debounce)
      this.debounce = setTimeout(this.archiveReload, 8000)
    },
    archiveReload(){
      this.debounce = false 
      this.memoizedClearAll()

      this.$root.loadState = "LOADING"
      this.$nextTick(function () {
        ipcRenderer.send('RELOAD_ARCHIVE_DATA')
      })
    },
    openSubModel: function(mod, info_only=false) {
      this.$refs.modal.openMod(mod, info_only)
    },
    forceReload: function() {
      ipcRenderer.sendSync('MODS_FORCE_RELOAD')
      ipcRenderer.invoke('reload')
      // this.$root.loadState = "LOADING"
      // this.$nextTick(function () {
      //   ipcRenderer.sendSync('MODS_FORCE_RELOAD')
      //   ipcRenderer.send('RELOAD_ARCHIVE_DATA')
      // })
      // ipcRenderer.invoke('reload')
    },
    reloadModList: function() {
      ipcRenderer.sendSync('MODS_FORCE_RELOAD')
      this._computedWatchers.$modChoices.run()
      this._computedWatchers.modsEnabled.run()
      this._computedWatchers.modsDisabled.run()
      this.$forceUpdate()
    }
  },
  watch: {
    newReaderPage(to, from) {
      if (this.$localData.settings.mspaMode)
        this.newReaderPage = Number(to).pad(6)
      this.validateNewReader()
    },
    '$localData.settings.mspaMode'() {
      this.validateNewReader()
    },
    '$localData.tabData.activeTabKey'(to, from) {
      if (this.debounce) {
        clearTimeout(this.debounce)
        this.debounce = false
        this.archiveReload()
      }
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

        > dd.settingDesc {
          // Descriptions of whole sections
          margin-top: 1em;
        }
        
        .system {
          margin-top: 20px;
          text-align: center;
          font-weight: normal;
        }

        .newReaderInput {
          margin-top: 20px;
          text-align: center;

          button {
              margin-bottom: 1em;
          }
          input {
            border: 1px solid #777;
            width: 70px;
            font-size: 110%;
            border-radius: 2px;
            padding: 2px 3px;
            margin: 5px;

            &.invalid:not(:disabled):not(.empty) {
              background: pink;
              border-color: rgb(187, 0, 37);
              box-shadow: 0 0 3px 1px red;
            }
            &.changed {
              border-color: #ffaa00;
              box-shadow: 0 0 3px 1px red;
            }
          }
        }

        .fastForwardSelection {
          dd {
            font-weight: normal;
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
        .themeSelector + dt {
          display: inline;
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
        .ccPageNos {
          font-weight: normal;
          // width: 600px;
          // margin: 1em auto;
          h3 {
            margin-top: .4em;
          }
          ol {
            margin-inline-start: 2em;
          }

        }
        span.cw {
            padding: 0 7px;
            font-size: 12px;
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI;
            font-weight: 500;
            line-height: 18px;
            border: 1px solid transparent;
            border-radius: 2em;
            margin-left: 1em;
            &.minor {
              background-color: #fbca04;
              color: #000000;
            }
            &.severe{
              background-color: #d93f0b;
              color: #ffffff;
            }
        }
      }
    }
    .sortable {
      font-weight: normal;
      
      ul, ol {  
        text-align: left;
        border: solid #c6c6c6;
        border-width: 7px 7px 0 0;
        padding-bottom: 6em;
        height: 100%;
      }

      li {
          /*list-style-position: inside;*/
          background-color: #fff;
          border: 1px solid rgba(0,0,0,.125);
          margin-bottom: -1px;
          padding: .2em;
      }

      ul li {
          list-style: none;
      }

      ol li {
        list-style: decimal;
      }

      .col {  
          width: 100%;
          margin: 0 20px;
      }
      .modButton {
        float: right;
        width: 18px;
        height: 18px;
        background: #EEE;
        text-align: center;
        &:hover {
          background: #c6c6c6
        }
      }
    }

    .col {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .row {
      display: flex;

    }
  }

</style>

