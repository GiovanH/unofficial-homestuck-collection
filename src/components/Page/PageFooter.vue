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
                    return ['/images/mspalogo_mspa.png', '/images/mspalogo_mspa.png']
                case 'scratch':
                    return ['/images/mspalogo_scratch.png', '/images/mspalogo_scratch.png']
                case 'sbahj':
                    return ['/images/mspalogo_sbahj2.jpg', '/images/mspalogo_sbahj.jpg']
                case 'trickster':
                    return ['/images/mspalogo_trickster.gif', '/images/mspalogo_trickster.gif']
                case 'A6A6':
                    return ['/images/mspalogo_a6a6.png', '/images/mspalogo_a6a6.png']
                case 'pxs':
                    return ['/images/mspalogo_pxs.png', '/images/mspalogo_pxs.png']
                default:
                    this.$logger.warn("Couldn't read root theme?", this.$root.tabTheme.rendered)
                    return ['/images/mspalogo_mspa.png', '/images/mspalogo_mspa.png']
            }
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
    .pixelated img {
        image-rendering: pixelated;
    }
    .footer {
        height: 110px;

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