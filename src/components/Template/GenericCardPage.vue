<template>
  <div class="pageBody customStyles">
    <NavBanner class="navBanner" useCustomStyles="true" />
    <slot></slot>
  </div>
</template>

<script>
import NavBanner from '@/components/UIElements/NavBanner.vue'

export default {
  name: 'GenericCardPage',
  components: {
    NavBanner
  }
}
</script>

<style lang="scss" scoped>
$card-spacing: 25px;

.navBanner {
  margin-bottom: $card-spacing;
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
  font-size: 14px;

  color: var(--font-default);

  padding-bottom: 50px;
}

::v-deep {
  a { color: var(--page-links); }
  a:link:active { color: var(--page-links-active); }

  .center {
    text-align: center;
  }
  
  .card {
    position: relative;

    margin-bottom: $card-spacing;
    padding: 0 50px;
    border: solid 5px var(--page-pageBorder, var(--page-pageFrame));
    box-sizing: border-box;

    width: 950px;
    max-width: 100vw;

    background: var(--page-pageContent);

    flex: 0 1 auto;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    align-content: center;

    hr {
      width: 100%;
    }
    // &.cardStickyTop {    
    //   position: sticky;
    //   border-bottom: 0;
    //   margin-bottom: 0;
    //   .cardContent {    
    //     padding-bottom: 0;
    //   }
    // }
    // &.cardStickyBottom { 
    //   border-top: 0;
    //   .cardContent {    
    //     padding-top: 0;
    //   }
    // }
  }

  .cardContent {
    width: 100%;
    padding-top: 25px;
    &:last-of-type {
      padding-bottom: 25px;
    }

    .cardBody {
      max-width: 720px;
      margin: 0 auto;
    }
    
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
      margin-bottom: 1em;
    }
    p {
      margin-bottom: 1em;
    }
    .tiny {
      font-size: x-small;
    }
    
    dt {
      font-weight: bold;
    }
    
    dl, dd {
      text-align: left;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-weight: normal;
      // font-size: 12px;
    }

    dd {
      // font-size: 12px;
      margin-bottom: 1em;
    }
  }

  .pageMenu {
    display: flex;
    justify-content: space-evenly;
    a { color: var(--page-links); }
    a:link:active { color: var(--page-links-active); }
    a {
      flex: 1;
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
  
}
</style>
