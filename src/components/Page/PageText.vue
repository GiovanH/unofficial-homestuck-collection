<template>
    <p class="prattle text" :class="fontFamily" :style="fontStyle" 
        v-html="filteredPrattle" v-if="textType == 'prattle' && !!content" />

    <div class="log" :class="{logHidden: logHidden, darkBackground: isDarkBackground}" v-else-if="textType == 'log'">
        <div class="bgshade" v-if="$localData.settings.textOverride.highContrast" :style="{background: isDarkBackground ? '#000A' : '#FFFA'}"/>
		<button class="logButton" @click="loggle()">
            {{ logButtonText }}
		</button>
		<p class="logContent text" :class="fontFamily" :style="fontStyle" 
         v-html="content.replace(/\|.*?\| *\<br \/\>/, '')"></p>
        <component is="style" v-if="$localData.settings.textOverride.paragraphSpacing">
          .log .logContent span:not(:first-child) {
            padding-top: 1em;
            display: inline-block;
            white-space: pre-wrap;
          }          
          .log .logContent span + span, 
          .log .logContent br + br + span {
            padding: initial;
            display: inline !important;
          }
        </component>
	</div>

    <div class="authorlog" v-else-if="textType == 'authorlog'">
		<p class="logContent text" :class="fontFamily" :style="fontStyle" 
            v-html="content.replace(/\|.*?\| *\<br ?\/?\>/, '')"></p>
        <component is="style" v-if="$localData.settings.textOverride.paragraphSpacing">
          .authorlog .logContent span:not(:first-child) {
            padding-top: 1em;
            display: inline-block;
            white-space: pre-wrap;
          }
          .authorlog .logContent span + span, 
          .authorlog .logContent br + br + span {
            padding: initial;
            display: inline !important;
          }
        </component>
	</div>
    <span v-else data-placeholder />

</template>

<script>

var Color = require('ts-color-class')

export default {
    name: 'pageText',
    props: ['pageId', 'content', 'forcetheme', 'startopen'],
    data() {
        return {
            usePurpleLinks: false,
            logHidden: true,
            isMounted: false,
            lightnessOffset: 0.3,
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
        theme(){
            return this.forcetheme || this.$root.tabTheme.rendered
        },
        isDarkBackground() {
            this.theme; this.isMounted;
            const bgcolor_repr = this.textType == 'log'
                ? this.getComputedStyle('--page-log-bg')
                : this.textType == 'prattle'
                ? this.getComputedStyle('--page-pageContent')
                : this.textType == 'authorlog'
                ? 'white'
                : undefined

            return (new Color(bgcolor_repr || 'white').getLightness() < 0.5)
        },
        fontStyle() {
            const fontSizes = ['1em', '1.15em', '1.3em', '1.45em', '1.6em', '1.75em', '1.9em']
            const lineHeights = [1.15, 1.35, 1.5, 1.65, 1.85, 2, 2.15]
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
            const state = (this.logHidden) ? 'Show ' : 'Hide '

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
        open() {
          this.logHidden = false
        },
        getTextType(content) {
            if (!content) return null

            if (/^\|AUTHORLOG\|/.test(content)){
                return "authorlog"
            } else if (/^\|.*?\|/.test(content)){
                return "log"
            } else {
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
                if (this.$localData.settings.textOverride.highContrast) {
                    this.$el.querySelectorAll("span[style]").forEach(e => {
                        if (!e.style.color) return
                        let textcolor = new Color(e.style.color)

                        const lightnessExtrema = 
                            this.isDarkBackground
                            ? (1 - this.lightnessOffset)
                            : this.lightnessOffset
                        const needClampLightness = 
                            this.isDarkBackground
                            ? (textcolor.getLightness() < lightnessExtrema) // Too dark
                            : (textcolor.getLightness() > lightnessExtrema) // Too light

                        if (needClampLightness) {
                            e.setAttribute("data-orig-color", textcolor.toString())
                            textcolor = textcolor.lightness(lightnessExtrema)
                            e.style.color = textcolor.toString()
                        }

                        const saturationExtrema = 0.5
                        const needClampsaturation = (textcolor.getSaturation() < saturationExtrema) && textcolor.getHue()

                        if (needClampsaturation) {
                            e.setAttribute("data-orig-color", textcolor.toString())
                            e.setAttribute("data-orig-hue", textcolor.getHue())
                            textcolor = textcolor.saturation(saturationExtrema)
                            e.style.color = textcolor.toString()
                        }
                    })
                } else {
                    this.$el.querySelectorAll("span[data-orig-color]").forEach(e => {
                        e.style.color = e.getAttribute("data-orig-color")
                    })
                }
            }
        },
        getComputedStyle(var_name, default_){
            this.theme; this.isMounted;
            try {
                return getComputedStyle(this.$el).getPropertyValue(var_name).trim() || default_
            } catch {
                return getComputedStyle(document.body).getPropertyValue(var_name).trim() || default_
            }
        },
    },
    mounted() {
        if (this.$localData.settings.openLogs || this.startopen) {
            // Manual exception for pre-ministrife fakeout
            this.logHidden = this.pageId == '007326' 
        }

        this.$nextTick(() => {
            this.isMounted = true
            this.filterDOM()
        })
    },
    watch: {
        'purpleLinkWatcher'() {
            if (this.usePurpleLinks) this.filterDOM()
        },
        'isDarkBackground'(to, from){
            this.$logger.info("Background changed, refiltering DOM")
            this.$nextTick(() => {
                this.filterDOM()
            })
        },
        '$localData.settings.textOverride.highContrast'(to, from){
            this.$logger.info("Highcontrast changed, refiltering DOM")
            this.$nextTick(() => {
                this.filterDOM()
            })
        },
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
        &.darkBackground .logContent img {
            &[src="assets://storyfiles/hs2/scraps/shades.png"],
            &[src="assets://storyfiles/hs2/scraps/trollc00l.gif"],
            {
                filter: invert(1);
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
        position: relative;
        
        // &.highContrast {
        //     background: #ffffff;
        // }
        button {
            text-transform: capitalize;
            position: inherit;
            z-index: 0;
        }
        
        .logContent{
            color: var(--font-log);
            padding: 15px 5%;
            text-align: left;
            position: inherit;
            z-index: 1;
        }

        &.logHidden {
            .logContent, .bgshade {
                display: none; 
            }
        }

        .bgshade {
            width: 100%;
            height: 100%;
            position: absolute;
            pointer-events: none;
            top: 0;
            left: 0;
            z-index: 0;
        }
    }
</style>


