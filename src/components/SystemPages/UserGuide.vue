<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Media url="/archive/collection/collection_logo.png" /></a>
      <div class="cardContent">
        <h2>GENERAL NAVIGATION</h2>
        <p>In The Unofficial Homestuck Collection, <a href="/">the homepage</a> is your main hub for accessing content! You should be able to get a glance of everything the collection contains from here. If you want to quickly navigate to another part of the collection, your first stop should be the homepage.</p>
        <p>Got new reader mode enabled? Wondering about the mysterious question marks plastered everywhere? How do you find out what they are? By reading Homestuck! The goal of new reader mode is to provide a safe place for you to make your way through the story, while reducing the risk of learning anything in advance. This means that as long as certain content is considered a "spoiler", you will be prevented from accessing it.</p>
        <p>Don't feel like you have to remember when each thing is scheduled to unlock, though! When something becomes available in the archive, you'll be alerted by a small notification at the bottom of the screen.</p>
      </div>
      <div class="cardContent">
        <h2>THE JUMP BAR</h2>
        <p>Is the homepage just not cutting it? You can jump to any page you know the URL for with the JUMP BAR! Open it up by clicking the JUMP button at the top of the page, or by hitting <strong>CTRL+L</strong> (that's <strong>⌘+L</strong> if you're on MacOS).</p>
        <Media url="/archive/collection/userguide_jumpbar.png" />
        <p>It functions just like the URL bar in your browser, because it pretty much is! The philosophy of this collection is that you generally shouldn't <em>have</em> to use URLs to get anywhere important. That said, the JUMP BAR will be there for you whenever you need it.</p>
      </div>
      <div class="cardContent">
        <h2>SAVING and LOADING your "game"</h2>
        <p>The official Homestuck website has a cookie-powered "saving" system that keeps track of the latest page you've been to, and returns you to it the next time you visit.</p>
        <p>This application never even has a chance to forget that stuff to begin with! You can close the application at any time, and starting it up again will put things exactly the way they were when you closed it.</p>
        <p><em>"Wait, but then what's that SAVE/LOAD button up at the top of the page for?"</em></p>
        <p>Well, I'm so glad I asked! In this collection, SAVING and LOADING is just another word for bookmarks. When you open the "Game Data" tab and hit the + button, a new block of SAVE DATA will be created, automatically filled in with the details of whatever page you're on.</p>
        <Media url="/archive/collection/userguide_saves1.png" />
        <p>Dont let a computer tell you what to do though: You can change the title and url to absolutely anything you want! If you make any changes, be sure to hit the button to the right to keep them (or just delete the SAVE DATA entirely). You can have as many SAVES as you want, so go wild!</p>
        <p>And remember, you can edit your SAVES at any time! Just click the pencil that shows up when you hover over the bookmark link.</p>
        <Media url="/archive/collection/userguide_saves2.png" />
      </div>
      <div class="cardContent">
        <h2>SEARCHING</h2>
        <p>The <a href="/search">search page</a> functions fairly similarly to the one on the official Homestuck website: Just enter some keywords and see what happens. It'll return the results and link to whatever adventure page they came from.</p>
        <p>There are some ways to spice up your results, though. They're not sorted in any particular way by default, but by entering <strong>SORT</strong> or <strong>ORDER</strong> and following it up with a <strong>DESC</strong> or <strong>ASC</strong>, you can tell it to sort the results in a specific way.</p>
        <p>You can also filter results by adventure. For example, to only search for results in Problem Sleuth, you would type <strong>IN:PS</strong>, or <strong>IN:PS10</strong> for a specific chapter. For just results from the first act of Homestuck, you can do something like <strong>IN:A1</strong>. Try experimenting!</p>
        <Media url="/archive/collection/userguide_search.png" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
export default {
  name: 'userGuide',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods:{
  },
}
</script>

<style scoped lang="scss">
  .pageBody {
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
    
    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;

    color: var(--font-default);
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

      .logo {
        margin: 25px;

        img {
          width: 700px;
        }
      }
      .cardContent {
        width: 100%;
        text-align: center;
        padding: 25px 0;

        &:not(:last-child) {
          border-bottom: solid 2px var(--page-pageBorder, var(--page-pageFrame));
        }

        h2 {
          margin-bottom: 25px;
        }
        img {
          display: block;
          margin: 0 auto;
          &:not(:last-child) {
            margin-bottom: 16px;
          }
        }
        p {
          font-size: 16px;
          font-weight: normal;
          font-family: Verdana,Arial,Helvetica,sans-serif;

          &:not(:last-child) {
            margin-bottom: 16px;
          }
        }
      }
    }

  }

</style>

