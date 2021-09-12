<template>
    <p class="prattle text" :class="fontFamily" :style="fontScale" v-html="filteredPrattle" v-if="textType == 'prattle' && !!content"></p>

    <div class="log" :class="{logHidden: logHidden}" v-else-if="textType == 'log'">
		<button class="logButton" @click="loggle()">
            {{ logButtonText }}
		</button>
		<p class="logContent text" :class="fontFamily" :style="fontScale" v-html="content.replace(/\|.*?\| *\<br \/\>/, '')"></p>
	</div>

    <div class="authorlog" v-else-if="textType == 'authorlog'">
		<p class="logContent text" :class="fontFamily" :style="fontScale" v-html="content.replace(/\|.*?\| *\<br ?\/?\>/, '')"></p>
	</div>

</template>

<script>
export default {
    name: 'pageText',
    props: ['pageId', 'content'],
    data() {
        return {
            usePurpleLinks: false,
            logHidden: true,
            fullwidthImages: [
                'andthenightbeforechristmas.jpg',
                'areyounext.gif',
                'corpsesmooch.gif',
                'THIS.gif',
                'IS.gif',
                'STUPID.gif',
                'WHOSTHISDOUCHEBAG.gif',
                'nextbowl.gif',
                'nextbowl2.gif',
                'nextbowl3.gif',
                'nextbowl4.gif',
                'HELPHIM.gif',
                'weirdhonk.gif',
                'OHBOY.gif',
                'wizordofoz.jpg'
            ]
        }
    },
    computed: {
        fontFamily() {
            let result = []
            if (this.$localData.settings.textOverride.bold || !this.$localData.settings.textOverride.fontFamily) result.push('bold')
            if (this.$localData.settings.textOverride.fontFamily) result.push(this.$localData.settings.textOverride.fontFamily)
            return result
        },
        fontScale() {
            let fontSizes = ['1em', '1.15em', '1.3em', '1.45em', '1.6em', '1.75em', '1.9em']
            let lineHeights = [1.15, 1.35, 1.5, 1.65, 1.85, 2, 2.15]
            return {
                fontSize: fontSizes[this.$localData.settings.textOverride.fontSize],
                lineHeight: lineHeights[this.$localData.settings.textOverride.lineHeight]
            }
        },
        textType() {
            return this.getTextType(this.content)
        },
        logButtonText() {
            let text = this.content.match(/\|(.*?)\|/)[1]
            let state = (this.logHidden) ? 'Show ' : 'Hide '

            if (/P4SSWORD H1NT/i.test(text)){
                return text
            }
            else if (/trkstrlog/i.test(text)){
                text = 'tricksterlog'
            }
            else if (/sriousbiz/i.test(text)){
                text = 'serious business'
            }
            return state + text.toLowerCase()
        },
        filteredPrattle() {
            let result = this.content
            if (/<img src="/.test(result)){
                this.fullwidthImages.some(img => {
                    result = result.replace(`${img}" `, `${img}" class='fullWidth'`)
                })
            }
            
            return result
        },
        purpleLinkWatcher() {
            return this.$localData.temp.visited.toString()
        }
    },
    methods: {
        loggle() {
            this.logHidden = !this.logHidden
        },
        getTextType(content) {
            if (!content) return null

            if (/^\|AUTHORLOG\|/.test(content)){
                return "authorlog"
            }
            else if (/^\|.*?\|/.test(content)){
                return "log"
            }
            else{
                return "prattle"
            }
        },
        filterDOM() {
            if (this.$el.nodeType !== 8){
                let links = this.$el.getElementsByTagName('A')
                for (let i = 0; i < links.length; i++) {
                    let filteredLink = this.$filterURL(links[i].href)
                    links[i].href = filteredLink
                    if (this.usePurpleLinks && this.$localData.allHistory.includes(filteredLink)) links[i].classList.add('visited')
                }
                let images = this.$el.getElementsByTagName('IMG')
                for (let i = 0; i < images.length; i++) {
                    images[i].src = this.$getResourceURL(images[i].src)
                    images[i].ondragstart = (e) => {
                        e.preventDefault()
                        e.dataTransfer.effectAllowed = 'copy'
                        require('electron').ipcRenderer.send('ondragstart', this.$mspaFileStream(images[i].src))
                    }
                }
            }
        }
    },
    mounted() {
        if (this.$localData.settings.openLogs) {
            // Manual exception for pre-ministrife fakeout
            this.logHidden = this.pageId == '007326' 
        }

        this.filterDOM()
    },
    watch: {
        'purpleLinkWatcher'() {
            if (this.usePurpleLinks) this.filterDOM()
        }
    }
}
</script>

<style scoped lang="scss">
    ::v-deep {
        a {
            color: var(--page-links);
            &.visited {
                color: var(--page-links-visited);
            }
        }
    }

    .text {
        font-family: 'Courier New', Courier, monospace;
        font-weight: normal;
        font-size: 14px;

        &.bold {
            font-weight: bold;
        }
        
        &.courierPrime {
            font-family: 'Courier Prime';
        }
        &.verdana {
            font-family: Verdana, Arial, Helvetica, sans-serif;
        }
        &.times {
            font-family: 'Times New Roman', Times, serif;
        }
        &.comicSans {
            font-family: "Comic Sans MS", "Comic Sans", cursive;
        }
        &.openDyslexic {
            font-family: 'OpenDyslexic';
        }
    }

    .prattle {
        width: 600px;
        text-align: center;
        margin: 0 0 30px 0;
        
        ::v-deep img.fullWidth {
            position: relative;
            left: -25px;
        }
    }

    .authorlog {
        width: 600px;
        margin: 0 0 30px 0;
        border: 3px solid var(--page-pageBorder, var(--page-pageFrame));
        background: white;
        padding: 1px;
        text-align: center;
        align-self: center;
        .logContent{
            color: var(--font-log);
            padding: 15px 5%;
            text-align: left;
        }
    }

    .log {
        width: 600px;
        margin: 0 0 30px 0;
        border: 1px dashed var(--page-log-border);
        background: var(--page-log-bg);
        padding: 1px;
        text-align: center;
        align-self: center;
        
        &.highContrast {
            background: #ffffff;
        }
        button {
            text-transform: capitalize;
        }
        
        .logContent{
            color: var(--font-log);
            padding: 15px 5%;
            text-align: left;
        }

        &.logHidden {
            .logContent {
                display: none; 
            }
        }
    }
</style>


