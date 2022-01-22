<template>
    <div class="tabFrame" 
        :id="tab.key" 
        :class='{ 
            hidden: !tabIsActive,
            forceScrollBar: $localData.settings.forceScrollBar,
            forceLoad,  
        }'
        :tabindex="(tabIsActive) ? -1 : false" 
        v-if="isLoaded"
        @keyup.left="leftKeyPress"
        @keyup.right="rightKeyPress"
        @keyup.f5="reload"
        ref="tabFrame"
    >
        <component
            :class="theme"
            :is="resolveComponent" 
            :tab="tab" 
            :routeParams="routeParams" 
            ref="page"
        />
        
        <Bookmarks  :tab="tab" ref="bookmarks" />
        <MediaModal :tab="tab" ref="modal" />
        <FindBox    :tab="tab" ref="findbox"/>
        <JumpBox    :tab="tab" ref="jumpbox" />
    </div>
</template>

<script>
// const electron = require('electron')
import Bookmarks from '@/components/UIElements/Bookmarks.vue'
import MediaModal from '@/components/UIElements/MediaModal.vue'
import FindBox from '@/components/UIElements/FindBox.vue'
import JumpBox from '@/components/UIElements/JumpBox.vue'

import ERROR404 from '@/components/SystemPages/Error404.vue'
import SPOILER from '@/components/SystemPages/Spoiler.vue'

import HOMEPAGE from '@/components/SystemPages/Homepage.vue'
import NEWREADER from '@/components/SystemPages/NewReader.vue'
import USERGUIDE from '@/components/SystemPages/UserGuide.vue'
import MAP from '@/components/SystemPages/Map.vue'
import LOG from '@/components/SystemPages/Log.vue'
import SEARCH from '@/components/SystemPages/Search.vue'
import SETTINGS from '@/components/SystemPages/Settings.vue'
import CREDITS from '@/components/SystemPages/Credits.vue'

import PAGE from '@/components/Page/Page.vue'
import SINGLEPAGE from '@/components/Page/SinglePage.vue'
import FULLSCREENFLASH from '@/components/SpecialPages/fullscreenFlash.vue'
import X2COMBO from '@/components/SpecialPages/x2Combo.vue'
import TZPASSWORD from '@/components/SpecialPages/TzPassword.vue'
import ECHIDNA from '@/components/SpecialPages/Echidna.vue'
import ENDOFHS from '@/components/SpecialPages/EndOfHS.vue'

import UNLOCK from '@/components/Extras/Unlock.vue'
import DECODE from '@/components/Extras/Decode.vue'
import DESKTOPS from '@/components/Extras/Desktops.vue'
import EXTRASPAGE from '@/components/Extras/ExtrasPage.vue'
import PS_TITLESCREEN from '@/components/Extras/PS_titlescreen.vue'
import TBIY from '@/components/Extras/theBabyIs.vue'
import NAMCOHIGH from '@/components/Extras/NamcoHigh.vue'
import VIGILPRINCE from '@/components/Extras/VigilPrince.vue'
import SKAIANET from '@/components/Extras/Skaianet.vue'

import MUSIC from '@/components/Music/MusicFrame.vue'

import DSTRIDER from '@/components/Socials/DStrider.vue'
import BLOGSPOT from '@/components/Socials/Blogspot.vue'
import MAGICALJOURNEY from '@/components/Socials/MagicalJourney.vue'
import OFFERYOUCANTREFUSE from '@/components/Socials/OfferYouCantRefuse.vue'
import FORMSPRING from '@/components/Socials/Formspring.vue'
import TUMBLR from '@/components/Socials/Tumblr.vue'
import NEWS from '@/components/Socials/News.vue'

import SBAHJ from '@/components/Comics/sbahj.vue'
import PXS from '@/components/Comics/pxs.vue'
import TSO from '@/components/Comics/tso.vue'
import SNAPS from '@/components/Comics/Snaps.vue'

