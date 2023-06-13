<template>
  <div class="fireflies" :class="{pixelated: $localData.settings.pixelScaling}">
    <canvas class="fbox fbox_0" :style="`top:${this.boxPos.top[0]}px; left:${this.boxPos.left[0]}px;`"></canvas>
    <canvas class="fbox fbox_1" :style="`top:${this.boxPos.top[1]}px; left:${this.boxPos.left[1]}px;`"></canvas>
    <canvas class="fbox fbox_2" :style="`top:${this.boxPos.top[2]}px; left:${this.boxPos.left[2]}px;`"></canvas>
    <canvas class="fbox fbox_3" :style="`top:${this.boxPos.top[3]}px; left:${this.boxPos.left[3]}px;`"></canvas>
  </div>
</template>

<script>
// Adapted from http://mspaintadventures.com/firefly.js
export default {
  name: 'firefly',
  props: [
    'tab'
  ],
  components: {
  },
  data: function() {
    return {
      fireflyInterval: undefined,
      boxPosIndex: 0,

      w: 200,           //  width of a canvas box
      h: 150,           //  height of a canvas box
      fmax: 24,         //  the maximum number of frames in the animated .gif file
      radius: 60,       //  collision size to check hitting box edge.  Smaller= closer to edge, Larger = further away from edges
      bounceFactor: 1,  //  smooth animation... movement moves at 1 point a second.  Increasing will make item move faster
      fpsrate: 15,      //  Change Frames Per Second Rate.  Determines whole screen refreshing rate (lower = slower, higher = faster)
      boxnum: 4,        //  IMPORTANT ==== Contains the number of <canvas> animation boxes you want on screen.
                        //  boxnum was equal the same number of <canvas id="fbox_1", "fbox_2", etc..> boxes you have in your HTML page.
                        //  Any missing boxes or skipping numbers will break the display.

      cobj: [],   //  object storing the 'canvas' playground box
      beer: [],   //  Bee Right-  facing image container for a <CANVAS>
      beel: [],   //  Bee Left- facing image container for a <CANVAS>
      sbeer: [],  //  Bee Right-  Storage container to hold IMG source name for a <CANVAS> - to transfer info to object
      sbeel: [],  //  Bee Left- Storage container to hold IMG source name for a <CANVAS> - to transfer info to object

      firefly: {} // BUILD object to hold all 'firefly' instances
    }
  },
  computed: {
    xx() {
     return this.w - 60  // x adjustment for placing firefly xcoord so it is not outside box
    },
    yy() {
      return this.h - 60  // y adjust for placing firefly ycoord so it is not outside box
    },
    boxPos(){
      let positions = [ 
        { top: [ 200, 600,  50, 500 ], left: [ -300, -100, 400, 700 ] },
        { top: [ 400,   0, 600,  50 ], left: [ -150,  -50, 300, 650 ] }, 
        { top: [ 500, 200, 350,   0 ], left: [ -250, -150, 575, 750 ] },
        { top: [  50, 400,  25, 250 ], left: [ -200,  -50, 300, 600 ] },
        { top: [ 650,  50, 500, 300 ], left: [ -100, -100, 450, 750 ] }
      ]
      return positions[this.boxPosIndex]
    }
  },
  methods: {

    shuffleBoxPositions() {
      let prev = this.boxPosIndex
      do {
        this.boxPosIndex = Math.floor(5 * Math.random())
      } while (this.boxPosIndex == prev)
    },

    randnum(nmin, nmax, nmod) {
      return ((Math.floor(Math.random() * (nmax - nmin + 1)) + nmin) + nmod)
    },

    // FUNCTION - CLEAR canvas screen.
    // Erases content of box before new updated motions are 'drawn' - IMPORTANT do not erase
    clearCanvas(i) {
      this.cobj[i].clearRect(0, 0, this.w, this.h)
    },

    //  ANIMATION function - go move RIGHT
    drawFirefly(i){
      this.cobj[i].save()
      if (this.firefly[i].frame > this.firefly[i].framemax) {
        this.firefly[i].frame = 0
        this.firefly[i].delay = 1
        this.firefly[i].delaytick = 0 
      }
      this.firefly[i].tx = this.firefly[i].frame * this.firefly[i].imgw     //  moves animation block to next frame on sprite sheet
      this.cobj[i].drawImage(
        !!this.firefly[i].dir ? this.beer[i] : this.beel[i],
        this.firefly[i].tx,
        0,
        this.firefly[i].imgw,
        this.firefly[i].imgh, //  DISPLAY Bee Right image anim
        this.firefly[i].x,
        this.firefly[i].y,
        this.firefly[i].imgw,
        this.firefly[i].imgh
      )
      if (this.firefly[i].delay){
        this.firefly[i].delaytick++
        if (this.firefly[i].delaytick > this.fpsrate){
          this.firefly[i].delay = 0
          this.firefly[i].delaytick = 0
        }
      } 
      else {
        this.firefly[i].frame++ //  move to next animation frame
      }
      this.cobj[i].restore()  //  done updating the canvas-  close task!
    },

    //  ANIMATE all the FIREFLY boxes function
    updateFirefly(){
      for (var i = 0; i < this.boxnum; i++) {   //  CYCLE through all canvas boxes you want - use BOXNUM variable
        this.clearCanvas(i)           //  Clear canvas screen before showing new animation content
        this.drawFirefly(i)
        // Now, lets make the firefly move to a new position
        this.firefly[i].y += this.firefly[i].yvel
        this.firefly[i].x += this.firefly[i].xvel

        // EDGE collision check - TOP BOX COLLISION
        if (this.firefly[i].y - this.radius < -60) {
          this.firefly[i].y += this.firefly[i].yvel * -this.bounceFactor
          this.firefly[i].yvel = this.randnum(1, 2, 1)
        }
        // EDGE collision check - RIGHT BOX COLLISION
        if (this.firefly[i].x + this.radius > this.w) {
          this.firefly[i].dir = 0 // change firefly facing direction
          this.firefly[i].x = this.w - this.radius
          this.firefly[i].xvel = this.randnum(1, 2, 1) * -this.bounceFactor
        }
        // EDGE collision check - BOTTOM BOX COLLISION
        if (this.firefly[i].y + this.radius > this.h) {
          this.firefly[i].y = this.h - this.radius
          this.firefly[i].yvel = this.randnum(1, 2, 1) * -this.bounceFactor
        }
        // EDGE collision check - LEFT BOX COLLISION
        if (this.firefly[i].x - this.radius < -60) {
          this.firefly[i].dir = 1 // change firefly facing direction
          this.firefly[i].x += this.firefly[i].xvel * -this.bounceFactor
          this.firefly[i].xvel = this.randnum(1, 2, 1)
        }
      }
    }
  },
  mounted() {
      //  START BUILDING ALL NEEDED firefly objects
      for (let x = 0; x < this.boxnum; x++) {
        let sname = document.getElementById(this.tab.key).getElementsByClassName('fbox_' + x)[0]  //  Get the ID or name of canvas object
        sname.width = this.w    //  FORCE canvas block to be a specific width size
        sname.height = this.h   //  FORCE canvas block to be a specific height sizthis.e

        let tname = sname.getContext('2d')  //  Attach the full 'canvas' controls to make it work
        this.cobj.push(tname) // The Object ID container for a specific <canvas> box

        //  Create needed images! - R and L facing types (BEER - right, BEEL - left)
        this.sbeer.push(this.$getResourceURL("images/firefly_sprite_opt.png"))
        this.sbeel.push(this.$getResourceURL("images/firefly_sprite_left_opt.png"))

        // IMAGE LOADER function - need to load the image to the canvas block so it will be seen
        // IMG Loader = handles setting up both 'Right' facing and 'Let' facing image animates for each canvas block
        // IMG not loaded = you will not see anything.
        this.beer[x] = new Image()
        this.beel[x] = new Image()
        this.beer[x].src = this.sbeer[x]
        this.beel[x].src = this.sbeel[x]

        //  CREATE a FIREFLY object to store its personality or specifics -  IMPORTANT.
        //    This OBJECT allows to control and maintain large numbers of entities and makes programming simpler to maintain  
        this.firefly[x] = {
          dir: this.randnum(0, 1, 0), //  random num from 0 to 1 (0 = move left, 1 = move right)
          x: this.randnum(0, this.xx, 0), //  place img random x coord
          y: this.randnum(0, this.yy, 0), //  place img random y coord
          xvel: this.randnum(0, 3, 1),  //  xmovement velocity
          yvel: this.randnum(0, 3, 1),  //  ymovement velocity
          imgw: 60, //  img width
          imgh: 60, //  img height
          frame: this.randnum(0, this.fmax, 0), //  animation frame to start from- usually 0
          tick: this.randnum(0, this.fmax, 0),  //  anim frame counter... each number is a frame in img animation
          tx: 0,    //  temporary x value to track which anim frame is viewed
          framemax: 12, //  max number of animation frames in img (firefly = 24 frames).  Stack always starts at 0 so minus 1!
          delay: 0, //  delay flag to stop gif/sprite animation before repeating cycle
          delaytick: 0  // stores the delay counter
        }
      }
      this.fireflyInterval = setInterval(this.updateFirefly, 1000/this.fpsrate)
      this.shuffleBoxPositions()
  },
  beforeDestroy() {
    clearInterval(this.fireflyInterval)
  },
  watch: {
    'tab.url'(){
      this.shuffleBoxPositions()
    }
  }
}
</script>

<style scoped lang="scss">
.fireflies {
  position: relative;
  width: 714px;
  margin-left: auto;
  margin-right: auto;
  .fbox {
    z-index: 5;
    position: absolute;
    height: 150px;
    width: 200px;
  }  
}

</style>

