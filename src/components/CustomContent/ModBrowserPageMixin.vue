<script>

const GlobalComponents = {
  Logo: () => import('@/components/UIElements/Logo.vue'),
  GenericPage: () => import('@/components/Template/GenericPage.vue'),
  GenericCardPage: () => import('@/components/Template/GenericCardPage.vue'),
  NavBanner: () => import('@/components/UIElements/NavBanner.vue'),
  FlashCredit: () => import('@/components/UIElements/FlashCredit.vue'),
  MediaEmbed: () => import('@/components/UIElements/MediaEmbed.vue'),
  SpoilerBox: () => import('@/components/UIElements/SpoilerBox.vue'),
  StoryPageLink: () => import('@/components/UIElements/StoryPageLink.vue'),
  HomeRowItem: () => import('@/components/UIElements/HomeRowItem.vue'),
  Page: () => import('@/components/StoryPage/Page.vue'),
  PageBanner: () => import('@/components/StoryPage/PageBanner.vue'),
  PageFooter: () => import('@/components/StoryPage/PageFooter.vue'),
  PageMetadata: () => import('@/components/StoryPage/PageMetadata.vue'),
  PageNav: () => import('@/components/StoryPage/PageNav.vue'),
  PageText: () => import('@/components/StoryPage/PageText.vue'),
  SinglePage: () => import('@/components/StoryPage/SinglePage.vue')
}

export default {
  created() {
    this.$options.components = Object.assign(this.$options.components, GlobalComponents)
  }
}
</script>
