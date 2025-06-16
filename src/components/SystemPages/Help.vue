<template>
  <GenericCardPage>
    <div class="card">
      <div class="cardContent center">
        <section>
          <a class="logo" href="/"><Logo /></a>
        </section>
        <section class="pageMenu">
          <a v-for="(label, key) in {newreader: 'New Readers', usage: 'How To Use The Collection', faq: 'FAQ'}" 
            :key="key"
            :href="`/help/${key}`" 
            :class="{selected: cardSelection == key}"
            v-text="label" />
        </section>
        <hr />
        <section class="cardBody helpSection" v-if="cardSelection == 'newreader'">
          <section>
            <h2>Welcome! Wondering where to begin?</h2> 
            <p>
              If you've come this far and are just wondering where to start, you almost certainly want to go to <a href="/mspa/6">Homestuck</a> and take it from there! Feeling a bit more adventurous? Then try starting with Homestuck's cult classic predecessor, <a href="/mspa/4">Problem Sleuth</a>.
            </p>
            <p>
              To progress through the story, click on the 'commands' below each page, to which the characters will respond on the next page. These used to be picked from reader suggestions on the original site, MS Paint Adventures. 
            </p>
            <p>
              The rest of the content in this collection can be considered supplementary material. Peruse it in your downtime, or when your story progress unlocks new content.
            </p>
          </section>

          <section>
            <h2>Still here?</h2>
            <p>
              Maybe you're hesitating. <em>"Isn't there something I need to know or do in order to read Homestuck?"</em> Not at all! Just start at the beginning, take it one page at a time, and stick with it until it gets its hooks into you. 
            </p>
            <p>
              New reader mode will protect you from everything in the collection that could possibly be considered a spoiler. What I don't recommend is trying to look stuff up online, at least for a while. (This includes external links within the collection, marked like <a href="https://bambosh.github.io/unofficial-homestuck-collection/">this</a>, which go to the Real Internet!)<br />
              Late-arrival spoilers will slap you in the face. Try asking a friend! 
            </p>
            <p>
              Failing that, Homestuck fan communities are often happy to help newcomers and will answer your questions, although they're not set up to provide spoiler-free experiences.
            </p>
          </section>

          <section>
            <h2><em>"Ok, but I still want some context."</em></h2>
            <p>There's a fair chunk of history behind the format of Homestuck and the other MS Paint Adventures, which is probably best left explained by the big man himself. <a href="/faqs/new">If you're curious, check out the original introduction page by Homestuck's author, Andrew Hussie.</a></p>
          </section>

          <Media url="assets://images/newreaders_sig.gif" />
        </section>
        <section class="cardBody helpSection" v-if="cardSelection == 'usage'">
          <section>
            <h2>GENERAL NAVIGATION</h2>
            <p>In The Unofficial Homestuck Collection, <a href="/">the homepage</a> is your main hub for accessing content! You should be able to get a glance of everything the collection contains from here. If you want to quickly navigate to another part of the collection, your first stop should be the homepage.</p>
            <p>Got new reader mode enabled? Wondering about the mysterious question marks plastered everywhere? How do you find out what they are? By reading Homestuck! The goal of new reader mode is to provide a safe place for you to make your way through the story, while reducing the risk of learning anything in advance. This means that as long as certain content is considered a "spoiler", you will be prevented from accessing it.</p>
            <p>Don't feel like you have to remember when each thing is scheduled to unlock, though! When something becomes available in the archive, you'll be alerted by a small notification at the bottom of the screen.</p>
          </section>
          <section v-if="$localData.settings.showAddressBar">
            <h2>THE JUMP BAR</h2>
            <p>Is the homepage just not cutting it? You can jump to any page you know the URL for with the JUMP BAR! It functions just like the address bar in your browser, because it pretty much is one!</p>
            <p>Just like an address bar, you can press <strong>CTRL+L</strong> to immediately focus your cursor on it. (that's <strong>⌘+L</strong> if you're on MacOS). If you want to hide it while you're not using it, there's an option for that on <a href="/settings/application">the settings page.</a></p>
          </section>
          <section v-else>
            <h2>THE JUMP BAR</h2>
            <p>Is the homepage just not cutting it? You can jump to any page you know the URL for with the JUMP BAR! Open it up by clicking the JUMP button next to the tab bar, or by hitting <strong>CTRL+L</strong> (that's <strong>⌘+L</strong> if you're on MacOS).</p>
            <Media url="/archive/collection/userguide_jumpbtn.png" />
            <Media url="/archive/collection/userguide_jumpbar.png" />
            <p>It functions just like the address bar in your browser, because it pretty much is one! If you miss having it visible at all times, there's an option for that on <a href="/settings/application">the settings page.</a></p>
          </section>
          <section>
            <h2>SAVING and LOADING your "game"</h2>
            <p>The official Homestuck website has a cookie-powered "saving" system that keeps track of the latest page you've been to, and returns you to it the next time you visit.</p>
            <p>This application never even has a chance to forget that stuff to begin with! You can close the application at any time, and starting it up again will put things exactly the way they were when you closed it.</p>
            <p>There's still a way to save pages on the internet though, and that's called bookmarks. This app has a bookmarks menu, which you can access with the bookmarks button next to the tab bar.</p>
            <Media url="/archive/collection/userguide_bookmarkbtn.png" />
            <p>When you open the "Game Data" tab and hit the + button, a new block of SAVE DATA will be created, automatically filled in with the details of whatever page you're on.</p>
            <Media url="/archive/collection/userguide_saves1.png" />
            <p>Dont let a computer tell you what to do though: You can change the title and url to absolutely anything you want! If you make any changes, be sure to hit the button to the right to keep them (or just delete the SAVE DATA entirely). You can have as many SAVES as you want, so go wild!</p>
            <p>And remember, you can edit your SAVES at any time! Just click the pencil that shows up when you hover over the bookmark link.</p>
            <Media url="/archive/collection/userguide_saves2.png" />
          </section>
          <section>
            <h2>SEARCHING</h2>
            <p>The <a href="/search">search page</a> functions fairly similarly to the one on the official Homestuck website: Just enter some keywords and see what happens. It'll return the results and link to whatever adventure page they came from.</p>
            <p>There are some ways to spice up your results, though. They're not sorted in any particular way by default, but by entering <strong>SORT</strong> or <strong>ORDER</strong> and following it up with a <strong>DESC</strong> or <strong>ASC</strong>, you can tell it to sort the results in a specific way.</p>
            <p>You can also filter results by adventure. For example, to only search for results in Problem Sleuth, you would type <strong>IN:PS</strong>, or <strong>IN:PS10</strong> for a specific chapter. For just results from the first act of Homestuck, you can do something like <strong>IN:A1</strong>. Try experimenting!</p>
            <Media url="/archive/collection/userguide_search.png" />
          </section>
          <section>
            <a :href="bug_report_link" target="_blank" class="anchorButton bugreport">Report a bug</a>
            <a href="https://github.com/GiovanH/unofficial-homestuck-collection/issues/new?labels=enhancement&template=feature_request.md" target="_blank" class="anchorButton">Request a feature</a>
          </section>
        </section>
        <section class="cardBody helpSection" v-if="cardSelection == 'faq'">
          <h2>FREQUENTLY ASKED QUESTIONS</h2>
          <section class="faq">
          <dl>
            <dt>Some panels/images/media aren't loading at all!</dt>
            <dd>This is usually caused by a faulty asset pack. Try re-downloading and re-extracting the asset pack, then try again.</dd>

            <dt>What kind of accessibility options are there?</dt>
            <dd>There are several options on the <a href='/settings/enhancements' target='_blank'>Settings page, under Enhancements</a>. You should find options that can help you fine-tune Homestuck's text to be more readable, such as font adjustments and high-contrast colours. There is also a dark mode, if the default shades of grey are straining your eyes.</dd>

            <dt>I turned on dark mode, but now I can't read anything!</dt>
            <dd>Most of the colored text in Homestuck is optimized to be read against the default grey MSPA background, so dark text colors will become very hard to read against a dark background. If you're using dark mode, we recommend also turning on <b>High contrast text</b> in settings under Text Override.</dd>

            <dt>How can I share or find mods?</dt>
            <dd><a href="https://github.com/GiovanH/unofficial-homestuck-collection/wiki/Third-Party-Mods">We have a wiki page dedicated to shining a light on various mods developed by the community.</a>. If you've created a mod and want to share it, please add a link to the list! <strong v-if="$isNewReader">Be careful - this list is likely to contain unmarked spoilers.</strong></dd>

            <dt>How can I install mods?</dt>
            <dd>Installing mods is simple - once you've downloaded one, just drag it into the "mods" folder in your asset pack. It will appear <a href='/settings/mod' target='_blank'>in this list of "Inactive" mods</a> once you refresh the application. To enable a mod, drag it over to the "Active" column. If any active mods conflict with each other, whichever one is higher on the list will take priority.</dd>

            <dt>Can I see that list of content warnings from the setup page again?</dt>
            <dd>Sure!</dd>

            <SpoilerBox>
              <div class="scrollbox" style="max-height: 18em;">
                <ul>
                  <li v-for="cw in contentWarnings" v-text="cw" :key="cw" />
                </ul>
              </div>
            </SpoilerBox>

            <dt>How does this collection handle controversial material that was later replaced by What Pumpkin?</dt>
            <dd>The collection includes granular options to view this content, but it is disabled by default. You can find controls for it on <a href='/settings/controversial' target='_blank'>the settings page</a>.</dd>

            <dt>Can you port this to Chromebooks or smartphones?</dt>
            <dd>Due to compatibility issues with Flash, and the browser engine the collection runs on, the only platforms we can support are Windows/Mac/Linux. These problems may be solved in the distant future, but right now our hands are tied.</dd>

            <dt>Why does the collection have two different version numbers? How does that work?</dt>
            <dd>
              <p>The collection is composed of two parts: the main app, and the Asset Pack. The main app handles the code and logic and processing, and the asset pack stores the data.
              </p>
              <p>For a couple of different reasons (namely, the Asset Pack is very large and also not GPL licensed) we distribute the Asset Pack and the collection separately. The app has a version number that looks like {{$data.$appVersion}} (that's me!), and the asset pack just has one version number (you're on v{{$archive.version}}).</p>
              <p>The good news is the collection can be updated with bugfixes and features without requiring a new Asset Pack! We use semantic versioning, so if you were on 1.0.0, an update to 1.0.X would be a bugfix, and an update to 1.X.X would mean bugfixes and new features. Only an update to X.X.X would require re-downloading a new asset pack.</p>
            </dd>

            <dt>[Legal question]</dt>
            <dd>All legal info can be found under <a href='/credits' target='_blank'>Archive Credits</a>.</dd>
          </dl>
          </section>

          <section>
            <p>Still having trouble? Reach out to us:</p>
          </section>
          <section>
            <a :href="bug_report_link" target="_blank" class="anchorButton bugreport">Report a bug</a>
            <a href="https://github.com/GiovanH/unofficial-homestuck-collection/issues/new?labels=enhancement&template=feature_request.md" target="_blank" class="anchorButton">Request a feature</a>
          </section>
        </section>
      </div>
    </div>
  </GenericCardPage>
