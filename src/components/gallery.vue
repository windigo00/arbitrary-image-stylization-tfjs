<template>
  <div>
    <div class="d-flex flex-row">
      <div
        v-for="(item, k) in items"
        :key="k"
        class="p-0 item"
        :style="getStyle(k)"
      >
        <canvas
          :ref="'canvas_'+k"
          class="d-block h-100"
        />
      </div>
    </div>
    <div class="row">
      <slot />
      <!-- span
        style="float:left"
        class="ss-icon"
        @click="gallerySpin(1)"
      >
        &lt;
      </span>
      <span
        style="float:right"
        class="ss-icon"
        @click="gallerySpin(-1)"
      >
        &gt;
      </span -->
    </div>
  </div>
</template>
<script>
    export default {
        props: {
            items: { type: Array, default: null }
        },
        data() {
            return {
                selected: 0,
                angle: 0
            }
        },
        computed: {
            rotationStyle() {
                return {
//                    "-webkit-transform": `rotateY(${this.angle}deg)`,
//                    "-moz-transform": `rotateY(${this.angle}deg)`,
//                    transform: `rotateY(${this.angle}deg);`
                };
            },
            itemAngle() {
                return this.items.length ? 360/this.items.length : 0;
            }
        },
        watched: {
            items() {
                this.angle = 0;
            }
        },
        mounted(){
            this.updateImages();
        },
        updated(){
            this.updateImages();

        },
        methods: {
            updateImages() {
                for(var i = 0, max = this.items.length; i < max; i++) {
                    var canvas = this.$refs['canvas_'+i][0];
                    var image = this.items[i];
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvas.getContext('2d').putImageData(image, 0, 0);
                }
            },
            getStyle(idx) {
              idx;
                return {
//                    transform : `rotateY(${-idx*this.itemAngle}deg)`
                };
            },
            gallerySpin(direction) {
                this.angle += direction * this.itemAngle;
            }
        }
    }
</script>

<style scoped>

  .item {
      height: 5em;
      width: auto;
      display: inline-block;
  }

  /*
  div.carousel {
    -webkit-perspective: 1200px;
    perspective: 1200px;
    background: #050505ff;
    padding-top: 2em;
    padding-bottom: 3em;
    font-size: 0;
    height: 450px;
    overflow: hidden;
  }
  figure.spinner {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    height: 100%;
    -webkit-transform-origin: 50% 50% -400px;
    transform-origin: 50% 50% -400px;
    -webkit-transition: 1s;
    transition: 1s;
  }
  figure.spinner .item {
    width: 100%;
    max-width: 500px;
    position: absolute;
    left: 40%;
    -webkit-transform-origin: 50% 50% -400px;
    transform-origin: 50% 50% -400px;
    outline: 1px solid transparent;
  }

  div.carousel ~ span {
    color: #fff;
    margin: 5%;
    display: block;
    text-decoration: none;
    font-size: 2rem;
    -webkit-transition: 0.6s color;
    transition: 0.6s color;
    position: relative;
    margin-top: -13%;
    border-bottom: none;
    line-height: 0;
  }
  div.carousel ~ span:hover {
    color: #888;
    cursor: pointer;
  }
*/
</style>