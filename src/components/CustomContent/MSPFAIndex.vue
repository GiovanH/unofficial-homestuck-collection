<template>
  <GenericPage>
    <h2 class="pageTitle">MS Paint Fan Adventures</h2>
    <div class="adventureLinks">
      <div class="adventure" v-for="advlink in mspfaLinks" :key="advlink.href">
        <a :href="advlink.href" class="icon">
          <MediaEmbed :url="advlink.img" />
          <span v-text="advlink.label" />
          <span class="date">{{ datestr(advlink) }}</span>
          <span class="date">{{ advlink.pageCount }} pages</span>
        </a>
      </div>
    </div>
  </GenericPage>
</template>

<script>
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import GenericPage from '@/components/Template/GenericPage.vue'

const DateTime = require('luxon').DateTime

export default {
  name: 'MSPFALog',
  props: [
  ],
  components: {
    GenericPage, MediaEmbed
  },
  data: function() {
    return { }
  },
  computed: {
    mspfaLinks(){
      return (Object.keys(this.$archive.mspfa) || []).map(k => {
        const story = this.$archive.mspfa[k]
        return {
          href: `/mspfa/${k}/`,
          img: story.o || "assets://images/mspalogo_mspa.png",
          label: story.n,
          startDate: DateTime.fromMillis(story.d).setZone("America/New_York"),
          updatedDate: DateTime.fromMillis(story.u).setZone("America/New_York"),
          status: ['Inactive', 'Ongoing', 'Complete'][story.h - 1],
          pageCount: story.p.length
        }
      })
    }
  },
  methods: {
    datestr(advlink){
      const start_str = advlink.startDate.toFormat('LLL yyyy')
      const updated_str = (advlink.status == 'Ongoing') ? '' : advlink.updatedDate.toFormat('LLL yyyy')
      if (start_str == updated_str) {
        return start_str
      } else {
        return `${start_str} - ${updated_str}`
      }
    }
  }
}
</script>

<style scoped lang="scss">
  a.icon {
    text-align: center;
    text-decoration: none;
    > span {
      display: block;
      text-decoration: underline;
    }

    .date {
      padding-top: 5px;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      font-weight: normal;
      color: var(--page-nav-meta);
      font-size: 12px;
      text-decoration: none;
    }
  }

  h2.pageTitle {
    max-width: 590px;
    text-align: center;
    line-height: 1.1;
    font-size: 32px;
    padding: 15px 0;
    margin: 0 auto;
  }
  .adventureLinks {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    margin: 0 auto;
    width: 600px;

    .adventure {
      margin-bottom: 20px;
      text-align: center;
      line-height: 1.1;
      font-size: 18px;
      width: 200px;
      img {
        object-fit: contain;
        width: 164px;
        height: 164px;
        display: inline-block;
      }
    }
  }
</style>