</template>

<script>
import Media from '@/components/UIElements/MediaEmbed.vue'
import Logo from '@/components/UIElements/Logo.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'

import GenericCardPage from '@/components/Template/GenericCardPage.vue'
import SetupWizard from '@/components/SystemPages/SetupWizard.vue'

import errorReporting from '@/js/errorReporting'

export default {
  name: 'help',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, Logo, SpoilerBox, GenericCardPage
  },
  title: () => "Help",
  data: function() {
    return {
      contentWarnings: (SetupWizard.data() || {contentWarnings: ['pls merge setup branch']}).contentWarnings
    }
  },
  computed: {
    cardSelection(){
      return this.routeParams.mode || 'newreader'
    },
    bug_report_link(){
      return errorReporting.createIssueLink({
        "App": this.$data.$appVersion,
        "Asset Pack": this.$archive.version
      })
    }
  }
}
</script>

<style scoped lang="scss">
a.anchorButton {
  padding: 10px 50px;
  margin: 0 1em;
  width: 225px;
  border-radius: 3px;
  background-color: #3edd41;
  display: inline-block;
  text-decoration: none;
  font-weight: bold;

  color: white !important;

  &:hover {
    background-color: #37bc3a;
  }
  &.bugreport {
    background-color: #ff3b22;
    &:hover {
      background-color: #e4331c;
    }
  }
}

.helpSection {
  dd p {
    margin-bottom: 0.5em;
  }
  .tiny {
    font-size: x-small;
  }
  div.scrollbox {
    background: #fff;
    box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
    display: block;
    margin: 0;
    padding: 12px 8px;
    overflow-y: scroll;
  }
}
</style>
