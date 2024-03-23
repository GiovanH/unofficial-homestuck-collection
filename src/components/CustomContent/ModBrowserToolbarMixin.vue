<script>

const NavBanner = () => import('@/components/UIElements/NavBanner.vue')
const FlashCredit = () => import('@/components/UIElements/FlashCredit.vue')
const MediaEmbed = () => import('@/components/UIElements/MediaEmbed.vue')
const SpoilerBox = () => import('@/components/UIElements/SpoilerBox.vue')
const StoryPageLink = () => import('@/components/UIElements/StoryPageLink.vue')

const GlobalComponents = {
  NavBanner, 
  FlashCredit,
  MediaEmbed,
  SpoilerBox,
  StoryPageLink
}

export default {
  created(){
    this.$options.components = Object.assign(this.$options.components, GlobalComponents)
  }
}
</script>
