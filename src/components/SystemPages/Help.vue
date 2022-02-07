<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Logo /></a>
      <div class="cardContent pageMenu">
        <a v-for="(label, key) in {newreader: 'New Readers', usage: 'How To Use The Collection', faq: 'FAQ'}" 
          :key="key"
          :href="`/help/${key}`" 
          :class="{selected: cardSelection == key}"
          v-text="label" />

      </div>
      <hr />
      <div class="cardContent" 
        v-if="cardSelection == 'newreader'">
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
      </div>
      <div class="cardContent" v-if="cardSelection == 'usage'">
        <section>
          <a href="https://github.com/Bambosh/unofficial-homestuck-collection/issues/new?labels=bug" target="_blank" class="anchorButton bugreport">Report a bug</a>
          <a href="https://github.com/Bambosh/unofficial-homestuck-collection/issues/new?labels=enhancement" target="_blank" class="anchorButton">Request a feature</a>
        </section>
        <section>
          <h2>GENERAL NAVIGATION</h2>
          <p>In The Unofficial Homestuck Collection, <a href="/">the homepage</a> is your main hub for accessing content! You should be able to get a glance of everything the collection contains from here. If you want to quickly navigate to another part of the collection, your first stop should be the homepage.</p>
          <p>Got new reader mode enabled? Wondering about the mysterious question marks plastered everywhere? How do you find out what they are? By reading Homestuck! The goal of new reader mode is to provide a safe place for you to make your way through the story, while reducing the risk of learning anything in advance. This means that as long as certain content is considered a "spoiler", you will be prevented from accessing it.</p>
          <p>Don't feel like you have to remember when each thing is scheduled to unlock, though! When something becomes available in the archive, you'll be alerted by a small notification at the bottom of the screen.</p>
        </section>
        <section>
          <h2>THE JUMP BAR</h2>
          <p>Is the homepage just not cutting it? You can jump to any page you know the URL for with the JUMP BAR! Open it up by clicking the JUMP button nexto the tab bar, or by hitting <strong>CTRL+L</strong> (that's <strong>⌘+L</strong> if you're on MacOS).</p>
          <Media url="/archive/collection/userguide_jumpbtn.png" />
          <Media url="/archive/collection/userguide_jumpbar.png" />
          <p>It functions just like the address bar in your browser, because it pretty much is one! If you really miss having it embedded in the header at all times, there's an option for that at the top of <a href="/settings">the settings page.</a></p>
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
      </div>
      <div class="cardContent" v-if="cardSelection == 'faq'">
        <h2>FREQUENTLY ASKED QUESTIONS</h2>
        <section>
        <dl class="faq">
          <dt>Some panels/images/media aren't loading at all!</dt>
          <dd>This is usually caused by a faulty asset pack install. Try redownloading and re-extracting the asset pack.</dd>

          <dt>Is there a dark mode?</dt>
          <dd>Yes: in the <a href='/settings/enhancements' target='_blank'>Settings page, under Enhancements.</a></dd>

          <dt>Can I see that list of content warnings from the setup page again?</dt>
          <dd>Sure!</dd>

          <SpoilerBox>
            <div class="scrollbox" style="max-height: 18em;">
              <ul>
                <li v-for="cw in contentWarnings" v-text="cw" :key="cw" />
              </ul>
            </div>
          </SpoilerBox>

          <dt>How does this collection handle [controversial material that was later replaced by What Pumpkin]?</dt>
          <dd>The collection includes all the original material in controversial content, but it is disabled by default. Controls for enabling it are in <a href='/settings/controversial' target='_blank'>Settings</a>.</dd>

          <dt>What's all this I hear about mods?</dt>
          <dd>Version 2.0 of the collection has mod support so it can easily be extended with commentary or other tweaks. More information including links to documentation and other resources is available in the <a href='/settings/mod' target='_blank'>Settings page under Mod Settings.</a></dd>

          <dt>[Legal question]</dt>
          <dd>Legal info can be found under <a href='/credits' target='_blank'>Archive Credits</a></dd>
        </dl>
        </section>
        <section>
          <p>Still having trouble? Reach out to us:</p>
        </section>
        <section>
          <a href="https://github.com/Bambosh/unofficial-homestuck-collection/issues/new?labels=bug" target="_blank" class="anchorButton bugreport">Report a bug</a>
          <a href="https://github.com/Bambosh/unofficial-homestuck-collection/issues/new?labels=enhancement" target="_blank" class="anchorButton">Request a feature</a>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import Logo from '@/components/UIElements/Logo.vue'
import SpoilerBox from '@/components/UIElements/SpoilerBox.vue'

import SETUP from '@/components/SystemPages/Setup.vue'

export default {
  name: 'help',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, Logo, SpoilerBox
  },
  title: () => "Help",
  data: function() {
    return {
      contentWarnings: (SETUP.data() || {contentWarnings: ['pls merge setup branch']}).contentWarnings
    }
  },
  computed: {
    cardSelection(){
      return this.routeParams.mode || 'newreader'
    }
  }
}
</script>

<style scoped lang="scss">
  .navBanner {
    margin-bottom: 25px;
  }

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

  .pageMenu {
    display: flex;
    justify-content: space-evenly;
    a {
      flex: 1;
      color: var(--page-links);
      font-size: 24px; 
      text-decoration: none;
      &:hover {
        cursor: pointer;
      }
      &:hover, &.selected {
        text-decoration: underline;
      }
    }
  }
  .pageBody {
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

    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;

    color: var(--font-default);
    a {
      color: var(--page-links);
    }
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

    .logo {
      margin: 25px;

      img {
        width: 700px;
      }
    }
    hr {
      margin: 0 0 25px 0;
      width: 100%;
    }
  }
  .cardContent {
    width: 100%;
    padding-bottom: 25px;
    text-align: center;
    
    h2 {
      margin-bottom: 16px;
    }
    img {
      display: block;
      margin: 0 auto;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    section {
      margin-bottom: 3em;
    }
    p {
      font-size: 16px;
      font-weight: normal;
      font-family: Verdana,Arial,Helvetica,sans-serif;
      margin-bottom: 1em;
    }
    .tiny {
      font-size: x-small;
    }
    .faq {
      text-align: left;
      margin: auto;
      width: 720px;
      font-size: 1.2em;
      dt {
        padding-top: 1em;
        font-style: italic;
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
  }
</style>
