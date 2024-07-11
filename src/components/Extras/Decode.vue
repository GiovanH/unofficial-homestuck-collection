<template>
  <GenericPage>
    <div class="pageContent" v-if="mode == 'morse'">
      <h2 class="pageTitle">Morse Decoder</h2>
      <Media url="/archive/collection/telegraphBlinker.gif"/>
      <div class="textContent">
        <p>Input:</p>
        <textarea placeholder="Enter morse to decode..." spellcheck="false" v-model="morseInput" />
        <p>Output:</p>
        <textarea disabled spellcheck="false" v-text="morseOutput"  />
      </div>
    </div>
    <div class="pageContent" v-else-if="mode == 'alternian'">
      <h2 class="pageTitle">Alternian Cheatsheet</h2>
      <Media url="archive/collection/alternianGuide.png"/>
    </div>
    <div class="pageContent" v-else-if="mode == 'damara'">
      <h2 class="pageTitle">Damara Megido Translated Dialogue</h2>
      <PageText v-for="log in $archive.mspa.damara" :content="log" :key="log.slice(0, 25)"/>
    </div>
    <div class="pageContent" v-else>
      <h2 class="pageTitle">Decoding Tools</h2>
      <div class="toolLinks">
        <div class="tool">
          <a href="/decode/morse">
            <Media url="/archive/collection/decode_morse.png" /><br>
            Morse Decoder
          </a>
        </div>
        <div class="tool">
          <a href="/decode/alternian" v-if="!$pageIsSpoiler('003890')">
            <Media url="/archive/collection/decode_alternian.png" /><br>
            Alternian Cheat Sheet
          </a>
          <span v-else>
            <Media url="/archive/collection/spoiler_medium.png" /><br>
            ??????<br>[Page {{$mspaOrVizNumber('003890')}}]
          </span>
        </div>

        <div class="tool">
          <a href="/decode/damaramegido" v-if="!$pageIsSpoiler('007298')">
            <Media url="/archive/collection/decode_damara.png" /><br>
            Damara Japanse Translations
          </a>
          <span v-else>
            <Media url="/archive/collection/spoiler_medium.png" /><br>
            ??????<br>[Page {{$mspaOrVizNumber('007298')}}]
          </span>
        </div>
      </div>
    </div>
  </GenericPage>
</template>

<script>
// @ is an alias to /src
import Media from '@/components/UIElements/MediaEmbed.vue'
import PageText from '@/components/Page/PageText.vue'
import GenericPage from '@/components/UIElements/GenericPage.vue'

export default {
  name: 'decode',
  props: [
    'tab', 'routeParams'
  ],
  components: {
    Media, PageText, GenericPage
  },
  title(ctx) {
    if (ctx.routeParams.mode) {
      if (ctx.routeParams.mode === 'morse') 
        return "Morse Decoder"
      else if (ctx.routeParams.mode === 'alternian') 
        return "Alternian Cheatsheet"
      else if (ctx.routeParams.mode === 'damaramegido') 
        return "Damara Megido Translated Dialogue"
    } else 
      return "Tools for Decodin'"
  },
  data: function() {
    return {
      morseInput: '',
      morseModel: {
        '.- ': 'A',
        '-... ': 'B',
        '-.-. ': 'C',
        '-.. ': 'D',
        '. ': 'E',
        '..-. ': 'F',
        '--. ': 'G',
        '.... ': 'H',
        '.. ': 'I',
        '.--- ': 'J',
        '-.- ': 'K',
        '.-.. ': 'L',
        '-- ': 'M',
        '-. ': 'N',
        '--- ': 'O',
        '.--. ': 'P',
        '--.- ': 'Q',
        '.-. ': 'R',
        '... ': 'S',
        '- ': 'T',
        '..- ': 'U',
        '...- ': 'V',
        '.-- ': 'W',
        '-..- ': 'X',
        '-.-- ': 'Y',
        '--.. ': 'Z',
        '----- ': '0',
        '.---- ': '1',
        '..--- ': '2',
        '...-- ': '3',
        '....- ': '4',
        '..... ': '5',
        '-.... ': '6',
        '--... ': '7',
        '---.. ': '8',
        '----. ': '9',
        '.-.-.- ': '.',
        '--..-- ': ',',
        '.----. ': '\'',
        '..--.. ': '?',
        '-.-.-- ': '!',
        '-..-. ': '/',
        '-.--. ': '(',
        '-.--.- ': ')',
        '.-... ': '&',
        '---... ': ':',
        '-.-.-. ': ';',
        '-...- ': '=',
        '.-.-. ': '+',
        '-....- ': '-',
        '..--.- ': '_',
        '.-..-. ': '"',
        '...-..- ': '$',
        '.--.-. ': '@',
        '/ ': ' '
      }
    }
  },
  computed: {
    mode() {
      if (!this.routeParams.mode) return false
      if (this.routeParams.mode === 'morse') return 'morse'
      else if (this.routeParams.mode == 'alternian') return 'alternian'
      else if (this.routeParams.mode === 'damaramegido') return 'damara'
      else return false
    },
    morseOutput() {
      let input = this.morseInput.concat(' ').replace(/[ \t]/g, ' =+=+=').replace(/\n/g, ' =+=+=\n=+=+=').split('=+=+=')
      let output = []
      for (let char of input) {
        if (char in this.morseModel) output.push(this.morseModel[char])
        else output.push(char)
      }
      return output.join('')
    }
  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
.toolLinks {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin: 0 auto;
  width: 600px;

  .tool {
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.1;
    font-size: 18px;
    width: 165px;
    img {
      display: block;
    }
  }
}

.textContent {
  margin-top: 15px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 15px;
  }

  textarea {
    width: 595px;
    max-width: 595px;
    height: 150px;
    resize: vertical;
    &:disabled {
      color: black;
      background: white;
    }
  }
}

::v-deep .subtitle {
  font-family: serif
}
</style>

