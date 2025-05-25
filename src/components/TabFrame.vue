<template>
    <div class="tabFrame" 
        :id="tab.key" 
        :class="[
            theme,
            {
                hidden: !tabIsActive,
                forceScrollBar: (
                    $localData.settings.forceScrollBar
                ),
                loading: !isComponentLoaded,
                forceLoad
            }
        ]"
        :tabindex="(tabIsActive) ? -1 : false" 
        v-if="isElementRendered"
        @keyup.left="leftKeyUp"
        @keyup.right="rightKeyUp"
        @keydown.space="spaceBarDown"
        @keyup.space="spaceBarUp"
        @keyup.f5="reload"
        ref="tabFrame"
    >
        <component
            :class="theme"
            :is="loadedResolvedComponent"
            :data-component="loadedResolvedComponent"
            :tab="tab" 
            :routeParams="subComponentRouteParams || routeParams"
            ref="page"
        />
        
        <Bookmarks  :tab="tab" ref="bookmarks" :class="theme" />
        <MediaModal :tab="tab" ref="modal" />
        <FindBox    :tab="tab" ref="findbox" :class="theme" v-if="!$isWebApp" />
        <JumpBox    :tab="tab" ref="jumpbox" :class="theme" />
    </div>
</template>

<script>
// const electron = require('electron')
import Bookmarks from '@/components/UIElements/Bookmarks.vue'
import MediaModal from '@/components/UIElements/MediaModal.vue'
import JumpBox from '@/components/UIElements/JumpBox.vue'
import GenericPage from '@/components/UIElements/GenericPage.vue'

import ModBrowserPageMixin from '@/components/CustomContent/ModBrowserPageMixin.vue'

const FindBox = () => import('@/components/UIElements/FindBox.vue')

const ERROR404 = () => import('@/components/SystemPages/Error404.vue')
const SPOILER = () => import('@/components/SystemPages/Spoiler.vue')

const HOMEPAGE = () => import('@/components/SystemPages/Homepage.vue')
const HELP = () => import('@/components/SystemPages/Help.vue')
const MAP = () => import('@/components/SystemPages/Map.vue')
const LOG = () => import('@/components/SystemPages/Log.vue')
const SEARCH = () => import('@/components/SystemPages/Search.vue')
const SETTINGS = () => import('@/components/SystemPages/Settings.vue')
const CREDITS = () => import('@/components/SystemPages/Credits.vue')

const PAGE = () => import('@/components/Page/Page.vue')
const SINGLEPAGE = () => import('@/components/Page/SinglePage.vue')
const FULLSCREENFLASH = () => import('@/components/SpecialPages/fullscreenFlash.vue')
const X2COMBO = () => import('@/components/SpecialPages/x2Combo.vue')
const TZPASSWORD = () => import('@/components/SpecialPages/TzPassword.vue')
const ECHIDNA = () => import('@/components/SpecialPages/Echidna.vue')
const ENDOFHS = () => import('@/components/SpecialPages/EndOfHS.vue')

const UNLOCK = () => import('@/components/Extras/Unlock.vue')
const DECODE = () => import('@/components/Extras/Decode.vue')
const DESKTOPS = () => import('@/components/Extras/Desktops.vue')
const EXTRASPAGE = () => import('@/components/Extras/ExtrasPage.vue')
const PS_TITLESCREEN = () => import('@/components/Extras/PS_titlescreen.vue')
const TBIY = () => import('@/components/Extras/theBabyIs.vue')
const NAMCOHIGH = () => import('@/components/Extras/NamcoHigh.vue')
const VIGILPRINCE = () => import('@/components/Extras/VigilPrince.vue')
const SKAIANET = () => import('@/components/Extras/Skaianet.vue')
const SQUIDDLES = () => import('@/components/Extras/Squiddles.vue')
const EVENMORE = () => import('@/components/Extras/EvenMore.vue')

const EPILOGUES = () => import('@/components/Beyond/Epilogues.vue')

const MUSIC = () => import('@/components/Music/MusicFrame.vue')