import TESTS from '@/components/Extras/tests.vue'

import ModBrowserPageMixin from '@/components/CustomContent/ModBrowserPageMixin.vue'

export default {
    name: 'TabFrame',
    props: [
        'tabKey'
    ],
    components : {
        Bookmarks,
        FindBox,
        JumpBox,
        MediaModal,

        ERROR404,
        SPOILER,

        HOMEPAGE,
        NEWREADER,
        USERGUIDE,
        MAP,
        LOG,
        SEARCH,
        SETTINGS,
        CREDITS,

        PAGE,
        FULLSCREENFLASH,
        X2COMBO,
        TZPASSWORD,
        ECHIDNA,
        ENDOFHS,
        SINGLEPAGE,
        
        UNLOCK,
        DECODE,
        DESKTOPS,
        EXTRASPAGE,
        PS_TITLESCREEN,
        TBIY,
        NAMCOHIGH,
        VIGILPRINCE,
        SKAIANET,

        MUSIC,
        DSTRIDER,
        BLOGSPOT,
        MAGICALJOURNEY,
        OFFERYOUCANTREFUSE,
        FORMSPRING,
        TUMBLR,
        NEWS,

        SBAHJ,
        PXS,
        TSO,
        SNAPS,

        TESTS
    },
    data() {
        return {
            forceLoad: false,
            gameOverThemeOverride: false,
            modBrowserPages: {}
        }
    },
    created(){
        this.$logger.info("Tabframe created")
        for (const COM in this.modBrowserPages) {
            let mixins = this.modBrowserPages[COM].component.mixins || []
            if (!mixins.includes(ModBrowserPageMixin)) {
                mixins.push(ModBrowserPageMixin)
                this.modBrowserPages[COM].component.mixins = mixins
            }
        }
    },
    computed: {
        tab() {
            return this.$localData.tabData.tabs[this.tabKey]
        },
        routeParams() {
            let base = this.tab.url.split('/').filter(Boolean)[0]
            return  {
                base: base || '', 
                ...this.$router.resolve(this.tab.url).route.params
            }
        },
        tabIsActive() {
            return this.tab.key == this.$localData.tabData.activeTabKey
        },
        isLoaded() {
            if (this.tabIsActive){
                this.$localData.root.TABS_PUSH_TO_LOADED_LIST(this.tab.key)
            }
            
            return (
                this.$localData.temp.loadedTabList.includes(this.tab.key) ||
                this.forceLoad ||
                this.tabIsActive 
            )
        },
        resolveComponent() {
            let mapRoute = {
                'mspa': 'Page',
                'jailbreak': 'Page',
                'bard-quest': 'Page',
                'problem-sleuth': 'Page',
                'blood-spade': 'Page',
                'beta': 'Page',
                'homestuck': 'Page',
                'story': 'Page',
                'ryanquest': 'Page',
                'waywardvagabond': 'ExtrasPage',
                'sweetbroandhellajeff': 'SBAHJ',
                'faqs': 'ExtrasPage',
                'oilretcon': 'ExtrasPage',
                'page': 'SinglePage'
            }
    
            const base = this.routeParams.base.toLowerCase()
            let component = (base in mapRoute ? mapRoute[base] : base).toUpperCase()
            if (!this.routeParams.base) component = 'Homepage'
            switch (component) {
                case 'PAGE': {
                    let convertedPage = this.$isVizBase(this.routeParams.base) ? this.$vizToMspa(this.routeParams.base, this.routeParams.p) : this.routeParams
                    let p = convertedPage.p ? convertedPage.p : undefined
                    if (!p || this.$pageIsSpoiler(p, true)) component = 'Spoiler'
                    else if ((this.routeParams.base === 'ryanquest' && !(p in this.$archive.mspa.ryanquest)) || (this.routeParams.base !== 'ryanquest' && !(p in this.$archive.mspa.story))) component = 'Error404'
                    else if (this.routeParams.base !== 'ryanquest') {
                        // If it's a new reader, take the opportunity to update the next allowed page for the reader to visit
                        if (this.$isNewReader) this.$updateNewReader(p)
                        
                        let flag = this.$archive.mspa.story[p].flag
                        
                        if (flag.includes('X2COMBO')) component = 'x2Combo'
                        else if (flag.includes('FULLSCREEN') || flag.includes('DOTA') || flag.includes('GAMEOVER') || flag.includes('SHES8ACK')) component = 'fullscreenFlash'
                        else if (flag.includes('TZPASSWORD')) component = 'TzPassword'
                        else if (flag.includes('ECHIDNA')) component = 'Echidna'
                        else if (flag.includes('ENDOFHS')) component = 'EndOfHs'
                    }
                    break
                }
                case 'MUSIC': {
                    if (this.routeParams.mode == 'album') {
                        if (!(this.routeParams.id in this.$archive.music.albums)) component = 'Error404'
                        else if (this.$albumIsSpoiler(this.routeParams.id)) component = 'Spoiler'
                    }
                    else if (this.routeParams.mode == 'track') {
                        if (!(this.routeParams.id in this.$archive.music.tracks)) component = 'Error404'
                        else if (this.$trackIsSpoiler(this.routeParams.id)) component = 'Spoiler'
                    }
                    else if (this.routeParams.mode == 'artist') {
                        if (!(this.routeParams.id in this.$archive.music.artists)) component = 'Error404'
                    }
                    else if (this.routeParams.mode && !['tracks', 'artists', 'features'].includes(this.routeParams.mode)) component = 'Error404'
                    break
                }
                case 'SBAHJ': {
                    let num = parseInt(this.routeParams.cid)
                    if (!num || num < 0 || num > 54 || num == 39) component = 'Error404'
                    break
				}
				case 'PXS': {
					if (this.$pageIsSpoiler('008753')) component = 'Spoiler'
					// else if (this.routeParams.cid) {
					// 	let p = parseInt(this.routeParams.pid)
					// 	let data = this.$archive.comics.pxs.comics[this.routeParams.cid]
					// 	if (this.routeParams.cid && (!this.$archive.comics.pxs.list.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
					// }
					break
				}
				case 'TSO': {
                    if (this.routeParams.cid) {
                        let p = parseInt(this.routeParams.pid)
                        let validComics = this.$archive.comics.tso.list.map(x => typeof(x) === 'object' ? x.list : x).flat()
                        let data = this.$archive.comics.tso.comics[this.routeParams.cid]
                        if (this.routeParams.cid && (!validComics.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
                    }
                    break
                }
                case 'SNAPS': {
                    if (this.$isNewReader) component = 'Spoiler'
                    else if (this.routeParams.cid) {
                        let p = parseInt(this.routeParams.pid)
                        let data = this.$archive.comics.snaps.comics[this.routeParams.cid]
                        if (this.routeParams.cid && (!this.$archive.comics.snaps.list.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
                    }
                    break
                }
                case 'SKAIANET': {
                    if (this.$isNewReader) component = 'Spoiler'
                    else if (this.routeParams.cursed_history && (this.routeParams.cursed_history != 'cursed_history' || !this.$localData.settings.cursedHistory)) component = 'Error404'
                    break
                }
                case 'UNLOCK': {
                    if (this.routeParams.p === 'ps_titlescreen') component = 'PS_titlescreen'
                    else if (this.routeParams.p in this.$archive.mspa.psExtras) {
                        if ((this.routeParams.p == 'ps000039' && this.$pageIsSpoiler('003655')) || (this.routeParams.p == 'ps000040' && this.$pageIsSpoiler('003930'))) component = 'Spoiler'
                        else component = 'ExtrasPage'
                    }
                    else if (this.routeParams.p) component = 'Error404'
                    break
                }
                case 'EXTRASPAGE': {
                    let validBases = ['waywardvagabond', 'faqs', 'oilretcon']
                    if (validBases.includes(this.routeParams.base)) {
                        if (this.routeParams.base == 'waywardvagabond') {
                            let pages = {
                                recordsastutteringstep: '002148',
                                anunsealedtunnel: '002171',
                                anagitatedfinger: '002339',
                                astudiouseye: '002409',
                                beneaththegleam: '002623',
                                asentrywakens: '002744',
                                windsdownsideways: '002770',
                                preparesforcompany: '002921'
                            }
                            if (!(this.routeParams.p in pages)) component = 'Error404'
                            else if (this.$pageIsSpoiler(pages[this.routeParams.p])) component = 'Spoiler'
                        }
                        else if (this.routeParams.base == 'faqs' && !(this.routeParams.p in this.$archive.mspa.faqs)) component = 'Error404'
                        else if (this.routeParams.base == 'oilretcon' && this.$pageIsSpoiler('008993')) component = 'Spoiler'
                    }
                    else component = 'Error404'
                    break
                }
                case 'NAMCOHIGH': {
                    if (this.$pageIsSpoiler('008135')) component = 'Spoiler'
                    else if (this.routeParams.play && this.routeParams.play !== 'play') component = 'Error404'
                    break
                }
                case "DECODE":
                    if (this.routeParams.mode) {
                    if (!['morse','alternian','damaramegido'].includes(this.routeParams.mode)) component ='Error404' 
                    if (
                        (this.routeParams.mode === 'alternian' && this.$pageIsSpoiler('003890')) ||
                        (this.routeParams.mode === 'damaramegido' && this.$pageIsSpoiler('007298')) 
                    ) component = 'Spoiler'
                    }
                    break
                case 'BLOGSPOT': {
                    if (this.routeParams.id === 'magicaljourney') component = 'MagicalJourney'
                    else if (this.routeParams.id === 'offeryoucantrefuse') component = 'OfferYouCantRefuse'
                    else if (this.$pageIsSpoiler('002821')) component = 'Spoiler'
                    break
                }
                case 'DSTRIDER': {
                    if (this.$pageIsSpoiler('003053')) component = 'Spoiler'
                    break
                }
                case 'FORMSPRING': {
                    if (this.$pageIsSpoiler('003474')) component = 'Spoiler'
                    break
                }
                case 'TUMBLR': {
                    if (this.$pageIsSpoiler('006010')) component = 'Spoiler'
                    break
                }
                case "DESKTOPS": {
                    if (this.$pageIsSpoiler('003257')) component = 'Spoiler'
                    break
                }
                case "TBIY": {
                    if (this.$pageIsSpoiler('004527')) component = 'Spoiler'
                    break
                }
            }
            
            let result = 
                (component.toUpperCase() in this.$options.components)
                || (component.toUpperCase() in this.modBrowserPages)
                ? component.toUpperCase() 
                : 'ERROR404'
            this.setTitle(result)
            return result
        },
        contentTheme() {
            // Get the expected theme for this page, based on the content
            let theme = 'default'
            const component = this.resolveComponent

            // if (this.gameOverThemeOverride) return this.gameOverThemeOverride

            const componentObj = this.$options.components[component]
            if (componentObj && componentObj.theme) {
                const context = this
                theme = componentObj.theme(context) || theme
            }

            return theme
        },
        theme() {
            // Get the actual displayed theme, factoring in settings.
            let page_theme = this.contentTheme || 'default'
            let set_theme = this.$localData.settings.themeOverride
            let theme = page_theme

            if (set_theme) {
              if (page_theme != 'default') {
                // Page has a theme
                if (this.$localData.settings.forceThemeOverride) {
                  // If force is on, use the override theme
                  theme = set_theme
                } else {
                  theme = page_theme
                }
              } else {
                theme = set_theme
              }
            }
            return (theme == 'default' ? 'mspa' : theme)
        }
    },
    methods: {
        reload() {
            const u = this.tab.url
            this.tab.url = "blank"
            this.$nextTick(function () {
                this.tab.url = u
            })
        },
        leftKeyPress(e) {
            if (this.$localData.settings.arrowNav && this.$refs.page.keyNavEvent && !e.altKey && document.activeElement.tagName != 'INPUT') this.$refs.page.keyNavEvent('left', e)
        },
        rightKeyPress(e) {
            if (this.$localData.settings.arrowNav && this.$refs.page.keyNavEvent && !e.altKey && document.activeElement.tagName != 'INPUT') this.$refs.page.keyNavEvent('right', e)
        },
        toggleBookmarks() {
            this.$refs.bookmarks.toggle()
        },
        closeBookmarks() {
            this.$refs.bookmarks.close()
        },
        toggleFindBox() {
            this.$refs.findbox.toggle()
        },
        closeFindBox() {
            this.$refs.findbox.close()
        },
        toggleJumpBox() {
            this.$refs.jumpbox.toggle()
        },
        closeJumpBox() {
            this.$refs.jumpbox.close()
        },
        openModal(url) {
            this.$refs.modal.open(url)
        },
        setTitle(component = this.resolveComponent){
            // you would not believe how bad this used to be
            let title

            const componentObj = this.$options.components[component]
            if (componentObj && componentObj.title) {
                const context = this
                title = componentObj.title(context)
            } else {
                title = this.tab.url
            }
            
            this.$localData.root.TABS_SET_TITLE(this.tab.key, title)
        }
    },
    updated(){
      this.$nextTick(function () {
        this.$localData.root.TABS_SET_HASAUDIO(this.tab.key, (this.$el.querySelectorAll && this.$el.querySelectorAll(`iframe, video, audio`).length > 0))
      })
    },
    watch: {
        'tabIsActive'(to, from) {
            if (to)
                this.$root.tabTheme = this.theme
            // Prevents tab from unloading if there's anything that might need to run in the background
            if (!to) this.forceLoad = document.querySelectorAll(`[id='${this.tab.key}'] iframe, [id='${this.tab.key}'] video, [id='${this.tab.key}'] audio`).length > 0
            else if (this.forceLoad) {
                // Iframes kept freezing content after switching tabs. Presumably they thought they were supposed to be inactive?
                // Easiest hack I found to get them moving again was to force the browser to redraw them. I apologise for nothing. 
                this.$el.style.borderTop = 'solid 1px #000000FF'
                setTimeout(() =>{
                    this.$el.style.borderTop = ''
                }, 10)
            }
        },
        '$localData.settings.hqAudio'() {
            this.forceLoad = false
        },
        '$localData.settings.jsFlashes'() {
            this.forceLoad = false
        },
        '$localData.settings.bolin'() {
            this.forceLoad = false
        }
    },
    mounted(){
        this.setTitle()
        if (this.tabIsActive) {
            this.$nextTick(() => {
                // This fixes the "first loaded tab is unthemed"
                // bug and does nothing else. Really.
                this.$root.$refs['App'].checkTheme()
            })
        }
    },
    destroyed() {
        // Iframes sometimes decide to keep running in the background forever, so we manually clean them up
        let iframes = document.querySelectorAll(`[id='${this.tab.key}'] iframe`)
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].parentNode.removeChild(iframes[i])
        }
    }
}
</script>

<style lang="scss" scoped>
    .tabFrame {
        background-color: var(--page-pageBody);
        flex-grow: 1;
        display: grid;
        outline: none;
        position: relative;
        overflow-x: auto;
        overflow-y: auto;

        &.forceScrollBar {
            overflow-y: scroll;
        }
    }
    ::v-deep .findBoxSelected {
        background-color: var(--find--highlight) !important;
        color: var(--font-highlight, var(--font-default)) !important;
    }
</style>
