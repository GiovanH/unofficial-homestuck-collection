<template>
    <nav class="pageNavigation">
        <div class="nextArrow" v-if="nextPages.length > 0">
            <div v-for="page in nextPages" :key="page.pageId">
                <p v-if="('pageId' in page && 'title' in page)">
                    &gt; <a v-if="isLeftPage" :href="nextUrl(page)" @click.prevent="resetScroll" class="tiltedArrow" >
                            <div class="notTiltedArrowLink">==&gt;⠀</div>
                            <div class="tiltedArrowLink">==&gt;</div>
                        </a>
                        <a v-else :href="nextUrl(page)" class="nextArrowLink" v-text="page.title" />
                </p>
            </div>
        </div>
        <div class="footerNav" >
            <ul class="navOptions">
                <li v-if="pageNumber.p !== '1'">
                    <a :href="startOverUrl" class="startOver">Start Over</a>
                </li>
                <li v-if="'previous' in thisPage">
                    <a :href="backUrl" :class="{goBack: isLeftPage}">Go Back</a>
                </li>
            </ul>
            <ul class="meta">
                <li v-if="'timestamp' in thisPage && !!getTimestamp()">
                    <div class="timestamp" v-html="this.getTimestamp()" />
                </li>
                <li>
                    <a class="vizLink" :href="vizLink" v-html="pageIdText" />
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name:"x2ComboNav",
    props: [
        'thisPage', 'nextPages'
    ],
    components: {
    },
    data() {
        return{
      
        }
    },
    computed: {
        isLeftPage(){
            return (parseInt(this.thisPage.pageId) % 2 == 0)
        },
        base(){
            return '/mspa'
        },
        backUrl() {
            let previousPage = this.isLeftPage ? this.thisPage.previous : this.$archive.mspa.story[this.thisPage.previous].previous

            if (this.$localData.settings.mspaMode){ // mspa mode
                return `${this.base}/${previousPage}`
            }
            else { // viz mode
                let id = this.$mspaToViz(previousPage)
                return `${id.s}/${id.p}`
            }
        },
        startOverUrl() {
            if (this.$localData.settings.mspaMode){ // mspa mode
                return `${this.base}/${this.$getStory(this.thisPage.pageId)}`
            }
            else { // viz mode
                return this.pageNumber.s
            }
        },
        pageNumber() {
            return this.$mspaToViz(this.thisPage.pageId)
        },
        pageIdText() {
            if (this.$localData.settings.mspaMode){ // mspa mode
                let id = this.thisPage.pageId
                return `${this.$getStory(id)}/${id}`
            }
            else { // viz mode
                let id = this.pageNumber
                return `${id.s}/${id.p}`
            }         
        },
        vizLink() {
            let story 
            if (this.pageNumber.s == 'homestuck') {
                story = isNaN(this.pageNumber.p) ? 'story/' : ''
            }
            else story = this.pageNumber.s + '/'
            return `https://homestuck.com/${story + this.pageNumber.p}` 
        }
    },
    methods: {
        resetScroll() {
            let key = this.$localData.tabData.activeTabKey
            document.getElementById(key).scrollTop = 0
            document.getElementById(key).scrollLeft = document.getElementById(key).scrollWidth
        },
        nextUrl(page) {
            if (this.$localData.settings.mspaMode){ // mspa mode
                return `${this.base}/${page.pageId}`
            }
            else { // viz mode
                let id = this.$mspaToViz(page.pageId)
                return `${id.s}/${id.p}`
            }
        },
        getTimestamp() {
            let date = new Date(parseInt(this.thisPage.timestamp) * 1000)
            let options = {timeZone: "America/New_York", timeZoneName:"short", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit",}
            let result = date.toLocaleDateString(undefined, options)
            return (result != "Invalid Date") ? result : undefined
        },
    }
}
</script>

<style scoped lang="scss">
    .nextArrow{
        margin: 0 0 30px 0;
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: x-large;
        font-weight: normal;
        color: var(--page-nav-divider);

        a {
            color: var(--page-links);
        }
        .tiltedArrow{
            display: inline-block;
            .notTiltedArrowLink {
                display: inline-block;
                text-decoration: underline;
            }
            .tiltedArrowLink {
                display: inline-block;
                text-decoration: underline;
                transform-origin: 0 100%;
                transform: rotate(-30deg);
                z-index: -1;
            }            
        }
    }
    .footerNav{
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        line-height: 10px;
        ul {
            list-style: none;
            font-size: 10px;
            font-family: Verdana, Arial, Helvetica, sans-serif;
            li {
                float: left;
                padding-bottom: 15px;
                * {display: inline-block;}
                &:not(:last-child):after {
                    content: "|";
                    margin: 0 0.3em
                }
            }
        }
        .navOptions {
            color: var(--page-nav-divider);

            a {
                color: var(--page-links);
            }
        }
        .meta {
            font-weight: 300;
            color: var(--page-nav-meta);
            a {
                color: var(--page-nav-meta);
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        }
    }
</style>

