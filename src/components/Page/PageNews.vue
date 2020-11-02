<template>
    <div class="newsBody">
    <div class="news">
        <Media class="logo" :url="newsLogo" />
        <div v-if="tumblr">
            Latest Tumblr post: <a :href="tumblr.link">{{tumblr.formattedDate}}</a>
        </div>
        <div v-if="formspring">
            Latest Formspring answer: <a :href="formspring.link">{{formspring.formattedDate}}</a>
        </div>
        <div v-if="blogspot">
            Latest Blogspot post: <a :href="blogspot.link">{{blogspot.title}}</a>
        </div>
        <div v-for="post in newsposts" v-html="post.html" :key="post.id"><br><br></div>
    </div>
    </div>
</template>


<script>
import Media from '@/components/UIElements/MediaEmbed.vue'

export default {
    name: 'pageNews',
    components: {
        Media
    },
    props: [
        'thisPage'
    ],
    data() {
        return{}
    },
    computed: {
        newsLogo() {
            return this.$root.theme === 'A6A6'       ? '/images/a6a6_news.png' :
                   this.$root.theme === 'scratch'
                   || this.$root.theme === 'sbahj'   ? '' :
                   this.$root.theme === 'retro'      ? 'images/retro_news.gif' :
                   this.$root.theme === 'pxs'        ? 'images/pxs_news.png' :
                                                       '/images/news.png'
        },
        newsposts() {
            let yesterday = this.thisPage.timestamp * 1 - 60 * 60 * 24
            let prevNewsposts = []
            for (let year in this.$archive.social.news)
                for (let post of this.$archive.social.news[year])
                    if (yesterday > post.timestamp)
                        prevNewsposts.push(post)
            prevNewsposts.sort((a, b) => b.timestamp - a.timestamp)
            prevNewsposts = prevNewsposts.slice(0, 4)
            return prevNewsposts
        },
        blogspot() {
            let yesterday = this.thisPage.timestamp * 1 - 60 * 60 * 24
            for (let blog of this.$archive.social.blogspot)
            {
                if (!blog.timestamp) // if user has old version of the archive
                    return null
                else if (blog.timestamp < yesterday)
                {
                    return {
                        link: "/blogspot/" + blog.id,
                        title: blog.title
                    }
                }
            }
            return null
        },
        formspring() {
            let yesterday = this.thisPage.timestamp * 1 - 60 * 60 * 24
            let latestPost = null;
            for (let account in this.$archive.social.formspring)
                for (let post of this.$archive.social.formspring[account])
                    if (post.timestamp < yesterday && !(latestPost && latestPost.timestamp > post.timestamp))
                        latestPost = post
            if (!latestPost)
                return null
            else {
                return {
                    link: "/formspring/" + latestPost.id,
                    formattedDate: new Date(latestPost.timestamp * 1000).toDateString()
                }
            }
        },
        tumblr() {
            let yesterday = this.thisPage.timestamp * 1 - 60 * 60 * 24
            let latestPost = null;
            for (let post of this.$archive.social.tumblr)
                if (post.timestamp < yesterday && !(latestPost && latestPost.timestamp > post.timestamp))
                    latestPost = post
            if (!latestPost)
                return null
            else {
                return {
                    link: "/tumblr/" + latestPost.id,
                    formattedDate: new Date(latestPost.timestamp * 1000).toDateString()
                }
            }
        }
    },
    methods: {
    },
    updated(){
        this.$filterLinksAndImages(this.$el.querySelector('.news'))
    },
    mounted(){
        this.$filterLinksAndImages(this.$el.querySelector('.news'))
    }
}
</script>

<style lang="scss" scoped>
    .newsBody { // these rules keep it centered on x2 combo pages
        display: flex;
        flex-flow: column;
        align-items: center;
        align-self: center;
    }
    .sbahj .logo::before {
        content: "NEWNS";
        font-size: 24px;
    }
    .news {
        background: var(--page-news);
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 12px;
        font-weight: normal;
        text-align: justify;
        align-items: normal;

        display: flex;
        flex-flow: column;
        flex: 1 0 auto;
        img {
            align-self: center;
            max-width: 100%;
            object-fit: contain;
        }

        width: 420px; // dude weed lmao
        padding-left: 25px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 20px;

        margin: 10px;
    }
    div::v-deep .date.link {
        font-style: italic;
        ::before {
            content: "Posted on ";
        }
        margin-top: 30px;
        padding-bottom: 3px;
        border-bottom: 1px solid rgb(211, 211, 211);
        margin-bottom: 7px;
    }
    div::v-deep a {
        color: var(--page-links);
    }
    .A6A6 div::v-deep {
        color: #000000;
    }
</style>