const SOCIALS = () => import('@/components/Socials/Socials.vue')
const DSTRIDER = () => import('@/components/Socials/DStrider.vue')
const BLOGSPOT = () => import('@/components/Socials/Blogspot.vue')
const MAGICALJOURNEY = () => import('@/components/Socials/MagicalJourney.vue')
const OFFERYOUCANTREFUSE = () => import('@/components/Socials/OfferYouCantRefuse.vue')
const FORMSPRING = () => import('@/components/Socials/Formspring.vue')
const TUMBLR = () => import('@/components/Socials/Tumblr.vue')
const NEWS = () => import('@/components/Socials/News.vue')

const SBAHJ = () => import('@/components/Comics/sbahj.vue')
const PXS = () => import('@/components/Comics/pxs.vue')
const TSO = () => import('@/components/Comics/tso.vue')
// import SNAPS from '@/components/Comics/Snaps.vue'
const SNAPS = () => import('@/components/Comics/Snaps.vue')
const MSPFADISAMBIG = () => import('@/components/CustomContent/MSPFADisambig.vue')

const TESTS = () => import('@/components/Extras/tests.vue')
const EDITOR = () => import('@/components/CustomContent/PageEditor.vue')

const preload_components = [
    HOMEPAGE,

    PAGE,
    FULLSCREENFLASH,
    X2COMBO,
    TZPASSWORD,
    ECHIDNA,
    ENDOFHS
]

const COMPONENT_LOADING = undefined // "GenericPage"
const COMPONENT_FIRSTLOAD = 'GenericPage'

