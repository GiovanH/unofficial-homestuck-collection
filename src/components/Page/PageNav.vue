<template>
    <nav class="pageNavigation">
        <div class="nextArrow" v-if="nextPages.length > 0">
            <div v-for="page in nextPages" :key="page.pageId">
                <p v-if="('pageId' in page && 'title' in page)">
                    &gt; <a :href="nextUrl(page)" class="nextArrowLink" v-text="page.title" />
                </p>
            </div>
        </div>
        <div class="footerNav" >
            <ul class="navOptions">
                <li v-if="pageNumber.p !== '1'">
                    <a :href="startOverUrl" class="startOver">Start Over</a>
                </li>
                <li v-if="'previous' in thisPage">
                    <a :href="backUrl" class="goBack">Go Back</a>
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
const { DateTime } = require('luxon');
export default {
    name: 'pageNav',
    props: [
        'thisPage', 'nextPages', 'isRyanquest'
    ],
    components: {
    },
    data() {
        return{
        }
    },
    computed: {
        mspaBase(){
         return this.isRyanquest ? 'ryanquest' : 'mspa'
        },
        backUrl() {
            if (this.$localData.settings.mspaMode){ //mspa mode
                return `${this.mspaBase}/${this.thisPage.previous}`
            }
            else { //viz mode
                let id = this.$mspaToViz(this.thisPage.previous, this.mspaBase == 'ryanquest')
                return `${id.s}/${id.p}`
            }
        },
        startOverUrl() {
            if (this.$localData.settings.mspaMode){ //mspa mode
                return `${this.mspaBase}/${this.$getStory(this.thisPage.pageId)}`
            }
            else { //viz mode
                return this.pageNumber.s
            }
        },
        pageNumber() {
            if (this.mspaBase == 'ryanquest') return {s: 'ryanquest', p: parseInt(this.thisPage.pageId)}
            else return this.$mspaToViz(this.thisPage.pageId)
        },
        pageIdText() {
            if (this.$localData.settings.mspaMode){ //mspa mode
                let id = this.thisPage.pageId
                let story = (this.mspaBase == 'ryanquest') ?  'ryanquest' : this.$getStory(id)
                return `${story}/${id}`
            }
            else { //viz mode
                let id = this.pageNumber
                return `${id.s}/${id.p}`
            }            
        },
        vizLink() {
            let story 
            if (this.pageNumber.s == 'homestuck') story = 'story/'
            else story = this.pageNumber.s + '/'
            return `https://homestuck.com/${story + this.pageNumber.p}` 
        }
    },
    methods: {
        nextUrl(page) {
            if (this.$localData.settings.mspaMode){ //mspa mode
                return `/${this.mspaBase}/${page.pageId}`
            }
            else { //viz mode
                let id = this.$mspaToViz(page.pageId, this.mspaBase == 'ryanquest')
                return `/${id.s}/${id.p}`
            }
        },
        getTimestamp() {
            // let date = new Date(parseInt(this.thisPage.timestamp) * 1000)
            // let options = {timeZone: "America/New_York", timeZoneName:"short", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit",}
            // let result = date.toLocaleDateString(undefined, options)
            if (!this.thisPage.timestamp) {
                return undefined
            } else {
                return DateTime.fromSeconds(Number(this.thisPage.timestamp))
                    .setZone("America/New_York")
                    .toFormat("MM/dd/yyyy, ttt")
            }
            return (result != "Invalid Date") ? result : undefined
        }
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

