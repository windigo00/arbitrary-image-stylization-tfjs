<template>
  <div
    v-show="image"
  >
    <canvas
      ref="output"
      :class="samplerClass"
    />
  </div>
</template>

<script>
    import WorkerFactory from '../../lib/worker_factory';

    export default {
        name: 'ImageSampler',
        props: {
            image: {
                type: HTMLImageElement,
                    default: null
                },
                size: {
                    type: Number,
                    default: 0
                },
                smooth: {
                    type: Boolean,
                    default: false
                },
                square: {
                    type: Boolean,
                    default: false
                }
            },

            data() {
                return {
                };
            },

            computed: {
                samplerClass() {
                    return {
                        image: true,
                        centered: true,
                        pixelated: !this.smooth
                    }
                }
            },

            watch: {
                image() {
                    this.$forceUpdate();
                },
                size() {
                    this.$forceUpdate();
                },
                smooth() {
                    this.$forceUpdate();
                },
                square() {
                    this.$forceUpdate();
                }
            },

            created() {
                this.imageProcessed = null;
                this.offscreenWorker = WorkerFactory.getWorker('sampler', this.handleMessage, this.errorMessage);
            },

            mounted() {

                if (!('transferControlToOffscreen' in this.$refs['output'])) {
                    throw new Error('webgl in worker unsupported');
                }

                if (!this.imageProcessed) {
                    this.imageProcessed = this.$refs['output'].transferControlToOffscreen();
                    this.offscreenWorker.post('init', this.imageProcessed, [this.imageProcessed]);
                }

            },
            updated() {
                this.prepareImage();
            },
            destroyed() {
                if (this.offscreenWorker) {
                  this.offscreenWorker.terminate();
                  this.offscreenWorker = null;
                }
                this.imageProcessed = null;
            },

            methods: {

              handleMessage(e) {
                  switch (e.data.event) {
                      case 'change':
                          this.$emit('change', e.data.image);
                          break;

                      case 'error':
                          this.$emit('error', e.data);
                      break;
                  }
              },

              errorMessage(e) {
                  this.$emit('message', e.data);
              },

              async prepareImage() {
                  this.processImage(this.image);
              },

              processImage() {
                  if (!this.image) {
                      return;
                  }
                  if (!this.image.width) {
                      return;
                  }

                  Promise.all([
                      createImageBitmap(this.image)
                  ]).then(this.renderImage.bind(this))

              },

              renderImage(event) {
                  this.offscreenWorker.post('render', {
                      image: event[0],
                      square: this.square,
                      size: this.size,
                      smooth: this.smooth
                  });
              }
          }
      }
</script>
