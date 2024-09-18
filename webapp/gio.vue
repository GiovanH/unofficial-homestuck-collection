<template>
  <GenericPage noPageContent="true">
    <!-- <MediaEmbed url='assets://archive/collection/logo_v1.png'
      style="width: 600px; margin: 25px;"/> -->
    <div class="pageContent">
      <Logo style="width: 600px; margin: 25px;"/>
      <a href="//im.giovanh.com/" class="invis_link">
        <div class='row' style='align-items: center;'>
          <p class='sans'>
            comepletely<br />ruined by ...... <br />
            <span style='color: orange;'>THIS</span> <br />Hornse's Ass
          </p>
          <img src='https://blog.giovanh.com/theme/images/ad/twitter_card.png'
          class='u207e rotate'/>
        </div>
      </a>
    </div>
    <div class="pageContent">
      <div class='textContent'>
        <h2>the thing what it is</h2>
        <p>Homestuck, in your browser for the first time since 2018!</p>
        <p>
          This is an online port of <a href='https://bambosh.dev/unofficial-homestuck-collection/'>The Unofficial Homestuck Collection</a>, a desktop collection of Homestuck and its related works. TUHC is developed by <a href='/credits'>Bambosh and Gio (and some other great folks)</a>, while this port in particular is written, maintained, and hosted as an experiment by Gio.
        </p>
        <p>
          This is meant as a way to use the offline homestuck collection in a browser, for people on mobile or platforms that don't have a proper version, or as an "on-ramp" if you're just getting into Homestuck and aren't sure if you want to commit yet.
        </p>
        <p>
          Don't just use this to read Homestuck! Get the collection; it's faster, it has real flash, and it's a real archive you can save and keep!
        </p>
      </div>
    </div>
    <div class="pageContent">
      <div class='textContent'>
        <h2>Bug Reporting</h2>
        <p>
          For bugs that occur both on this web version and the offline, downloadable version, please report issues on the <a href='https://github.com/Bambosh/unofficial-homestuck-collection/issues'>main GitHub issue tracker.</a>
        </p>
        <p>
          For bugs that are isolated to the web version, you can <a href='https://im.giovanh.com/'>contact me directly.</a>
        </p>
      </div>
    </div>
    <div class="pageContent">
      <div class='textContent'>
        <h2>FAQ</h2>
        <dl>
          <dt>How do you handle Flash?</dt>
          <dd>Fallback <a href='https://ruffle.rs/'>Ruffle emulation</a> is enabled by default. Flash emulation will only be as good as the latest version of Ruffle! For instance, Cascade loads correctly, but does <em>not</em> perform well yet, at least on my machine. As a fallback-fallback, you can always click the link at the bottom of the page to view the YouTube versions on Homestuck.com.</dd>

          <dt>Does it work on phones?</dt>
          <dd>Sorta! It's a website, so it works on modern browsers even if they're on a phone. Many, but not all, pages also have full mobile support, so you should definitely be able to read the main comic (sans flash) from a mobile device (preferably a tablet, since it's a comic, but as long as it's 650 of god's own pixels wide, you should be okay). Pair this with <a href='/settings/enhancements'>text size overrides</a> for best results. </dd>

          <dt>Can I disable fallback Ruffle emulation so the flash embeds just break instead?</dt>
          <dd>I guess.</dd>

          <!-- <dt>Why is the spirograph loading animation broken</dt>
          <dd>Your browser doesn't support (or incorrectly implements) <a href='https://www.w3.org/TR/SVG2/'>SVG2</a>.</dd> -->

          <!-- <dt>Is that an advertisement at the bottom?</dt>
          <dd>No. No products or sponsorships or any profitability here. I do invite anyone interested to help contribute to the operating costs of hosting this site itself, but the content is of course provided for free (just as it was originally published).</dd> -->

          <dt>What version of the desktop program is this?</dt>
          <dd>The exact version does not map directly to one of the TUHC desktop versions. Generally this is based on a recent development version or prerelease, although it probably pulls in WIP features and beta experiments that haven't been merged in to the stable version yet. </dd>

          <dt>How is this licensed?</dt>
          <dd>The main desktop program is licensed to use and modify under GPL3; see the GitHub page for details. All the code from the main collection continues to be GPL3, however there are some web-specific extensions and workarounds (as well as Gio-specific settings) that aren't part of the main collection (yet) and thus FAFO.</dd>
          <!--
          <dt></dt>
          <dd></dd>
          -->
        </dl>
      </div>
    </div>
  </GenericPage>
</template>

<script>

// import Logo from '@/components/UIElements/Logo.vue'

export default {
  title: () => "there's no stuck like home stuck",
  // components: {Logo}
}

</script>

<style scoped lang="scss">
  // .pageBody {
  //   background: var(--system-background) !important;
  //   background-color: var(--system-skycolor) !important;
  // }
  .pageFrame {
    p {
      // fuck you *unresets your css*
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }
    p, dd {
      font-weight: normal;
      // color: #aa0001;
    }
    .pageContent {
      margin-bottom: 1em;
    }
    .textContent { width: 600px; }
    dt { font-weight: bold; }
    dd { padding-bottom: 1em; }
    .sans {
      color: unset;
      font-family: "Comic Sans MS";
      font-weight: bold;
      text-align: center;
    }
    .u207e {
      height: 6em;
      margin: 0 2em;
      margin-bottom: 1em;
    }
    .invis_link {
      text-decoration: none;
      color: unset;
    }
    .row { display: flex; }
    .col {
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    .rotate {
      animation: rotation 6.10s infinite linear;
    }
  }
  // --footer-banner-image: url(https://blog.giovanh.com/theme/images/ad/bannerside.png);
</style>