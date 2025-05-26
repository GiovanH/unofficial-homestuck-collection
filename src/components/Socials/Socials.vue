<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="card">
      <a class="logo" href="/"><Media url="/archive/collection/collection_logo.png" /></a>
      <div class="cardContent">
      </div>
        
      <div class="cardContent cardRows">
        <HomeRowItem
          class="rowItem"
          href="/news"
          thumbsrc="/archive/collection/archive_news.png"
          date="Jun 2007 - Apr 2018">
          <template v-slot:title>MSPA Newsposts</template>
          <p>An archive of official newsposts, ranging the entire lifespan of the MSPA website.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/blogspot"
          thumbsrc="/archive/collection/archive_blogspot.png"
          afterpage="002821"
          date="Dec 2008 - Jul 2010">
          <template v-slot:title>Blogspot</template>
          <p>Used by Andrew Hussie for behind the scenes commentary during the early days of Homestuck.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/formspring"
          thumbsrc="/archive/collection/archive_formspring.png"
          afterpage="003478"
          date="Feb 2010 - Aug 2011">
          <template v-slot:title>Formspring</template>
          <p>Q&As with Andrew Hussie, providing context and commentary on Homestuck until it was dropped in mid-2011.</p>
        </HomeRowItem>
        <HomeRowItem
          class="rowItem"
          href="/tumblr"
          thumbsrc="/archive/collection/archive_tumblr.png"
          afterpage="006010"
          date="Oct 2011 -  Mar 2013">
          <template v-slot:title>Tumblr</template>
          <p>Picked up in place of Formspring. Used mainly for announcements and Q&As, then abandoned in 2013.</p>
        </HomeRowItem>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'
import Media from '@/components/UIElements/MediaEmbed.vue'
import HomeRowItem from '@/components/UIElements/HomeRowItem.vue'
export default {
  name: 'newReader',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, Media, HomeRowItem
  },
  title: () => "Socials",
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
    background: var(--system-background);
    background-color: var(--system-skycolor);

    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-weight: normal;

    color: var(--font-default);
    ::v-deep {
      a { color: var(--page-links); }
      a:link:active { color: var(--page-links-active); }
    }
  }
  .card {
    position: relative;
    margin-bottom: 25px;
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
  ::v-deep .rowItem {
    h2, p.date {
      display: inline-block;
    }
    p.date {
      font-size: 16px;
      &:before {
        content: ' (';
        margin-left: 8px;
      }
      &:after {
        content: ')';
      }
    }
  }
</style>
