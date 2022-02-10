<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Logo /></a>
      <div class="cardContent">
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
            Failing that, <a href="/evenmore">Homestuck fan communities</a> are often happy to help newcomers and will answer your questions, although they're not set up to provide spoiler-free experiences.
          </p>
        </section>

        <section>
          <h2><em>"Ok, but I still want some context."</em></h2>
          <p>There's a fair chunk of history behind the format of Homestuck and the other MS Paint Adventures, which is probably best left explained by the big man himself. <a href="/faqs/new">If you're curious, check out the original introduction page by Homestuck's author, Andrew Hussie.</a></p>
        </section>

        <Media url="assets://images/newreaders_sig.gif" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import Logo from '@/components/UIElements/Logo.vue'

export default {
  name: 'newReader',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Logo
  },
  title: () => "New reader tips",
  data: function() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
  .navBanner {
    margin-bottom: 25px;
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
    ::v-deep a {
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
  }
</style>
