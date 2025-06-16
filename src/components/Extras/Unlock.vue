<template>
  <GenericPage logo="images/v2_biglogo.gif">
    <h1>UNLOCKABLE CONTENT</h1>
    <MediaEmbed url="images/unlock_gamecode.gif" />
    <div class="unlocklist text">
      <p>CONGRATULATIONS!!!<br><br>You have entered a valid GAME CODE and unlocked some exciting <strong>FAN-REQUESTED GAME COMMANDS!</strong> These were drawn and posted for fans who made <strong>DONATIONS!</strong></p>
      <br />
      <ol>
        <li v-for="page in filteredCommands" :key="page.url">
          <a :href="page.url" v-html="page.command" />
        </li>
        <li v-if="keepReading">Keep reading to unlock more extras!</li>
      </ol>
    </div>
    <MediaEmbed url="images/unlock_codemachine.gif" ref="codemachine" />
    <div class="text">
      <p> The CODE MACHINE awaits additional GAME CODES to unlock more mysterious secrets! </p>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import GenericPage from '@/components/Template/GenericPage.vue'
import MediaEmbed from '@/components/UIElements/MediaEmbed.vue'

export default {
  name: 'unlock',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    MediaEmbed, GenericPage
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

</style>
