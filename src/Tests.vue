<template>
  <div>
    aaaaaaaaaaa
    <img
      ref="test_2"
      src="images/beach.jpg"
    >
    <canvas ref="test_1" />
  </div>
</template>

<script>
  import WorkerFactory from './lib/WorkerFactory';

  export default {
      data() {
        return {
          wut: null, //worker under test
        };
      },

      mounted() {
        var that = this;
        this.testSamplerInit()
            .then(e => {
                that.testSamplerRender()
                .then(e => {
                  that.wut.terminate();
                  that.testDnn();
                  console.log(e)
                })
                .catch(console.log);
                console.log(e);
            });
      },

      destroyed() {

      },

      methods: {
        testSamplerInit() {
          this.wut = WorkerFactory.getWorker('sampler');
          var canvas = this.$refs.test_1.transferControlToOffscreen();
          return this.wut.postMessage('init', {canvas: canvas}, [canvas]).catch(console.log);
        },

        testSamplerRender() {
            return Promise.all([
                createImageBitmap(this.$refs.test_2)
            ]).then((event) => {
                return this.wut.postMessage('render', {
                    image: event[0],
                    square: false,
                    size: 123,
                    smooth: false
                }).then(() => {
                    this.wut.terminate();
                });

            });
        },

        testDnn() {
          this.wut = WorkerFactory.getWorker('dnn');
          return this.wut.postMessage('style', {})
              .then(() => {
                  this.wut.terminate();
              });
        }
      }
  }
</script>
