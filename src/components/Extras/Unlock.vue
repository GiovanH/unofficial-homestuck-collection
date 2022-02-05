<template>
  <div class="pageBody customStyles">
    <NavBanner useCustomStyles="true" />
    <div class="pageFrame">
      <div class="pageContent">
        <MediaEmbed url="images/v2_biglogo.gif" class="logo"/>
          <h1>UNLOCKABLE CONTENT</h1>
          <MediaEmbed url="images/unlock_gamecode.gif" />
          <div class="unlocklist text">
            <p>CONGRATULATIONS!!!<br><br>You have entered a valid GAME CODE and unlocked some exciting <strong>FAN-REQUESTED GAME COMMANDS!</strong> These were drawn and posted for fans who made <strong>DONATIONS!</strong></p>
            <br />

            <ol>
              <li v-for="page in filteredCommands" :key="page.url">
                <a :href="page.url">{{page.command}}</a>
              </li>
              <li v-if="keepReading">Keep reading to unlock more extras!</li>
            </ol>
          </div>
          <MediaEmbed url="images/unlock_codemachine.gif" ref="codemachine" />
          <div class="text">
            <p> The CODE MACHINE awaits additional GAME CODES to unlock more mysterious secrets! </p>
          </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBanner from '@/components/UIElements/NavBanner.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'
import PageFooter from '@/components/Page/PageFooter.vue'

export default {
  name: 'unlock',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    NavBanner, MediaEmbed, PageFooter
  },
  title: (ctx) => "Unlockable Content",
  theme: () => 'retro',
  data: function() {
    return {
    }
  },
  computed: {
    fan_commands(){
      return this.$archive.extras.fan_commands
    },
    filteredCommands(){
      return this.fan_commands.filter(page => {
        if (page.unlock_page && this.$pageIsSpoiler(page.unlock_page)) return false
        if (page.unlock_timestamp && this.$timestampIsSpoiler(page.unlock_timestamp)) return false
        return true
      })
    },
    keepReading(){
      return (this.fan_commands.length > this.filteredCommands.length)
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    flex: 1 0 auto;
    align-items: center;

    > img {
      align-self: center;
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;

      flex: 0 1 auto;
      display: flex;
      justify-content: center;
      .pageContent {
        background: var(--page-pageContent);
        
        padding-bottom: 25px;
        max-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;
        .logo {
          padding-bottom: 10px;
          background-color: #EEEEEE;
        }
        h1 {
          font-size: 32px;
        }
        .text {
          width: 600px;
          background-color: white;
          font-family: Verdana, Arial, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: normal;
          padding-bottom: 10px;
          text-align: center;

          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
        }

        .unlocklist ol {
          list-style: none;
          li {
            margin-bottom: 1em
          }
        }
      }
    }
  }

</style>
