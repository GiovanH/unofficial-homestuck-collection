<template>
  <!-- First-run app setup wizard -->
  <div class="cardContent newUserSetup wizard">
    <div class="wizardSidebar">
      <img class="logo" src="@/assets/collection_logo.png" v-if="!$isWebApp">
      <img class="logo" src="assets://archive/collection/logo_v2_static.png" v-else>
      <br />
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

      <p style="padding-bottom: 4em;">This self-contained collection contains <em>Homestuck</em> (with Flash elements fully intact), the other MS Paint Adventures, official <em>Homestuck</em> side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience. Hopefully, this collection should be the best way to read <em>Homestuck</em>, and preserve what made it so special.</p>

      <div class="hint wizardFooter">
        <!-- <p>WARNING: This program is protected by copyright law and international treaties.</p> -->
        <!-- I want to. I really want to. -->
        <p>This application is open source (<a href="https://github.com/GiovanH/unofficial-homestuck-collection/blob/main/LICENSE">GPL-3.0</a>). Check out the <a href="https://github.com/GiovanH/unofficial-homestuck-collection/">GitHub page</a> for resources like information on how you can contribute and the issue tracker so you can send us any bug reports.
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

    <div v-if="$root.platform == 'webapp'" class="getStarted" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Getting Started'}">
      <h2>Getting Started</h2>

      <p>You are currently using the <b>webapp</b> version of The Unofficial Homestuck Collection. Some features are unavailable (like Flash support and user mods) and others may work incorrectly or with degraded performance. The full program can be downloaded at the <a href='https://github.com/GiovanH/unofficial-homestuck-collection/releases'>GitHub repository</a>.</p>

      <p>Consider this a "trial version" if you're wondering if Homestuck is something you're interested in downloading, or as a way to easily share specific pages or moments with friends by link.</p>

      <div class="center">
        <button class="letsroll" @click="validateAndRestart()">All done. Let's roll!</button>
      </div>
    </div>
    <div v-else class="getStarted" :class="{hidden: newReaderCardNames[newReaderCardIndex] != 'Getting Started'}">
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
        <span v-if="selectedAssetVersion && isExpectedAssetVersion === false" class="error hint">That looks like asset pack v{{selectedAssetVersion}}, which is not the correct version. Please locate Asset Pack <strong>v{{$data.$expectedAssetVersion}}.</strong></span>
      </div>

      <div class="center">
        <button class="letsroll" :disabled="!validatePage || !isExpectedAssetVersion" @click="validateAndRestart()">All done. Let's roll!</button>
      </div>
    </div>

    </div>
    <div class="wizardNavigation">
      <button v-if="newReaderCardIndex > 0" @click="wizardNextPage(-1)" class="prev">&lt; Previous</button>
      <button v-if="newReaderCardIndex < lastNewReaderCard"
        @click="wizardNextPage(1)" class="next"
        :disabled="wizardForwardButtonDisabled">Next &gt;</button>
      <!--<button v-if="newReaderCardIndex == lastNewReaderCard" @click="">Finish</button>-->
    </div>
  </div>
</template>

<script>
import NewReaderControls from '@/components/UIElements/NewReaderControls.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'

const ipcRenderer = require('IpcRenderer')

export default {
  name: 'SetupWizard',
  components: {NewReaderControls, SpoilerBox},
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
      assetDir: undefined,
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

        'Nudity (incidental, can be disabled in settings)',
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
        'Imperialist empires'
      ]
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
    isExpectedAssetVersion() {
      return (this.selectedAssetVersion == this.$data.$expectedAssetVersion)
    }
  },
  mounted() {

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
        this.$logger.info("Version check: got", result, "eq?", this.$data.$expectedAssetVersion, this.isExpectedAssetVersion)
      })
    },
    validateAndRestart(){
      if (this.$isWebApp) {
        this.$localData.root.SET_ASSET_DIR('web')
      } else {
        this.$localData.root.SET_ASSET_DIR(this.assetDir)

        ipcRenderer.invoke('restart')
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">

  .wizard {
    .wizardSidebar {
      @media (max-width: 650px) {
        display: none;
      }
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
        @media (max-width: 650px) {
          position: revert;
          margin: revert;
        }
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
        &.next {
          right: 20px;
        }
        &.prev {
          right: 94px;
        }
      }
    }
  }
</style>
