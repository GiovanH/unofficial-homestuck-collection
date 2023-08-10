module.exports = {
  title: "shhhh", 
  summary: "it's a secret",
  author: "GiovanH",
  modVersion: 0.1,
  vueHooks: [
  {
    matchName: "unlock",
    mounted() {
      this.$nextTick(__ => {
        const codemachine = this.$refs['codemachine'].$el
        codemachine.style.cursor = "help"
        codemachine.contentEditable = true // focus hack
        codemachine.addEventListener('keydown', (event) => {
          if (event.code == "KeyT" && event.ctrlKey) {
            this.$openLink(window.location.host + "/page/c=%3F%3F%3F/m=assets%3A%2F%2Fp8%2Fwalkabout.html/")
          }
          event.stopPropagation()
          event.preventDefault()
        })
      })
    }
  },
  {
    matchName: "MediaEmbed",
    data: {
      indexedFlashProps($super){
        $super["walkabout"] = {width: 520, height: 544}
        $super["repl"] = {width: 520, height: 544}
        return $super
      }
    },
    computed: {
      frameType($super) {
        if (this.url == 'p8/walkabout.html' || this.url == 'p8/repl.html') return "webview"
          else return $super()
        }
    },
    methods: {
      initHtmlFrame(event, $super){
        $super(event)
        this.$logger.info(this.url)
        if (this.url == 'p8/walkabout.html' || this.url == 'p8/repl.html') {
          event.srcElement.addEventListener("console-message", (event) => {
            if (event.message.startsWith('GPIO:')) {
              data = JSON.parse(event.message.slice(5))
              console.log(data)
              if (data['0'] == 1) {
                this.$pushNotif({
                  title: 'Secret',
                  desc: "Thank you so much for a' playing my game.",
                  thumb: 'assets://p8/notif.png'
                })
              }
            }
          })
          event.srcElement.executeJavaScript(`
            var gpio = getP8Gpio();
            var unsubscribe = gpio.subscribe(function(indices) {
              console.log(
              'GPIO:' + JSON.stringify(indices.reduce(
              function(a, i) { a[i]=gpio[i]; return a }, {}
              ))
              )
            });
          `)
        }
      }
    }

  }],
  trees: {
    "./": "assets://p8/"
  }
}
