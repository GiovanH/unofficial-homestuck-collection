<template>
    <div :class="['footer', this.$root.tabTheme.rendered, $localData.settings.pixelScaling ? 'pixelated' : false ]" :style="styleObject">
        <Media :url="bannerImage[0]" class="bannerImage left" draggable="false" />
        <Media :url="bannerImage[1]" class="bannerImage right" draggable="false" />
    </div>
</template>


<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
    name: 'pageFooter',
    components: {
        Media
    },
    props: [
        'pageWidth'
    ],
    data() {
        return{
        }
    },
    computed: {
        styleObject() {
            return {
                width: this.pageWidth || '950px'
            }
        },
        bannerImage() {
            switch (this.$root.tabTheme.rendered) {
                case 'mspa':
                    return ['assets://images/mspalogo_mspa.png', 'assets://images/mspalogo_mspa.png']
                case 'scratch':
                    return ['assets://images/mspalogo_scratch.png', 'assets://images/mspalogo_scratch.png']
                case 'sbahj':
                    return ['assets://images/mspalogo_sbahj2.jpg', 'assets://images/mspalogo_sbahj.jpg']
                case 'trickster':
                    return ['assets://images/mspalogo_trickster.gif', 'assets://images/mspalogo_trickster.gif']
                case 'A6A6':
                    return ['assets://images/mspalogo_a6a6.png', 'assets://images/mspalogo_a6a6.png']
                case 'pxs':
                    return ['assets://images/mspalogo_pxs.png', 'assets://images/mspalogo_pxs.png']
                case undefined:
                    this.$logger.warn("Couldn't read root theme?", this.$root.tabTheme.rendered)
                // eslint-disable-next-line no-fallthrough
                default:
                    return ['assets://images/mspalogo_mspa.png', 'assets://images/mspalogo_mspa.png']
            }
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
    .footer {
        height: 110px;

        max-width: 100vw;
        box-sizing: border-box;
        padding-left: 12px;
        padding-right: 12px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        user-select: none;
    }
    .scratch .footer {
        padding-left: 40px;
        padding-right: 40px;
        
        background-color: var(--page-pageContent);
    }
    .trickster {
        .right {
            transform: scaleX(-1);
        }
    }
    .pxs {
        .left {
            transform: scaleX(-1);
        }
    }

</style>