export default {
    name: 'TabFrame',
    props: [
        'tabKey'
    ],
    components: {
        GenericPage,

        Bookmarks,
        FindBox,
        JumpBox,
        MediaModal,

        ERROR404,
        SPOILER,

        HOMEPAGE,
        HELP,
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
        SQUIDDLES,
        EVENMORE,

        EPILOGUES,

        MUSIC,
        SOCIALS,
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

        TESTS,
        EDITOR,
        MSPFADISAMBIG
    },
    data() {
        return {
            scrollTopPrev: 0,
            gameOverThemeOverride: false, // Set by fullscreenFlash.vue
            modBrowserPages: {},
            lastContentTheme: undefined, // Cache the previous contentTheme for smoother transitions,
            loadedResolvedComponent: COMPONENT_FIRSTLOAD, // Don't change component until it's loaded so the page "hangs" a second before changing, instead of blanking out.
            subComponentRouteParams: undefined // Keep routeParams tied to the resolved component so templates don't get unexpected input (e.g. unexpected params from the next, as-of-yet unloaded page component)
        }
    },
    created(){
        for (const COM in this.modBrowserPages) {
            const mixins = this.modBrowserPages[COM].component.mixins || []
            if (!mixins.includes(ModBrowserPageMixin)) {
                mixins.push(ModBrowserPageMixin)
                this.modBrowserPages[COM].component.mixins = mixins
            }
        }
    },
    asyncComputed: {
        async componentOptions() {
            var component_or_promise = this.$options.components[this.resolveComponent]

            // un-promisify if possible
            component_or_promise = (component_or_promise.resolved?.extendOptions || component_or_promise)

            if (typeof component_or_promise == "function") {
                // console.debug("import is waiting for", this.resolveComponent)
                return (await component_or_promise())?.default
            } else {
                // console.debug("already resolved promise for", this.resolveComponent)
                return component_or_promise
            }
        }
    },
    computed: {
        tab() {
            return this.$localData.tabData.tabs[this.tabKey]
        },
        isComponentLoaded() {
            return (this.loadedResolvedComponent == this.resolveComponent)
        },
        routeParams() {
            const base = this.tab.url.split('/').filter(Boolean)[0]
            return  {
                base: (base || '').toLowerCase(), 
                ...this.$router.resolve(this.tab.url).route.params
            }
        },
        tabIsActive() {
            return this.tab.key == this.$localData.tabData.activeTabKey
        },
        isElementRendered() {
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
            const mapRoute = {
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
                'page': 'SinglePage',
                'mspfa': 'MSPFADisambig'

            }
    
            const base = this.routeParams.base.toLowerCase()
            let component = (base in mapRoute ? mapRoute[base] : base).toUpperCase()
            if (!this.routeParams.base) component = 'Homepage'
            switch (component) {
                case 'PAGE': {
                    // Construct canonical story name and page number
                    let story_id
                    let page_num
                    const is_ryanquest = this.routeParams.base === 'ryanquest'
                    if (this.$isVizBase(this.routeParams.base)) {
                        const {s, p} = this.$vizToMspa(this.routeParams.base, this.routeParams.p)
                        story_id = s
                        page_num = p
                    } else {
                        page_num = this.routeParams.p
                        const tryLookup = this.$mspaToViz(page_num, is_ryanquest)
                        if (tryLookup) {
                            story_id = tryLookup.s
                        } else {
                            story_id = undefined // MSPA number does not map to valid viz story
                        }
                    }

                    // Lock ryanquest to mspa numbers for now
                    // if (is_ryanquest) {
                    //     page_num = this.$vizToMspa(this.routeParams.base, page_num).p
                    // }

                    const isTzPassword = !this.$archive
                        ? false
                        : (this.$archive.tweaks.tzPasswordPages.includes(page_num))
                    
                    if (!(page_num && story_id)) component = 'Error404'
                    else if (this.$pageIsSpoiler(page_num, true) && !isTzPassword) component = 'Spoiler'
                    else if (
                        (story_id === 'ryanquest' && !(page_num in this.$archive.mspa.ryanquest)) || 
                        (story_id !== 'ryanquest' && !(page_num in this.$archive.mspa.story))
                    ) component = 'Error404'
                    else if (this.routeParams.base !== 'ryanquest') {
                        // If it's a new reader, take the opportunity to update the next allowed page for the reader to visit
                        this.$updateNewReader(page_num)
                        
                        const flag = this.$archive.mspa.story[page_num].flag
                        
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
                    } else if (this.routeParams.mode == 'track') {
                        if (!(this.routeParams.id in this.$archive.music.tracks)) component = 'Error404'
                        else if (this.$trackIsSpoiler(this.routeParams.id)) component = 'Spoiler'
                    } else if (this.routeParams.mode == 'artist') {
                        if (!(this.routeParams.id in this.$archive.music.artists)) component = 'Error404'
                    } else if (this.routeParams.mode && !['tracks', 'artists', 'features'].includes(this.routeParams.mode)) component = 'Error404'
                    break
                }
                case 'SBAHJ': {
                    const num = parseInt(this.routeParams.cid)
                    if (!num || num < 0 || num > 54 || num == 39) component = 'Error404'
                    break
                }
                case 'PXS': {
                    if (this.$pageIsSpoiler('008753')) component = 'Spoiler'
                    // Paradox Space has its own internal 404 handler
                    // else if (this.routeParams.cid && !['archive', 'news', 'credits'].includes(this.routeParams.cid)) {
                    //     let p = parseInt(this.routeParams.pid) || 1
                    //     let data = this.$archive.comics.pxs.comics[this.routeParams.cid]
                    //     if (this.routeParams.cid && (!this.$archive.comics.pxs.list.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
                    // }
                    break
                }
                case 'TSO': {
                    if (this.routeParams.cid) {
                        const p = parseInt(this.routeParams.pid)
                        const validComics = this.$archive.comics.tso.list.map(x => typeof (x) === 'object' ? x.list : x).flat()
                        const data = this.$archive.comics.tso.comics[this.routeParams.cid]
                        if (this.routeParams.cid && (!validComics.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
                    }
                    break
                }
                case 'SNAPS': {
                    if (this.$isNewReader) component = 'Spoiler'
                    else if (this.routeParams.cid) {
                        const p = parseInt(this.routeParams.pid)
                        const data = this.$archive.comics.snaps.comics[this.routeParams.cid]
                        if (this.routeParams.cid && (!this.$archive.comics.snaps.list.includes(this.routeParams.cid) || !data || !Number.isInteger(p) || data.pages.length < p || p < 1)) component = 'Error404'
                    }
                    break
                }
                case 'SKAIANET': {
                    if (this.$isNewReader) component = 'Spoiler'
                    else if (this.routeParams.cursed_history && (this.routeParams.cursed_history != 'cursed_history' || !this.$localData.settings.cursedHistory)) component = 'Error404'
                    break
                }
                case 'SQUIDDLES': {
                    if (this.$pageIsSpoiler('004432')) component = 'Spoiler'
                    break
                }
                case 'UNLOCK': {
                    if (this.routeParams.p && this.routeParams.p.toLowerCase() === 'ps_titlescreen') component = 'PS_titlescreen'
                    else if (this.routeParams.p in this.$archive.mspa.psExtras) {
                        if ((this.routeParams.p == 'ps000039' && this.$pageIsSpoiler('003655')) || (this.routeParams.p == 'ps000040' && this.$pageIsSpoiler('003930'))) component = 'Spoiler'
                        else component = 'ExtrasPage'
                    } else if (this.routeParams.p) component = 'Error404'
                    break
                }
                case 'EXTRASPAGE': {
                    const validBases = ['waywardvagabond', 'faqs', 'oilretcon']
                    if (validBases.includes(this.routeParams.base)) {
                        if (this.routeParams.base == 'waywardvagabond') {
                            const pages = {
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
                        } else if (this.routeParams.base == 'faqs' && !(this.routeParams.p in this.$archive.mspa.faqs)) component = 'Error404'
                        else if (this.routeParams.base == 'oilretcon' && this.$pageIsSpoiler('008993')) component = 'Spoiler'
                    } else component = 'Error404'
                    break
                }
                case 'NAMCOHIGH': {
                    if (this.$pageIsSpoiler('008135')) component = 'Spoiler'
                    else if (this.routeParams.play && this.routeParams.play !== 'play') component = 'Error404'
                    break
                }
                case "DECODE":
                    if (this.routeParams.mode) {
                    if (!['morse', 'alternian', 'damaramegido'].includes(this.routeParams.mode)) component = 'Error404'
                    if (
                        (this.routeParams.mode === 'alternian' && this.$pageIsSpoiler('003890')) ||
                        (this.routeParams.mode === 'damaramegido' && this.$pageIsSpoiler('007298'))
                        )
                        component = 'Spoiler'
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
            
            const result = 
                (component.toUpperCase() in this.$options.components) ||
                (component.toUpperCase() in this.modBrowserPages)
                ? component.toUpperCase() 
                : 'ERROR404'
            return result
        },
        contentTheme() {
            // Get the expected theme for this page, based on the content
            let theme = 'default'

            const componentObj = this.componentOptions
            if (!componentObj || (this.resolveComponent != this.loadedResolvedComponent)) {
                return this.lastContentTheme || "default"
            }

            // if (this.gameOverThemeOverride) return this.gameOverThemeOverride

            if (componentObj && componentObj.theme) {
                const context = this
                try {
                    theme = componentObj.theme(context) || theme
                } catch (e) {
                    this.$logger.error("Error in theme function", e)
                }
            }

            return theme
        },
        theme() {
            // Get the actual displayed theme, factoring in settings.
            const page_theme = this.contentTheme || 'default'
            const set_theme = this.$localData.settings.themeOverride
            let theme = page_theme

            if (set_theme != 'default') {
              // Treat 'retro' for bq/ps/jb as "no special theme", for override/dark mode purposes.
              if (page_theme != 'default' && page_theme != 'retro') {
                // Page has a special theme
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
        },
        forceLoad(){
            return this.tab.hasEmbed
        }
    },
    methods: {
        reload() {
            // const u = this.tab.url
            const component = this.loadedResolvedComponent
            this.loadedResolvedComponent = "GenericPage"
            this.$nextTick(function () {
                this.loadedResolvedComponent = component
            })
        },
        leftKeyUp(e) {
            if (this.$localData.settings.arrowNav && 
                this.$refs.page.keyNavEvent && 
                !e.altKey && 
                document.activeElement.tagName != 'INPUT' &&
                document.activeElement.tagName != 'OBJECT') {
                if (this.$el.scrollLeft == 0) {
                    // Only send event if scrolling doesn't happen
                    this.$refs.page.keyNavEvent('left', e)
                }
            }
        },
        rightKeyUp(e) {
            if (this.$localData.settings.arrowNav && 
                this.$refs.page.keyNavEvent && 
                !e.altKey && 
                document.activeElement.tagName != 'INPUT' &&
                document.activeElement.tagName != 'OBJECT') {
                const frameEl = this.$el
                // Really weird workaround here for what I think is a subpixel math bug:
                // Depending on zoom/dpi, frameEl.scrollWidth can be (frameEl.clientWidth - 1)
                // even when fully scrolled
                if (frameEl.scrollLeft + frameEl.clientWidth >= (frameEl.scrollWidth - 1)) {
                    // Only send event if scrolling doesn't happen
                    this.$refs.page.keyNavEvent('right', e)
                }
            }
        },
        spaceBarDown(e) {
            this.scrollTopPrev = this.$el.scrollTop
        },
        spaceBarUp(e) {
            if (this.$localData.settings.arrowNav && 
                this.$refs.page.spaceBarEvent && 
                document.activeElement.tagName != 'INPUT' &&
                document.activeElement.tagName != 'BUTTON') {
                const frameEl = this.$el
                if (frameEl.scrollTop == this.scrollTopPrev) {
                    // Only send event if scrolling wasn't detected since the keyDown event
                    this.$refs.page.spaceBarEvent(e)   
                }
            }
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
        onFinishNavigate() {
            this.setTitle()
        },
        setTitle() {
            // you would not believe how bad this used to be
            let title

            const componentObj = this.componentOptions

            if (!componentObj) {
                // Component object isn't import-loaded, use cached title.
                return
            }

            if (componentObj.title) {
                const context = this
                try {
                    title = componentObj.title(context)
                } catch (e) {
                    this.$logger.error("Error in theme function", e)
                }
            } else {
                this.$logger.warn("Missing title function for", componentObj.name, componentObj.title)
                title = this.tab.url
            }

            if (title)
                this.$localData.root.TABS_SET_TITLE(this.tab.key, title)
        }
    },
    updated(){
        this.$nextTick(function () {
            this.$localData.root.TABS_SET_HASEMBED(this.tab.key, (this.$el.querySelectorAll && this.$el.querySelectorAll(`iframe, video:not([muted]), audio`).length > 0))
        })
    },
    watch: {
        'tabIsActive'(to, from) {
            if (to && this.forceLoad) {
                // Iframes kept freezing content after switching tabs. Presumably they thought they were supposed to be inactive?
                // Easiest hack I found to get them moving again was to force the browser to redraw them. I apologise for nothing. 
                this.$el.style.borderTop = 'solid 1px #000000FF'
                setTimeout(() => {
                    this.$el.style.borderTop = ''
                }, 10)
            }
        },
        'loadedResolvedComponent'(to, from) {
            // Component and url changes
            this.onFinishNavigate()
            this.subComponentRouteParams = this.routeParams
        },
        'tab.url'(to, from) {
            if (this.isComponentLoaded) {
                // If componentObj still points to the old component,
                // don't try to call setTitle with the new url params!
                this.onFinishNavigate()
            }
            // Has the component loaded yet? If not, clean screen.
            if (COMPONENT_LOADING && !this.isComponentLoaded) {
                this.loadedResolvedComponent = COMPONENT_LOADING
            }
        },
        'contentTheme'(to, from) {
            this.lastContentTheme = to
        },
        'componentOptions'(to, from) {
            // Promise finished, we've loaded the current resolved component.
            this.loadedResolvedComponent = this.resolveComponent
        },
        'routeParams'(to, from) {
            // If the route params change without the component changing, update the component too. Otherwise wait for the component.
            if (this.isComponentLoaded) {
                this.subComponentRouteParams = this.routeParams
            }
        }
    },
    mounted(){
        this.setTitle()
        if (!window.isWebApp) {
            // Object.values(this.$options.components)
            preload_components
                .filter(v => (typeof v == "function"))
                .filter(f => !f.resolved)
                .forEach(f => {
                    try {
                        f()
                        // .then(module => {
                        //     this.$logger.info("preloaded", module.default.name)
                        // })
                    } catch {
                        // f is a function but not a promise
                    }
                })
        }
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
        if (this.$el.querySelectorAll) {
            const iframes = this.$el.querySelectorAll(`iframe`)
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].parentNode.removeChild(iframes[i])
            }
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

        &.loading {
            cursor: wait;
        }
    }
    ::v-deep .findBoxSelected {
        background-color: var(--find--highlight) !important;
        color: var(--font-highlight, var(--font-default)) !important;
    }
</style>
