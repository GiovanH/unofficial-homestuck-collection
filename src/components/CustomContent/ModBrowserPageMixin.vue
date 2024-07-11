<script>

const GlobalComponents = {
  Logo: () => import('@/components/UIElements/Logo.vue'),
  GenericPage: () => import('@/components/UIElements/GenericPage.vue'),
  NavBanner: () => import('@/components/UIElements/NavBanner.vue'),
  FlashCredit: () => import('@/components/UIElements/FlashCredit.vue'),
  MediaEmbed: () => import('@/components/UIElements/MediaEmbed.vue'),
  SpoilerBox: () => import('@/components/UIElements/SpoilerBox.vue'),
  StoryPageLink: () => import('@/components/UIElements/StoryPageLink.vue'),
  HomeRowItem: () => import('@/components/UIElements/HomeRowItem.vue'),
  Page: () => import('@/components/Page/Page.vue'),
  PageBanner: () => import('@/components/Page/PageBanner.vue'),
  PageFooter: () => import('@/components/Page/PageFooter.vue'),
  PageMetadata: () => import('@/components/Page/PageMetadata.vue'),
  PageNav: () => import('@/components/Page/PageNav.vue'),
  PageText: () => import('@/components/Page/PageText.vue'),
  SinglePage: () => import('@/components/Page/SinglePage.vue')
}

export default {
  created() {
    this.$options.components = Object.assign(this.$options.components, GlobalComponents)
  }
}
</script>
