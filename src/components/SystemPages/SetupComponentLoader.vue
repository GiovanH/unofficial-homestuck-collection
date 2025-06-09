<template>
  <div class="loadcard">
    <svg class="spiro" xmlns:xlink="http://www.w3.org/1999/xlink" height="520px" width="520px" xmlns="http://www.w3.org/2000/svg" viewBox="-260 -260 520 520">
      <g>
        <g id="halfSpiro" v-for="c in ['left', 'right']" :class="c" :key="c">
          <path id="thePath" :d="spiroPos[spiroTestindex]">
            <animate v-if="spiroTestAnimate"
              attributeName="d"
              :values="spiroPosDoubled.join('; \n')"
              :keyTimes="Array.from(spiroPosDoubled, (_, i) => (i/(spiroPosDoubled.length - 1)).toFixed(2)).join(';')"
              dur="5.5s" begin="0s" repeatCount="indefinite" />
          </path>
          <use href="#thePath"
            v-for="n in 9"  :key="`p${n}`"
            :style="{transform: `rotate(${(n) * (360/10)}deg)`}"/>
        </g>
      </g>
    </svg>
    <p v-text="loadText"></p>
  </div>
</template>

<script>

export default {
  name: 'SetupComponentLoader',
  data: function() {
    return {
      spiroTestindex: 0,
      spiroTestAnimate: true,
      loadStages: {
        "": "Awaiting reactivity",
        "MOUNTED": "Entangling connections",
        "GUESTLOADING": "Skipping to the trolls",
        "WAITING_ON_DATA": "Demanding firehose",
        "ARCHIVE": "Raking filesystem",
        "MODS": "Turbulating canon",
        "PATCHES": "Applying spackle",
        "LOADED_ARCHIVE_VANILLA": "Deferring responsibility",
        "EXTRACT_IMODS": "Applying day-one patch",
        "READ_MODS": "Indexing paraphernalia",
        "BAKE_ROUTES": "Convoluting routing table",
        "MODS_DONE": "Disparaging EMCAScript"
      },
      spiroPos: [
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-6.5  -81.8  Q-20.9  -10.45  -84.5  -1.35  -148.1  7.8    -186.1  -45.15 -224.1  -98.05  -206.4  -156.1  -188.7  -214.1  -203.4  -275",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-25.5 -140.3 Q-63.3  -95.15  -103.9 -78.9  -144.45 -62.65 -181.9  -84.3  -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3",
        "M-14.0 -102.8 Q-64.65 -101.15 -107.4 -66.9  -150.1  -32.65 -184.75 -69.3  -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M8.0   -40.3  Q-4.85  -7.45   -74.5  -1.35  -138.15 7.8    -181.15 -49.15 -224.1  -98.05  -218.0  -150.1  -217.9  -214.1  -144.95 -228.3",
        "M4     -57    Q-9.8   -6.3    -67.5  1.3    -125.2  8.95   -120.8  -53.7  -116.4  -116.35 -166.0  -165.25 -215.6  -214.15 -180.45 -260",
        "M-8.0  -88.3  Q-9.8   -6.3    -72.15 2.85   -134.45 12.0   -172.5  -21.9  -210.5  -55.75  -210.9  -123.3  -211.25 -190.8  -160.45 -239.8",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3",
        "M-47.0 -215.3 Q-40    -70     -95.5  -36.35 -138.15 -17    -185.15 -52.15 -229.1  -100.05 -221.0  -156.1  -217.9  -214.1  -164.95 -245.3",
        "M-24.0 -135.3 Q-20    -60     -80.5  -36.35 -138.15 -17    -185.15 -52.15 -229.1  -100.05 -207.0  -146.1  -187.9  -196.1  -114.95 -205.3",
        "M-0.0  -71.3  Q-10.85 -10.45  -74.5  -1.35  -138.15 7.8    -181.15 -45.15 -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3"
      ]
// cat * | grep "<path d" | sed -E "s/.+?d=\"([^\"]+?)\".+/\"\1\",/g" | sed -E 's/([A-Z ])-([0-9])/\1_\2/g' | sed -E 's/([A-Z ])([0-9])/\1-\2/g' | sed -E 's/([A-Z ])_([0-9])/\1\2/g'
    }
  },
  computed: {
    loadText() {
      if (this.$root.loadStage === undefined) {
        return this.loadStages[""]
      } else if (this.loadStages[this.$root.loadStage]) {
        return this.loadStages[this.$root.loadStage]
      } else {
        this.$logger.warn("Missing label for load stage", this.$root.loadStage)
        return this.$root.loadStage
      }
    },
    spiroPosDoubled(){
      return this.spiroPos.reduce((acc, i) => [...acc, i, i], [])
    },
  },
  mounted() {

  },
  methods: {
  },
  watch: {
  }
}
</script>

<style lang="scss">
div.loadcard {
  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, .7));
  cursor: wait;
}
.loadcard {

  text-align: center;
  margin: auto;

  padding-bottom: 1em;

  p {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 16px;
    color: white;

    text-align: center;
    font-weight: bold;
    text-shadow: 1px 1px 0px black;
  }

  svg.spiro {
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    animation-name: spin;
    animation-duration: 8000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    > g {
    // container
      transform: translate(0, 145px);
      > g { // Spirograph half
        height: 520px;
        width: 520px;
        stroke: rgb(56, 244, 61);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 8;
        fill: transparent;
        &.left {
          transform: translate(24px, 0);
        }
        &.right {
          transform: translate(-24px, 0) scale(-1, 1);
        }
        path, use {
          transform-origin: -24px -145px;
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),

          &:nth-child(8),
          &:nth-child(9),
          &:nth-child(10) {
            display: none;
            display: inherit;
          }
        }
      } // end half
    }
  } // end svg
}
</style>